// Declarative United States health care power of attorney (HCPOA) rules.
//
// This form is a DOCUMENTATION and EXECUTION-READINESS instrument, not a scored
// assessment and not legal advice. It checks whether a durable power of attorney
// for health care (also called a health care proxy, medical power of attorney,
// or health care surrogate designation) looks ready to sign, is missing required
// content, or carries an execution risk that could make it invalid. This module
// holds the primitive predicates the grader (`grader.js`) and flag detector
// (`flags.js`) compose (spec section 4):
//
//   - the STATE_RULES table (witness count, notary alternative, who cannot
//     witness, facility rules) for 8 verified states plus the uniform default,
//   - agent-eligibility predicates (age, provider / facility conflicts),
//   - witness-eligibility and execution-formality predicates,
//   - the list of required fields for completeness.
//
// The issuing authority, the courts, and the treating facility decide whether a
// directive is valid. Nothing here replaces advice from a licensed attorney.

/**
 * @typedef {import('./types.js').Directive} Directive
 */

const nonEmpty = (s) => typeof s === 'string' && s.trim() !== '';

/**
 * State execution rules. Each entry records only the rule values verified from
 * the cited statute (see doc/state-rules.md); anything not verified is left
 * out rather than guessed.
 *
 *   witnesses          number of witnesses the statute requires on a witnessed signing
 *   notaryAlternative  true when a notary acknowledgment may replace the witnesses
 *   relativeRule       'none' | 'one-unrelated' | 'all-unrelated' - relatives by blood,
 *                      marriage or adoption: no limit / at least one witness must be
 *                      unrelated / no witness may be related
 *   heirRule           same scale, for a person entitled to the principal's estate
 *   providerBar        'none' | 'one' | 'all' - the principal's health care provider or
 *                      facility staff cannot witness: nobody barred / at least one
 *                      witness must not be one / no witness may be one
 *   snfOmbudsman       a skilled-nursing-facility resident needs an ombudsman witness
 *   agentProviderBar   the principal's treating provider (or its employee) cannot be
 *                      the agent unless related to the principal
 *   cite               primary citation
 */
const STATE_RULES = {
  CA: { name: 'California', witnesses: 2, notaryAlternative: true, relativeRule: 'one-unrelated', heirRule: 'one-unrelated', providerBar: 'all', snfOmbudsman: true, agentProviderBar: true, cite: 'Cal. Prob. Code 4673, 4674, 4675, 4659' },
  NY: { name: 'New York', witnesses: 2, notaryAlternative: false, relativeRule: 'none', heirRule: 'none', providerBar: 'none', snfOmbudsman: false, agentProviderBar: true, cite: 'N.Y. Pub. Health Law 2981' },
  TX: { name: 'Texas', witnesses: 2, notaryAlternative: true, relativeRule: 'one-unrelated', heirRule: 'one-unrelated', providerBar: 'one', snfOmbudsman: false, agentProviderBar: true, cite: 'Tex. Health & Safety Code 166.003, 166.152, 166.154, 166.164' },
  FL: { name: 'Florida', witnesses: 2, notaryAlternative: false, relativeRule: 'one-unrelated', heirRule: 'none', providerBar: 'none', snfOmbudsman: false, agentProviderBar: false, cite: 'Fla. Stat. 765.202' },
  IL: { name: 'Illinois', witnesses: 1, notaryAlternative: false, relativeRule: 'all-unrelated', heirRule: 'none', providerBar: 'all', snfOmbudsman: false, agentProviderBar: false, cite: '755 ILCS 45/4-5.1, 4-10' },
  PA: { name: 'Pennsylvania', witnesses: 2, notaryAlternative: false, relativeRule: 'none', heirRule: 'none', providerBar: 'none', snfOmbudsman: false, agentProviderBar: false, cite: '20 Pa.C.S. 5452, 5460' },
  OH: { name: 'Ohio', witnesses: 2, notaryAlternative: true, relativeRule: 'all-unrelated', heirRule: 'none', providerBar: 'all', snfOmbudsman: false, agentProviderBar: false, cite: 'Ohio Rev. Code 1337.12' },
  WA: { name: 'Washington', witnesses: 2, notaryAlternative: true, relativeRule: 'all-unrelated', heirRule: 'none', providerBar: 'all', snfOmbudsman: false, agentProviderBar: false, cite: 'RCW 11.125.050' }
};

/**
 * Uniform / default rule for a state not in the table: the Uniform Health-Care
 * Decisions Act (1993) model, applied conservatively (two witnesses or a notary,
 * at least one unrelated witness, no provider witnesses). Using it raises the
 * "verify state rule" flag.
 */
const DEFAULT_RULE = { name: 'Uniform default', witnesses: 2, notaryAlternative: true, relativeRule: 'one-unrelated', heirRule: 'none', providerBar: 'all', snfOmbudsman: false, agentProviderBar: true, cite: 'Uniform Health-Care Decisions Act (1993)' };

/** @param {Directive} d */
function stateCode(d) {
  return String(d.principal.state || '').trim().toUpperCase();
}

/** @param {Directive} d */
function isKnownState(d) {
  return Object.prototype.hasOwnProperty.call(STATE_RULES, stateCode(d));
}

/** @param {Directive} d */
function stateRule(d) {
  return isKnownState(d) ? STATE_RULES[stateCode(d)] : DEFAULT_RULE;
}

/** Whole years between an ISO birth date and an ISO reference date; null if either is unset. */
function ageOn(birthDate, refDate) {
  if (!nonEmpty(birthDate) || !nonEmpty(refDate)) return null;
  const b = birthDate.split('-').map(Number);
  const r = refDate.split('-').map(Number);
  if (b.length < 3 || r.length < 3 || b.some(Number.isNaN) || r.some(Number.isNaN)) return null;
  let age = r[0] - b[0];
  if (r[1] < b[1] || (r[1] === b[1] && r[2] < b[2])) age -= 1;
  return age;
}

/** @param {Directive} d */
function principalAge(d) {
  return ageOn(d.principal.birthDate, d.execution.signatureDate);
}

// ─── Principal predicates ──────────────────────────────────────

/** The principal was under 18 at signing. */
function principalMinor(d) {
  const a = principalAge(d);
  return a !== null && a < 18;
}

/** The signer states the principal lacked capacity or was not acting voluntarily. */
function capacityDenied(d) {
  return d.principal.capacityConfirmed === 'no' || d.principal.signedVoluntarily === 'no';
}

// ─── Agent predicates ──────────────────────────────────────────

/** Agent is under 18. */
function agentUnderAge(d) {
  return typeof d.agent.agentAge === 'number' && d.agent.agentAge < 18;
}

/** Agent is the principal's treating provider (or employee) and not related, where the state bars it. */
function agentProviderConflict(d) {
  return d.agent.agentIsHealthCareProvider === 'yes'
    && d.agent.agentRelatedToPrincipal !== 'yes'
    && stateRule(d).agentProviderBar;
}

/** Agent operates or works at the facility where the principal is a patient, not related. */
function agentFacilityConflict(d) {
  return d.agent.agentIsFacilityEmployee === 'yes'
    && d.agent.agentRelatedToPrincipal !== 'yes';
}

/** Any hard agent-eligibility problem. */
function agentIneligible(d) {
  return agentUnderAge(d) || agentProviderConflict(d) || agentFacilityConflict(d);
}

function hasAgent(d) { return nonEmpty(d.agent.agentName); }

function hasSuccessor(d) { return nonEmpty(d.agent.successor1Name) || nonEmpty(d.agent.successor2Name); }

function sameAgentAndSuccessor(d) {
  const a = String(d.agent.agentName || '').trim().toLowerCase();
  if (a === '') return false;
  return [d.agent.successor1Name, d.agent.successor2Name]
    .some((s) => String(s || '').trim().toLowerCase() === a);
}

// ─── Witness / execution predicates ────────────────────────────

/**
 * The witnesses entered, normalised: only a witness with a name counts as entered.
 * @param {Directive} d
 */
function witnessList(d) {
  const e = d.execution;
  return [1, 2]
    .map((n) => ({
      n,
      name: e[`witness${n}Name`],
      isRelative: e[`witness${n}IsRelative`] === 'yes',
      isHeir: e[`witness${n}IsHeir`] === 'yes',
      isAgent: e[`witness${n}IsAgent`] === 'yes',
      isProvider: e[`witness${n}IsProvider`] === 'yes'
    }))
    .filter((w) => nonEmpty(w.name));
}

/** Does this witness break an absolute bar in the principal's state? Returns reason strings. */
function witnessBars(d, w) {
  const rule = stateRule(d);
  const reasons = [];
  if (w.isAgent) reasons.push('is the named agent (an agent may not witness the appointment)');
  if (rule.providerBar === 'all' && w.isProvider) reasons.push('is the principal\'s health care provider or facility staff');
  if (rule.relativeRule === 'all-unrelated' && w.isRelative) reasons.push('is related to the principal by blood, marriage or adoption');
  if (rule.heirRule === 'all-unrelated' && w.isHeir) reasons.push('stands to inherit from the principal');
  return reasons;
}

/** Witnesses not barred outright. */
function countedWitnesses(d) {
  return witnessList(d).filter((w) => witnessBars(d, w).length === 0);
}

/** Witnesses that are fully disinterested for the state's one-unrelated rules. */
function qualifiedWitnesses(d) {
  const rule = stateRule(d);
  return countedWitnesses(d).filter((w) =>
    !(rule.relativeRule === 'one-unrelated' && w.isRelative)
    && !(rule.heirRule === 'one-unrelated' && w.isHeir)
    && !(rule.providerBar === 'one' && w.isProvider));
}

