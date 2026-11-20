// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the United States Last Will and
// Testament form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_united_states_last_will_and_testament.sql`. This file
// builds and exports the canonical empty Will shape used by the wizard, so
// newly-added fields default correctly when older saved state is rehydrated from
// localStorage. It also exports display helpers (enum labels and validity-class
// CSS hints).
//
// This is a DOCUMENTATION and VALIDITY-CLASSIFICATION instrument, not legal
// advice. It checks that the will plan is complete and meets the formality rules
// of the testator's state, classifies it as `valid-ready-to-execute` /
// `incomplete` / `formality-risk`, and raises flags. The probate court decides
// whether a will is valid.

/**
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'yes' | 'no' | 'uncertain' | ''} SoundMind
 * @typedef {'none' | 'possible' | ''} UndueInfluence
 * @typedef {'single' | 'married' | 'divorced' | 'widowed' | ''} MaritalStatus
 * @typedef {'witnessed' | 'holographic' | 'electronic' | ''} ExecutionForm
 * @typedef {'valid-ready-to-execute' | 'incomplete' | 'formality-risk'} ValidityClass
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 - testator and state.
 * @typedef {Object} Testator
 * @property {string} state                 - two-letter state code of the testator's domicile
 * @property {string} testatorName
 * @property {string | null} dateOfBirth    - ISO date; null when unset
 * @property {SoundMind} soundMind
 * @property {UndueInfluence} undueInfluenceConcern
 * @property {MaritalStatus} maritalStatus
 */

/**
 * Step 2 - family and spouse.
 * @typedef {Object} Family
 * @property {string} spouseName
 * @property {number | null} spouseInheritanceValue   - US dollars left to the spouse
 * @property {YesNo} spouseWaivedElectiveShare
 * @property {YesNo} hasMinorChildren
 * @property {string} guardianForMinorsName
 * @property {YesNo} disinheritsChild
 * @property {YesNo} disinheritedChildNamed
 */

/**
 * Step 3 - estate and bequests.
 * @typedef {Object} Estate
 * @property {number | null} estimatedEstateValue     - US dollars
 * @property {number | null} specificBequestsTotal    - US dollars
 * @property {string} specificBequestsSummary
 * @property {YesNo} residuaryClausePresent
 * @property {string} residuary1Name
 * @property {number | null} residuary1Percent
 * @property {string} residuary2Name
 * @property {number | null} residuary2Percent
 * @property {string} residuary3Name
 * @property {number | null} residuary3Percent
 * @property {YesNo} contingentBeneficiaryNamed
 */

/**
 * Step 4 - representative and clauses.
 * @typedef {Object} Provisions
 * @property {string} personalRepresentativeName
 * @property {string} successorPersonalRepresentativeName
 * @property {YesNo} bondWaived
 * @property {YesNo} revokesPriorWillsClause
 * @property {YesNo} noContestClause
 * @property {YesNo} digitalAssetsClause
 * @property {YesNo} estateTaxReviewed
 * @property {string} originalWillLocation
 * @property {string} drafterNote
 */

/**
 * Step 5 - execution and witnesses.
 * @typedef {Object} Execution
 * @property {ExecutionForm} executionForm
 * @property {string | null} executionDate           - ISO date; null when unset
 * @property {YesNo} signedAtEnd
 * @property {YesNo} signedInWitnessPresence
 * @property {YesNo} witnessesSignedInTestatorPresence
 * @property {YesNo} holographicEntirelyHandwritten
 * @property {string} witness1Name
 * @property {YesNo} witness1Beneficiary
 * @property {string} witness2Name
 * @property {YesNo} witness2Beneficiary
 * @property {string} witness3Name
 * @property {YesNo} witness3Beneficiary
 */

/**
 * Step 6 - self-proving affidavit.
 * @typedef {Object} SelfProving
 * @property {YesNo} selfProvingAffidavit
 * @property {string} notaryName
 * @property {YesNo} notaryAcknowledged
 */

