// AUDIT-C (Alcohol Use Disorders Identification Test — Consumption), Bush et
// al. 1998. Ports front-end-with-svelte/src/lib/engine/audit-c-rules.ts line
// for line. Identical structure and scoring to
// forms/alcohol-use-disorders-identification-test-consumption/ and the
// alcohol domain in forms/perioperative-optimization/.

function num(v) {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/**
 * AUDIT-C total score, 0 to 12, being the sum of the three items. `null` when
 * all three are unanswered.
 */
function computeAuditCScore(data) {
  const s = data.smokingAlcohol;
  const parts = [num(s.auditCFrequency), num(s.auditCTypicalQuantity), num(s.auditCBingeFrequency)];
  if (parts.every((p) => p === null)) return null;
  return parts.reduce((sum, p) => sum + (p ?? 0), 0);
}

/**
 * AUDIT-C band. At-risk threshold is sex-adjusted: score >= 5 for men,
 * score >= 4 for women. Higher-risk threshold is score >= 8 for either sex.
 * When sex is unrecorded, the higher (women's) at-risk threshold of 4 is used
 * so the band never under-calls risk.
 */
function computeAuditCBand(data) {
  const score = computeAuditCScore(data);
  if (score === null) return '';
  if (score >= 8) return 'higher-risk';
  const sex = data.patient.sex;
  const atRiskThreshold = sex === 'male' ? 5 : 4;
  if (score >= atRiskThreshold) return 'increasing-risk';
  return 'low';
}

/** Fired-rule audit trail for AUDIT-C. */
function evaluateAuditC(data) {
  const score = computeAuditCScore(data);
  const band = computeAuditCBand(data);
  if (score === null || !band) return [];
  return [
    {
      ruleId: 'R-AUDITC-SCORE',
      instrument: 'audit-c',
      component: 'AUDIT-C total',
      score,
      band,
      category: 'audit-c-band',
      description: `AUDIT-C score ${score} of 12 is banded ${band}.`
    }
  ];
}

export { computeAuditCScore, computeAuditCBand, evaluateAuditC };
