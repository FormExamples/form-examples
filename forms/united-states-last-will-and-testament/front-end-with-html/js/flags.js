import {
  electiveShareAmount, electiveShareExposure, federalEstateTaxExposure, interestedWitnessOutcome,
  interestedWitnesses, missingItems, nonEmpty, residuaryEntered, residuaryMismatch,
  residuaryPercentTotal, selfProved, specificExceedsEstate, stateRuleFor, stateTaxExposure,
  testatorAge, underage, unknownState, witnessCount, MIN_AGE
} from './rules.js';

// Flagged-issue detection for a United States will. Independent of the validity
// class (which the grader derives from these flags), this module raises
// drafter-facing flags per spec §5:
//
//   HIGH   - formality or drafting defects that put validity or the plan at risk:
//            under-age or no sound mind, possible undue influence, not signed at
//            the end, too few witnesses, witnesses did not see the signing,
//            holographic or electronic form not allowed in the state, a
//            holographic will not in the testator's handwriting, an interested
//            witness whose gift would fail, residuary shares not summing to 100,
//            specific bequests above the estate.
//   MEDIUM - capacity doubt, spousal elective-share exposure, pretermitted
//            child, no guardian for minors, no residuary clause, prior wills not
//            revoked, estate-tax exposure, self-proving gap, unknown state, and
//            missing required answers (incomplete).
//   LOW    - notes: community property, no-contest enforceability, digital
//            assets, successor representative, safekeeping, contingent
//            beneficiary, interested-witness note where the gift stays valid.
//
// Rows mirror the `united_states_last_will_and_testament_grade_flag` SQL table
// (flag_id, category, priority, description, suggested_action). NOTHING here is
// legal advice; the probate court decides whether a will is valid.

