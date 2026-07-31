// Plain-JavaScript / JSDoc type definitions for the Inpatient Clinical Note
// form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_inpatient_clinical_note.sql` and its four child tables.
// This file builds and exports the canonical empty AssessmentData shape used by
// the wizard, so that newly-added fields default correctly when older saved
// state is rehydrated from localStorage. It also exports the component table and
// the display-label maps.
//
// Two engines run over this shape (spec §4 and §5):
//
//   completeness — grades the record Complete / Partial / Incomplete against the
//                  components required FOR ITS NOTE TYPE, and reports a
//                  percentage. Never overridable.
//   acuity       — assigns Stable / Watch / Escalate / Critical by max-band over
//                  NEWS2 and the deterioration markers. Overridable by the
//                  author with a recorded reason.
//
// Neither is a diagnostic output. A Complete grade means the record is well
// documented, not that the care was correct.

/**
 * @typedef {'admission-clerking' | 'progress' | 'consult' | 'event' | 'procedure' | 'handover' | 'transfer' | 'discharge-planning' | ''} NoteType
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'complete' | 'partial' | 'incomplete'} CompletenessStatus
 * @typedef {'stable' | 'watch' | 'escalate' | 'critical'} AcuityBand
 * @typedef {'high' | 'medium' | 'low'} Priority
 * @typedef {'alert' | 'confusion' | 'voice' | 'pain' | 'unresponsive' | ''} Acvpu
 */

/**
 * Step 1 — note identification, plus the note-type-specific context fields.
 * @typedef {Object} Header
 * @property {NoteType} noteType
 * @property {string} hospitalName
 * @property {string} wardName
 * @property {string} bedNumber
 * @property {string} noteAt          - datetime-local string; '' when unset
 * @property {string} authorName
 * @property {string} authorGrade
 * @property {string} authorRegistrationNumber
 * @property {string} parentSpecialty
 * @property {string} responsibleConsultantName
 * @property {string} consultQuestion
 * @property {string} consultRequestingTeam
 * @property {string} procedurePerformed
 * @property {string} procedureDetail
 * @property {string} procedureConsent
 * @property {string} procedureComplications
 * @property {string} transferFromWard
 * @property {string} transferToWard
 * @property {string} transferReason
 */

/**
 * Step 2 — patient and admission context.
 * @typedef {Object} Admission
 * @property {string} patientName
 * @property {string} nhsNumber
 * @property {string} hospitalMrn
 * @property {string} birthDate        - yyyy-mm-dd; '' when unset
 * @property {string} sex
 * @property {string} admissionAt      - datetime-local string; '' when unset
 * @property {string} admittingSpecialty
 * @property {string} admissionMethod
 * @property {string} admissionReason
 */

/**
 * Step 3 — interval history.
 * @typedef {Object} Interval
 * @property {string} intervalHistory
 * @property {YesNo} noIntervalEvents  - explicit "no events since last entry"
 * @property {string} overnightEvents
 * @property {string} patientReportedSymptoms
 * @property {string} nursingConcerns
 * @property {number | null} painScore
 * @property {string} sleepQuality
 * @property {string} oralIntake
 * @property {string} bowelsLastOpened - yyyy-mm-dd; '' when unset
 * @property {string} mobilityStatus
 */

/**
 * Step 4 — observations and NEWS2.
 * @typedef {Object} Observations
 * @property {string} observedAt
 * @property {number | null} respiratoryRate
 * @property {number | null} oxygenSaturation
 * @property {string} spo2Scale
 * @property {string} oxygenDelivery
 * @property {number | null} oxygenFlowLitresPerMinute
 * @property {number | null} systolicBloodPressure
 * @property {number | null} diastolicBloodPressure
 * @property {number | null} pulseRate
 * @property {Acvpu} acvpu
 * @property {number | null} temperatureCelsius
 * @property {number | null} news2Total     - as entered from the ward chart
 * @property {string} news2Trend
 * @property {YesNo} news2Applicable
 * @property {string} news2NotApplicableReason
 */

