import { SNOT22_ITEMS } from './types.js';

// SNOT-22 (Sino-Nasal Outcome Test) scoring rules.
//
// Each rule corresponds to one of the 22 questions and returns the patient's
// 0-5 rating (or 0 + answered=false when blank). The grader sums all
// answered items to produce the SNOT-22 total (0-110).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 *
 * @typedef {Object} SNOT22Rule
 * @property {string} id
 * @property {string} key
 * @property {string} category
 * @property {string} description
 * @property {(d: AssessmentData) => { score: number, answered: boolean }} evaluate
 */

/** @type {SNOT22Rule[]} */
const snot22Rules = SNOT22_ITEMS.map((item, idx) => ({
  id: `SNOT22-${String(idx + 1).padStart(3, '0')}`,
  key: item.key,
  category: 'SNOT-22',
  description: item.label,
  evaluate: (d) => {
    const v = d.snot22[item.key];
    if (v === null || v === undefined || v === '') {
      return { score: 0, answered: false };
    }
    return { score: Number(v), answered: true };
  }
}));

export { snot22Rules };
