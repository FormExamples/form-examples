// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Zarit Burden Interview (ZBI).
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_zarit_burden_interview.sql`. This file builds and
// exports the canonical empty AssessmentData shape used by the wizard, so that
// newly-added fields automatically default correctly when older saved state is
// rehydrated from localStorage. It also exports display helpers (bandLabel,
// bandClass, practitionerRoleLabel, careSettingLabel, instrumentFormLabel,
// carerRelationshipLabel, recipientConditionLabel, priorityLabel).
//
// Item responses. Each of the twenty-two items stores its raw 0-4 frequency
// rating (0 = Never … 4 = Nearly always), or `null` when unanswered. There is
// no reverse-scoring — a higher rating always means greater perceived burden.
// The grader (`grader.js`) sums the answered ratings over the active item set
// (all 22 for ZBI-22, or the 12-item short-form subset for ZBI-12).

/**
 * @typedef {'clinician' | 'nurse' | 'social-care' | 'carer-support' | 'other' | ''} PractitionerRole
 * @typedef {'memory-service' | 'community' | 'general-practice' | 'social-care' | 'other' | ''} CareSetting
 * @typedef {'zbi22' | 'zbi12'} InstrumentForm
 * @typedef {'spouse-partner' | 'adult-child' | 'other-relative' | 'friend' | 'other' | ''} CarerRelationship
 * @typedef {'yes' | 'no' | ''} CarerCoResident
 * @typedef {'dementia' | 'chronic-illness' | 'disability' | 'other' | ''} RecipientCondition
 * @typedef {'little-or-none' | 'mild-to-moderate' | 'moderate-to-severe' | 'severe' | 'lower' | 'high'} Band
 * @typedef {'urgent' | 'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — assessment context.
 * @typedef {Object} Context
 * @property {string} practitionerName
 * @property {PractitionerRole} practitionerRole
 * @property {string} assessedAt        - ISO-ish datetime-local string; '' when unset
 * @property {CareSetting} careSetting
 * @property {InstrumentForm} instrumentForm - which item set is scored
 */

/**
 * Step 2 — carer (the person completing the questionnaire).
 * @typedef {Object} Carer
 * @property {string} carerIdentifier
 * @property {CarerRelationship} carerRelationship
 * @property {CarerCoResident} carerCoResident
 * @property {number | null} careHoursPerWeek - approximate hours of care per week
 */

/**
 * Step 3 — care recipient.
 * @typedef {Object} Recipient
 * @property {string} recipientIdentifier
 * @property {RecipientCondition} recipientCondition
 */

/**
 * Step 4 — the twenty-two item ratings. Each value is the raw 0-4 frequency
 * rating, or null when unanswered.
 * @typedef {Object} Items
 * @property {number | null} item1
 * @property {number | null} item2
 * @property {number | null} item3
 * @property {number | null} item4
 * @property {number | null} item5
 * @property {number | null} item6
 * @property {number | null} item7
 * @property {number | null} item8
 * @property {number | null} item9
 * @property {number | null} item10
 * @property {number | null} item11
 * @property {number | null} item12
 * @property {number | null} item13
 * @property {number | null} item14
 * @property {number | null} item15
 * @property {number | null} item16
 * @property {number | null} item17
 * @property {number | null} item18
 * @property {number | null} item19
 * @property {number | null} item20
 * @property {number | null} item21
 * @property {number | null} item22
 */

/**
 * Step 5 — clinician free-text note.
 * @typedef {Object} Note
 * @property {string} clinicalNote
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Context} context
 * @property {Carer} carer
 * @property {Recipient} recipient
 * @property {Items} items
 * @property {Note} note
 */

/**
 * @typedef {Object} FiredItem
 * @property {string} id           - stable rule id, e.g. R-ITEM-22-SCORE
 * @property {string} parameter    - item | total | band
 * @property {number} points       - points contributed (0..4), where applicable
 * @property {string} category
 * @property {string} description
 */

/**
 * @typedef {Object} FlaggedIssue
 * @property {string} id
 * @property {string} category
 * @property {Priority} priority
 * @property {string} description
 * @property {string} suggestedAction
 */

/**
 * @typedef {Object} GradingResult
 * @property {(number | null)[]} itemRatings - twenty-two entries, each 0..4 or null
 * @property {number} totalScore     - 0..88 (ZBI-22) or 0..48 (ZBI-12)
 * @property {88 | 48} maxScore
 * @property {Band} burdenBand
 * @property {FiredItem[]} firedItems
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric fields (careHoursPerWeek, item ratings)
 * default to `null`; instrumentForm defaults to the full 22-item form.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  /** @type {Items} */
  const items = {};
  for (let i = 1; i <= 22; i++) items[`item${i}`] = null;
  return {
    context: {
      practitionerName: '',
      practitionerRole: '',
      assessedAt: '',
      careSetting: '',
      instrumentForm: 'zbi22'
    },
    carer: {
      carerIdentifier: '',
      carerRelationship: '',
      carerCoResident: '',
      careHoursPerWeek: null
    },
    recipient: {
      recipientIdentifier: '',
      recipientCondition: ''
    },
    items,
    note: {
      clinicalNote: ''
    }
  };
}

/** Interpretation-band label for display. */
function bandLabel(band) {
  switch (band) {
    case 'little-or-none': return 'Little or no burden (0-21)';
    case 'mild-to-moderate': return 'Mild to moderate burden (22-40)';
    case 'moderate-to-severe': return 'Moderate to severe burden (41-60)';
    case 'severe': return 'Severe burden (61-88)';
    case 'lower': return 'Lower burden (0-16)';
    case 'high': return 'High burden (≥ 17)';
    default: return '';
  }
}

/** CSS class hint for the band badge (reuses the shared risk palette). */
function bandClass(band) {
  switch (band) {
    case 'little-or-none': return 'risk-low';
    case 'mild-to-moderate': return 'risk-moderate';
    case 'moderate-to-severe': return 'risk-high';
    case 'severe': return 'risk-critical';
    case 'lower': return 'risk-low';
    case 'high': return 'risk-critical';
    default: return '';
  }
}

/** Administering-practitioner role label. */
function practitionerRoleLabel(role) {
  switch (role) {
    case 'clinician': return 'Clinician';
    case 'nurse': return 'Nurse';
    case 'social-care': return 'Social-care practitioner';
    case 'carer-support': return 'Carer-support worker';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Care-setting label. */
function careSettingLabel(setting) {
  switch (setting) {
    case 'memory-service': return 'Old-age / memory service';
    case 'community': return 'Community / district nursing';
    case 'general-practice': return 'General practice';
    case 'social-care': return 'Social care / carer support';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Instrument-form label. */
function instrumentFormLabel(form) {
  switch (form) {
    case 'zbi22': return 'ZBI-22 (full, 22 items, 0-88)';
    case 'zbi12': return 'ZBI-12 (short form, 12 items, 0-48)';
    default: return '';
  }
}

/** Carer-relationship label. */
function carerRelationshipLabel(rel) {
  switch (rel) {
    case 'spouse-partner': return 'Spouse / partner';
    case 'adult-child': return 'Adult child';
    case 'other-relative': return 'Other relative';
    case 'friend': return 'Friend';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Care-recipient condition label. */
function recipientConditionLabel(cond) {
  switch (cond) {
    case 'dementia': return 'Dementia';
    case 'chronic-illness': return 'Chronic illness';
    case 'disability': return 'Disability';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Flag-priority label. */
function priorityLabel(priority) {
  switch (priority) {
    case 'urgent': return 'URGENT';
    case 'high': return 'HIGH';
    case 'medium': return 'MEDIUM';
    case 'low': return 'LOW';
    default: return '';
  }
}

export { emptyAssessment, bandLabel, bandClass, practitionerRoleLabel, careSettingLabel, instrumentFormLabel, carerRelationshipLabel, recipientConditionLabel, priorityLabel };