/**
 * Step 5 — examination findings by system.
 * @typedef {Object} Examination
 * @property {string} general
 * @property {string} cardiovascular
 * @property {string} respiratory
 * @property {string} abdominal
 * @property {string} neurological
 * @property {string} musculoskeletal
 * @property {string} skinAndWounds
 * @property {string} linesAndDrains
 * @property {string} other
 */

/**
 * One investigations-reviewed row (child table).
 * @typedef {Object} InvestigationRow
 * @property {string} testName
 * @property {string} category
 * @property {string} requestedDate
 * @property {string} resultDate
 * @property {string} resultSummary
 * @property {YesNo} abnormal
 * @property {YesNo} actioned
 * @property {string} actionTaken
 */

/**
 * Step 6 — investigations reviewed.
 * @typedef {Object} Investigations
 * @property {InvestigationRow[]} rows
 * @property {YesNo} noInvestigationsReviewed
 */

/**
 * One problem-list row (child table).
 * @typedef {Object} ProblemRow
 * @property {string} problem
 * @property {string} category
 * @property {string} status
 * @property {string} priority
 * @property {string} onsetDate
 * @property {string} progressCommentary
 */

/**
 * Step 7 — problem list.
 * @typedef {Object} Problems
 * @property {ProblemRow[]} rows
 */

/**
 * One prescribing-change row (child table).
 * @typedef {Object} MedicationRow
 * @property {string} drugName
 * @property {string} action
 * @property {string} dose
 * @property {string} route
 * @property {string} frequency
 * @property {string} indication
 * @property {YesNo} isAntimicrobial
 * @property {string} reviewDate
 * @property {string} notes
 */

/**
 * Step 8 — medications and prescribing.
 * @typedef {Object} Medications
 * @property {MedicationRow[]} rows
 * @property {YesNo} noMedicationChanges
 * @property {YesNo} allergyChecked
 * @property {string} medicinesReconciliationStatus
 * @property {string} antimicrobialReviewStatus
 */

/**
 * Step 9 — mandatory inpatient risk assessments.
 * @typedef {Object} Risks
 * @property {string} vteStatus
 * @property {string} vteProphylaxis
 * @property {string} vteNotes
 * @property {string} fallsRisk
 * @property {string} fallsInterventions
 * @property {string} pressureUlcerRisk
 * @property {string} skinIntegrity
 * @property {string} pressureUlcerGrade
 * @property {string} pressureUlcerSites
 * @property {string} deliriumScreen
 * @property {number | null} delirium4atScore
 * @property {string} deliriumNotes
 * @property {string} nutritionScreen
 * @property {number | null} mustScore
 * @property {string} nutritionPlan
 * @property {string} infectionStatus
 * @property {string} isolationStatus
 * @property {string} organism
 * @property {YesNo} safeguardingConcern
 * @property {string} safeguardingNotes
 * @property {YesNo} safeguardingReferralMade
 */

/**
 * Step 10 — assessment, impression, and deterioration markers.
 * @typedef {Object} Assessment
 * @property {string} clinicalImpression
 * @property {string} differentialDiagnosis
 * @property {string} responseToTreatment
 * @property {YesNo} newOxygenRequirement
 * @property {YesNo} newConfusion
 * @property {string} sepsisScreen
 * @property {string} arrestCall
 * @property {YesNo} criticalCareReferral
 * @property {string} newOrganSupport
 */

/**
 * One outstanding-job row (child table).
 * @typedef {Object} JobRow
 * @property {string} job
 * @property {string} category
 * @property {string} owner
 * @property {string} priority
 * @property {string} dueAt
 * @property {string} status
 */

/**
 * Step 11 — plan, jobs, and escalation.
 * @typedef {Object} Planning
 * @property {string} plan
 * @property {JobRow[]} jobs
 * @property {string} escalationStatus
 * @property {string} escalationAction
 * @property {string} ceilingOfCare
 * @property {string} respectStatus
 * @property {string} dnacprStatus
 * @property {YesNo} seniorReviewNeeded
 * @property {string} seniorReviewBy
 * @property {string} estimatedDischargeDate
 * @property {string} dischargePlanningNotes
 */

