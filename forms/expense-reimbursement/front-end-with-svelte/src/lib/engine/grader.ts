import type {
  ApprovalTier,
  ComplianceBand,
  ExpenseReimbursement,
  FiredRule,
  GradingResult,
  Recommendation
} from './types.js';
import { detectFlags } from './flags.js';
import { claimTotals, scoreApproval, scoreCompleteness, scoreCompliance } from './rules.js';

// Three-axis grader for the Expense Reimbursement claim.
//
// Composes the rule sets in rules.js and the flags in flags.js into a single
// pure, deterministic grading result. The public entry point is
// `calculateGrade(data)`. The output shape and rule / flag IDs are identical
// across every front-end and the back-end.

/**
 * Derive an overall handling recommendation from the axes. An incomplete claim
 * is sent back; a claim with an ineligible line is rejected; a claim needing
 * review or finance sign-off is escalated; otherwise it is approved.
 * First match wins.
 */
export function deriveRecommendation(
  completenessPercent: number,
  complianceBand: ComplianceBand,
  approvalTier: ApprovalTier
): Recommendation {
  if (completenessPercent < 70) return 'request-more-information';
  if (complianceBand === 'likely-ineligible') return 'reject';
  if (complianceBand === 'needs-review' || approvalTier === 'finance-review') return 'escalate';
  return 'approve';
}

export const RECOMMENDATION_LABELS: Record<string, string> = {
  approve: 'Approve and repay',
  'request-more-information': 'Request more information from the worker',
  escalate: 'Escalate for review',
  reject: 'Reject the claim'
};

/** Public entry point. Pure and deterministic. */
export function calculateGrade(data: ExpenseReimbursement): GradingResult {
  const firedRules: FiredRule[] = [];

  const compliance = scoreCompliance(data);
  for (const r of compliance.firedRules) firedRules.push(r);

  const completeness = scoreCompleteness(data);
  for (const m of completeness.missing) firedRules.push(m);

  const flags = detectFlags(data);

  const approval = scoreApproval(
    data,
    flags.some((f) => f.priority === 'high')
  );
  firedRules.push(approval.firedRule);

  const recommendation = deriveRecommendation(completeness.percent, compliance.band, approval.tier);
  const totals = claimTotals(data);

  return {
    complianceBand: compliance.band,
    completenessPercent: completeness.percent,
    approvalTier: approval.tier,
    total: totals.total,
    amountToRepay: totals.amountToRepay,
    recommendation,
    recommendationLabel: RECOMMENDATION_LABELS[recommendation] || recommendation,
    firedRules,
    flags
  };
}
