// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Medication Reconciliation form.
//
// The camelCase property names mirror the snake_case SQL columns across the
// parent header (`sql/04_create_table_medication_reconciliation.sql`) and its
// FOUR one-to-many child tables:
//   - information sources (`..._information_source`)
//   - allergies          (`..._allergy`)
//   - medication line items, tagged bpmh|inpatient via `listSource`
//                        (`..._line_item`)
//   - discrepancies      (`..._discrepancy`)
//
// This file builds and exports the canonical empty ReconciliationData shape used
// by the wizard, the empty-child factories, and the display-label helpers. It is
// a documentation-and-completeness form: the engine grades a STATUS
// (complete / discrepancies-outstanding / incomplete), not a numeric score.

/**
 * @typedef {'admission' | 'transfer' | 'discharge' | ''} ReconciliationType
 * @typedef {'emergency-department' | 'acute-medical-unit' | 'surgical-admissions' | 'ward' | 'critical-care' | 'other' | ''} CareSetting
 * @typedef {'pharmacist' | 'pharmacy-technician' | 'prescriber' | 'nurse' | 'other' | ''} ClinicianRole
 * @typedef {'adult' | 'paediatric' | ''} AgeBand
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
 * @typedef {'documented' | 'no-known-drug-allergies' | 'not-documented' | ''} AllergyStatus
 * @typedef {'patient-interview' | 'carer-interview' | 'gp-record' | 'repeat-prescription' | 'community-pharmacy' | 'dispensing-history' | 'previous-discharge-summary' | 'own-drugs-bag' | 'care-home-mar' | ''} SourceType
 * @typedef {'allergy' | 'intolerance' | 'adverse-effect' | 'unknown' | ''} ReactionType
 * @typedef {'mild' | 'moderate' | 'severe' | 'anaphylaxis' | ''} Severity
 * @typedef {'bpmh' | 'inpatient' | ''} ListSource
 * @typedef {'oral' | 'iv' | 'im' | 'subcutaneous' | 'topical' | 'inhaled' | 'other' | ''} Route
 * @typedef {'none' | 'anticoagulant' | 'insulin' | 'opioid' | 'other' | ''} HighRiskClass
 * @typedef {'taking' | 'not-taking' | 'intermittent' | 'unknown' | ''} Adherence
 * @typedef {'active' | 'held' | 'stopped' | 'suspended' | ''} ItemStatus
 * @typedef {'omission' | 'commission' | 'duplication' | 'dose' | 'frequency' | 'route' | 'formulation' | ''} DiscrepancyType
 * @typedef {'continue' | 'hold' | 'stop' | 'change' | 'start' | ''} IntendedAction
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'complete' | 'discrepancies-outstanding' | 'incomplete'} ReconciliationStatus
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * One information source used to build the BPMH — mirrors the child table
 * `medication_reconciliation_information_source`.
 * @typedef {Object} InformationSource
 * @property {SourceType} sourceType
 * @property {YesNo} verified                 - whether the source was directly checked
 */

/**
 * One drug allergy / adverse reaction — mirrors the child table
 * `medication_reconciliation_allergy`.
 * @typedef {Object} Allergy
 * @property {string} substance
 * @property {ReactionType} reactionType
 * @property {Severity} severity
 */

/**
 * One medication line item on either list — mirrors the child table
 * `medication_reconciliation_line_item`. `listSource` discriminates a BPMH line
 * from a current inpatient line.
 * @typedef {Object} LineItem
 * @property {ListSource} listSource
 * @property {string} drugName
 * @property {string} form
 * @property {string} dose
 * @property {Route} route
 * @property {string} frequency
 * @property {string} indication
 * @property {HighRiskClass} highRiskClass
 * @property {Adherence} adherence
 * @property {SourceType} sourceType
 * @property {ItemStatus} status              - prescribing status for inpatient rows
 */

/**
 * One reconciliation discrepancy — mirrors the child table
 * `medication_reconciliation_discrepancy`.
 * @typedef {Object} Discrepancy
 * @property {DiscrepancyType} discrepancyType
 * @property {string} bpmhItemRef
 * @property {string} inpatientItemRef
 * @property {IntendedAction} intendedAction
 * @property {string} rationale
 * @property {YesNo} intentional              - 'yes' = documented decision; else unexplained (error)
 */

/**
 * Step 1 — encounter context (parent header fields).
 * @typedef {Object} Encounter
 * @property {ReconciliationType} reconciliationType
 * @property {CareSetting} careSetting
 * @property {string} reconciledAt            - ISO-ish datetime-local string; '' when unset
 * @property {string} clinicianName
 * @property {ClinicianRole} clinicianRole
 */

