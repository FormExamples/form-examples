import type {
  ApprovalTier,
  ClaimTotals,
  ComplianceBand,
  ExpenseItem,
  ExpenseReimbursement,
  FiredRule
} from './types.js';

// Three-axis rule catalogue for the Expense Reimbursement engine.
//
// Derived from spec/index.md and the SQL grade tables: (A) policy compliance
// band compliant / needs-review / likely-ineligible from per-line rules;
// (B) completeness over mandatory fields; (C) approval tier from the claim
// total and flagged lines. Rule IDs are stable and identical across every
// front-end and the back-end (R-COMP-*, R-COMPL-*, R-APPR-*). Thresholds are
// configurable employer-policy defaults, kept together in POLICY. Pure data +
// helpers; the grader composes them. Money is rounded to the minor unit (pence).

export const POLICY = {
  receiptRequiredOver: 10,
  priorApprovalRequiredOver: 50,
  staleAfterDays: 90,
  lineManagerUpTo: 100,
  budgetHolderUpTo: 500,
  singleLineOverLimit: 500
};

export const PERSONAL_PATTERN =
  /\b(alcohol|wine|beer|lager|cider|spirits|cocktails?|gin|vodka|whisky|whiskey|champagne|prosecco|personal)\b/i;

// ----------------------------------------------------------------------
// Shared helpers
// ----------------------------------------------------------------------

/** Round to 2 decimal places without binary-float drift. */
export function money(n: number): number {
  return Math.round((Number(n) + Number.EPSILON) * 100) / 100;
}

export function isNum(n: unknown): n is number {
  return typeof n === 'number' && Number.isFinite(n);
}

/** Whole days from ISO date a to ISO date b (b - a); null when either is invalid. */
export function daysBetween(a: string, b: string): number | null {
  const pa = /^(\d{4})-(\d{2})-(\d{2})/.exec(a || '');
  const pb = /^(\d{4})-(\d{2})-(\d{2})/.exec(b || '');
  if (!pa || !pb) return null;
  const ta = Date.UTC(+pa[1], +pa[2] - 1, +pa[3]);
  const tb = Date.UTC(+pb[1], +pb[2] - 1, +pb[3]);
  return Math.round((tb - ta) / 86400000);
}

/** True when the line has been touched at all (a blank starter row is ignored). */
export function isUsed(item: ExpenseItem): boolean {
  return (
    item.expenseDate !== '' ||
    item.category !== '' ||
    item.description.trim() !== '' ||
    item.merchant.trim() !== '' ||
    isNum(item.amount) ||
    isNum(item.mileageDistanceMiles)
  );
}

export function usedItems(d: ExpenseReimbursement): ExpenseItem[] {
  return d.items.filter(isUsed);
}

/** Line amount converted to the claim currency (rate defaults to 1). */
export function amountInClaimCurrency(item: ExpenseItem, claimCurrency: string): number {
  if (!isNum(item.amount)) return 0;
  const sameCurrency = (item.currency || claimCurrency) === claimCurrency;
  const rate = sameCurrency
    ? 1
    : isNum(item.exchangeRate) && item.exchangeRate > 0
      ? item.exchangeRate
      : 1;
  return money(item.amount * rate);
}

/** Claim totals in the claim currency. */
export function claimTotals(d: ExpenseReimbursement): ClaimTotals {
  const cur = d.claim.currency || 'GBP';
  let total = 0;
  let vat = 0;
  for (const item of usedItems(d)) {
    total += amountInClaimCurrency(item, cur);
    if (isNum(item.vatAmount)) {
      const sameCurrency = (item.currency || cur) === cur;
      const rate = sameCurrency
        ? 1
        : isNum(item.exchangeRate) && item.exchangeRate > 0
          ? item.exchangeRate
          : 1;
      vat += item.vatAmount * rate;
    }
  }
  const advance = isNum(d.claim.advanceReceivedAmount) ? d.claim.advanceReceivedAmount : 0;
  return {
    total: money(total),
    vat: money(vat),
    advance: money(advance),
    amountToRepay: money(total - advance)
  };
}

