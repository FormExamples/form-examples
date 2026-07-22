// modified Japanese Orthopedic Association (mJOA) scoring. See
// ../../../spec/index.md §3. Total 0-17; higher = less dysfunction.
//
// Direct TypeScript port of
// ../../../front-end-with-html/js/mjoa-rules.js — byte-for-byte
// equivalent logic. Do not re-derive; keep in lock-step with that file.

import type { MjoaBand, MjoaResponse, MjoaResult } from './types';

export const MJOA_FIELDS: Array<keyof MjoaResponse> = [
	'motorArms',
	'motorLegs',
	'sensationArms',
	'sensationLegs',
	'sensationTrunk',
	'bladderFunction'
];

export function computeMjoa(data: MjoaResponse): MjoaResult {
	const values = MJOA_FIELDS.map((f) => data[f]);
	const allAnswered = values.every((v) => v !== null && v !== undefined);

	if (!allAnswered) {
		return { totalScore: null, band: '' };
	}

	const totalScore = (values as number[]).reduce((a, b) => a + b, 0);

	let band: MjoaBand = '';
	if (totalScore >= 15) band = 'mild';
	else if (totalScore >= 12) band = 'moderate';
	else band = 'severe';

	return { totalScore, band };
}
