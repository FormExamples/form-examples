import type { AssessmentData, Band, FiredItem, GradingResult, InstrumentForm } from './types';
import {
	activeItemNumbers,
	maxScoreFor,
	normalizeInstrumentForm,
	ratingValue,
	zaritItems
} from './zarit-rules';
import { detectFlaggedIssues } from './flagged-issues';

/**
 * Derive the burden band from a total for the given instrument form.
 *
 * ZBI-22 (total 0..88):
 *   0..21  -> 'little-or-none'
 *   22..40 -> 'mild-to-moderate'
 *   41..60 -> 'moderate-to-severe'
 *   61..88 -> 'severe'
 * ZBI-12 (total 0..48):
 *   0..16  -> 'lower'   (below the high-burden cut-off)
 *   17..48 -> 'high'    (>= 17)
 */
export function burdenBandFor(totalScore: number, instrumentForm: InstrumentForm): Band {
	if (instrumentForm === 'zbi12') {
		return totalScore >= 17 ? 'high' : 'lower';
	}
	if (totalScore >= 61) return 'severe';
	if (totalScore >= 41) return 'moderate-to-severe';
	if (totalScore >= 22) return 'mild-to-moderate';
	return 'little-or-none';
}

/**
 * Pure function: compute the full ZBI grade for the supplied assessment data.
 *
 * Algorithm (spec §4):
 *   activeItems = instrumentForm == 'zbi12' ? SHORT_FORM_ITEMS : ALL_22_ITEMS
 *   totalScore  = sum(item[i] for i in activeItems where item[i] != null)  // missing -> 0
 *   maxScore    = instrumentForm == 'zbi12' ? 48 : 88
 *
 * A missing item rating contributes 0 to the total (absent, not zero-burden)
 * and `flagged-issues.ts` raises a data-completeness flag separately, so the
 * total can understate burden. The band is derived from the total only; flagged
 * issues are computed independently and may fire on individual items.
 */
export function calculateZaritGrade(data: AssessmentData): GradingResult {
	const instrumentForm = normalizeInstrumentForm(data);
	const active = new Set(activeItemNumbers(instrumentForm));
	const maxScore = maxScoreFor(instrumentForm);

	// Raw rating per item (0..4 or null), indexed 0..21 (item number - 1).
	const itemRatings = zaritItems.map((item) => ratingValue(data.items[item.field]));

	// Total: sum answered ratings over the active item set; missing contributes 0.
	let totalScore = 0;
	zaritItems.forEach((item, i) => {
		if (!active.has(item.number)) return;
		const r = itemRatings[i];
		if (r !== null) totalScore += r;
	});

	const burdenBand = burdenBandFor(totalScore, instrumentForm);

	const firedItems: FiredItem[] = [];

	// One audit row per answered active item with a rating >= 1 (spec §6).
	zaritItems.forEach((item, i) => {
		if (!active.has(item.number)) return;
		const r = itemRatings[i];
		if (r !== null && r >= 1) {
			firedItems.push({
				id: `R-ITEM-${item.number}-SCORE`,
				parameter: 'item',
				points: r,
				category: 'item-score',
				description:
					`Item ${item.number} (${item.statement}) rated ${r} of 4` +
					(item.global ? ' (global burden item)' : '')
			});
		}
	});

	// Total audit row.
	firedItems.push({
		id: 'R-TOTAL-SCORE',
		parameter: 'total',
		points: totalScore,
		category: 'total-score',
		description:
			`Summed ${instrumentForm === 'zbi12' ? 'ZBI-12' : 'ZBI-22'} total ` +
			`${totalScore} of ${maxScore}`
	});

	// Band audit row.
	firedItems.push({
		id: 'R-BAND',
		parameter: 'band',
		points: 0,
		category: 'band-threshold',
		description: `Burden band derived from total: ${burdenBand}`
	});

	const flaggedIssues = detectFlaggedIssues(data, { totalScore, instrumentForm });

	return {
		itemRatings,
		totalScore,
		maxScore,
		burdenBand,
		firedItems,
		flaggedIssues,
		timestamp: new Date().toISOString()
	};
}
