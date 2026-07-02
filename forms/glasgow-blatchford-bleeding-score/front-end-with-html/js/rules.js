// Declarative Glasgow-Blatchford grading rules.
//
// The GBS instrument scores eight weighted admission parameters — blood urea,
// haemoglobin (sex-specific bands), systolic blood pressure, pulse, melaena,
// syncope, hepatic disease, and cardiac failure — summed into a total of 0-23
// (spec §4). This file holds the pure per-parameter scoring helpers, the
// risk-band derivation, and a declarative rule table whose rows mirror the
// `glasgow_blatchford_bleeding_score_grade_rule` SQL table (rule_id, parameter,
// points, category, description). The grader (`grader.js`) sums the eight
// point contributions and derives the risk band with its recommended
// management.
//
// Bands (spec §4):
//   blood urea (mmol/L):  < 6.5 → 0,  6.5-7.9 → 2,  8.0-9.9 → 3,
//                         10.0-24.9 → 4,  >= 25.0 → 6
//   haemoglobin — men (g/L):   >= 130 → 0, 120-129 → 1, 100-119 → 3, < 100 → 6
//   haemoglobin — women (g/L): >= 120 → 0, 100-119 → 1, < 100 → 6
//     (unknown / unset sex falls back to the women's table)
//   systolic BP (mmHg):  >= 110 → 0, 100-109 → 1, 90-99 → 2, < 90 → 3
//   pulse (beats/min):   >= 100 → 1, else 0
//   melaena present → 1; syncope → 2; hepatic disease → 2; cardiac failure → 2
//
// A missing numeric input contributes 0 points for its parameter (spec §4); the
// grader raises a data-completeness flag separately in `flags.js`.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').RiskBand} RiskBand
 *
 * @typedef {Object} GbsRule
 * @property {string} id
 * @property {string} parameter   - blood-urea | haemoglobin | systolic-blood-pressure | pulse | melaena | syncope | hepatic-disease | cardiac-failure
 * @property {number} points      - points awarded when the rule fires
 * @property {string} category
 * @property {string} description
 * @property {(d: AssessmentData) => boolean} evaluate
 */

