// Declarative United States Last Will and Testament classification rules.
//
// This form is a DOCUMENTATION and VALIDITY-CLASSIFICATION instrument for a
// will, not a scored assessment and not legal advice. This module holds the
// primitive predicates the grader (`grader.js`) and the flag detector
// (`flags.js`) compose (spec §4):
//
//   - the Uniform Probate Code (UPC) default rule and the per-state
//     STATE_RULES table (witness count, holographic and electronic wills,
//     interested-witness rule, self-proving form, spousal elective share,
//     no-contest clause, state estate or inheritance tax),
//   - the testamentary-capacity, witness, residuary-percentage and elective-
//     share predicates.
//
// Nothing in this file decides that a will is valid. It encodes the formality
// rules a drafter should check so the grader can classify the plan; the
// probate court decides validity.

/**
 * @typedef {import('./types.js').Will} Will
 */

const nonEmpty = (s) => typeof s === 'string' && s.trim() !== '';
const isNum = (n) => typeof n === 'number' && Number.isFinite(n);

/** Minimum testamentary age (UPC 2-501). */
const MIN_AGE = 18;

/** Federal basic exclusion amount for 2026 deaths (US dollars). */
const FEDERAL_ESTATE_TAX_EXCLUSION = 15000000;

/** Residuary percentages must sum to this, within PERCENT_TOLERANCE. */
const PERCENT_TOTAL = 100;
const PERCENT_TOLERANCE = 0.01;

/**
 * Interested-witness rule kinds:
 *   valid                   - signing as a witness never voids a gift (UPC 2-505)
 *   presumption             - a gift to a witness is presumed procured by duress or
 *                             undue influence unless two disinterested witnesses
 *                             also signed; the witness keeps at most the intestate share
 *   void-unless-two-others  - the gift is void unless at least two other
 *                             disinterested witnesses signed; the witness keeps at
 *                             most the intestate share
 *   void-unless-corroborated - the gift is void unless at least one disinterested
 *                             credible person corroborates; at most the intestate share
 *
 * Elective share kinds:
 *   none      - no elective share (community property state, or no such right)
 *   fraction  - a fraction of the net or augmented estate
 *   greater-of - the greater of a fixed floor and a fraction
 *
 * Every value is the drafter-facing summary of the cited statute; the text of
 * the current statute controls. See doc/index.md for sources.
 */

/** The Uniform Probate Code default, used for any state not in STATE_RULES. */
const UPC_DEFAULT = {
  code: '',
  name: 'Uniform Probate Code default',
  witnessesRequired: 2,
  witnessPresenceRequired: false,
  holographicAllowed: true,
  electronicAllowed: false,
  interestedWitness: 'valid',
  selfProvingRecognized: true,
  selfProvingNotaryRequired: true,
  communityProperty: false,
  electiveShare: { kind: 'fraction', fraction: 0.5, fractionNoDescendants: 0.5, floor: 0, approximate: true },
  noContest: 'enforceable-with-exceptions',
  stateEstateTax: { kind: 'unknown', exclusion: 0 },
  citation: 'UPC 2-501, 2-502, 2-503, 2-504, 2-505, 2-202, 3-905'
};

