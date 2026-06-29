// Clinical Welsh-language (Cymraeg) speaking assessment grader.
//
// Pure function: takes an `AssessmentData` object and returns the linguistic
// total (0-24), clinical total (0-15), raw total (0-39), scaled score
// (0-500), grade (A, B, C+, C, D, E), the per-criterion audit trail, and the
// list of fired rules. The flagged issues are attached separately by
// `detectAdditionalFlags`.
//
// Calculation:
//   linguisticTotal = sum over the 4 linguistic criteria of
//                     mean(rolePlay1Score, rolePlay2Score)        -> 0..24
//   clinicalTotal   = sum over the 5 clinical indicators           -> 0..15
//   rawTotal        = linguisticTotal + clinicalTotal              -> 0..39
//   scaledScore     = round(rawTotal / 39 * 500)                   -> 0..500
//
// Grade bands (CEFR-mapped cut-points, parallel to the OET Medicine bands):
//   450-500 -> A (CEFR C2), 350-440 -> B (CEFR C1), 300-340 -> C+ (CEFR B2+),
//   200-290 -> C (CEFR B2), 100-190 -> D (CEFR B1), 0-90 -> E (CEFR A2-).

import { criterionRegistry } from './rules';
import { detectAdditionalFlags } from './flagged-issues';
import type {
	AssessmentData,
	CriterionScore,
	FiredRule,
	GradingResult,
	LinguisticField,
	OETGrade
} from './types';

/** Map a 0-500 scaled score to a grade. */
export function classifyScaledScore(score: number): OETGrade {
	if (score >= 450) return 'A';
	if (score >= 350) return 'B';
	if (score >= 300) return 'C+';
	if (score >= 200) return 'C';
	if (score >= 100) return 'D';
	return 'E';
}

/** Coerce a value to a finite number, otherwise return null. */
function toNumOrNull(v: unknown): number | null {
	if (v === null || v === undefined || v === '') return null;
	const n = Number(v);
	return Number.isFinite(n) ? n : null;
}

/**
 * Mean of two role-play scores. Returns null only when *both* are null. If only
 * one is provided it is treated as the criterion mean (single-role-play partial
 * completion still produces a meaningful figure).
 */
function meanOrSingle(a: unknown, b: unknown): number | null {
	const x = toNumOrNull(a);
	const y = toNumOrNull(b);
	if (x === null && y === null) return null;
	if (x === null) return y;
	if (y === null) return x;
	return (x + y) / 2;
}

/** Round to 1 decimal place for display. */
function round1(n: number): number {
	return Math.round(n * 10) / 10;
}

/** Pure scoring engine (without flags). */
export function gradeOET(data: AssessmentData): Omit<GradingResult, 'additionalFlags' | 'timestamp'> {
	const perCriterionScores: CriterionScore[] = [];
	const firedRules: FiredRule[] = [];

	let linguisticTotal = 0;
	let clinicalTotal = 0;

	for (const c of criterionRegistry) {
		if (c.domain === 'linguistic') {
			const field = c.dataField as LinguisticField;
			const rp1 = toNumOrNull(data.linguisticRolePlay1?.[field]);
			const rp2 = toNumOrNull(data.linguisticRolePlay2?.[field]);
			const mean = meanOrSingle(rp1, rp2);
			perCriterionScores.push({
				id: c.id,
				domain: 'linguistic',
				label: c.label,
				maxScore: c.maxScore,
				rolePlay1Score: rp1,
				rolePlay2Score: rp2,
				meanScore: mean === null ? null : round1(mean)
			});
			if (mean !== null) {
				linguisticTotal += mean;
				firedRules.push({ id: c.id, category: 'Linguistic', description: c.label, score: round1(mean) });
			}
		} else {
			const v = toNumOrNull(
				(data.clinicalIndicators as unknown as Record<string, unknown>)?.[c.dataField]
			);
			perCriterionScores.push({
				id: c.id,
				domain: 'clinical',
				label: c.label,
				maxScore: c.maxScore,
				rolePlay1Score: null,
				rolePlay2Score: null,
				meanScore: v
			});
			if (v !== null) {
				clinicalTotal += v;
				firedRules.push({
					id: c.id,
					category: 'Clinical Communication',
					description: c.label,
					score: v
				});
			}
		}
	}

	const rawTotal = linguisticTotal + clinicalTotal;
	const scaledScore = Math.round((rawTotal / 39) * 500);
	const grade = classifyScaledScore(scaledScore);

	return {
		linguisticTotal: round1(linguisticTotal),
		clinicalTotal: round1(clinicalTotal),
		rawTotal: round1(rawTotal),
		scaledScore,
		grade,
		perCriterionScores,
		firedRules
	};
}

/** Full grading result including flags and a timestamp. */
export function gradeAssessment(data: AssessmentData): GradingResult {
	const core = gradeOET(data);
	return {
		...core,
		additionalFlags: detectAdditionalFlags(data, core),
		timestamp: new Date().toISOString()
	};
}
