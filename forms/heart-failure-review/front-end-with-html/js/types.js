// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Heart Failure Annual Review
// form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_heart_failure_review.sql`. This file builds and exports
// the canonical empty ReviewData shape used by the wizard, so that newly-added
// fields automatically default correctly when older saved state is rehydrated
// from localStorage. It also exports the four medication pillars and a set of
// display helpers (functionalStatusLabel/Class, optimisationStatusLabel/Class,
// reviewStatusLabel/Class, priorityLabel, and enum label maps).
//
// Unlike a numeric-score form, the engine here derives FOUR independent
// documentation outputs (spec §4):
//   - NYHA functional status         (stable / symptomatic / advanced / unknown)
//   - medication-optimisation status (optimised / partial / suboptimal /
//                                     not-applicable) against the four pillars
//   - review-completeness grade      (complete / partial / incomplete)
//   - safety flags                   (each with a high / medium / low priority)
// None of these is a numeric severity score.

/**
 * @typedef {'gp' | 'practice-nurse' | 'hf-nurse' | 'pharmacist' | 'cardiologist' | 'other' | ''} ClinicianRole
 * @typedef {'general-practice' | 'community-hf-service' | 'hospital-clinic' | 'other' | ''} CareSetting
 * @typedef {'routine-annual' | 'post-discharge' | 'medication-titration' | ''} ReviewType
 * @typedef {'18-39' | '40-59' | '60-79' | '>=80' | ''} AgeBand
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
 * @typedef {'reduced' | 'mildly-reduced' | 'preserved' | 'unknown' | ''} HeartFailureType
 * @typedef {'prescribed' | 'not-prescribed' | 'contraindicated' | 'not-tolerated' | ''} PillarStatus
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'stable' | 'symptomatic' | 'advanced' | 'unknown'} FunctionalStatus
 * @typedef {'optimised' | 'partial' | 'suboptimal' | 'not-applicable'} OptimisationStatus
 * @typedef {'complete' | 'partial' | 'incomplete'} ReviewStatus
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * @typedef {Object} ReviewData
 * @property {Object} context
 * @property {Object} identification
 * @property {Object} diagnosis
 * @property {Object} functional
 * @property {Object} fluid
 * @property {Object} investigations
 * @property {Object} medication
 * @property {Object} devices
 * @property {Object} vaccinations
 * @property {Object} summary
 */

/**
 * @typedef {Object} PillarResult
 * @property {string} key          - raasInhibitor | betaBlocker | mra | sglt2Inhibitor
 * @property {string} label
 * @property {PillarStatus} status
 * @property {boolean} indicated   - whether this pillar counts for the record's HF type
 */

/**
 * @typedef {Object} MedicationOptimisation
 * @property {number} indicatedPillars
 * @property {number} prescribedPillars
 * @property {string[]} missingPillars     - indicated pillar keys with status not-prescribed
 * @property {OptimisationStatus} status
 * @property {PillarResult[]} pillars
 */

/**
 * @typedef {Object} DomainStatus
 * @property {string} domain
 * @property {string} label
 * @property {boolean} documented
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} domain
 * @property {string} category
 * @property {string} description
 */

/**
 * @typedef {Object} FlaggedIssue
 * @property {string} id
 * @property {string} category   - urgent-review | optimisation-gap |
 *                                 deranged-u-e-hyperkalaemia | fluid-overload |
 *                                 missing-monitoring | incomplete | other
 * @property {Priority} priority
 * @property {string} description
 * @property {string} suggestedAction
 */

/**
 * @typedef {Object} GradingResult
 * @property {FunctionalStatus} functionalStatus
 * @property {MedicationOptimisation} medicationOptimisation
 * @property {ReviewStatus} reviewStatus
 * @property {number} completenessScore    - 0..100
 * @property {DomainStatus[]} domainStatuses
 * @property {FiredRule[]} firedRules
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.HeartFailureReview`.

/**
 * The four pillars of guideline-directed medical therapy, in order. Each entry
 * names the medication section prefix and a human-readable label used across
 * the optimisation grade and the report.
 * @type {{ key: string, label: string, short: string }[]}
 */
const PILLARS = [
  { key: 'raasInhibitor',  label: 'ACEi / ARB / ARNI (renin–angiotensin system inhibitor)', short: 'RAAS inhibitor' },
  { key: 'betaBlocker',    label: 'Beta-blocker licensed for heart failure',                 short: 'Beta-blocker' },
  { key: 'mra',            label: 'Mineralocorticoid receptor antagonist (MRA)',             short: 'MRA' },
  { key: 'sglt2Inhibitor', label: 'SGLT2 inhibitor',                                         short: 'SGLT2 inhibitor' }
];

/**
 * Build a fresh, fully-blank review. Text / enum fields default to `''`;
 * numeric, date, and time fields default to `null`.
 * @returns {ReviewData}
 */