export function label(item: ExpenseItem): string {
  const n = item.lineNumber;
  const what = item.description.trim() || item.merchant.trim() || item.category || 'expense';
  return `Line ${n} (${what})`;
}

// ----------------------------------------------------------------------
// Axis A — policy compliance
// ----------------------------------------------------------------------

/**
 * Per-line policy rules. Each fired rule carries a `severity`:
 * 'needs-review' or 'likely-ineligible'.
 */
export function scoreCompliance(d: ExpenseReimbursement): {
  band: ComplianceBand;
  firedRules: FiredRule[];
} {
  const fired: FiredRule[] = [];
  const items = usedItems(d);
  const claimDate = d.claim.claimDate;

  for (const item of items) {
    const amt = isNum(item.amount) ? item.amount : 0;

    if (
      amt > POLICY.receiptRequiredOver &&
      item.receiptAttached !== true &&
      item.receiptMissingReason.trim() === ''
    ) {
      fired.push({
        ruleId: 'R-COMP-RECEIPT-01',
        axis: 'compliance',
        category: 'missing-receipt',
        severity: 'needs-review',
        description: `${label(item)} is over £${POLICY.receiptRequiredOver} with no receipt and no reason given.`
      });
    }

    const age = daysBetween(item.expenseDate, claimDate);
    if (age !== null && age > POLICY.staleAfterDays) {
      fired.push({
        ruleId: 'R-COMP-STALE-01',
        axis: 'compliance',
        category: 'stale-expense',
        severity: 'needs-review',
        description: `${label(item)} is ${age} days old; policy asks for claims within ${POLICY.staleAfterDays} days.`
      });
    }
    if (age !== null && age < 0) {
      fired.push({
        ruleId: 'R-COMP-FUTURE-01',
        axis: 'compliance',
        category: 'other',
        severity: 'needs-review',
        description: `${label(item)} is dated after the claim date.`
      });
    }

    if (PERSONAL_PATTERN.test(`${item.description} ${item.merchant}`)) {
      fired.push({
        ruleId: 'R-COMP-PERSONAL-01',
        axis: 'compliance',
        category: 'alcohol-or-personal',
        severity: 'likely-ineligible',
        description: `${label(item)} looks like alcohol or a personal item, which is never reimbursable.`
      });
    }

    if (amt > POLICY.priorApprovalRequiredOver && item.priorApprovalObtained !== true) {
      fired.push({
        ruleId: 'R-COMP-APPROVAL-01',
        axis: 'compliance',
        category: 'no-prior-approval',
        severity: 'needs-review',
        description: `${label(item)} is over £${POLICY.priorApprovalRequiredOver} without prior approval.`
      });
    }

    if (
      item.category === 'mileage' &&
      !(isNum(item.mileageDistanceMiles) && item.mileageDistanceMiles > 0)
    ) {
      fired.push({
        ruleId: 'R-COMP-MILEAGE-01',
        axis: 'compliance',
        category: 'other',
        severity: 'needs-review',
        description: `${label(item)} is mileage but gives no distance.`
      });
    }
  }

  if (items.length > 0 && d.declarations.whollyForWork !== true) {
    fired.push({
      ruleId: 'R-COMP-WORK-01',
      axis: 'compliance',
      category: 'no-declaration',
      severity: 'needs-review',
      description: 'The worker has not declared the expenses were incurred wholly for work.'
    });
  }

  let band: ComplianceBand = 'compliant';
  if (fired.some((r) => r.severity === 'likely-ineligible')) band = 'likely-ineligible';
  else if (fired.length > 0) band = 'needs-review';
  return { band, firedRules: fired };
}

// ----------------------------------------------------------------------
// Axis B — completeness
// ----------------------------------------------------------------------