// Wrapped in an IIFE; published via window.GlasgowBlatchfordBleedingScore.
(function () {
'use strict';
window.GlasgowBlatchfordBleedingScore = window.GlasgowBlatchfordBleedingScore || {};

/**
 * Parameter 1 — blood urea (mmol/L). Returns 0, 2, 3, 4, or 6; 0 when
 * unmeasured (a missing input contributes no points, per spec §4).
 * @param {AssessmentData} d
 * @returns {0 | 2 | 3 | 4 | 6}
 */
function bloodUreaPoints(d) {
  const v = d.labs.bloodUrea;
  if (v === null || v === undefined) return 0;
  if (v >= 25.0) return 6;
  if (v >= 10.0) return 4;
  if (v >= 8.0) return 3;
  if (v >= 6.5) return 2;
  return 0;
}

/**
 * Parameters 2/3 — haemoglobin (g/L), scored against sex-specific bands. Men
 * have an extra 120-129 band (1 point) that women do not; unknown or unset sex
 * falls back to the women's table (never awards the men-only band). Returns
 * 0, 1, 3, or 6; 0 when unmeasured.
 * @param {AssessmentData} d
 * @returns {0 | 1 | 3 | 6}
 */
function haemoglobinPoints(d) {
  const v = d.labs.haemoglobin;
  if (v === null || v === undefined) return 0;
  const male = d.identification.sex === 'male';
  if (v < 100) return 6;
  if (male) {
    if (v < 120) return 3;
    if (v < 130) return 1;
    return 0;
  }
  // women / intersex / unknown / unset
  if (v < 120) return 1;
  return 0;
}

/**
 * Parameter 4 — systolic blood pressure (mmHg). Returns 0, 1, 2, or 3; 0 when
 * unmeasured.
 * @param {AssessmentData} d
 * @returns {0 | 1 | 2 | 3}
 */
function systolicBloodPressurePoints(d) {
  const v = d.haemodynamics.systolicBloodPressure;
  if (v === null || v === undefined) return 0;
  if (v < 90) return 3;
  if (v < 100) return 2;
  if (v < 110) return 1;
  return 0;
}

/**
 * Parameter 5 — pulse (beats/min). 1 point when >= 100, else 0.
 * @param {AssessmentData} d
 * @returns {0 | 1}
 */
function pulsePoint(d) {
  const v = d.haemodynamics.pulse;
  return v !== null && v !== undefined && v >= 100 ? 1 : 0;
}

/**
 * Parameter 6 — melaena present. 1 point when 'yes', else 0.
 * @param {AssessmentData} d
 * @returns {0 | 1}
 */
function melaenaPoint(d) {
  return d.clinicalMarkers.melaenaPresent === 'yes' ? 1 : 0;
}

/**
 * Parameter 7 — syncope. 2 points when 'yes', else 0.
 * @param {AssessmentData} d
 * @returns {0 | 2}
 */
function syncopePoint(d) {
  return d.clinicalMarkers.syncope === 'yes' ? 2 : 0;
}

/**
 * Parameter 8 — hepatic disease. 2 points when 'yes', else 0.
 * @param {AssessmentData} d
 * @returns {0 | 2}
 */
function hepaticDiseasePoint(d) {
  return d.clinicalMarkers.hepaticDisease === 'yes' ? 2 : 0;
}

/**
 * Parameter 9 — cardiac failure. 2 points when 'yes', else 0.
 * @param {AssessmentData} d
 * @returns {0 | 2}
 */
function cardiacFailurePoint(d) {
  return d.clinicalMarkers.cardiacFailure === 'yes' ? 2 : 0;
}

/**
 * Derive the risk band and recommended management for a total GBS score.
 * Boundaries (spec §4): 0 → very-low; 1-5 → low-moderate; >= 6 → high.
 * @param {number} score
 * @returns {{ riskBand: RiskBand, recommendedManagement: string }}
 */
function riskBandFor(score) {
  if (score === 0) {
    return {
      riskBand: 'very-low',
      recommendedManagement:
        'Consider outpatient management / early discharge with planned ' +
        'outpatient review; inpatient endoscopy may be deferred. Verify no ' +
        'other admission indication.'
    };
  }
  if (score <= 5) {
    return {
      riskBand: 'low-moderate',
      recommendedManagement:
        'Admit for observation and inpatient upper GI endoscopy; monitor for ' +
        'deterioration.'
    };
  }
  return {
    riskBand: 'high',
    recommendedManagement:
      'Admit; high likelihood of needing intervention or transfusion. ' +
      'Arrange urgent upper GI endoscopy (within 24 h, or immediately after ' +
      'resuscitation for unstable patients) and active resuscitation.'
  };
}

// Is a numeric parameter input present (recorded)?
function hasUrea(d) { const v = d.labs.bloodUrea; return v !== null && v !== undefined; }
function hasHb(d) { const v = d.labs.haemoglobin; return v !== null && v !== undefined; }
function hasSbp(d) { const v = d.haemodynamics.systolicBloodPressure; return v !== null && v !== undefined; }

// Declarative rule table — rows mirror the
// `glasgow_blatchford_bleeding_score_grade_rule` SQL table. For the banded
// numeric parameters (urea, haemoglobin, systolic BP) exactly one row fires
// when the value is recorded, including the 0-point normal band. The
// single-/fixed-point markers (pulse, melaena, syncope, hepatic disease,
// cardiac failure) fire only when they award points.
/** @type {GbsRule[]} */
const gbsRules = [
  // ─── PARAMETER 1: BLOOD UREA ──────────────────────────────────
  {
    id: 'R-BLOOD-UREA-0POINT-01', parameter: 'blood-urea', points: 0,
    category: 'threshold-band', description: 'Blood urea < 6.5 mmol/L',
    evaluate: (d) => hasUrea(d) && bloodUreaPoints(d) === 0
  },
  {
    id: 'R-BLOOD-UREA-2POINT-01', parameter: 'blood-urea', points: 2,
    category: 'threshold-band', description: 'Blood urea 6.5-7.9 mmol/L',
    evaluate: (d) => bloodUreaPoints(d) === 2
  },
  {
    id: 'R-BLOOD-UREA-3POINT-01', parameter: 'blood-urea', points: 3,
    category: 'threshold-band', description: 'Blood urea 8.0-9.9 mmol/L',
    evaluate: (d) => bloodUreaPoints(d) === 3
  },
  {
    id: 'R-BLOOD-UREA-4POINT-01', parameter: 'blood-urea', points: 4,
    category: 'threshold-band', description: 'Blood urea 10.0-24.9 mmol/L',
    evaluate: (d) => bloodUreaPoints(d) === 4
  },
  {
    id: 'R-BLOOD-UREA-6POINT-01', parameter: 'blood-urea', points: 6,
    category: 'threshold-band', description: 'Blood urea >= 25.0 mmol/L',
    evaluate: (d) => bloodUreaPoints(d) === 6
  },

  // ─── PARAMETERS 2/3: HAEMOGLOBIN (SEX-SPECIFIC) ───────────────
  {
    id: 'R-HAEMOGLOBIN-0POINT-01', parameter: 'haemoglobin', points: 0,
    category: 'threshold-band',
    description: 'Haemoglobin in the normal sex-specific band (men >= 130, women >= 120 g/L)',
    evaluate: (d) => hasHb(d) && haemoglobinPoints(d) === 0
  },
  {
    id: 'R-HAEMOGLOBIN-1POINT-01', parameter: 'haemoglobin', points: 1,
    category: 'threshold-band',
    description: 'Haemoglobin one-point band (men 120-129, women 100-119 g/L)',
    evaluate: (d) => haemoglobinPoints(d) === 1
  },
  {
    id: 'R-HAEMOGLOBIN-3POINT-01', parameter: 'haemoglobin', points: 3,
    category: 'threshold-band',
    description: 'Haemoglobin 100-119 g/L (men only three-point band)',
    evaluate: (d) => haemoglobinPoints(d) === 3
  },
  {
    id: 'R-HAEMOGLOBIN-6POINT-01', parameter: 'haemoglobin', points: 6,
    category: 'threshold-band', description: 'Haemoglobin < 100 g/L (either sex)',
    evaluate: (d) => haemoglobinPoints(d) === 6
  },

  // ─── PARAMETER 4: SYSTOLIC BLOOD PRESSURE ─────────────────────
  {
    id: 'R-SYSTOLIC-BLOOD-PRESSURE-0POINT-01', parameter: 'systolic-blood-pressure', points: 0,
    category: 'threshold-band', description: 'Systolic blood pressure >= 110 mmHg',
    evaluate: (d) => hasSbp(d) && systolicBloodPressurePoints(d) === 0
  },
  {
    id: 'R-SYSTOLIC-BLOOD-PRESSURE-1POINT-01', parameter: 'systolic-blood-pressure', points: 1,
    category: 'threshold-band', description: 'Systolic blood pressure 100-109 mmHg',
    evaluate: (d) => systolicBloodPressurePoints(d) === 1
  },
  {
    id: 'R-SYSTOLIC-BLOOD-PRESSURE-2POINT-01', parameter: 'systolic-blood-pressure', points: 2,
    category: 'threshold-band', description: 'Systolic blood pressure 90-99 mmHg',
    evaluate: (d) => systolicBloodPressurePoints(d) === 2
  },
  {
    id: 'R-SYSTOLIC-BLOOD-PRESSURE-3POINT-01', parameter: 'systolic-blood-pressure', points: 3,
    category: 'threshold-band', description: 'Systolic blood pressure < 90 mmHg',
    evaluate: (d) => systolicBloodPressurePoints(d) === 3
  },

  // ─── PARAMETER 5: PULSE ───────────────────────────────────────
  {
    id: 'R-PULSE-1POINT-01', parameter: 'pulse', points: 1,
    category: 'marker', description: 'Pulse >= 100 beats/min (tachycardia)',
    evaluate: (d) => pulsePoint(d) === 1
  },

  // ─── PARAMETER 6: MELAENA ─────────────────────────────────────
  {
    id: 'R-MELAENA-1POINT-01', parameter: 'melaena', points: 1,
    category: 'marker', description: 'Melaena present',
    evaluate: (d) => melaenaPoint(d) === 1
  },

  // ─── PARAMETER 7: SYNCOPE ─────────────────────────────────────
  {
    id: 'R-SYNCOPE-2POINT-01', parameter: 'syncope', points: 2,
    category: 'marker', description: 'Syncope present',
    evaluate: (d) => syncopePoint(d) === 2
  },

  // ─── PARAMETER 8: HEPATIC DISEASE ─────────────────────────────
  {
    id: 'R-HEPATIC-DISEASE-2POINT-01', parameter: 'hepatic-disease', points: 2,
    category: 'marker', description: 'History of hepatic disease',
    evaluate: (d) => hepaticDiseasePoint(d) === 2
  },

  // ─── PARAMETER 9: CARDIAC FAILURE ─────────────────────────────
  {
    id: 'R-CARDIAC-FAILURE-2POINT-01', parameter: 'cardiac-failure', points: 2,
    category: 'marker', description: 'History of cardiac failure',
    evaluate: (d) => cardiacFailurePoint(d) === 2
  }
];

Object.assign(window.GlasgowBlatchfordBleedingScore, {
  bloodUreaPoints,
  haemoglobinPoints,
  systolicBloodPressurePoints,
  pulsePoint,
  melaenaPoint,
  syncopePoint,
  hepaticDiseasePoint,
  cardiacFailurePoint,
  riskBandFor,
  gbsRules
});
})();
