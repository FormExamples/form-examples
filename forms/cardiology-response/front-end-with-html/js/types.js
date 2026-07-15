// Plain-JavaScript / JSDoc type definitions for the Cardiology Response form.
//
// Builds the canonical empty `CardiologyResponse` shape so newly-added fields
// default correctly when older saved state is rehydrated from localStorage.
// Property names are camelCase to match the front-end serde / examples
// convention.

/**
 * Build a fresh, fully-blank cardiology response (consult reply).
 * Strings default to ''; numeric / date fields default to null;
 * boolean structured-finding / sign-off fields default to false.
 *
 * The shape is grouped into front-end sections (identification, patient,
 * assessment, findings, diagnosis, management, signOff) so the wizard can bind
 * `state[section][field]`. The flat engine model expected by the grader is
 * produced by `flatten(data)`.
 */
function emptyResponse() {
  return {
    identification: {
      respondingClinician: '',
      originatingRequestReference: '',
      responseStatus: '',
      consultationType: '',
      assessedDate: '',
      respondedDate: ''
    },
    patient: {
      patientName: '',
      patientNhsNumber: '',
      patientBirthDate: ''
    },
    assessment: {
      clinicalSummary: '',
      examinationFindings: '',
      investigationsPerformed: ''
    },
    findings: {
      ischaemiaOrCad: false,
      significantArrhythmia: false,
      reducedEjectionFraction: false,
      significantValveDisease: false,
      structuralAbnormality: false,
      uncontrolledHypertension: false,
      nonCardiacCause: false
    },
    diagnosis: {
      primaryDiagnosisCategory: '',
      diagnosisNarrative: '',
      lvEjectionFractionPercent: null
    },
    management: {
      managementPlan: '',
      medicationChanges: '',
      recommendedFollowUp: ''
    },
    signOff: {
      criticalResult: false,
      criticalResultCommunicated: false,
      reportedTo: '',
      clinicianNotes: '',
      signed: false
    }
  };
}

/**
 * Flatten the grouped wizard state into the single-level engine model the
 * grader and rule sets consume (matching the svelte `CardiologyResponse`).
 */
function flatten(s) {
  return {
    respondingClinician: s.identification.respondingClinician,
    originatingRequestReference: s.identification.originatingRequestReference,
    responseStatus: s.identification.responseStatus,
    consultationType: s.identification.consultationType,
    assessedDate: s.identification.assessedDate,
    respondedDate: s.identification.respondedDate,

    patientName: s.patient.patientName,
    patientNhsNumber: s.patient.patientNhsNumber,
    patientBirthDate: s.patient.patientBirthDate,

    clinicalSummary: s.assessment.clinicalSummary,
    examinationFindings: s.assessment.examinationFindings,
    investigationsPerformed: s.assessment.investigationsPerformed,

    ischaemiaOrCad: s.findings.ischaemiaOrCad,
    significantArrhythmia: s.findings.significantArrhythmia,
    reducedEjectionFraction: s.findings.reducedEjectionFraction,
    significantValveDisease: s.findings.significantValveDisease,
    structuralAbnormality: s.findings.structuralAbnormality,
    uncontrolledHypertension: s.findings.uncontrolledHypertension,
    nonCardiacCause: s.findings.nonCardiacCause,

    primaryDiagnosisCategory: s.diagnosis.primaryDiagnosisCategory,
    diagnosisNarrative: s.diagnosis.diagnosisNarrative,
    lvEjectionFractionPercent: s.diagnosis.lvEjectionFractionPercent,

    managementPlan: s.management.managementPlan,
    medicationChanges: s.management.medicationChanges,
    recommendedFollowUp: s.management.recommendedFollowUp,

    criticalResult: s.signOff.criticalResult,
    criticalResultCommunicated: s.signOff.criticalResultCommunicated,
    reportedTo: s.signOff.reportedTo,
    clinicianNotes: s.signOff.clinicianNotes,
    signed: s.signOff.signed
  };
}

