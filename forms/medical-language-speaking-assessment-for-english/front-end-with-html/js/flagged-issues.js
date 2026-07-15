// Flagged-issue detection. Independent of the OET scaled score (which the
// grader computes), this module raises examiner-facing flags that
// summarise improvement areas, clinical-safety concerns, and borderline
// outcomes.
//
// Priority bands:
//   high   - grade D or E, very low intelligibility (<=2),
//            critical clinical-communication failures in safety-critical
//            scenarios.
//   medium - single low criterion, low fluency (<=3),
//            grade C borderline.
//   low    - improvement areas (mid-range scores), examiner notes present.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').AdditionalFlag} AdditionalFlag
 * @typedef {import('./types.js').GradingResult} GradingResult
 */

/** Coerce numeric-or-null. */
function n(v) {
  if (v === null || v === undefined || v === '') return null;
  const x = Number(v);
  return Number.isFinite(x) ? x : null;
}

/**
 * Lowest non-null value across the two role-plays for a given linguistic
 * criterion. Returns null if neither role-play has been rated.
 */
function lowestLinguistic(data, field) {
  const a = n(data.linguisticRolePlay1?.[field]);
  const b = n(data.linguisticRolePlay2?.[field]);
  if (a === null && b === null) return null;
  if (a === null) return b;
  if (b === null) return a;
  return Math.min(a, b);
}

/**
 * @param {AssessmentData} data
 * @param {GradingResult} grading
 * @returns {AdditionalFlag[]}
 */
