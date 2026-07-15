// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Medical Error Report form.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage.

/**
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'yes' | 'no' | 'not-applicable' | ''} YesNoNA
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'doctor' | 'nurse' | 'pharmacist' | 'allied-health' | 'administrator' | 'patient' | 'other' | ''} ReporterRole
 * @typedef {'inpatient-ward' | 'outpatient-clinic' | 'emergency-department' | 'operating-theatre' | 'pharmacy' | 'laboratory' | 'radiology' | 'community' | 'other' | ''} LocationType
 * @typedef {'day' | 'evening' | 'night' | 'weekend' | 'bank-holiday' | ''} ShiftType
 * @typedef {'adequate' | 'understaffed' | 'overstaffed' | 'unknown' | ''} StaffingLevel
 * @typedef {'medication' | 'surgical' | 'diagnostic' | 'treatment' | 'communication' | 'equipment' | 'fall' | 'infection' | 'transfusion' | 'other' | ''} ErrorType
 * @typedef {'prescribing' | 'dispensing' | 'administration' | 'monitoring' | 'other' | ''} MedicationErrorStage
 * @typedef {'near-miss' | 'mild' | 'moderate' | 'severe' | 'critical' | ''} WHOSeverity
 * @typedef {'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | ''} NCCMERPCategory
 * @typedef {'clearly-preventable' | 'probably-preventable' | 'probably-not-preventable' | 'clearly-not-preventable' | 'unknown' | ''} Preventability
 * @typedef {'very-likely' | 'likely' | 'unlikely' | 'very-unlikely' | 'unknown' | ''} RecurrenceLikelihood
 * @typedef {'none' | 'low' | 'moderate' | 'severe' | 'death' | ''} HarmLevel
 * @typedef {'human-error' | 'system-failure' | 'process-failure' | 'communication' | 'training' | 'equipment' | 'environmental' | 'organisational' | 'multiple' | 'other' | ''} RootCauseCategory
 * @typedef {'planned' | 'in-progress' | 'completed' | 'overdue' | ''} ActionsStatus
 * @typedef {'open' | 'under-review' | 'closed' | ''} FinalStatus
 * @typedef {'yes' | 'no' | 'pending' | ''} RcaConducted
 * @typedef {'yes' | 'no' | 'unknown' | ''} SimilarIncidents
 * @typedef {'low' | 'moderate' | 'high' | 'critical'} RiskLevel
 */

/**
 * @typedef {Object} AdditionalFlag
 * @property {string} id
 * @property {string} category
 * @property {string} message
 * @property {'high' | 'medium' | 'low'} priority
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {number} grade
 */

/**
 * @typedef {Object} GradingResult
 * @property {WHOSeverity} whoSeverity
 * @property {NCCMERPCategory} nccMerpCategory
 * @property {RiskLevel} overallRisk
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

/** Build a fresh, fully-blank assessment. */
function emptyAssessment() {
  return {
    demographics: {
      reporterFirstName: '',
      reporterLastName: '',
      reporterRole: '',
      reporterDepartment: '',
      reporterContactPhone: '',
      reporterContactEmail: '',
      facilityName: '',
      facilityWard: '',
      reportDate: '',
      anonymousReport: ''
    },
    incidentDetails: {
      incidentDate: '',
      incidentTime: '',
      discoveryDate: '',
      discoveryTime: '',
      locationType: '',
      locationDetails: '',
      incidentSummary: '',
      incidentWitnessed: '',
      witnessDetails: '',
      shiftType: '',
      staffingLevel: ''
    },
    patientInvolvement: {
      patientInvolved: '',
      patientFirstName: '',
      patientLastName: '',
      patientNhsNumber: '',
      patientDateOfBirth: '',
      patientSex: '',
      patientAgeAtIncident: null,
      patientInformed: '',
      patientInformedDate: '',
      patientInformedBy: '',
      dutyOfCandourApplies: '',
      dutyOfCandourCompleted: ''
    },
    errorClassification: {
      errorType: '',
      errorTypeDetails: '',
      medicationErrorStage: '',
      whoSeverity: '',
      nccMerpCategory: '',
      preventability: '',
      recurrenceLikelihood: ''
    },
    contributingFactors: {
      staffFatigue: '',
      inadequateTraining: '',
      communicationFailure: '',
      communicationFailureDetails: '',
      handoverFailure: '',
      equipmentFailure: '',
      equipmentFailureDetails: '',
      environmentalFactors: '',
      environmentalDetails: '',
      policyNotFollowed: '',
      policyDetails: '',
      workloadPressure: '',
      patientFactors: '',
      patientFactorsDetails: '',
      otherFactors: ''
    },
    immediateActions: {
      patientAssessed: '',
      treatmentProvided: '',
      treatmentDetails: '',
      errorContained: '',
      containmentDetails: '',
      seniorStaffNotified: '',
      seniorStaffName: '',
      seniorStaffRole: '',
      riskTeamNotified: '',
      additionalMonitoring: '',
      monitoringDetails: '',
      immediateActionsSummary: ''
    },
    patientOutcome: {
      harmReachedPatient: '',
      harmLevel: '',
      harmDescription: '',
      additionalTreatmentRequired: '',
      additionalTreatmentDetails: '',
      extendedHospitalStay: '',
      extraDays: null,
      readmissionRequired: '',
      permanentDisability: '',
      disabilityDetails: '',
      patientDied: '',
      deathDate: '',
      outcomeNotes: ''
    },
    rootCauseAnalysis: {
      rcaConducted: '',
      rcaDate: '',
      rcaLead: '',
      rcaTeamMembers: '',
      rootCauseCategory: '',
      rootCauseDescription: '',
      fiveWhysAnalysis: '',
      fishboneFactors: '',
      systemVulnerabilities: '',
      similarIncidents: '',
      similarIncidentsDetails: '',
      rcaFindingsSummary: ''
    },
    correctiveActions: {
      immediateCorrectiveActions: '',
      longTermCorrectiveActions: '',
      policyChangeRequired: '',
      policyChangeDetails: '',
      trainingRequired: '',
      trainingDetails: '',
      equipmentChangeRequired: '',
      equipmentChangeDetails: '',
      processRedesignRequired: '',
      processRedesignDetails: '',
      responsiblePerson: '',
      targetCompletionDate: '',
      actionsStatus: ''
    },
    reportingFollowup: {
      internalReference: '',
      reportedToDatix: '',
      datixReference: '',
      reportedToNrls: '',
      nrlsReference: '',
      reportedToCqc: '',
      reportedToHsib: '',
      reportedToCoroner: '',
      safeguardingReferral: '',
      lessonsLearned: '',
      sharedWithTeam: '',
      followUpReviewDate: '',
      followUpReviewer: '',
      finalStatus: '',
      closureDate: ''
    }
  };
}