/** Per-state rules. Unknown states fall back to UPC_DEFAULT. */
const STATE_RULES = {
  CA: {
    code: 'CA', name: 'California',
    witnessesRequired: 2, witnessPresenceRequired: false,
    holographicAllowed: true, electronicAllowed: false,
    interestedWitness: 'presumption',
    selfProvingRecognized: true, selfProvingNotaryRequired: false,
    communityProperty: true,
    electiveShare: { kind: 'none', fraction: 0, fractionNoDescendants: 0, floor: 0 },
    noContest: 'limited',
    stateEstateTax: { kind: 'none', exclusion: 0 },
    citation: 'Cal. Prob. Code 6100, 6110, 6111, 6112, 21310-21315'
  },
  NY: {
    code: 'NY', name: 'New York',
    witnessesRequired: 2, witnessPresenceRequired: false,
    holographicAllowed: false, electronicAllowed: false,
    interestedWitness: 'void-unless-two-others',
    selfProvingRecognized: true, selfProvingNotaryRequired: true,
    communityProperty: false,
    electiveShare: { kind: 'greater-of', fraction: 1 / 3, fractionNoDescendants: 1 / 3, floor: 50000 },
    noContest: 'enforceable-with-exceptions',
    stateEstateTax: { kind: 'estate', exclusion: 7350000 },
    citation: 'N.Y. EPTL 3-2.1, 3-2.2, 3-3.2, 3-3.5, 5-1.1-A; SCPA 1406'
  },
  TX: {
    code: 'TX', name: 'Texas',
    witnessesRequired: 2, witnessPresenceRequired: true,
    holographicAllowed: true, electronicAllowed: false,
    interestedWitness: 'void-unless-corroborated',
    selfProvingRecognized: true, selfProvingNotaryRequired: true,
    communityProperty: true,
    electiveShare: { kind: 'none', fraction: 0, fractionNoDescendants: 0, floor: 0 },
    noContest: 'enforceable-with-exceptions',
    stateEstateTax: { kind: 'none', exclusion: 0 },
    citation: 'Tex. Est. Code 251.001, 251.051, 251.052, 251.101-251.107, 254.002, 254.005'
  },
  FL: {
    code: 'FL', name: 'Florida',
    witnessesRequired: 2, witnessPresenceRequired: true,
    holographicAllowed: false, electronicAllowed: true,
    interestedWitness: 'valid',
    selfProvingRecognized: true, selfProvingNotaryRequired: true,
    communityProperty: false,
    electiveShare: { kind: 'fraction', fraction: 0.3, fractionNoDescendants: 0.3, floor: 0 },
    noContest: 'unenforceable',
    stateEstateTax: { kind: 'none', exclusion: 0 },
    citation: 'Fla. Stat. 732.201, 732.502, 732.503, 732.504, 732.517, 732.522'
  },
  IL: {
    code: 'IL', name: 'Illinois',
    witnessesRequired: 2, witnessPresenceRequired: true,
    holographicAllowed: false, electronicAllowed: true,
    interestedWitness: 'void-unless-two-others',
    selfProvingRecognized: true, selfProvingNotaryRequired: false,
    communityProperty: false,
    electiveShare: { kind: 'fraction', fraction: 1 / 3, fractionNoDescendants: 0.5, floor: 0 },
    noContest: 'enforceable-with-exceptions',
    stateEstateTax: { kind: 'estate', exclusion: 4000000 },
    citation: '755 ILCS 5/2-8, 4-3, 4-6, 6-4'
  },
  PA: {
    code: 'PA', name: 'Pennsylvania',
    witnessesRequired: 2, witnessPresenceRequired: false,
    holographicAllowed: true, electronicAllowed: false,
    interestedWitness: 'void-unless-two-others',
    selfProvingRecognized: true, selfProvingNotaryRequired: true,
    communityProperty: false,
    electiveShare: { kind: 'fraction', fraction: 1 / 3, fractionNoDescendants: 1 / 3, floor: 0 },
    noContest: 'enforceable-with-exceptions',
    stateEstateTax: { kind: 'inheritance', exclusion: 0 },
    citation: '20 Pa.C.S. 2203, 2502, 2505, 3132, 3132.1'
  },
  OH: {
    code: 'OH', name: 'Ohio',
    witnessesRequired: 2, witnessPresenceRequired: true,
    holographicAllowed: false, electronicAllowed: false,
    interestedWitness: 'void-unless-two-others',
    selfProvingRecognized: false, selfProvingNotaryRequired: false,
    communityProperty: false,
    electiveShare: { kind: 'fraction', fraction: 0.5, fractionNoDescendants: 0.5, floor: 0, approximate: true },
    noContest: 'enforceable-with-exceptions',
    stateEstateTax: { kind: 'none', exclusion: 0 },
    citation: 'Ohio R.C. 2106.01, 2107.03, 2107.15'
  },
  WA: {
    code: 'WA', name: 'Washington',
    witnessesRequired: 2, witnessPresenceRequired: true,
    holographicAllowed: false, electronicAllowed: false,
    interestedWitness: 'presumption',
    selfProvingRecognized: true, selfProvingNotaryRequired: true,
    communityProperty: true,
    electiveShare: { kind: 'none', fraction: 0, fractionNoDescendants: 0, floor: 0 },
    noContest: 'limited',
    stateEstateTax: { kind: 'estate', exclusion: 3000000 },
    citation: 'RCW 11.12.020, 11.12.160, 11.20.020, 11.96A.075'
  }
};

/**
 * The rule set for a state code, and whether it came from the table.
 * @param {string} code two-letter state code (any case)
 * @returns {{ rule: typeof UPC_DEFAULT, known: boolean }}
 */
function stateRuleFor(code) {
  const key = String(code || '').trim().toUpperCase();
  if (STATE_RULES[key]) return { rule: STATE_RULES[key], known: true };
  return { rule: UPC_DEFAULT, known: false };
}

/** A state code was entered but is not in the table. @param {Will} w */
function unknownState(w) {
  return nonEmpty(w.testator.state) && !stateRuleFor(w.testator.state).known;
}