function detectAdditionalFlags(data, grading) {
  /** @type {AdditionalFlag[]} */
  const flags = [];

  const safetyCritical =
    data.rolePlay1?.safetyCriticality === 'high' ||
    data.rolePlay2?.safetyCriticality === 'high';

  // ─── Grade-band flags ──────────────────────────────────────
  if (grading.grade === 'E' || grading.grade === 'D') {
    flags.push({
      id: 'FLAG-GRADE-001',
      category: 'Overall Grade',
      message: `Grade ${grading.grade} (${grading.scaledScore}/500) — well below typical clinical registration threshold; remediation required before clinical practice.`,
      priority: 'high'
    });
  } else if (grading.grade === 'C') {
    flags.push({
      id: 'FLAG-GRADE-002',
      category: 'Overall Grade',
      message: `Grade C (${grading.scaledScore}/500) — below typical clinical registration threshold (Grade B); targeted preparation recommended.`,
      priority: 'medium'
    });
  } else if (grading.grade === 'C+') {
    flags.push({
      id: 'FLAG-GRADE-003',
      category: 'Overall Grade',
      message: `Grade C+ (${grading.scaledScore}/500) — borderline; just below the typical Grade B clinical threshold.`,
      priority: 'medium'
    });
  }

  // ─── Critical linguistic floor: intelligibility ────────────
  const intelligibilityLow = lowestLinguistic(data, 'intelligibility');
  if (intelligibilityLow !== null && intelligibilityLow <= 2) {
    flags.push({
      id: 'FLAG-LING-INT-001',
      category: 'Intelligibility',
      message: `Intelligibility rated ${intelligibilityLow}/6 in at least one role-play — patient comprehension at risk; intelligibility is a clinical-safety concern.`,
      priority: 'high'
    });
  } else if (intelligibilityLow !== null && intelligibilityLow === 3) {
    flags.push({
      id: 'FLAG-LING-INT-002',
      category: 'Intelligibility',
      message: 'Intelligibility rated 3/6 — acceptable but with regular lapses; pronunciation work recommended.',
      priority: 'medium'
    });
  }

  // ─── Fluency ────────────────────────────────────────────────
  const fluencyLow = lowestLinguistic(data, 'fluency');
  if (fluencyLow !== null && fluencyLow <= 3) {
    flags.push({
      id: 'FLAG-LING-FLU-001',
      category: 'Fluency',
      message: `Fluency rated ${fluencyLow}/6 in at least one role-play — hesitation likely to disrupt the consultation flow.`,
      priority: 'medium'
    });
  }

  // ─── Appropriateness of language ───────────────────────────
  const appLow = lowestLinguistic(data, 'appropriatenessOfLanguage');
  if (appLow !== null && appLow <= 2) {
    flags.push({
      id: 'FLAG-LING-APP-001',
      category: 'Appropriateness of Language',
      message: `Appropriateness of Language rated ${appLow}/6 — register or jargon unsuitable for patient-facing communication.`,
      priority: 'medium'
    });
  }

  // ─── Grammar & expression ──────────────────────────────────
  const grmLow = lowestLinguistic(data, 'resourcesOfGrammarAndExpression');
  if (grmLow !== null && grmLow <= 2) {
    flags.push({
      id: 'FLAG-LING-GRM-001',
      category: 'Resources of Grammar & Expression',
      message: `Grammar & Expression rated ${grmLow}/6 — limited range may compromise the precision of clinical questions.`,
      priority: 'medium'
    });
  }

  // ─── Clinical communication critical failures ─────────────
  const ci = data.clinicalIndicators || {};
  const criticalIndicators = [
    { field: 'relationshipBuilding', label: 'Relationship-building' },
    { field: 'understandingPatientPerspective', label: 'Understanding patient\u2019s perspective' },
    { field: 'providingStructure', label: 'Providing structure' },
    { field: 'informationGathering', label: 'Information-gathering' },
    { field: 'informationGiving', label: 'Information-giving' }
  ];

  for (const ind of criticalIndicators) {
    const v = n(ci[ind.field]);
    if (v === null) continue;
    if (v === 0) {
      flags.push({
        id: `FLAG-CLIN-${ind.field}-0`,
        category: 'Clinical Communication',
        message: `${ind.label} rated 0/3 — indicator not demonstrated${safetyCritical ? '; in a high-stakes scenario this is a clinical-safety failure' : ''}.`,
        priority: safetyCritical ? 'high' : 'medium'
      });
    } else if (v === 1) {
      flags.push({
        id: `FLAG-CLIN-${ind.field}-1`,
        category: 'Clinical Communication',
        message: `${ind.label} rated 1/3 — only partially demonstrated; targeted coaching recommended.`,
        priority: 'medium'
      });
    } else if (v === 2) {
      flags.push({
        id: `FLAG-CLIN-${ind.field}-2`,
        category: 'Clinical Communication',
        message: `${ind.label} rated 2/3 — satisfactory with room to improve.`,
        priority: 'low'
      });
    }
  }

  // ─── Single low linguistic criterion (otherwise strong) ────
  if (grading.grade === 'B' || grading.grade === 'A') {
    const lows = grading.perCriterionScores.filter(
      (s) => s.domain === 'linguistic' && s.meanScore !== null && s.meanScore <= 3
    );
    for (const low of lows) {
      flags.push({
        id: `FLAG-LING-LOW-${low.id}`,
        category: 'Improvement Area',
        message: `${low.label} mean ${low.meanScore}/6 — below the candidate\u2019s overall standard; isolate and rehearse this area.`,
        priority: 'medium'
      });
    }
  }

  // ─── Imbalance between role-plays ──────────────────────────
  const rpDiffs = grading.perCriterionScores.filter(
    (s) =>
      s.domain === 'linguistic' &&
      s.rolePlay1Score !== null &&
      s.rolePlay2Score !== null &&
      Math.abs(s.rolePlay1Score - s.rolePlay2Score) >= 2
  );
  for (const d of rpDiffs) {
    flags.push({
      id: `FLAG-RP-DIFF-${d.id}`,
      category: 'Role-play Variability',
      message: `${d.label}: ${d.rolePlay1Score}/6 in role-play 1 vs ${d.rolePlay2Score}/6 in role-play 2 — performance varied with the scenario type.`,
      priority: 'low'
    });
  }

  // ─── Examiner notes present ────────────────────────────────
  if ((data.rolePlay1?.examinerNotes || '').trim().length > 0) {
    flags.push({
      id: 'FLAG-NOTES-RP1',
      category: 'Examiner Notes',
      message: 'Examiner provided narrative comments on role-play 1.',
      priority: 'low'
    });
  }
  if ((data.rolePlay2?.examinerNotes || '').trim().length > 0) {
    flags.push({
      id: 'FLAG-NOTES-RP2',
      category: 'Examiner Notes',
      message: 'Examiner provided narrative comments on role-play 2.',
      priority: 'low'
    });
  }
  if ((ci.examinerNotes || '').trim().length > 0) {
    flags.push({
      id: 'FLAG-NOTES-CLIN',
      category: 'Examiner Notes',
      message: 'Examiner provided narrative comments on clinical communication.',
      priority: 'low'
    });
  }

  // Sort: high > medium > low
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectAdditionalFlags };
