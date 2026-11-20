// Declarative state rules and primitive predicates for the United States
// durable financial power of attorney (DPOA) execution-readiness engine.
//
// This form is a VALIDITY / ELIGIBILITY documentation instrument, not a scored
// assessment. The baseline is the Uniform Power of Attorney Act (2006) (UPOAA);
// STATE_RULES encodes the execution formalities of eight states (see
// doc/state-rules.md for citations and the confidence of each row). Any other
// state falls back to DEFAULT_RULE and raises a "verify the state rule" flag.
//
// Nothing here decides that an instrument is legally valid. It encodes what the
// cited statutes require so the grader can classify the plan to execute it.
// Documentation support, not legal advice; the statute, the notary, and a court
// decide.

/**
 * @typedef {import('./types.js').PowerOfAttorney} PowerOfAttorney
 * @typedef {Object} StateRule
 * @property {string} name                      State name.
 * @property {string} citation                  Governing statute.
 * @property {boolean} upoaa                    Based on the Uniform Power of Attorney Act.
 * @property {'required'|'recommended'|'either'} notary  'either' means a notary OR the witness count.
 * @property {number} witnesses                 Witnesses required when no notary-only route applies.
 * @property {boolean} notaryCountsAsWitness    The notary may be one of the witnesses.
 * @property {'allowed'|'prohibited'} springing
 * @property {'default'|'express'} durability   'express' = the instrument must say it is durable.
 * @property {boolean} initials                 Hot powers need the principal's initials beside each (Florida).
 * @property {'none'|'effectiveness'|'before-acting'} agentSignature
 * @property {boolean} notice                   Mandatory statutory notice text.
 */

const nonEmpty = (s) => typeof s === 'string' && s.trim() !== '';

/** Hot-power fields: each needs an express grant (UPOAA section 201). */
const HOT_FIELDS = ['hotCreateTrust', 'hotGift', 'hotSurvivorship', 'hotBeneficiary', 'hotDelegate', 'hotAnnuityWaiver', 'hotDisclaim'];

/** General-authority grant fields. */
const GRANT_FIELDS = ['grantBanking', 'grantRealEstate', 'grantInvestments', 'grantBusiness', 'grantInsurance', 'grantTaxMatters', 'grantBenefits', 'grantRetirement', 'grantClaims', 'grantPersonalProperty'];

/** @type {StateRule} */
const DEFAULT_RULE = {
  name: 'Uniform default (verify)',
  citation: 'Uniform Power of Attorney Act (2006) sections 104, 105, 109',
  upoaa: true,
  notary: 'recommended',
  witnesses: 0,
  notaryCountsAsWitness: false,
  springing: 'allowed',
  durability: 'default',
  initials: false,
  agentSignature: 'none',
  notice: false
};

/** @type {Record<string, StateRule>} */
const STATE_RULES = {
  CA: { name: 'California', citation: 'Cal. Prob. Code 4121-4124, 4264', upoaa: false, notary: 'either', witnesses: 2, notaryCountsAsWitness: false, springing: 'allowed', durability: 'express', initials: false, agentSignature: 'none', notice: true },
  NY: { name: 'New York', citation: 'N.Y. Gen. Oblig. Law 5-1501B', upoaa: false, notary: 'required', witnesses: 2, notaryCountsAsWitness: true, springing: 'allowed', durability: 'default', initials: false, agentSignature: 'effectiveness', notice: true },
  TX: { name: 'Texas', citation: 'Tex. Est. Code ch. 751, 752', upoaa: false, notary: 'required', witnesses: 0, notaryCountsAsWitness: false, springing: 'allowed', durability: 'express', initials: false, agentSignature: 'none', notice: false },
  FL: { name: 'Florida', citation: 'Fla. Stat. 709.2105, 709.2108, 709.2202', upoaa: false, notary: 'required', witnesses: 2, notaryCountsAsWitness: false, springing: 'prohibited', durability: 'default', initials: true, agentSignature: 'none', notice: false },
  IL: { name: 'Illinois', citation: '755 ILCS 45/3-3, 3-3.6', upoaa: false, notary: 'required', witnesses: 1, notaryCountsAsWitness: false, springing: 'allowed', durability: 'default', initials: false, agentSignature: 'none', notice: false },
  PA: { name: 'Pennsylvania', citation: '20 Pa.C.S. 5601 (Act 95 of 2014)', upoaa: false, notary: 'required', witnesses: 2, notaryCountsAsWitness: false, springing: 'allowed', durability: 'default', initials: false, agentSignature: 'before-acting', notice: true },
  OH: { name: 'Ohio', citation: 'Ohio R.C. 1337.21-1337.64; 5301.01', upoaa: true, notary: 'recommended', witnesses: 0, notaryCountsAsWitness: false, springing: 'allowed', durability: 'default', initials: false, agentSignature: 'none', notice: false },
  WA: { name: 'Washington', citation: 'RCW 11.125.050, 11.125.090', upoaa: true, notary: 'required', witnesses: 0, notaryCountsAsWitness: false, springing: 'allowed', durability: 'default', initials: false, agentSignature: 'none', notice: false }
};

