// Emergency Department Triage Note grader. Pure functions: take an
// `AssessmentData` object, compute the supporting NEWS2 aggregate from the
// vital signs, evaluate the Manchester Triage System (MTS) discriminators, and
// assign the MTS priority level — the MOST URGENT (lowest-numbered) level any
// finding justifies.
//
// Classification algorithm (spec §4). This engine does NOT sum a total:
//   1. Score each vital-sign parameter 0-3 (NEWS2, Scale 1); sum the supporting
//      aggregate; note whether any single parameter scored 3.
//   2. Evaluate MTS discriminators — the boolean flags plus derived
//      discriminators (ACVPU U/C/V/P, SpO2 < 92, pain-score bands). Each forces
//      a minimum level.
//   3. Apply NEWS2 escalation: aggregate >= 7 OR any parameter == 3 forces at
//      least Level 2; aggregate 5-6 forces at least Level 3.
//   4. priorityLevel = the most urgent (lowest) level from steps 2 and 3;
//      default Level 4 (Standard), or Level 5 (Non-urgent) for a fully normal,
//      minimal presentation. Colour, name, and target time derive from the
//      level. Missing vital signs never lower the category.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').Subscores} Subscores
 * @typedef {import('./types.js').FiredDiscriminator} FiredDiscriminator
 * @typedef {import('./types.js').PriorityLevel} PriorityLevel
 */