/**
 * @typedef {import('./types.js').Will} Will
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

const money = (n) => '$' + Math.round(n).toLocaleString('en-US');

/**
 * @param {Will} w
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(w) {
  /** @type {FlaggedIssue[]} */
  const flags = [];
  const add = (id, category, priority, description, suggestedAction) =>
    flags.push({ id, category, priority, description, suggestedAction });
  const { rule, known } = stateRuleFor(w.testator.state);
  const form = w.execution.executionForm;
  const stateName = known ? rule.name : 'this state';

  // ─── Capacity (HIGH / MEDIUM) ───────────────────────────────
  if (underage(w)) {
    add('F-WILL-001', 'capacity', 'high',
      `The testator is ${testatorAge(w)} on the execution date; a will requires a testator aged ${MIN_AGE} or older (UPC 2-501).`,
      'Do not sign. A person under 18 generally cannot make a valid will; seek advice on intestacy or wait until the testator is 18.');
  }
  if (w.testator.soundMind === 'no') {
    add('F-WILL-002', 'capacity', 'high',
      'The testator is not confirmed to be of sound mind. Testamentary capacity is required when the will is signed.',
      'Do not proceed to signing. Obtain a contemporaneous capacity assessment and legal advice first.');
  } else if (w.testator.soundMind === 'uncertain') {
    add('F-WILL-015', 'capacity', 'medium',
      'Testamentary capacity is uncertain. A later contest may challenge capacity.',
      'Record a physician or attorney capacity note near the signing date and consider videotaping the ceremony only on advice of counsel.');
  }
  if (w.testator.undueInfluenceConcern === 'possible') {
    add('F-WILL-003', 'capacity', 'high',
      'There is a possible undue-influence concern, for example a beneficiary who arranged the will. Undue influence can void a will or the affected gifts.',
      'Meet the testator alone, document independent advice, and keep beneficiaries out of the signing room.');
  }

  // ─── Execution formality (HIGH) ─────────────────────────────
  if (w.execution.signedAtEnd === 'no') {
    add('F-WILL-004', 'execution-formality', 'high',
      'The will is not signed by the testator at the end. A signature is the core formality of every will.',
      'Have the testator sign and date at the end of the will, after the last provision, with no text after the signature.');
  }
  if (form === 'holographic' && !rule.holographicAllowed) {
    add('F-WILL-008', 'execution-formality', 'high',
      `${stateName} does not recognize a holographic (handwritten, unwitnessed) will, so an unwitnessed handwritten will would likely fail.`,
      'Execute the will as a witnessed will, with two witnesses, instead of relying on a holographic will.');
  }
  if (form === 'holographic' && w.execution.holographicEntirelyHandwritten === 'no') {
    add('F-WILL-009', 'execution-formality', 'high',
      'The signature and material provisions of a holographic will must be in the testator\'s own handwriting. The draft is not entirely handwritten.',
      'Rewrite the dispositive provisions in the testator\'s handwriting, or execute a witnessed will.');
  }
  if (form === 'electronic' && !rule.electronicAllowed) {
    add('F-WILL-010', 'execution-formality', 'high',
      `${stateName} is not recorded here as accepting a fully electronic will. An electronic will may fail where no statute allows it.`,
      'Print and sign the will with ink and live witnesses, or confirm the state\'s current electronic-will statute.');
  }
  if (form === 'witnessed' || form === 'electronic') {
    if (w.execution.signedInWitnessPresence === 'no') {
      add('F-WILL-006', 'execution-formality', 'high',
        'The testator did not sign, or acknowledge the signature, in front of the witnesses. Witnesses must see the signing or hear the testator acknowledge it.',
        'Repeat the signing ceremony with both witnesses present and watching, or have the testator acknowledge the signature to both.');
    }
    if (w.execution.witnessesSignedInTestatorPresence === 'no') {
      add('F-WILL-007', 'execution-formality', rule.witnessPresenceRequired ? 'high' : 'medium',
        rule.witnessPresenceRequired
          ? `${stateName} requires the witnesses to sign in the testator's presence, and they did not.`
          : `The witnesses did not sign in the testator's presence. ${stateName} may not require it, but it is the safest practice.`,
        'Have each witness sign in the testator\'s presence, ideally in each other\'s presence too.');
    }
    const count = witnessCount(w);
    if (count > 0 && count < rule.witnessesRequired) {
      add('F-WILL-005', 'witness', 'high',
        `Only ${count} witness${count === 1 ? ' is' : 'es are'} named; ${stateName} needs ${rule.witnessesRequired} (UPC 2-502).`,
        'Add the missing disinterested adult witness before signing.');
    }
  }

  // ─── Interested witnesses ───────────────────────────────────
  const outcome = interestedWitnessOutcome(w);
  if (outcome !== '') {
    const names = interestedWitnesses(w).map((x) => x.name.trim()).join(', ');
    if (outcome === 'void') {
      add('F-WILL-011', 'witness', 'high',
        `A witness who also takes under the will (${names}) puts that gift at risk in ${stateName}: the gift is void unless enough disinterested witnesses also signed, and the witness may keep only the intestate share.`,
        'Use witnesses who take nothing under the will, or add supernumerary disinterested witnesses.');
    } else if (outcome === 'presumption') {
      add('F-WILL-011', 'witness', 'medium',
        `A witness who also takes under the will (${names}) raises a rebuttable presumption of duress or undue influence in ${stateName} unless two other disinterested witnesses signed.`,
        'Use two disinterested witnesses, or add two further disinterested witnesses.');
    } else {
      add('F-WILL-011', 'witness', 'low',
        `A witness (${names}) also takes under the will. ${stateName} still treats the will and the gift as valid, but a challenger may press undue influence.`,
        'Prefer disinterested witnesses anyway to remove the argument.');
    }
  }

  // ─── Bequests (HIGH / MEDIUM / LOW) ─────────────────────────
  if (residuaryMismatch(w)) {
    add('F-WILL-012', 'bequest-arithmetic', 'high',
      `The residuary shares add up to ${residuaryPercentTotal(w)}%, not 100%. The remainder or the excess would be uncertain and may pass by intestacy.`,
      'Adjust the residuary percentages so they total exactly 100%.');
  }
  if (specificExceedsEstate(w)) {
    add('F-WILL-013', 'bequest-arithmetic', 'high',
      `The specific bequests (${money(w.estate.specificBequestsTotal)}) exceed the estimated estate (${money(w.estate.estimatedEstateValue)}), so the gifts will abate and nothing is left for the residuary.`,
      'Reduce the specific bequests or restate them as percentages so the plan matches the estate.');
  }
  if (w.estate.residuaryClausePresent === 'no' && !residuaryEntered(w)) {
    add('F-WILL-014', 'bequest-arithmetic', 'medium',
      'There is no residuary clause, so anything not specifically given passes by intestacy (partial intestacy).',
      'Add a residuary clause naming who takes everything not otherwise given, plus a contingent taker.');
  }
  if (nonEmpty(w.estate.residuaryClausePresent) && w.estate.contingentBeneficiaryNamed === 'no') {
    add('F-WILL-033', 'bequest-arithmetic', 'low',
      'No contingent (backup) beneficiary is named, so a gift to someone who dies first may lapse or fall to an anti-lapse statute.',
      'Name a contingent beneficiary for the residuary and for each main gift.');
  }

  // ─── Family and spousal protection ──────────────────────────
  if (electiveShareExposure(w)) {
    const amount = electiveShareAmount(w);
    add('F-WILL-016', 'spousal-protection', 'medium',
      `The spouse is left ${money(w.family.spouseInheritanceValue)}, below an estimated elective share of about ${money(amount)} in ${stateName}. The spouse may elect against the will.`,
      'Increase the spouse\'s gift, document a written waiver, or plan for the elective share.');
  }
  if (w.testator.maritalStatus === 'married' && rule.communityProperty) {
    add('F-WILL-017', 'spousal-protection', 'low',
      `${stateName} is a community property state: the surviving spouse already owns half of community property, and the will can dispose of only the testator's half plus separate property.`,
      'Classify assets as community or separate before allocating them in the will.');
  }
  if (w.family.disinheritsChild === 'yes' && w.family.disinheritedChildNamed !== 'yes') {
    add('F-WILL-018', 'spousal-protection', 'medium',
      'A child is left out without being named. An unnamed omitted child may claim a pretermitted-heir share.',
      'Name the omitted child and state the intent to leave them nothing.');
  }
  if (w.family.hasMinorChildren === 'yes' && !nonEmpty(w.family.guardianForMinorsName)) {
    add('F-WILL-019', 'fiduciary', 'medium',
      'The testator has minor children but names no guardian for them. The court will choose one.',
      'Nominate a guardian and an alternate for the minor children.');
  }

  // ─── Fiduciaries and clauses ────────────────────────────────
  if (nonEmpty(w.provisions.personalRepresentativeName) && !nonEmpty(w.provisions.successorPersonalRepresentativeName)) {
    add('F-WILL-031', 'fiduciary', 'low',
      'No successor personal representative is named. If the first choice cannot serve, the court appoints someone.',
      'Name at least one successor personal representative.');
  }
  if (w.provisions.revokesPriorWillsClause === 'no') {
    add('F-WILL-023', 'other', 'medium',
      'The will does not revoke earlier wills and codicils, so conflicting older documents may still apply.',
      'Add an express clause revoking all prior wills and codicils.');
  }
  if (w.provisions.noContestClause === 'yes' && rule.noContest === 'unenforceable') {
    add('F-WILL-030', 'state-rule', 'low',
      `A no-contest clause is not enforceable in ${stateName}, so it adds no deterrent.`,
      'Rely on other measures, such as a trust or clear explanation of the plan.');
  } else if (w.provisions.noContestClause === 'yes' && rule.noContest === 'limited') {
    add('F-WILL-030', 'state-rule', 'low',
      `${stateName} enforces a no-contest clause only in limited cases (for example a direct contest without probable cause).`,
      'Confirm the clause fits the statute\'s narrow categories before relying on it.');
  }
  if (w.provisions.digitalAssetsClause !== 'yes') {
    add('F-WILL-029', 'digital-assets', 'low',
      'No digital-assets clause. Under the Revised Uniform Fiduciary Access to Digital Assets Act a representative may get only a catalogue of electronic communications unless the will allows more.',
      'Add a clause authorizing the representative to access digital assets and the content of electronic communications.');
  }
  if (!nonEmpty(w.provisions.originalWillLocation)) {
    add('F-WILL-032', 'other', 'low',
      'No safekeeping location is recorded for the signed original. A lost original may be presumed revoked.',
      'Record where the original is kept and tell the personal representative.');
  }

  // ─── Self-proving affidavit ─────────────────────────────────
  if (form !== 'holographic' && rule.selfProvingRecognized) {
    if (w.selfProving.selfProvingAffidavit === 'yes' && !selfProved(w)) {
      add('F-WILL-020', 'self-proving', 'medium',
        'A self-proving affidavit is planned but the notary details are incomplete, so the will is not yet self-proved and the witnesses may have to testify.',
        'Complete the affidavit before a notary and record the notary name and acknowledgment.');
    } else if (w.selfProving.selfProvingAffidavit !== 'yes') {
      add('F-WILL-021', 'self-proving', 'low',
        'The will is not self-proved. The court may need the witnesses to testify, which is hard when they cannot be found.',
        'Add a self-proving affidavit signed by the testator and witnesses before a notary.');
    }
  } else if (form !== 'holographic' && !rule.selfProvingRecognized && w.selfProving.selfProvingAffidavit === 'yes') {
    add('F-WILL-021', 'self-proving', 'low',
      `${stateName} does not use a self-proving affidavit, so it does not add proof there.`,
      'Keep the attestation clause and the witness details current instead.');
  }

  // ─── State rule and estate tax ──────────────────────────────
  if (unknownState(w)) {
    add('F-WILL-022', 'state-rule', 'medium',
      `The state ${w.testator.state.trim().toUpperCase()} is not in this tool's rule table, so the Uniform Probate Code default was used. State law may differ.`,
      'Verify the state\'s will formalities, witness rules and elective share with a local attorney.');
  }
  if (federalEstateTaxExposure(w)) {
    add('F-WILL-024', 'estate-tax', 'medium',
      `The estimated estate (${money(w.estate.estimatedEstateValue)}) is above the 2026 federal basic exclusion of $15,000,000, so federal estate tax may apply.`,
      w.provisions.estateTaxReviewed === 'yes'
        ? 'Keep the tax adviser\'s review with the file and revisit it when values change.'
        : 'Have a tax adviser review marital and charitable deductions, portability, and trusts.');
  }
  if (stateTaxExposure(w)) {
    const tax = rule.stateEstateTax;
    add('F-WILL-025', 'estate-tax', tax.kind === 'inheritance' ? 'low' : 'medium',
      tax.kind === 'inheritance'
        ? `${stateName} charges an inheritance tax on transfers to many heirs, depending on the heir's relationship.`
        : `The estimated estate (${money(w.estate.estimatedEstateValue)}) is above the ${stateName} estate-tax exclusion of ${money(tax.exclusion)}.`,
      'Have a tax adviser estimate the state tax and consider planning to reduce it.');
  }

  // ─── Incomplete (required answers missing) ──────────────────
  const missing = missingItems(w);
  const groups = [
    { group: 'testator', id: 'F-WILL-026', label: 'testator details and capacity' },
    { group: 'estate', id: 'F-WILL-027', label: 'family, bequests and representative' },
    { group: 'execution', id: 'F-WILL-028', label: 'execution plan' }
  ];
  for (const g of groups) {
    const items = missing.filter((m) => m.group === g.group).map((m) => m.label);
    if (items.length > 0) {
      add(g.id, 'incomplete', 'medium',
        `Required ${g.label} answers are missing: ${items.join(', ')}.`,
        'Answer the missing items before the will is signed.');
    }
  }

  const order = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => order[a.priority] - order[b.priority]);
  return flags;
}

export { detectFlaggedIssues };
