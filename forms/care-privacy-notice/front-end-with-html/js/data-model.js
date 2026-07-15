// Default form data structure for the Care Privacy Notice
// acknowledgement form. Exposed both as an ES module export (for any
// importer that needs it) and as a classic-script namespace value so the
// page can be opened directly via file:// without CORS blocking.

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
