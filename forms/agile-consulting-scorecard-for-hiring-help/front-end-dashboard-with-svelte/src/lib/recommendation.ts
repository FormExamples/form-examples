import type { Band } from './types';

/**
 * Map a readiness band to the canonical recommendation slug, in lockstep
 * with the engine's `bandToRecommendation` in
 * `front-end-form-with-svelte/src/lib/engine/utils.ts` and
 * `full-stack-with-loco-tera-htmx-alpine/src/scoring/utils.rs`.
 */
export function bandToRecommendation(band: Band): string {
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

/**
 * Human-readable English copy for each band, used in the report views.
 */
export const RECOMMENDATION_COPY: Record<Band, string> = {
	low: "Don't hire agile help yet — focus on internal operations first.",
	borderline: 'Borderline — do your agile homework first; revisit in ~3 months.',
	medium: 'Do your agile homework first; revisit the scorecard in ~3 months.',
	high: 'Likely ready — trial an engagement and review in ~3 months.',
};
