// Adaptive Functioning scoring rules.
//
// Each of the 10 adaptive-functioning items maps a single 4-option
// SupportLevel response to a numeric score (0-3). The total adaptive score
// is the sum of all 10 items (range 0-30). Unanswered items return 0 and
// are excluded from the answered-count tracker.
//
// Score → support requirement:
//   0 → independent
//   1 → some support
//   2 → significant support
//   3 → full support
//
// Severity is derived from the total over the *answered* items
// (proportional), so partial completion is still meaningful.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 *
 * @typedef {Object} LDRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {(d: AssessmentData) => number} evaluate
 */

/** Convert a SupportLevel to its 0-3 numeric weight (0 if blank). */
function levelScore(level) {
  switch (level) {
    case 'independent': return 0;
    case 'some-support': return 1;
    case 'significant-support': return 2;
    case 'full-support': return 3;
    default: return 0;
  }
}

/** Build a rule object that delegates to a single adaptiveFunctioning field. */
function adaptiveRule(id, category, description, field) {
  return {
    id,
    category,
    description,
    evaluate: (d) => {
      const v = d.adaptiveFunctioning[field];
      return v ? levelScore(v) + 1 : 0;
      // We add 1 so that an answered "independent" still counts as
      // "answered" (score=1) for tracking purposes; the grader subtracts 1
      // when computing the adaptive total.
    }
  };
}

/** @type {LDRule[]} */
const ldRules = [
  adaptiveRule('LD-CON-001', 'Conceptual', 'Language and vocabulary', 'conceptualLanguage'),
  adaptiveRule('LD-CON-002', 'Conceptual', 'Reading and writing', 'conceptualReadingWriting'),
  adaptiveRule('LD-CON-003', 'Conceptual', 'Money, time and number concepts', 'conceptualMoneyTime'),
  adaptiveRule('LD-SOC-001', 'Social', 'Friendships and relationships', 'socialFriendships'),
  adaptiveRule('LD-SOC-002', 'Social', 'Empathy and social judgement', 'socialEmpathy'),
  adaptiveRule('LD-SOC-003', 'Social', 'Social communication', 'socialCommunication'),
  adaptiveRule('LD-PRA-001', 'Practical', 'Personal self-care (washing, dressing, eating)', 'practicalSelfCare'),
  adaptiveRule('LD-PRA-002', 'Practical', 'Home living (cooking, cleaning, household tasks)', 'practicalHomeLiving'),
  adaptiveRule('LD-PRA-003', 'Practical', 'Community use (shopping, transport, money)', 'practicalCommunity'),
  adaptiveRule('LD-PRA-004', 'Practical', 'Work or school skills', 'practicalWorkSchool')
];

export { ldRules, levelScore };
