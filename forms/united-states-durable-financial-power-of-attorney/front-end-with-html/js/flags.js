import { agentIneligible, agentSignatureMissing, anyHotGranted, capacityMissing, effectiveWitnesses, hotNotInitialed, notDurable, notaryDeficient, nonEmpty, realEstateNotRecordable, ruleFor, springingBanned, stateUnknown, witnessIsAgent, witnessesShort, HOT_FIELDS } from './rules.js';

// Flagged-issue detection (execution formalities, authority scope, gifting,
// agent, acceptance, tax representation, jurisdiction). Independent of the
// validity class (which the grader produces), this module raises principal-,
// drafter-, and notary-facing flags per spec section 5. Rows mirror the
// `united_states_durable_financial_power_of_attorney_grade_flag` SQL table
// (flag_id, category, priority, description, suggested_action).
//
// NOTHING here decides legal validity. Documentation support, not legal advice.

/**
 * @typedef {import('./types.js').PowerOfAttorney} PowerOfAttorney
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

/**
 * @param {PowerOfAttorney} d
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(d) {
  /** @type {FlaggedIssue[]} */
  const flags = [];
  const r = ruleFor(d);

  if (notaryDeficient(d)) {
    flags.push({
      id: 'F-NOTARIZATION-REQUIRED-001',
      category: 'execution-formality',
      priority: 'high',
      description: `No notary acknowledgment is arranged, but ${r.name} (${r.citation}) or the planned use requires an acknowledged signature.`,
      suggestedAction: 'Have the principal sign before a notary public who completes an acknowledgment certificate.'
    });
  }

  if (witnessesShort(d)) {
    flags.push({
      id: 'F-WITNESSES-SHORT-001',
      category: 'execution-formality',
      priority: 'high',
      description: `${effectiveWitnesses(d)} qualifying witness(es) counted; ${r.name} (${r.citation}) requires ${r.witnesses}.`,
      suggestedAction: `Arrange ${r.witnesses} adult, disinterested witnesses to sign in the principal's presence.`
    });
  }

  if (witnessIsAgent(d)) {
    flags.push({
      id: 'F-WITNESS-IS-AGENT-001',
      category: 'execution-formality',
      priority: 'high',
      description: 'A witness is an agent or successor agent. An agent cannot witness the principal\'s signature.',
      suggestedAction: 'Replace the witness with an adult who is not named in the instrument.'
    });
  }

  if (springingBanned(d)) {
    flags.push({
      id: 'F-SPRINGING-PROHIBITED-001',
      category: 'effectiveness',
      priority: 'high',
      description: `${r.name} makes a power of attorney that takes effect on a future date or event ineffective (${r.citation}).`,
      suggestedAction: 'Make the power effective on signing, and keep the signed original in trust until needed.'
    });
  }

  if (notDurable(d)) {
    flags.push({
      id: 'F-DURABILITY-LANGUAGE-001',
      category: 'effectiveness',
      priority: 'high',
      description: 'The instrument is not durable, so the agent\'s authority would end when the principal loses capacity, which is the situation a durable power of attorney exists for.',
      suggestedAction: 'Add language that the authority is not affected by the principal\'s later incapacity.'
    });
  }

  if (capacityMissing(d)) {
    flags.push({
      id: 'F-CAPACITY-NOT-CONFIRMED-001',
      category: 'execution-formality',
      priority: 'high',
      description: 'The principal\'s capacity to understand and sign the document is not confirmed. A document signed without capacity can be voided.',
      suggestedAction: 'Obtain a capacity assessment or physician letter before signing, and have an attorney supervise.'
    });
  }

  if (hotNotInitialed(d)) {
    flags.push({
      id: 'F-HOT-POWERS-NOT-INITIALED-001',
      category: 'authority-scope',
      priority: 'high',
      description: `${r.name} (${r.citation}) allows each hot power only if the principal signs or initials next to it, and the initials are not planned.`,
      suggestedAction: 'Have the principal initial beside each enumerated hot power in the instrument.'
    });
  }

  if (agentIneligible(d)) {
    flags.push({
      id: 'F-AGENT-NOT-ELIGIBLE-001',
      category: 'agent',
      priority: 'high',
      description: 'The named agent is not an adult individual or a financial institution with trust powers.',
      suggestedAction: 'Name an agent who is at least 18, or a qualifying institution.'
    });
  }

  if (agentSignatureMissing(d)) {
    const blocking = r.agentSignature === 'effectiveness';
    flags.push({
      id: 'F-AGENT-SIGNATURE-REQUIRED-001',
      category: 'agent',
      priority: blocking ? 'high' : 'medium',
      description: blocking
        ? `${r.name} makes the power effective only after the agent signs and the signature is acknowledged.`
        : `${r.name} requires the agent to sign an acknowledgment of the agent's duties before acting.`,
      suggestedAction: 'Have the agent sign the acknowledgment (before the notary where required) before the power is used.'
    });
  }

  if (realEstateNotRecordable(d)) {
    flags.push({
      id: 'F-REAL-ESTATE-NOT-RECORDABLE-001',
      category: 'acceptance',
      priority: 'high',
      description: 'The instrument will be used for real estate but no acknowledgment is planned. County recorders accept only acknowledged instruments.',
      suggestedAction: 'Acknowledge the signature before a notary and attach the legal description when recording.'
    });
  }

  if (d.authority.hotGift === 'yes' && d.authority.giftLimitType === 'unlimited') {
    flags.push({
      id: 'F-GIFT-AUTHORITY-UNLIMITED-001',
      category: 'gifting',
      priority: 'medium',
      description: 'The agent may make unlimited gifts. Unlimited gifting is the most abused hot power and can defeat the principal\'s care and Medicaid planning.',
      suggestedAction: 'Cap gifts at the federal annual exclusion or a stated amount, and name permitted recipients.'
    });
  }

  if (d.authority.hotGift === 'yes' && (d.authority.giftLimitType === 'none' || d.authority.giftLimitType === '')) {
    flags.push({
      id: 'F-GIFT-LIMIT-UNDEFINED-001',
      category: 'gifting',
      priority: 'medium',
      description: 'Gift authority is granted without a stated limit. Under the Uniform Act the default limit is the federal gift-tax annual exclusion, which is often not what the principal intends.',
      suggestedAction: 'State the gift limit explicitly: annual exclusion, a fixed amount, or none.'
    });
  }

  if (d.authority.selfGiftingAllowed === 'yes') {
    flags.push({
      id: 'F-SELF-GIFTING-001',
      category: 'gifting',
      priority: 'medium',
      description: 'The agent is allowed to make gifts to the agent. Self-gifting is a conflict of interest and needs clear, specific limits.',
      suggestedAction: 'Restrict self-gifting to a stated amount or to the principal\'s documented wishes, or remove it.'
    });
  }

  if (d.instrument.effectiveness === 'springing' && !nonEmpty(d.instrument.springingTrigger)) {
    flags.push({
      id: 'F-SPRINGING-NO-DETERMINER-001',
      category: 'effectiveness',
      priority: 'medium',
      description: 'A springing power is chosen but nobody is designated to determine that the event has happened, so banks may refuse to accept it.',
      suggestedAction: 'Name who determines incapacity (one or two physicians, a named person, or a court).'
    });
  }

  if (!nonEmpty(d.agents.successorAgentName)) {
    flags.push({
      id: 'F-NO-SUCCESSOR-AGENT-001',
      category: 'agent',
      priority: 'medium',
      description: 'No successor agent is named. If the agent dies, resigns, or becomes incapacitated, the power may end and a court-supervised conservatorship may be needed.',
      suggestedAction: 'Name at least one successor agent.'
    });
  }

  if (d.authority.grantTaxMatters === 'yes' && d.acceptance.form2848Status !== 'filed' && d.acceptance.form2848Status !== 'not-needed') {
    flags.push({
      id: 'F-IRS-FORM-2848-001',
      category: 'tax-representation',
      priority: 'medium',
      description: 'A durable power of attorney does not by itself authorize someone to represent the principal before the IRS. The IRS accepts a state power of attorney only with the details and declaration required of Form 2848.',
      suggestedAction: 'Complete IRS Form 2848 for the named representative, or attach the durable power with the required declaration.'
    });
  }

  if (r.notice && d.instrument.statutoryNoticeIncluded === 'no') {
    flags.push({
      id: 'F-STATUTORY-NOTICE-MISSING-001',
      category: 'execution-formality',
      priority: 'medium',
      description: `${r.name} (${r.citation}) calls for statutory warning or notice text for the principal and agent, which is not included.`,
      suggestedAction: 'Add the statutory notice to the principal and the information for the agent.'
    });
  }

  if (stateUnknown(d)) {
    flags.push({
      id: 'F-STATE-RULE-VERIFY-001',
      category: 'jurisdiction',
      priority: 'medium',
      description: 'The state is blank or not in this tool\'s rule table, so the uniform default was applied. Execution formalities vary by state.',
      suggestedAction: 'Verify the notary, witness, and form rules of the governing state against its current statute.'
    });
  }

  if (d.acceptance.bankFormCompleted === 'no') {
    flags.push({
      id: 'F-BANK-ACCEPTANCE-001',
      category: 'acceptance',
      priority: 'low',
      description: 'The financial institution\'s own power-of-attorney form is not completed. Many institutions insist on it even though the Uniform Act obliges acceptance of an acknowledged power within seven business days or a stated request for certification.',
      suggestedAction: 'Ask the bank for its form and a pre-approval of the signed instrument.'
    });
  }

  if (!nonEmpty(d.agents.compensation)) {
    flags.push({
      id: 'F-COMPENSATION-UNDEFINED-001',
      category: 'agent',
      priority: 'low',
      description: 'Agent compensation is not stated. Under the Uniform Act an agent is entitled to reasonable compensation unless the instrument says otherwise.',
      suggestedAction: 'State whether the agent is paid, and how.'
    });
  }

  if (!nonEmpty(d.agents.coAgentsMode)) {
    flags.push({
      id: 'F-CO-AGENTS-UNDEFINED-001',
      category: 'agent',
      priority: 'low',
      description: 'It is not stated whether one agent or several co-agents act, or whether co-agents act jointly or independently.',
      suggestedAction: 'State sole agent, or whether co-agents act jointly or independently.'
    });
  }

  if (!anyHotGranted(d) && HOT_FIELDS.every((f) => d.authority[f] !== '' )) {
    flags.push({
      id: 'F-HOT-POWER-DEFAULT-DENY-001',
      category: 'authority-scope',
      priority: 'low',
      description: 'No hot power is granted, so the agent cannot make gifts, create or change trusts, change beneficiaries, or create survivorship rights.',
      suggestedAction: 'Confirm this is intended; grant a specific hot power expressly if the principal needs it.'
    });
  }

  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  return flags;
}

export { detectFlaggedIssues };
