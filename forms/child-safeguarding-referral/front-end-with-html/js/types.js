// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Child Safeguarding Referral
// form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_child_safeguarding_referral.sql` (with the referrer
// identity and core child demographics — which the SQL model keeps in the
// `clinician` and `patient` tables — carried here on the referral object as the
// front-end contract in spec §3). This file builds and exports the canonical
// empty SafeguardingReferral shape used by the wizard, so newly-added fields
// default correctly when older saved state is rehydrated from localStorage. It
// also exports display helpers (statusLabel, statusClass, urgencyLabel,
// urgencyClass, priorityLabel, and per-enum label helpers).
//
// Unlike a scored assessment, this is a documentation-completeness and
// risk-classification instrument: the engine grades a referral's completeness
// (`complete` / `partial` / `incomplete`) with a completeness percentage,
// classifies its urgency (`emergency` / `urgent` / `standard`), records which
// grading rules fired, and raises safeguarding flags. There is no numeric
// clinical score.

/**
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'yes' | 'no' | 'unknown' | ''} YesNoUnknown
 * @typedef {'female' | 'male' | 'other' | 'unknown' | ''} ChildSex
 * @typedef {'physical' | 'emotional' | 'sexual' | 'neglect' | ''} PrimaryCategory
 * @typedef {'given' | 'refused' | 'not-sought' | ''} ConsentStatus
 * @typedef {'risk-of-serious-harm' | 'seeking-consent-increases-risk' | 'not-applicable' | ''} SharingBasis
 * @typedef {'complete' | 'partial' | 'incomplete'} Status
 * @typedef {'emergency' | 'urgent' | 'standard'} Urgency
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — referrer details. Identity of the professional making the referral.
 * @typedef {Object} Referrer
 * @property {string} referrerName
 * @property {string} referrerRole
 * @property {string} referrerOrganisation
 * @property {string} referrerPhone
 * @property {string} referrerEmail
 * @property {string | null} referredAt          - ISO datetime string; null when unset
 * @property {string} relationshipToChild
 */

/**
 * Step 2 — child details.
 * @typedef {Object} Child
 * @property {string} childName
 * @property {string | null} childDateOfBirth    - ISO date string; null when unset
 * @property {number | null} childAge            - years; fallback when DOB unknown
 * @property {ChildSex} childSex
 * @property {string} childAddress
 * @property {string} childSetting
 * @property {string} childReference
 * @property {string} childEthnicity
 * @property {string} childFirstLanguage
 * @property {string} childDisability
 */

/**
 * Step 3 — family and household.
 * @typedef {Object} Family
 * @property {string} carers
 * @property {string} householdMembers
 * @property {string} otherChildren
 * @property {string} professionalsInvolved
 */

/**
 * Step 4 — the concern.
 * @typedef {Object} Concern
 * @property {string} concernDescription
 * @property {string} concernOnset
 * @property {YesNo} childDisclosed
 * @property {string} referrerObservations
 */

/**
 * Step 5 — category of abuse.
 * @typedef {Object} Category
 * @property {PrimaryCategory} primaryCategory
 * @property {string} additionalCategories
 * @property {string} presentingEvidence
 */

/**
 * Step 6 — immediate risk and safety.
 * @typedef {Object} Risk
 * @property {YesNo} immediateDanger
 * @property {string} childWhereabouts
 * @property {string} whoWithChild
 * @property {YesNoUnknown} allegedPersonInContact
 * @property {YesNoUnknown} otherChildrenAtRisk
 */

/**
 * Step 7 — consent and information sharing.
 * @typedef {Object} Consent
 * @property {YesNo} consentSought
 * @property {ConsentStatus} consentStatus
 * @property {SharingBasis} sharingBasisWithoutConsent
 * @property {YesNo} familyAware
 * @property {string} unsafeToInformReason
 */

/**
 * Step 8 — who else is informed.
 * @typedef {Object} Informed
 * @property {string} agenciesContacted
 * @property {YesNo} strategyDiscussionHeld
 * @property {string} previousSafeguardingHistory
 */

/**
 * Step 9 — requested action and summary.
 * @typedef {Object} Action
 * @property {string} requestedAction
 * @property {YesNo} referrerDeclaration
 * @property {string} notes
 */

/**
 * @typedef {Object} SafeguardingReferral
 * @property {Referrer} referrer
 * @property {Child} child
 * @property {Family} family
 * @property {Concern} concern
 * @property {Category} category
 * @property {Risk} risk
 * @property {Consent} consent
 * @property {Informed} informed
 * @property {Action} action
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id           - stable rule id, e.g. R-MANDATORY-01
 * @property {string} rule         - short rule key
 * @property {boolean} satisfied
 * @property {string} category
 * @property {string} description
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
 * @typedef {Object} GradingResult
 * @property {Status} status
 * @property {Urgency} urgency
 * @property {number} completenessPercent   - 0..100
 * @property {number} presentCount          - completeness slots populated
 * @property {number} applicableCount       - completeness slots that apply
 * @property {FiredRule[]} firedRules
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

/**
 * Build a fresh, fully-blank referral.
 * Text / enum fields default to `''`; numeric, date, and time fields default
 * to `null`.
 * @returns {SafeguardingReferral}
 */
