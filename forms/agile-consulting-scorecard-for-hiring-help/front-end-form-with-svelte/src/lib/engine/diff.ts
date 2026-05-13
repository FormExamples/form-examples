import type {
	AdditionalFlag,
	AgileConsultingScorecardAssessment,
	Answer,
	Band,
	FlagCategory,
	GradeResult,
} from './types';
import { gradeScorecard } from './score-grader';

/** One item's before/after answers. */
export interface ItemDiff {
	/** `m1`..`m4`, `p1`..`p12`. */
	itemKey: string;
	before: Answer;
	after: Answer;
	/** `'improved'` (no → yes), `'regressed'` (yes → no), `'answered'`
	 *  (unanswered → yes/no), `'cleared'` (yes/no → unanswered), or
	 *  `'unchanged'`. Sorted later by improvement first, then regressions. */
	change: 'improved' | 'regressed' | 'answered' | 'cleared' | 'unchanged';
}

/** Whole-scorecard delta produced by `diffAssessments`. */
export interface ScorecardDiff {
	scoreDelta: number;           // after.total − before.total
	manifestoDelta: number;
	principlesDelta: number;
	bandBefore: Band;
	bandAfter: Band;
	bandChanged: boolean;
	items: ItemDiff[];            // 16 entries, in scorecard order
	improved: ItemDiff[];         // items that moved from no/unanswered → yes
	regressed: ItemDiff[];        // items that moved from yes → no/unanswered
	newFlags: AdditionalFlag[];   // flags present after but not before
	clearedFlags: AdditionalFlag[]; // flags present before but not after
}

const ITEM_KEYS = [
	'm1', 'm2', 'm3', 'm4',
	'p1', 'p2', 'p3', 'p4', 'p5', 'p6',
	'p7', 'p8', 'p9', 'p10', 'p11', 'p12',
] as const;

function pickAnswer(
	a: AgileConsultingScorecardAssessment,
	key: string,
): Answer {
	const group = key.startsWith('m') ? a.manifesto : a.principles;
	return (group as unknown as Record<string, { done: Answer }>)[key].done;
}

function classify(before: Answer, after: Answer): ItemDiff['change'] {
	if (before === after) return 'unchanged';
	if (before === true && after !== true) return 'regressed';
	if (after === true && before !== true) return 'improved';
	if (before === null && after !== null) return 'answered';
	if (before !== null && after === null) return 'cleared';
	return 'unchanged';
}

function flagKey(f: AdditionalFlag): FlagCategory {
	return f.category;
}

/**
 * Compare two scorecard snapshots for the same organization. Useful for
 * the "retake the scorecard in ~3 months" loop recommended by the seed.
 *
 * The function is pure: it runs the engine on both snapshots, then
 * tabulates the differences. Callers do not need to pre-compute
 * `GradeResult`s — passing only the assessments is fine.
 */
export function diffAssessments(
	before: AgileConsultingScorecardAssessment,
	after: AgileConsultingScorecardAssessment,
): ScorecardDiff {
	const gBefore: GradeResult = gradeScorecard(before);
	const gAfter: GradeResult = gradeScorecard(after);

	const items: ItemDiff[] = ITEM_KEYS.map((key) => {
		const b = pickAnswer(before, key);
		const a = pickAnswer(after, key);
		return { itemKey: key, before: b, after: a, change: classify(b, a) };
	});

	const beforeFlagKeys = new Set(gBefore.additionalFlags.map(flagKey));
	const afterFlagKeys = new Set(gAfter.additionalFlags.map(flagKey));

	const newFlags = gAfter.additionalFlags.filter((f) => !beforeFlagKeys.has(flagKey(f)));
	const clearedFlags = gBefore.additionalFlags.filter(
		(f) => !afterFlagKeys.has(flagKey(f)),
	);

	return {
		scoreDelta: gAfter.scoreTotal - gBefore.scoreTotal,
		manifestoDelta: gAfter.manifestoSubtotal - gBefore.manifestoSubtotal,
		principlesDelta: gAfter.principlesSubtotal - gBefore.principlesSubtotal,
		bandBefore: gBefore.computedBand,
		bandAfter: gAfter.computedBand,
		bandChanged: gBefore.computedBand !== gAfter.computedBand,
		items,
		improved: items.filter((i) => i.change === 'improved'),
		regressed: items.filter((i) => i.change === 'regressed'),
		newFlags,
		clearedFlags,
	};
}
