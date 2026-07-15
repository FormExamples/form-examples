// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the Child Safeguarding Referral duty-team
// dashboard.
//
// This file deliberately exports nothing executable; it exists so other modules
// can reference the JSDoc type aliases via `@typedef` imports and so engineers
// can read the canonical shape of the dashboard data in one place.

/**
 * Documentation-completeness status emitted by the engine.
 *
 * @typedef {'complete' | 'partial' | 'incomplete'} Status
 */

/**
 * Urgency classification emitted by the engine; routes the referral to the
 * statutory pathway (s47 for emergency / urgent, s17 for standard).
 *
 * @typedef {'emergency' | 'urgent' | 'standard'} Urgency
 */

/**
 * Primary category of abuse; '' when not yet recorded.
 *
 * @typedef {'physical' | 'emotional' | 'sexual' | 'neglect' | ''} PrimaryCategory
 */

/**
 * Referral row displayed in the duty-team dashboard.
 *
 * Mirrors `ReferralRow` in
 * `forms/child-safeguarding-referral/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} ReferralRow
 * @property {string} id                      - UUID of the referral record
 * @property {string} childReference          - NHS number or local reference
 * @property {string} childName               - "Surname, Given" display name
 * @property {Status} status                  - complete | partial | incomplete
 * @property {number} completenessPercent     - 0..100
 * @property {Urgency} urgency                - emergency | urgent | standard
 * @property {PrimaryCategory} primaryCategory - primary category of abuse
 * @property {boolean} immediateDanger        - true when the child is in immediate danger
 * @property {string} referrerName            - professional who made the referral
 * @property {string} referredAt              - ISO date the referral was made
 */

/**
 * Response from `GET /api/dashboard/referrals`.
 *
 * @typedef {Object} DashboardReferralsResponse
 * @property {ReferralRow[]} items
 * @property {number} total
 */

// No runtime exports; types are JSDoc-only. Touch the namespace so this file is
// unambiguously side-effecting and other files can rely on it loading before
// they read the dashboard namespace.
