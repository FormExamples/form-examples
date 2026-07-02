// Flagged-issue detection (red flags). Independent of the two imaging decisions
// (which the engine produces), this module raises clinician-facing safety and
// data-quality flags per spec §5:
//
//   - Ankle X-ray indicated (high)        — ankleXrayIndicated == true
//   - Foot X-ray indicated (high)         — footXrayIndicated == true
//   - Unable to bear weight (high)        — unableToBearWeight == true
//   - Applicability — age (medium)        — ageYears != null && ageYears < 18
//   - Unreliable assessment (medium)      — assessmentReliable == 'no'
//   - Incomplete assessment (low)         — a criterion input for a region whose
//                                           zone pain is present is missing
//
// Rows here mirror the `ottawa_ankle_rules_grade_flag` SQL table (flag_id,
// category, priority, description, suggested_action).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

// Wrapped in an IIFE; published via window.OttawaAnkleRules.
(function () {
'use strict';
window.OttawaAnkleRules = window.OttawaAnkleRules || {};

// Criterion inputs that feed the ankle decision, with a human label for the
// incomplete-assessment flag.
const ANKLE_INPUTS = [
  ['ankleTenderness', 'lateralMalleolusTenderness', 'lateral malleolus tenderness'],
  ['ankleTenderness', 'medialMalleolusTenderness', 'medial malleolus tenderness'],
  ['weightBearing', 'ableToBearWeightImmediately', 'able to bear weight immediately after injury'],
  ['weightBearing', 'ableToBearWeightNow', 'able to bear weight at assessment']
];

// Criterion inputs that feed the foot decision.
const FOOT_INPUTS = [
  ['footTenderness', 'fifthMetatarsalBaseTenderness', 'fifth-metatarsal-base tenderness'],
  ['footTenderness', 'navicularTenderness', 'navicular tenderness'],
  ['weightBearing', 'ableToBearWeightImmediately', 'able to bear weight immediately after injury'],
  ['weightBearing', 'ableToBearWeightNow', 'able to bear weight at assessment']
];

/**
 * @param {AssessmentData} data
 * @param {{ unableToBearWeight: boolean, ankleXrayIndicated: boolean,
 *           footXrayIndicated: boolean }} decision
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(data, decision) {
  /** @type {FlaggedIssue[]} */
  const flags = [];

  // ─── Ankle X-ray indicated (HIGH) ───────────────────────────
  if (decision.ankleXrayIndicated) {
    flags.push({
      id: 'F-ANKLE-XRAY-INDICATED-001',
      category: 'ankle-xray-indicated',
      priority: 'high',
      description: 'Ankle X-ray indicated — malleolar-zone pain with lateral/medial malleolus tenderness or inability to bear weight',
      suggestedAction: 'Request an ankle radiograph series.'
    });
  }

  // ─── Foot X-ray indicated (HIGH) ────────────────────────────
  if (decision.footXrayIndicated) {
    flags.push({
      id: 'F-FOOT-XRAY-INDICATED-001',
      category: 'foot-xray-indicated',
      priority: 'high',
      description: 'Foot X-ray indicated — midfoot-zone pain with fifth-metatarsal-base or navicular tenderness or inability to bear weight',
      suggestedAction: 'Request a foot radiograph series.'
    });
  }

  // ─── Unable to bear weight (HIGH) ───────────────────────────
  if (decision.unableToBearWeight) {
    flags.push({
      id: 'F-UNABLE-TO-BEAR-WEIGHT-001',
      category: 'unable-to-bear-weight',
      priority: 'high',
      description: 'Unable to bear weight — cannot take four steps both immediately after the injury and at assessment; this finding drives both the ankle and the foot decisions',
      suggestedAction: 'Apply the Ottawa criteria for both regions and image as indicated.'
    });
  }

  // ─── Applicability — age (MEDIUM) ───────────────────────────
  if (data.identification.ageYears !== null && data.identification.ageYears < 18) {
    flags.push({
      id: 'F-APPLICABILITY-AGE-001',
      category: 'applicability-age',
      priority: 'medium',
      description: `Patient is under 18 (${data.identification.ageYears}) — the rule is validated for adults; paediatric variants differ`,
      suggestedAction: 'Apply paediatric caution and follow local paediatric guidance, which takes precedence.'
    });
  }

  // ─── Unreliable assessment (MEDIUM) ─────────────────────────
  if (data.applicability.assessmentReliable === 'no') {
    flags.push({
      id: 'F-UNRELIABLE-ASSESSMENT-001',
      category: 'unreliable-assessment',
      priority: 'medium',
      description: 'Assessment marked unreliable — intoxication, distracting injury, or sensory deficit may invalidate the rule',
      suggestedAction: 'Consider imaging on clinical judgement regardless of the computed decision.'
    });
  }

  // ─── Incomplete assessment (LOW) ────────────────────────────
  const missing = new Set();
  if (data.painZones.malleolarZonePain === 'yes') {
    for (const [section, field, label] of ANKLE_INPUTS) {
      if (data[section][field] === '') missing.add(label);
    }
  }
  if (data.painZones.midfootZonePain === 'yes') {
    for (const [section, field, label] of FOOT_INPUTS) {
      if (data[section][field] === '') missing.add(label);
    }
  }
  if (missing.size > 0) {
    flags.push({
      id: 'F-INCOMPLETE-ASSESSMENT-001',
      category: 'incomplete-assessment',
      priority: 'low',
      description: `Missing criterion input(s) for a region with zone pain: ${Array.from(missing).join(', ')} — the decision may understate the need for imaging`,
      suggestedAction: 'Record the missing criterion answer(s) and re-assess.'
    });
  }

  // Sort: high > medium > low.
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

window.OttawaAnkleRules.detectFlaggedIssues = detectFlaggedIssues;
})();
