import type {
	AssessmentData,
	Category,
	FiredRule,
	GradingResult,
	SurveillanceBand
} from './types';
import { classificationRules } from './aaa-rules';
import { detectFlaggedIssues } from './flagged-issues';

/** Round a number to one decimal place (returns null unchanged). */
export function roundOne(n: number | null): number | null {
	if (n === null || n === undefined || Number.isNaN(n)) return null;
	return Math.round(n * 10) / 10;
}

/**
 * Map a diameter band to its surveillance / referral band and the recommended
 * action string.
 */
export function bandForCategory(category: Category): {
	surveillanceBand: SurveillanceBand;
	recommendedAction: string;
} {
	switch (category) {
		case 'normal':
			return {
				surveillanceBand: 'discharge',
				recommendedAction: 'No aneurysm. Discharge from screening; no further surveillance.'
			};
		case 'small':
			return {
				surveillanceBand: 'annual',
				recommendedAction: 'Small aneurysm. Annual (12-monthly) ultrasound surveillance.'
			};
		case 'medium':
			return {
				surveillanceBand: 'three-monthly',
				recommendedAction: 'Medium aneurysm. Three-monthly (quarterly) ultrasound surveillance.'
			};
		case 'large':
			return {
				surveillanceBand: 'refer-vascular',
				recommendedAction:
					'Large aneurysm. Refer to vascular surgery for assessment and consideration of elective repair.'
			};
		case 'non-visualised':
		default:
			return {
				surveillanceBand: 'rescan',
				recommendedAction: 'Aorta not adequately measured — arrange a re-scan.'
			};
	}
}

/** Compute the growth since the prior scan, when both diameters are present. */
export function calculateGrowth(data: AssessmentData): number | null {
	const cur = data.measurement.maxAorticDiameterCm;
	const prior = data.measurement.priorMaxDiameterCm;
	if (cur === null || cur === undefined) return null;
	if (prior === null || prior === undefined) return null;
	return roundOne(cur - prior);
}

/**
 * Pure function: compute the full AAA classification for the supplied
 * assessment data.
 *
 * Classification algorithm (spec §4). Classification is driven solely by the
 * maximum antero-posterior aortic diameter, with a guard for non-visualisation:
 *
 *   if aortaVisualised == 'no' || maxAorticDiameterCm == null:
 *        category = 'non-visualised', band = 'rescan'
 *   else if maxAorticDiameterCm <  3.0:  category='normal', band='discharge'
 *   else if maxAorticDiameterCm <  4.5:  category='small',  band='annual'
 *   else if maxAorticDiameterCm <  5.5:  category='medium', band='three-monthly'
 *   else:                                category='large',  band='refer-vascular'
 *
 * The value is not rounded before classification; it is rounded to one decimal
 * place for display only.
 */
export function classifyAaa(data: AssessmentData): GradingResult {
	const diameter = data.measurement.maxAorticDiameterCm;
	const visualised = data.measurement.aortaVisualised;

	const firedRules: FiredRule[] = [];

	// ─── Non-visualised guard ───────────────────────────────────
	// An aorta that cannot be adequately measured is never classified as normal.
	if (visualised === 'no' || diameter === null || diameter === undefined) {
		const { surveillanceBand, recommendedAction } = bandForCategory('non-visualised');
		firedRules.push({
			id: 'R-NON-VISUALISED-01',
			instrument: 'classification',
			band: 'non-visualised',
			category: 'guard',
			description:
				'Aorta not adequately visualised or diameter not recorded — result is non-visualised; arrange a re-scan.'
		});
		return {
			category: 'non-visualised',
			surveillanceBand,
			recommendedAction,
			maxAorticDiameterCm: null,
			growthCm: calculateGrowth(data),
			firedRules,
			flaggedIssues: detectFlaggedIssues(data, {
				category: 'non-visualised',
				growthCm: calculateGrowth(data)
			}),
			timestamp: new Date().toISOString()
		};
	}

	// ─── Diameter classification ────────────────────────────────
	let category: Category = 'normal';
	for (const rule of classificationRules) {
		try {
			if (rule.evaluate(diameter)) {
				category = rule.band as Category;
				firedRules.push({
					id: rule.id,
					instrument: rule.instrument,
					band: rule.band,
					category: rule.category,
					description: rule.description
				});
				break;
			}
		} catch (e) {
			console.warn(`AAA rule ${rule.id} evaluation failed:`, e);
		}
	}

	const { surveillanceBand, recommendedAction } = bandForCategory(category);
	const growthCm = calculateGrowth(data);

	return {
		category,
		surveillanceBand,
		recommendedAction,
		maxAorticDiameterCm: roundOne(diameter),
		growthCm,
		firedRules,
		flaggedIssues: detectFlaggedIssues(data, { category, growthCm }),
		timestamp: new Date().toISOString()
	};
}