/**
 * Step 12 — communication and sign-off.
 * @typedef {Object} SignOff
 * @property {string} familyCommunication
 * @property {string} patientCommunication
 * @property {string} teamHandover
 * @property {string} consentStatus
 * @property {YesNo} capacityAssessed
 * @property {string} capacityNotes
 * @property {string} authorOverrideAcuity
 * @property {string} authorOverrideReason
 * @property {string} attestationText
 * @property {string} electronicSignature
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Header} header
 * @property {Admission} admission
 * @property {Interval} interval
 * @property {Observations} observations
 * @property {Examination} examination
 * @property {Investigations} investigations
 * @property {Problems} problems
 * @property {Medications} medications
 * @property {Risks} risks
 * @property {Assessment} assessment
 * @property {Planning} planning
 * @property {SignOff} signOff
 */

/**
 * Per-component presence row.
 * @typedef {Object} ComponentStatus
 * @property {string} component
 * @property {string} label
 * @property {boolean} required   - required for THIS note type
 * @property {boolean} present
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} engine       - completeness | acuity
 * @property {string} component
 * @property {string} band         - for acuity rules: the band proposed
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
 * @property {CompletenessStatus} status
 * @property {number} completenessPercent
 * @property {AcuityBand} acuityBand           - final band, after any override
 * @property {AcuityBand} computedAcuityBand   - what the engine computed
 * @property {boolean} acuityOverridden
 * @property {number | null} news2Total        - the total the band was computed from
 * @property {number | null} news2DerivedTotal - derived from the seven parameters
 * @property {ComponentStatus[]} componentStatuses
 * @property {string[]} documentedComponents
 * @property {number} documentedRequired
 * @property {number} totalRequired
 * @property {FiredRule[]} firedRules
 * @property {FlaggedIssue[]} flags
 * @property {string} timestamp
 */