/** Mandatory-field checklist; each entry is [ruleId, description, met]. */
function completenessChecks(d: ExpenseReimbursement): [string, string, boolean][] {
  const items = usedItems(d);
  const checks: [string, string, boolean][] = [
    ['R-COMPL-WORKER-01', 'Worker name', d.worker.name.trim() !== ''],
    ['R-COMPL-MANAGER-01', 'Approver name', d.manager.name.trim() !== ''],
    ['R-COMPL-DATE-01', 'Claim date', d.claim.claimDate !== ''],
    ['R-COMPL-TITLE-01', 'Claim title', d.claim.title.trim() !== ''],
    ['R-COMPL-PURPOSE-01', 'Business purpose', d.claim.businessPurpose.trim() !== ''],
    ['R-COMPL-ITEMS-01', 'At least one expense line', items.length > 0],
    [
      'R-COMPL-LINES-01',
      'Every expense line has a date, category, description and amount',
      items.length > 0 &&
        items.every(
          (i) =>
            i.expenseDate !== '' &&
            i.category !== '' &&
            i.description.trim() !== '' &&
            isNum(i.amount)
        )
    ],
    ['R-COMPL-REPAY-01', 'Repayment method', d.repayment.method !== ''],
    [
      'R-COMPL-BANK-01',
      'Bank account name and last four digits (for a bank transfer)',
      d.repayment.method !== '' &&
        (d.repayment.method !== 'bank-transfer' ||
          (d.repayment.bankAccountName.trim() !== '' &&
            /^\d{4}$/.test(d.repayment.bankAccountLastFour)))
    ],
    [
      'R-COMPL-DECL-01',
      'Declaration: no duplicate claim',
      d.declarations.noDuplicateClaim === true
    ],
    ['R-COMPL-DECL-02', 'Declaration: receipts attached', d.declarations.receiptsAttached === true],
    ['R-COMPL-SIGN-01', 'Signed name', d.declarations.signedName.trim() !== '']
  ];
  return checks;
}

export function scoreCompleteness(d: ExpenseReimbursement): {
  percent: number;
  missing: FiredRule[];
} {
  const checks = completenessChecks(d);
  const missing = checks
    .filter(([, , met]) => !met)
    .map(([ruleId, what]): FiredRule => ({
      ruleId,
      axis: 'completeness',
      category: 'missing-field',
      description: `Missing: ${what}.`
    }));
  const percent = Math.round(((checks.length - missing.length) / checks.length) * 100);
  return { percent, missing };
}

// ----------------------------------------------------------------------
// Axis C — approval tier
// ----------------------------------------------------------------------

export function scoreApproval(
  d: ExpenseReimbursement,
  hasHighPriorityFlag: boolean
): { tier: ApprovalTier; firedRule: FiredRule } {
  const { total } = claimTotals(d);
  if (total > POLICY.budgetHolderUpTo) {
    return {
      tier: 'finance-review',
      firedRule: {
        ruleId: 'R-APPR-FINANCE-01',
        axis: 'approval',
        category: 'approval-tier',
        description: `Total £${total.toFixed(2)} is over £${POLICY.budgetHolderUpTo}: finance review.`
      }
    };
  }
  if (hasHighPriorityFlag) {
    return {
      tier: 'finance-review',
      firedRule: {
        ruleId: 'R-APPR-FINANCE-01',
        axis: 'approval',
        category: 'approval-tier',
        description: 'A high-priority flag was raised: finance review.'
      }
    };
  }
  if (total > POLICY.lineManagerUpTo) {
    return {
      tier: 'budget-holder',
      firedRule: {
        ruleId: 'R-APPR-BUDGET-01',
        axis: 'approval',
        category: 'approval-tier',
        description: `Total £${total.toFixed(2)} is over £${POLICY.lineManagerUpTo}: budget holder.`
      }
    };
  }
  return {
    tier: 'line-manager',
    firedRule: {
      ruleId: 'R-APPR-LINE-01',
      axis: 'approval',
      category: 'approval-tier',
      description: `Total £${total.toFixed(2)} is within £${POLICY.lineManagerUpTo}: line manager.`
    }
  };
}
