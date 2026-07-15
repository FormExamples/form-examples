// Plain-JavaScript / JSDoc type definitions for the Employee Satisfaction
// Survey. The instrument uses 1-5 Likert items grouped into eight graded
// employment domains (workload, management, growth, compensation, culture,
// environment, recognition, overall). Domain means are normalised to a
// 0-100 scale (mean × 20) and averaged into a single composite score.
// Step 10 also collects an eNPS-style 0-10 "would you recommend us as an
// employer" question and a retention-intent dropdown.
//
// This file builds the canonical empty AssessmentData shape used by the
// wizard so that newly-added fields automatically default correctly when
// older saved state is rehydrated from localStorage.

/**
 * @typedef {1 | 2 | 3 | 4 | 5 | null} LikertValue
 *
 * @typedef {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | null} ENpsValue
 *
 * @typedef {'excellent' | 'good' | 'satisfactory' | 'poor' | 'very-poor' | ''} SatisfactionCategory
 *
 * @typedef {'promoter' | 'passive' | 'detractor' | ''} ENpsClassification
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
 *   | 'definitely-stay'
 *   | 'probably-stay'
 *   | 'unsure'
 *   | 'probably-leave-12-months'
 *   | 'leaving-within-6-months'} RetentionIntent
 */

/**
 * @typedef {Object} Demographics
 * @property {Department} department
 * @property {TenureBand} tenureBand
 * @property {HoursBand} hoursBand
 */

/**
 * @typedef {Object} RoleTenure
 * @property {RoleLevel} roleLevel
 * @property {WorkLocation} workLocation
 * @property {LikertValue} rt1   Role description matches what I do.
 * @property {LikertValue} rt2   Workload appropriate for level.
 */

/**
 * @typedef {Object} Workload
 * @property {LikertValue} wl1
 * @property {LikertValue} wl2
 * @property {LikertValue} wl3
 * @property {LikertValue} wl4
 * @property {LikertValue} wl5
 */

/**
 * @typedef {Object} Management
 * @property {LikertValue} mg1
 * @property {LikertValue} mg2
 * @property {LikertValue} mg3
 * @property {LikertValue} mg4
 * @property {LikertValue} mg5
 */

/**
 * @typedef {Object} Growth
 * @property {LikertValue} gr1
 * @property {LikertValue} gr2
 * @property {LikertValue} gr3
 * @property {LikertValue} gr4
 */

/**
 * @typedef {Object} Compensation
 * @property {LikertValue} cb1
 * @property {LikertValue} cb2
 * @property {LikertValue} cb3
 * @property {LikertValue} cb4
 */

/**
 * @typedef {Object} Culture
 * @property {LikertValue} cu1
 * @property {LikertValue} cu2
 * @property {LikertValue} cu3
 * @property {LikertValue} cu4
 * @property {LikertValue} cu5
 */

/**
 * @typedef {Object} Environment
 * @property {LikertValue} en1
 * @property {LikertValue} en2
 * @property {LikertValue} en3
 * @property {LikertValue} en4
 */

/**
 * @typedef {Object} Recognition
 * @property {LikertValue} rc1
 * @property {LikertValue} rc2
 * @property {LikertValue} rc3
 * @property {LikertValue} rc4
 */

/**
 * @typedef {Object} OverallExperience
 * @property {LikertValue} ov1                   Proud to work here.
 * @property {LikertValue} ov2                   Would recommend to a friend.
 * @property {LikertValue} ov3                   Glad I joined.
 * @property {LikertValue} ov4                   Plan to be here in 12 months.
 * @property {ENpsValue}   recommendScore        eNPS 0-10.
 * @property {RetentionIntent} retentionIntent
 * @property {string}      suggestionsForImprovement
 * @property {string}      otherComments
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {RoleTenure} roleTenure
 * @property {Workload} workload
 * @property {Management} management
 * @property {Growth} growth
 * @property {Compensation} compensation
 * @property {Culture} culture
 * @property {Environment} environment
 * @property {Recognition} recognition
 * @property {OverallExperience} overall
 */

/**
 * @typedef {Object} DomainScore
 * @property {number | null} mean         Mean of 1-5 answers in this domain.
 * @property {number | null} score        Normalised 0-100 score (mean × 20).
 * @property {number} answeredCount       Items answered in this domain.
 * @property {number} totalCount          Total items in this domain.
 * @property {SatisfactionCategory} category  Category derived from 0-100 score.
 */

