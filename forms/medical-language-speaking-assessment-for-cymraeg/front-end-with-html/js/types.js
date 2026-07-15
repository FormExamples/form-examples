// Plain-JavaScript / JSDoc type definitions for the Medical Language Speaking
// Assessment for Cymraeg (clinical Welsh-language speaking assessment).
//
// This file builds the canonical empty AssessmentData shape used by the
// wizard, plus small label/class helpers and the criterion registry that
// other engine files reference. Older saved state rehydrated from
// localStorage is merged over the fresh empty so newly-added fields always
// default correctly.

/**
 * @typedef {'A' | 'B' | 'C+' | 'C' | 'D' | 'E' | ''} OETGrade
 *
 * @typedef {Object} CandidateDetails
 * @property {string} candidateId
 * @property {string} candidateName
 * @property {string} examinerName
 * @property {string} testCentre
 * @property {string} testDate
 * @property {string} profession   // always 'medicine' for this form
 * @property {string} firstLanguage
 * @property {string} countryOfTraining
 * @property {string} yearsOfExperience
 */

/**
 * @typedef {Object} RolePlayContext
 * @property {string} scenarioTitle      // examiner-supplied scenario name
 * @property {string} scenarioSummary    // brief description of the scenario
 * @property {string} patientRole        // who the interlocutor is playing
 * @property {string} setting            // e.g. 'meddygfa', 'ysbyty', 'ward'
 * @property {'low' | 'standard' | 'high' | ''} safetyCriticality
 * @property {string} examinerNotes
 */

/**
 * Linguistic ratings are 0-6 per criterion, captured separately for each
 * of the two role-plays. Null means not yet rated.
 *
 * @typedef {Object} LinguisticRating
 * @property {number | null} fluency
 * @property {number | null} grammar
 * @property {number | null} pronunciation
 * @property {number | null} clinicalAppropriateness
 */

/**
 * Clinical communication indicators are rated 0-3 across the whole
 * speaking assessment (not per role-play).
 *
 * @typedef {Object} ClinicalIndicators
 * @property {number | null} relationshipBuilding
 * @property {number | null} understandingPatientPerspective
 * @property {number | null} providingStructure
 * @property {number | null} informationGathering
 * @property {number | null} informationGiving
 * @property {string} examinerNotes
 */

/**
 * @typedef {Object} AssessmentData
 * @property {CandidateDetails} candidate
 * @property {RolePlayContext} rolePlay1
 * @property {RolePlayContext} rolePlay2
 * @property {LinguisticRating} linguisticRolePlay1
 * @property {LinguisticRating} linguisticRolePlay2
 * @property {ClinicalIndicators} clinicalIndicators
 */

/**
 * @typedef {Object} CriterionScore
 * @property {string} id
 * @property {'linguistic' | 'clinical'} domain
 * @property {string} label
 * @property {number} maxScore
 * @property {number | null} rolePlay1Score
 * @property {number | null} rolePlay2Score
 * @property {number | null} meanScore
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {number} score
 */

/**
 * @typedef {Object} GradingResult
 * @property {number} linguisticTotal      // 0-24 (mean across role-plays)
 * @property {number} clinicalTotal        // 0-15
 * @property {number} rawTotal             // 0-39
 * @property {number} scaledScore          // 0-500
 * @property {OETGrade} grade
 * @property {CriterionScore[]} perCriterionScores
 * @property {FiredRule[]} firedRules
 */

/**
 * @typedef {Object} AdditionalFlag
 * @property {string} id
 * @property {string} category
 * @property {string} message
 * @property {'high' | 'medium' | 'low'} priority
 */

/**
 * @typedef {Object} AssessmentReport
 * @property {GradingResult} grading
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric ratings default to `null`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    candidate: {
      candidateId: '',
      candidateName: '',
      examinerName: '',
      testCentre: '',
      testDate: '',
      profession: 'medicine',
      firstLanguage: '',
      countryOfTraining: '',
      yearsOfExperience: ''
    },
    rolePlay1: {
      scenarioTitle: '',
      scenarioSummary: '',
      patientRole: '',
      setting: '',
      safetyCriticality: '',
      examinerNotes: ''
    },
    rolePlay2: {
      scenarioTitle: '',
      scenarioSummary: '',
      patientRole: '',
      setting: '',
      safetyCriticality: '',
      examinerNotes: ''
    },
    linguisticRolePlay1: {
      fluency: null,
      grammar: null,
      pronunciation: null,
      clinicalAppropriateness: null
    },
    linguisticRolePlay2: {
      fluency: null,
      grammar: null,
      pronunciation: null,
      clinicalAppropriateness: null
    },
    clinicalIndicators: {
      relationshipBuilding: null,
      understandingPatientPerspective: null,
      providingStructure: null,
      informationGathering: null,
      informationGiving: null,
      examinerNotes: ''
    }
  };
}

/**
 * Friendly label for a numeric grade (CEFR-mapped).
 * @param {OETGrade} grade
 */
