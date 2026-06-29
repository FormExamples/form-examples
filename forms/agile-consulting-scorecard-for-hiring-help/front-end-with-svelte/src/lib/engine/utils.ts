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

// Human-readable label for a readiness band.
export function bandLabel(band: Band): string {
	switch (band) {
		case 'low':
			return 'Low readiness';
		case 'borderline':
			return 'Borderline readiness';
		case 'medium':
			return 'Medium readiness';
		case 'high':
			return 'High readiness';
	}
}

// Short label for a readiness band (dashboard cells).
export function bandShortLabel(band: Band): string {
	return band.charAt(0).toUpperCase() + band.slice(1);
}

// Lily-token utility classes (bg / text / border triple) for a readiness band.
// low → error, borderline → warning, medium → info, high → success.
export function bandColor(band: Band): string {
	switch (band) {
		case 'low':
			return 'bg-error text-error-content border-error';
		case 'borderline':
			return 'bg-warning text-warning-content border-warning';
		case 'medium':
			return 'bg-info text-info-content border-info';
		case 'high':
			return 'bg-success text-success-content border-success';
	}
}

// Human-readable copy for the readiness recommendation, keyed by band.
export function recommendationCopy(band: Band): string {
	switch (band) {
		case 'low':
			return "Don't hire agile help yet — focus on internal operations first.";
		case 'borderline':
			return 'Borderline — do your agile homework first; revisit in ~3 months.';
		case 'medium':
			return 'Do your agile homework first; revisit the scorecard in ~3 months.';
		case 'high':
			return 'Likely ready — trial an engagement and review in ~3 months.';
	}
}