/**
 * Step 2 — patient identification (parent header fields).
 * @typedef {Object} Identification
 * @property {string} patientIdentifier
 * @property {AgeBand} ageBand
 * @property {Sex} sex
 * @property {number | null} weightKg
 */

/**
 * Step 4 — patient-level allergy status (parent header field).
 * @typedef {Object} AllergyReview
 * @property {AllergyStatus} allergyStatus
 */

/**
 * Step 7 — sign-off note.
 * @typedef {Object} Note
 * @property {string} clinicalNote
 */

/**
 * @typedef {Object} ReconciliationData
 * @property {Encounter} encounter
 * @property {Identification} identification
 * @property {AllergyReview} allergyReview
 * @property {InformationSource[]} informationSources
 * @property {Allergy[]} allergies
 * @property {LineItem[]} lineItems
 * @property {Discrepancy[]} discrepancies
 * @property {Note} note
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
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
 * @property {ReconciliationStatus} status
 * @property {number} sourceCount
 * @property {number} verifiedSourceCount
 * @property {number} allergyCount
 * @property {number} lineItemCount
 * @property {number} bpmhCount
 * @property {number} inpatientCount
 * @property {number} discrepancyCount
 * @property {number} intentionalCount
 * @property {number} unintentionalCount
 * @property {number} highRiskUnintentionalCount
 * @property {FiredRule[]} firedRules
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a classic
// <script> (no ES modules) so the page can be opened directly via file://. The
// IIFE attaches its public symbols to a single global namespace,
// `window.MedicationReconciliation`.
(function () {
'use strict';
window.MedicationReconciliation = window.MedicationReconciliation || {};

/** Build a fresh, fully-blank information source. @returns {InformationSource} */
function emptySource() {
  return { sourceType: '', verified: '' };
}

/** Build a fresh, fully-blank allergy. @returns {Allergy} */
function emptyAllergy() {
  return { substance: '', reactionType: '', severity: '' };
}

/** Build a fresh, fully-blank medication line item. @returns {LineItem} */
function emptyLineItem() {
  return {
    listSource: '',
    drugName: '',
    form: '',
    dose: '',
    route: '',
    frequency: '',
    indication: '',
    highRiskClass: '',
    adherence: '',
    sourceType: '',
    status: ''
  };
}

/** Build a fresh, fully-blank discrepancy. @returns {Discrepancy} */
function emptyDiscrepancy() {
  return {
    discrepancyType: '',
    bpmhItemRef: '',
    inpatientItemRef: '',
    intendedAction: '',
    rationale: '',
    intentional: ''
  };
}

/**
 * Build a fresh, fully-blank reconciliation. Strings default to `''`; numeric
 * fields default to `null`; the four child lists default to `[]`.
 * @returns {ReconciliationData}
 */
function emptyReconciliation() {
  return {
    encounter: {
      reconciliationType: '',
      careSetting: '',
      reconciledAt: '',
      clinicianName: '',
      clinicianRole: ''
    },
    identification: {
      patientIdentifier: '',
      ageBand: '',
      sex: '',
      weightKg: null
    },
    allergyReview: {
      allergyStatus: ''
    },
    informationSources: [],
    allergies: [],
    lineItems: [],
    discrepancies: [],
    note: {
      clinicalNote: ''
    }
  };
}

// ---------------------------------------------------------------------------
// Display-label helpers
// ---------------------------------------------------------------------------

/** Reconciliation-status label for display. */
function statusLabel(status) {
  switch (status) {
    case 'complete': return 'Complete';
    case 'discrepancies-outstanding': return 'Discrepancies outstanding';
    case 'incomplete': return 'Incomplete';
    default: return '';
  }
}

/** CSS class hint for the status badge (reuses the shared risk palette). */
function statusClass(status) {
  switch (status) {
    case 'complete': return 'risk-low';
    case 'discrepancies-outstanding': return 'risk-high';
    case 'incomplete': return 'risk-moderate';
    default: return '';
  }
}

function reconciliationTypeLabel(t) {
  switch (t) {
    case 'admission': return 'Admission';
    case 'transfer': return 'Transfer';
    case 'discharge': return 'Discharge';
    default: return '';
  }
}

function careSettingLabel(s) {
  switch (s) {
    case 'emergency-department': return 'Emergency department';
    case 'acute-medical-unit': return 'Acute medical unit';
    case 'surgical-admissions': return 'Surgical admissions';
    case 'ward': return 'Ward';
    case 'critical-care': return 'Critical care';
    case 'other': return 'Other';
    default: return '';
  }
}

function clinicianRoleLabel(r) {
  switch (r) {
    case 'pharmacist': return 'Pharmacist';
    case 'pharmacy-technician': return 'Pharmacy technician';
    case 'prescriber': return 'Prescriber';
    case 'nurse': return 'Nurse';
    case 'other': return 'Other';
    default: return '';
  }
}

