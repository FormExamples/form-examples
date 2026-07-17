// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `front-end-dashboard-with-svelte/src/lib/types.ts` data model for the
// Endocrinology Waiting List Card review dashboard.

/**
 * Waiting Time Status band emitted by the engine.
 *
 * @typedef {'within-target' | 'approaching-breach' | 'breached' | 'long-wait'} WaitingTimeStatus
 */

/**
 * NHS England Clinical Prioritisation framework (P1–P6).
 *
 * @typedef {'P1a' | 'P1b' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6'} ClinicalPriority
 */

/**
 * @typedef {'low' | 'medium' | 'high'} FlagPriority
 *
 * @typedef {Object} SummaryFlag
 * @property {string} category
 * @property {FlagPriority} priority
 *
 * @typedef {Object} WaitingListCardSummary
 * @property {string} id
 * @property {string} patientName
 * @property {string} nhsNumber
 * @property {string} specialty
 * @property {string} procedureDescription
 * @property {ClinicalPriority} clinicalPriority
 * @property {string} rttClockStartDate
 * @property {number} weeksWaited
 * @property {WaitingTimeStatus} waitingTimeStatus
 * @property {string | null} nextAppointmentDate
 * @property {string} nextAppointmentSite
 * @property {string} practitionerName
 * @property {SummaryFlag[]} flags
 *
 * @typedef {Object} DashboardCardsResponse
 * @property {WaitingListCardSummary[]} items
 * @property {number} total
 */

  
