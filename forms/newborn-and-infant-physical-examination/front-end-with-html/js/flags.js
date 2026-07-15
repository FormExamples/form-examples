import { LOW_SAT } from './rules.js';

// Referral-flag detection. Independent of the outcome roll-up (which the grader
// produces), this module raises practitioner-facing safety flags per spec §5,
// each pointing at the appropriate onward-referral pathway:
//
//   - Absent red reflex (high)                 — urgent ophthalmology within 2 weeks
//   - Absent or weak femoral pulses (high)     — urgent cardiac review (coarctation)
//   - Central cyanosis / low saturations (high)— urgent same-day cardiac review
//   - Heart murmur (medium)                    — cardiac assessment per local pathway
//   - Bilateral undescended testes (high)      — same-day senior / endocrine review
//   - Hip instability (high)                   — hip ultrasound within 2 weeks
//   - Hip risk factor (medium)                 — hip ultrasound by 6 weeks
//   - Component not examined (low)             — complete the screen
//
// Rows here mirror the
// `newborn_and_infant_physical_examination_grade_flag` SQL table
// (flag_id, category, priority, description, suggested_action).

/**
 * @typedef {import('./types.js').ExaminationData} ExaminationData
 * @typedef {import('./types.js').GradingResult} GradingResult
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

/**
 * @param {ExaminationData} data
 * @param {{ eyesResult: string, heartResult: string, hipsResult: string,
 *           testesResult: string }} grade  - per-component results from the grader
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(data, grade) {
  /** @type {FlaggedIssue[]} */
  const flags = [];
  const d = data;

  const preSat = d.heart.oxygenSaturationPreductal;
  const postSat = d.heart.oxygenSaturationPostductal;

  // ─── Absent red reflex (HIGH) ───────────────────────────────
  if (
    d.eyes.eyesRedReflexRight === 'absent' ||
    d.eyes.eyesRedReflexLeft === 'absent' ||
    d.eyes.eyesAppearance === 'abnormal'
  ) {
    flags.push({
      id: 'F-ABSENT-RED-REFLEX-001',
      category: 'urgent-ophthalmology',
      priority: 'high',
      description:
        'Absent or abnormal red reflex, or abnormal eye appearance — suspected congenital cataract',
      suggestedAction:
        'Refer for urgent ophthalmology assessment to be seen within 2 weeks.'
    });
  }

  // ─── Absent or weak femoral pulses (HIGH) ───────────────────
  const weakAbsent = (v) => v === 'weak' || v === 'absent';
  if (weakAbsent(d.heart.femoralPulsesRight) || weakAbsent(d.heart.femoralPulsesLeft)) {
    flags.push({
      id: 'F-FEMORAL-PULSES-001',
      category: 'cardiac-referral',
      priority: 'high',
      description:
        'Weak or absent femoral pulse(s) — possible coarctation of the aorta',
      suggestedAction:
        'Arrange urgent cardiac / neonatal review with pre- and post-ductal saturations.'
    });
  }

  // ─── Central cyanosis / low or discordant saturations (HIGH) ─
  const satLow =
    (preSat !== null && preSat < LOW_SAT) ||
    (postSat !== null && postSat < LOW_SAT);
  const satDiscordant =
    preSat !== null && postSat !== null && Math.abs(preSat - postSat) > 3;
  if (d.heart.centralCyanosis === 'present' || satLow || satDiscordant) {
    const detail = [];
    if (d.heart.centralCyanosis === 'present') detail.push('central cyanosis');
    if (satLow) detail.push(`saturation below ${LOW_SAT}%`);
    if (satDiscordant) detail.push('pre-/post-ductal difference above 3%');
    flags.push({
      id: 'F-CYANOSIS-LOW-SATS-001',
      category: 'cardiac-referral',
      priority: 'high',
      description:
        `Possible critical congenital heart disease (${detail.join(', ')})`,
      suggestedAction:
        'Arrange urgent same-day cardiac / neonatal review and pulse-oximetry screening.'
    });
  }

  // ─── Heart murmur (MEDIUM) ──────────────────────────────────
  if (d.heart.heartMurmur === 'present') {
    flags.push({
      id: 'F-HEART-MURMUR-001',
      category: 'cardiac-referral',
      priority: 'medium',
      description: 'Heart murmur detected on auscultation',
      suggestedAction:
        'Arrange cardiac assessment per local pathway.'
    });
  }

  // ─── Bilateral undescended testes (HIGH) ────────────────────
  if (d.identification.sex === 'male') {
    const undescended = (v) => v === 'undescended' || v === 'not-palpable';
    if (undescended(d.testes.testisRight) && undescended(d.testes.testisLeft)) {
      flags.push({
        id: 'F-BILATERAL-UNDESCENDED-TESTES-001',
        category: 'undescended-testes-review',
        priority: 'high',
        description:
          'Bilateral undescended or non-palpable testes — possible disorder of sex development',
        suggestedAction:
          'Arrange same-day senior / endocrine review.'
      });
    }
  }

  // ─── Hip instability (HIGH) ─────────────────────────────────
  if (
    d.hips.barlowTest === 'positive' ||
    d.hips.ortolaniTest === 'positive' ||
    d.hips.hipAbduction === 'limited'
  ) {
    flags.push({
      id: 'F-HIP-INSTABILITY-001',
      category: 'hip-ultrasound',
      priority: 'high',
      description:
        'Positive Barlow/Ortolani or limited hip abduction — suspected developmental dysplasia of the hip',
      suggestedAction:
        'Arrange hip ultrasound to be performed within 2 weeks.'
    });
  }

  // ─── Hip risk factor (MEDIUM) ───────────────────────────────
  if (
    d.riskFactors.breechPresentation === 'yes' ||
    d.riskFactors.familyHistoryHipProblems === 'yes'
  ) {
    const which = [];
    if (d.riskFactors.breechPresentation === 'yes') which.push('breech presentation');
    if (d.riskFactors.familyHistoryHipProblems === 'yes') {
      which.push('first-degree family history of hip problems');
    }
    flags.push({
      id: 'F-HIP-RISK-FACTOR-001',
      category: 'hip-ultrasound',
      priority: 'medium',
      description: `Hip risk factor present (${which.join(', ')})`,
      suggestedAction:
        'Arrange hip ultrasound by 6 weeks of age.'
    });
  }

  // ─── Component not examined (LOW) ───────────────────────────
  const notExamined = [];
  if (grade.eyesResult === 'not-examined') notExamined.push('eyes');
  if (grade.heartResult === 'not-examined') notExamined.push('heart');
  if (grade.hipsResult === 'not-examined') notExamined.push('hips');
  if (grade.testesResult === 'not-examined') notExamined.push('testes');
  if (notExamined.length > 0) {
    flags.push({
      id: 'F-COMPONENT-NOT-EXAMINED-001',
      category: 'component-not-examined',
      priority: 'low',
      description:
        `Applicable key component(s) not examined: ${notExamined.join(', ')} — the screen is incomplete`,
      suggestedAction:
        'Complete or re-attempt the outstanding key component(s) to finish the screen.'
    });
  }

  // Sort: high > medium > low.
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectFlaggedIssues };
