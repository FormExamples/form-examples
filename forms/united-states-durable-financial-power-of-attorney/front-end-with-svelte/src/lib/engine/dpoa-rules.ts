// Declarative state rules and primitive predicates for the United States
// durable financial power of attorney (DPOA) execution-readiness engine.
//
// A VALIDITY / ELIGIBILITY documentation instrument, not a scored assessment.
// The baseline is the Uniform Power of Attorney Act (2006) (UPOAA); STATE_RULES
// encodes the execution formalities of eight states (doc/state-rules.md has the
// citations and confidence). Other states fall back to DEFAULT_RULE and raise a
// "verify the state rule" flag. Documentation support, not legal advice.
import type { FiredRule, GrantField, HotField, PowerOfAttorney, StateRule } from './types';

export const nonEmpty = (s: unknown): boolean => typeof s === 'string' && s.trim() !== '';

// = (s) => typeof s === 'string' && s.trim() !== '';

export const HOT_FIELDS: HotField[] = [
  'hotCreateTrust',
  'hotGift',
  'hotSurvivorship',
  'hotBeneficiary',
  'hotDelegate',
  'hotAnnuityWaiver',
  'hotDisclaim'
];

export const GRANT_FIELDS: GrantField[] = [
  'grantBanking',
  'grantRealEstate',
  'grantInvestments',
  'grantBusiness',
  'grantInsurance',
  'grantTaxMatters',
  'grantBenefits',
  'grantRetirement',
  'grantClaims',
  'grantPersonalProperty'
];

