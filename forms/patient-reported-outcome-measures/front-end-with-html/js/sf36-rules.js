// SF-36v2 domain scoring — RAND 36-Item Health Survey 1.0 method
// (public domain). See ../spec/index.md §1 for the full specification,
// including which pcsApprox/mcsApprox are NOT: the licensed
// QualityMetric norm-based SF-36v2 PCS/MCS.
//
// Every item is recoded to 0-100 (0 = worst, 100 = best) via a linear
// transform using the item's own scale and polarity, then the 8
// domains are the unweighted mean of their recoded items.

/**
 * @typedef {{ field: string, min: number, max: number, direction: 'lowIsBest' | 'highIsBest' }} ItemDef
 */

/** @type {ItemDef[]} */
const PF_ITEMS = [
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

/** @type {ItemDef[]} */
const RP_ITEMS = [
  { field: 'cutDownTimePhysical', min: 1, max: 5, direction: 'highIsBest' },
  { field: 'accomplishedLessPhysical', min: 1, max: 5, direction: 'highIsBest' },
  { field: 'limitedInKindPhysical', min: 1, max: 5, direction: 'highIsBest' },
  { field: 'difficultyPerformingPhysical', min: 1, max: 5, direction: 'highIsBest' }
];

/** @type {ItemDef[]} */
const BP_ITEMS = [
  { field: 'bodilyPain', min: 1, max: 6, direction: 'lowIsBest' },
  { field: 'painInterferenceWithWork', min: 1, max: 5, direction: 'lowIsBest' }
];

/** @type {ItemDef[]} */
const GH_ITEMS = [
  { field: 'generalHealth', min: 1, max: 5, direction: 'lowIsBest' },
  { field: 'getSickEasier', min: 1, max: 5, direction: 'highIsBest' },
  { field: 'asHealthyAsAnybody', min: 1, max: 5, direction: 'lowIsBest' },
  { field: 'expectHealthWorse', min: 1, max: 5, direction: 'highIsBest' },
  { field: 'healthExcellent', min: 1, max: 5, direction: 'lowIsBest' }
];

/** @type {ItemDef[]} */
const VT_ITEMS = [
  { field: 'feltFullOfLife', min: 1, max: 5, direction: 'lowIsBest' },
  { field: 'lotOfEnergy', min: 1, max: 5, direction: 'lowIsBest' },
  { field: 'feltWornOut', min: 1, max: 5, direction: 'highIsBest' },
  { field: 'feltTired', min: 1, max: 5, direction: 'highIsBest' }
];

/** @type {ItemDef[]} */
const SF_ITEMS = [
  { field: 'socialActivitiesInterference', min: 1, max: 5, direction: 'lowIsBest' },
  { field: 'socialActivitiesInterferenceTime', min: 1, max: 5, direction: 'highIsBest' }
];

/** @type {ItemDef[]} */
const RE_ITEMS = [
  { field: 'cutDownTimeEmotional', min: 1, max: 5, direction: 'highIsBest' },
  { field: 'accomplishedLessEmotional', min: 1, max: 5, direction: 'highIsBest' },
  { field: 'lessCarefulThanUsual', min: 1, max: 5, direction: 'highIsBest' }
];

/** @type {ItemDef[]} */
const MH_ITEMS = [
  { field: 'veryNervous', min: 1, max: 5, direction: 'highIsBest' },
  { field: 'soDownInDumps', min: 1, max: 5, direction: 'highIsBest' },
  { field: 'feltCalmPeaceful', min: 1, max: 5, direction: 'lowIsBest' },
  { field: 'downheartedDepressed', min: 1, max: 5, direction: 'highIsBest' },
  { field: 'beenHappy', min: 1, max: 5, direction: 'lowIsBest' }
];

/**
 * Recode one raw item value to 0-100 (0 = worst, 100 = best).
 * @param {number|null} raw
 * @param {ItemDef} def
 * @returns {number|null}
 */
function recodeItem(raw, def) {
  if (raw === null || raw === undefined) return null;
  const { min, max, direction } = def;
  const frac = direction === 'lowIsBest' ? (max - raw) / (max - min) : (raw - min) / (max - min);
  return frac * 100;
}

/**
 * Average the recoded scores for a set of items; null if none answered.
 * @param {Record<string, number|null>} data
 * @param {ItemDef[]} items
 * @returns {number|null}
 */
function domainScore(data, items) {
  const recoded = items
    .map((def) => recodeItem(data[def.field], def))
    .filter((v) => v !== null);
  if (recoded.length === 0) return null;
  const sum = recoded.reduce((a, b) => a + b, 0);
  return sum / recoded.length;
}

function meanOrNull(values) {
  const present = values.filter((v) => v !== null && v !== undefined);
  if (present.length === 0) return null;
  return present.reduce((a, b) => a + b, 0) / present.length;
}

/**
 * Compute the 8 SF-36 domain scores plus simplified (non-licensed)
 * summary approximations.
 * @param {Record<string, number|null>} data - Sf36Response
 */
function computeSf36(data) {
  const pf = domainScore(data, PF_ITEMS);
  const rp = domainScore(data, RP_ITEMS);
  const bp = domainScore(data, BP_ITEMS);
  const gh = domainScore(data, GH_ITEMS);
  const vt = domainScore(data, VT_ITEMS);
  const sf = domainScore(data, SF_ITEMS);
  const re = domainScore(data, RE_ITEMS);
  const mh = domainScore(data, MH_ITEMS);

  return {
    pf, rp, bp, gh, vt, sf, re, mh,
    pcsApprox: meanOrNull([pf, rp, bp, gh]),
    mcsApprox: meanOrNull([vt, sf, re, mh])
  };
}

export { computeSf36 };
