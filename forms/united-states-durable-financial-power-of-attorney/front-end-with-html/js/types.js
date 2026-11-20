// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the United States durable financial
// power of attorney (DPOA) form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_united_states_durable_financial_power_of_attorney.sql`.
// This file builds the canonical empty PowerOfAttorney shape used by the wizard
// (so newly-added fields default correctly when older saved state is
// rehydrated) and exports display helpers.
//
// This is an execution-READINESS instrument. Documentation support, not legal
// advice; the statute, the notary, and a court decide.

/**
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'immediate' | 'springing' | ''} Effectiveness
 * @typedef {'physician-certification' | 'named-person-declaration' | 'court-determination' | ''} SpringingTrigger
 * @typedef {'spouse' | 'child' | 'other-family' | 'friend' | 'professional' | 'financial-institution' | ''} AgentRelationship
 * @typedef {'sole' | 'jointly' | 'independently' | ''} CoAgentsMode
 * @typedef {'none' | 'reasonable' | 'fixed' | ''} Compensation
 * @typedef {'annual-exclusion' | 'fixed-amount' | 'unlimited' | 'none' | ''} GiftLimitType
 * @typedef {'yes' | 'no' | 'not-needed' | ''} BankFormStatus
 * @typedef {'filed' | 'not-filed' | 'not-needed' | ''} Form2848Status
 * @typedef {'ready-to-execute' | 'incomplete' | 'execution-risk'} ValidityClass
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * @typedef {Object} Principal
 * @property {string} principalName
 * @property {string | null} dateOfBirth      - ISO date; null when unset
 * @property {string} state                   - two-letter state code or ''
 * @property {string} principalAddress
 * @property {YesNo} capacityConfirmed
 */

/**
 * @typedef {Object} Instrument
 * @property {YesNo} durableStatement
 * @property {Effectiveness} effectiveness
 * @property {SpringingTrigger} springingTrigger
 * @property {YesNo} statutoryNoticeIncluded
 */

/**
 * @typedef {Object} Agents
 * @property {string} agentName
 * @property {AgentRelationship} agentRelationship
 * @property {YesNo} agentIsAdult
 * @property {YesNo} agentSignedAcknowledgment
 * @property {string} successorAgentName
 * @property {CoAgentsMode} coAgentsMode
 * @property {Compensation} compensation
 * @property {number | null} compensationAmount
 */

/**
 * @typedef {Object} Authority
 * @property {YesNo} grantBanking
 * @property {YesNo} grantRealEstate
 * @property {YesNo} grantInvestments
 * @property {YesNo} grantBusiness
 * @property {YesNo} grantInsurance
 * @property {YesNo} grantTaxMatters
 * @property {YesNo} grantBenefits
 * @property {YesNo} grantRetirement
 * @property {YesNo} grantClaims
 * @property {YesNo} grantPersonalProperty
 * @property {YesNo} hotCreateTrust
 * @property {YesNo} hotGift
 * @property {YesNo} hotSurvivorship
 * @property {YesNo} hotBeneficiary
 * @property {YesNo} hotDelegate
 * @property {YesNo} hotAnnuityWaiver
 * @property {YesNo} hotDisclaim
 * @property {YesNo} hotPowersInitialed
 * @property {GiftLimitType} giftLimitType
 * @property {number | null} giftLimitAmount
 * @property {YesNo} selfGiftingAllowed
 */

/**
 * @typedef {Object} Execution
 * @property {YesNo} notaryArranged
 * @property {number | null} witnessCount     - witnesses other than the notary
 * @property {YesNo} witnessIsAgent
 */

/**
 * @typedef {Object} Acceptance
 * @property {YesNo} usedForRealEstate
 * @property {BankFormStatus} bankFormCompleted
 * @property {Form2848Status} form2848Status
 */

/**
 * @typedef {Object} PowerOfAttorney
 * @property {Principal} principal
 * @property {Instrument} instrument
 * @property {Agents} agents
 * @property {Authority} authority
 * @property {Execution} execution
 * @property {Acceptance} acceptance
 */

/**
 * @typedef {Object} FlaggedIssue
 * @property {string} id
 * @property {string} category
 * @property {Priority} priority
 * @property {string} description
 * @property {string} suggestedAction
 */

