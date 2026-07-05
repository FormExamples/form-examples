// Plain-JavaScript / JSDoc type definitions for the Neurodiversity Adjustment
// Request form.
//
// Builds the canonical empty `NeurodiversityAdjustmentRequest` shape so
// newly-added fields default correctly when older saved state is rehydrated
// from localStorage. Property names are camelCase to match the front-end serde
// / examples convention. Wrapped in an IIFE; published via
// `window.NeurodiversityAdjustmentRequest`.

(function () {
'use strict';
window.NeurodiversityAdjustmentRequest =
  window.NeurodiversityAdjustmentRequest || {};

/**
 * Build a fresh, fully-blank neurodiversity reasonable-adjustments request.
 * Strings default to ''; numeric / date fields default to null; boolean
 * condition / difficulty / adjustment fields default to false.
 */
function emptyRequest() {
  return {
    worker: {
      name: '',
      jobTitle: '',
      department: '',
      employmentType: '',
      workPattern: '',
      workLocation: '',
      employmentStartDate: '',
      employeeReference: '',
      email: '',
      phone: ''
    },
    manager: {
      name: '',
      role: '',
      jobTitle: '',
      department: '',
      email: '',
      phone: ''
    },
    request: {
      status: 'draft',
      requestedBy: 'worker',
      requestDate: '',
      requestedStartDate: ''
    },
    profile: {
      conditionAdhd: false,
      conditionAutism: false,
      conditionDyslexia: false,
      conditionDyspraxia: false,
      conditionDyscalculia: false,
      conditionTourettes: false,
      conditionOther: false,
      conditionOtherDetail: '',
      diagnosisStatus: '',
      considersDisability: '',
      substantialLongTermImpact: false,
      disclosureConsent: false
    },
    difficulties: {
      difficultyConcentration: false,
      difficultyWrittenCommunication: false,
      difficultyOrganisationTime: false,
      difficultySensoryOverload: false,
      difficultyBalanceCoordination: false,
      difficultySocialCommunication: false,
      difficultyMemory: false,
      difficultyBurnoutWellbeing: false,
      tasksSituationsAffected: '',
      workerStrengths: ''
    },
    adjustments: {
      adjustmentWorkingEnvironment: false,
      adjustmentEquipmentTechnology: false,
      adjustmentWorkingArrangements: false,
      adjustmentCommunication: false,
      adjustmentSupportMentoring: false,
      adjustmentRecruitmentProcess: false,
      adjustmentPolicyDress: false,
      adjustmentOther: false,
      adjustmentsRequestedDetail: ''
    },
    evidence: {
      supportingEvidenceType: '',
      occupationalHealthInvolved: false,
      accessToWorkInvolved: false
    },
    impact: {
      currentImpact: '',
      atRiskOfAbsence: false,
      urgency: 'routine',
      notes: ''
    }
  };
}

/** Pretty label for a diagnosis status. */
const DIAGNOSIS_STATUS_LABELS = {
  'diagnosed': 'Diagnosed',
  'self-identified': 'Self-identified',
  'awaiting-assessment': 'Awaiting assessment',
  'prefer-not-to-say': 'Prefer not to say'
};

/** Human-readable label for a diagnosis status, falling back to the raw value. */
function diagnosisStatusLabel(value) {
  return DIAGNOSIS_STATUS_LABELS[value] || value || '';
}

/** Pretty label for a current-impact level. */
const IMPACT_LABELS = {
  'low': 'Low',
  'moderate': 'Moderate',
  'high': 'High',
  'severe': 'Severe'
};

/** Human-readable label for a current-impact level, falling back to the raw value. */
function impactLabel(value) {
  return IMPACT_LABELS[value] || value || '';
}

Object.assign(window.NeurodiversityAdjustmentRequest, {
  emptyRequest,
  diagnosisStatusLabel,
  impactLabel,
  DIAGNOSIS_STATUS_LABELS,
  IMPACT_LABELS
});
})();