const usesWitnesses = (d) => ['two-witnesses', 'one-witness', 'witnesses-and-notary'].includes(d.execution.executionMethod);
const usesNotary = (d) => ['notary', 'witnesses-and-notary'].includes(d.execution.executionMethod);

/** Is the witnessed path valid on its own? */
function witnessPathOk(d) {
  const rule = stateRule(d);
  if (countedWitnesses(d).length < rule.witnesses) return false;
  const needsQualified = rule.relativeRule === 'one-unrelated' || rule.heirRule === 'one-unrelated' || rule.providerBar === 'one';
  return !needsQualified || qualifiedWitnesses(d).length >= 1;
}

/** Is the notarized path valid on its own? */
function notaryPathOk(d) {
  return stateRule(d).notaryAlternative && nonEmpty(d.execution.notaryName);
}

/**
 * Execution formality defects. Only evaluated once the signing method is chosen;
 * until then the form is simply incomplete. Each defect is { code, text }.
 * @param {Directive} d
 */
function executionDefects(d) {
  const e = d.execution;
  const rule = stateRule(d);
  const defects = [];
  if (!nonEmpty(e.executionMethod)) return defects;

  if (e.witnessesPresent === 'no') {
    defects.push({ code: 'witnesses-not-present', text: 'The principal did not sign, or acknowledge the signature, in the presence of the witnesses.' });
  }
  if (usesWitnesses(d) || e.executionMethod === 'notary') {
    for (const w of witnessList(d)) {
      for (const reason of witnessBars(d, w)) {
        defects.push({ code: w.isAgent && reason.includes('agent') ? 'witness-is-agent' : 'witness-barred', text: `Witness ${w.n} (${w.name}) ${reason}.` });
      }
    }
  }
  const witnessOk = witnessPathOk(d);
  const notaryOk = notaryPathOk(d);
  const method = e.executionMethod;
  let satisfied;
  if (method === 'notary') satisfied = notaryOk;
  else if (method === 'witnesses-and-notary') satisfied = witnessOk || notaryOk;
  else satisfied = witnessOk;

  if (!satisfied) {
    if (method === 'notary' && !rule.notaryAlternative) {
      defects.push({ code: 'notary-not-accepted', text: `${rule.name} does not accept a notary acknowledgment in place of witnesses (${rule.cite}).` });
    } else if (method === 'notary' && !nonEmpty(e.notaryName)) {
      defects.push({ code: 'notary-missing', text: 'Notary acknowledgment chosen but no notary is named.' });
    } else if (countedWitnesses(d).length < rule.witnesses) {
      defects.push({ code: 'witness-count', text: `${rule.name} needs ${rule.witnesses} qualified witness${rule.witnesses === 1 ? '' : 'es'}; only ${countedWitnesses(d).length} valid witness${countedWitnesses(d).length === 1 ? ' is' : 'es are'} recorded.` });
    } else {
      defects.push({ code: 'no-unrelated-witness', text: `${rule.name} requires at least one witness who is not a relative, an heir, or the principal's provider; none is recorded.` });
    }
  }
  if (rule.snfOmbudsman && e.principalInSkilledNursingFacility === 'yes' && e.ombudsmanSigned !== 'yes') {
    defects.push({ code: 'snf-ombudsman', text: 'A skilled-nursing-facility resident needs a patient advocate or ombudsman to sign as a witness (Cal. Prob. Code 4675).' });
  }
  return defects;
}

function hasExecutionDefect(d) {
  return executionDefects(d).length > 0;
}

// ─── Completeness ──────────────────────────────────────────────

/**
 * Required fields that are blank. Each is { field, label }.
 * @param {Directive} d
 */
function missingRequired(d) {
  const checks = [
    [nonEmpty(d.principal.principalName), 'principal name'],
    [nonEmpty(d.principal.birthDate), 'principal date of birth'],
    [nonEmpty(d.principal.state), 'state of residence'],
    [hasAgent(d), 'agent name'],
    [nonEmpty(d.authority.effectiveWhen), 'when the agent\'s authority begins'],
    [nonEmpty(d.execution.signatureDate), 'signature date'],
    [nonEmpty(d.execution.executionMethod), 'signing method (witnesses or notary)']
  ];
  return checks.filter(([ok]) => !ok).map(([, label]) => label);
}

export {
  STATE_RULES, DEFAULT_RULE, nonEmpty, stateCode, isKnownState, stateRule, ageOn, principalAge,
  principalMinor, capacityDenied, agentUnderAge, agentProviderConflict, agentFacilityConflict,
  agentIneligible, hasAgent, hasSuccessor, sameAgentAndSuccessor, witnessList, witnessBars,
  countedWitnesses, qualifiedWitnesses, usesWitnesses, usesNotary, witnessPathOk, notaryPathOk,
  executionDefects, hasExecutionDefect, missingRequired
};
