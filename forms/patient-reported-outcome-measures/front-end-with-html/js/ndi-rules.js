// Neck Disability Index (NDI) scoring — Vernon H, Mior S. The Neck
// Disability Index: a study of reliability and validity. J Manipulative
// Physiol Ther. 1991;14(7):409-15. See ../spec/index.md §2.

const NDI_FIELDS = [
  'painIntensity', 'personalCare', 'lifting', 'reading', 'headache',
  'concentration', 'work', 'driving', 'sleeping', 'recreation'
];

/**
 * @param {Record<string, number|null>} data - NdiResponse
 */
function computeNdi(data) {
  const answered = NDI_FIELDS
    .map((f) => data[f])
    .filter((v) => v !== null && v !== undefined);

  const rawScore = answered.reduce((a, b) => a + b, 0);
  const answeredSections = answered.length;
  const percentageScore = answeredSections === 0
    ? null
    : (rawScore / (5 * answeredSections)) * 100;

  let band = '';
  if (percentageScore !== null) {
    if (percentageScore < 5) band = 'no-disability';
    else if (percentageScore < 15) band = 'mild';
    else if (percentageScore < 25) band = 'moderate';
    else if (percentageScore < 35) band = 'severe';
    else band = 'complete';
  }

  return { rawScore, answeredSections, percentageScore, band };
}

export { computeNdi, NDI_FIELDS };