function emptyReferral() {
  return {
    referrer: {
      referrerName: '',
      referrerRole: '',
      referrerOrganisation: '',
      referrerPhone: '',
      referrerEmail: '',
      referredAt: null,
      relationshipToChild: ''
    },
    child: {
      childName: '',
      childDateOfBirth: null,
      childAge: null,
      childSex: '',
      childAddress: '',
      childSetting: '',
      childReference: '',
      childEthnicity: '',
      childFirstLanguage: '',
      childDisability: ''
    },
    family: {
      carers: '',
      householdMembers: '',
      otherChildren: '',
      professionalsInvolved: ''
    },
    concern: {
      concernDescription: '',
      concernOnset: '',
      childDisclosed: '',
      referrerObservations: ''
    },
    category: {
      primaryCategory: '',
      additionalCategories: '',
      presentingEvidence: ''
    },
    risk: {
      immediateDanger: '',
      childWhereabouts: '',
      whoWithChild: '',
      allegedPersonInContact: '',
      otherChildrenAtRisk: ''
    },
    consent: {
      consentSought: '',
      consentStatus: '',
      sharingBasisWithoutConsent: '',
      familyAware: '',
      unsafeToInformReason: ''
    },
    informed: {
      agenciesContacted: '',
      strategyDiscussionHeld: '',
      previousSafeguardingHistory: ''
    },
    action: {
      requestedAction: '',
      referrerDeclaration: '',
      notes: ''
    }
  };
}

/** Completeness-status label for display. */
function statusLabel(status) {
  switch (status) {
    case 'complete': return 'Complete';
    case 'partial': return 'Partial';
    case 'incomplete': return 'Incomplete';
    default: return '';
  }
}

/** CSS class hint for the status badge (reuses the shared risk palette). */
function statusClass(status) {
  switch (status) {
    case 'complete': return 'risk-low';
    case 'partial': return 'risk-moderate';
    case 'incomplete': return 'risk-high';
    default: return '';
  }
}

/** Urgency-classification label for display. */
function urgencyLabel(urgency) {
  switch (urgency) {
    case 'emergency': return 'Emergency';
    case 'urgent': return 'Urgent (s47)';
    case 'standard': return 'Standard (s17)';
    default: return '';
  }
}

/** CSS class hint for the urgency badge (reuses the shared risk palette). */
function urgencyClass(urgency) {
  switch (urgency) {
    case 'emergency': return 'risk-critical';
    case 'urgent': return 'risk-high';
    case 'standard': return 'risk-low';
    default: return '';
  }
}

/** Statutory pathway text for an urgency classification. */
function urgencyPathway(urgency) {
  switch (urgency) {
    case 'emergency':
      return 'Children Act 1989 s47 + emergency services — phone social care and police (999) now; do not wait for the written referral.';
    case 'urgent':
      return 'Children Act 1989 s47 enquiry — contact children’s social care the same working day.';
    case 'standard':
      return 'Children Act 1989 s17 assessment — standard written referral within agreed local timescales.';
    default:
      return '';
  }
}

/** Primary-category label. */
function primaryCategoryLabel(value) {
  switch (value) {
    case 'physical': return 'Physical abuse';
    case 'emotional': return 'Emotional abuse';
    case 'sexual': return 'Sexual abuse';
    case 'neglect': return 'Neglect';
    default: return 'Not recorded';
  }
}

/** Consent-status label. */
function consentStatusLabel(value) {
  switch (value) {
    case 'given': return 'Consent given';
    case 'refused': return 'Consent refused';
    case 'not-sought': return 'Consent not sought';
    default: return 'Not recorded';
  }
}

/** Lawful-basis-for-sharing-without-consent label. */
function sharingBasisLabel(value) {
  switch (value) {
    case 'risk-of-serious-harm': return 'Risk of serious harm';
    case 'seeking-consent-increases-risk': return 'Seeking consent would increase risk';
    case 'not-applicable': return 'Not applicable';
    default: return 'Not recorded';
  }
}

/** Child-sex label. */
function childSexLabel(value) {
  switch (value) {
    case 'female': return 'Female';
    case 'male': return 'Male';
    case 'other': return 'Other';
    case 'unknown': return 'Unknown';
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

/** Yes / No / Unknown label. */
function yesNoUnknownLabel(value) {
  switch (value) {
    case 'yes': return 'Yes';
    case 'no': return 'No';
    case 'unknown': return 'Unknown';
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

export { emptyReferral, statusLabel, statusClass, urgencyLabel, urgencyClass, urgencyPathway, primaryCategoryLabel, consentStatusLabel, sharingBasisLabel, childSexLabel, yesNoLabel, yesNoUnknownLabel, priorityLabel };
