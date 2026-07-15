// Plain-JavaScript / JSDoc type definitions for the Workplace Climate
// Assessment. The instrument uses 1-5 Likert items grouped into eight
// graded organisational domains (leadership, psychSafety, inclusion,
// communication, collaboration, recognition, wellbeing, career). Domain
// means are normalised to a 0-100 scale (mean × 20) and averaged into a
// single composite Workplace Climate Index.
//
// Step 10 collects an overall climate Likert item, a recommend-as-place-
// to-work yes/no/maybe, and free-text suggestions / further comments.
// Step 1 (demographics) captures broad anonymised banding only and is
// NOT graded into the composite.
//
// This file builds the canonical empty AssessmentData shape used by the
// wizard so that newly-added fields automatically default correctly when
// older saved state is rehydrated from localStorage.

/**
 * @typedef {1 | 2 | 3 | 4 | 5 | null} LikertValue
 *
 * @typedef {'thriving' | 'healthy' | 'developing' | 'strained' | 'critical' | ''} ClimateCategory
 *
 * @typedef {''
 *   | 'operations'
 *   | 'engineering'
 *   | 'sales-marketing'
 *   | 'customer-service'
 *   | 'finance'
 *   | 'human-resources'
 *   | 'administration'
 *   | 'clinical'
 *   | 'research'
 *   | 'leadership'
 *   | 'other'} Department
 *
 * @typedef {''
 *   | 'less-than-1-year'
 *   | '1-to-3-years'
 *   | '3-to-5-years'
 *   | '5-to-10-years'
 *   | 'more-than-10-years'} TenureBand
 *
 * @typedef {''
 *   | 'part-time-under-20'
 *   | 'part-time-20-to-34'
 *   | 'full-time-35-to-44'
 *   | 'long-hours-45-plus'} HoursBand
 *
 * @typedef {''
 *   | 'individual-contributor'
 *   | 'team-lead'
 *   | 'manager'
 *   | 'senior-manager'
 *   | 'director-or-above'} RoleLevel
 *
 * @typedef {''
 *   | 'on-site'
 *   | 'hybrid'
 *   | 'remote'} WorkLocation
 *
 * @typedef {''
 *   | 'definitely'
 *   | 'probably'
 *   | 'unsure'
 *   | 'probably-not'
 *   | 'definitely-not'} RecommendChoice
 */

/**
 * @typedef {Object} Demographics
 * @property {Department}   department
 * @property {TenureBand}   tenureBand
 * @property {HoursBand}    hoursBand
 * @property {RoleLevel}    roleLevel
 * @property {WorkLocation} workLocation
 */

/**
 * @typedef {Object} Leadership
 * @property {LikertValue} ld1
 * @property {LikertValue} ld2
 * @property {LikertValue} ld3
 * @property {LikertValue} ld4
 * @property {LikertValue} ld5
 */

/**
 * @typedef {Object} PsychSafety
 * @property {LikertValue} ps1
 * @property {LikertValue} ps2
 * @property {LikertValue} ps3
 * @property {LikertValue} ps4
 * @property {LikertValue} ps5
 */

/**
 * @typedef {Object} Inclusion
 * @property {LikertValue} in1
 * @property {LikertValue} in2
 * @property {LikertValue} in3
 * @property {LikertValue} in4
 * @property {LikertValue} in5
 */

/**
 * @typedef {Object} Communication
 * @property {LikertValue} co1
 * @property {LikertValue} co2
 * @property {LikertValue} co3
 * @property {LikertValue} co4
 */

/**
 * @typedef {Object} Collaboration
 * @property {LikertValue} cl1
 * @property {LikertValue} cl2
 * @property {LikertValue} cl3
 * @property {LikertValue} cl4
 */

/**
 * @typedef {Object} Recognition
 * @property {LikertValue} re1
 * @property {LikertValue} re2
 * @property {LikertValue} re3
 * @property {LikertValue} re4
 */

/**
 * @typedef {Object} Wellbeing
 * @property {LikertValue} we1
 * @property {LikertValue} we2
 * @property {LikertValue} we3
 * @property {LikertValue} we4
 * @property {LikertValue} we5
 */

/**
 * @typedef {Object} Career
 * @property {LikertValue} ca1
 * @property {LikertValue} ca2
 * @property {LikertValue} ca3
 * @property {LikertValue} ca4
 */

