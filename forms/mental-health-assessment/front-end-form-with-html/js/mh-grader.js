// PHQ-9 + GAD-7 grader. Pure functions: take an `AssessmentData` object,
// return a `GradingResult` containing PHQ-9 / GAD-7 score totals, severity
// classification, and per-question audit trail.
//
// Mirrors `src/lib/engine/mh-grader.ts` from the SvelteKit reference.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').ScoreResult} ScoreResult
 * @typedef {import('./types.js').GradingResult} GradingResult
 */

// Wrapped in an IIFE; published via window.MentalHealthAssessment.
(function () {
'use strict';
window.MentalHealthAssessment = window.MentalHealthAssessment || {};

const NS = window.MentalHealthAssessment;
const {
  phq9Questions,
  phqKeys,
  calculatePhq9Score,
  phq9Severity,
  phq9SeverityLabel,
  gad7Questions,
  gadKeys,
  calculateGad7Score,
  gad7Severity,
  gad7SeverityLabel,
  calculateAuditCScore
} = NS;
// `detectAdditionalFlags` is resolved at call time because flagged-issues.js
// loads after this file in index.html.

/**
 * Build the per-item PHQ-9 audit trail. Items the patient has not answered
 * are excluded from the trail.
 * @param {AssessmentData} data
 */
function phq9ItemScores(data) {
  /** @type {{ id: string, question: string, score: number }[]} */
  const items = [];
  phqKeys.forEach((key, i) => {
    const v = data.phqResponses[key];
    if (v === null || v === undefined) return;
    items.push({
      id: `PHQ9-${String(i + 1).padStart(2, '0')}`,
      question: phq9Questions[i],
      score: v
    });
  });
  return items;
}

/**
 * Build the per-item GAD-7 audit trail. Items the patient has not answered
 * are excluded from the trail.
 * @param {AssessmentData} data
 */
function gad7ItemScores(data) {
  /** @type {{ id: string, question: string, score: number }[]} */
  const items = [];
  gadKeys.forEach((key, i) => {
    const v = data.gadResponses[key];
    if (v === null || v === undefined) return;
    items.push({
      id: `GAD7-${String(i + 1).padStart(2, '0')}`,
      question: gad7Questions[i],
      score: v
    });
  });
  return items;
}

/**
 * Calculate the PHQ-9 depression ScoreResult.
 * @param {AssessmentData} data
 * @returns {ScoreResult}
 */
function calculatePHQ9(data) {
  const score = calculatePhq9Score(data.phqResponses);
  const itemScores = phq9ItemScores(data);
  if (score === null) {
    return {
      instrument: 'PHQ-9',
      score: 0,
      maxScore: 27,
      severity: 'minimal',
      label: 'Incomplete',
      itemScores
    };
  }
  const severity = phq9Severity(score);
  return {
    instrument: 'PHQ-9',
    score,
    maxScore: 27,
    severity,
    label: phq9SeverityLabel(severity),
    itemScores
  };
}

/**
 * Calculate the GAD-7 anxiety ScoreResult.
 * @param {AssessmentData} data
 * @returns {ScoreResult}
 */
function calculateGAD7(data) {
  const score = calculateGad7Score(data.gadResponses);
  const itemScores = gad7ItemScores(data);
  if (score === null) {
    return {
      instrument: 'GAD-7',
      score: 0,
      maxScore: 21,
      severity: 'minimal',
      label: 'Incomplete',
      itemScores
    };
  }
  const severity = gad7Severity(score);
  return {
    instrument: 'GAD-7',
    score,
    maxScore: 21,
    severity,
    label: gad7SeverityLabel(severity),
    itemScores
  };
}

/**
 * Pure function: evaluates PHQ-9, GAD-7, AUDIT-C, and detects additional
 * flags. Returns the complete GradingResult.
 * @param {AssessmentData} data
 * @returns {GradingResult}
 */
function gradeAssessment(data) {
  const phq9 = calculatePHQ9(data);
  const gad7 = calculateGAD7(data);
  const auditC = calculateAuditCScore(
    data.substanceUse.alcoholFrequency,
    data.substanceUse.alcoholQuantity,
    data.substanceUse.bingeDrinking
  );
  const additionalFlags = window.MentalHealthAssessment.detectAdditionalFlags(data);

  return {
    phq9,
    gad7,
    auditC,
    additionalFlags,
    timestamp: new Date().toISOString()
  };
}

/** Severity-level human-readable label. */
function severityLabel(level) {
  switch (level) {
    case 'minimal':           return 'Minimal';
    case 'mild':              return 'Mild';
    case 'moderate':          return 'Moderate';
    case 'moderately-severe': return 'Moderately Severe';
    case 'severe':            return 'Severe';
    default:                  return level || '';
  }
}

/** Severity-level CSS class hint. */
function severityClass(level) {
  switch (level) {
    case 'minimal':           return 'severity-minimal';
    case 'mild':              return 'severity-mild';
    case 'moderate':          return 'severity-moderate';
    case 'moderately-severe': return 'severity-moderately-severe';
    case 'severe':            return 'severity-severe';
    default:                  return '';
  }
}

Object.assign(window.MentalHealthAssessment, {
  calculatePHQ9,
  calculateGAD7,
  gradeAssessment,
  severityLabel,
  severityClass
});
})();
