import type { AssessmentData, DomainGrade, FiredRule } from './types';
import { eq5dSummary, promisGphTScore, promisMhTScore } from './utils';

/**
 * Grade an individual instrument from its change direction.
 *
 * Returns:
 *   'improved' | 'worsened' | 'stable' | 'missing'
 */
type InstrumentResult = 'improved' | 'worsened' | 'stable' | 'missing';

/** Grade the EQ-5D-5L instrument (dimensions + VAS combined). */
function gradeEq5d(data: AssessmentData): InstrumentResult {
	const prom = data.promEq5d5l;
	const { improved, worsened, missing } = eq5dSummary(prom);
	const total = 6; // 5 dimensions + VAS
	if (missing === total) return 'missing';
	if (worsened > improved) return 'worsened';
	if (improved > worsened && improved > 0) return 'improved';
	return 'stable';
}

/** Grade the GRC instrument. */
function gradeGrc(data: AssessmentData): InstrumentResult {
	const grc = data.promGrc.globalRatingOfChange;
	if (grc === null) return 'missing';
	if (grc > 0) return 'improved';
	if (grc < 0) return 'worsened';
	return 'stable';
}

/** Grade the PROMIS Global Health instrument by mapping the linear T-score
 * approximation to a tri-state outcome.
 *
 * The approximation in `utils.ts` spans roughly 16.2–67.7 with midpoint near 42
 * (item value 3 across the relevant questions). Thresholds are calibrated to
 * that midpoint rather than the population norm of 50:
 *   T ≥ 50 → improved
 *   T 35–49 → stable
 *   T < 35 → worsened
 *   null → missing
 *
 * Production deployments must use the official IRT calibration tables and
 * the population-norm thresholds (≥55/≥45/<45) instead.
 */
function gradePromis(data: AssessmentData): InstrumentResult {
	const p = data.promPromis;
	const gph = promisGphTScore(p);
	const gmh = promisMhTScore(p);
	if (gph === null && gmh === null) return 'missing';

	const scores = [gph, gmh].filter((s): s is number => s !== null);
	const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

	if (avg >= 50) return 'improved';
	if (avg >= 35) return 'stable';
	return 'worsened';
}

/**
 * Grade the PROM domain from EQ-5D-5L, GRC, and PROMIS composite.
 *
 * Rules (from spec):
 * - ≥ 2 instruments improved → A or B (A if all 3 improved, B if 2 improved)
 * - All stable (or 1 improved, rest stable) → C
 * - Any instrument worsened ≥ 1 level → D
 * - Multiple worsened → E
 * - All missing → '' (no grade)
 */
export function gradePROM(data: AssessmentData): { grade: DomainGrade; rules: FiredRule[] } {
	const results: { name: string; result: InstrumentResult }[] = [
		{ name: 'EQ-5D-5L', result: gradeEq5d(data) },
		{ name: 'GRC', result: gradeGrc(data) },
		{ name: 'PROMIS', result: gradePromis(data) }
	];

	const rules: FiredRule[] = [];
	const nonMissing = results.filter((r) => r.result !== 'missing');

	if (nonMissing.length === 0) {
		return { grade: '', rules };
	}

	const improvedCount = nonMissing.filter((r) => r.result === 'improved').length;
	const worsenedCount = nonMissing.filter((r) => r.result === 'worsened').length;

	let grade: DomainGrade;

	if (worsenedCount >= 2) {
		grade = 'E';
		rules.push({
			id: 'PROM-005',
			domain: 'PROM',
			description: 'Multiple PROM instruments worsened',
			grade: 'E'
		});
	} else if (worsenedCount === 1) {
		grade = 'D';
		const worsened = nonMissing.find((r) => r.result === 'worsened')!;
		rules.push({
			id: 'PROM-004',
			domain: 'PROM',
			description: `${worsened.name} shows worsening`,
			grade: 'D'
		});
	} else if (improvedCount >= 3) {
		grade = 'A';
		rules.push({
			id: 'PROM-001',
			domain: 'PROM',
			description: 'All three PROM instruments improved',
			grade: 'A'
		});
	} else if (improvedCount >= 2) {
		grade = 'B';
		rules.push({
			id: 'PROM-002',
			domain: 'PROM',
			description: 'Two or more PROM instruments improved',
			grade: 'B'
		});
	} else {
		grade = 'C';
		rules.push({
			id: 'PROM-003',
			domain: 'PROM',
			description: 'PROM instruments stable (no significant improvement or worsening)',
			grade: 'C'
		});
	}

	return { grade, rules };
}
