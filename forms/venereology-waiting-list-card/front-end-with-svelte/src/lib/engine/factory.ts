import type { WaitingListCard } from './types.js';

export function createEmptyCard(): WaitingListCard {
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
}
