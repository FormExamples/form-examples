// Dyslexia grader. Pure functions: given an `AssessmentData`, return a
// `GradingResult` consisting of one `DomainScore` per rule plus an
// overall severity. The overall severity is driven by the *lowest*
// non-null standardised score (the most-impaired domain), matching the
// SvelteKit reference engine.
//
// Severity bands (mean 100, SD 15):
//   85+   -> 'none'      (average or above)
//   70-84 -> 'mild'      (below average)
//   55-69 -> 'moderate'  (well below average)
//   <55   -> 'severe'    (significantly below average)
//
// If no domain has been answered, the overall severity is 'none' and
// `lowestScore` is null.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').DomainScore} DomainScore
 * @typedef {import('./types.js').Severity} Severity
 * @typedef {import('./types.js').AdditionalFlag} AdditionalFlag
 * @typedef {import('./types.js').GradingResult} GradingResult
 */

// Wrapped in an IIFE; published via window.DyslexiaAssessment.
(function () {
'use strict';
window.DyslexiaAssessment = window.DyslexiaAssessment || {};

const NS = window.DyslexiaAssessment;
const { dyslexiaRules, scoreSeverity } = NS;

/**
 * Pick the most-severe of two severities.
 * @param {Severity} a
 * @param {Severity} b
 * @returns {Severity}
 */
function maxSeverity(a, b) {
  const order = { none: 0, mild: 1, moderate: 2, severe: 3 };
  return order[a] >= order[b] ? a : b;
}

/**
 * Evaluate the dyslexia battery against the supplied assessment data.
 * @param {AssessmentData} data
 * @param {AdditionalFlag[]} [additionalFlags]
 * @returns {GradingResult}
 */
function gradeDyslexia(data, additionalFlags) {
  /** @type {DomainScore[]} */
  const domainScores = [];
  /** @type {Severity} */
  let overall = 'none';
  /** @type {number | null} */
  let lowestScore = null;
  let answeredCount = 0;

  for (const rule of dyslexiaRules) {
    let score = null;
    try {
      score = rule.evaluate(data);
    } catch (e) {
      console.warn(`Dyslexia rule ${rule.id} evaluation failed:`, e);
    }
    const severity = scoreSeverity(score);
    domainScores.push({
      id: rule.id,
      category: rule.category,
      description: rule.description,
      score: score === undefined ? null : score,
      severity
    });
    if (score !== null && score !== undefined && !Number.isNaN(score)) {
      answeredCount++;
      overall = maxSeverity(overall, severity);
      if (lowestScore === null || score < lowestScore) {
        lowestScore = score;
      }
    }
  }

  return {
    overallSeverity: overall,
    lowestScore,
    answeredCount,
    domainScores,
    additionalFlags: additionalFlags || [],
    timestamp: new Date().toISOString()
  };
}

/**
 * Friendly label for a Severity band.
 * @param {Severity} severity
 */
function severityLabel(severity) {
  switch (severity) {
    case 'none': return 'No dyslexia';
    case 'mild': return 'Mild dyslexia';
    case 'moderate': return 'Moderate dyslexia';
    case 'severe': return 'Severe dyslexia';
    default: return '';
  }
}

/**
 * CSS class hint for a Severity badge.
 * @param {Severity} severity
 */
function severityClass(severity) {
  switch (severity) {
    case 'none': return 'severity-none';
    case 'mild': return 'severity-mild';
    case 'moderate': return 'severity-moderate';
    case 'severe': return 'severity-severe';
    default: return '';
  }
}

Object.assign(window.DyslexiaAssessment, {
  gradeDyslexia,
  severityLabel,
  severityClass,
  maxSeverity
});
})();
