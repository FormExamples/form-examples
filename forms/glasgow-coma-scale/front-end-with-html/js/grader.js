// Glasgow Coma Scale grader. Pure functions: take an `AssessmentData` object,
// resolve each component descriptor to a numeric score (or null for "not
// testable"), sum the total, band it, and derive the secondary GCS-Pupils
// score.
//
// Grading algorithm (spec §4):
//   eyeScore    = descriptor score (1-4), or null when NT / unanswered
//   verbalScore = descriptor score (1-5), or null when NT / unanswered
//   motorScore  = descriptor score (1-6), or null when NT / unanswered
//   totalScore  = eye + verbal + motor, DEFINED ONLY when all three are numeric
//                 (any NT or unanswered component leaves totalScore = null)
//   severityBand = 13-15 mild | 9-12 moderate | 3-8 severe | '' when total null
//   pupilReactivityScore (PRS) = count of pupils unreactive to light (0-2),
//                 when both pupils examined; otherwise null
//   gcsP        = totalScore - PRS (1-15), when both are defined; else null
//   breakdown   = "E3 V-NT M5" style, marking any NT component
//   totalDisplay = numeric total, or "9T" for an intubated verbal NT (eye+motor)
//
// The function is total (never throws): missing inputs yield null outputs and a
// reliability flag is raised separately in `flags.js`.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FiredRule} FiredRule
 * @typedef {import('./types.js').SeverityBand} SeverityBand
 */

// Wrapped in an IIFE; published via window.GlasgowComaScale.
(function () {
'use strict';
window.GlasgowComaScale = window.GlasgowComaScale || {};
const {
  eyeOptions, verbalOptions, motorOptions,
  descriptorLabel, bandForTotal, severityBands
} = window.GlasgowComaScale;

/** Uppercase a descriptor enum for a rule id, e.g. 'to-sound' -> 'TO-SOUND'. */
function ruleToken(value) {
  return String(value).toUpperCase();
}

/**
 * Resolve one component: numeric score for a real descriptor, null for NT or
 * unanswered. `nt` is true only for an explicit NT selection.
 * @param {import('./rules.js').ComponentOption[]} options
 * @param {string} response
 */
function resolveComponent(options, response) {
  if (response === '' || response === null || response === undefined) {
    return { score: null, nt: false, answered: false };
  }
  if (response === 'NT') {
    return { score: null, nt: true, answered: true };
  }
  const opt = options.find((o) => o.value === response);
  return { score: opt ? opt.score : null, nt: false, answered: true };
}

/** Build the E/V/M breakdown token for one component. */
function breakdownToken(prefix, response, score) {
  if (response === '' || response === null || response === undefined) return '';
  if (response === 'NT') return `${prefix}-NT`;
  return `${prefix}${score}`;
}

/**
 * Compute the full GCS grade for the supplied assessment data.
 * @param {AssessmentData} data
 * @returns {Omit<import('./types.js').GradingResult, 'flaggedIssues' | 'timestamp'>}
 */
function calculateGcsGrade(data) {
  const eye = resolveComponent(eyeOptions, data.eye.eyeResponse);
  const verbal = resolveComponent(verbalOptions, data.verbal.verbalResponse);
  const motor = resolveComponent(motorOptions, data.motor.motorResponse);

  const eyeScore = eye.score;
  const verbalScore = verbal.score;
  const motorScore = motor.score;

  // Total is defined ONLY when all three components resolve to a number.
  const allNumeric =
    eyeScore !== null && verbalScore !== null && motorScore !== null;
  const totalScore = allNumeric ? eyeScore + verbalScore + motorScore : null;

  /** @type {SeverityBand} */
  const severityBand = bandForTotal(totalScore);

  // Breakdown string, e.g. "E3 V-NT M5".
  const breakdown = [
    breakdownToken('E', data.eye.eyeResponse, eyeScore),
    breakdownToken('V', data.verbal.verbalResponse, verbalScore),
    breakdownToken('M', data.motor.motorResponse, motorScore)
  ].filter(Boolean).join(' ');

  // Total display: numeric total, or the "T" convention for an intubated
  // verbal-NT patient (eye + motor sum with a trailing T, e.g. "9T").
  let totalDisplay = '';
  if (totalScore !== null) {
    totalDisplay = String(totalScore);
  } else if (
    data.verbal.verbalResponse === 'NT' &&
    data.confounders.intubated === 'yes' &&
    eyeScore !== null &&
    motorScore !== null
  ) {
    totalDisplay = `${eyeScore + motorScore}T`;
  }

  // Pupil Reactivity Score: count of pupils unreactive to light, when both
  // pupils were examined (reactivity recorded on each side).
  const left = data.pupils.leftPupilReactivity;
  const right = data.pupils.rightPupilReactivity;
  let pupilReactivityScore = null;
  if (left !== '' && right !== '') {
    pupilReactivityScore =
      (left === 'unreactive' ? 1 : 0) + (right === 'unreactive' ? 1 : 0);
  }

  // GCS-Pupils: total minus PRS, only when both are defined.
  const gcsP =
    totalScore !== null && pupilReactivityScore !== null
      ? totalScore - pupilReactivityScore
      : null;

  // ─── Audit trail: fired rules ────────────────────────────────
  /** @type {FiredRule[]} */
  const firedRules = [];

  const componentRule = (component, prefix, options, cell) => {
    const response = cell.response;
    if (response === '' || response === null || response === undefined) return;
    if (response === 'NT') {
      firedRules.push({
        id: `R-${prefix}-NOT-TESTABLE-01`,
        component,
        points: null,
        category: 'component-not-testable',
        description: `${component[0].toUpperCase()}${component.slice(1)} component not testable`
      });
      return;
    }
    firedRules.push({
      id: `R-${prefix}-${ruleToken(response)}-01`,
      component,
      points: cell.score,
      category: 'component-score',
      description: descriptorLabel(options, response)
    });
  };

  componentRule('eye', 'EYE', eyeOptions, { response: data.eye.eyeResponse, score: eyeScore });
  componentRule('verbal', 'VERBAL', verbalOptions, { response: data.verbal.verbalResponse, score: verbalScore });
  componentRule('motor', 'MOTOR', motorOptions, { response: data.motor.motorResponse, score: motorScore });

  if (severityBand) {
    const bandDef = severityBands.find((b) => b.band === severityBand);
    firedRules.push({
      id: `R-TOTAL-BAND-${ruleToken(severityBand)}-01`,
      component: 'total',
      points: totalScore,
      category: 'severity-band',
      description: `Total GCS ${totalScore} — ${bandDef ? bandDef.interpretation : severityBand}`
    });
  }

  if (pupilReactivityScore !== null) {
    firedRules.push({
      id: 'R-PUPIL-REACTIVITY-01',
      component: 'pupils',
      points: pupilReactivityScore,
      category: 'pupil-reactivity',
      description: `Pupil Reactivity Score ${pupilReactivityScore} (pupils unreactive to light)`
    });
  }

  if (gcsP !== null) {
    firedRules.push({
      id: 'R-GCS-P-01',
      component: 'gcs-p',
      points: gcsP,
      category: 'gcs-pupils',
      description: `GCS-Pupils = total ${totalScore} − PRS ${pupilReactivityScore} = ${gcsP}`
    });
  }

  return {
    eyeScore,
    verbalScore,
    motorScore,
    totalScore,
    breakdown,
    totalDisplay,
    severityBand,
    pupilReactivityScore,
    gcsP,
    firedRules
  };
}

Object.assign(window.GlasgowComaScale, {
  resolveComponent,
  calculateGcsGrade
});
})();
