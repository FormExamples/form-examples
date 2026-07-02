// Flagged-issue detection (red flags). Independent of the signed ROSIER total
// (which the grader produces), this module raises clinician-facing safety flags
// per spec §5:
//
//   - Activate stroke pathway (high)     — rosierScore > 0
//   - Hypoglycaemia mimic (high)         — bloodGlucose != null && < 3.5
//   - Seizure / LOC caution (medium)     — seizureActivity == 'yes' or lossOfConsciousness == 'yes'
//   - Clinical suspicion override (medium) — rosierScore <= 0 but any focal sign present
//   - Incomplete assessment (low)        — bloodGlucose missing or any criterion unanswered
//
// Rows here mirror the
// `recognition_of_stroke_in_the_emergency_room_grade_flag` SQL table
// (flag_id, category, priority, description, suggested_action).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

// Wrapped in an IIFE; published via window.RecognitionOfStrokeInTheEmergencyRoom.
(function () {
'use strict';
window.RecognitionOfStrokeInTheEmergencyRoom =
  window.RecognitionOfStrokeInTheEmergencyRoom || {};

const SIGN_FIELDS = [
  ['facialWeakness', 'asymmetric facial weakness'],
  ['armWeakness', 'asymmetric arm weakness'],
  ['legWeakness', 'asymmetric leg weakness'],
  ['speechDisturbance', 'speech disturbance'],
  ['visualFieldDefect', 'visual field defect']
];

const MIMIC_FIELDS = [
  ['lossOfConsciousness', 'loss of consciousness / syncope'],
  ['seizureActivity', 'seizure activity']
];

/**
 * @param {AssessmentData} data
 * @param {number} rosierScore  - signed total -2..+5 from the grader
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(data, rosierScore) {
  /** @type {FlaggedIssue[]} */
  const flags = [];

  const glucose = data.precondition.bloodGlucose;
  const loc = data.mimics.lossOfConsciousness;
  const seizure = data.mimics.seizureActivity;
  const signsPresent = SIGN_FIELDS
    .filter(([field]) => data.signs[field] === 'yes')
    .map(([, label]) => label);

  // ─── Activate stroke pathway (HIGH) ─────────────────────────
  if (rosierScore > 0) {
    flags.push({
      id: 'F-ACTIVATE-STROKE-PATHWAY-001',
      category: 'activate-stroke-pathway',
      priority: 'high',
      description: `Positive ROSIER screen (score ${rosierScore > 0 ? '+' : ''}${rosierScore}) — stroke likely; time is brain`,
      suggestedAction:
        'Activate the acute stroke pathway: urgent stroke-team referral, immediate CT / imaging, and start the thrombolysis / reperfusion clock.'
    });
  }

  // ─── Hypoglycaemia mimic (HIGH) ─────────────────────────────
  if (glucose !== null && glucose < 3.5) {
    flags.push({
      id: 'F-HYPOGLYCAEMIA-MIMIC-001',
      category: 'hypoglycaemia-mimic',
      priority: 'high',
      description: `Blood glucose ${glucose} mmol/L is below the 3.5 mmol/L threshold — a treatable stroke mimic`,
      suggestedAction:
        'Correct the hypoglycaemia and reassess; the ROSIER score is not valid while the patient is hypoglycaemic.'
    });
  }

  // ─── Seizure / LOC caution (MEDIUM) ─────────────────────────
  if (seizure === 'yes' || loc === 'yes') {
    const present = MIMIC_FIELDS
      .filter(([field]) => data.mimics[field] === 'yes')
      .map(([, label]) => label);
    flags.push({
      id: 'F-SEIZURE-LOC-CAUTION-001',
      category: 'seizure-loc-caution',
      priority: 'medium',
      description: `Mimic present (${present.join(', ')}) pulling the score down — a negative total does not exclude stroke`,
      suggestedAction:
        'Weigh clinical suspicion: a mimic subtracts a point, so a low total may understate stroke risk. Escalate if suspicion remains.'
    });
  }

  // ─── Clinical suspicion override (MEDIUM) ───────────────────
  if (rosierScore <= 0 && signsPresent.length > 0) {
    flags.push({
      id: 'F-CLINICAL-SUSPICION-OVERRIDE-001',
      category: 'clinical-suspicion-override',
      priority: 'medium',
      description: `Stroke unlikely by score (${rosierScore}) yet focal sign(s) recorded: ${signsPresent.join(', ')}`,
      suggestedAction:
        'Stroke is not excluded — consider mimics and alternative diagnoses, and escalate if clinical suspicion of stroke remains.'
    });
  }

  // ─── Incomplete assessment (LOW) ────────────────────────────
  const missing = [];
  if (glucose === null) missing.push('blood glucose');
  for (const [field, label] of MIMIC_FIELDS) {
    if (data.mimics[field] === '') missing.push(label);
  }
  for (const [field, label] of SIGN_FIELDS) {
    if (data.signs[field] === '') missing.push(label);
  }
  if (missing.length > 0) {
    flags.push({
      id: 'F-INCOMPLETE-ASSESSMENT-001',
      category: 'incomplete-assessment',
      priority: 'low',
      description: `Missing precondition or criterion input(s): ${missing.join(', ')} — the total may be unreliable`,
      suggestedAction:
        'Record the missing blood glucose and / or criterion answer(s) and re-score.'
    });
  }

  // Sort: high > medium > low.
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

window.RecognitionOfStrokeInTheEmergencyRoom.detectFlaggedIssues =
  detectFlaggedIssues;
})();
