// SF-36v2 domain scoring — RAND 36-Item Health Survey 1.0 method
// (public domain). See ../../../spec/index.md §1 for the full
// specification, including what pcsApprox/mcsApprox are NOT: the
// licensed QualityMetric norm-based SF-36v2 PCS/MCS.
//
// Direct TypeScript port of
// ../../../front-end-with-html/js/sf36-rules.js — byte-for-byte
// equivalent logic. Do not re-derive; keep in lock-step with that file.
//
// Every item is recoded to 0-100 (0 = worst, 100 = best) via a linear
// transform using the item's own scale and polarity, then the 8
// domains are the unweighted mean of their recoded items.

import type { Sf36Response, Sf36Result } from './types';

interface ItemDef {
	field: keyof Sf36Response;
	min: number;
	max: number;
	direction: 'lowIsBest' | 'highIsBest';
}

const PF_ITEMS: ItemDef[] = [
	{ field: 'vigorousActivities', min: 1, max: 3, direction: 'highIsBest' },
	{ field: 'moderateActivities', min: 1, max: 3, direction: 'highIsBest' },
	{ field: 'liftingCarryingGroceries', min: 1, max: 3, direction: 'highIsBest' },
	{ field: 'climbingSeveralFlights', min: 1, max: 3, direction: 'highIsBest' },
	{ field: 'climbingOneFlight', min: 1, max: 3, direction: 'highIsBest' },
	{ field: 'bendingKneelingStooping', min: 1, max: 3, direction: 'highIsBest' },
	{ field: 'walkingMoreThanMile', min: 1, max: 3, direction: 'highIsBest' },
	{ field: 'walkingSeveralHundredYards', min: 1, max: 3, direction: 'highIsBest' },
	{ field: 'walkingOneHundredYards', min: 1, max: 3, direction: 'highIsBest' },
	{ field: 'bathingDressing', min: 1, max: 3, direction: 'highIsBest' }
];

const RP_ITEMS: ItemDef[] = [
	{ field: 'cutDownTimePhysical', min: 1, max: 5, direction: 'highIsBest' },
	{ field: 'accomplishedLessPhysical', min: 1, max: 5, direction: 'highIsBest' },
	{ field: 'limitedInKindPhysical', min: 1, max: 5, direction: 'highIsBest' },
	{ field: 'difficultyPerformingPhysical', min: 1, max: 5, direction: 'highIsBest' }
];

const BP_ITEMS: ItemDef[] = [
	{ field: 'bodilyPain', min: 1, max: 6, direction: 'lowIsBest' },
	{ field: 'painInterferenceWithWork', min: 1, max: 5, direction: 'lowIsBest' }
];

const GH_ITEMS: ItemDef[] = [
	{ field: 'generalHealth', min: 1, max: 5, direction: 'lowIsBest' },
	{ field: 'getSickEasier', min: 1, max: 5, direction: 'highIsBest' },
	{ field: 'asHealthyAsAnybody', min: 1, max: 5, direction: 'lowIsBest' },
	{ field: 'expectHealthWorse', min: 1, max: 5, direction: 'highIsBest' },
	{ field: 'healthExcellent', min: 1, max: 5, direction: 'lowIsBest' }
];

const VT_ITEMS: ItemDef[] = [
	{ field: 'feltFullOfLife', min: 1, max: 5, direction: 'lowIsBest' },
	{ field: 'lotOfEnergy', min: 1, max: 5, direction: 'lowIsBest' },
	{ field: 'feltWornOut', min: 1, max: 5, direction: 'highIsBest' },
	{ field: 'feltTired', min: 1, max: 5, direction: 'highIsBest' }
];

const SF_ITEMS: ItemDef[] = [
	{ field: 'socialActivitiesInterference', min: 1, max: 5, direction: 'lowIsBest' },
	{ field: 'socialActivitiesInterferenceTime', min: 1, max: 5, direction: 'highIsBest' }
];

const RE_ITEMS: ItemDef[] = [
	{ field: 'cutDownTimeEmotional', min: 1, max: 5, direction: 'highIsBest' },
	{ field: 'accomplishedLessEmotional', min: 1, max: 5, direction: 'highIsBest' },
	{ field: 'lessCarefulThanUsual', min: 1, max: 5, direction: 'highIsBest' }
];

const MH_ITEMS: ItemDef[] = [
	{ field: 'veryNervous', min: 1, max: 5, direction: 'highIsBest' },
	{ field: 'soDownInDumps', min: 1, max: 5, direction: 'highIsBest' },
	{ field: 'feltCalmPeaceful', min: 1, max: 5, direction: 'lowIsBest' },
	{ field: 'downheartedDepressed', min: 1, max: 5, direction: 'highIsBest' },
	{ field: 'beenHappy', min: 1, max: 5, direction: 'lowIsBest' }
];

/** Recode one raw item value to 0-100 (0 = worst, 100 = best). */
function recodeItem(raw: number | null, def: ItemDef): number | null {
	if (raw === null || raw === undefined) return null;
	const { min, max, direction } = def;
	const frac = direction === 'lowIsBest' ? (max - raw) / (max - min) : (raw - min) / (max - min);
	return frac * 100;
}

/** Average the recoded scores for a set of items; null if none answered. */
function domainScore(data: Sf36Response, items: ItemDef[]): number | null {
	const recoded = items
		.map((def) => recodeItem(data[def.field] as number | null, def))
		.filter((v): v is number => v !== null);
	if (recoded.length === 0) return null;
	const sum = recoded.reduce((a, b) => a + b, 0);
	return sum / recoded.length;
}

function meanOrNull(values: Array<number | null>): number | null {
	const present = values.filter((v): v is number => v !== null && v !== undefined);
	if (present.length === 0) return null;
	return present.reduce((a, b) => a + b, 0) / present.length;
}

/**
 * Compute the 8 SF-36 domain scores plus simplified (non-licensed)
 * summary approximations.
 */
export function computeSf36(data: Sf36Response): Sf36Result {
	const pf = domainScore(data, PF_ITEMS);
	const rp = domainScore(data, RP_ITEMS);
	const bp = domainScore(data, BP_ITEMS);
	const gh = domainScore(data, GH_ITEMS);
	const vt = domainScore(data, VT_ITEMS);
	const sf = domainScore(data, SF_ITEMS);
	const re = domainScore(data, RE_ITEMS);
	const mh = domainScore(data, MH_ITEMS);

	return {
		pf,
		rp,
		bp,
		gh,
		vt,
		sf,
		re,
		mh,
		pcsApprox: meanOrNull([pf, rp, bp, gh]),
		mcsApprox: meanOrNull([vt, sf, re, mh])
	};
}