/**
 * @typedef {Object} OverallClimate
 * @property {LikertValue}     oc1                    Overall, the climate at this organisation is positive.
 * @property {LikertValue}     oc2                    I would recommend this as a place to work.
 * @property {LikertValue}     oc3                    The organisation lives its stated values.
 * @property {RecommendChoice} recommendAsPlaceToWork
 * @property {string}          biggestStrength        Free-text — what is working well.
 * @property {string}          biggestImprovement     Free-text — single most important change.
 * @property {string}          otherComments          Free-text — anything else.
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics}   demographics
 * @property {Leadership}     leadership
 * @property {PsychSafety}    psychSafety
 * @property {Inclusion}      inclusion
 * @property {Communication}  communication
 * @property {Collaboration}  collaboration
 * @property {Recognition}    recognition
 * @property {Wellbeing}      wellbeing
 * @property {Career}         career
 * @property {OverallClimate} overall
 */

/**
 * @typedef {Object} DomainScore
 * @property {number | null} mean         Mean of 1-5 answers in this domain.
 * @property {number | null} score        Normalised 0-100 score (mean × 20).
 * @property {number} answeredCount       Items answered in this domain.
 * @property {number} totalCount          Total items in this domain.
 * @property {ClimateCategory} category   Category derived from 0-100 score.
 */

/**
 * @typedef {Object} DomainScores
 * @property {DomainScore} leadership
 * @property {DomainScore} psychSafety
 * @property {DomainScore} inclusion
 * @property {DomainScore} communication
 * @property {DomainScore} collaboration
 * @property {DomainScore} recognition
 * @property {DomainScore} wellbeing
 * @property {DomainScore} career
 */

/**
 * @typedef {Object} FiredItem
 * @property {string} id
 * @property {string} domain
 * @property {string} label
 * @property {number} rawValue
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
 * @property {number | null}    compositeScore     0-100 composite climate index.
 * @property {ClimateCategory}  category           Composite category.
 * @property {DomainScores}     domainScores
 * @property {number}           answeredCount      Total Likert items answered.
 * @property {number}           totalCount         Total Likert items.
 * @property {FiredItem[]}      firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string}           timestamp
 */

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric Likert fields default to `null`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    demographics: {
      department: '',
      tenureBand: '',
      hoursBand: '',
      roleLevel: '',
      workLocation: ''
    },
    leadership: {
      ld1: null, ld2: null, ld3: null, ld4: null, ld5: null
    },
    psychSafety: {
      ps1: null, ps2: null, ps3: null, ps4: null, ps5: null
    },
    inclusion: {
      in1: null, in2: null, in3: null, in4: null, in5: null
    },
    communication: {
      co1: null, co2: null, co3: null, co4: null
    },
    collaboration: {
      cl1: null, cl2: null, cl3: null, cl4: null
    },
    recognition: {
      re1: null, re2: null, re3: null, re4: null
    },
    wellbeing: {
      we1: null, we2: null, we3: null, we4: null, we5: null
    },
    career: {
      ca1: null, ca2: null, ca3: null, ca4: null
    },
    overall: {
      oc1: null,
      oc2: null,
      oc3: null,
      recommendAsPlaceToWork: '',
      biggestStrength: '',
      biggestImprovement: '',
      otherComments: ''
    }
  };
}

/**
 * Friendly label for a ClimateCategory.
 * @param {ClimateCategory} cat
 */
function categoryLabel(cat) {
  switch (cat) {
    case 'thriving':   return 'Thriving';
    case 'healthy':    return 'Healthy';
    case 'developing': return 'Developing';
    case 'strained':   return 'Strained';
    case 'critical':   return 'Critical';
    default: return 'Unknown';
  }
}

/**
 * CSS class hint for the category badge.
 * @param {ClimateCategory} cat
 */
function categoryClass(cat) {
  switch (cat) {
    case 'thriving':   return 'cat-thriving';
    case 'healthy':    return 'cat-healthy';
    case 'developing': return 'cat-developing';
    case 'strained':   return 'cat-strained';
    case 'critical':   return 'cat-critical';
    default: return '';
  }
}

/**
 * Severity rank for picking the "worst" category.
 * Higher rank = worse climate (critical = 4).
 * @param {ClimateCategory} cat
 */
function categoryRank(cat) {
  switch (cat) {
    case 'thriving':   return 0;
    case 'healthy':    return 1;
    case 'developing': return 2;
    case 'strained':   return 3;
    case 'critical':   return 4;
    default: return -1;
  }
}

/**
 * Classify a 0-100 score into a ClimateCategory.
 *   85-100  thriving
 *   70-84   healthy
 *   50-69   developing
 *   25-49   strained
 *    0-24   critical
 * @param {number | null} score
 * @returns {ClimateCategory}
 */
function classifyScore(score) {
  if (score === null || score === undefined || isNaN(score)) return '';
  if (score >= 85) return 'thriving';
  if (score >= 70) return 'healthy';
  if (score >= 50) return 'developing';
  if (score >= 25) return 'strained';
  return 'critical';
}

export { emptyAssessment, categoryLabel, categoryClass, categoryRank, classifyScore };
