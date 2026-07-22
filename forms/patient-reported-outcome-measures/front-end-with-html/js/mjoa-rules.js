// modified Japanese Orthopedic Association (mJOA) scoring. See
// ../spec/index.md §3. Total 0-17; higher = less dysfunction.

const MJOA_FIELDS = [
  'motorArms', 'motorLegs', 'sensationArms', 'sensationLegs',
  'sensationTrunk', 'bladderFunction'
];

/**
 * @param {Record<string, number|null>} data - MjoaResponse
 */
function computeMjoa(data) {
  const values = MJOA_FIELDS.map((f) => data[f]);
  const allAnswered = values.every((v) => v !== null && v !== undefined);

  if (!allAnswered) {
    return { totalScore: null, band: '' };
  }

  const totalScore = values.reduce((a, b) => a + b, 0);

  let band = '';
  if (totalScore >= 15) band = 'mild';
  else if (totalScore >= 12) band = 'moderate';
  else band = 'severe';

  return { totalScore, band };
}

export { computeMjoa, MJOA_FIELDS };
