// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Mental Health Act Assessment
// form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_mental_health_act_assessment.sql`. This file builds and
// exports the canonical empty MentalHealthActAssessment shape used by the
// wizard, so newly-added fields default correctly when older saved state is
// rehydrated from localStorage. It also exports display helpers (enum labels,
// completeness-status / section-class / urgency labels and CSS-class hints).
//
// This is a LEGAL and CLINICAL DOCUMENTATION instrument, not a numeric severity
// score and NOT an automated decision to detain. The engine validates that the
// documentation required by the recommended section is complete
// (`valid` / `incomplete`), classifies the recommended section and its urgency,
// and raises flags. The prescribed statutory forms remain the definitive legal
// record.

/**
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'met' | 'not-met' | 'not-applicable' | ''} Criterion
 * @typedef {'hospital-ward' | 'emergency-department' | 'place-of-safety' | 'care-home' | 'community' | 'other' | ''} Location
 * @typedef {'child' | 'adolescent' | 'adult' | 'older-adult' | ''} AgeBand
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
 * @typedef {'none' | 'low' | 'moderate' | 'imminent' | ''} RiskImminence
 * @typedef {'yes' | 'no' | 'not-practicable' | ''} ConsultedStatus
 * @typedef {'yes' | 'no' | 'unknown' | ''} ObjectionStatus
 * @typedef {'2' | '3' | '4' | '5-2' | '5-4' | '136' | 'none' | ''} RecommendedSection
 * @typedef {'detain-under-section' | 'informal-admission' | 'community' | 'no-action' | ''} Outcome
 * @typedef {'ambulance' | 'police' | 'self' | 'other' | ''} Conveyance
 * @typedef {'valid' | 'incomplete'} CompletenessStatus
 * @typedef {'section-2' | 'section-3' | 'section-4' | 'section-5-2' | 'section-5-4' | 'section-136' | 'none'} RecommendedSectionClass
 * @typedef {'routine' | 'urgent' | 'emergency'} UrgencyClass
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — assessment context.
 * @typedef {Object} Context
 * @property {string | null} assessedAt   - ISO datetime; null when unset
 * @property {Location} location
 * @property {string} referralSource
 * @property {string} reasonForAssessment
 */

/**
 * Step 2 — person identification.
 * @typedef {Object} Identification
 * @property {string} personIdentifier
 * @property {AgeBand} ageBand
 * @property {Sex} sex
 * @property {string} firstLanguage
 */

/**
 * Step 3 — assessing professionals.
 * @typedef {Object} Professionals
 * @property {string} amhpName
 * @property {YesNo} amhpApproved
 * @property {string} doctor1Name
 * @property {string} doctor1GmcNumber
 * @property {YesNo} doctor1Section12Approved
 * @property {string | null} doctor1ExaminedAt   - ISO datetime; null when unset
 * @property {string} doctor2Name
 * @property {string} doctor2GmcNumber
 * @property {YesNo} doctor2Section12Approved
 * @property {string | null} doctor2ExaminedAt   - ISO datetime; null when unset
 * @property {YesNo} priorAcquaintance
 */

/**
 * Step 4 — mental disorder criterion.
 * @typedef {Object} MentalDisorder
 * @property {Criterion} mentalDisorderPresent
 * @property {string} mentalDisorderEvidence
 */

/**
 * Step 5 — risk criteria.
 * @typedef {Object} Risk
 * @property {Criterion} riskToOwnHealth
 * @property {Criterion} riskToOwnSafety
 * @property {Criterion} riskToOthers
 * @property {string} riskEvidence
 * @property {RiskImminence} riskImminence
 */

/**
 * Step 6 — least-restrictive alternative criterion.
 * @typedef {Object} LeastRestrictive
 * @property {Criterion} leastRestrictiveMet
 * @property {string} alternativesConsidered
 */

/**
 * Step 7 — appropriate medical treatment criterion (required for s3).
 * @typedef {Object} Treatment
 * @property {Criterion} appropriateTreatmentAvailable
 * @property {string} treatmentPlanSummary
 */