// ----------------------------------------------------------------------
// Structured-findings predicates (mirror engine/utils.ts)
// ----------------------------------------------------------------------

/** A critical result auto-escalates Axis D and raises the critical-finding flag. */
function hasCriticalFinding(r) {
  return r.criticalResult === true;
}

/** Whether any structured cardiac finding is present. */
function hasAnyCardiacFinding(r) {
  return (
    r.ischaemiaOrCad ||
    r.significantArrhythmia ||
    r.reducedEjectionFraction ||
    r.significantValveDisease ||
    r.structuralAbnormality ||
    r.uncontrolledHypertension
  );
}

/** Reduced ejection fraction is present if the flag is set or LVEF < 40 %. */
function hasReducedEjectionFraction(r) {
  return (
    r.reducedEjectionFraction ||
    (r.lvEjectionFractionPercent !== null && r.lvEjectionFractionPercent < 40)
  );
}

// ----------------------------------------------------------------------
// Display labels (mirror engine/utils.ts)
// ----------------------------------------------------------------------

/** Axis A response-classification display label. */
function responseClassificationLabel(value) {
  switch (value) {
    case 'no-abnormality': return 'No abnormality';
    case 'cardiac-condition': return 'Cardiac condition';
    case 'critical': return 'Critical';
    case 'inconclusive': return 'Inconclusive';
    default: return 'Not graded';
  }
}

/** Axis B severity display label. */
function severityLabel(value) {
  switch (value) {
    case 'none': return 'None';
    case 'minor': return 'Minor';
    case 'moderate': return 'Moderate';
    case 'major': return 'Major';
    default: return 'Not graded';
  }
}

/** Axis D follow-up-urgency display label. */
function followUpUrgencyLabel(value) {
  switch (value) {
    case 'routine': return 'Routine';
    case 'recommended': return 'Recommended';
    case 'urgent': return 'Urgent';
    case 'critical-alert': return 'Critical alert';
    default: return 'Not graded';
  }
}

/** Human-readable consultation-type label. */
function consultationTypeLabel(value) {
  switch (value) {
    case 'clinic-review': return 'Clinic review';
    case 'advice-and-guidance': return 'Advice and guidance';
    case 'telephone': return 'Telephone';
    case 'inpatient-review': return 'Inpatient review';
    case 'virtual': return 'Virtual';
    default: return 'Unspecified';
  }
}

/** Human-readable response-status label. */
function responseStatusLabel(value) {
  switch (value) {
    case 'preliminary': return 'Preliminary';
    case 'final': return 'Final';
    case 'amended': return 'Amended';
    case 'cancelled': return 'Cancelled';
    default: return 'Unspecified';
  }
}

/** Human-readable primary-diagnosis-category label. */
function primaryDiagnosisCategoryLabel(value) {
  switch (value) {
    case 'coronary-artery-disease': return 'Coronary artery disease';
    case 'heart-failure': return 'Heart failure';
    case 'arrhythmia': return 'Arrhythmia';
    case 'valve-disease': return 'Valve disease';
    case 'hypertension': return 'Hypertension';
    case 'cardiomyopathy': return 'Cardiomyopathy';
    case 'non-cardiac': return 'Non-cardiac';
    case 'no-abnormality': return 'No abnormality';
    case 'other': return 'Other';
    default: return 'Unspecified';
  }
}

/** Overall-recommendation display label. */
function recommendationLabel(value) {
  switch (value) {
    case 'no-action': return 'No action';
    case 'routine-follow-up': return 'Routine follow-up';
    case 'further-investigation': return 'Further investigation';
    case 'specialist-management': return 'Specialist management';
    case 'urgent-review': return 'Urgent review';
    default: return 'Not graded';
  }
}

export { emptyResponse, flatten, hasCriticalFinding, hasAnyCardiacFinding, hasReducedEjectionFraction, responseClassificationLabel, severityLabel, followUpUrgencyLabel, consultationTypeLabel, responseStatusLabel, primaryDiagnosisCategoryLabel, recommendationLabel };