function gradeLabel(grade) {
  switch (grade) {
    case 'A':  return 'A — Expert user (CEFR C2)';
    case 'B':  return 'B — Highly proficient, clinically safe (CEFR C1)';
    case 'C+': return 'C+ — Proficient, borderline above clinical threshold (CEFR B2+)';
    case 'C':  return 'C — Competent, below typical clinical threshold (CEFR B2)';
    case 'D':  return 'D — Modest, significant communication concerns (CEFR B1)';
    case 'E':  return 'E — Limited, unsuitable for Welsh-medium clinical practice (CEFR A2 or below)';
    default:   return '';
  }
}

/**
 * CSS class hint for the grade badge.
 * @param {OETGrade} grade
 */
function gradeClass(grade) {
  switch (grade) {
    case 'A':  return 'grade-a';
    case 'B':  return 'grade-b';
    case 'C+': return 'grade-c-plus';
    case 'C':  return 'grade-c';
    case 'D':  return 'grade-d';
    case 'E':  return 'grade-e';
    default:   return '';
  }
}

/**
 * Whether a grade is at or above the "typical clinical threshold" for
 * Welsh-medium clinical communication. Aligned to NHS Wales "More Than
 * Just Words" expectations for Welsh-essential clinical roles, where a
 * Grade B (CEFR C1) is the typical target; C+ is below that threshold
 * but above C.
 * @param {OETGrade} grade
 */
function isAtOrAboveClinicalThreshold(grade) {
  return grade === 'A' || grade === 'B';
}

/**
 * The criterion registry — single source of truth for the form, the
 * grader, and the report. Linguistic criteria are rated 0-6 and captured
 * once per role-play. Clinical communication indicators are rated 0-3 and
 * captured once across the whole assessment.
 *
 * @typedef {Object} Criterion
 * @property {string} id
 * @property {'linguistic' | 'clinical'} domain
 * @property {string} label
 * @property {string} description
 * @property {number} maxScore
 * @property {string} dataField  // property name on LinguisticRating or ClinicalIndicators
 *
 * @type {Criterion[]}
 */
const CRITERIA = [
  {
    id: 'LING-FLU',
    domain: 'linguistic',
    label: 'Fluency (Rhuglder)',
    description: 'Speech rate, smoothness, hesitations, and use of filler — the candidate\u2019s ability to sustain natural Welsh-language speech in a clinical encounter.',
    maxScore: 6,
    dataField: 'fluency'
  },
  {
    id: 'LING-GRM',
    domain: 'linguistic',
    label: 'Grammar (Gramadeg)',
    description: 'Range and accuracy of Welsh grammar, including mutations (treigladau), tense, agreement, and clause structure.',
    maxScore: 6,
    dataField: 'grammar'
  },
  {
    id: 'LING-PRO',
    domain: 'linguistic',
    label: 'Pronunciation (Ynganu)',
    description: 'Pronunciation, intonation, accent, rhythm, and stress in Welsh — including characteristic sounds (ll, ch, rh) and clarity for Welsh-speaking patients.',
    maxScore: 6,
    dataField: 'pronunciation'
  },
  {
    id: 'LING-APP',
    domain: 'linguistic',
    label: 'Clinical Appropriateness (Priodoldeb Clinigol)',
    description: 'Register, tone, professional Welsh medical vocabulary, dialect sensitivity (north/south Wales), and avoidance of unexplained jargon.',
    maxScore: 6,
    dataField: 'clinicalAppropriateness'
  },
  {
    id: 'CLIN-REL',
    domain: 'clinical',
    label: 'Relationship-building',
    description: 'Initiating the encounter in Welsh, demonstrating respect and empathy, and establishing rapport with Welsh-speaking patients.',
    maxScore: 3,
    dataField: 'relationshipBuilding'
  },
  {
    id: 'CLIN-UPP',
    domain: 'clinical',
    label: 'Understanding Patient\u2019s Perspective',
    description: 'Eliciting and responding to the patient\u2019s ideas, concerns, and expectations expressed in Welsh.',
    maxScore: 3,
    dataField: 'understandingPatientPerspective'
  },
  {
    id: 'CLIN-STR',
    domain: 'clinical',
    label: 'Providing Structure',
    description: 'Sequencing, signposting, summarising, and managing the time available, in Welsh.',
    maxScore: 3,
    dataField: 'providingStructure'
  },
  {
    id: 'CLIN-IGT',
    domain: 'clinical',
    label: 'Information-gathering',
    description: 'Open and closed questioning, active listening, and clarification of patient responses in Welsh.',
    maxScore: 3,
    dataField: 'informationGathering'
  },
  {
    id: 'CLIN-IGV',
    domain: 'clinical',
    label: 'Information-giving',
    description: 'Clear, structured, and patient-appropriate Welsh-language explanation, including checking understanding.',
    maxScore: 3,
    dataField: 'informationGiving'
  }
];

export { emptyAssessment, gradeLabel, gradeClass, isAtOrAboveClinicalThreshold, CRITERIA };