/** WHO Severity Scale label. */
function whoSeverityLabel(severity) {
  switch (severity) {
    case 'near-miss': return 'Near Miss - No harm reached patient';
    case 'mild': return 'Mild - Temporary minor harm';
    case 'moderate': return 'Moderate - Temporary significant harm';
    case 'severe': return 'Severe - Permanent harm';
    case 'critical': return 'Critical - Death or life-threatening';
    default: return 'Not classified';
  }
}

/** NCC MERP Category label. */
function nccMerpLabel(category) {
  switch (category) {
    case 'A': return 'Category A - Capacity to cause error';
    case 'B': return 'Category B - Error did not reach patient';
    case 'C': return 'Category C - Reached patient, no harm';
    case 'D': return 'Category D - Required monitoring, no harm';
    case 'E': return 'Category E - Temporary harm, intervention required';
    case 'F': return 'Category F - Temporary harm, hospitalisation';
    case 'G': return 'Category G - Permanent harm';
    case 'H': return 'Category H - Intervention to sustain life';
    case 'I': return 'Category I - Patient death';
    default: return 'Not classified';
  }
}

/** Overall risk level label. */
function riskLevelLabel(risk) {
  switch (risk) {
    case 'low': return 'Low Risk';
    case 'moderate': return 'Moderate Risk';
    case 'high': return 'High Risk';
    case 'critical': return 'Critical Risk';
    default: return '';
  }
}

/** CSS class hint for risk badge. */
function riskLevelClass(risk) {
  switch (risk) {
    case 'low': return 'risk-low';
    case 'moderate': return 'risk-moderate';
    case 'high': return 'risk-high';
    case 'critical': return 'risk-critical';
    default: return '';
  }
}

/** Error type display label. */
function errorTypeLabel(errorType) {
  const labels = {
    medication: 'Medication Error',
    surgical: 'Surgical Error',
    diagnostic: 'Diagnostic Error',
    treatment: 'Treatment Error',
    communication: 'Communication Error',
    equipment: 'Equipment Error',
    fall: 'Fall',
    infection: 'Healthcare-Associated Infection',
    transfusion: 'Transfusion Error',
    other: 'Other'
  };
  return labels[errorType] || errorType || 'Not specified';
}

/** Count contributing factors flagged as 'yes'. */
function countContributingFactors(cf) {
  const fields = [
    cf.staffFatigue,
    cf.inadequateTraining,
    cf.communicationFailure,
    cf.handoverFailure,
    cf.equipmentFailure,
    cf.environmentalFactors,
    cf.policyNotFollowed,
    cf.workloadPressure,
    cf.patientFactors
  ];
  return fields.filter((f) => f === 'yes').length;
}

export { emptyAssessment, whoSeverityLabel, nccMerpLabel, riskLevelLabel, riskLevelClass, errorTypeLabel, countContributingFactors };
