// Declarative Child Safeguarding Referral completeness / validity rules.
//
// This is a documentation-completeness and risk-classification instrument, not
// a scored assessment. It has a small set of MANDATORY rules (spec §4): a valid
// referral requires the referrer name and a contact, the child name and a date
// of birth (or age), the concern description, the primary category of abuse, an
// answer to the immediate-danger question, and a documented consent /
// information-sharing basis. Each rule below evaluates the referral and returns
// true when its requirement is satisfied; the grader (`grader.js`) marks the
// referral `incomplete` when any mandatory rule is unsatisfied, `complete` when
// every mandatory AND recommended slot is populated, and `partial` in between.
// Rows here mirror the `child_safeguarding_referral_grade_rule` SQL table
// (rule_id, rule, category, description).
//
// A separate list of completeness field-slots drives the `completenessPercent`
// arithmetic: it counts populated mandatory-plus-recommended fields so an
// incomplete referral still shows how close it is to done. The
// `unsafe-to-inform-reason` slot is conditional — it only enters the
// denominator when the child / family are recorded as unaware of the referral.

/**
 * @typedef {import('./types.js').SafeguardingReferral} SafeguardingReferral
 *
 * @typedef {Object} MandatoryRule
 * @property {string} id
 * @property {string} rule
 * @property {string} category
 * @property {string} description
 * @property {(r: SafeguardingReferral) => boolean} evaluate
 *
 * @typedef {Object} FieldSlot
 * @property {string} key
 * @property {(r: SafeguardingReferral) => boolean} present   - populated?
 * @property {(r: SafeguardingReferral) => boolean} [applies] - counted in denominator?
 */

// Wrapped in an IIFE; published via window.ChildSafeguardingReferral.

const nonEmpty = (s) => typeof s === 'string' && s.trim() !== '';
const hasNumber = (n) => typeof n === 'number' && !Number.isNaN(n);
const hasDate = (d) => d !== null && d !== undefined && d !== '';

/**
 * A consent / information-sharing basis is documented when consent was given,
 * or — when consent was not given — a lawful basis for sharing without consent
 * is recorded (risk of serious harm, or seeking consent would increase risk).
 * Shared by the mandatory rule, the grader, and the flags module.
 * @param {SafeguardingReferral} r
 * @returns {boolean}
 */
function consentBasisOk(r) {
  if (r.consent.consentStatus === 'given') return true;
  return (
    r.consent.sharingBasisWithoutConsent === 'risk-of-serious-harm' ||
    r.consent.sharingBasisWithoutConsent === 'seeking-consent-increases-risk'
  );
}

/**
 * True when the referrer has recorded at least one contact route (phone or
 * email). One of the two is mandatory.
 * @param {SafeguardingReferral} r
 */
function hasReferrerContact(r) {
  return nonEmpty(r.referrer.referrerPhone) || nonEmpty(r.referrer.referrerEmail);
}

/**
 * True when the child is identifiable in time: a date of birth OR an age.
 * @param {SafeguardingReferral} r
 */
function hasChildDobOrAge(r) {
  return hasDate(r.child.childDateOfBirth) || hasNumber(r.child.childAge);
}

