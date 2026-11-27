// Plain-JavaScript / JSDoc type definitions for the Medical Haematopoietic Stem Cell Transplant Patients/Donors HLA Typing Request form.
//
// Builds the canonical empty request so newly-added fields default correctly
// when older saved state is rehydrated from localStorage. Property names are
// camelCase to match the front-end serde / examples convention.
//
// One request is completed per person sampled: the recipient, or a potential
// donor (for whom the recipient is named so the laboratory can pair samples).

/** Sample requirement per role: tube volumes in mL (local policy defaults). */
const SAMPLE_REQUIREMENTS = {
  'hsct-recipient': { edtaPurple: 18, edtaPink: 6, clottedRed: 6 },
  'potential-donor': { edtaPurple: 10, edtaPink: 6, clottedRed: 0 }
};

function emptyRequest() {
  return {
    subject: {
      familyName: '',
      givenNames: '',
      previousName: '',
      birthDate: '',
      sex: '',
      ethnicity: '',
      nationalHealthIdentifier: '',
      medicalRecordNumber: '',
      address: '',
      postcode: ''
    },
    referrer: {
      clinicianName: '',
      clinicianRole: '',
      clinicianEmail: '',
      department: '',
      organization: '',
      copyOfReportTo: '',
      reportEmail: ''
    },
    request: {
      subjectRole: '',
      donorType: '',
      hlaTypingResolution: '',
      clinicalDetails: ''
    },
    recipient: {
      recipientFamilyName: '',
      recipientGivenNames: '',
      recipientMedicalRecordNumber: '',
      recipientBirthDate: '',
      relationshipToRecipient: ''
    },
    urgency: {
      urgentTesting: false,
      urgentTestingReason: ''
    },
    requester: {
      requestedBySignedAt: '',
      consentAndIdentityConfirmed: false
    },
    sample: {
      sampleCollectorName: '',
      sampleCollectedAt: '',
      identifiersOnSampleCount: null,
      identifiersOnFormCount: null,
      sampleAndFormDetailsMatch: false,
      edtaPurpleVolumeMl: null,
      edtaPinkVolumeMl: null,
      clottedRedVolumeMl: null,
      samplesOtherDescription: ''
    },
    lab: {
      laboratoryRecipientIdentifier: '',
      laboratoryDonorIdentifier: '',
      laboratorySampleNumber: '',
      laboratorySampleReceivedAt: '',
      laboratoryIdentifiersCheckedBy: ''
    }
  };
}

const ROLE_LABELS = {
  'hsct-recipient': 'HSCT recipient',
  'potential-donor': 'Potential donor'
};

const DONOR_TYPE_LABELS = {
  'matched-sibling': 'Matched sibling',
  'haploidentical-relative': 'Haploidentical relative',
  'other-relative': 'Other relative',
  'unrelated-volunteer': 'Unrelated volunteer',
  'unknown': 'Unknown'
};

const RESOLUTION_LABELS = {
  'not-specified': 'Not specified',
  'low': 'Low resolution',
  'high': 'High resolution'
};

function roleLabel(value) {
  return ROLE_LABELS[value] || value || '';
}

function donorTypeLabel(value) {
  return DONOR_TYPE_LABELS[value] || value || '';
}

export {
  emptyRequest, roleLabel, donorTypeLabel,
  SAMPLE_REQUIREMENTS, ROLE_LABELS, DONOR_TYPE_LABELS, RESOLUTION_LABELS
};
