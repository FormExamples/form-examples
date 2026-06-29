import type { DomainGrade, PromEq5d5l, PromPromis } from './types';

/** Map a DomainGrade letter to a numeric ordinal (A=0 best, E=4 worst). */
export function gradeOrdinal(grade: DomainGrade): number {
	if (grade === '') return -1;
	return 'ABCDE'.indexOf(grade);
}

/** Return the worst (highest ordinal) DomainGrade from an array. */
export function gradeMax(grades: DomainGrade[]): DomainGrade {
	const valid = grades.filter((g): g is 'A' | 'B' | 'C' | 'D' | 'E' => g !== '');
	if (valid.length === 0) return '';
	return valid.reduce((worst, g) => (gradeOrdinal(g) > gradeOrdinal(worst) ? g : worst));
}

/** Human-readable label for a domain grade. */
export function gradeLabel(grade: DomainGrade): string {
	switch (grade) {
		case 'A':
			return 'A — Excellent outcome';
		case 'B':
			return 'B — Good outcome';
		case 'C':
			return 'C — Unchanged / Neutral outcome';
		case 'D':
			return 'D — Poor outcome';
		case 'E':
			return 'E — Very poor outcome';
		default:
			return 'Unknown / Insufficient data';
	}
}

/** Lily token colour class for a domain grade. */
export function gradeColor(grade: DomainGrade): string {
	switch (grade) {
		case 'A':
			return 'bg-success text-success-content border-success';
		case 'B':
			return 'bg-success text-success-content border-success';
		case 'C':
			return 'bg-warning text-warning-content border-warning';
		case 'D':
			return 'bg-warning text-warning-content border-warning';
		case 'E':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/**
 * Compute the net change in a single EQ-5D-5L dimension.
 * Negative = improvement (lower level = better); positive = worsening.
 * Returns null if either value is missing.
 */
export function eq5dDimensionChange(before: number | null, after: number | null): number | null {
	if (before === null || after === null) return null;
	return after - before;
}

/**
 * Count how many EQ-5D-5L dimensions improved (after < before),
 * worsened (after > before), and stayed the same.
 */
export function eq5dSummary(prom: PromEq5d5l): {
	improved: number;
	worsened: number;
	unchanged: number;
	missing: number;
} {
	const dims: Array<[number | null, number | null]> = [
		[prom.beforeMobility, prom.afterMobility],
		[prom.beforeSelfCare, prom.afterSelfCare],
		[prom.beforeUsualActivities, prom.afterUsualActivities],
		[prom.beforePainDiscomfort, prom.afterPainDiscomfort],
		[prom.beforeAnxietyDepression, prom.afterAnxietyDepression]
	];

	let improved = 0;
	let worsened = 0;
	let unchanged = 0;
	let missing = 0;

	for (const [before, after] of dims) {
		const delta = eq5dDimensionChange(before, after);
		if (delta === null) {
			missing++;
		} else if (delta < 0) {
			improved++;
		} else if (delta > 0) {
			worsened++;
		} else {
			unchanged++;
		}
	}

	// VAS
	const vasChange = eq5dDimensionChange(prom.beforeVas, prom.afterVas);
	if (vasChange === null) {
		missing++;
	} else if (vasChange > 0) {
		// Higher VAS = better health
		improved++;
	} else if (vasChange < 0) {
		worsened++;
	} else {
		unchanged++;
	}

	return { improved, worsened, unchanged, missing };
}

/**
 * Simple linear approximation of PROMIS Global Physical Health T-score.
 *
 * IMPORTANT: This is a documented approximation only. The official scoring
 * method uses item-response-theory calibration tables from the PROMIS Health
 * Organisation and PROMIS Cooperative Group. Production systems must use the
 * official scoring software or tables available from healthmeasures.net.
 *
 * Approximation:
 * GPH domain uses items 3 (Physical Health), 6 (Fatigue), 9 (Pain), 10 (Physical Activities).
 * Items 3, 6, 10 are on a 1–5 scale; item 9 is on a 0–10 scale (recoded: 10 − raw / 2).
 * Raw sum (max ~20) is linearly mapped to a T-score range of 16.2–67.7 (published extremes).
 */
export function promisGphTScore(p: PromPromis): number | null {
	const { item3PhysicalHealth, item6FatigueFrequency, item9Pain, item10EverydayActivities } = p;
	if (
		item3PhysicalHealth == null ||
		item6FatigueFrequency == null ||
		item9Pain == null ||
		item10EverydayActivities == null
	) {
		return null;
	}
	// Recode item9 (0=worst, 10=best) to a 1–5 equivalent: (10 - raw) / 2 + 1
	const item9Recoded = (10 - item9Pain) / 2 + 1;
	// item6 is fatigue frequency: higher = worse; invert: 6 - raw
	const item6Inverted = 6 - item6FatigueFrequency;
	const rawSum = item3PhysicalHealth + item6Inverted + item9Recoded + item10EverydayActivities;
	// rawSum range: ~4 (all worst) to ~20 (all best)
	const tScore = 16.2 + ((rawSum - 4) / (20 - 4)) * (67.7 - 16.2);
	return Math.round(tScore * 10) / 10;
}

/**
 * Simple linear approximation of PROMIS Global Mental Health T-score.
 *
 * IMPORTANT: Same approximation caveat as GPH above.
 *
 * GMH domain uses items 1 (General Health), 2 (Quality of Life), 4 (Mental Health),
 * 5 (Satisfaction), 7 (Emotional Problems), 8 (Social Activities).
 * Items 7 is inverse (higher = worse).
 * Raw sum (max ~30) mapped to T-score range of 21.2–67.6 (published extremes).
 */
export function promisMhTScore(p: PromPromis): number | null {
	const {
		item1GeneralHealth,
		item2QualityOfLife,
		item4MentalHealth,
		item5Satisfaction,
		item7EmotionalProblems,
		item8SocialActivities
	} = p;
	if (
		item1GeneralHealth == null ||
		item2QualityOfLife == null ||
		item4MentalHealth == null ||
		item5Satisfaction == null ||
		item7EmotionalProblems == null ||
		item8SocialActivities == null
	) {
		return null;
	}
	// item7: higher raw = more emotional problems = worse; invert
	const item7Inverted = 6 - item7EmotionalProblems;
	const rawSum =
		item1GeneralHealth +
		item2QualityOfLife +
		item4MentalHealth +
		item5Satisfaction +
		item7Inverted +
		item8SocialActivities;
	// rawSum range: ~6 (all worst) to ~30 (all best)
	const tScore = 21.2 + ((rawSum - 6) / (30 - 6)) * (67.6 - 21.2);
	return Math.round(tScore * 10) / 10;
}

/** Calculate age in years from a date-of-birth ISO string. Returns null if invalid. */
export function calculateAge(dob: string): number | null {
	if (!dob) return null;
	const birth = new Date(dob);
	if (isNaN(birth.getTime())) return null;
	const today = new Date();
	let age = today.getFullYear() - birth.getFullYear();
	const m = today.getMonth() - birth.getMonth();
	if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
		age--;
	}
	return age;
}

/** Calculate wait-time days between two ISO date strings. Returns null if invalid. */
export function calcWaitDays(referralDate: string, appointmentDate: string): number | null {
	if (!referralDate || !appointmentDate) return null;
	const ref = new Date(referralDate);
	const appt = new Date(appointmentDate);
	if (isNaN(ref.getTime()) || isNaN(appt.getTime())) return null;
	const diffMs = appt.getTime() - ref.getTime();
	return Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));
}
