// NICE NG27 discharge summary completeness validation rules.
//
// Each rule checks a single mandatory or optional field on the assessment
// data and returns whether it is satisfied. Mandatory rules are required
// for the discharge summary to be classified as "complete"; optional rules
// downgrade a complete summary to "partial" if missing.
//
// Mandatory rule IDs use NG27-M-NNN. Optional rules use NG27-O-NNN.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 *
 * @typedef {Object} ValidationRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {boolean} mandatory
 * @property {(d: AssessmentData) => boolean} evaluate
 */

// Wrapped in an IIFE; published via window.HospitalDischarge.

/** Helper: a non-empty trimmed string. */
function nonEmpty(s) {
  return typeof s === 'string' && s.trim().length > 0;
}

/** @type {ValidationRule[]} */
const validationRules = [
  // ─── Patient identification (mandatory) ─────────────────────────
  {
    id: 'NG27-M-001',
    category: 'Patient Details',
    description: 'Patient first name recorded.',
    mandatory: true,
    evaluate: (d) => nonEmpty(d.patientDetails.firstName)
  },
  {
    id: 'NG27-M-002',
    category: 'Patient Details',
    description: 'Patient last name recorded.',
    mandatory: true,
    evaluate: (d) => nonEmpty(d.patientDetails.lastName)
  },
  {
    id: 'NG27-M-003',
    category: 'Patient Details',
    description: 'Patient date of birth recorded.',
    mandatory: true,
    evaluate: (d) => nonEmpty(d.patientDetails.dateOfBirth)
  },
  {
    id: 'NG27-M-004',
    category: 'Patient Details',
    description: 'NHS number recorded.',
    mandatory: true,
    evaluate: (d) => nonEmpty(d.patientDetails.nhsNumber)
  },
  {
    id: 'NG27-M-005',
    category: 'Patient Details',
    description: 'GP name and practice recorded.',
    mandatory: true,
    evaluate: (d) =>
      nonEmpty(d.patientDetails.gpName) && nonEmpty(d.patientDetails.gpPractice)
  },

  // ─── Admission summary (mandatory) ──────────────────────────────
  {
    id: 'NG27-M-006',
    category: 'Admission Summary',
    description: 'Admission date recorded.',
    mandatory: true,
    evaluate: (d) => nonEmpty(d.admissionSummary.admissionDate)
  },
  {
    id: 'NG27-M-007',
    category: 'Admission Summary',
    description: 'Discharge date recorded.',
    mandatory: true,
    evaluate: (d) => nonEmpty(d.admissionSummary.dischargeDate)
  },
  {
    id: 'NG27-M-008',
    category: 'Admission Summary',
    description: 'Responsible consultant recorded.',
    mandatory: true,
    evaluate: (d) => nonEmpty(d.admissionSummary.consultant)
  },
  {
    id: 'NG27-M-009',
    category: 'Admission Summary',
    description: 'Reason for admission recorded.',
    mandatory: true,
    evaluate: (d) => nonEmpty(d.admissionSummary.reasonForAdmission)
  },

  // ─── Diagnoses (mandatory) ──────────────────────────────────────
  {
    id: 'NG27-M-010',
    category: 'Diagnoses',
    description: 'At least one primary diagnosis recorded.',
    mandatory: true,
    evaluate: (d) =>
      d.diagnoses.diagnoses.some(
        (x) => x.type === 'primary' && nonEmpty(x.description)
      )
  },

  // ─── Procedures (mandatory: either list or explicit none) ──────
  {
    id: 'NG27-M-011',
    category: 'Procedures',
    description: 'Procedures performed listed, or explicitly noted as none.',
    mandatory: true,
    evaluate: (d) =>
      d.proceduresPerformed.noProceduresPerformed === 'yes' ||
      d.proceduresPerformed.procedures.some((p) => nonEmpty(p.description))
  },

  // ─── Discharge medications (mandatory) ─────────────────────────
  {
    id: 'NG27-M-012',
    category: 'Discharge Medications',
    description: 'Discharge medications listed (with dose, route, frequency).',
    mandatory: true,
    evaluate: (d) =>
      d.dischargeMedications.medications.length > 0 &&
      d.dischargeMedications.medications.every(
        (m) => nonEmpty(m.name) && nonEmpty(m.dose) && nonEmpty(m.frequency)
      )
  },
  {
    id: 'NG27-M-013',
    category: 'Discharge Medications',
    description: 'Medication reconciliation completed.',
    mandatory: true,
    evaluate: (d) => d.dischargeMedications.reconciliationCompleted === 'yes'
  },
  {
    id: 'NG27-M-014',
    category: 'Discharge Medications',
    description: 'Allergies reviewed and documented.',
    mandatory: true,
    evaluate: (d) => d.dischargeMedications.allergiesReviewed === 'yes'
  },

  // ─── Follow-up arrangements (mandatory) ────────────────────────
  {
    id: 'NG27-M-015',
    category: 'Follow-up',
    description: 'GP follow-up requirement decided.',
    mandatory: true,
    evaluate: (d) =>
      d.followupArrangements.gpFollowupRequired === 'yes' ||
      d.followupArrangements.gpFollowupRequired === 'no'
  },
  {
    id: 'NG27-M-016',
    category: 'Follow-up',
    description: 'Outpatient follow-up requirement decided.',
    mandatory: true,
    evaluate: (d) =>
      d.followupArrangements.outpatientFollowupRequired === 'yes' ||
      d.followupArrangements.outpatientFollowupRequired === 'no'
  },

  // ─── Community care (mandatory) ────────────────────────────────
  {
    id: 'NG27-M-017',
    category: 'Community Care',
    description: 'Discharge destination recorded.',
    mandatory: true,
    evaluate: (d) => nonEmpty(d.communityCareInstructions.dischargeDestination)
  },
  {
    id: 'NG27-M-018',
    category: 'Community Care',
    description: 'Care responsibility recorded.',
    mandatory: true,
    evaluate: (d) => nonEmpty(d.communityCareInstructions.careResponsibility)
  },

  // ─── Warning signs / safety-netting (mandatory) ────────────────
  {
    id: 'NG27-M-019',
    category: 'Warning Signs',
    description: 'When-to-seek-help advice recorded.',
    mandatory: true,
    evaluate: (d) => nonEmpty(d.warningSigns.whenToSeekHelp)
  },
  {
    id: 'NG27-M-020',
    category: 'Warning Signs',
    description: 'Safety-netting provided.',
    mandatory: true,
    evaluate: (d) => d.warningSigns.safetyNetingProvided === 'yes'
  },

  // ─── Clinician sign-off (mandatory) ────────────────────────────
  {
    id: 'NG27-M-021',
    category: 'Clinician Sign-off',
    description: 'Signing clinician name recorded.',
    mandatory: true,
    evaluate: (d) => nonEmpty(d.clinicianSignoff.clinicianName)
  },
  {
    id: 'NG27-M-022',
    category: 'Clinician Sign-off',
    description: 'Signing clinician role recorded.',
    mandatory: true,
    evaluate: (d) => nonEmpty(d.clinicianSignoff.clinicianRole)
  },
  {
    id: 'NG27-M-023',
    category: 'Clinician Sign-off',
    description: 'Sign-off date recorded.',
    mandatory: true,
    evaluate: (d) => nonEmpty(d.clinicianSignoff.signoffDate)
  },

  // ─── Patient / carer acknowledgement (mandatory) ───────────────
  {
    id: 'NG27-M-024',
    category: 'Patient Acknowledgement',
    description: 'Patient confirms understanding of plan.',
    mandatory: true,
    evaluate: (d) => d.patientAcknowledgement.patientUnderstandsPlan === 'yes'
  },
  {
    id: 'NG27-M-025',
    category: 'Patient Acknowledgement',
    description: 'Medications explained to patient/carer.',
    mandatory: true,
    evaluate: (d) => d.patientAcknowledgement.medicationsExplained === 'yes'
  },

  // ─── Optional / recommended fields ─────────────────────────────
  {
    id: 'NG27-O-001',
    category: 'Patient Details',
    description: 'Patient address and postcode recorded.',
    mandatory: false,
    evaluate: (d) =>
      nonEmpty(d.patientDetails.address) && nonEmpty(d.patientDetails.postcode)
  },
  {
    id: 'NG27-O-002',
    category: 'Patient Details',
    description: 'Next of kin name and phone recorded.',
    mandatory: false,
    evaluate: (d) =>
      nonEmpty(d.patientDetails.nextOfKinName) &&
      nonEmpty(d.patientDetails.nextOfKinPhone)
  },
  {
    id: 'NG27-O-003',
    category: 'Admission Summary',
    description: 'Clinical narrative / discharge summary text recorded.',
    mandatory: false,
    evaluate: (d) => nonEmpty(d.admissionSummary.clinicalNarrative)
  },
  {
    id: 'NG27-O-004',
    category: 'Diagnoses',
    description: 'Primary diagnosis coded with ICD-10.',
    mandatory: false,
    evaluate: (d) =>
      d.diagnoses.diagnoses.some(
        (x) => x.type === 'primary' && nonEmpty(x.icd10)
      )
  },
  {
    id: 'NG27-O-005',
    category: 'Follow-up',
    description: 'At least one follow-up appointment scheduled.',
    mandatory: false,
    evaluate: (d) =>
      d.followupArrangements.appointments.some(
        (a) => nonEmpty(a.provider) && nonEmpty(a.date)
      )
  },
  {
    id: 'NG27-O-006',
    category: 'Warning Signs',
    description: 'Written information given to patient.',
    mandatory: false,
    evaluate: (d) => d.warningSigns.writtenInfoGiven === 'yes'
  },
  {
    id: 'NG27-O-007',
    category: 'Patient Acknowledgement',
    description: 'Written discharge summary provided to patient.',
    mandatory: false,
    evaluate: (d) => d.patientAcknowledgement.writtenSummaryProvided === 'yes'
  },
  {
    id: 'NG27-O-008',
    category: 'Patient Acknowledgement',
    description: 'Patient questions answered.',
    mandatory: false,
    evaluate: (d) => d.patientAcknowledgement.questionsAnswered === 'yes'
  }
];

export { validationRules };