// Wrapped in an IIFE; published via window.EmergencyDepartmentTriageNote.
(function () {
'use strict';
window.EmergencyDepartmentTriageNote = window.EmergencyDepartmentTriageNote || {};
const NS = window.EmergencyDepartmentTriageNote;
const {
  scoreRespiratoryRate,
  scoreSpo2,
  scoreOxygen,
  scoreBloodPressure,
  scorePulse,
  scoreConsciousness,
  scoreTemperature,
  DISCRIMINATOR_FLAGS,
  priorityColour,
  priorityName,
  targetMinutes
} = NS;

/** The six scored physiological parameters (oxygen weighting excluded). */
const RED_SCORE_KEYS = [
  'respiratoryRate', 'spo2', 'systolicBp', 'pulse', 'consciousness', 'temperature'
];

/**
 * Compute the seven NEWS2 subscores for the supplied assessment data.
 * @param {AssessmentData} data
 * @returns {Subscores}
 */
function computeSubscores(data) {
  const v = data.vitals;
  return {
    respiratoryRate: scoreRespiratoryRate(v.respiratoryRate),
    spo2: scoreSpo2(v.spo2),
    oxygen: scoreOxygen(v.onOxygen),
    systolicBp: scoreBloodPressure(v.systolicBp),
    pulse: scorePulse(v.pulse),
    consciousness: scoreConsciousness(v.consciousnessAcvpu),
    temperature: scoreTemperature(v.temperature)
  };
}

/**
 * Compute the supporting NEWS2 aggregate. Nulls (unrecorded) contribute 0.
 * @param {Subscores} s
 * @returns {number}
 */
function news2Aggregate(s) {
  return (
    (s.respiratoryRate || 0) +
    (s.spo2 || 0) +
    (s.oxygen || 0) +
    (s.systolicBp || 0) +
    (s.pulse || 0) +
    (s.consciousness || 0) +
    (s.temperature || 0)
  );
}

/**
 * Evaluate every MTS discriminator (boolean flags + derived findings). Returns
 * the audit trail of fired discriminators, each carrying the minimum level it
 * forces. Ordered most-urgent-first.
 * @param {AssessmentData} data
 * @returns {FiredDiscriminator[]}
 */
function deriveDiscriminators(data) {
  /** @type {FiredDiscriminator[]} */
  const fired = [];

  // Boolean discriminator flags.
  for (const def of DISCRIMINATOR_FLAGS) {
    if (data.discriminators[def.field] === 'yes') {
      fired.push({ id: def.id, category: def.category, level: def.level, description: def.description });
    }
  }

  // Derived: consciousness (ACVPU). U -> Level 1; C/V/P -> Level 2.
  const acvpu = data.vitals.consciousnessAcvpu;
  if (acvpu === 'U') {
    fired.push({ id: 'D-ACVPU-UNRESPONSIVE', category: 'disability', level: 1, description: 'Unresponsive on ACVPU' });
  } else if (acvpu === 'C' || acvpu === 'V' || acvpu === 'P') {
    fired.push({ id: 'D-ACVPU-REDUCED', category: 'disability', level: 2, description: `Reduced consciousness on ACVPU (${acvpu})` });
  }

  // Derived: oxygen saturation < 92% -> Level 2.
  const spo2 = data.vitals.spo2;
  if (spo2 !== null && spo2 !== undefined && spo2 < 92) {
    fired.push({ id: 'D-HYPOXIA', category: 'breathing', level: 2, description: `Oxygen saturation ${spo2}% (< 92%)` });
  }

  // Derived: pain-score bands. >= 7 -> Level 2 (severe); 4-6 -> Level 3 (moderate).
  const pain = data.pain.painScore;
  if (pain !== null && pain !== undefined) {
    if (pain >= 7) {
      fired.push({ id: 'D-PAIN-SEVERE', category: 'pain', level: 2, description: `Severe pain (score ${pain}/10)` });
    } else if (pain >= 4) {
      fired.push({ id: 'D-PAIN-MODERATE', category: 'pain', level: 3, description: `Moderate pain (score ${pain}/10)` });
    }
  }

  return fired;
}

/**
 * NEWS2 escalation as MTS discriminators (spec §4 step 3).
 *   aggregate >= 7 OR any parameter == 3 -> at least Level 2
 *   aggregate 5-6                        -> at least Level 3
 * @param {number} aggregate
 * @param {boolean} anyParameterThree
 * @returns {FiredDiscriminator[]}
 */
function news2Escalation(aggregate, anyParameterThree) {
  /** @type {FiredDiscriminator[]} */
  const fired = [];
  if (aggregate >= 7 || anyParameterThree) {
    fired.push({
      id: 'D-NEWS2-HIGH',
      category: 'news2',
      level: 2,
      description: anyParameterThree && aggregate < 7
        ? 'NEWS2 single parameter scored 3 — escalate to at least Very urgent'
        : `NEWS2 aggregate ${aggregate} (≥ 7) — escalate to at least Very urgent`
    });
  } else if (aggregate >= 5) {
    fired.push({
      id: 'D-NEWS2-MEDIUM',
      category: 'news2',
      level: 3,
      description: `NEWS2 aggregate ${aggregate} (5–6) — escalate to at least Urgent`
    });
  }
  return fired;
}

/**
 * Assign the full triage classification for the supplied assessment data.
 * @param {AssessmentData} data
 * @returns {{ subscores: Subscores, news2Total: number,
 *             news2AnyParameterThree: boolean,
 *             firedDiscriminators: FiredDiscriminator[],
 *             priorityLevel: PriorityLevel, priorityColour: string,
 *             priorityName: string, targetMinutes: number, complete: boolean }}
 */
function triage(data) {
  const subscores = computeSubscores(data);
  const news2Total = news2Aggregate(subscores);
  const news2AnyParameterThree = RED_SCORE_KEYS.some((k) => subscores[k] === 3);

  const discriminators = deriveDiscriminators(data);
  const escalation = news2Escalation(news2Total, news2AnyParameterThree);

  // Full audit trail, most-urgent-first.
  const firedDiscriminators = discriminators
    .concat(escalation)
    .sort((a, b) => a.level - b.level);

  // priorityLevel = most urgent (lowest) forced level. Default Level 4
  // (Standard). A fully normal, minimal presentation (nothing fired, NEWS2 0,
  // explicit pain score 0) is Level 5 (Non-urgent). Missing data never lowers
  // the category.
  let priorityLevel = 4;
  if (firedDiscriminators.length > 0) {
    priorityLevel = firedDiscriminators.reduce(
      (min, d) => Math.min(min, d.level), 5
    );
  } else if (news2Total === 0 && data.pain.painScore === 0) {
    priorityLevel = 5;
  }

  const complete =
    subscores.respiratoryRate !== null &&
    subscores.spo2 !== null &&
    data.vitals.onOxygen !== '' &&
    subscores.systolicBp !== null &&
    subscores.pulse !== null &&
    subscores.consciousness !== null &&
    subscores.temperature !== null;

  return {
    subscores,
    news2Total,
    news2AnyParameterThree,
    firedDiscriminators,
    priorityLevel,
    priorityColour: priorityColour(priorityLevel),
    priorityName: priorityName(priorityLevel),
    targetMinutes: targetMinutes(priorityLevel),
    complete
  };
}

Object.assign(window.EmergencyDepartmentTriageNote, {
  computeSubscores,
  news2Aggregate,
  deriveDiscriminators,
  news2Escalation,
  triage
});
})();
