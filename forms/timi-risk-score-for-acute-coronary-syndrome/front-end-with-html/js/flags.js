// Flagged-issue detection (red flags). Independent of the total TIMI score
// (which the grader produces), this module raises clinician-facing safety flags
// per spec §5:
//
//   - High-risk score (high)             — timiScore >= 5
//   - Positive troponin with ST dev (high) — positiveCardiacMarker == 'yes' && stDeviation == 'yes'
//   - Positive cardiac marker (high)     — positiveCardiacMarker == 'yes'
//   - ST deviation (medium)              — stDeviation == 'yes'
//   - Intermediate-risk score (medium)   — timiScore 2-4
//   - Incomplete assessment (low)        — any of the seven criterion inputs missing ('')
//
// Rows here mirror the
// `timi_risk_score_for_acute_coronary_syndrome_grade_flag` SQL table
// (flag_id, category, priority, description, suggested_action).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

// Wrapped in an IIFE; published via window.TimiRiskScoreForAcuteCoronarySyndrome.
(function () {
'use strict';
window.TimiRiskScoreForAcuteCoronarySyndrome =
  window.TimiRiskScoreForAcuteCoronarySyndrome || {};

/**
 * @param {AssessmentData} data
 * @param {number} timiScore  - total 0-7 from the grader
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(data, timiScore) {
  /** @type {FlaggedIssue[]} */
  const flags = [];

  const stDeviation = data.investigations.stDeviation;
  const marker = data.investigations.positiveCardiacMarker;

  // ─── High-risk score (HIGH) ─────────────────────────────────
  if (timiScore >= 5) {
    flags.push({
      id: 'F-HIGH-RISK-SCORE-001',
      category: 'high-risk-score',
      priority: 'high',
      description: `High TIMI score (${timiScore} of 7) — high 14-day risk of death, MI, or urgent revascularisation`,
      suggestedAction:
        'Pursue an early invasive strategy with urgent cardiology / coronary-care involvement and intensified antithrombotic therapy.'
    });
  }

  // ─── Positive troponin with ST deviation (HIGH) ─────────────
  if (marker === 'yes' && stDeviation === 'yes') {
    flags.push({
      id: 'F-MARKER-WITH-ST-DEVIATION-001',
      category: 'marker-with-st-deviation',
      priority: 'high',
      description:
        'Positive cardiac marker with ST deviation — objective evidence of NSTEMI with a dynamic ECG change',
      suggestedAction:
        'Expedite invasive assessment; treat as high-risk NSTEMI per local ACS pathway.'
    });
  }

  // ─── Positive cardiac marker (HIGH) ─────────────────────────
  if (marker === 'yes') {
    flags.push({
      id: 'F-POSITIVE-CARDIAC-MARKER-001',
      category: 'positive-cardiac-marker',
      priority: 'high',
      description:
        'Positive cardiac marker (elevated troponin / CK-MB) — myocardial injury present',
      suggestedAction:
        'Confirm the diagnosis of NSTEMI, start guideline-directed medical therapy, and involve cardiology.'
    });
  }

  // ─── ST deviation (MEDIUM) ──────────────────────────────────
  if (stDeviation === 'yes') {
    flags.push({
      id: 'F-ST-DEVIATION-001',
      category: 'st-deviation',
      priority: 'medium',
      description:
        'ST-segment deviation >= 0.5 mm on the presenting ECG — ischaemic ECG change',
      suggestedAction:
        'Obtain serial ECGs and cardiology review; correlate with cardiac markers.'
    });
  }

  // ─── Intermediate-risk score (MEDIUM) ───────────────────────
  if (timiScore >= 2 && timiScore <= 4) {
    flags.push({
      id: 'F-INTERMEDIATE-RISK-SCORE-001',
      category: 'intermediate-risk-score',
      priority: 'medium',
      description: `Intermediate TIMI score (${timiScore} of 7) — an early invasive strategy should be considered`,
      suggestedAction:
        'Admit for observation with guideline-directed medical therapy; consider an early invasive strategy and cardiology review.'
    });
  }

  // ─── Incomplete assessment (LOW) ────────────────────────────
  const missing = [];
  if (data.riskProfile.ageOver65 === '') missing.push('age >= 65');
  if (data.riskProfile.threeOrMoreCadRiskFactors === '') missing.push('>= 3 coronary risk factors');
  if (data.cardiacHistory.knownCadStenosis === '') missing.push('known CAD (stenosis >= 50%)');
  if (data.cardiacHistory.aspirinUsePrior7Days === '') missing.push('aspirin use in prior 7 days');
  if (data.presentation.twoOrMoreAnginaEpisodes24h === '') missing.push('>= 2 anginal episodes in 24 h');
  if (data.investigations.stDeviation === '') missing.push('ST deviation');
  if (data.investigations.positiveCardiacMarker === '') missing.push('positive cardiac marker');
  if (missing.length > 0) {
    flags.push({
      id: 'F-INCOMPLETE-ASSESSMENT-001',
      category: 'incomplete-assessment',
      priority: 'low',
      description: `Missing criterion input(s): ${missing.join(', ')} — the score may understate risk`,
      suggestedAction:
        'Record the missing criterion(s) and re-score.'
    });
  }

  // Sort: high > medium > low.
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

window.TimiRiskScoreForAcuteCoronarySyndrome.detectFlaggedIssues =
  detectFlaggedIssues;
})();
