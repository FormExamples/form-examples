import type { Answer, Band, ItemAnswerGrade, Recommendation } from './types';

// Map a yes/no/unanswered answer to its 0/1 score contribution.
export function answerToPoints(answer: Answer): 0 | 1 {
	return answer === true ? 1 : 0;
}

export function answerToGrade(answer: Answer): ItemAnswerGrade {
	if (answer === true) return 'yes';
	if (answer === false) return 'no';
	return 'unanswered';
}

// Total score → readiness band, per seed.md:
//   0–4   → low
//   5     → borderline (treated as low; called out explicitly because the
//          seed leaves 5 outside its bands)
//   6–10  → medium
//   11–16 → high
export function totalToBand(total: number): Band {
	if (total <= 4) return 'low';
	if (total === 5) return 'borderline';
	if (total <= 10) return 'medium';
	return 'high';
}

export function bandToRecommendation(band: Band): Recommendation {
	switch (band) {
		case 'low':
			return 'do-not-hire-yet';
		case 'borderline':
			return 'do-homework-first';
		case 'medium':
			return 'do-homework-first';
		case 'high':
			return 'trial-engagement';
	}
}

export function clampInt(value: number | null, min: number, max: number): number | null {
	if (value === null || Number.isNaN(value)) return null;
	if (value < min) return min;
	if (value > max) return max;
	return Math.trunc(value);
}