/**
 * Build a fresh, fully-blank note. Text and enum fields default to `''`;
 * numeric, date, and time fields default to `null` or `''` per the repo
 * convention; child collections default to an empty array.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    header: {
      noteType: '',
      hospitalName: '',
      wardName: '',
      bedNumber: '',
      noteAt: '',
      authorName: '',
      authorGrade: '',
      authorRegistrationNumber: '',
      parentSpecialty: '',
      responsibleConsultantName: '',
      consultQuestion: '',
      consultRequestingTeam: '',
      procedurePerformed: '',
      procedureDetail: '',
      procedureConsent: '',
      procedureComplications: '',
      transferFromWard: '',
      transferToWard: '',
      transferReason: ''
    },
    admission: {
      patientName: '',
      nhsNumber: '',
      hospitalMrn: '',
      birthDate: '',
      sex: '',
      admissionAt: '',
      admittingSpecialty: '',
      admissionMethod: '',
      admissionReason: ''
    },
    interval: {
      intervalHistory: '',
      noIntervalEvents: '',
      overnightEvents: '',
      patientReportedSymptoms: '',
      nursingConcerns: '',
      painScore: null,
      sleepQuality: '',
      oralIntake: '',
      bowelsLastOpened: '',
      mobilityStatus: ''
    },
    observations: {
      observedAt: '',
      respiratoryRate: null,
      oxygenSaturation: null,
      spo2Scale: 'scale-1',
      oxygenDelivery: '',
      oxygenFlowLitresPerMinute: null,
      systolicBloodPressure: null,
      diastolicBloodPressure: null,
      pulseRate: null,
      acvpu: '',
      temperatureCelsius: null,
      news2Total: null,
      news2Trend: '',
      news2Applicable: '',
      news2NotApplicableReason: ''
    },
    examination: {
      general: '',
      cardiovascular: '',
      respiratory: '',
      abdominal: '',
      neurological: '',
      musculoskeletal: '',
      skinAndWounds: '',
      linesAndDrains: '',
      other: ''
    },
    investigations: {
      rows: [],
      noInvestigationsReviewed: ''
    },
    problems: {
      rows: []
    },
    medications: {
      rows: [],
      noMedicationChanges: '',
      allergyChecked: '',
      medicinesReconciliationStatus: '',
      antimicrobialReviewStatus: ''
    },
    risks: {
      vteStatus: '',
      vteProphylaxis: '',
      vteNotes: '',
      fallsRisk: '',
      fallsInterventions: '',
      pressureUlcerRisk: '',
      skinIntegrity: '',
      pressureUlcerGrade: '',
      pressureUlcerSites: '',
      deliriumScreen: '',
      delirium4atScore: null,
      deliriumNotes: '',
      nutritionScreen: '',
      mustScore: null,
      nutritionPlan: '',
      infectionStatus: '',
      isolationStatus: '',
      organism: '',
      safeguardingConcern: '',
      safeguardingNotes: '',
      safeguardingReferralMade: ''
    },
    assessment: {
      clinicalImpression: '',
      differentialDiagnosis: '',
      responseToTreatment: '',
      newOxygenRequirement: '',
      newConfusion: '',
      sepsisScreen: '',
      arrestCall: '',
      criticalCareReferral: '',
      newOrganSupport: ''
    },
    planning: {
      plan: '',
      jobs: [],
      escalationStatus: '',
      escalationAction: '',
      ceilingOfCare: '',
      respectStatus: '',
      dnacprStatus: '',
      seniorReviewNeeded: '',
      seniorReviewBy: '',
      estimatedDischargeDate: '',
      dischargePlanningNotes: ''
    },
    signOff: {
      familyCommunication: '',
      patientCommunication: '',
      teamHandover: '',
      consentStatus: '',
      capacityAssessed: '',
      capacityNotes: '',
      authorOverrideAcuity: '',
      authorOverrideReason: '',
      attestationText: '',
      electronicSignature: ''
    }
  };
}

/** Build one blank investigation row. */
function emptyInvestigationRow() {
  return {
    testName: '',
    category: '',
    requestedDate: '',
    resultDate: '',
    resultSummary: '',
    abnormal: '',
    actioned: '',
    actionTaken: ''
  };
}

/** Build one blank problem row. */
function emptyProblemRow() {
  return {
    problem: '',
    category: '',
    status: '',
    priority: '',
    onsetDate: '',
    progressCommentary: ''
  };
}

/** Build one blank medication-change row. */
function emptyMedicationRow() {
  return {
    drugName: '',
    action: '',
    dose: '',
    route: '',
    frequency: '',
    indication: '',
    isAntimicrobial: '',
    reviewDate: '',
    notes: ''
  };
}

/** Build one blank job row. */
function emptyJobRow() {
  return {
    job: '',
    category: '',
    owner: '',
    priority: '',
    dueAt: '',
    status: ''
  };
}

/**
 * The twelve note components, in order, with their BASE required/recommended
 * class. The effective required set additionally depends on the note type —
 * see `NOTE_TYPE_EXTRA_REQUIRED` and `rules.js`.
 */
const COMPONENTS = [
  { component: 'header',           label: 'Note header',            baseRequired: true },
  { component: 'interval-history', label: 'Interval history',       baseRequired: true },
  { component: 'observations',     label: 'Observations and NEWS2', baseRequired: true },
  { component: 'examination',      label: 'Examination',            baseRequired: false },
  { component: 'investigations',   label: 'Investigations reviewed', baseRequired: false },
  { component: 'problems',         label: 'Problem list',           baseRequired: true },
  { component: 'medications',      label: 'Medications',            baseRequired: true },
  { component: 'risk-assessments', label: 'Risk assessments',       baseRequired: true },
  { component: 'impression',       label: 'Clinical impression',    baseRequired: true },
  { component: 'plan',             label: 'Plan and jobs',          baseRequired: true },
  { component: 'escalation',       label: 'Escalation status',      baseRequired: true },
  { component: 'communication',    label: 'Communication',          baseRequired: false }
];