/**
 * @typedef {Object} DomainScores
 * @property {DomainScore} workload
 * @property {DomainScore} management
 * @property {DomainScore} growth
 * @property {DomainScore} compensation
 * @property {DomainScore} culture
 * @property {DomainScore} environment
 * @property {DomainScore} recognition
 * @property {DomainScore} overall
 */

/**
 * @typedef {Object} ENpsResult
 * @property {ENpsValue} score             0-10 raw value.
 * @property {ENpsClassification} classification
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
 * @property {number | null} compositeScore     0-100 composite.
 * @property {SatisfactionCategory} category    Composite category.
 * @property {DomainScores} domainScores
 * @property {ENpsResult} eNPS
 * @property {number} answeredCount             Total Likert items answered.
 * @property {number} totalCount                Total Likert items.
 * @property {FiredItem[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric Likert / eNPS fields default to `null`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    demographics: {
      department: '',
      tenureBand: '',
      hoursBand: ''
    },
    roleTenure: {
      roleLevel: '',
      workLocation: '',
      rt1: null,
      rt2: null
    },
    workload: {
      wl1: null, wl2: null, wl3: null, wl4: null, wl5: null
    },
    management: {
      mg1: null, mg2: null, mg3: null, mg4: null, mg5: null
    },
    growth: {
      gr1: null, gr2: null, gr3: null, gr4: null
    },
    compensation: {
      cb1: null, cb2: null, cb3: null, cb4: null
    },
    culture: {
      cu1: null, cu2: null, cu3: null, cu4: null, cu5: null
    },
    environment: {
      en1: null, en2: null, en3: null, en4: null
    },
    recognition: {
      rc1: null, rc2: null, rc3: null, rc4: null
    },
    overall: {
      ov1: null,
      ov2: null,
      ov3: null,
      ov4: null,
      recommendScore: null,
      retentionIntent: '',
      suggestionsForImprovement: '',
      otherComments: ''
    }
  };
}

/**
 * Friendly label for a SatisfactionCategory.
 * @param {SatisfactionCategory} cat
 */
function categoryLabel(cat) {
  switch (cat) {
    case 'excellent': return 'Excellent';
    case 'good': return 'Good';
    case 'satisfactory': return 'Satisfactory';
    case 'poor': return 'Poor';
    case 'very-poor': return 'Very Poor';
    default: return 'Unknown';
  }
}

/**
 * CSS class hint for the category badge.
 * @param {SatisfactionCategory} cat
 */
function categoryClass(cat) {
  switch (cat) {
    case 'excellent': return 'cat-excellent';
    case 'good': return 'cat-good';
    case 'satisfactory': return 'cat-satisfactory';
    case 'poor': return 'cat-poor';
    case 'very-poor': return 'cat-very-poor';
    default: return '';
  }
}

/**
 * Severity rank for picking the "worst" category.
 * Higher rank = worse experience (very-poor = 4).
 * @param {SatisfactionCategory} cat
 */
function categoryRank(cat) {
  switch (cat) {
    case 'excellent': return 0;
    case 'good': return 1;
    case 'satisfactory': return 2;
    case 'poor': return 3;
    case 'very-poor': return 4;
    default: return -1;
  }
}

/**
 * Classify a 0-100 score into a SatisfactionCategory.
 *   85-100  excellent
 *   70-84   good
 *   50-69   satisfactory
 *   25-49   poor
 *    0-24   very-poor
 * @param {number | null} score
 * @returns {SatisfactionCategory}
 */
function classifyScore(score) {
  if (score === null || score === undefined || isNaN(score)) return '';
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 50) return 'satisfactory';
  if (score >= 25) return 'poor';
  return 'very-poor';
}

/**
 * Classify a raw eNPS 0-10 value.
 *   9-10    promoter
 *   7-8     passive
 *   0-6     detractor
 * @param {ENpsValue} value
 * @returns {ENpsClassification}
 */
function classifyENps(value) {
  if (value === null || value === undefined) return '';
  if (value >= 9) return 'promoter';
  if (value >= 7) return 'passive';
  return 'detractor';
}

export { emptyAssessment, categoryLabel, categoryClass, categoryRank, classifyScore, classifyENps };
