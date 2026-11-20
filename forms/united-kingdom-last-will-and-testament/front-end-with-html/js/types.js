// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the United Kingdom Last Will and
// Testament form (England and Wales).
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/03_create_table_united_kingdom_last_will_and_testament.sql`. This file
// builds and exports the canonical empty Will shape used by the wizard, so
// newly-added fields default correctly when older saved state is rehydrated
// from localStorage. It also exports display helpers (enum labels and
// validity-class / CSS-class hints).
//
// This is a WILL-DRAFTING DOCUMENTATION instrument, NOT legal advice. The
// engine checks that the will record is complete and that the Wills Act 1837
// formalities are planned or met; it classifies the will as `valid` (ready to
// execute), `incomplete`, or `formality-risk`, and raises flags. A solicitor
// or regulated will writer should review any will that is not straightforward.

/**
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'england-wales' | 'scotland' | 'northern-ireland' | 'other' | ''} Domicile
 * @typedef {'single' | 'married' | 'civil-partnership' | 'cohabiting' | 'divorced-or-dissolved' | 'widowed' | ''} MaritalStatus
 * @typedef {'none' | 'exists' | 'unsure' | ''} PreviousWill
 * @typedef {'under-325k' | '325k-500k' | '500k-2m' | 'over-2m' | ''} EstateValueBand
 * @typedef {'spouse-or-civil-partner' | 'unmarried-partner' | 'child' | 'grandchild' | 'other-relative' | 'friend' | 'charity' | 'other' | ''} BeneficiaryRelationship
 * @typedef {'burial' | 'cremation' | 'no-preference' | 'other' | ''} FuneralWishes
 * @typedef {'draft' | 'signed' | ''} ExecutionStatus
 * @typedef {'valid' | 'incomplete' | 'formality-risk'} ValidityClass
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/** The four beneficiary slots, in order. Property names are `beneficiary<Ordinal><Field>`. */
const ORDINALS = ['First', 'Second', 'Third', 'Fourth'];

/**
 * @typedef {Object} Will
 * @property {Object} testator
 * @property {Object} estate
 * @property {Object} executors
 * @property {Object} beneficiaries
 * @property {Object} family
 * @property {Object} execution
 */

/** The canonical empty Will: '' for text/enum, null for numeric/date. @returns {Will} */
function emptyWill() {
  const beneficiaries = {};
  for (const o of ORDINALS) {
    beneficiaries[`beneficiary${o}Name`] = '';
    beneficiaries[`beneficiary${o}Relationship`] = '';
    beneficiaries[`beneficiary${o}SharePercent`] = null;
    beneficiaries[`beneficiary${o}IsMinor`] = '';
    beneficiaries[`beneficiary${o}HasTrustee`] = '';
  }
  beneficiaries.residuaryClause = '';
  beneficiaries.dependantsConsidered = '';
  return {
    testator: {
      testatorName: '',
      dateOfBirth: null,
      testatorAddress: '',
      domicile: '',
      maritalStatus: '',
      marriageExpected: '',
      contemplationOfMarriageClause: '',
      hasMentalCapacity: '',
      madeVoluntarily: '',
      previousWill: '',
      revocationClause: ''
    },
    estate: {
      estateValueBand: '',
      ownsHome: '',
      homeToDirectDescendants: '',
      charityGiftPercent: null,
      estateOtherJurisdictions: '',
      otherJurisdictionsDetail: '',
      specificGiftsNotes: ''
    },
    executors: {
      executorFirstName: '',
      executorFirstRelationship: '',
      executorSecondName: '',
      executorSecondRelationship: '',
      executorsAdultConfirmed: ''
    },
    beneficiaries,
    family: {
      hasChildrenUnder18: '',
      guardianName: '',
      funeralWishes: '',
      funeralWishesNote: ''
    },
    execution: {
      executionStatus: '',
      dateOfWill: null,
      willInWriting: '',
      testatorSigned: '',
      witnessesPresentTogether: '',
      witnessesSigned: '',
      witnessFirstName: '',
      witnessFirstOver18: '',
      witnessFirstIsBeneficiaryOrSpouse: '',
      witnessSecondName: '',
      witnessSecondOver18: '',
      witnessSecondIsBeneficiaryOrSpouse: '',
      drafterNote: ''
    }
  };
}

/** Validity-class label for display. */
function validityClassLabel(cls) {
  switch (cls) {
    case 'valid': return 'Valid — ready to execute';
    case 'incomplete': return 'Incomplete';
    case 'formality-risk': return 'Formality risk';
    default: return '';
  }
}

/** CSS class hint for the validity-class badge (reuses the risk palette). */
function validityClassClass(cls) {
  switch (cls) {
    case 'valid': return 'risk-low';
    case 'incomplete': return 'risk-moderate';
    case 'formality-risk': return 'risk-high';
    default: return '';
  }
}

/** Domicile label. */
function domicileLabel(value) {
  switch (value) {
    case 'england-wales': return 'England and Wales';
    case 'scotland': return 'Scotland';
    case 'northern-ireland': return 'Northern Ireland';
    case 'other': return 'Another country';
    default: return '';
  }
}

/** Marital-status label. */
function maritalStatusLabel(value) {
  switch (value) {
    case 'single': return 'Single';
    case 'married': return 'Married';
    case 'civil-partnership': return 'In a civil partnership';
    case 'cohabiting': return 'Living with an unmarried partner';
    case 'divorced-or-dissolved': return 'Divorced or civil partnership dissolved';
    case 'widowed': return 'Widowed';
    default: return '';
  }
}

/** Previous-will label. */
function previousWillLabel(value) {
  switch (value) {
    case 'none': return 'No earlier will';
    case 'exists': return 'An earlier will exists';
    case 'unsure': return 'Not sure';
    default: return '';
  }
}

/** Estate-value-band label. */
function estateValueBandLabel(value) {
  switch (value) {
    case 'under-325k': return 'Under £325,000';
    case '325k-500k': return '£325,000 to £500,000';
    case '500k-2m': return '£500,000 to £2 million';
    case 'over-2m': return 'Over £2 million';
    default: return '';
  }
}

/** Beneficiary-relationship label. */
function relationshipLabel(value) {
  switch (value) {
    case 'spouse-or-civil-partner': return 'Spouse or civil partner';
    case 'unmarried-partner': return 'Unmarried partner';
    case 'child': return 'Child';
    case 'grandchild': return 'Grandchild';
    case 'other-relative': return 'Other relative';
    case 'friend': return 'Friend';
    case 'charity': return 'Charity';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Funeral-wishes label. */
function funeralWishesLabel(value) {
  switch (value) {
    case 'burial': return 'Burial';
    case 'cremation': return 'Cremation';
    case 'no-preference': return 'No preference';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Execution-status label. */
function executionStatusLabel(value) {
  switch (value) {
    case 'draft': return 'Draft — not yet signed';
    case 'signed': return 'Signed and witnessed';
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

export { ORDINALS, emptyWill, validityClassLabel, validityClassClass, domicileLabel, maritalStatusLabel, previousWillLabel, estateValueBandLabel, relationshipLabel, funeralWishesLabel, executionStatusLabel, yesNoLabel, priorityLabel };

/**
 * A flagged issue raised by the detector.
 * @typedef {Object} FlaggedIssue
 * @property {string} id
 * @property {string} category
 * @property {Priority} priority
 * @property {string} description
 * @property {string} suggestedAction
 */
