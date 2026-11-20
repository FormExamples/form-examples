import type { DeadlineStatus, Registration, RegistrationClass } from '#lib/engine/types.js';
import { validateRegistration } from '#lib/engine/registration-grader.js';

/** A sample registration: an identifier and the full data the engine grades. */
export interface SampleRegistration {
  id: string;
  deceasedName: string;
  informantName: string;
  updatedAt: string;
  data: Registration;
}

/** A row in the registrations dashboard, derived by running the shared engine. */
export interface DashboardRow {
  id: string;
  deceasedName: string;
  informantName: string;
  registrationClass: RegistrationClass;
  deadlineStatus: DeadlineStatus;
  flagCount: number;
  updatedAt: string;
}

/**
 * The sample registrations are the hand-authored personas in
 * examples/personas.json, so the dashboard and the persona oracle cannot
 * disagree.
 */
export const sampleRegistrations: SampleRegistration[] = [
  {
    id: 'DR-2026-0001',
    deceasedName: 'Ellis, Margaret',
    informantName: 'Ellis, Peter',
    updatedAt: '2026-09-03',
    data: {
      deceased: {
        deceasedName: 'Margaret Ellis',
        sex: 'female',
        dateOfBirth: '1941-03-14',
        dateOfDeath: '2026-08-31',
        placeOfDeath: 'Royal Berkshire Hospital, Reading',
        deathJurisdiction: 'england-wales',
        deceasedParticularsKnown: 'yes'
      },
      medical: {
        mccdReceived: 'yes',
        medicalExaminerStatus: 'confirmed',
        medicalExaminerConfirmationDate: '2026-09-01'
      },
      coroner: {
        referredToCoroner: 'no',
        coronerStage: '',
        coronerCertificateReceived: ''
      },
      informant: {
        informantName: 'Peter Ellis',
        informantRelationship: 'relative-present-at-death',
        informantAddress: '4 Mill Lane, Reading RG1 2AB'
      },
      registration: {
        registerOffice: 'Reading Register Office',
        appointmentBooked: 'yes',
        supportingDocumentsAvailable: 'yes',
        registrationDate: null,
        asOfDate: '2026-09-02'
      },
      aftercare: {
        disposalMethod: 'cremation',
        disposalCertificateIssued: '',
        tellUsOnceStatus: '',
        tellUsOnceReference: '',
        copiesRequested: 5,
        copyOrderChannel: 'at-registration',
        groIndexReference: '',
        priorityService: ''
      }
    }
  },
  {
    id: 'DR-2026-0002',
    deceasedName: 'Fletcher, Rosemary',
    informantName: 'Fletcher, John',
    updatedAt: '2026-09-03',
    data: {
      deceased: {
        deceasedName: 'Rosemary Fletcher',
        sex: 'female',
        dateOfBirth: '1941-03-14',
        dateOfDeath: '2026-08-24',
        placeOfDeath: 'Royal Berkshire Hospital, Reading',
        deathJurisdiction: 'england-wales',
        deceasedParticularsKnown: 'no'
      },
      medical: {
        mccdReceived: 'yes',
        medicalExaminerStatus: 'confirmed',
        medicalExaminerConfirmationDate: '2026-08-25'
      },
      coroner: {
        referredToCoroner: 'no',
        coronerStage: '',
        coronerCertificateReceived: ''
      },
      informant: {
        informantName: 'Peter Ellis',
        informantRelationship: 'person-arranging-funeral',
        informantAddress: '4 Mill Lane, Reading RG1 2AB'
      },
      registration: {
        registerOffice: 'Bristol Register Office',
        appointmentBooked: 'yes',
        supportingDocumentsAvailable: 'yes',
        registrationDate: null,
        asOfDate: '2026-09-03'
      },
      aftercare: {
        disposalMethod: 'burial',
        disposalCertificateIssued: '',
        tellUsOnceStatus: '',
        tellUsOnceReference: '',
        copiesRequested: 3,
        copyOrderChannel: 'at-registration',
        groIndexReference: '',
        priorityService: ''
      }
    }
  },
  {
    id: 'DR-2026-0003',
    deceasedName: 'Hughes, Gareth',
    informantName: 'Hughes, Dilys',
    updatedAt: '2026-09-03',
    data: {
      deceased: {
        deceasedName: 'Gareth Hughes',
        sex: 'male',
        dateOfBirth: '1941-03-14',
        dateOfDeath: '2026-08-28',
        placeOfDeath: 'Royal Berkshire Hospital, Reading',
        deathJurisdiction: 'england-wales',
        deceasedParticularsKnown: 'yes'
      },
      medical: {
        mccdReceived: 'yes',
        medicalExaminerStatus: 'confirmed',
        medicalExaminerConfirmationDate: '2026-08-29'
      },
      coroner: {
        referredToCoroner: 'no',
        coronerStage: '',
        coronerCertificateReceived: ''
      },
      informant: {
        informantName: 'Peter Ellis',
        informantRelationship: 'occupier-of-premises',
        informantAddress: '4 Mill Lane, Reading RG1 2AB'
      },
      registration: {
        registerOffice: 'Cardiff Register Office',
        appointmentBooked: 'yes',
        supportingDocumentsAvailable: 'yes',
        registrationDate: '2026-09-01',
        asOfDate: '2026-09-03'
      },
      aftercare: {
        disposalMethod: 'burial',
        disposalCertificateIssued: 'yes',
        tellUsOnceStatus: 'reference-received',
        tellUsOnceReference: 'TUO-7K3M9Q',
        copiesRequested: 3,
        copyOrderChannel: 'gro-online',
        groIndexReference: 'GRO-2026-118840',
        priorityService: 'yes'
      }
    }
  },
  {
    id: 'DR-2026-0004',
    deceasedName: 'Hughes, Dilys',
    informantName: 'Hughes, Gwen',
    updatedAt: '2026-09-03',
    data: {
      deceased: {
        deceasedName: 'Dilys Hughes',
        sex: 'female',
        dateOfBirth: '1941-03-14',
        dateOfDeath: '2026-08-19',
        placeOfDeath: 'Royal Berkshire Hospital, Reading',
        deathJurisdiction: 'england-wales',
        deceasedParticularsKnown: 'yes'
      },
      medical: {
        mccdReceived: 'yes',
        medicalExaminerStatus: 'confirmed',
        medicalExaminerConfirmationDate: '2026-08-20'
      },
      coroner: {
        referredToCoroner: 'no',
        coronerStage: '',
        coronerCertificateReceived: ''
      },
      informant: {
        informantName: 'Peter Ellis',
        informantRelationship: 'relative-in-district',
        informantAddress: '4 Mill Lane, Reading RG1 2AB'
      },
      registration: {
        registerOffice: 'Swansea Register Office',
        appointmentBooked: 'yes',
        supportingDocumentsAvailable: 'yes',
        registrationDate: '2026-08-30',
        asOfDate: '2026-09-03'
      },
      aftercare: {
        disposalMethod: 'burial',
        disposalCertificateIssued: 'no',
        tellUsOnceStatus: '',
        tellUsOnceReference: '',
        copiesRequested: 2,
        copyOrderChannel: 'gro-online',
        groIndexReference: '',
        priorityService: ''
      }
    }
  },
  {
    id: 'DR-2026-0005',
    deceasedName: 'Okafor, Chidi',
    informantName: 'Okafor, Ngozi',
    updatedAt: '2026-09-03',
    data: {
      deceased: {
        deceasedName: 'Chidi Okafor',
        sex: 'male',
        dateOfBirth: '1941-03-14',
        dateOfDeath: '2026-08-27',
        placeOfDeath: 'Royal Berkshire Hospital, Reading',
        deathJurisdiction: 'england-wales',
        deceasedParticularsKnown: 'yes'
      },
      medical: {
        mccdReceived: '',
        medicalExaminerStatus: '',
        medicalExaminerConfirmationDate: null
      },
      coroner: {
        referredToCoroner: 'yes',
        coronerStage: 'inquest-opened',
        coronerCertificateReceived: 'no'
      },
      informant: {
        informantName: 'Peter Ellis',
        informantRelationship: 'person-present-at-death',
        informantAddress: '4 Mill Lane, Reading RG1 2AB'
      },
      registration: {
        registerOffice: 'Manchester Register Office',
        appointmentBooked: 'no',
        supportingDocumentsAvailable: '',
        registrationDate: null,
        asOfDate: '2026-09-03'
      },
      aftercare: {
        disposalMethod: 'cremation',
        disposalCertificateIssued: '',
        tellUsOnceStatus: '',
        tellUsOnceReference: '',
        copiesRequested: null,
        copyOrderChannel: 'post',
        groIndexReference: '',
        priorityService: 'yes'
      }
    }
  },
  {
    id: 'DR-2026-0006',
    deceasedName: 'Doyle, Sinead',
    informantName: 'Doyle, Brian',
    updatedAt: '2026-09-03',
    data: {
      deceased: {
        deceasedName: 'Sinead Doyle',
        sex: 'female',
        dateOfBirth: '1941-03-14',
        dateOfDeath: '2026-08-26',
        placeOfDeath: 'Royal Berkshire Hospital, Reading',
        deathJurisdiction: 'england-wales',
        deceasedParticularsKnown: 'yes'
      },
      medical: {
        mccdReceived: '',
        medicalExaminerStatus: '',
        medicalExaminerConfirmationDate: null
      },
      coroner: {
        referredToCoroner: 'yes',
        coronerStage: 'released-no-inquest',
        coronerCertificateReceived: 'yes'
      },
      informant: {
        informantName: 'Peter Ellis',
        informantRelationship: 'relative-present-at-death',
        informantAddress: '4 Mill Lane, Reading RG1 2AB'
      },
      registration: {
        registerOffice: 'Leeds Register Office',
        appointmentBooked: 'yes',
        supportingDocumentsAvailable: 'yes',
        registrationDate: null,
        asOfDate: '2026-09-03'
      },
      aftercare: {
        disposalMethod: 'cremation',
        disposalCertificateIssued: '',
        tellUsOnceStatus: '',
        tellUsOnceReference: '',
        copiesRequested: 3,
        copyOrderChannel: 'at-registration',
        groIndexReference: '',
        priorityService: ''
      }
    }
  },
  {
    id: 'DR-2026-0007',
    deceasedName: 'Byrne, Aoife',
    informantName: 'Byrne, Sean',
    updatedAt: '2026-09-03',
    data: {
      deceased: {
        deceasedName: 'Aoife Byrne',
        sex: 'female',
        dateOfBirth: '1941-03-14',
        dateOfDeath: '2026-09-01',
        placeOfDeath: 'Royal Berkshire Hospital, Reading',
        deathJurisdiction: 'scotland',
        deceasedParticularsKnown: 'yes'
      },
      medical: {
        mccdReceived: 'no',
        medicalExaminerStatus: 'pending',
        medicalExaminerConfirmationDate: null
      },
      coroner: {
        referredToCoroner: 'no',
        coronerStage: '',
        coronerCertificateReceived: ''
      },
      informant: {
        informantName: 'Sean Byrne',
        informantRelationship: 'not-qualified',
        informantAddress: '12 High Street, Perth'
      },
      registration: {
        registerOffice: '',
        appointmentBooked: 'no',
        supportingDocumentsAvailable: '',
        registrationDate: null,
        asOfDate: '2026-09-03'
      },
      aftercare: {
        disposalMethod: 'burial',
        disposalCertificateIssued: '',
        tellUsOnceStatus: '',
        tellUsOnceReference: '',
        copiesRequested: 1,
        copyOrderChannel: 'at-registration',
        groIndexReference: '',
        priorityService: ''
      }
    }
  }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleRegistrationRows: DashboardRow[] = sampleRegistrations.map((s) => {
  const r = validateRegistration(s.data);
  return {
    id: s.id,
    deceasedName: s.deceasedName,
    informantName: s.informantName,
    registrationClass: r.registrationClass,
    deadlineStatus: r.deadlineStatus,
    flagCount: r.flaggedIssues.length,
    updatedAt: s.updatedAt
  };
});
