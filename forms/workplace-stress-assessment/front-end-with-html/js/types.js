// Plain-JavaScript / JSDoc type definitions for the Workplace Stress
// Assessment (UK HSE Management Standards Indicator Tool, 35 items).
//
// The data shape mirrors the seven HSE domains. Each domain holds an object
// keyed by item id (e.g. demands.dem1) with a numeric Likert response in
// the range 1-5, or null if the employee has not yet answered.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage.

/**
 * @typedef {1 | 2 | 3 | 4 | 5 | null} LikertValue
 *
 * @typedef {'low' | 'moderate' | 'high' | 'very-high' | ''} RiskLevel
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
 */

/**
 * @typedef {Object} Demographics
 * @property {Department} department
 * @property {TenureBand} tenureBand
 * @property {HoursBand} hoursBand
 */

/**
 * @typedef {Object} Demands
 * @property {LikertValue} dem1
 * @property {LikertValue} dem2
 * @property {LikertValue} dem3
 * @property {LikertValue} dem4
 * @property {LikertValue} dem5
 * @property {LikertValue} dem6
 * @property {LikertValue} dem7
 * @property {LikertValue} dem8
 */

/**
 * @typedef {Object} Control
 * @property {LikertValue} ctrl1
 * @property {LikertValue} ctrl2
 * @property {LikertValue} ctrl3
 * @property {LikertValue} ctrl4
 * @property {LikertValue} ctrl5
 * @property {LikertValue} ctrl6
 */

/**
 * @typedef {Object} ManagerSupport
 * @property {LikertValue} ms1
 * @property {LikertValue} ms2
 * @property {LikertValue} ms3
 * @property {LikertValue} ms4
 * @property {LikertValue} ms5
 */

/**
 * @typedef {Object} PeerSupport
 * @property {LikertValue} ps1
 * @property {LikertValue} ps2
 * @property {LikertValue} ps3
 * @property {LikertValue} ps4
 */

/**
 * @typedef {Object} Relationships
 * @property {LikertValue} rel1
 * @property {LikertValue} rel2
 * @property {LikertValue} rel3
 * @property {LikertValue} rel4
 */

/**
 * @typedef {Object} Role
 * @property {LikertValue} role1
 * @property {LikertValue} role2
 * @property {LikertValue} role3
 * @property {LikertValue} role4
 * @property {LikertValue} role5
 */

/**
 * @typedef {Object} Change
 * @property {LikertValue} chg1
 * @property {LikertValue} chg2
 * @property {LikertValue} chg3
 */

/**
 * @typedef {Object} AdditionalComments
 * @property {string} mostStressfulAspect
 * @property {string} suggestionsForImprovement
 * @property {string} otherComments
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {Demands} demands
 * @property {Control} control
 * @property {ManagerSupport} managerSupport
 * @property {PeerSupport} peerSupport
 * @property {Relationships} relationships
 * @property {Role} role
 * @property {Change} change
 * @property {AdditionalComments} additionalComments
 */

/**
 * @typedef {Object} DomainResult
 * @property {number | null} mean         Mean of all answered, reverse-coded items in the domain (1.00-5.00).
 * @property {number} answeredCount       Items answered in this domain.
 * @property {number} totalCount          Total items in this domain.
 * @property {RiskLevel} category         Concern category derived from mean against HSE benchmarks.
 */

/**
 * @typedef {Object} DomainResults
 * @property {DomainResult} demands
 * @property {DomainResult} control
 * @property {DomainResult} managerSupport
 * @property {DomainResult} peerSupport
 * @property {DomainResult} relationships
 * @property {DomainResult} role
 * @property {DomainResult} change
 */

/**
 * @typedef {Object} FiredItem
 * @property {string} id            Item id (e.g. dem1, ctrl3).
 * @property {string} domain        Domain key (e.g. demands).
 * @property {string} label         Human-readable HSE statement.
 * @property {number} rawValue      The raw 1-5 response.
 * @property {number} effectiveValue The reverse-coded value used for the mean.
 * @property {boolean} reverseScored Whether this item is reverse-scored.
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
 * @property {DomainResults} domains
 * @property {RiskLevel} overallRisk     Worst (highest concern) of the seven domain categories.
 * @property {number} answeredCount      Total items answered across all domains (max 35).
 * @property {FiredItem[]} firedRules    Per-item audit trail.
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.WorkplaceStressAssessment`.

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
      hoursBand: ''
    },
    demands: {
      dem1: null, dem2: null, dem3: null, dem4: null,
      dem5: null, dem6: null, dem7: null, dem8: null
    },
    control: {
      ctrl1: null, ctrl2: null, ctrl3: null,
      ctrl4: null, ctrl5: null, ctrl6: null
    },
    managerSupport: {
      ms1: null, ms2: null, ms3: null, ms4: null, ms5: null
    },
    peerSupport: {
      ps1: null, ps2: null, ps3: null, ps4: null
    },
    relationships: {
      rel1: null, rel2: null, rel3: null, rel4: null
    },
    role: {
      role1: null, role2: null, role3: null, role4: null, role5: null
    },
    change: {
      chg1: null, chg2: null, chg3: null
    },
    additionalComments: {
      mostStressfulAspect: '',
      suggestionsForImprovement: '',
      otherComments: ''
    }
  };
}

/**
 * Friendly label for a RiskLevel.
 * @param {RiskLevel} level
 */
function riskLevelLabel(level) {
  switch (level) {
    case 'low': return 'Low concern';
    case 'moderate': return 'Moderate concern';
    case 'high': return 'High concern';
    case 'very-high': return 'Very high concern';
    default: return 'Unknown';
  }
}

/**
 * CSS class hint for the risk badge.
 * @param {RiskLevel} level
 */
function riskLevelClass(level) {
  switch (level) {
    case 'low': return 'risk-low';
    case 'moderate': return 'risk-moderate';
    case 'high': return 'risk-high';
    case 'very-high': return 'risk-very-high';
    default: return '';
  }
}

/**
 * Numeric severity rank (low = 0 ... very-high = 3) for picking the worst
 * domain when computing overall risk.
 * @param {RiskLevel} level
 */
function riskLevelRank(level) {
  switch (level) {
    case 'low': return 0;
    case 'moderate': return 1;
    case 'high': return 2;
    case 'very-high': return 3;
    default: return -1;
  }
}

export { emptyAssessment, riskLevelLabel, riskLevelClass, riskLevelRank };