export const DEFAULT_RULE: StateRule = {
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

export const STATE_RULES: Record<string, StateRule> = {
  CA: {
    name: 'California',
    citation: 'Cal. Prob. Code 4121-4124, 4264',
    upoaa: false,
    notary: 'either',
    witnesses: 2,
    notaryCountsAsWitness: false,
    springing: 'allowed',
    durability: 'express',
    initials: false,
    agentSignature: 'none',
    notice: true
  },
  NY: {
    name: 'New York',
    citation: 'N.Y. Gen. Oblig. Law 5-1501B',
    upoaa: false,
    notary: 'required',
    witnesses: 2,
    notaryCountsAsWitness: true,
    springing: 'allowed',
    durability: 'default',
    initials: false,
    agentSignature: 'effectiveness',
    notice: true
  },
  TX: {
    name: 'Texas',
    citation: 'Tex. Est. Code ch. 751, 752',
    upoaa: false,
    notary: 'required',
    witnesses: 0,
    notaryCountsAsWitness: false,
    springing: 'allowed',
    durability: 'express',
    initials: false,
    agentSignature: 'none',
    notice: false
  },
  FL: {
    name: 'Florida',
    citation: 'Fla. Stat. 709.2105, 709.2108, 709.2202',
    upoaa: false,
    notary: 'required',
    witnesses: 2,
    notaryCountsAsWitness: false,
    springing: 'prohibited',
    durability: 'default',
    initials: true,
    agentSignature: 'none',
    notice: false
  },
  IL: {
    name: 'Illinois',
    citation: '755 ILCS 45/3-3, 3-3.6',
    upoaa: false,
    notary: 'required',
    witnesses: 1,
    notaryCountsAsWitness: false,
    springing: 'allowed',
    durability: 'default',
    initials: false,
    agentSignature: 'none',
    notice: false
  },
  PA: {
    name: 'Pennsylvania',
    citation: '20 Pa.C.S. 5601 (Act 95 of 2014)',
    upoaa: false,
    notary: 'required',
    witnesses: 2,
    notaryCountsAsWitness: false,
    springing: 'allowed',
    durability: 'default',
    initials: false,
    agentSignature: 'before-acting',
    notice: true
  },
  OH: {
    name: 'Ohio',
    citation: 'Ohio R.C. 1337.21-1337.64; 5301.01',
    upoaa: true,
    notary: 'recommended',
    witnesses: 0,
    notaryCountsAsWitness: false,
    springing: 'allowed',
    durability: 'default',
    initials: false,
    agentSignature: 'none',
    notice: false
  },
  WA: {
    name: 'Washington',
    citation: 'RCW 11.125.050, 11.125.090',
    upoaa: true,
    notary: 'required',
    witnesses: 0,
    notaryCountsAsWitness: false,
    springing: 'allowed',
    durability: 'default',
    initials: false,
    agentSignature: 'none',
    notice: false
  }
};

export function ruleFor(d: PowerOfAttorney): StateRule {
  const code = String((d.principal && d.principal.state) || '').toUpperCase();
  return STATE_RULES[code] || DEFAULT_RULE;
}

export function stateUnknown(d: PowerOfAttorney): boolean {
  const code = String((d.principal && d.principal.state) || '').toUpperCase();
  return !STATE_RULES[code];
}

export function effectiveWitnesses(d: PowerOfAttorney) {
  const r = ruleFor(d);
  const own = typeof d.execution.witnessCount === 'number' ? d.execution.witnessCount : 0;
  return own + (r.notaryCountsAsWitness && d.execution.notaryArranged === 'yes' ? 1 : 0);
}

export function notaryDeficient(d: PowerOfAttorney) {
  if (d.execution.notaryArranged !== 'no') return false;
  const r = ruleFor(d);
  if (r.notary === 'required') return true;
  if (d.acceptance.usedForRealEstate === 'yes') return true;
  if (r.notary === 'either' && effectiveWitnesses(d) < r.witnesses) return true;
  return false;
}

export function witnessesShort(d: PowerOfAttorney) {
  const r = ruleFor(d);
  if (r.witnesses <= 0) return false;
  if (r.notary === 'either' && d.execution.notaryArranged === 'yes') return false;
  if (d.execution.witnessCount === null || d.execution.witnessCount === undefined) return false;
  return effectiveWitnesses(d) < r.witnesses;
}

export function witnessIsAgent(d: PowerOfAttorney) {
  const r = ruleFor(d);
  if (d.execution.witnessIsAgent !== 'yes') return false;
  if (r.notary === 'either' && d.execution.notaryArranged === 'yes') return false;
  return (
    r.witnesses > 0 ||
    (typeof d.execution.witnessCount === 'number' && d.execution.witnessCount > 0)
  );
}

export function springingBanned(d: PowerOfAttorney) {
  return d.instrument.effectiveness === 'springing' && ruleFor(d).springing === 'prohibited';
}

export function notDurable(d: PowerOfAttorney) {
  return d.instrument.durableStatement === 'no';
}

export function capacityMissing(d: PowerOfAttorney) {
  return d.principal.capacityConfirmed === 'no';
}

export function anyHotGranted(d: PowerOfAttorney) {
  return HOT_FIELDS.some((f) => d.authority[f] === 'yes');
}

export function hotNotInitialed(d: PowerOfAttorney) {
  return ruleFor(d).initials && anyHotGranted(d) && d.authority.hotPowersInitialed === 'no';
}

export function agentIneligible(d: PowerOfAttorney) {
  return d.agents.agentIsAdult === 'no';
}

export function agentSignatureMissing(d: PowerOfAttorney) {
  return ruleFor(d).agentSignature !== 'none' && d.agents.agentSignedAcknowledgment === 'no';
}

export function agentSignatureBlocking(d: PowerOfAttorney) {
  return (
    ruleFor(d).agentSignature === 'effectiveness' && d.agents.agentSignedAcknowledgment === 'no'
  );
}

export function realEstateNotRecordable(d: PowerOfAttorney) {
  return d.acceptance.usedForRealEstate === 'yes' && d.execution.notaryArranged === 'no';
}

export function anyGrant(d: PowerOfAttorney) {
  return GRANT_FIELDS.some((f) => d.authority[f] === 'yes');
}

export function executionRiskRules(d: PowerOfAttorney) {
  const rules: FiredRule[] = [];
  const r = ruleFor(d);
  if (notaryDeficient(d))
    rules.push({
      ruleId: 'R-NOTARY-MISSING-01',
      dimension: 'execution',
      category: 'notarization',
      description: `No notary acknowledgment is arranged but ${r.name} (${r.citation}) or the planned use requires one.`
    });
  if (witnessesShort(d))
    rules.push({
      ruleId: 'R-WITNESSES-SHORT-01',
      dimension: 'execution',
      category: 'witnesses',
      description: `${effectiveWitnesses(d)} witness(es) counted; ${r.name} requires ${r.witnesses}.`
    });
  if (witnessIsAgent(d))
    rules.push({
      ruleId: 'R-WITNESS-IS-AGENT-01',
      dimension: 'execution',
      category: 'witnesses',
      description: 'A witness is an agent or successor agent, which disqualifies the witness.'
    });
  if (springingBanned(d))
    rules.push({
      ruleId: 'R-SPRINGING-BANNED-01',
      dimension: 'effectiveness',
      category: 'springing',
      description: `${r.name} makes a springing power of attorney ineffective (${r.citation}).`
    });
  if (notDurable(d))
    rules.push({
      ruleId: 'R-NOT-DURABLE-01',
      dimension: 'effectiveness',
      category: 'durability',
      description: "The instrument is not durable: it would end on the principal's incapacity."
    });
  if (capacityMissing(d))
    rules.push({
      ruleId: 'R-CAPACITY-01',
      dimension: 'execution',
      category: 'capacity',
      description: "The principal's capacity to sign is not confirmed."
    });
  if (hotNotInitialed(d))
    rules.push({
      ruleId: 'R-HOT-INITIALS-01',
      dimension: 'authority',
      category: 'hot-powers',
      description: `${r.name} requires the principal's signature or initials beside each hot power.`
    });
  if (agentIneligible(d))
    rules.push({
      ruleId: 'R-AGENT-INELIGIBLE-01',
      dimension: 'agent',
      category: 'eligibility',
      description: 'The agent is not an adult individual or a qualifying institution.'
    });
  if (agentSignatureBlocking(d))
    rules.push({
      ruleId: 'R-AGENT-SIGNATURE-01',
      dimension: 'agent',
      category: 'agent-signature',
      description: `${r.name} makes the power effective only once the agent's signature is acknowledged.`
    });
  return rules;
}

export function incompleteRules(d: PowerOfAttorney) {
  const rules: FiredRule[] = [];
  const miss = (id: string, category: string, description: string) =>
    rules.push({ ruleId: id, dimension: 'completeness', category, description });
  if (!nonEmpty(d.principal.principalName))
    miss('R-INC-PRINCIPAL-01', 'principal', 'The principal is not named.');
  if (!nonEmpty(d.principal.state))
    miss('R-INC-STATE-01', 'jurisdiction', 'The governing state is not chosen.');
  if (!nonEmpty(d.agents.agentName)) miss('R-INC-AGENT-01', 'agent', 'No agent is named.');
  if (!nonEmpty(d.instrument.effectiveness))
    miss('R-INC-EFFECT-01', 'effectiveness', 'Immediate or springing effectiveness is not chosen.');
  if (d.instrument.effectiveness === 'springing' && !nonEmpty(d.instrument.springingTrigger))
    miss(
      'R-INC-TRIGGER-01',
      'effectiveness',
      'A springing power needs a named determination of the event.'
    );
  if (!nonEmpty(d.instrument.durableStatement))
    miss('R-INC-DURABLE-01', 'effectiveness', 'Durability is not answered.');
  if (!nonEmpty(d.principal.capacityConfirmed))
    miss('R-INC-CAPACITY-01', 'capacity', 'Capacity is not answered.');
  if (!nonEmpty(d.execution.notaryArranged))
    miss('R-INC-NOTARY-01', 'execution', 'The notary plan is not answered.');
  if (!anyGrant(d)) miss('R-INC-GRANTS-01', 'authority', 'No general authority is granted.');
  return rules;
}
