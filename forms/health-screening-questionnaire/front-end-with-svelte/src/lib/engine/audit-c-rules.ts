// AUDIT-C (Alcohol Use Disorders Identification Test — Consumption), Bush et
// al. 1998. Identical structure and scoring to
// forms/alcohol-use-disorders-identification-test-consumption/ and the
// alcohol domain in forms/perioperative-optimization/.

import type { AuditCBand, FiredRule, HealthScreeningQuestionnaire } from './types';
import { num, rule } from './utils';

/**
 * AUDIT-C total score, 0 to 12, being the sum of the three items. `null` when
 * all three are unanswered.
 */
export function computeAuditCScore(data: HealthScreeningQuestionnaire): number | null {
	const s = data.smokingAlcohol;
	const parts = [num(s.auditCFrequency), num(s.auditCTypicalQuantity), num(s.auditCBingeFrequency)];
	if (parts.every((p) => p === null)) return null;
	return parts.reduce<number>((sum, p) => sum + (p ?? 0), 0);
}

/**
 * AUDIT-C band. At-risk threshold is sex-adjusted: score >= 5 for men,
 * score >= 4 for women. Higher-risk threshold is score >= 8 for either sex.
 * When sex is unrecorded, the higher (women's) at-risk threshold of 4 is used
 * so the band never under-calls risk.
 */
export function computeAuditCBand(data: HealthScreeningQuestionnaire): AuditCBand {
	const score = computeAuditCScore(data);
	if (score === null) return '';
	if (score >= 8) return 'higher-risk';
	const sex = data.patient.sex;
	const atRiskThreshold = sex === 'male' ? 5 : 4;
	if (score >= atRiskThreshold) return 'increasing-risk';
	return 'low';
}

/** Fired-rule audit trail for AUDIT-C. */
export function evaluateAuditC(data: HealthScreeningQuestionnaire): FiredRule[] {
	const score = computeAuditCScore(data);
	const band = computeAuditCBand(data);
	if (score === null || !band) return [];
	return [
		rule(
			'R-AUDITC-SCORE',
			'audit-c',
			'AUDIT-C total',
			score,
			band,
			'audit-c-band',
			`AUDIT-C score ${score} of 12 is banded ${band}.`
		)
	];
}
