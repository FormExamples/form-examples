import type { RagBand } from './types';

const ORDER: Record<RagBand, number> = { green: 0, amber: 1, red: 2 };

export function worstBand(bands: RagBand[]): RagBand {
	return bands.reduce<RagBand>((acc, b) => (ORDER[b] > ORDER[acc] ? b : acc), 'green');
}
