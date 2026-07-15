// Default form data structure for the Care Privacy Notice
// acknowledgement form.

function createDefaultData() {
  return {
    config: {
      practiceName: '',
      practiceAddress: '',
      dpoName: '',
      dpoContactDetails: '',
      researchOrganisations: '',
      dataSharingPartners: ''
    },
    acknowledgment: {
      checked: false,
      patientName: '',
      date: ''
    },
    submittedAt: null
  };
}

export { createDefaultData };
