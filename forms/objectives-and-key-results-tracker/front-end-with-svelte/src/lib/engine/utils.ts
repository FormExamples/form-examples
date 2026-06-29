import type { RagBand } from './types';

const ORDER: Record<RagBand, number> = { green: 0, amber: 1, red: 2 };

export function worstBand(bands: RagBand[]): RagBand {
	return bands.reduce<RagBand>((acc, b) => (ORDER[b] > ORDER[acc] ? b : acc), 'green');
}

/** Human-readable label for a RAG band. */
export function ragLabel(band: RagBand): string {
	switch (band) {
		case 'green':
			return 'On track';
		case 'amber':
			return 'At risk';
		case 'red':
			return 'Off track';
		default:
			return band;
	}
}

/** Lily-token colour triple (bg/text/border) for a RAG band banner. */
export function ragColor(band: RagBand): string {
	switch (band) {
		case 'green':
			return 'bg-success text-success-content border-success';
		case 'amber':
			return 'bg-warning text-warning-content border-warning';
		case 'red':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Priority → Lily-token colour triple for a flag chip. */
export function flagPriorityColor(priority: string): string {
	switch (priority) {
		case 'high':
			return 'bg-error text-error-content border-error';
		case 'medium':
			return 'bg-warning text-warning-content border-warning';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}
