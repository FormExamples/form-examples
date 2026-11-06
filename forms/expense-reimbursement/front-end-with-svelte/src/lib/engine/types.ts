/**
 * Domain types for the Expense Reimbursement form.
 *
 * Empty string `''` for unanswered text / enum fields; `null` for unanswered
 * numeric fields. Property names are camelCase to match the HTML front-end,
 * the examples fixtures and the Axum serde convention.
 */

export type ClaimStatus =
  | 'draft'
  | 'submitted'
  | 'under-review'
  | 'approved'
  | 'partially-approved'
  | 'rejected'
  | 'paid'
  | 'withdrawn'
  | '';

export type ManagerRole =
  'line-manager' | 'budget-holder' | 'finance' | 'senior-manager' | 'other' | '';

export type ExpenseCategory =
  | 'travel'
  | 'mileage'
  | 'accommodation'
  | 'meals'
  | 'equipment'
  | 'clothing-uniform'
  | 'training-course'
  | 'professional-fees'
  | 'registration-and-licensing'
  | 'books-and-subscriptions'
  | 'telephone-and-internet'
  | 'postage'
  | 'parking-and-tolls'
  | 'client-hospitality'
  | 'other'
  | '';

export type PaymentMethod = 'personal-credit-card' | 'personal-debit-card' | 'cash' | 'other' | '';

export type RepaymentMethod = 'payroll' | 'bank-transfer' | 'cheque' | 'cash' | 'other' | '';

export type ComplianceBand = 'compliant' | 'needs-review' | 'likely-ineligible' | '';
export type ApprovalTier = 'line-manager' | 'budget-holder' | 'finance-review' | '';
export type Recommendation = 'approve' | 'request-more-information' | 'escalate' | 'reject' | '';
export type Axis = 'compliance' | 'completeness' | 'approval';
export type FlagPriority = 'low' | 'medium' | 'high';

export type FlagCategory =
  | 'missing-receipt'
  | 'duplicate-suspected'
  | 'over-limit'
  | 'stale-expense'
  | 'no-prior-approval'
  | 'no-declaration'
  | 'foreign-currency'
  | 'alcohol-or-personal'
  | 'other';

export interface Worker {
  name: string;
  jobTitle: string;
  department: string;
  employeeReference: string;
  costCentre: string;
  email: string;
  phone: string;
}

export interface Manager {
  name: string;
  role: ManagerRole;
  jobTitle: string;
  department: string;
  email: string;
}

export interface ClaimDetails {
  status: ClaimStatus;
  claimDate: string;
  periodStart: string;
  periodEnd: string;
  title: string;
  businessPurpose: string;
  projectOrCostCode: string;
  currency: string;
  advanceReceivedAmount: number | null;
}

/** One line item: a single receipt or purchase. */
export interface ExpenseItem {
  lineNumber: number;
  expenseDate: string;
  category: ExpenseCategory;
  description: string;
  merchant: string;
  currency: string;
  amount: number | null;
  vatAmount: number | null;
  exchangeRate: number | null;
  paymentMethod: PaymentMethod;
  mileageDistanceMiles: number | null;
  receiptAttached: boolean;
  receiptReference: string;
  receiptMissingReason: string;
  priorApprovalObtained: boolean;
}

export interface Repayment {
  method: RepaymentMethod;
  bankAccountName: string;
  bankAccountLastFour: string;
}

export interface Declarations {
  whollyForWork: boolean;
  noDuplicateClaim: boolean;
  receiptsAttached: boolean;
  signedName: string;
  signedAt: string;
}

/** The full expense reimbursement claim the engine grades. */
export interface ExpenseReimbursement {
  worker: Worker;
  manager: Manager;
  claim: ClaimDetails;
  items: ExpenseItem[];
  repayment: Repayment;
  declarations: Declarations;
}

export interface FiredRule {
  ruleId: string;
  axis: Axis;
  category: string;
  description: string;
  /** Compliance rules only: how serious the finding is. */
  severity?: 'needs-review' | 'likely-ineligible';
}

export interface Flag {
  flagId: string;
  category: FlagCategory;
  priority: FlagPriority;
  description: string;
  suggestedAction: string;
}

export interface GradingResult {
  complianceBand: ComplianceBand;
  completenessPercent: number;
  approvalTier: ApprovalTier;
  total: number;
  amountToRepay: number;
  recommendation: Recommendation;
  recommendationLabel: string;
  firedRules: FiredRule[];
  flags: Flag[];
}

export interface ClaimTotals {
  total: number;
  vat: number;
  advance: number;
  amountToRepay: number;
}

export interface StepConfig {
  number: number;
  title: string;
  shortTitle: string;
}

/** A dashboard row: the claim identity plus its computed grade. */
export interface ClaimRow {
  id: string;
  workerName: string;
  workerJobTitle: string;
  department: string;
  claimTitle: string;
  claimDate: string;
  status: ClaimStatus;
  total: number;
  complianceBand: ComplianceBand;
  approvalTier: ApprovalTier;
  completenessPercent: number;
  recommendation: Recommendation;
  managerName: string;
  flagCount: number;
}
