// Declarative AUDIT-C grading rules.
//
// The AUDIT-C instrument has exactly three scored consumption items, each
// contributing its chosen response's point value (an integer 0-4). Each rule
// below reads its item from the patient data and returns that point value; the
// grader (`grader.js`) sums the three points into the total AUDIT-C score
// (0-12) and derives the risk band. Rows here mirror the
// `audit_c_grade_rule` SQL table (rule_id, parameter, points, category,
// description).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 *
 * @typedef {Object} AuditcRule
 * @property {string} id
 * @property {string} item        - frequency-of-drinking | typical-quantity | heavy-episode-frequency
 * @property {string} field       - the AssessmentData.items key
 * @property {string} category
 * @property {string} description
 * @property {(d: AssessmentData) => number} points  - 0-4 point value (0 when unanswered)
 */

/** Coerce an item value (number, numeric string, or null) to a 0-4 point. */
function toPoint(v) {
  if (v === null || v === undefined || v === '') return 0;
  const n = Number(v);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(4, Math.round(n)));
}

/** @type {AuditcRule[]} */
const auditcRules = [
  // ─── ITEM 1: FREQUENCY OF DRINKING (Q1) ───────────────────────
  {
    id: 'R-ITEM-1-FREQUENCY-01',
    item: 'frequency-of-drinking',
    field: 'frequencyOfDrinking',
    category: 'consumption-item',
    description: 'Q1 — how often the patient has a drink containing alcohol',
    points: (d) => toPoint(d.items.frequencyOfDrinking)
  },

  // ─── ITEM 2: TYPICAL QUANTITY (Q2) ────────────────────────────
  {
    id: 'R-ITEM-2-QUANTITY-01',
    item: 'typical-quantity',
    field: 'typicalQuantity',
    category: 'consumption-item',
    description: 'Q2 — typical number of UK units on a day when drinking',
    points: (d) => toPoint(d.items.typicalQuantity)
  },

  // ─── ITEM 3: HEAVY EPISODIC DRINKING (Q3) ─────────────────────
  {
    id: 'R-ITEM-3-BINGE-01',
    item: 'heavy-episode-frequency',
    field: 'heavyEpisodeFrequency',
    category: 'consumption-item',
    description: 'Q3 — how often the patient has >= 6 (female) / >= 8 (male) units in one session',
    points: (d) => toPoint(d.items.heavyEpisodeFrequency)
  }
];

export { auditcRules, toPoint };
