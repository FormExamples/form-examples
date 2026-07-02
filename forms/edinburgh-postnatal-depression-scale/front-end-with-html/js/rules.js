// Declarative EPDS item definitions and the reverse-scoring rule.
//
// The EPDS has exactly ten items. Each item presents four response options in
// a fixed PRINTED order (optionIndex 0..3, top to bottom on the questionnaire).
// The wizard stores the raw selected option index; the score contributed by an
// item is derived here:
//
//   - NORMAL items (1, 2, 4):   score = optionIndex          (top = 0 ... bottom = 3)
//   - REVERSE items (3, 5, 6, 7, 8, 9, 10): score = 3 - optionIndex (top = 3 ... bottom = 0)
//
// The score always runs 0 (least symptomatic) to 3 (most symptomatic). The
// grader (`grader.js`) sums the ten item scores into the 0-30 total and derives
// the interpretation band. Item 10's derived score additionally drives the
// mandatory self-harm safety flag whenever it is > 0.
//
// The option wording matches the standard Cox/Holden/Sagovsky 1987 EPDS. Rows
// here mirror the `edinburgh_postnatal_depression_scale_grade_rule` SQL table
// (rule_id, parameter, points, category, description).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 *
 * @typedef {Object} EpdsItem
 * @property {number} number      - 1..10
 * @property {string} field       - 'item1' .. 'item10' (state key)
 * @property {string} statement   - the item statement (past 7 days)
 * @property {'normal' | 'reverse'} direction
 * @property {string[]} options   - four option labels in printed order (index 0..3)
 */

// Wrapped in an IIFE; published via window.EdinburghPostnatalDepressionScale.
(function () {
'use strict';
window.EdinburghPostnatalDepressionScale =
  window.EdinburghPostnatalDepressionScale || {};

// Items reverse-scored per spec §4 (top printed option = 3, bottom = 0).
const REVERSE_ITEMS = [3, 5, 6, 7, 8, 9, 10];

/** @type {EpdsItem[]} */
const epdsItems = [
  {
    number: 1,
    field: 'item1',
    statement: 'I have been able to laugh and see the funny side of things',
    direction: 'normal',
    options: [
      'As much as I always could',
      'Not quite so much now',
      'Definitely not so much now',
      'Not at all'
    ]
  },
  {
    number: 2,
    field: 'item2',
    statement: 'I have looked forward with enjoyment to things',
    direction: 'normal',
    options: [
      'As much as I ever did',
      'Rather less than I used to',
      'Definitely less than I used to',
      'Hardly at all'
    ]
  },
  {
    number: 3,
    field: 'item3',
    statement: 'I have blamed myself unnecessarily when things went wrong',
    direction: 'reverse',
    options: [
      'Yes, most of the time',
      'Yes, some of the time',
      'Not very often',
      'No, never'
    ]
  },
  {
    number: 4,
    field: 'item4',
    statement: 'I have been anxious or worried for no good reason',
    direction: 'normal',
    options: [
      'No, not at all',
      'Hardly ever',
      'Yes, sometimes',
      'Yes, very often'
    ]
  },
  {
    number: 5,
    field: 'item5',
    statement: 'I have felt scared or panicky for no very good reason',
    direction: 'reverse',
    options: [
      'Yes, quite a lot',
      'Yes, sometimes',
      'No, not much',
      'No, not at all'
    ]
  },
  {
    number: 6,
    field: 'item6',
    statement: 'Things have been getting on top of me',
    direction: 'reverse',
    options: [
      'Yes, most of the time I have not been able to cope at all',
      'Yes, sometimes I have not been coping as well as usual',
      'No, most of the time I have coped quite well',
      'No, I have been coping as well as ever'
    ]
  },
  {
    number: 7,
    field: 'item7',
    statement: 'I have been so unhappy that I have had difficulty sleeping',
    direction: 'reverse',
    options: [
      'Yes, most of the time',
      'Yes, sometimes',
      'Not very often',
      'No, not at all'
    ]
  },
  {
    number: 8,
    field: 'item8',
    statement: 'I have felt sad or miserable',
    direction: 'reverse',
    options: [
      'Yes, most of the time',
      'Yes, quite often',
      'Not very often',
      'No, not at all'
    ]
  },
  {
    number: 9,
    field: 'item9',
    statement: 'I have been so unhappy that I have been crying',
    direction: 'reverse',
    options: [
      'Yes, most of the time',
      'Yes, quite often',
      'Only occasionally',
      'No, never'
    ]
  },
  {
    number: 10,
    field: 'item10',
    statement: 'The thought of harming myself has occurred to me',
    direction: 'reverse',
    options: [
      'Yes, quite often',
      'Sometimes',
      'Hardly ever',
      'Never'
    ]
  }
];

/**
 * Convert a raw printed-option index into the 0-3 symptom score for an item.
 * Reverse-scored items invert the index. Returns null for an unanswered item.
 *
 * @param {'normal' | 'reverse'} direction
 * @param {number | null | undefined} optionIndex
 * @returns {number | null}
 */
function scoreForOption(direction, optionIndex) {
  if (optionIndex === null || optionIndex === undefined) return null;
  const idx = Number(optionIndex);
  if (Number.isNaN(idx) || idx < 0 || idx > 3) return null;
  return direction === 'reverse' ? 3 - idx : idx;
}

/**
 * Look up an item definition by its 1-indexed number.
 * @param {number} number
 * @returns {EpdsItem | undefined}
 */
function itemByNumber(number) {
  return epdsItems.find((it) => it.number === number);
}

Object.assign(window.EdinburghPostnatalDepressionScale, {
  epdsItems,
  REVERSE_ITEMS,
  scoreForOption,
  itemByNumber
});
})();
