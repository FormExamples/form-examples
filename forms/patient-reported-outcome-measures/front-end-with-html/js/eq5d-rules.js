// EQ-5D-3L scoring: health-state descriptor + UK time-trade-off (TTO)
// crosswalk index value. Dolan, P. Modeling valuations for EuroQol
// health states. Medical Care. 1997;35(11):1095-1108 — the original
// published UK value-set coefficients (public domain research),
// distinct from EuroQol's own current licensed value sets. See
// ../spec/index.md §4.

const EQ5D_DIMENSIONS = [
  'mobility', 'selfCare', 'usualActivities', 'painDiscomfort', 'anxietyDepression'
];

const LEVEL_2_COEFFICIENTS = {
  mobility: 0.069,
  selfCare: 0.104,
  usualActivities: 0.036,
  painDiscomfort: 0.123,
  anxietyDepression: 0.071
};

const LEVEL_3_COEFFICIENTS = {
  mobility: 0.314,
  selfCare: 0.214,
  usualActivities: 0.094,
  painDiscomfort: 0.386,
  anxietyDepression: 0.236
};

const CONSTANT_TERM = 0.081;
const N3_TERM = 0.269;

/**
 * @param {Record<string, number|null>} data - Eq5dResponse
 */
function computeEq5d(data) {
  const levels = EQ5D_DIMENSIONS.map((d) => data[d]);
  const allAnswered = levels.every((v) => v === 1 || v === 2 || v === 3);

  const healthStateDescriptor = allAnswered
    ? levels.join('')
    : '';

  let ukIndexValue = null;
  if (allAnswered) {
    if (healthStateDescriptor === '11111') {
      ukIndexValue = 1.0;
    } else {
      let index = 1.0;
      index -= CONSTANT_TERM;
      let anyLevel3 = false;
      for (const dim of EQ5D_DIMENSIONS) {
        const level = data[dim];
        if (level === 2) index -= LEVEL_2_COEFFICIENTS[dim];
        if (level === 3) {
          index -= LEVEL_3_COEFFICIENTS[dim];
          anyLevel3 = true;
        }
      }
      if (anyLevel3) index -= N3_TERM;
      ukIndexValue = index;
    }
  }

  const vasScore = data.vasScore === null || data.vasScore === undefined ? null : data.vasScore;

  return { healthStateDescriptor, ukIndexValue, vasScore };
}

export { computeEq5d, EQ5D_DIMENSIONS };