/**
 * The state rule for the supplied state, or DEFAULT_RULE.
 * @param {PowerOfAttorney} d
 * @returns {StateRule}
 */
function ruleFor(d) {
  const code = String((d.principal && d.principal.state) || '').toUpperCase();
  return STATE_RULES[code] || DEFAULT_RULE;
}

/** True when the state is blank or not in STATE_RULES. @param {PowerOfAttorney} d */
function stateUnknown(d) {
  const code = String((d.principal && d.principal.state) || '').toUpperCase();
  return !STATE_RULES[code];
}

/** Witnesses counted toward the requirement (the notary may count in NY). */
function effectiveWitnesses(d) {
  const r = ruleFor(d);
  const own = typeof d.execution.witnessCount === 'number' ? d.execution.witnessCount : 0;
  return own + (r.notaryCountsAsWitness && d.execution.notaryArranged === 'yes' ? 1 : 0);
}

/** True when an answered notary plan is deficient. @param {PowerOfAttorney} d */
function notaryDeficient(d) {
  if (d.execution.notaryArranged !== 'no') return false;
  const r = ruleFor(d);
  if (r.notary === 'required') return true;
  if (d.acceptance.usedForRealEstate === 'yes') return true;
  if (r.notary === 'either' && effectiveWitnesses(d) < r.witnesses) return true;
  return false;
}

/** True when too few witnesses are arranged for the state. @param {PowerOfAttorney} d */
function witnessesShort(d) {
  const r = ruleFor(d);
  if (r.witnesses <= 0) return false;
  if (r.notary === 'either' && d.execution.notaryArranged === 'yes') return false;
  if (d.execution.witnessCount === null || d.execution.witnessCount === undefined) return false;
  return effectiveWitnesses(d) < r.witnesses;
}

/** A witness is an agent or successor agent (witnesses are in play). */
function witnessIsAgent(d) {
  const r = ruleFor(d);
  if (d.execution.witnessIsAgent !== 'yes') return false;
  if (r.notary === 'either' && d.execution.notaryArranged === 'yes') return false;
  return r.witnesses > 0 || (typeof d.execution.witnessCount === 'number' && d.execution.witnessCount > 0);
}

/** Springing power in a state that makes it ineffective (Florida). */
function springingBanned(d) {
  return d.instrument.effectiveness === 'springing' && ruleFor(d).springing === 'prohibited';
}

/** The instrument says it is NOT durable. */
function notDurable(d) {
  return d.instrument.durableStatement === 'no';
}

/** Capacity is answered no. */
function capacityMissing(d) {
  return d.principal.capacityConfirmed === 'no';
}

/** Any hot power is granted. */
function anyHotGranted(d) {
  return HOT_FIELDS.some((f) => d.authority[f] === 'yes');
}

/** Florida-style initials missing beside hot powers. */
function hotNotInitialed(d) {
  return ruleFor(d).initials && anyHotGranted(d) && d.authority.hotPowersInitialed === 'no';
}

/** The agent is not an eligible adult or qualifying institution. */
function agentIneligible(d) {
  return d.agents.agentIsAdult === 'no';
}

/** The state needs the agent's signature and it is answered no. */
function agentSignatureMissing(d) {
  return ruleFor(d).agentSignature !== 'none' && d.agents.agentSignedAcknowledgment === 'no';
}

/** New York: the agent's acknowledged signature is required for effectiveness. */
function agentSignatureBlocking(d) {
  return ruleFor(d).agentSignature === 'effectiveness' && d.agents.agentSignedAcknowledgment === 'no';
}

/** Real-estate use with no notary acknowledgment. */
function realEstateNotRecordable(d) {
  return d.acceptance.usedForRealEstate === 'yes' && d.execution.notaryArranged === 'no';
}

/** Any granted general authority. */
function anyGrant(d) {
  return GRANT_FIELDS.some((f) => d.authority[f] === 'yes');
}