/**
 * Step 8 — nearest relative / consultees.
 * @typedef {Object} NearestRelative
 * @property {YesNo} nearestRelativeIdentified
 * @property {ConsultedStatus} nearestRelativeConsulted
 * @property {ObjectionStatus} nearestRelativeObjection
 * @property {string} consultationRecord
 */

/**
 * Step 9 — recommendation and outcome.
 * @typedef {Object} Recommendation
 * @property {RecommendedSection} recommendedSection
 * @property {Outcome} outcome
 * @property {YesNo} bedIdentified
 * @property {Conveyance} conveyance
 * @property {string} clinicalLegalNote
 */

/**
 * @typedef {Object} MentalHealthActAssessment
 * @property {Context} context
 * @property {Identification} identification
 * @property {Professionals} professionals
 * @property {MentalDisorder} mentalDisorder
 * @property {Risk} risk
 * @property {LeastRestrictive} leastRestrictive
 * @property {Treatment} treatment
 * @property {NearestRelative} nearestRelative
 * @property {Recommendation} recommendation
 */

/**
 * @typedef {Object} RequiredSignatory
 * @property {string} role       - stable key, e.g. 'amhp', 'doctor1', 'doctor2', 's12'
 * @property {string} label
 * @property {boolean} present
 */

/**
 * @typedef {Object} CriterionResult
 * @property {string} criterion  - stable key, e.g. 'mental-disorder', 'risk'
 * @property {string} label
 * @property {Criterion} status
 * @property {boolean} evidencePresent
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
 * @property {CompletenessStatus} completenessStatus
 * @property {RecommendedSectionClass} recommendedSectionClass
 * @property {UrgencyClass} urgencyClass
 * @property {RequiredSignatory[]} requiredSignatories
 * @property {CriterionResult[]} criteriaSummary
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

/**
 * Build a fresh, fully-blank assessment.
 * Text / enum fields default to `''`; date / time fields default to `null`.
 * @returns {MentalHealthActAssessment}
 */
function emptyAssessment() {
  return {
    context: {
      assessedAt: null,
      location: '',
      referralSource: '',
      reasonForAssessment: ''
    },
    identification: {
      personIdentifier: '',
      ageBand: '',
      sex: '',
      firstLanguage: ''
    },
    professionals: {
      amhpName: '',
      amhpApproved: '',
      doctor1Name: '',
      doctor1GmcNumber: '',
      doctor1Section12Approved: '',
      doctor1ExaminedAt: null,
      doctor2Name: '',
      doctor2GmcNumber: '',
      doctor2Section12Approved: '',
      doctor2ExaminedAt: null,
      priorAcquaintance: ''
    },
    mentalDisorder: {
      mentalDisorderPresent: '',
      mentalDisorderEvidence: ''
    },
    risk: {
      riskToOwnHealth: '',
      riskToOwnSafety: '',
      riskToOthers: '',
      riskEvidence: '',
      riskImminence: ''
    },
    leastRestrictive: {
      leastRestrictiveMet: '',
      alternativesConsidered: ''
    },
    treatment: {
      appropriateTreatmentAvailable: '',
      treatmentPlanSummary: ''
    },
    nearestRelative: {
      nearestRelativeIdentified: '',
      nearestRelativeConsulted: '',
      nearestRelativeObjection: '',
      consultationRecord: ''
    },
    recommendation: {
      recommendedSection: '',
      outcome: '',
      bedIdentified: '',
      conveyance: '',
      clinicalLegalNote: ''
    }
  };
}

/** Completeness-status label for display. */
function completenessStatusLabel(status) {
  switch (status) {
    case 'valid': return 'Valid';
    case 'incomplete': return 'Incomplete';
    default: return '';
  }
}

/** CSS class hint for the completeness-status badge (reuses the risk palette). */
function completenessStatusClass(status) {
  switch (status) {
    case 'valid': return 'risk-low';
    case 'incomplete': return 'risk-high';
    default: return '';
  }
}

/** Recommended-section-class label. */
function sectionClassLabel(cls) {
  switch (cls) {
    case 'section-2': return 'Section 2 — admission for assessment (up to 28 days)';
    case 'section-3': return 'Section 3 — admission for treatment (up to 6 months)';
    case 'section-4': return 'Section 4 — emergency admission for assessment (up to 72 hours)';
    case 'section-5-2': return 'Section 5(2) — doctor’s holding power (up to 72 hours)';
    case 'section-5-4': return 'Section 5(4) — nurse’s holding power (up to 6 hours)';
    case 'section-136': return 'Section 136 — police place-of-safety power (up to 24 hours)';
    case 'none': return 'No detaining section (informal admission or community outcome)';
    default: return '';
  }
}