function emptyReview() {
  return {
    context: {
      clinicianName: '',
      clinicianRole: '',
      reviewDate: '',
      careSetting: '',
      reviewType: '',
      lastReviewDate: ''
    },
    identification: {
      patientIdentifier: '',
      ageBand: '',
      sex: ''
    },
    diagnosis: {
      yearOfDiagnosis: null,
      heartFailureType: '',
      latestLvef: null,
      lastEchoDate: '',
      aetiology: ''
    },
    functional: {
      nyhaClass: null,
      breathlessness: '',
      orthopnoea: '',
      paroxysmalNocturnalDyspnoea: '',
      fatigue: '',
      changeSinceLastReview: '',
      decompensation: ''
    },
    fluid: {
      weightKg: null,
      weightChangeKg: null,
      peripheralOedema: '',
      raisedJvp: '',
      lungCrackles: '',
      systolicBloodPressure: null,
      diastolicBloodPressure: null,
      heartRate: null,
      heartRhythm: ''
    },
    investigations: {
      ntProBnp: null,
      sodium: null,
      potassium: null,
      urea: null,
      creatinine: null,
      egfr: null,
      haemoglobin: null,
      ferritin: null,
      transferrinSaturation: null,
      hba1c: null,
      bloodsDate: ''
    },
    medication: {
      raasInhibitorStatus: '',
      raasInhibitorAgent: '',
      raasInhibitorDose: '',
      raasInhibitorAtTargetDose: '',
      raasInhibitorAdherence: '',
      betaBlockerStatus: '',
      betaBlockerAgent: '',
      betaBlockerDose: '',
      betaBlockerAtTargetDose: '',
      betaBlockerAdherence: '',
      mraStatus: '',
      mraAgent: '',
      mraDose: '',
      mraAtTargetDose: '',
      mraAdherence: '',
      sglt2InhibitorStatus: '',
      sglt2InhibitorAgent: '',
      sglt2InhibitorDose: '',
      sglt2InhibitorAtTargetDose: '',
      sglt2InhibitorAdherence: '',
      loopDiureticAgent: '',
      loopDiureticDose: '',
      otherMedications: ''
    },
    devices: {
      icd: '',
      crt: '',
      pacemaker: '',
      deviceCheckStatus: ''
    },
    vaccinations: {
      influenzaVaccination: '',
      pneumococcalVaccination: '',
      covidVaccination: '',
      smokingStatus: '',
      alcoholStatus: '',
      dailyWeights: '',
      selfManagementPlan: '',
      cardiacRehab: ''
    },
    summary: {
      reviewContext: ''
    }
  };
}

/** NYHA functional-status label for display. */
function functionalStatusLabel(status) {
  switch (status) {
    case 'stable': return 'Stable (NYHA I–II)';
    case 'symptomatic': return 'Symptomatic (NYHA III)';
    case 'advanced': return 'Advanced (NYHA IV)';
    case 'unknown': return 'Not assessed';
    default: return '';
  }
}

/** CSS class hint for the functional-status badge (shared risk palette). */
function functionalStatusClass(status) {
  switch (status) {
    case 'stable': return 'risk-low';
    case 'symptomatic': return 'risk-moderate';
    case 'advanced': return 'risk-high';
    default: return '';
  }
}

/** Medication-optimisation-status label for display. */
function optimisationStatusLabel(status) {
  switch (status) {
    case 'optimised': return 'Optimised';
    case 'partial': return 'Partially optimised';
    case 'suboptimal': return 'Suboptimal';
    case 'not-applicable': return 'Not applicable';
    default: return '';
  }
}

/** CSS class hint for the optimisation-status badge (shared risk palette). */
function optimisationStatusClass(status) {
  switch (status) {
    case 'optimised': return 'risk-low';
    case 'partial': return 'risk-moderate';
    case 'suboptimal': return 'risk-high';
    default: return '';
  }
}

/** Review-completeness-status label for display. */
function reviewStatusLabel(status) {
  switch (status) {
    case 'complete': return 'Complete';
    case 'partial': return 'Partial';
    case 'incomplete': return 'Incomplete';
    default: return '';
  }
}

/** CSS class hint for the review-status badge (shared risk palette). */
function reviewStatusClass(status) {
  switch (status) {
    case 'complete': return 'risk-low';
    case 'partial': return 'risk-moderate';
    case 'incomplete': return 'risk-high';
    default: return '';
  }
}

/** Heart-failure-type label for display. */
function heartFailureTypeLabel(type) {
  switch (type) {
    case 'reduced': return 'Reduced EF (HFrEF)';
    case 'mildly-reduced': return 'Mildly-reduced EF (HFmrEF)';
    case 'preserved': return 'Preserved EF (HFpEF)';
    case 'unknown': return 'Unknown';
    default: return '';
  }
}

/** Reviewing-clinician role label. */
function clinicianRoleLabel(role) {
  switch (role) {
    case 'gp': return 'General practitioner';
    case 'practice-nurse': return 'Practice nurse';
    case 'hf-nurse': return 'Heart-failure specialist nurse';
    case 'pharmacist': return 'Clinical pharmacist';
    case 'cardiologist': return 'Cardiologist';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Care-setting label. */
function careSettingLabel(setting) {
  switch (setting) {
    case 'general-practice': return 'General practice';
    case 'community-hf-service': return 'Community heart-failure service';
    case 'hospital-clinic': return 'Hospital clinic';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Pillar prescribing-status label. */
function pillarStatusLabel(status) {
  switch (status) {
    case 'prescribed': return 'Prescribed';
    case 'not-prescribed': return 'Not prescribed';
    case 'contraindicated': return 'Contraindicated';
    case 'not-tolerated': return 'Not tolerated';
    default: return 'Not recorded';
  }
}

/** Patient-sex label. */
function sexLabel(sex) {
  switch (sex) {
    case 'female': return 'Female';
    case 'male': return 'Male';
    case 'intersex': return 'Intersex';
    case 'unknown': return 'Unknown';
    default: return '';
  }
}

/** Adult age-band label. */
function ageBandLabel(band) {
  switch (band) {
    case '18-39': return '18–39';
    case '40-59': return '40–59';
    case '60-79': return '60–79';
    case '>=80': return '80 and over';
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

export { PILLARS, emptyReview, functionalStatusLabel, functionalStatusClass, optimisationStatusLabel, optimisationStatusClass, reviewStatusLabel, reviewStatusClass, heartFailureTypeLabel, clinicianRoleLabel, careSettingLabel, pillarStatusLabel, sexLabel, ageBandLabel, priorityLabel };
