// Plain-JavaScript / JSDoc type definitions for the expense reimbursement
// dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases and so engineers can read the
// canonical shape of the dashboard data in one place.

/**
 * Policy compliance band emitted by the engine's Axis A.
 * @typedef {'compliant' | 'needs-review' | 'likely-ineligible'} ComplianceBand
 */

/**
 * Approval tier emitted by Axis C.
 * @typedef {'line-manager' | 'budget-holder' | 'finance-review'} ApprovalTier
 */

/**
 * Overall handling recommendation.
 * @typedef {'approve' | 'request-more-information' | 'escalate' | 'reject'} Recommendation
 */

/**
 * Claim row displayed in the claims dashboard.
 *
 * @typedef {Object} ClaimRow
 * @property {string} id              - UUID / case identifier of the claim
 * @property {string} claimDate       - ISO date "YYYY-MM-DD" of the claim
 * @property {string} worker          - Worker display name
 * @property {string} jobTitle        - Worker job title
 * @property {string} department      - Worker department / team
 * @property {string} claimTitle      - Short claim title
 * @property {number} total           - Claim total in the claim currency
 * @property {ComplianceBand} complianceBand - Axis A band
 * @property {ApprovalTier} approvalTier - Axis C approval tier
 * @property {number} completenessPercent - Axis B completeness 0..100
 * @property {Recommendation} recommendation - Overall handling recommendation
 * @property {string} manager         - Approver display name
 * @property {string[]} flags         - Policy / fraud-prevention flag categories (kebab-case)
 */

/**
 * Response from `GET /api/expense_reimbursements`.
 *
 * The Axum backend returns a bare JSON array of `ClaimRow` objects; the
 * dashboard accepts either a bare array or an `{ items, total }` envelope so
 * future paginated responses are forwards-compatible.
 *
 * @typedef {ClaimRow[] | { items: ClaimRow[], total?: number }} DashboardClaimsResponse
 */

export {};
