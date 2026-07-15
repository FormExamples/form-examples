// Flagged-issue detection (safety-escalation flags). Computed independently of
// the aggregate risk band (which the grader produces), this module raises
// clinician-facing safety flags per spec §5. Rule/category IDs are shared with
// the SvelteKit front-end and the Loco back-end, mirroring the
// `national_early_warning_score_2_grade_flag` SQL table
// (flag_id, category, priority, description, suggested_action):
//
//   - red-score (high)            — any single parameter subscore == 3
//   - aggregate-high (high)       — aggregate >= 7; emergency critical-care review
//   - aggregate-medium (medium)   — aggregate 5-6; urgent clinical review
//   - new-confusion (high)        — ACVPU != A (new confusion / altered)
//   - hypoxia (high)              — SpO2 below the selected scale's target
//   - hypotension (high)          — systolic BP <= 90 mmHg
//   - on-oxygen (medium)          — supplemental oxygen in use
//   - out-of-scope (high)         — age < 16, pregnancy, or spinal-cord injury
//   - incomplete-observation (low)— any scored parameter not yet recorded

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').Subscores} Subscores
 * @typedef {import('./types.js').Flag} Flag
 */

// Wrapped in an IIFE; published via window.NationalEarlyWarningScore2.

/**
 * @param {AssessmentData} data
 * @param {{ subscores: Subscores, aggregate: number, redScore: boolean }} grade
 * @returns {Flag[]}
 */
