// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the United States Health Care Power
// of Attorney form (durable power of attorney for health care, health care
// proxy, advance directive).
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_united_states_health_care_power_of_attorney.sql`. This
// file builds the canonical empty Directive shape used by the wizard, so
// newly-added fields default correctly when older saved state is rehydrated
// from localStorage. It also exports display helpers.
//
// This is a DOCUMENTATION and EXECUTION-READINESS instrument. It is NOT legal
// advice. The engine checks that the directive is complete, that the agent and
// witnesses are eligible, and that the signing formalities match the state's
// rule, and it classifies the directive as `ready-to-execute`, `incomplete`, or
// `execution-risk`. A state court or the treating facility decides validity.

/**
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'spouse' | 'adult-child' | 'parent' | 'sibling' | 'other-relative' | 'friend' | 'other' | ''} AgentRelationship
 * @typedef {'immediately' | 'upon-incapacity' | ''} EffectiveWhen
 * @typedef {'one-physician' | 'two-physicians' | 'other' | ''} IncapacityDeterminedBy
 * @typedef {'any-needs' | 'transplant-only' | 'research-only' | 'none' | 'not-addressed' | ''} OrganDonation
 * @typedef {'none-existing' | 'revokes-prior' | 'prior-remains' | ''} PriorDirectiveStatus
 * @typedef {'refuse' | 'time-limited-trial' | 'want-all' | 'agent-decides' | ''} LifeSustainingTreatment
 * @typedef {'accept' | 'refuse' | 'agent-decides' | ''} TreatmentChoice
 * @typedef {'none' | 'in-place' | 'discussing' | ''} PolstStatus
 * @typedef {'two-witnesses' | 'one-witness' | 'notary' | 'witnesses-and-notary' | ''} ExecutionMethod
 * @typedef {'ready-to-execute' | 'incomplete' | 'execution-risk'} ReadinessClass
 * @typedef {'high' | 'medium' | 'low'} Priority
 *
 * @typedef {Object} FlaggedIssue
 * @property {string} id
 * @property {string} category
 * @property {Priority} priority
 * @property {string} description
 * @property {string} suggestedAction
 *
 * @typedef {Object} Directive
 * @property {Object} principal
 * @property {Object} agent
 * @property {Object} authority
 * @property {Object} wishes
 * @property {Object} execution
 * @property {Object} distribution
 */

/** @returns {Directive} */
function emptyDirective() {
  return {
    principal: {
      principalName: '',
      birthDate: null,
      state: '',
      phone: '',
      capacityConfirmed: '',
      signedVoluntarily: ''
    },
    agent: {
      agentName: '',
      agentRelationship: '',
      agentAge: null,
      agentPhone: '',
      agentIsHealthCareProvider: '',
      agentIsFacilityEmployee: '',
      agentRelatedToPrincipal: '',
      agentAccepted: '',
      successor1Name: '',
      successor1Phone: '',
      successor2Name: ''
    },
    authority: {
      effectiveWhen: '',
      incapacityDeterminedBy: '',
      hipaaRelease: '',
      mentalHealthAuthority: '',
      organDonation: '',
      priorDirectiveStatus: ''
    },
    wishes: {
      lifeSustainingTreatment: '',
      cpr: '',
      ventilator: '',
      artificialNutrition: '',
      comfortCareFirst: '',
      seriousIllness: '',
      polstStatus: '',
      wishesNote: ''
    },
    execution: {
      signatureDate: null,
      executionMethod: '',
      witnessesPresent: '',
      witness1Name: '',
      witness1IsRelative: '',
      witness1IsHeir: '',
      witness1IsAgent: '',
      witness1IsProvider: '',
      witness2Name: '',
      witness2IsRelative: '',
      witness2IsHeir: '',
      witness2IsAgent: '',
      witness2IsProvider: '',
      notaryName: '',
      principalInSkilledNursingFacility: '',
      ombudsmanSigned: ''
    },
    distribution: {
      copyToAgent: '',
      copyToPhysician: '',
      copyToSuccessor: '',
      copyToFacility: ''
    }
  };
}

/** Readiness-class label for display. */
function readinessClassLabel(cls) {
  switch (cls) {
    case 'ready-to-execute': return 'Ready to execute';
    case 'incomplete': return 'Incomplete';
    case 'execution-risk': return 'Execution risk';
    default: return '';
  }
}

/** CSS class hint for the readiness badge (reuses the risk palette). */
function readinessClassClass(cls) {
  switch (cls) {
    case 'ready-to-execute': return 'risk-low';
    case 'incomplete': return 'risk-moderate';
    case 'execution-risk': return 'risk-high';
    default: return '';
  }
}

/** Agent-relationship label. */
function agentRelationshipLabel(value) {
  switch (value) {
    case 'spouse': return 'Spouse or partner';
    case 'adult-child': return 'Adult child';
    case 'parent': return 'Parent';
    case 'sibling': return 'Sibling';
    case 'other-relative': return 'Other relative';
    case 'friend': return 'Friend';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Effective-when label. */
function effectiveWhenLabel(value) {
  switch (value) {
    case 'immediately': return 'Immediately on signing';
    case 'upon-incapacity': return 'Only when the principal cannot decide';
    default: return '';
  }
}

/** Organ-donation label. */
function organDonationLabel(value) {
  switch (value) {
    case 'any-needs': return 'Any needed organs and tissues';
    case 'transplant-only': return 'Transplant or therapy only';
    case 'research-only': return 'Research only';
    case 'none': return 'No donation';
    case 'not-addressed': return 'Not addressed';
    default: return '';
  }
}

/** Life-sustaining-treatment label. */
function lifeSustainingTreatmentLabel(value) {
  switch (value) {
    case 'refuse': return 'Refuse life-sustaining treatment when terminal or permanently unconscious';
    case 'time-limited-trial': return 'Accept a time-limited trial';
    case 'want-all': return 'Want all available treatment';
    case 'agent-decides': return 'Leave to the agent';
    default: return '';
  }
}

/** Treatment-choice label. */
function treatmentChoiceLabel(value) {
  switch (value) {
    case 'accept': return 'Accept';
    case 'refuse': return 'Refuse';
    case 'agent-decides': return 'Agent decides';
    default: return '';
  }
}

/** POLST-status label. */
function polstStatusLabel(value) {
  switch (value) {
    case 'none': return 'No POLST';
    case 'in-place': return 'POLST in place';
    case 'discussing': return 'Discussing a POLST with a clinician';
    default: return '';
  }
}

/** Execution-method label. */
function executionMethodLabel(value) {
  switch (value) {
    case 'two-witnesses': return 'Two witnesses';
    case 'one-witness': return 'One witness';
    case 'notary': return 'Notary acknowledgment';
    case 'witnesses-and-notary': return 'Witnesses and notary';
    default: return '';
  }
}

/** Yes / No label. */
function yesNoLabel(value) {
  switch (value) {
    case 'yes': return 'Yes';
    case 'no': return 'No';
    default: return '';
  }
}

/** Flag-priority label. */
function priorityLabel(priority) {
  switch (priority) {
    case 'high': return 'HIGH';
    case 'medium': return 'MEDIUM';
    case 'low': return 'LOW';
    default: return '';
  }
}

export { emptyDirective, readinessClassLabel, readinessClassClass, agentRelationshipLabel, effectiveWhenLabel, organDonationLabel, lifeSustainingTreatmentLabel, treatmentChoiceLabel, polstStatusLabel, executionMethodLabel, yesNoLabel, priorityLabel };
