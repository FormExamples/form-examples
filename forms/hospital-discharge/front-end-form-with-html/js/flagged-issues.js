// Flagged-issue detection for the hospital discharge form. Independent of
// the NG27 completeness validator (which counts satisfied/unsatisfied
// fields), this module raises clinician-facing flags for safety-critical
// gaps and risk patterns: missing reconciliation, unsigned-off summaries,
// pending investigations without a results-chasing plan, no GP follow-up
// when needed, no carer involvement for vulnerable destinations, etc.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').AdditionalFlag} AdditionalFlag
 */

// Wrapped in an IIFE; published via window.HospitalDischarge.
(function () {
'use strict';
window.HospitalDischarge = window.HospitalDischarge || {};

/**
 * @param {AssessmentData} data
 * @returns {AdditionalFlag[]}
 */
function detectAdditionalFlags(data) {
  /** @type {AdditionalFlag[]} */
  const flags = [];

  // ─── Safety-critical: medication reconciliation ────────────
  if (data.dischargeMedications.reconciliationCompleted === 'no') {
    flags.push({
      id: 'FLAG-MEDS-001',
      category: 'Discharge Medications',
      message: 'Medication reconciliation NOT completed - high risk of medication error on discharge.',
      priority: 'urgent'
    });
  }

  if (data.dischargeMedications.allergiesReviewed === 'no') {
    flags.push({
      id: 'FLAG-MEDS-002',
      category: 'Discharge Medications',
      message: 'Allergies NOT reviewed - serious safety concern.',
      priority: 'urgent'
    });
  }

  if (
    data.dischargeMedications.medications.length > 0 &&
    data.dischargeMedications.medications.some(
      (m) => !m.name || !m.dose || !m.frequency
    )
  ) {
    flags.push({
      id: 'FLAG-MEDS-003',
      category: 'Discharge Medications',
      message: 'One or more medications missing dose, route, or frequency.',
      priority: 'high'
    });
  }

  // ─── Pending investigations without chase plan ──────────────
  if (
    data.followupArrangements.investigationsPending === 'yes' &&
    data.followupArrangements.resultsToBeChasedByGp !== 'yes'
  ) {
    flags.push({
      id: 'FLAG-FU-001',
      category: 'Follow-up',
      message: 'Investigations pending but no clear plan for chasing results.',
      priority: 'high'
    });
  }

  // ─── No follow-up at all ────────────────────────────────────
  if (
    data.followupArrangements.gpFollowupRequired === 'no' &&
    data.followupArrangements.outpatientFollowupRequired === 'no' &&
    data.followupArrangements.appointments.length === 0
  ) {
    flags.push({
      id: 'FLAG-FU-002',
      category: 'Follow-up',
      message: 'No follow-up arranged - confirm this is appropriate for the diagnosis.',
      priority: 'medium'
    });
  }

  // ─── Diagnosis quality ──────────────────────────────────────
  const primaryDxCount = data.diagnoses.diagnoses.filter(
    (x) => x.type === 'primary' && x.description
  ).length;
  if (primaryDxCount === 0) {
    flags.push({
      id: 'FLAG-DX-001',
      category: 'Diagnoses',
      message: 'No primary diagnosis recorded.',
      priority: 'high'
    });
  } else if (primaryDxCount > 1) {
    flags.push({
      id: 'FLAG-DX-002',
      category: 'Diagnoses',
      message: `${primaryDxCount} primary diagnoses recorded - typically only one is expected.`,
      priority: 'medium'
    });
  }

  if (
    data.diagnoses.diagnoses.length > 0 &&
    data.diagnoses.diagnoses.every((x) => !x.icd10)
  ) {
    flags.push({
      id: 'FLAG-DX-003',
      category: 'Diagnoses',
      message: 'No ICD-10 codes assigned to any diagnosis - coding required for tariff and audit.',
      priority: 'low'
    });
  }

  // ─── Discharge destination / vulnerability ──────────────────
  const destination = data.communityCareInstructions.dischargeDestination;
  if (
    (destination === 'care-home' || destination === 'nursing-home') &&
    data.patientAcknowledgement.carerInformed !== 'yes'
  ) {
    flags.push({
      id: 'FLAG-DEST-001',
      category: 'Community Care',
      message: 'Discharge to care/nursing home but carer or care-home staff not informed.',
      priority: 'high'
    });
  }

  if (
    destination === 'home' &&
    data.communityCareInstructions.careResponsibility === 'self' &&
    data.communityCareInstructions.packageOfCareInPlace !== 'yes'
  ) {
    // Soft flag only; many self-caring patients don't need a package
    if (
      data.communityCareInstructions.districtNurseReferral === 'yes' ||
      data.communityCareInstructions.physiotherapyReferral === 'yes' ||
      data.communityCareInstructions.occupationalTherapyReferral === 'yes'
    ) {
      flags.push({
        id: 'FLAG-DEST-002',
        category: 'Community Care',
        message: 'Patient self-caring at home with active community referrals but no package of care recorded.',
        priority: 'medium'
      });
    }
  }

  // ─── Length of stay anomalies ───────────────────────────────
  const adm = data.admissionSummary.admissionDate;
  const dis = data.admissionSummary.dischargeDate;
  if (adm && dis) {
    const a = new Date(adm).getTime();
    const d = new Date(dis).getTime();
    if (!isNaN(a) && !isNaN(d)) {
      if (d < a) {
        flags.push({
          id: 'FLAG-DATE-001',
          category: 'Admission Summary',
          message: 'Discharge date is before admission date.',
          priority: 'urgent'
        });
      } else {
        const days = Math.round((d - a) / (1000 * 60 * 60 * 24));
        if (days >= 21) {
          flags.push({
            id: 'FLAG-DATE-002',
            category: 'Admission Summary',
            message: `Length of stay ${days} days - prolonged stay; review for delayed discharge.`,
            priority: 'medium'
          });
        }
      }
    }
  }

  // ─── Sign-off integrity ─────────────────────────────────────
  if (data.clinicianSignoff.responsibleConsultantInformed === 'no') {
    flags.push({
      id: 'FLAG-SIGN-001',
      category: 'Clinician Sign-off',
      message: 'Responsible consultant NOT informed of discharge.',
      priority: 'high'
    });
  }

  // ─── Patient comprehension ──────────────────────────────────
  if (data.patientAcknowledgement.patientUnderstandsPlan === 'no') {
    flags.push({
      id: 'FLAG-ACK-001',
      category: 'Patient Acknowledgement',
      message: 'Patient does NOT confirm understanding of discharge plan.',
      priority: 'urgent'
    });
  }

  if (data.patientAcknowledgement.questionsAnswered === 'no') {
    flags.push({
      id: 'FLAG-ACK-002',
      category: 'Patient Acknowledgement',
      message: 'Patient questions not yet fully answered.',
      priority: 'medium'
    });
  }

  if (data.patientAcknowledgement.writtenSummaryProvided === 'no') {
    flags.push({
      id: 'FLAG-ACK-003',
      category: 'Patient Acknowledgement',
      message: 'No written discharge summary provided to patient.',
      priority: 'medium'
    });
  }

  // ─── Safety-netting ─────────────────────────────────────────
  if (data.warningSigns.safetyNetingProvided === 'no') {
    flags.push({
      id: 'FLAG-SAFE-001',
      category: 'Warning Signs',
      message: 'Safety-netting advice NOT provided - required by NICE NG27.',
      priority: 'high'
    });
  }

  if (data.warningSigns.writtenInfoGiven === 'no') {
    flags.push({
      id: 'FLAG-SAFE-002',
      category: 'Warning Signs',
      message: 'No written information given on warning signs.',
      priority: 'low'
    });
  }

  // Sort: urgent > high > medium > low
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

window.HospitalDischarge.detectAdditionalFlags = detectAdditionalFlags;
})();
