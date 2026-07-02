// Flagged-issue detection (red flags). Independent of the aggregate risk band
// (which the grader produces), this module raises clinician-facing safety flags
// per spec §5:
//
//   - Aggregate escalation (high)      — mewsScore >= 5
//   - Single-parameter trigger (high)  — any parameter sub-score == 3
//   - Deteriorating trend (high)       — previousMewsScore != null && mewsScore > previousMewsScore
//   - Hypotension (high)               — systolicBloodPressure <= 100
//   - Reduced consciousness (high)     — avpu is voice / pain / unresponsive
//   - Tachypnoea / bradypnoea (medium) — respiratoryRate >= 21 or < 9
//   - Tachycardia / bradycardia (medium) — heartRate >= 111 or <= 40
//   - Pyrexia / hypothermia (medium)   — temperature >= 38.5 or < 35.0
//   - Incomplete observation (low)     — any of the five parameter inputs missing
//
// Rows here mirror the `modified_early_warning_score_grade_flag` SQL table
// (flag_id, category, priority, description, suggested_action).

/**
 * @typedef {import('./types.js').ObservationData} ObservationData
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

// Wrapped in an IIFE; published via window.ModifiedEarlyWarningScore.
(function () {
'use strict';
window.ModifiedEarlyWarningScore =
  window.ModifiedEarlyWarningScore || {};
const { avpuLabel } = window.ModifiedEarlyWarningScore;

/**
 * @param {ObservationData} data
 * @param {{ mewsScore: number, singleParameterTrigger: boolean,
 *           firedParameters: import('./types.js').FiredParameter[] }} grade
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(data, grade) {
  /** @type {FlaggedIssue[]} */
  const flags = [];

  const sbp = data.bloodPressure.systolicBloodPressure;
  const hr = data.heartRate.heartRate;
  const rr = data.respiratory.respiratoryRate;
  const temp = data.temperature.temperature;
  const avpu = data.consciousness.avpu;
  const previous = data.summary.previousMewsScore;
  const score = grade.mewsScore;

  // ─── Aggregate escalation (HIGH) ────────────────────────────
  if (score >= 5) {
    flags.push({
      id: 'F-AGGREGATE-ESCALATION-001',
      category: 'aggregate-escalation',
      priority: 'high',
      description: `High-risk aggregate MEWS ${score} of 14 (at or above the escalation threshold of 5)`,
      suggestedAction:
        'Obtain urgent medical review, consider critical-care outreach, and start continuous monitoring.'
    });
  }

  // ─── Single-parameter trigger (HIGH) ────────────────────────
  if (grade.singleParameterTrigger) {
    const which = grade.firedParameters
      .filter((f) => f.instrument !== 'aggregate' && f.instrument !== 'single-parameter' && f.points === 3)
      .map((f) => f.instrument)
      .join(', ');
    flags.push({
      id: 'F-SINGLE-PARAMETER-3-001',
      category: 'single-parameter-3',
      priority: 'high',
      description: `A single parameter scored the maximum 3 (${which}) — critical single-axis derangement`,
      suggestedAction:
        'Urgent medical review is warranted regardless of the aggregate; escalate now.'
    });
  }

  // ─── Deteriorating trend (HIGH) ─────────────────────────────
  if (previous !== null && previous !== undefined && score > previous) {
    flags.push({
      id: 'F-DETERIORATING-TREND-001',
      category: 'deteriorating-trend',
      priority: 'high',
      description: `Aggregate rose from ${previous} to ${score} across observation sets — deteriorating trend`,
      suggestedAction:
        'Escalate even within the same band; increase observation frequency and review the trajectory.'
    });
  }

  // ─── Hypotension (HIGH) ─────────────────────────────────────
  if (sbp !== null && sbp <= 100) {
    flags.push({
      id: 'F-HYPOTENSION-001',
      category: 'hypotension',
      priority: 'high',
      description: `Systolic blood pressure ${sbp} mmHg at or below 100 mmHg — risk of shock`,
      suggestedAction:
        'Reassess perfusion, consider fluid resuscitation and continuous blood-pressure monitoring.'
    });
  }

  // ─── Reduced consciousness (HIGH) ───────────────────────────
  if (avpu === 'voice' || avpu === 'pain' || avpu === 'unresponsive') {
    flags.push({
      id: 'F-REDUCED-CONSCIOUSNESS-001',
      category: 'reduced-consciousness',
      priority: 'high',
      description: `Level of consciousness reduced (${avpuLabel(avpu)}) — not alert`,
      suggestedAction:
        'Assess airway and neurology, check glucose, and consider causes of reduced consciousness.'
    });
  }

  // ─── Tachypnoea / bradypnoea (MEDIUM) ───────────────────────
  if (rr !== null && (rr >= 21 || rr < 9)) {
    const kind = rr < 9 ? 'Bradypnoea' : 'Tachypnoea';
    flags.push({
      id: 'F-TACHYPNOEA-BRADYPNOEA-001',
      category: 'tachypnoea-bradypnoea',
      priority: 'medium',
      description: `${kind}: respiratory rate ${rr} breaths/min outside the 9-20 range`,
      suggestedAction:
        'Check oxygen saturation and work of breathing; consider respiratory support.'
    });
  }

  // ─── Tachycardia / bradycardia (MEDIUM) ─────────────────────
  if (hr !== null && (hr >= 111 || hr <= 40)) {
    const kind = hr <= 40 ? 'Bradycardia' : 'Tachycardia';
    flags.push({
      id: 'F-TACHYCARDIA-BRADYCARDIA-001',
      category: 'tachycardia-bradycardia',
      priority: 'medium',
      description: `${kind}: heart rate ${hr} bpm outside the 41-110 range`,
      suggestedAction:
        'Obtain a rhythm strip / ECG and review perfusion; treat the underlying cause.'
    });
  }

  // ─── Pyrexia / hypothermia (MEDIUM) ─────────────────────────
  if (temp !== null && (temp >= 38.5 || temp < 35.0)) {
    const kind = temp < 35.0 ? 'Hypothermia' : 'Pyrexia';
    flags.push({
      id: 'F-PYREXIA-HYPOTHERMIA-001',
      category: 'pyrexia-hypothermia',
      priority: 'medium',
      description: `${kind}: temperature ${temp} °C outside the 35.0-38.4 °C range`,
      suggestedAction:
        'Consider infection / sepsis screen and active warming or cooling as appropriate.'
    });
  }

  // ─── Incomplete observation (LOW) ───────────────────────────
  const missing = [];
  if (sbp === null) missing.push('systolic blood pressure');
  if (hr === null) missing.push('heart rate');
  if (rr === null) missing.push('respiratory rate');
  if (temp === null) missing.push('temperature');
  if (avpu === '') missing.push('level of consciousness (AVPU)');
  if (missing.length > 0) {
    flags.push({
      id: 'F-INCOMPLETE-OBSERVATION-001',
      category: 'incomplete-observation',
      priority: 'low',
      description: `Missing parameter input(s): ${missing.join(', ')} — the aggregate may understate risk`,
      suggestedAction:
        'Record the missing bedside observation(s) and re-score.'
    });
  }

  // Sort: high > medium > low.
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

window.ModifiedEarlyWarningScore.detectFlaggedIssues = detectFlaggedIssues;
})();