/**
 * @typedef {Object} ValidationResult
 * @property {ValidityClass} validityClass
 * @property {string} governingState
 * @property {boolean} executionRiskIndicated
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

/**
 * Build a fresh, fully-blank instrument plan.
 * Text / enum fields default to `''`; numeric and date fields to `null`.
 * @returns {PowerOfAttorney}
 */
function emptyInstrument() {
  return {
    principal: { principalName: '', dateOfBirth: null, state: '', principalAddress: '', capacityConfirmed: '' },
    instrument: { durableStatement: '', effectiveness: '', springingTrigger: '', statutoryNoticeIncluded: '' },
    agents: { agentName: '', agentRelationship: '', agentIsAdult: '', agentSignedAcknowledgment: '', successorAgentName: '', coAgentsMode: '', compensation: '', compensationAmount: null },
    authority: {
      grantBanking: '',
      grantRealEstate: '',
      grantInvestments: '',
      grantBusiness: '',
      grantInsurance: '',
      grantTaxMatters: '',
      grantBenefits: '',
      grantRetirement: '',
      grantClaims: '',
      grantPersonalProperty: '',
      hotCreateTrust: '',
      hotGift: '',
      hotSurvivorship: '',
      hotBeneficiary: '',
      hotDelegate: '',
      hotAnnuityWaiver: '',
      hotDisclaim: '',
      hotPowersInitialed: '',
      giftLimitType: '',
      giftLimitAmount: null,
      selfGiftingAllowed: ''
    },
    execution: { notaryArranged: '', witnessCount: null, witnessIsAgent: '' },
    acceptance: { usedForRealEstate: '', bankFormCompleted: '', form2848Status: '' }
  };
}

const LABELS = {
  validity: { 'ready-to-execute': 'Ready to execute', 'incomplete': 'Incomplete', 'execution-risk': 'Execution risk' },
  relationship: { spouse: 'Spouse', child: 'Child', 'other-family': 'Other family member', friend: 'Friend', professional: 'Professional fiduciary', 'financial-institution': 'Financial institution with trust powers' },
  effectiveness: { immediate: 'Immediately on signing', springing: 'Springing, on a later event' },
  trigger: { 'physician-certification': 'Physician certification of incapacity', 'named-person-declaration': 'Declaration by a named person', 'court-determination': 'Court determination' },
  coAgents: { sole: 'Sole agent', jointly: 'Co-agents act jointly', independently: 'Co-agents act independently' },
  compensation: { none: 'No compensation', reasonable: 'Reasonable compensation', fixed: 'Fixed compensation' },
  giftLimit: { 'annual-exclusion': 'Federal annual exclusion per recipient', 'fixed-amount': 'Fixed amount per year', unlimited: 'Unlimited', none: 'No limit stated' },
  bank: { yes: 'Completed', no: 'Not completed', 'not-needed': 'Not needed' },
  form2848: { filed: 'Filed', 'not-filed': 'Not filed', 'not-needed': 'Not needed' },
  yesNo: { yes: 'Yes', no: 'No' },
  priority: { high: 'HIGH', medium: 'MEDIUM', low: 'LOW' }
};

const pick = (table) => (value) => table[value] || '';

const validityClassLabel = pick(LABELS.validity);
const relationshipLabel = pick(LABELS.relationship);
const effectivenessLabel = pick(LABELS.effectiveness);
const springingTriggerLabel = pick(LABELS.trigger);
const coAgentsLabel = pick(LABELS.coAgents);
const compensationLabel = pick(LABELS.compensation);
const giftLimitLabel = pick(LABELS.giftLimit);
const bankFormLabel = pick(LABELS.bank);
const form2848Label = pick(LABELS.form2848);
const yesNoLabel = pick(LABELS.yesNo);
const priorityLabel = pick(LABELS.priority);

/** CSS class hint for the validity-class badge (reuses the risk palette). */
function validityClassClass(cls) {
  switch (cls) {
    case 'ready-to-execute': return 'risk-low';
    case 'incomplete': return 'risk-moderate';
    case 'execution-risk': return 'risk-high';
    default: return '';
  }
}

export { emptyInstrument, validityClassLabel, validityClassClass, relationshipLabel, effectivenessLabel, springingTriggerLabel, coAgentsLabel, compensationLabel, giftLimitLabel, bankFormLabel, form2848Label, yesNoLabel, priorityLabel };
