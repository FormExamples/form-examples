import type { Band, CompositePriority } from './types';

// Numerical ordering of bands so we can take the worst across instruments.
const BAND_RANK: Record<Band, number> = {
	low: 0,
	moderate: 1,
	high: 2,
	critical: 3,
};

const BAND_BY_RANK: Band[] = ['low', 'moderate', 'high', 'critical'];

export function maxBand(...bands: Band[]): Band {
	if (bands.length === 0) return 'low';
	let worst = 0;
	for (const b of bands) {
		const r = BAND_RANK[b];
		if (r > worst) worst = r;
	}
	return BAND_BY_RANK[worst];
}

export function bandToCompositePriority(band: Band): CompositePriority {
	return band;
}

export function clampInt(value: number | null, min: number, max: number): number | null {
	if (value === null || Number.isNaN(value)) return null;
	if (value < min) return min;
	if (value > max) return max;
	return Math.trunc(value);
}