/**
 * Components each note type requires ON TOP of the base required set
 * (spec §4.2). A note type absent from this map requires only the base set.
 */
const NOTE_TYPE_EXTRA_REQUIRED = {
  'admission-clerking': ['examination', 'investigations'],
  'progress': [],
  'consult': ['examination', 'communication'],
  'event': [],
  'procedure': ['examination', 'communication'],
  'handover': [],
  'transfer': ['communication'],
  'discharge-planning': ['communication']
};

/** The three components whose absence forces an `incomplete` grade (spec §4.3). */
const CRITICAL_COMPONENTS = ['header', 'impression', 'plan'];

/** Acuity bands in ascending severity order, for max-band comparison. */
const ACUITY_ORDER = ['stable', 'watch', 'escalate', 'critical'];

/** Note-type label. */
function noteTypeLabel(t) {
  switch (t) {
    case 'admission-clerking': return 'Admission clerking';
    case 'progress': return 'Progress note';
    case 'consult': return 'Consult note';
    case 'event': return 'Event / deterioration note';
    case 'procedure': return 'Bedside procedure note';
    case 'handover': return 'Handover note';
    case 'transfer': return 'Transfer note';
    case 'discharge-planning': return 'Discharge-planning note';
    default: return '';
  }
}

/** Completeness-status label for display. */
function statusLabel(status) {
  switch (status) {
    case 'complete': return 'Complete';
    case 'partial': return 'Partial';
    case 'incomplete': return 'Incomplete';
    default: return '';
  }
}

/** CSS class hint for the completeness-status badge (shared risk palette). */
function statusClass(status) {
  switch (status) {
    case 'complete': return 'risk-low';
    case 'partial': return 'risk-moderate';
    case 'incomplete': return 'risk-high';
    default: return '';
  }
}

/** Acuity-band label for display. */
function acuityLabel(band) {
  switch (band) {
    case 'stable': return 'Stable';
    case 'watch': return 'Watch';
    case 'escalate': return 'Escalate';
    case 'critical': return 'Critical';
    default: return '';
  }
}

/** CSS class hint for the acuity badge (shared risk palette). */
function acuityClass(band) {
  switch (band) {
    case 'stable': return 'risk-low';
    case 'watch': return 'risk-moderate';
    case 'escalate': return 'risk-high';
    case 'critical': return 'risk-critical';
    default: return '';
  }
}

/** ACVPU label. */
function acvpuLabel(v) {
  switch (v) {
    case 'alert': return 'Alert';
    case 'confusion': return 'New confusion';
    case 'voice': return 'Responds to voice';
    case 'pain': return 'Responds to pain';
    case 'unresponsive': return 'Unresponsive';
    default: return '';
  }
}

/** VTE-status label. */
function vteStatusLabel(status) {
  switch (status) {
    case 'done': return 'Assessed';
    case 'not-done': return 'Not done';
    case 'not-applicable': return 'Not applicable';
    default: return '';
  }
}

/** Escalation-status label. */
function escalationStatusLabel(status) {
  switch (status) {
    case 'for-full-escalation': return 'For full escalation';
    case 'for-ward-based-care': return 'For ward-based care';
    case 'for-hdu': return 'For HDU';
    case 'for-icu': return 'For ICU';
    case 'palliative': return 'Palliative';
    case 'under-review': return 'Under review';
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

export {
  emptyAssessment,
  emptyInvestigationRow,
  emptyProblemRow,
  emptyMedicationRow,
  emptyJobRow,
  COMPONENTS,
  NOTE_TYPE_EXTRA_REQUIRED,
  CRITICAL_COMPONENTS,
  ACUITY_ORDER,
  noteTypeLabel,
  statusLabel,
  statusClass,
  acuityLabel,
  acuityClass,
  acvpuLabel,
  vteStatusLabel,
  escalationStatusLabel,
  priorityLabel
};