function detectFlaggedIssues(data, grade) {
  /** @type {Flag[]} */
  const flags = [];
  const { subscores, aggregate, redScore } = grade;

  const scale = data.context.spo2Scale;
  const spo2 = data.oxygenSaturation.spo2;
  const onOxygen = data.oxygenSupport.onOxygen;
  const sbp = data.bloodPressure.systolicBloodPressure;
  const acvpu = data.consciousness.consciousnessAcvpu;

  // ─── Red score (HIGH) ───────────────────────────────────────
  if (redScore) {
    const which = [];
    if (subscores.respiratoryRate === 3) which.push('respiration rate');
    if (subscores.spo2 === 3) which.push('oxygen saturation');
    if (subscores.systolicBp === 3) which.push('systolic blood pressure');
    if (subscores.pulse === 3) which.push('pulse');
    if (subscores.consciousness === 3) which.push('consciousness');
    if (subscores.temperature === 3) which.push('temperature');
    flags.push({
      id: 'F-SINGLE-PARAMETER-3-001',
      category: 'red-score',
      priority: 'high',
      description: `Red score: ${which.join(', ')} scored 3 — an extreme single-parameter derangement the aggregate can mask.`,
      suggestedAction:
        'Urgent review by a ward-based clinician to decide whether escalation of care is needed; monitor at least 1-hourly.'
    });
  }

  // ─── Aggregate high (HIGH) ──────────────────────────────────
  if (aggregate >= 7) {
    flags.push({
      id: 'F-HIGH-SCORE-ESCALATE-001',
      category: 'aggregate-high',
      priority: 'high',
      description: `Aggregate NEWS2 total ${aggregate} (≥ 7) — high clinical risk.`,
      suggestedAction:
        'Emergency assessment by a critical-care-competent team; continuous vital-sign monitoring; consider transfer to a higher level of care.'
    });
  } else if (aggregate >= 5) {
    // ─── Aggregate medium (MEDIUM) ────────────────────────────
    flags.push({
      id: 'F-HIGH-SCORE-ESCALATE-002',
      category: 'aggregate-medium',
      priority: 'medium',
      description: `Aggregate NEWS2 total ${aggregate} (5–6) — medium clinical risk.`,
      suggestedAction:
        'Urgent review by a clinician or team competent in acute illness; monitor at least 1-hourly.'
    });
  }

  // ─── New confusion / altered consciousness (HIGH) ───────────
  if (acvpu !== '' && acvpu !== 'A') {
    flags.push({
      id: 'F-NEW-CONFUSION-001',
      category: 'new-confusion',
      priority: 'high',
      description: 'New confusion or reduced consciousness on ACVPU (not "Alert").',
      suggestedAction:
        'Consider sepsis, hypoxia, hypoglycaemia, and other acute causes; assess airway and neurology.'
    });
  }

  // ─── Hypoxia (HIGH) — SpO2 below the selected scale's target ─
  if (spo2 !== null) {
    const hypoxic =
      scale === 'scale-2' ? spo2 <= 87 : spo2 <= 93;
    if (hypoxic) {
      flags.push({
        id: 'F-HYPOXIA-001',
        category: 'hypoxia',
        priority: 'high',
        description: `Oxygen saturation ${spo2}% below the target range for ${scale === 'scale-2' ? 'Scale 2 (88–92%)' : 'Scale 1 (≥ 96%)'}.`,
        suggestedAction:
          'Assess airway and breathing, titrate oxygen to the prescribed target range, and reassess.'
      });
    }
  }

  // ─── Hypotension (HIGH) ─────────────────────────────────────
  if (sbp !== null && sbp <= 90) {
    flags.push({
      id: 'F-HYPOTENSION-001',
      category: 'hypotension',
      priority: 'high',
      description: `Systolic blood pressure ${sbp} mmHg at or below the 90 mmHg threshold — risk of shock.`,
      suggestedAction:
        'Reassess perfusion, consider fluid resuscitation and continuous blood-pressure monitoring.'
    });
  }

  // ─── On supplemental oxygen (MEDIUM) ────────────────────────
  if (onOxygen === 'oxygen') {
    flags.push({
      id: 'F-ON-OXYGEN-001',
      category: 'on-oxygen',
      priority: 'medium',
      description: 'Patient receiving supplemental oxygen (scores 2 for the air-or-oxygen item).',
      suggestedAction:
        'Interpret saturations against the prescribed target; review whether oxygen can be weaned.'
    });
  }

  // ─── Out of clinical scope (HIGH) ───────────────────────────
  const scopeReasons = [];
  if (data.identification.isUnder16 === 'yes') scopeReasons.push('age under 16');
  if (data.identification.isPregnant === 'yes') scopeReasons.push('pregnancy');
  if (data.identification.hasSpinalCordInjury === 'yes') scopeReasons.push('spinal-cord injury');
  if (scopeReasons.length > 0) {
    flags.push({
      id: 'F-OUT-OF-SCOPE-001',
      category: 'out-of-scope',
      priority: 'high',
      description: `NEWS2 is not validated for this patient (${scopeReasons.join(', ')}).`,
      suggestedAction:
        'Do not rely on the NEWS2 aggregate; use the appropriate age-, pregnancy-, or injury-specific early-warning system and clinical judgement.'
    });
  }

  // ─── Incomplete observation set (LOW) ───────────────────────
  const missing = [];
  if (data.respiration.respiratoryRate === null) missing.push('respiration rate');
  if (data.oxygenSaturation.spo2 === null) missing.push('oxygen saturation');
  if (data.oxygenSupport.onOxygen === '') missing.push('air or oxygen');
  if (data.bloodPressure.systolicBloodPressure === null) missing.push('systolic blood pressure');
  if (data.pulse.pulse === null) missing.push('pulse');
  if (data.consciousness.consciousnessAcvpu === '') missing.push('consciousness (ACVPU)');
  if (data.temperature.temperature === null) missing.push('temperature');
  if (missing.length > 0) {
    flags.push({
      id: 'F-INCOMPLETE-OBSERVATION-001',
      category: 'incomplete-observation',
      priority: 'low',
      description: `Missing observation(s): ${missing.join(', ')} — the aggregate may understate risk.`,
      suggestedAction:
        'Record the missing bedside observation(s) and re-score.'
    });
  }

  // Sort: high > medium > low.
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectFlaggedIssues };
