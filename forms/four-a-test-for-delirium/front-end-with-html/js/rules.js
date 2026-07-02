// Declarative 4AT scoring rules.
//
// The 4AT has four items. Items 1 and 4 contribute 0 or 4 points; items 2 and 3
// contribute 0, 1, or 2 points. Each rule below evaluates the patient data and
// returns true when its scoring response was selected; the grader (`grader.js`)
// groups fired rules by item, sums the points into the total 4AT score (0-12),
// and derives the interpretation band. Only the non-zero responses have rules —
// a "normal" / "no mistakes" answer simply fires nothing and contributes 0.
// Because each item's responses are mutually exclusive, at most one rule fires
// per item. Rows here mirror the `four_a_test_for_delirium_grade_rule` SQL table
// (rule_id, item, points, category, description).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 *
 * @typedef {Object} FourATRule
 * @property {string} id
 * @property {string} item        - alertness | amt4 | attention | acute-change
 * @property {number} points      - points contributed when the rule fires
 * @property {string} category
 * @property {string} description
 * @property {(d: AssessmentData) => boolean} evaluate
 */

// Wrapped in an IIFE; published via window.FourATestForDelirium.
(function () {
'use strict';
window.FourATestForDelirium = window.FourATestForDelirium || {};

/** @type {FourATRule[]} */
const fouratRules = [
  // ─── ITEM 1: ALERTNESS (0 or 4) ───────────────────────────────
  {
    id: 'R-ALERTNESS-01',
    item: 'alertness',
    points: 4,
    category: 'four-at-item',
    description: 'Alertness clearly abnormal — markedly drowsy, or agitated / hyperactive',
    evaluate: (d) => d.item1.alertness === 'abnormal'
  },

  // ─── ITEM 2: AMT4 (0, 1, or 2) ────────────────────────────────
  {
    id: 'R-AMT4-01',
    item: 'amt4',
    points: 1,
    category: 'four-at-item',
    description: 'AMT4 — 1 mistake across age, date of birth, place, and current year',
    evaluate: (d) => d.item2.amt4 === 'oneMistake'
  },
  {
    id: 'R-AMT4-02',
    item: 'amt4',
    points: 2,
    category: 'four-at-item',
    description: 'AMT4 — 2 or more mistakes, or untestable',
    evaluate: (d) => d.item2.amt4 === 'twoOrMoreOrUntestable'
  },

  // ─── ITEM 3: ATTENTION — MONTHS BACKWARDS (0, 1, or 2) ─────────
  {
    id: 'R-ATTENTION-01',
    item: 'attention',
    points: 1,
    category: 'four-at-item',
    description: 'Attention — starts months backwards but scores < 7, or refuses to start',
    evaluate: (d) => d.item3.attentionMonths === 'startsButUnderSevenOrRefuses'
  },
  {
    id: 'R-ATTENTION-02',
    item: 'attention',
    points: 2,
    category: 'four-at-item',
    description: 'Attention — untestable (cannot start because unwell, drowsy, or inattentive)',
    evaluate: (d) => d.item3.attentionMonths === 'untestable'
  },

  // ─── ITEM 4: ACUTE CHANGE OR FLUCTUATING COURSE (0 or 4) ───────
  {
    id: 'R-ACUTE-CHANGE-01',
    item: 'acute-change',
    points: 4,
    category: 'four-at-item',
    description: 'Acute change or fluctuating course present over the last 2 weeks, still evident in the last 24 hours',
    evaluate: (d) => d.item4.acuteChange === 'yes'
  }
];

window.FourATestForDelirium.fouratRules = fouratRules;
})();
