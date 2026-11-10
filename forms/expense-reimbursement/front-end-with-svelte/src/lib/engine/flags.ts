import type { ExpenseReimbursement, Flag } from './types.js';
import { POLICY, PERSONAL_PATTERN, daysBetween, isNum, label, usedItems } from './rules.js';

// Fraud-prevention and policy flag detection for the Expense Reimbursement
// engine.
//
// Pure function returning flags using the grade_flag categories from SQL
// migration 08: missing-receipt, duplicate-suspected, over-limit,
// stale-expense, no-prior-approval, no-declaration, foreign-currency,
// alcohol-or-personal, other.
//
// Each flag is { flagId, category, priority, description, suggestedAction }.
// Flag IDs are stable and identical across every front-end and the back-end.

/**
 * Detect fraud-prevention and policy flags for a claim.
 *
 */
export function detectFlags(data: ExpenseReimbursement): Flag[] {
  const flags: Flag[] = [];
  const items = usedItems(data);
  const claimCurrency = data.claim.currency || 'GBP';

  for (const item of items) {
    const amt = isNum(item.amount) ? item.amount : 0;

    if (
      amt > POLICY.receiptRequiredOver &&
      item.receiptAttached !== true &&
      item.receiptMissingReason.trim() === ''
    ) {
      flags.push({
        flagId: `F-MISSING-RECEIPT-${item.lineNumber}`,
        category: 'missing-receipt',
        priority: amt > POLICY.priorApprovalRequiredOver ? 'high' : 'medium',
        description: `${label(item)} has no receipt.`,
        suggestedAction: 'Ask the worker to attach the receipt or explain why it is missing.'
      });
    }

    const age = daysBetween(item.expenseDate, data.claim.claimDate);
    if (age !== null && age > POLICY.staleAfterDays) {
      flags.push({
        flagId: `F-STALE-${item.lineNumber}`,
        category: 'stale-expense',
        priority: 'low',
        description: `${label(item)} is ${age} days old.`,
        suggestedAction: 'Check whether a late-claim exception applies.'
      });
    }

    if (amt > POLICY.priorApprovalRequiredOver && item.priorApprovalObtained !== true) {
      flags.push({
        flagId: `F-NO-PRIOR-APPROVAL-${item.lineNumber}`,
        category: 'no-prior-approval',
        priority: 'medium',
        description: `${label(item)} had no prior approval.`,
        suggestedAction: 'Confirm the manager would have approved it, or reject.'
      });
    }

    if (PERSONAL_PATTERN.test(`${item.description} ${item.merchant}`)) {
      flags.push({
        flagId: `F-PERSONAL-${item.lineNumber}`,
        category: 'alcohol-or-personal',
        priority: 'high',
        description: `${label(item)} looks like alcohol or a personal item.`,
        suggestedAction: 'Reject this line; alcohol and personal items are not reimbursable.'
      });
    }

    if (
      (item.currency || claimCurrency) !== claimCurrency &&
      !(isNum(item.exchangeRate) && item.exchangeRate > 0)
    ) {
      flags.push({
        flagId: `F-FOREIGN-CURRENCY-${item.lineNumber}`,
        category: 'foreign-currency',
        priority: 'medium',
        description: `${label(item)} is in ${item.currency} with no exchange rate.`,
        suggestedAction: 'Obtain the card-statement exchange rate and enter it.'
      });
    }

    if (amt > POLICY.singleLineOverLimit) {
      flags.push({
        flagId: `F-OVER-LIMIT-${item.lineNumber}`,
        category: 'over-limit',
        priority: 'medium',
        description: `${label(item)} is over the £${POLICY.singleLineOverLimit} single-line limit.`,
        suggestedAction: 'Route to finance for sign-off.'
      });
    }
  }

  // Duplicate suspected: same date + merchant + amount on two lines.
  const seen = new Map<string, number>();
  for (const item of items) {
    if (item.expenseDate === '' || item.merchant.trim() === '' || !isNum(item.amount)) continue;
    const key = `${item.expenseDate}|${item.merchant.trim().toLowerCase()}|${item.amount}`;
    if (seen.has(key)) {
      flags.push({
        flagId: `F-DUPLICATE-${item.lineNumber}`,
        category: 'duplicate-suspected',
        priority: 'high',
        description: `Line ${seen.get(key)} and line ${item.lineNumber} have the same date, merchant and amount.`,
        suggestedAction: 'Confirm these are two separate purchases.'
      });
    } else {
      seen.set(key, item.lineNumber);
    }
  }

  if (items.length > 0 && data.declarations.noDuplicateClaim !== true) {
    flags.push({
      flagId: 'F-NO-DECLARATION-001',
      category: 'no-declaration',
      priority: 'high',
      description: 'The worker has not declared this is not a duplicate claim.',
      suggestedAction: 'Ask the worker to complete the declarations before approval.'
    });
  }

  return flags;
}
