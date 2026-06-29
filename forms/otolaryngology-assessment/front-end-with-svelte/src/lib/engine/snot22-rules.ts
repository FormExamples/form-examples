import type { Snot22Rule } from './types';
import { SNOT22_ITEMS } from './types';

/**
 * SNOT-22 (Sino-Nasal Outcome Test) scoring rules. Each rule corresponds to
 * one of the 22 questions and returns the patient's 0-5 rating (or
 * `answered: false` when blank). The grader sums all answered items to produce
 * the SNOT-22 total (0-110).
 */
export const snot22Rules: Snot22Rule[] = SNOT22_ITEMS.map((item, idx) => ({
	id: `SNOT22-${String(idx + 1).padStart(3, '0')}`,
	key: item.key,
	category: 'SNOT-22',
	description: item.label,
	evaluate: (d) => {
		const v = d.snot22[item.key];
		if (v === null || v === undefined) {
			return { score: 0, answered: false };
		}
		return { score: Number(v), answered: true };
	}
}));