/** Whole years between an ISO birth date and an ISO date; null if either is missing. */
function ageOn(birthIso, onIso) {
  if (!nonEmpty(birthIso) || !nonEmpty(onIso)) return null;
  const b = birthIso.split('-').map(Number);
  const o = onIso.split('-').map(Number);
  if (b.length !== 3 || o.length !== 3 || b.some(Number.isNaN) || o.some(Number.isNaN)) return null;
  let age = o[0] - b[0];
  if (o[1] < b[1] || (o[1] === b[1] && o[2] < b[2])) age -= 1;
  return age;
}

/** @param {Will} w */
function testatorAge(w) {
  return ageOn(w.testator.dateOfBirth, w.execution.executionDate);
}

/** Testator is under the minimum testamentary age on the execution date. @param {Will} w */
function underage(w) {
  const age = testatorAge(w);
  return age !== null && age < MIN_AGE;
}

/** Named witnesses with their interest answer. @param {Will} w */
function witnesses(w) {
  const e = w.execution;
  return [
    { name: e.witness1Name, beneficiary: e.witness1Beneficiary },
    { name: e.witness2Name, beneficiary: e.witness2Beneficiary },
    { name: e.witness3Name, beneficiary: e.witness3Beneficiary }
  ].filter((x) => nonEmpty(x.name));
}

/** How many witnesses are named. @param {Will} w */
function witnessCount(w) {
  return witnesses(w).length;
}

/** Witnesses who take under the will. @param {Will} w */
function interestedWitnesses(w) {
  return witnesses(w).filter((x) => x.beneficiary === 'yes');
}

/** Witnesses who take nothing under the will. @param {Will} w */
function disinterestedWitnessCount(w) {
  return witnesses(w).filter((x) => x.beneficiary === 'no').length;
}

/**
 * True when the interested-witness rule puts a gift at risk. The risk exists
 * when at least one witness takes under the will and too few disinterested
 * witnesses also signed (spec §4).
 * @param {Will} w
 * @returns {'' | 'valid' | 'presumption' | 'void'}
 */
function interestedWitnessOutcome(w) {
  if (interestedWitnesses(w).length === 0) return '';
  const { rule } = stateRuleFor(w.testator.state);
  const disinterested = disinterestedWitnessCount(w);
  switch (rule.interestedWitness) {
    case 'valid': return 'valid';
    case 'presumption': return disinterested >= 2 ? '' : 'presumption';
    case 'void-unless-corroborated': return disinterested >= 1 ? '' : 'void';
    default: return disinterested >= 2 ? '' : 'void';
  }
}

/** The execution form needs attesting witnesses. @param {Will} w */
function needsWitnesses(w) {
  const f = w.execution.executionForm;
  return f === 'witnessed' || f === 'electronic' || f === '';
}

/** Sum of the named residuary percentages. @param {Will} w */
function residuaryPercentTotal(w) {
  const e = w.estate;
  return round2([e.residuary1Percent, e.residuary2Percent, e.residuary3Percent]
    .reduce((sum, p) => sum + (isNum(p) ? p : 0), 0));
}

/** True when any residuary beneficiary or percentage is entered. @param {Will} w */
function residuaryEntered(w) {
  const e = w.estate;
  return [e.residuary1Name, e.residuary2Name, e.residuary3Name].some(nonEmpty) ||
    [e.residuary1Percent, e.residuary2Percent, e.residuary3Percent].some(isNum);
}

/** The residuary shares do not sum to 100. @param {Will} w */
function residuaryMismatch(w) {
  if (w.estate.residuaryClausePresent !== 'yes' && !residuaryEntered(w)) return false;
  return Math.abs(residuaryPercentTotal(w) - PERCENT_TOTAL) > PERCENT_TOLERANCE;
}

/** The specific bequests together exceed the estimated estate. @param {Will} w */
function specificExceedsEstate(w) {
  const { specificBequestsTotal: s, estimatedEstateValue: v } = w.estate;
  return isNum(s) && isNum(v) && s > v;
}

/** @param {number} n */
function round2(n) {
  return Math.round(n * 100) / 100;
}

/**
 * The spousal elective-share amount in dollars for a married testator, or null
 * when the state grants none, the testator is not married, or the estate value
 * is unknown (spec §4). A drafter's estimate, not a computation of the
 * statutory augmented estate.
 * @param {Will} w
 * @returns {number | null}
 */
function electiveShareAmount(w) {
  if (w.testator.maritalStatus !== 'married') return null;
  const estate = w.estate.estimatedEstateValue;
  if (!isNum(estate)) return null;
  const { rule } = stateRuleFor(w.testator.state);
  const share = rule.electiveShare;
  if (share.kind === 'none') return null;
  const fraction = w.family.hasMinorChildren === 'yes' || w.family.disinheritsChild === 'yes'
    ? share.fraction : (share.fractionNoDescendants ?? share.fraction);
  const proportional = estate * fraction;
  const amount = share.kind === 'greater-of' ? Math.max(proportional, share.floor) : proportional;
  return round2(amount);
}