/**
 * @typedef {Object} Will
 * @property {Testator} testator
 * @property {Family} family
 * @property {Estate} estate
 * @property {Provisions} provisions
 * @property {Execution} execution
 * @property {SelfProving} selfProving
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
 * @property {number} residuaryPercentTotal
 * @property {number | null} electiveShareAmount
 * @property {number} witnessCount
 * @property {boolean} selfProved
 * @property {boolean} federalEstateTaxExposure
 * @property {'state-table' | 'uniform-default'} stateRuleSource
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

/**
 * Build a fresh, fully-blank will plan.
 * Text / enum fields default to `''`; numeric and date fields to `null`.
 * @returns {Will}
 */
function emptyWill() {
  return {
    testator: {
      state: '',
      testatorName: '',
      dateOfBirth: null,
      soundMind: '',
      undueInfluenceConcern: '',
      maritalStatus: ''
    },
    family: {
      spouseName: '',
      spouseInheritanceValue: null,
      spouseWaivedElectiveShare: '',
      hasMinorChildren: '',
      guardianForMinorsName: '',
      disinheritsChild: '',
      disinheritedChildNamed: ''
    },
    estate: {
      estimatedEstateValue: null,
      specificBequestsTotal: null,
      specificBequestsSummary: '',
      residuaryClausePresent: '',
      residuary1Name: '',
      residuary1Percent: null,
      residuary2Name: '',
      residuary2Percent: null,
      residuary3Name: '',
      residuary3Percent: null,
      contingentBeneficiaryNamed: ''
    },
    provisions: {
      personalRepresentativeName: '',
      successorPersonalRepresentativeName: '',
      bondWaived: '',
      revokesPriorWillsClause: '',
      noContestClause: '',
      digitalAssetsClause: '',
      estateTaxReviewed: '',
      originalWillLocation: '',
      drafterNote: ''
    },
    execution: {
      executionForm: '',
      executionDate: null,
      signedAtEnd: '',
      signedInWitnessPresence: '',
      witnessesSignedInTestatorPresence: '',
      holographicEntirelyHandwritten: '',
      witness1Name: '',
      witness1Beneficiary: '',
      witness2Name: '',
      witness2Beneficiary: '',
      witness3Name: '',
      witness3Beneficiary: ''
    },
    selfProving: {
      selfProvingAffidavit: '',
      notaryName: '',
      notaryAcknowledged: ''
    }
  };
}

/** Validity-class label for display. */
function validityClassLabel(cls) {
  switch (cls) {
    case 'valid-ready-to-execute': return 'Valid, ready to execute';
    case 'incomplete': return 'Incomplete';
    case 'formality-risk': return 'Formality risk';
    default: return '';
  }
}

/** CSS class hint for the validity-class badge (reuses the risk palette). */
function validityClassClass(cls) {
  switch (cls) {
    case 'valid-ready-to-execute': return 'risk-low';
    case 'incomplete': return 'risk-moderate';
    case 'formality-risk': return 'risk-high';
    default: return '';
  }
}

/** Marital-status label. */
function maritalStatusLabel(value) {
  switch (value) {
    case 'single': return 'Single';
    case 'married': return 'Married';
    case 'divorced': return 'Divorced';
    case 'widowed': return 'Widowed';
    default: return '';
  }
}

/** Execution-form label. */
function executionFormLabel(value) {
  switch (value) {
    case 'witnessed': return 'Witnessed will (two witnesses)';
    case 'holographic': return 'Holographic (handwritten, unwitnessed) will';
    case 'electronic': return 'Electronic will';
    default: return '';
  }
}

/** Sound-mind label. */
function soundMindLabel(value) {
  switch (value) {
    case 'yes': return 'Yes, of sound mind';
    case 'no': return 'No';
    case 'uncertain': return 'Uncertain';
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

/** US dollars for display; '' when null. */
function dollars(n) {
  return typeof n === 'number' && Number.isFinite(n) ? '$' + Math.round(n).toLocaleString('en-US') : '';
}

export { emptyWill, validityClassLabel, validityClassClass, maritalStatusLabel, executionFormLabel, soundMindLabel, yesNoLabel, priorityLabel, dollars };
