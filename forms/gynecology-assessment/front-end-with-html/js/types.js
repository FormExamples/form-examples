// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Gynecology Assessment form.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage.

/**
 * @typedef {'female' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'pre-menopausal' | 'peri-menopausal' | 'post-menopausal' | 'unknown' | ''} MenopausalStatus
 * @typedef {'light' | 'moderate' | 'heavy' | 'very-heavy' | ''} FlowHeaviness
 * @typedef {0 | 1 | 2 | 3 | null} PainSeverity
 * @typedef {'regular' | 'irregular' | 'absent' | ''} Regularity
 * @typedef {'normal' | 'abnormal' | 'inadequate' | 'awaiting' | 'unknown' | ''} SmearResult
 * @typedef {'complete' | 'partial' | 'none' | 'unknown' | ''} HPVVaccination
 * @typedef {0 | 1 | 2 | 3 | null} SymptomScore
 * @typedef {'stable' | 'improving' | 'worsening' | 'fluctuating' | ''} Progression
 */

/**
 * @typedef {Object} Demographics
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 * @property {Sex} sex
 * @property {MenopausalStatus} menopausalStatus
 */

/**
 * @typedef {Object} ChiefComplaint
 * @property {string} primaryConcern
 * @property {string} duration
 * @property {Progression} progression
 * @property {string} previousTreatments
 */

/**
 * @typedef {Object} MenstrualHistory
 * @property {number | null} cycleLength
 * @property {number | null} cycleDuration
 * @property {FlowHeaviness} flowHeaviness
 * @property {PainSeverity} painSeverity
 * @property {Regularity} regularity
 * @property {string} lastMenstrualPeriod
 */

/**
 * @typedef {Object} GynecologicalSymptoms
 * @property {SymptomScore} pelvicPain
 * @property {SymptomScore} abnormalBleeding
 * @property {SymptomScore} discharge
 * @property {SymptomScore} urinarySymptoms
 */

/**
 * @typedef {Object} CervicalScreening
 * @property {string} lastSmearDate
 * @property {SmearResult} lastSmearResult
 * @property {HPVVaccination} hpvVaccination
 */

/**
 * @typedef {Object} ObstetricHistory
 * @property {number | null} gravida
 * @property {number | null} para
 * @property {string} complications
 */

/**
 * @typedef {Object} SexualHealth
 * @property {YesNo} sexuallyActive
 * @property {string} contraceptionMethod
 * @property {YesNo} stiHistory
 * @property {string} stiDetails
 */

/**
 * @typedef {Object} MedicalHistory
 * @property {string} previousGynConditions
 * @property {string} chronicDiseases
 * @property {string} surgicalHistory
 * @property {YesNo} autoimmuneDiseases
 * @property {string} autoimmuneDiseaseDetails
 */

/**
 * @typedef {Object} Medication
 * @property {string} name
 * @property {string} dose
 * @property {string} frequency
 */

/**
 * @typedef {Object} CurrentMedications
 * @property {Medication[]} hormonal
 * @property {Medication[]} nonHormonal
 * @property {string} supplements
 */

/**
 * @typedef {Object} FamilyHistory
 * @property {YesNo} breastCancer
 * @property {YesNo} ovarianCancer
 * @property {YesNo} cervicalCancer
 * @property {YesNo} endometriosis
 * @property {YesNo} pcos
 * @property {string} otherDetails
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {ChiefComplaint} chiefComplaint
 * @property {MenstrualHistory} menstrualHistory
 * @property {GynecologicalSymptoms} gynecologicalSymptoms
 * @property {CervicalScreening} cervicalScreening
 * @property {ObstetricHistory} obstetricHistory
 * @property {SexualHealth} sexualHealth
 * @property {MedicalHistory} medicalHistory
 * @property {CurrentMedications} currentMedications
 * @property {FamilyHistory} familyHistory
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} domain
 * @property {string} description
 * @property {number} score
 */

/**
 * @typedef {Object} AdditionalFlag
 * @property {string} id
 * @property {string} category
 * @property {string} message
 * @property {'high' | 'medium' | 'low'} priority
 */

/**
 * @typedef {Object} GradingResult
 * @property {number} symptomScore
 * @property {string} symptomCategory
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric fields default to `null`; lists default to `[]`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    demographics: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      sex: '',
      menopausalStatus: ''
    },
    chiefComplaint: {
      primaryConcern: '',
      duration: '',
      progression: '',
      previousTreatments: ''
    },
    menstrualHistory: {
      cycleLength: null,
      cycleDuration: null,
      flowHeaviness: '',
      painSeverity: null,
      regularity: '',
      lastMenstrualPeriod: ''
    },
    gynecologicalSymptoms: {
      pelvicPain: null,
      abnormalBleeding: null,
      discharge: null,
      urinarySymptoms: null
    },
    cervicalScreening: {
      lastSmearDate: '',
      lastSmearResult: '',
      hpvVaccination: ''
    },
    obstetricHistory: {
      gravida: null,
      para: null,
      complications: ''
    },
    sexualHealth: {
      sexuallyActive: '',
      contraceptionMethod: '',
      stiHistory: '',
      stiDetails: ''
    },
    medicalHistory: {
      previousGynConditions: '',
      chronicDiseases: '',
      surgicalHistory: '',
      autoimmuneDiseases: '',
      autoimmuneDiseaseDetails: ''
    },
    currentMedications: {
      hormonal: [],
      nonHormonal: [],
      supplements: ''
    },
    familyHistory: {
      breastCancer: '',
      ovarianCancer: '',
      cervicalCancer: '',
      endometriosis: '',
      pcos: '',
      otherDetails: ''
    }
  };
}

/** Calculate age from date of birth string. */
function calculateAge(dob) {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

/**
 * Symptom Severity Score category label.
 *   0-5  = Minimal
 *   6-10 = Mild
 *   11-20 = Moderate
 *   21-30 = Severe
 */
function severityCategory(score) {
  if (score <= 5) return 'Minimal';
  if (score <= 10) return 'Mild';
  if (score <= 20) return 'Moderate';
  return 'Severe';
}

/** CSS class for severity badge. */
function severityClass(score) {
  if (score <= 5) return 'severity-minimal';
  if (score <= 10) return 'severity-mild';
  if (score <= 20) return 'severity-moderate';
  return 'severity-severe';
}

/** Menopausal status display label. */
function menopausalStatusLabel(status) {
  switch (status) {
    case 'pre-menopausal': return 'Pre-menopausal';
    case 'peri-menopausal': return 'Peri-menopausal';
    case 'post-menopausal': return 'Post-menopausal';
    case 'unknown': return 'Unknown';
    default: return '';
  }
}

export { emptyAssessment, calculateAge, severityCategory, severityClass, menopausalStatusLabel };
