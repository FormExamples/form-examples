// Neck Disability Index (NDI) scoring — Vernon H, Mior S. The Neck
// Disability Index: a study of reliability and validity. J Manipulative
// Physiol Ther. 1991;14(7):409-15. See ../../../spec/index.md §2.
//
// Direct TypeScript port of
// ../../../front-end-with-html/js/ndi-rules.js — byte-for-byte
// equivalent logic. Do not re-derive; keep in lock-step with that file.

import type { NdiBand, NdiResponse, NdiResult } from './types';

/** Every NDI field shares the same 0-5-or-null value type. */
type NdiValue = NdiResponse[keyof NdiResponse];

export const NDI_FIELDS: Array<keyof NdiResponse> = [
	'painIntensity',
	'personalCare',
	'lifting',
	'reading',
	'headache',
	'concentration',
	'work',
	'driving',
	'sleeping',
	'recreation'
];

export function computeNdi(data: NdiResponse): NdiResult {
	const answered = NDI_FIELDS.map((f) => data[f]).filter(
		(v): v is Exclude<NdiValue, null | undefined> => v !== null && v !== undefined
	);

	const rawScore = (answered as number[]).reduce((a, b) => a + b, 0);
	const answeredSections = answered.length;
	const percentageScore =
		answeredSections === 0 ? null : (rawScore / (5 * answeredSections)) * 100;

	let band: NdiBand = '';
	if (percentageScore !== null) {
		if (percentageScore < 5) band = 'no-disability';
		else if (percentageScore < 15) band = 'mild';
		else if (percentageScore < 25) band = 'moderate';
		else if (percentageScore < 35) band = 'severe';
		else band = 'complete';
	}

	return { rawScore, answeredSections, percentageScore, band };
}
