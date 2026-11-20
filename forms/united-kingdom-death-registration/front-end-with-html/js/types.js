// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the United Kingdom death
// registration form (England and Wales).
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_united_kingdom_death_registration.sql`. This file builds
// and exports the canonical empty Registration shape used by the wizard, so
// newly-added fields default correctly when older saved state is rehydrated
// from localStorage. It also exports display helpers (enum labels and
// registration-class / CSS-class hints).
//
// This is a COMPLETENESS and VALIDITY instrument, not a clinical score and not
// legal advice. The registrar's own checks remain definitive.

/**
 * @typedef {'female' | 'male' | 'other' | 'unknown' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'england-wales' | 'scotland' | 'northern-ireland' | 'abroad' | ''} DeathJurisdiction
 * @typedef {'confirmed' | 'pending' | ''} MedicalExaminerStatus
 * @typedef {'investigating' | 'post-mortem' | 'inquest-opened' | 'released-no-inquest' | 'inquest-concluded' | ''} CoronerStage
 * @typedef {'relative-present-at-death' | 'relative-in-attendance' | 'relative-in-district' | 'person-present-at-death' | 'occupier-of-premises' | 'person-arranging-funeral' | 'not-qualified' | ''} InformantRelationship
 * @typedef {'burial' | 'cremation' | 'other' | 'undecided' | ''} DisposalMethod
 * @typedef {'reference-received' | 'not-offered' | 'declined' | ''} TellUsOnceStatus
 * @typedef {'at-registration' | 'gro-online' | 'phone' | 'post' | 'local-register-office' | ''} CopyOrderChannel
 * @typedef {'ready-to-register' | 'incomplete' | 'referred-to-coroner-pending' | 'registered'} RegistrationClass
 * @typedef {'not-started' | 'paused-coroner' | 'on-track' | 'due-soon' | 'overdue' | 'registered' | 'registered-late'} DeadlineStatus
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 - the deceased and the death.
 * @typedef {Object} Deceased
 * @property {string} deceasedName
 * @property {Sex} sex
 * @property {string | null} dateOfBirth   - ISO date; null when unset
 * @property {string | null} dateOfDeath   - ISO date; null when unset
 * @property {string} placeOfDeath
 * @property {DeathJurisdiction} deathJurisdiction
 * @property {YesNo} deceasedParticularsKnown
 */

/**
 * Step 2 - medical certificate and medical examiner.
 * @typedef {Object} Medical
 * @property {YesNo} mccdReceived
 * @property {MedicalExaminerStatus} medicalExaminerStatus
 * @property {string | null} medicalExaminerConfirmationDate - ISO date; starts the 5-day clock
 */

/**
 * Step 3 - coroner.
 * @typedef {Object} Coroner
 * @property {YesNo} referredToCoroner
 * @property {CoronerStage} coronerStage
 * @property {YesNo} coronerCertificateReceived
 */

/**
 * Step 4 - informant.
 * @typedef {Object} Informant
 * @property {string} informantName
 * @property {InformantRelationship} informantRelationship
 * @property {string} informantAddress
 */

/**
 * Step 5 - registration appointment.
 * @typedef {Object} RegistrationDetails
 * @property {string} registerOffice
 * @property {YesNo} appointmentBooked
 * @property {YesNo} supportingDocumentsAvailable
 * @property {string | null} registrationDate - ISO date; null while unregistered
 * @property {string | null} asOfDate         - ISO date the assessment is made
 */

/**
 * Step 6 - after registration.
 * @typedef {Object} Aftercare
 * @property {DisposalMethod} disposalMethod
 * @property {YesNo} disposalCertificateIssued
 * @property {TellUsOnceStatus} tellUsOnceStatus
 * @property {string} tellUsOnceReference
 * @property {number | null} copiesRequested
 * @property {CopyOrderChannel} copyOrderChannel
 * @property {string} groIndexReference
 * @property {YesNo} priorityService
 */

/**
 * @typedef {Object} Registration
 * @property {Deceased} deceased
 * @property {Medical} medical
 * @property {Coroner} coroner
 * @property {Informant} informant
 * @property {RegistrationDetails} registration
 * @property {Aftercare} aftercare
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
 * Build a fresh, fully-blank registration.
 * Text / enum fields default to `''`; numeric and date fields to `null`.
 * @returns {Registration}
 */
function emptyRegistration() {
  return {
    deceased: {
      deceasedName: '',
      sex: '',
      dateOfBirth: null,
      dateOfDeath: null,
      placeOfDeath: '',
      deathJurisdiction: '',
      deceasedParticularsKnown: ''
    },
    medical: {
      mccdReceived: '',
      medicalExaminerStatus: '',
      medicalExaminerConfirmationDate: null
    },
    coroner: {
      referredToCoroner: '',
      coronerStage: '',
      coronerCertificateReceived: ''
    },
    informant: {
      informantName: '',
      informantRelationship: '',
      informantAddress: ''
    },
    registration: {
      registerOffice: '',
      appointmentBooked: '',
      supportingDocumentsAvailable: '',
      registrationDate: null,
      asOfDate: null
    },
    aftercare: {
      disposalMethod: '',
      disposalCertificateIssued: '',
      tellUsOnceStatus: '',
      tellUsOnceReference: '',
      copiesRequested: null,
      copyOrderChannel: '',
      groIndexReference: '',
      priorityService: ''
    }
  };
}

const LABELS = {
  registrationClass: {
    'ready-to-register': 'Ready to register',
    'incomplete': 'Incomplete',
    'referred-to-coroner-pending': 'Referred to coroner - pending',
    'registered': 'Registered'
  },
  deadlineStatus: {
    'not-started': 'Clock not started',
    'paused-coroner': 'Paused (coroner)',
    'on-track': 'On track',
    'due-soon': 'Due soon',
    'overdue': 'Overdue',
    'registered': 'Registered in time',
    'registered-late': 'Registered late'
  },
  sex: { female: 'Female', male: 'Male', other: 'Other', unknown: 'Unknown' },
  jurisdiction: {
    'england-wales': 'England or Wales',
    scotland: 'Scotland',
    'northern-ireland': 'Northern Ireland',
    abroad: 'Abroad'
  },
  coronerStage: {
    investigating: 'Coroner investigating',
    'post-mortem': 'Post-mortem ordered',
    'inquest-opened': 'Inquest opened',
    'released-no-inquest': 'Released, no inquest needed',
    'inquest-concluded': 'Inquest concluded'
  },
  relationship: {
    'relative-present-at-death': 'Relative present at the death',
    'relative-in-attendance': 'Relative in attendance during the last illness',
    'relative-in-district': 'Relative living in the registration district',
    'person-present-at-death': 'Person present at the death',
    'occupier-of-premises': 'Occupier of the premises where the death occurred',
    'person-arranging-funeral': 'Person arranging the funeral',
    'not-qualified': 'None of these (not a qualified informant)'
  },
  disposal: { burial: 'Burial', cremation: 'Cremation', other: 'Other', undecided: 'Not yet decided' },
  tellUsOnce: { 'reference-received': 'Reference number received', 'not-offered': 'Not offered', declined: 'Declined' },
  channel: {
    'at-registration': 'At registration',
    'gro-online': 'GRO online',
    phone: 'GRO by phone',
    post: 'GRO by post',
    'local-register-office': 'Local register office'
  },
  meStatus: { confirmed: 'Confirmed by the medical examiner', pending: 'Awaiting the medical examiner' },
  yesNo: { yes: 'Yes', no: 'No' },
  priority: { high: 'High', medium: 'Medium', low: 'Low' }
};

const label = (table) => (value) => LABELS[table][value] || '';

const registrationClassLabel = label('registrationClass');
const deadlineStatusLabel = label('deadlineStatus');
const sexLabel = label('sex');
const jurisdictionLabel = label('jurisdiction');
const coronerStageLabel = label('coronerStage');
const relationshipLabel = label('relationship');
const disposalMethodLabel = label('disposal');
const tellUsOnceStatusLabel = label('tellUsOnce');
const copyOrderChannelLabel = label('channel');
const medicalExaminerStatusLabel = label('meStatus');
const yesNoLabel = label('yesNo');
const priorityLabel = label('priority');

/** CSS class hint for the registration-class badge (reuses the risk palette). */
function registrationClassClass(cls) {
  switch (cls) {
    case 'ready-to-register': return 'risk-low';
    case 'registered': return 'risk-low';
    case 'incomplete': return 'risk-moderate';
    case 'referred-to-coroner-pending': return 'risk-high';
    default: return '';
  }
}

export {
  emptyRegistration, registrationClassLabel, registrationClassClass, deadlineStatusLabel, sexLabel,
  jurisdictionLabel, coronerStageLabel, relationshipLabel, disposalMethodLabel, tellUsOnceStatusLabel,
  copyOrderChannelLabel, medicalExaminerStatusLabel, yesNoLabel, priorityLabel
};