/** The spouse is left less than the elective share and has not waived it. @param {Will} w */
function electiveShareExposure(w) {
  const amount = electiveShareAmount(w);
  if (amount === null) return false;
  if (w.family.spouseWaivedElectiveShare === 'yes') return false;
  const left = w.family.spouseInheritanceValue;
  return isNum(left) && left < amount;
}

/** Federal estate tax may apply (estimated estate above the 2026 exclusion). @param {Will} w */
function federalEstateTaxExposure(w) {
  const v = w.estate.estimatedEstateValue;
  return isNum(v) && v > FEDERAL_ESTATE_TAX_EXCLUSION;
}

/** A state estate tax may apply, or the state has an inheritance tax. @param {Will} w */
function stateTaxExposure(w) {
  const { rule } = stateRuleFor(w.testator.state);
  const tax = rule.stateEstateTax;
  const v = w.estate.estimatedEstateValue;
  if (tax.kind === 'estate') return isNum(v) && v > tax.exclusion;
  if (tax.kind === 'inheritance') return isNum(v) && v > 0;
  return false;
}

/**
 * The will is self-proved: the self-proving affidavit is in place and, where
 * the state requires a notary, the notary acknowledged. Holographic wills are
 * never self-proved.
 * @param {Will} w
 */
function selfProved(w) {
  if (w.execution.executionForm === 'holographic') return false;
  const s = w.selfProving;
  if (s.selfProvingAffidavit !== 'yes') return false;
  const { rule } = stateRuleFor(w.testator.state);
  if (!rule.selfProvingRecognized) return false;
  if (rule.selfProvingNotaryRequired) return nonEmpty(s.notaryName) && s.notaryAcknowledged === 'yes';
  return true;
}

/**
 * Required drafting answers that are still missing; each makes the plan
 * incomplete. Returns `{ group, label }` records (spec §4).
 * @param {Will} w
 * @returns {{ group: 'testator' | 'estate' | 'execution', label: string }[]}
 */
function missingItems(w) {
  const out = [];
  const add = (group, label) => out.push({ group, label });
  if (!nonEmpty(w.testator.state)) add('testator', 'state of the testator');
  if (!nonEmpty(w.testator.testatorName)) add('testator', 'testator name');
  if (!nonEmpty(w.testator.dateOfBirth)) add('testator', 'testator date of birth');
  if (!nonEmpty(w.testator.soundMind)) add('testator', 'sound-mind (capacity) confirmation');
  if (!nonEmpty(w.testator.maritalStatus)) add('testator', 'marital status');
  if (w.testator.maritalStatus === 'married' && !nonEmpty(w.family.spouseName)) add('estate', 'spouse name');
  if (w.testator.maritalStatus === 'married' && !isNum(w.family.spouseInheritanceValue)) add('estate', 'value left to the spouse');
  if (!nonEmpty(w.estate.residuaryClausePresent)) add('estate', 'whether a residuary clause is present');
  if (!nonEmpty(w.provisions.personalRepresentativeName)) add('estate', 'personal representative (executor)');
  if (!nonEmpty(w.execution.executionForm)) add('execution', 'form of execution');
  if (!nonEmpty(w.execution.executionDate)) add('execution', 'execution date');
  if (needsWitnesses(w) && w.execution.executionForm !== '') {
    if (!nonEmpty(w.execution.signedAtEnd)) add('execution', 'signed-at-the-end confirmation');
    if (!nonEmpty(w.execution.signedInWitnessPresence)) add('execution', 'signed-in-front-of-witnesses confirmation');
    if (witnessCount(w) === 0) add('execution', 'witness names');
  }
  if (w.execution.executionForm === 'holographic' && !nonEmpty(w.execution.holographicEntirelyHandwritten)) {
    add('execution', 'handwriting confirmation for the holographic will');
  }
  return out;
}

export {
  nonEmpty, isNum, MIN_AGE, FEDERAL_ESTATE_TAX_EXCLUSION, PERCENT_TOTAL, UPC_DEFAULT, STATE_RULES,
  stateRuleFor, unknownState, ageOn, testatorAge, underage, witnesses, witnessCount,
  interestedWitnesses, disinterestedWitnessCount, interestedWitnessOutcome, needsWitnesses,
  residuaryPercentTotal, residuaryEntered, residuaryMismatch, specificExceedsEstate,
  electiveShareAmount, electiveShareExposure, federalEstateTaxExposure, stateTaxExposure,
  selfProved, missingItems
};