/** Short recommended-section-class label for the dashboard. */
function sectionClassShort(cls) {
  switch (cls) {
    case 'section-2': return 'Section 2';
    case 'section-3': return 'Section 3';
    case 'section-4': return 'Section 4';
    case 'section-5-2': return 'Section 5(2)';
    case 'section-5-4': return 'Section 5(4)';
    case 'section-136': return 'Section 136';
    case 'none': return 'None';
    default: return 'N/A';
  }
}

/** Urgency-class label. */
function urgencyLabel(urgency) {
  switch (urgency) {
    case 'routine': return 'Routine';
    case 'urgent': return 'Urgent';
    case 'emergency': return 'Emergency';
    default: return '';
  }
}

/** CSS class hint for the urgency badge (reuses the risk palette). */
function urgencyClass(urgency) {
  switch (urgency) {
    case 'routine': return 'risk-low';
    case 'urgent': return 'risk-moderate';
    case 'emergency': return 'risk-high';
    default: return '';
  }
}

/** Criterion (met / not-met / not-applicable) label. */
function criterionLabel(value) {
  switch (value) {
    case 'met': return 'Met';
    case 'not-met': return 'Not met';
    case 'not-applicable': return 'Not applicable';
    default: return 'Not recorded';
  }
}

/** Location label. */
function locationLabel(value) {
  switch (value) {
    case 'hospital-ward': return 'Hospital ward';
    case 'emergency-department': return 'Emergency department';
    case 'place-of-safety': return 'Place of safety (s136 suite)';
    case 'care-home': return 'Care home';
    case 'community': return 'Community / person’s home';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Age-band label. */
function ageBandLabel(value) {
  switch (value) {
    case 'child': return 'Child';
    case 'adolescent': return 'Adolescent';
    case 'adult': return 'Adult';
    case 'older-adult': return 'Older adult';
    default: return '';
  }
}

/** Sex label. */
function sexLabel(value) {
  switch (value) {
    case 'female': return 'Female';
    case 'male': return 'Male';
    case 'intersex': return 'Intersex';
    case 'unknown': return 'Unknown';
    default: return '';
  }
}

/** Risk-imminence label. */
function imminenceLabel(value) {
  switch (value) {
    case 'none': return 'None';
    case 'low': return 'Low';
    case 'moderate': return 'Moderate';
    case 'imminent': return 'Imminent';
    default: return '';
  }
}

/** Outcome label. */
function outcomeLabel(value) {
  switch (value) {
    case 'detain-under-section': return 'Detain under section';
    case 'informal-admission': return 'Informal admission';
    case 'community': return 'Community / care in the community';
    case 'no-action': return 'No action';
    default: return '';
  }
}

/** Conveyance label. */
function conveyanceLabel(value) {
  switch (value) {
    case 'ambulance': return 'Ambulance';
    case 'police': return 'Police';
    case 'self': return 'Self / own transport';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Consulted-status label. */
function consultedLabel(value) {
  switch (value) {
    case 'yes': return 'Yes';
    case 'no': return 'No';
    case 'not-practicable': return 'Not practicable';
    default: return '';
  }
}

/** Yes / No label. */
function yesNoLabel(value) {
  switch (value) {
    case 'yes': return 'Yes';
    case 'no': return 'No';
    default: return '';
  }
}

/** Flag-priority label. */
function priorityLabel(priority) {
  switch (priority) {
    case 'high': return 'HIGH';
    case 'medium': return 'MEDIUM';
    case 'low': return 'LOW';
    default: return '';
  }
}

export { emptyAssessment, completenessStatusLabel, completenessStatusClass, sectionClassLabel, sectionClassShort, urgencyLabel, urgencyClass, criterionLabel, locationLabel, ageBandLabel, sexLabel, imminenceLabel, outcomeLabel, conveyanceLabel, consultedLabel, yesNoLabel, priorityLabel };