/** Execution-risk reasons as fired rules, in a stable order. @param {PowerOfAttorney} d */
function executionRiskRules(d) {
  const rules = [];
  const r = ruleFor(d);
  if (notaryDeficient(d)) rules.push({ ruleId: 'R-NOTARY-MISSING-01', dimension: 'execution', category: 'notarization', description: `No notary acknowledgment is arranged but ${r.name} (${r.citation}) or the planned use requires one.` });
  if (witnessesShort(d)) rules.push({ ruleId: 'R-WITNESSES-SHORT-01', dimension: 'execution', category: 'witnesses', description: `${effectiveWitnesses(d)} witness(es) counted; ${r.name} requires ${r.witnesses}.` });
  if (witnessIsAgent(d)) rules.push({ ruleId: 'R-WITNESS-IS-AGENT-01', dimension: 'execution', category: 'witnesses', description: 'A witness is an agent or successor agent, which disqualifies the witness.' });
  if (springingBanned(d)) rules.push({ ruleId: 'R-SPRINGING-BANNED-01', dimension: 'effectiveness', category: 'springing', description: `${r.name} makes a springing power of attorney ineffective (${r.citation}).` });
  if (notDurable(d)) rules.push({ ruleId: 'R-NOT-DURABLE-01', dimension: 'effectiveness', category: 'durability', description: 'The instrument is not durable: it would end on the principal\'s incapacity.' });
  if (capacityMissing(d)) rules.push({ ruleId: 'R-CAPACITY-01', dimension: 'execution', category: 'capacity', description: 'The principal\'s capacity to sign is not confirmed.' });
  if (hotNotInitialed(d)) rules.push({ ruleId: 'R-HOT-INITIALS-01', dimension: 'authority', category: 'hot-powers', description: `${r.name} requires the principal's signature or initials beside each hot power.` });
  if (agentIneligible(d)) rules.push({ ruleId: 'R-AGENT-INELIGIBLE-01', dimension: 'agent', category: 'eligibility', description: 'The agent is not an adult individual or a qualifying institution.' });
  if (agentSignatureBlocking(d)) rules.push({ ruleId: 'R-AGENT-SIGNATURE-01', dimension: 'agent', category: 'agent-signature', description: `${r.name} makes the power effective only once the agent's signature is acknowledged.` });
  return rules;
}

/** Incompleteness reasons as fired rules. @param {PowerOfAttorney} d */
function incompleteRules(d) {
  const rules = [];
  const miss = (id, category, description) => rules.push({ ruleId: id, dimension: 'completeness', category, description });
  if (!nonEmpty(d.principal.principalName)) miss('R-INC-PRINCIPAL-01', 'principal', 'The principal is not named.');
  if (!nonEmpty(d.principal.state)) miss('R-INC-STATE-01', 'jurisdiction', 'The governing state is not chosen.');
  if (!nonEmpty(d.agents.agentName)) miss('R-INC-AGENT-01', 'agent', 'No agent is named.');
  if (!nonEmpty(d.instrument.effectiveness)) miss('R-INC-EFFECT-01', 'effectiveness', 'Immediate or springing effectiveness is not chosen.');
  if (d.instrument.effectiveness === 'springing' && !nonEmpty(d.instrument.springingTrigger)) miss('R-INC-TRIGGER-01', 'effectiveness', 'A springing power needs a named determination of the event.');
  if (!nonEmpty(d.instrument.durableStatement)) miss('R-INC-DURABLE-01', 'effectiveness', 'Durability is not answered.');
  if (!nonEmpty(d.principal.capacityConfirmed)) miss('R-INC-CAPACITY-01', 'capacity', 'Capacity is not answered.');
  if (!nonEmpty(d.execution.notaryArranged)) miss('R-INC-NOTARY-01', 'execution', 'The notary plan is not answered.');
  if (!anyGrant(d)) miss('R-INC-GRANTS-01', 'authority', 'No general authority is granted.');
  return rules;
}

export { nonEmpty, HOT_FIELDS, GRANT_FIELDS, DEFAULT_RULE, STATE_RULES, ruleFor, stateUnknown, effectiveWitnesses, notaryDeficient, witnessesShort, witnessIsAgent, springingBanned, notDurable, capacityMissing, anyHotGranted, hotNotInitialed, agentIneligible, agentSignatureMissing, agentSignatureBlocking, realEstateNotRecordable, anyGrant, executionRiskRules, incompleteRules };
