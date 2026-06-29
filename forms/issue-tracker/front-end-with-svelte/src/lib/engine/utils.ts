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

// ──────────────────────────────────────────────
// Presentation helpers — labels and Lily-token colour triples
// ──────────────────────────────────────────────

/** Human-readable label for a composite priority / band. */
export function priorityLabel(priority: CompositePriority): string {
	switch (priority) {
		case 'low':
			return 'Low priority';
		case 'moderate':
			return 'Moderate priority';
		case 'high':
			return 'High priority';
		case 'critical':
			return 'Critical priority';
	}
}

/** Short label for a band, used in dense tables. */
export function bandLabel(band: Band): string {
	switch (band) {
		case 'low':
			return 'Low';
		case 'moderate':
			return 'Moderate';
		case 'high':
			return 'High';
		case 'critical':
			return 'Critical';
	}
}

/** Lily-token colour triple for a band / composite priority. */
export function bandColor(band: Band): string {
	switch (band) {
		case 'low':
			return 'bg-success text-success-content border-success';
		case 'moderate':
			return 'bg-info text-info-content border-info';
		case 'high':
			return 'bg-warning text-warning-content border-warning';
		case 'critical':
			return 'bg-error text-error-content border-error';
	}
}

/** Lily-token colour triple for a flag priority (high / medium / low). */
export function flagPriorityColor(priority: 'high' | 'medium' | 'low'): string {
	switch (priority) {
		case 'high':
			return 'bg-error text-error-content border-error';
		case 'medium':
			return 'bg-warning text-warning-content border-warning';
		case 'low':
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Title-case label for one of the seven scoring instruments. */
export function instrumentLabel(instrument: string): string {
	switch (instrument) {
		case 'priority':
			return 'Priority rank';
		case 'severity':
			return 'Severity of impact';
		case 'magnitude':
			return 'Magnitude of damage';
		case 'harm':
			return 'Harm grade';
		case 'failure':
			return 'Failure condition';
		case 'moscow':
			return 'MoSCoW requirement';
		case 'frequency':
			return 'Frequency of occurrence';
		case 'composite':
			return 'Composite';
		default:
			return instrument;
	}
}