function ageBandLabel(b) {
  switch (b) {
    case 'adult': return 'Adult';
    case 'paediatric': return 'Paediatric';
    default: return '';
  }
}

function sexLabel(s) {
  switch (s) {
    case 'female': return 'Female';
    case 'male': return 'Male';
    case 'intersex': return 'Intersex';
    case 'unknown': return 'Unknown';
    default: return '';
  }
}

function allergyStatusLabel(a) {
  switch (a) {
    case 'documented': return 'Allergies documented';
    case 'no-known-drug-allergies': return 'No known drug allergies';
    case 'not-documented': return 'Not documented';
    default: return '';
  }
}

function sourceTypeLabel(s) {
  switch (s) {
    case 'patient-interview': return 'Patient interview';
    case 'carer-interview': return 'Carer interview';
    case 'gp-record': return 'GP record';
    case 'repeat-prescription': return 'Repeat-prescription list';
    case 'community-pharmacy': return 'Community-pharmacy record';
    case 'dispensing-history': return 'Dispensing history';
    case 'previous-discharge-summary': return 'Previous discharge summary';
    case 'own-drugs-bag': return "Patient's own-drugs bag";
    case 'care-home-mar': return 'Care-home MAR chart';
    default: return '';
  }
}

function reactionTypeLabel(r) {
  switch (r) {
    case 'allergy': return 'Allergy';
    case 'intolerance': return 'Intolerance';
    case 'adverse-effect': return 'Adverse effect';
    case 'unknown': return 'Unknown';
    default: return '';
  }
}

function severityLabel(s) {
  switch (s) {
    case 'mild': return 'Mild';
    case 'moderate': return 'Moderate';
    case 'severe': return 'Severe';
    case 'anaphylaxis': return 'Anaphylaxis';
    default: return '';
  }
}

function listSourceLabel(l) {
  switch (l) {
    case 'bpmh': return 'BPMH (home medicine)';
    case 'inpatient': return 'Inpatient / proposed';
    default: return '';
  }
}

function routeLabel(r) {
  switch (r) {
    case 'oral': return 'Oral';
    case 'iv': return 'Intravenous';
    case 'im': return 'Intramuscular';
    case 'subcutaneous': return 'Subcutaneous';
    case 'topical': return 'Topical';
    case 'inhaled': return 'Inhaled';
    case 'other': return 'Other';
    default: return '';
  }
}

function highRiskClassLabel(c) {
  switch (c) {
    case 'none': return 'None';
    case 'anticoagulant': return 'Anticoagulant';
    case 'insulin': return 'Insulin';
    case 'opioid': return 'Opioid';
    case 'other': return 'Other';
    default: return '';
  }
}

function adherenceLabel(a) {
  switch (a) {
    case 'taking': return 'Taking';
    case 'not-taking': return 'Not taking';
    case 'intermittent': return 'Intermittent';
    case 'unknown': return 'Unknown';
    default: return '';
  }
}

function itemStatusLabel(s) {
  switch (s) {
    case 'active': return 'Active';
    case 'held': return 'Held';
    case 'stopped': return 'Stopped';
    case 'suspended': return 'Suspended';
    default: return '';
  }
}

function discrepancyTypeLabel(t) {
  switch (t) {
    case 'omission': return 'Omission';
    case 'commission': return 'Commission';
    case 'duplication': return 'Duplication';
    case 'dose': return 'Dose';
    case 'frequency': return 'Frequency';
    case 'route': return 'Route';
    case 'formulation': return 'Formulation';
    default: return '';
  }
}

function intendedActionLabel(a) {
  switch (a) {
    case 'continue': return 'Continue';
    case 'hold': return 'Hold';
    case 'stop': return 'Stop';
    case 'change': return 'Change';
    case 'start': return 'Start';
    default: return '';
  }
}

function priorityLabel(priority) {
  switch (priority) {
    case 'high': return 'HIGH';
    case 'medium': return 'MEDIUM';
    case 'low': return 'LOW';
    default: return '';
  }
}

Object.assign(window.MedicationReconciliation, {
  emptySource,
  emptyAllergy,
  emptyLineItem,
  emptyDiscrepancy,
  emptyReconciliation,
  statusLabel,
  statusClass,
  reconciliationTypeLabel,
  careSettingLabel,
  clinicianRoleLabel,
  ageBandLabel,
  sexLabel,
  allergyStatusLabel,
  sourceTypeLabel,
  reactionTypeLabel,
  severityLabel,
  listSourceLabel,
  routeLabel,
  highRiskClassLabel,
  adherenceLabel,
  itemStatusLabel,
  discrepancyTypeLabel,
  intendedActionLabel,
  priorityLabel
});
})();
