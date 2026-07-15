// Plain-JavaScript / JSDoc type definitions for the Medical Language Speaking
// Assessment for English (OET Speaking Sub-test, Medicine profession).
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
 * @property {string} setting            // e.g. 'GP clinic', 'A&E', 'ward'
 * @property {'low' | 'standard' | 'high' | ''} safetyCriticality
 * @property {string} examinerNotes
 */

/**
 * Linguistic ratings are 0-6 per criterion, captured separately for each
 * of the two role-plays. Null means not yet rated.
 *
 * @typedef {Object} LinguisticRating
 * @property {number | null} intelligibility
 * @property {number | null} fluency
 * @property {number | null} appropriatenessOfLanguage
 * @property {number | null} resourcesOfGrammarAndExpression
 */

/**
 * Clinical communication indicators are rated 0-3 across the whole
 * speaking sub-test (not per role-play).
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
      intelligibility: null,
      fluency: null,
      appropriatenessOfLanguage: null,
      resourcesOfGrammarAndExpression: null
    },
    linguisticRolePlay2: {
      intelligibility: null,
      fluency: null,
      appropriatenessOfLanguage: null,
      resourcesOfGrammarAndExpression: null
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
 * Friendly label for a numeric OET grade.
 * @param {OETGrade} grade
 */
function gradeLabel(grade) {
  switch (grade) {
    case 'A':  return 'A — Expert user';
    case 'B':  return 'B — Highly proficient (clinically safe)';
    case 'C+': return 'C+ — Proficient (borderline above clinical threshold)';
    case 'C':  return 'C — Competent (below typical clinical threshold)';
    case 'D':  return 'D — Modest (significant communication concerns)';
    case 'E':  return 'E — Limited (unsuitable for clinical practice)';
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
 * Whether a grade is at or above the "typical clinical threshold". OET
 * regulators in the UK, Ireland, Australia, and New Zealand most commonly
 * require a B in each sub-test for medical registration; C+ is below that
 * threshold but above C.
 * @param {OETGrade} grade
 */
function isAtOrAboveClinicalThreshold(grade) {
  return grade === 'A' || grade === 'B';
}

/**
 * The criterion registry — single source of truth for the form, the
 * grader, and the report. Linguistic criteria are rated 0-6 and captured
 * once per role-play. Clinical communication indicators are rated 0-3 and
 * captured once across the whole sub-test.
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
    id: 'LING-INT',
    domain: 'linguistic',
    label: 'Intelligibility',
    description: 'Pronunciation, intonation, accent, rhythm, and stress — how easily the candidate can be understood.',
    maxScore: 6,
    dataField: 'intelligibility'
  },
  {
    id: 'LING-FLU',
    domain: 'linguistic',
    label: 'Fluency',
    description: 'Speech rate, smoothness, hesitations, and the use of filler.',
    maxScore: 6,
    dataField: 'fluency'
  },
  {
    id: 'LING-APP',
    domain: 'linguistic',
    label: 'Appropriateness of Language',
    description: 'Register, tone, professional vocabulary, and the avoidance of unexplained jargon.',
    maxScore: 6,
    dataField: 'appropriatenessOfLanguage'
  },
  {
    id: 'LING-GRM',
    domain: 'linguistic',
    label: 'Resources of Grammar & Expression',
    description: 'Range and accuracy of grammar and the breadth of expression available to the candidate.',
    maxScore: 6,
    dataField: 'resourcesOfGrammarAndExpression'
  },
  {
    id: 'CLIN-REL',
    domain: 'clinical',
    label: 'Relationship-building',
    description: 'Initiating the encounter, demonstrating respect and empathy, and establishing rapport.',
    maxScore: 3,
    dataField: 'relationshipBuilding'
  },
  {
    id: 'CLIN-UPP',
    domain: 'clinical',
    label: 'Understanding Patient\u2019s Perspective',
    description: 'Eliciting and responding to the patient\u2019s ideas, concerns, and expectations.',
    maxScore: 3,
    dataField: 'understandingPatientPerspective'
  },
  {
    id: 'CLIN-STR',
    domain: 'clinical',
    label: 'Providing Structure',
    description: 'Sequencing, signposting, summarising, and managing the time available.',
    maxScore: 3,
    dataField: 'providingStructure'
  },
  {
    id: 'CLIN-IGT',
    domain: 'clinical',
    label: 'Information-gathering',
    description: 'Open and closed questioning, active listening, and clarification of patient responses.',
    maxScore: 3,
    dataField: 'informationGathering'
  },
  {
    id: 'CLIN-IGV',
    domain: 'clinical',
    label: 'Information-giving',
    description: 'Clear, structured, and patient-appropriate explanation, including checking understanding.',
    maxScore: 3,
    dataField: 'informationGiving'
  }
];

export { emptyAssessment, gradeLabel, gradeClass, isAtOrAboveClinicalThreshold, CRITERIA };
