import { describe, expect, it } from 'vitest';
import { calculateGrade } from './grader.js';
import { createDefaultClaim, createDefaultItem } from './defaults.js';
import { claimTotals } from './rules.js';
import type { ExpenseReimbursement } from './types.js';

/** A complete, compliant £42.50 train-fare claim. */
function goodClaim(): ExpenseReimbursement {
  const c = createDefaultClaim();
  c.worker.name = 'Dr A';
  c.manager.name = 'B';
  c.claim.claimDate = '2026-10-20';
  c.claim.title = 'Course travel';
  c.claim.businessPurpose = 'Training';
  c.items = [
    {
      ...createDefaultItem(1),
      expenseDate: '2026-10-15',
      category: 'travel',
      description: 'Train',
      merchant: 'Rail',
      amount: 42.5,
      receiptAttached: true
    }
  ];
  c.repayment.method = 'payroll';
  c.declarations = {
    whollyForWork: true,
    noDuplicateClaim: true,
    receiptsAttached: true,
    signedName: 'Dr A',
    signedAt: ''
  };
  return c;
}

const ruleIds = (c: ExpenseReimbursement) => calculateGrade(c).firedRules.map((r) => r.ruleId);

describe('expense reimbursement grader', () => {
  it('grades a blank claim as compliant, 0% complete, request-more-information', () => {
    const g = calculateGrade(createDefaultClaim());
    expect(g.complianceBand).toBe('compliant');
    expect(g.completenessPercent).toBe(0);
    expect(g.recommendation).toBe('request-more-information');
    expect(g.total).toBe(0);
  });

  it('approves a complete, compliant, small claim', () => {
    const g = calculateGrade(goodClaim());
    expect(g.complianceBand).toBe('compliant');
    expect(g.completenessPercent).toBe(100);
    expect(g.approvalTier).toBe('line-manager');
    expect(g.recommendation).toBe('approve');
    expect(g.amountToRepay).toBe(42.5);
    expect(g.flags).toHaveLength(0);
  });

  it('requires a receipt only over £10', () => {
    const c = goodClaim();
    c.items[0].receiptAttached = false;
    c.items[0].amount = 10;
    expect(calculateGrade(c).complianceBand).toBe('compliant');
    c.items[0].amount = 10.01;
    expect(ruleIds(c)).toContain('R-COMP-RECEIPT-01');
  });

  it('requires prior approval only over £50', () => {
    const c = goodClaim();
    c.items[0].amount = 50;
    expect(ruleIds(c)).not.toContain('R-COMP-APPROVAL-01');
    c.items[0].amount = 50.01;
    expect(ruleIds(c)).toContain('R-COMP-APPROVAL-01');
  });

  it('treats an expense as stale only after 90 days', () => {
    const c = goodClaim();
    c.items[0].expenseDate = '2026-10-15';
    c.claim.claimDate = '2027-01-13'; // exactly 90 days
    expect(ruleIds(c)).not.toContain('R-COMP-STALE-01');
    c.claim.claimDate = '2027-01-14'; // 91 days
    expect(ruleIds(c)).toContain('R-COMP-STALE-01');
  });

  it('routes by claim total: £100 and £500 are inclusive upper bounds', () => {
    const c = goodClaim();
    c.items[0].priorApprovalObtained = true;
    const tier = (amount: number) => {
      c.items[0].amount = amount;
      return calculateGrade(c).approvalTier;
    };
    expect(tier(100)).toBe('line-manager');
    expect(tier(100.01)).toBe('budget-holder');
    expect(tier(500)).toBe('budget-holder');
    expect(tier(500.01)).toBe('finance-review');
  });

  it('rejects a claim containing alcohol', () => {
    const c = goodClaim();
    c.items[0].description = 'Wine with dinner';
    const g = calculateGrade(c);
    expect(g.complianceBand).toBe('likely-ineligible');
    expect(g.recommendation).toBe('reject');
    expect(g.flags.some((f) => f.category === 'alcohol-or-personal')).toBe(true);
  });

  it('flags a suspected duplicate and escalates to finance', () => {
    const c = goodClaim();
    c.items.push({ ...c.items[0], lineNumber: 2 });
    const g = calculateGrade(c);
    expect(g.flags.some((f) => f.category === 'duplicate-suspected')).toBe(true);
    expect(g.approvalTier).toBe('finance-review');
  });

  it('sums money without binary-float drift', () => {
    const c = goodClaim();
    c.items = [0.1, 0.2, 0.3].map((amount, i) => ({
      ...createDefaultItem(i + 1),
      expenseDate: '2026-10-15',
      category: 'other' as const,
      description: 'x',
      amount,
      receiptAttached: true
    }));
    expect(claimTotals(c).total).toBe(0.6);
  });

  it('converts foreign-currency lines and subtracts an advance', () => {
    const c = goodClaim();
    c.items[0].currency = 'EUR';
    c.items[0].amount = 100;
    c.items[0].exchangeRate = 0.85;
    expect(claimTotals(c).total).toBe(85);
    c.claim.advanceReceivedAmount = 20;
    expect(claimTotals(c).amountToRepay).toBe(65);
  });

  it('flags a foreign-currency line with no exchange rate', () => {
    const c = goodClaim();
    c.items[0].currency = 'EUR';
    expect(calculateGrade(c).flags.some((f) => f.category === 'foreign-currency')).toBe(true);
  });

  it('needs bank details for a bank transfer', () => {
    const c = goodClaim();
    c.repayment.method = 'bank-transfer';
    expect(calculateGrade(c).completenessPercent).toBeLessThan(100);
    c.repayment.bankAccountName = 'A';
    c.repayment.bankAccountLastFour = '1234';
    expect(calculateGrade(c).completenessPercent).toBe(100);
  });
});
