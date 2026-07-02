// Flagged-issue detection (red flags). Independent of the Aldrete total (which
// the grader produces), this module raises clinician-facing safety flags per
// spec §5:
//
//   - Not ready for discharge (high) — aldreteTotal < 9 OR oxygenSaturationScore < 2
//   - Hypoxia (high)                 — oxygenSaturationScore < 2
//   - Unstable vital signs (high)    — circulationScore < 2 OR respirationScore < 2
//   - Uncontrolled pain (medium)     — painScore >= 4 / 10
//   - Uncontrolled PONV (medium)     — ponvSeverity moderate or severe
//   - Surgical bleeding (high)       — PADSS surgical-bleeding criterion < 2
//   - Incomplete assessment (low)    — any Aldrete parameter input missing
//
// Rows here mirror the `post_anaesthesia_care_unit_record_grade_flag` SQL table
// (flag_id, category, priority, description, suggested_action).

/**
 * @typedef {import('./types.js').PacuRecord} PacuRecord
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

// Wrapped in an IIFE; published via window.PostAnaesthesiaCareUnitRecord.
(function () {
'use strict';
window.PostAnaesthesiaCareUnitRecord =
  window.PostAnaesthesiaCareUnitRecord || {};
const { padssScore } = window.PostAnaesthesiaCareUnitRecord;

// Pain score at or above this threshold is treated as uncontrolled.
const PAIN_THRESHOLD = 4;

/**
 * @param {PacuRecord} data
 * @param {{ activityScore:number, respirationScore:number, circulationScore:number,
 *           consciousnessScore:number, oxygenSaturationScore:number,
 *           aldreteTotal:number }} grade
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(data, grade) {
  /** @type {FlaggedIssue[]} */
  const flags = [];

  const {
    respirationScore, circulationScore, oxygenSaturationScore, aldreteTotal
  } = grade;
  const painScore = data.observations.painScore;
  const ponv = data.observations.ponvSeverity;

  // ─── Not ready for discharge (HIGH) ─────────────────────────
  if (aldreteTotal < 9 || oxygenSaturationScore < 2) {
    const reason =
      aldreteTotal < 9
        ? `Modified Aldrete total ${aldreteTotal}/10 is below the discharge threshold of 9`
        : `Modified Aldrete total ${aldreteTotal}/10 but the oxygen-saturation parameter scores below 2`;
    flags.push({
      id: 'F-NOT-READY-ALDRETE-UNDER-9-001',
      category: 'not-ready-for-discharge',
      priority: 'high',
      description: `${reason} — PACU discharge criteria not met`,
      suggestedAction:
        'Continue recovery observation and active management; address the parameter(s) scoring below 2 and do not discharge from PACU.'
    });
  }

  // ─── Hypoxia (HIGH) ─────────────────────────────────────────
  if (oxygenSaturationScore < 2) {
    flags.push({
      id: 'F-HYPOXIA-001',
      category: 'hypoxia',
      priority: 'high',
      description:
        'Oxygen-saturation parameter below 2 — SpO2 below the room-air threshold or oxygen-dependent',
      suggestedAction:
        'Optimise oxygen delivery and airway, monitor SpO2 continuously, and seek anaesthetic review before discharge.'
    });
  }

  // ─── Unstable vital signs (HIGH) ────────────────────────────
  if (circulationScore < 2 || respirationScore < 2) {
    const parts = [];
    if (circulationScore < 2) parts.push('blood pressure far from baseline');
    if (respirationScore < 2) parts.push('compromised breathing');
    flags.push({
      id: 'F-UNSTABLE-VITALS-001',
      category: 'unstable-vital-signs',
      priority: 'high',
      description: `Unstable vital signs — ${parts.join(' and ')}`,
      suggestedAction:
        'Reassess and stabilise circulation and respiration; treat the underlying cause before considering discharge.'
    });
  }

  // ─── Uncontrolled pain (MEDIUM) ─────────────────────────────
  if (painScore !== null && painScore >= PAIN_THRESHOLD) {
    flags.push({
      id: 'F-UNCONTROLLED-PAIN-001',
      category: 'uncontrolled-pain',
      priority: 'medium',
      description: `Pain score ${painScore}/10 at or above the acceptable threshold of ${PAIN_THRESHOLD}`,
      suggestedAction:
        'Titrate analgesia to an acceptable pain score and reassess before discharge.'
    });
  }

  // ─── Uncontrolled PONV (MEDIUM) ─────────────────────────────
  if (ponv === 'moderate' || ponv === 'severe') {
    flags.push({
      id: 'F-UNCONTROLLED-PONV-001',
      category: 'uncontrolled-ponv',
      priority: 'medium',
      description: `Post-operative nausea and vomiting is ${ponv} despite treatment`,
      suggestedAction:
        'Give / escalate antiemetics per local policy and reassess before discharge.'
    });
  }

  // ─── Surgical bleeding (HIGH) ───────────────────────────────
  const bleedingScore = padssScore(
    'padssSurgicalBleeding', data.padss.padssSurgicalBleeding
  );
  if (bleedingScore !== null && bleedingScore < 2) {
    flags.push({
      id: 'F-BLEEDING-001',
      category: 'surgical-bleeding',
      priority: 'high',
      description: 'PADSS surgical-bleeding criterion below 2 — more than minimal bleeding',
      suggestedAction:
        'Inspect the wound / dressing, quantify blood loss, and escalate to the surgical team.'
    });
  }

  // ─── Incomplete assessment (LOW) ────────────────────────────
  const missing = [];
  if (data.activity.activity === '') missing.push('activity');
  if (data.respiration.respiration === '') missing.push('respiration');
  if (data.circulation.circulation === '') missing.push('circulation');
  if (data.consciousness.consciousness === '') missing.push('consciousness');
  if (data.oxygenSaturation.oxygenSaturation === '') missing.push('oxygen saturation');
  if (missing.length > 0) {
    flags.push({
      id: 'F-INCOMPLETE-ASSESSMENT-001',
      category: 'incomplete-assessment',
      priority: 'low',
      description: `Missing Aldrete parameter input(s): ${missing.join(', ')} — the total may understate risk`,
      suggestedAction:
        'Record the missing observation(s) and re-score.'
    });
  }

  // Sort: high > medium > low.
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

window.PostAnaesthesiaCareUnitRecord.detectFlaggedIssues = detectFlaggedIssues;
})();
