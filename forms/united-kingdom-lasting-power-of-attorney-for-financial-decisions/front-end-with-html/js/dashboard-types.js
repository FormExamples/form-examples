// Plain-JavaScript / JSDoc type definitions for the UK LP1F case dashboard.
//
// This file deliberately exports nothing executable; it documents the
// canonical shape of a dashboard row (derived by running the shared
// validation engine over each LPA) in one place.

/**
 * Validity band emitted by the engine's band-rules.
 * @typedef {'draft' | 'ready_for_signing' | 'partially_signed' | 'fully_signed' | 'ready_for_registration' | 'submitted' | 'registered' | 'rejected'} ValidityBand
 */

/**
 * Composite risk emitted by the engine's max-grade algorithm.
 * @typedef {'low' | 'moderate' | 'high' | 'critical'} CompositeRisk
 */

/**
 * Decision mode chosen in LP1F section 3.
 * @typedef {'single_attorney' | 'jointly_and_severally' | 'jointly' | 'mixed' | ''} DecisionMode
 */

/**
 * A row in the LPA case dashboard.
 *
 * @typedef {Object} DashboardRow
 * @property {string} id                       - LPA identifier
 * @property {string} donorName                - Donor display name
 * @property {number} attorneyCount            - Number of attorneys
 * @property {DecisionMode} decisionMode       - Section-3 decision mode
 * @property {string} whenAttorneysCanAct      - Section-5 when-can-act choice
 * @property {number} replacementAttorneyCount - Number of replacement attorneys
 * @property {number} peopleToNotifyCount      - Number of people to notify
 * @property {ValidityBand} validityBand       - Engine validity band
 * @property {CompositeRisk} compositeRisk      - Engine composite risk
 * @property {string} opgStatus                - OPG application status
 * @property {string} opgReferenceNumber       - OPG reference (if registered)
 * @property {string} createdAt                - ISO date "YYYY-MM-DD"
 * @property {string[]} firedRuleIds           - Fired statutory blocker rule ids
 * @property {string[]} flagIds                - Fired non-statutory flag ids
 */

/**
 * Response from `GET /api/united_kingdom_lasting_powers_of_attorney_for_financial_decisions`.
 * @typedef {DashboardRow[] | { items: DashboardRow[], total?: number }} DashboardResponse
 */
