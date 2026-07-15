// Declarative Zarit Burden Interview item definitions and the active-item-set
// rule.
//
// The ZBI has twenty-two items. Every item uses the same five-point 0-4
// frequency scale (0 = Never … 4 = Nearly always); a higher rating always
// means greater perceived burden, so there is NO reverse-scoring. The wizard
// stores the raw 0-4 rating; the grader (`grader.js`) sums the answered ratings
// over the active item set:
//
//   - ZBI-22 (full):  all twenty-two items          -> total 0..88
//   - ZBI-12 (short): items 1,2,3,6,9,10,11,12,17,20,21,22 -> total 0..48
//
// The remaining ten items may still be recorded on the short form, but they do
// not contribute to the ZBI-12 total. Rows here mirror the
// `zarit_burden_interview_grade_rule` SQL table (rule_id, parameter, points,
// category, description). Item wording is abridged from the standard Zarit,
// Reeves & Bach-Peterson (1980) instrument and the SQL column comments.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 *
 * @typedef {Object} ZaritItem
 * @property {number} number      - 1..22
 * @property {string} field       - 'item1' .. 'item22' (state key)
 * @property {string} statement   - the item statement
 * @property {boolean} shortForm  - true when the item is part of the ZBI-12 subset
 * @property {boolean} global     - true for the global burden item (item 22)
 */

// The 12-item short-form subset (spec §3 / §4).
const SHORT_FORM_ITEMS = [1, 2, 3, 6, 9, 10, 11, 12, 17, 20, 21, 22];

// The five-point frequency response scale shared by every item.
const RESPONSE_SCALE = [
  { value: 0, label: 'Never' },
  { value: 1, label: 'Rarely' },
  { value: 2, label: 'Sometimes' },
  { value: 3, label: 'Quite frequently' },
  { value: 4, label: 'Nearly always' }
];

const SHORT_FORM_SET = new Set(SHORT_FORM_ITEMS);

/** @type {Omit<ZaritItem, 'shortForm' | 'global'>[]} */
const itemStatements = [
  { number: 1,  field: 'item1',  statement: 'You feel that you are asked to do more for your relative than you should.' },
  { number: 2,  field: 'item2',  statement: 'You feel that, because of the time you spend caring, you do not have enough time for yourself.' },
  { number: 3,  field: 'item3',  statement: 'You feel stressed between caring for your relative and your other responsibilities.' },
  { number: 4,  field: 'item4',  statement: "You feel embarrassed by your relative's behaviour." },
  { number: 5,  field: 'item5',  statement: 'You feel angry when you are around your relative.' },
  { number: 6,  field: 'item6',  statement: 'You feel that your relative affects your relationships with other family members or friends in a negative way.' },
  { number: 7,  field: 'item7',  statement: 'You feel afraid about what the future holds for your relative.' },
  { number: 8,  field: 'item8',  statement: 'You feel that your relative is dependent on you.' },
  { number: 9,  field: 'item9',  statement: 'You feel strained when you are around your relative.' },
  { number: 10, field: 'item10', statement: 'You feel that your health has suffered because of your involvement with your relative.' },
  { number: 11, field: 'item11', statement: 'You feel that you do not have as much privacy as you would like because of your relative.' },
  { number: 12, field: 'item12', statement: 'You feel that your social life has suffered because you are caring for your relative.' },
  { number: 13, field: 'item13', statement: 'You feel uncomfortable about having friends over because of your relative.' },
  { number: 14, field: 'item14', statement: 'You feel that your relative expects you to care for them as if you were the only one they could depend on.' },
  { number: 15, field: 'item15', statement: 'You feel that you do not have enough money to care for your relative in addition to the rest of your expenses.' },
  { number: 16, field: 'item16', statement: 'You feel that you will be unable to care for your relative much longer.' },
  { number: 17, field: 'item17', statement: "You feel that you have lost control of your life since your relative's illness." },
  { number: 18, field: 'item18', statement: 'You wish you could leave the care of your relative to someone else.' },
  { number: 19, field: 'item19', statement: 'You feel uncertain about what to do about your relative.' },
  { number: 20, field: 'item20', statement: 'You feel that you should be doing more for your relative.' },
  { number: 21, field: 'item21', statement: 'You feel that you could do a better job in caring for your relative.' },
  { number: 22, field: 'item22', statement: 'Overall, how burdened do you feel in caring for your relative?' }
];

/** @type {ZaritItem[]} */
const zaritItems = itemStatements.map((it) => ({
  ...it,
  shortForm: SHORT_FORM_SET.has(it.number),
  global: it.number === 22
}));

/**
 * The list of item numbers scored for the given instrument form.
 * @param {import('./types.js').InstrumentForm} instrumentForm
 * @returns {number[]}
 */
function activeItemNumbers(instrumentForm) {
  return instrumentForm === 'zbi12'
    ? SHORT_FORM_ITEMS.slice()
    : zaritItems.map((it) => it.number);
}

/**
 * The maximum possible total for the given instrument form.
 * @param {import('./types.js').InstrumentForm} instrumentForm
 * @returns {88 | 48}
 */
function maxScoreFor(instrumentForm) {
  return instrumentForm === 'zbi12' ? 48 : 88;
}

/**
 * Coerce a raw stored rating to a 0-4 integer, or null when unanswered / invalid.
 * @param {number | null | undefined | string} value
 * @returns {number | null}
 */
function ratingValue(value) {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  if (Number.isNaN(n) || n < 0 || n > 4) return null;
  return n;
}

/**
 * Look up an item definition by its 1-indexed number.
 * @param {number} number
 * @returns {ZaritItem | undefined}
 */
function itemByNumber(number) {
  return zaritItems.find((it) => it.number === number);
}

export { zaritItems, SHORT_FORM_ITEMS, RESPONSE_SCALE, activeItemNumbers, maxScoreFor, ratingValue, itemByNumber };
