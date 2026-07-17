// Static HTML port of the SvelteKit engine. Public symbols are attached to
// window.OrthopaedicsWaitingListCard.

  

  // Steps shown in the wizard.
  export const STEPS = [
    { number: 1, slug: 'practitioner', title: 'Practitioner identification' },
    { number: 2, slug: 'patient', title: 'Patient identification' },
    { number: 3, slug: 'referral', title: 'Referral details' },
    { number: 4, slug: 'waiting-list', title: 'Waiting list entry' },
    { number: 5, slug: 'appointment', title: 'Upcoming appointment' },
    { number: 6, slug: 'communication', title: 'Patient communication' },
    { number: 7, slug: 'signoff', title: 'Sign-off' }
  ];

  export const TOTAL_STEPS = STEPS.length;

  export const createEmptyCard = function createEmptyCard() {
    return {
      status: 'draft',
      entryDate: null,
      entryTime: null,
      practitioner: {
        name: '',
        role: '',
        registrationBody: '',
        registrationNumber: '',
        organisationName: '',
        organisationOdsCode: '',
        siteName: '',
        email: '',
        phone: ''
      },
      patient: {
        name: '',
        birthDate: null,
        sex: '',
        unitedKingdomNhsNumber: '',
        email: '',
        phone: '',
        postalAddressAsFullText: '',
        postcode: '',
        preferredLanguageAsIso6391: '',
        interpreterRequired: '',
        accessibilityNeeds: '',
        preferredContactChannel: ''
      },
      referral: {
        referralSource: '',
        referralDate: null,
        referralLetterReference: '',
        reasonForReferral: '',
        presentingCondition: '',
        icd10Code: '',
        snomedCtCode: '',
        suspectedCancer: ''
      },
      waitingList: {
        listName: '',
        specialty: '',
        subSpecialty: '',
        procedureDescription: '',
        opcs4Code: '',
        clinicalPriority: '',
        rttClockStartDate: null,
        expectedProcedureType: '',
        expectedWaitWeeks: null
      },
      appointment: {
        appointmentDate: null,
        appointmentTime: null,
        durationMinutes: null,
        appointmentType: '',
        siteName: '',
        siteAddress: '',
        clinicName: '',
        room: '',
        clinicianName: '',
        clinicianTeam: '',
        status: 'scheduled',
        travelNotes: '',
        accessNotes: ''
      },
      communication: {
        consentToReminders: '',
        communicationNotes: ''
      },
      signoff: {
        additionalNotes: '',
        signedAt: null
      }
    };
  };