/** @type {MandatoryRule[]} */
const mandatoryRules = [
  // ─── R1: REFERRER IDENTIFIED WITH A CONTACT ───────────────────
  {
    id: 'R-REFERRER-01',
    rule: 'referrer',
    category: 'referrer-details',
    description:
      'The referrer is identified by name and at least one contact route (phone or email) is recorded',
    evaluate: (r) => nonEmpty(r.referrer.referrerName) && hasReferrerContact(r)
  },

  // ─── R2: CHILD IDENTIFIED ─────────────────────────────────────
  {
    id: 'R-CHILD-01',
    rule: 'child',
    category: 'child-details',
    description:
      'The child is identified by name and a date of birth or age is recorded',
    evaluate: (r) => nonEmpty(r.child.childName) && hasChildDobOrAge(r)
  },

  // ─── R3: CONCERN DESCRIBED ────────────────────────────────────
  {
    id: 'R-CONCERN-01',
    rule: 'concern',
    category: 'the-concern',
    description: 'The concern or allegation is described',
    evaluate: (r) => nonEmpty(r.concern.concernDescription)
  },

  // ─── R4: PRIMARY CATEGORY OF ABUSE ────────────────────────────
  {
    id: 'R-CATEGORY-01',
    rule: 'category',
    category: 'category-of-abuse',
    description:
      'A primary category of abuse is selected (physical, emotional, sexual, or neglect)',
    evaluate: (r) =>
      r.category.primaryCategory === 'physical' ||
      r.category.primaryCategory === 'emotional' ||
      r.category.primaryCategory === 'sexual' ||
      r.category.primaryCategory === 'neglect'
  },

  // ─── R5: IMMEDIATE-DANGER QUESTION ANSWERED ───────────────────
  {
    id: 'R-IMMEDIATE-DANGER-01',
    rule: 'immediateDanger',
    category: 'immediate-risk',
    description:
      'The immediate-danger question is answered so the referral can be routed for urgency',
    evaluate: (r) =>
      r.risk.immediateDanger === 'yes' || r.risk.immediateDanger === 'no'
  },

  // ─── R6: CONSENT / INFORMATION-SHARING BASIS ──────────────────
  {
    id: 'R-CONSENT-BASIS-01',
    rule: 'consentBasis',
    category: 'consent-and-sharing',
    description:
      'A consent / information-sharing basis is documented: consent given, or a lawful basis for sharing without consent (Working Together 2023)',
    evaluate: (r) => consentBasisOk(r)
  }
];

// Completeness field-slots. `completenessPercent` counts populated
// mandatory-plus-recommended fields over the fields that apply. All slots
// always apply except the conditional `unsafeToInformReason` slot, which only
// enters the denominator when the child / family are recorded as unaware.
/** @type {FieldSlot[]} */
const completenessSlots = [
  // Mandatory
  { key: 'referrerName', present: (r) => nonEmpty(r.referrer.referrerName) },
  { key: 'referrerContact', present: (r) => hasReferrerContact(r) },
  { key: 'childName', present: (r) => nonEmpty(r.child.childName) },
  { key: 'childDobOrAge', present: (r) => hasChildDobOrAge(r) },
  { key: 'concernDescription', present: (r) => nonEmpty(r.concern.concernDescription) },
  { key: 'primaryCategory', present: (r) => nonEmpty(r.category.primaryCategory) },
  { key: 'immediateDanger', present: (r) => nonEmpty(r.risk.immediateDanger) },
  { key: 'consentBasis', present: (r) => consentBasisOk(r) },
  // Recommended
  { key: 'referrerRole', present: (r) => nonEmpty(r.referrer.referrerRole) },
  { key: 'referrerOrganisation', present: (r) => nonEmpty(r.referrer.referrerOrganisation) },
  { key: 'relationshipToChild', present: (r) => nonEmpty(r.referrer.relationshipToChild) },
  { key: 'childSex', present: (r) => nonEmpty(r.child.childSex) },
  { key: 'childAddress', present: (r) => nonEmpty(r.child.childAddress) },
  { key: 'carers', present: (r) => nonEmpty(r.family.carers) },
  { key: 'householdMembers', present: (r) => nonEmpty(r.family.householdMembers) },
  { key: 'professionalsInvolved', present: (r) => nonEmpty(r.family.professionalsInvolved) },
  { key: 'concernOnset', present: (r) => nonEmpty(r.concern.concernOnset) },
  { key: 'presentingEvidence', present: (r) => nonEmpty(r.category.presentingEvidence) },
  { key: 'childWhereabouts', present: (r) => nonEmpty(r.risk.childWhereabouts) },
  { key: 'whoWithChild', present: (r) => nonEmpty(r.risk.whoWithChild) },
  { key: 'familyAware', present: (r) => nonEmpty(r.consent.familyAware) },
  { key: 'requestedAction', present: (r) => nonEmpty(r.action.requestedAction) },
  { key: 'referrerDeclaration', present: (r) => nonEmpty(r.action.referrerDeclaration) },
  // Conditional recommended slot
  {
    key: 'unsafeToInformReason',
    present: (r) => nonEmpty(r.consent.unsafeToInformReason),
    applies: (r) => r.consent.familyAware === 'no'
  }
];

export { consentBasisOk, hasReferrerContact, hasChildDobOrAge, mandatoryRules, completenessSlots };
