// Provider Transfer Request - SBAR completeness validation rules.
//
// Each rule maps to one tracked field. Rules are tagged `mandatory: true` when
// the SBAR + logistics handover requires the field to proceed safely. A
// missing mandatory field downgrades completeness to "Incomplete"; missing
// non-mandatory fields downgrade to "Partial". Conditional rules (escort
// details only when escort is required, infectious-precautions detail only
// when ticked, receiving-provider acknowledgement gated until any
// acknowledgement field is touched) are guarded by `applies()`.
//
// Rule IDs follow <SECTION-PREFIX>-NN; the prefix is used by the report to
// group fired rules under the matching SBAR section.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 *
 * @typedef {Object} ValidationRule
 * @property {string} id
 * @property {string} section
 * @property {string} description
 * @property {boolean} mandatory
 * @property {(d: AssessmentData) => boolean} applies
 * @property {(d: AssessmentData) => boolean} isSatisfied
 */

(function () {
'use strict';
window.ProviderTransferRequest = window.ProviderTransferRequest || {};
const { hasText, isYesNoUnknownAnswered, acknowledgementStarted } =
  window.ProviderTransferRequest;

/** @type {ValidationRule[]} */
const validationRules = [
  // --- Step 1 - Requesting Provider Details ---------------------------
  {
    id: 'REQ-01',
    section: 'requestingProvider',
    description: 'Requesting clinician name is required.',
    mandatory: true,
    applies: () => true,
    isSatisfied: (d) => hasText(d.requestingProvider.clinicianName)
  },
  {
    id: 'REQ-02',
    section: 'requestingProvider',
    description: 'Requesting clinician role is required.',
    mandatory: true,
    applies: () => true,
    isSatisfied: (d) => hasText(d.requestingProvider.clinicianRole)
  },
  {
    id: 'REQ-03',
    section: 'requestingProvider',
    description: 'Requesting organisation is required.',
    mandatory: true,
    applies: () => true,
    isSatisfied: (d) => hasText(d.requestingProvider.organisation)
  },
  {
    id: 'REQ-04',
    section: 'requestingProvider',
    description: 'Requesting clinician contact phone is required.',
    mandatory: true,
    applies: () => true,
    isSatisfied: (d) => hasText(d.requestingProvider.phone)
  },
  {
    id: 'REQ-05',
    section: 'requestingProvider',
    description: 'Requesting clinician ward/unit (recommended).',
    mandatory: false,
    applies: () => true,
    isSatisfied: (d) => hasText(d.requestingProvider.ward)
  },
  {
    id: 'REQ-06',
    section: 'requestingProvider',
    description: 'Requesting clinician email (recommended).',
    mandatory: false,
    applies: () => true,
    isSatisfied: (d) => hasText(d.requestingProvider.email)
  },

  // --- Step 2 - Receiving Provider Details ----------------------------
  {
    id: 'RCV-01',
    section: 'receivingProvider',
    description: 'Receiving clinician name is required.',
    mandatory: true,
    applies: () => true,
    isSatisfied: (d) => hasText(d.receivingProvider.clinicianName)
  },
  {
    id: 'RCV-02',
    section: 'receivingProvider',
    description: 'Receiving clinician role is required.',
    mandatory: true,
    applies: () => true,
    isSatisfied: (d) => hasText(d.receivingProvider.clinicianRole)
  },
  {
    id: 'RCV-03',
    section: 'receivingProvider',
    description: 'Receiving organisation is required.',
    mandatory: true,
    applies: () => true,
    isSatisfied: (d) => hasText(d.receivingProvider.organisation)
  },
  {
    id: 'RCV-04',
    section: 'receivingProvider',
    description: 'Receiving clinician contact phone is required.',
    mandatory: true,
    applies: () => true,
    isSatisfied: (d) => hasText(d.receivingProvider.phone)
  },
  {
    id: 'RCV-05',
    section: 'receivingProvider',
    description: 'Receiving clinician ward/unit (recommended).',
    mandatory: false,
    applies: () => true,
    isSatisfied: (d) => hasText(d.receivingProvider.ward)
  },

  // --- Step 3 - Patient Demographics ----------------------------------
  {
    id: 'PAT-01',
    section: 'patientDemographics',
    description: 'Patient first name is required.',
    mandatory: true,
    applies: () => true,
    isSatisfied: (d) => hasText(d.patientDemographics.firstName)
  },
  {
    id: 'PAT-02',
    section: 'patientDemographics',
    description: 'Patient last name is required.',
    mandatory: true,
    applies: () => true,
    isSatisfied: (d) => hasText(d.patientDemographics.lastName)
  },
  {
    id: 'PAT-03',
    section: 'patientDemographics',
    description: 'Patient date of birth is required.',
    mandatory: true,
    applies: () => true,
    isSatisfied: (d) => hasText(d.patientDemographics.dateOfBirth)
  },
  {
    id: 'PAT-04',
    section: 'patientDemographics',
    description: 'Patient sex is required.',
    mandatory: true,
    applies: () => true,
    isSatisfied: (d) =>
      d.patientDemographics.sex === 'male' ||
      d.patientDemographics.sex === 'female' ||
      d.patientDemographics.sex === 'other' ||
      d.patientDemographics.sex === 'unknown'
  },
  {
    id: 'PAT-05',
    section: 'patientDemographics',
    description: 'NHS number or hospital number is required.',
    mandatory: true,
    applies: () => true,
    isSatisfied: (d) =>
      hasText(d.patientDemographics.nhsNumber) ||
      hasText(d.patientDemographics.hospitalNumber)
  },
  {
    id: 'PAT-06',
    section: 'patientDemographics',
    description: 'Next of kin contact (recommended).',
    mandatory: false,
    applies: () => true,
    isSatisfied: (d) =>
      hasText(d.patientDemographics.nextOfKinName) ||
      hasText(d.patientDemographics.nextOfKinPhone)
  },

  // --- Step 4 - Situation ---------------------------------------------
  {
    id: 'SIT-01',
    section: 'situation',
    description: 'Reason for transfer is required.',
    mandatory: true,
    applies: () => true,
    isSatisfied: (d) => hasText(d.situation.reasonForTransfer)
  },
  {
    id: 'SIT-02',
    section: 'situation',
    description: 'Primary diagnosis is required.',
    mandatory: true,
    applies: () => true,
    isSatisfied: (d) => hasText(d.situation.primaryDiagnosis)
  },
  {
    id: 'SIT-03',
    section: 'situation',
    description: 'Transfer urgency (routine / urgent / emergent) is required.',
    mandatory: true,
    applies: () => true,
    isSatisfied: (d) =>
      d.situation.urgency === 'routine' ||
      d.situation.urgency === 'urgent' ||
      d.situation.urgency === 'emergent'
  },
  {
    id: 'SIT-04',
    section: 'situation',
    description: 'Transfer type is required.',
    mandatory: true,
    applies: () => true,
    isSatisfied: (d) =>
      d.situation.transferType === 'ward-to-ward' ||
      d.situation.transferType === 'inter-hospital' ||
      d.situation.transferType === 'inter-organisation' ||
      d.situation.transferType === 'community'
  },
  {
    id: 'SIT-05',
    section: 'situation',
    description: 'Requested transfer date/time (recommended).',
    mandatory: false,
    applies: () => true,
    isSatisfied: (d) => hasText(d.situation.requestedDateTime)
  },

  // --- Step 5 - Background --------------------------------------------
  {
    id: 'BG-01',
    section: 'background',
    description: 'Presenting complaint is required.',
    mandatory: true,
    applies: () => true,
    isSatisfied: (d) => hasText(d.background.presentingComplaint)
  },
  {
    id: 'BG-02',
    section: 'background',
    description: 'Relevant history of current admission is required.',
    mandatory: true,
    applies: () => true,
    isSatisfied: (d) => hasText(d.background.relevantHistory)
  },
  {
    id: 'BG-03',
    section: 'background',
    description: 'Past medical history (recommended).',
    mandatory: false,
    applies: () => true,
    isSatisfied: (d) => hasText(d.background.pastMedicalHistory)
  },
  {
    id: 'BG-04',
    section: 'background',
    description: 'Current medications are required.',
    mandatory: true,
    applies: () => true,
    isSatisfied: (d) => hasText(d.background.currentMedications)
  },
  {
    id: 'BG-05',
    section: 'background',
    description: 'Allergies / adverse reactions are required (record "NKDA" if none).',
    mandatory: true,
    applies: () => true,
    isSatisfied: (d) => hasText(d.background.allergies)
  },
  {
    id: 'BG-06',
    section: 'background',
    description: 'Recent investigations / results (recommended).',
    mandatory: false,
    applies: () => true,
    isSatisfied: (d) => hasText(d.background.recentInvestigations)
  },
  {
    id: 'BG-07',
    section: 'background',
    description: 'Infection / colonisation status is required.',
    mandatory: true,
    applies: () => true,
    isSatisfied: (d) => hasText(d.background.infectionStatus)
  },

  // --- Step 6 - Assessment --------------------------------------------
  {
    id: 'ASS-01',
    section: 'assessment',
    description: 'Current clinical status (free-text summary) is required.',
    mandatory: true,
    applies: () => true,
    isSatisfied: (d) => hasText(d.assessment.currentClinicalStatus)
  },
  {
    id: 'ASS-02',
    section: 'assessment',
    description: 'Conscious level (awake / drowsy / unresponsive) is required.',
    mandatory: true,
    applies: () => true,
    isSatisfied: (d) =>
      d.assessment.consciousLevel === 'awake' ||
      d.assessment.consciousLevel === 'drowsy' ||
      d.assessment.consciousLevel === 'unresponsive'
  },
  {
    id: 'ASS-03',
    section: 'assessment',
    description: 'Clinically stable for transfer (Yes / No / Unknown) is required.',
    mandatory: true,
    applies: () => true,
    isSatisfied: (d) => isYesNoUnknownAnswered(d.assessment.clinicallyStable)
  },
  {
    id: 'ASS-04',
    section: 'assessment',
    description: 'Stability notes are required when patient is not clinically stable.',
    mandatory: true,
    applies: (d) => d.assessment.clinicallyStable === 'no',
    isSatisfied: (d) => hasText(d.assessment.stabilityNotes)
  },
  {
    id: 'ASS-05',
    section: 'assessment',
    description: 'Latest set of vital signs (recommended).',
    mandatory: false,
    applies: () => true,
    isSatisfied: (d) => {
      const v = d.assessment.vitalSigns;
      return (
        typeof v.heartRate === 'number' ||
        typeof v.respiratoryRate === 'number' ||
        typeof v.systolicBloodPressure === 'number' ||
        typeof v.oxygenSaturation === 'number'
      );
    }
  },

  // --- Step 7 - Recommendation ----------------------------------------
  {
    id: 'REC-01',
    section: 'recommendation',
    description: 'Requested action from the receiving provider is required.',
    mandatory: true,
    applies: () => true,
    isSatisfied: (d) => hasText(d.recommendation.requestedAction)
  },
  {
    id: 'REC-02',
    section: 'recommendation',
    description: 'Expected outcomes / goals of transfer (recommended).',
    mandatory: false,
    applies: () => true,
    isSatisfied: (d) => hasText(d.recommendation.expectedOutcomes)
  },
  {
    id: 'REC-03',
    section: 'recommendation',
    description: 'Ongoing care plan is required.',
    mandatory: true,
    applies: () => true,
    isSatisfied: (d) => hasText(d.recommendation.ongoingCarePlan)
  },
  {
    id: 'REC-04',
    section: 'recommendation',
    description: 'Pending results / follow-up (recommended).',
    mandatory: false,
    applies: () => true,
    isSatisfied: (d) => hasText(d.recommendation.pendingResults)
  },

  // --- Step 8 - Transfer Logistics ------------------------------------
  {
    id: 'LOG-01',
    section: 'transferLogistics',
    description: 'Transport mode is required.',
    mandatory: true,
    applies: () => true,
    isSatisfied: (d) =>
      d.transferLogistics.transportMode === 'self' ||
      d.transferLogistics.transportMode === 'wheelchair' ||
      d.transferLogistics.transportMode === 'stretcher' ||
      d.transferLogistics.transportMode === 'ambulance' ||
      d.transferLogistics.transportMode === 'critical-care-transport'
  },
  {
    id: 'LOG-02',
    section: 'transferLogistics',
    description: 'Planned departure date/time is required.',
    mandatory: true,
    applies: () => true,
    isSatisfied: (d) => hasText(d.transferLogistics.departureDateTime)
  },
  {
    id: 'LOG-03',
    section: 'transferLogistics',
    description: 'Estimated arrival date/time (recommended).',
    mandatory: false,
    applies: () => true,
    isSatisfied: (d) => hasText(d.transferLogistics.estimatedArrivalDateTime)
  },
  {
    id: 'LOG-04',
    section: 'transferLogistics',
    description: 'Escort details are required when an escort is requested.',
    mandatory: true,
    applies: (d) => d.transferLogistics.escortRequired === true,
    isSatisfied: (d) => hasText(d.transferLogistics.escortDetails)
  },
  {
    id: 'LOG-05',
    section: 'transferLogistics',
    description:
      'Infectious-precaution details are required when infectious precautions are flagged.',
    mandatory: true,
    applies: (d) => d.transferLogistics.infectiousPrecautions === true,
    isSatisfied: (d) => hasText(d.transferLogistics.infectiousPrecautionsDetails)
  },

  // --- Step 9 - Sign-off & Acknowledgement ----------------------------
  {
    id: 'SGN-01',
    section: 'signoffAcknowledgement',
    description: 'Requesting provider signature (typed full name) is required.',
    mandatory: true,
    applies: () => true,
    isSatisfied: (d) => hasText(d.signoffAcknowledgement.requestingProviderSignature)
  },
  {
    id: 'SGN-02',
    section: 'signoffAcknowledgement',
    description: 'Requesting provider signature date is required.',
    mandatory: true,
    applies: () => true,
    isSatisfied: (d) => hasText(d.signoffAcknowledgement.requestingProviderSignatureDate)
  },
  // Receiving-provider acknowledgement: only fires once any acknowledgement
  // field has been touched (two-party gating).
  {
    id: 'SGN-03',
    section: 'signoffAcknowledgement',
    description:
      'Receiving provider name is required once acknowledgement has been started.',
    mandatory: true,
    applies: (d) => acknowledgementStarted(d),
    isSatisfied: (d) => hasText(d.signoffAcknowledgement.receivingProviderName)
  },
  {
    id: 'SGN-04',
    section: 'signoffAcknowledgement',
    description:
      'Receiving provider signature is required once acknowledgement has been started.',
    mandatory: true,
    applies: (d) => acknowledgementStarted(d),
    isSatisfied: (d) => hasText(d.signoffAcknowledgement.receivingProviderSignature)
  },
  {
    id: 'SGN-05',
    section: 'signoffAcknowledgement',
    description:
      'Receiving provider signature date is required once acknowledgement has been started.',
    mandatory: true,
    applies: (d) => acknowledgementStarted(d),
    isSatisfied: (d) => hasText(d.signoffAcknowledgement.receivingProviderSignatureDate)
  },
  {
    id: 'SGN-06',
    section: 'signoffAcknowledgement',
    description:
      'Receiving provider acknowledgement checkbox must be ticked to confirm acceptance.',
    mandatory: true,
    applies: (d) => acknowledgementStarted(d),
    isSatisfied: (d) => d.signoffAcknowledgement.acknowledgementReceived === true
  }
];

window.ProviderTransferRequest.validationRules = validationRules;
})();
