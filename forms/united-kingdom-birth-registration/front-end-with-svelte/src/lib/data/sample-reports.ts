import type { BirthRegistration, ReadinessClass } from '#lib/engine/types.js';
import { validateRegistration } from '#lib/engine/grader.js';

/** A sample application: an identifier and the full data the engine grades. */
export interface SampleRegistration {
  id: string;
  childName: string;
  informantName: string;
  registeredDate: string;
  data: BirthRegistration;
}

/** A row in the registrar dashboard, derived by running the shared engine. */
export interface DashboardRow {
  id: string;
  childName: string;
  informantName: string;
  readinessClass: ReadinessClass;
  daysSinceBirth: number | null;
  lateRegistration: string;
  flagCount: number;
  registeredDate: string;
}

// The sample applications are the first eight personas in
// `examples/personas.json`, so the dashboard's offline sample data and the
// persona oracle cannot disagree.
/** The sample applications, keyed by stable id (used to seed the wizard). */
export const sampleRegistrations: SampleRegistration[] = [
  {
    id: 'BR-2026-0001',
    childName: 'Ellis, Amara',
    informantName: 'Beatrice Ellis',
    registeredDate: '2026-08-13',
    data: {
      child: {
        childForenames: 'Amara Grace',
        childSurname: 'Ellis',
        sex: 'female',
        dateOfBirth: '2026-08-01',
        timeOfBirth: '09:15',
        placeOfBirthType: 'hospital',
        placeOfBirth: 'Royal Berkshire Hospital, London Road, Reading',
        birthCountry: 'england',
        multipleBirth: 'single',
        stillbirth: 'no'
      },
      mother: {
        motherName: 'Beatrice Ellis',
        motherMaidenSurname: 'Hartley',
        motherDateOfBirth: '1991-03-14',
        motherPlaceOfBirth: 'Leeds, England',
        motherOccupation: 'Teacher',
        motherAddress: '14 Orchard Road, Reading RG1 2AB'
      },
      parentage: {
        parentsRelationship: 'married-or-civil-partners',
        marriageDate: '2019-06-15',
        secondParentIncluded: 'yes',
        secondParentName: 'Daniel Ellis',
        secondParentDateOfBirth: '1989-11-02',
        secondParentPlaceOfBirth: 'Bristol, England',
        secondParentOccupation: 'Engineer',
        paternityBasis: 'married-or-civil-partners',
        paternityEvidenceHeld: '',
        licensedClinicTreatment: ''
      },
      informant: {
        informantRelationship: 'mother',
        informantName: 'Beatrice Ellis',
        parentsUnableToRegister: '',
        registrationRoute: 'local-register-office',
        registrationDate: '2026-08-13',
        identityPrimaryDocument: 'passport',
        identitySecondaryCount: 0,
        identityOriginals: 'yes',
        redBookPresented: 'yes'
      },
      certificate: {
        certificatesRequested: 2,
        serviceLevel: 'standard',
        deliveryAddress: '14 Orchard Road, Reading RG1 2AB',
        paymentConfirmed: 'yes',
        applicantNote: ''
      }
    }
  },
  {
    id: 'BR-2026-0002',
    childName: 'Bell, Ruby',
    informantName: 'Beatrice Ellis and Marcus Bell',
    registeredDate: '2026-08-13',
    data: {
      child: {
        childForenames: 'Amara Grace',
        childSurname: 'Ellis',
        sex: 'female',
        dateOfBirth: '2026-08-01',
        timeOfBirth: '09:15',
        placeOfBirthType: 'hospital',
        placeOfBirth: 'Royal Berkshire Hospital, London Road, Reading',
        birthCountry: 'england',
        multipleBirth: 'twins',
        stillbirth: 'no'
      },
      mother: {
        motherName: 'Beatrice Ellis',
        motherMaidenSurname: 'Hartley',
        motherDateOfBirth: '1991-03-14',
        motherPlaceOfBirth: 'Leeds, England',
        motherOccupation: 'Teacher',
        motherAddress: '14 Orchard Road, Reading RG1 2AB'
      },
      parentage: {
        parentsRelationship: 'unmarried',
        marriageDate: null,
        secondParentIncluded: 'yes',
        secondParentName: 'Marcus Bell',
        secondParentDateOfBirth: '1989-11-02',
        secondParentPlaceOfBirth: 'Bristol, England',
        secondParentOccupation: 'Engineer',
        paternityBasis: 'joint-registration',
        paternityEvidenceHeld: '',
        licensedClinicTreatment: ''
      },
      informant: {
        informantRelationship: 'both-parents',
        informantName: 'Beatrice Ellis and Marcus Bell',
        parentsUnableToRegister: '',
        registrationRoute: 'local-register-office',
        registrationDate: '2026-08-13',
        identityPrimaryDocument: 'uk-photocard-driving-licence',
        identitySecondaryCount: 0,
        identityOriginals: 'yes',
        redBookPresented: 'no'
      },
      certificate: {
        certificatesRequested: 2,
        serviceLevel: 'standard',
        deliveryAddress: '14 Orchard Road, Reading RG1 2AB',
        paymentConfirmed: 'yes',
        applicantNote: ''
      }
    }
  },
  {
    id: 'BR-2026-0003',
    childName: 'Ellis, Unknown',
    informantName: 'Not recorded',
    registeredDate: '',
    data: {
      child: {
        childForenames: '',
        childSurname: 'Ellis',
        sex: 'female',
        dateOfBirth: '2026-08-01',
        timeOfBirth: '09:15',
        placeOfBirthType: 'hospital',
        placeOfBirth: 'Royal Berkshire Hospital, London Road, Reading',
        birthCountry: 'england',
        multipleBirth: 'single',
        stillbirth: 'no'
      },
      mother: {
        motherName: '',
        motherMaidenSurname: '',
        motherDateOfBirth: '1991-03-14',
        motherPlaceOfBirth: 'Leeds, England',
        motherOccupation: 'Teacher',
        motherAddress: ''
      },
      parentage: {
        parentsRelationship: 'married-or-civil-partners',
        marriageDate: '2019-06-15',
        secondParentIncluded: 'yes',
        secondParentName: 'Daniel Ellis',
        secondParentDateOfBirth: '1989-11-02',
        secondParentPlaceOfBirth: 'Bristol, England',
        secondParentOccupation: 'Engineer',
        paternityBasis: 'married-or-civil-partners',
        paternityEvidenceHeld: '',
        licensedClinicTreatment: ''
      },
      informant: {
        informantRelationship: 'mother',
        informantName: '',
        parentsUnableToRegister: '',
        registrationRoute: 'local-register-office',
        registrationDate: null,
        identityPrimaryDocument: 'passport',
        identitySecondaryCount: 0,
        identityOriginals: 'yes',
        redBookPresented: 'yes'
      },
      certificate: {
        certificatesRequested: 2,
        serviceLevel: 'standard',
        deliveryAddress: '',
        paymentConfirmed: '',
        applicantNote: ''
      }
    }
  },
  {
    id: 'BR-2026-0004',
    childName: 'Ellis, Noah',
    informantName: 'Beatrice Ellis',
    registeredDate: '2026-08-13',
    data: {
      child: {
        childForenames: 'Amara Grace',
        childSurname: 'Ellis',
        sex: 'female',
        dateOfBirth: '2026-08-01',
        timeOfBirth: '09:15',
        placeOfBirthType: 'hospital',
        placeOfBirth: 'Royal Berkshire Hospital, London Road, Reading',
        birthCountry: 'england',
        multipleBirth: 'single',
        stillbirth: 'no'
      },
      mother: {
        motherName: 'Beatrice Ellis',
        motherMaidenSurname: 'Hartley',
        motherDateOfBirth: '1991-03-14',
        motherPlaceOfBirth: 'Leeds, England',
        motherOccupation: 'Teacher',
        motherAddress: '14 Orchard Road, Reading RG1 2AB'
      },
      parentage: {
        parentsRelationship: 'unmarried',
        marriageDate: null,
        secondParentIncluded: 'yes',
        secondParentName: 'Marcus Bell',
        secondParentDateOfBirth: '1989-11-02',
        secondParentPlaceOfBirth: 'Bristol, England',
        secondParentOccupation: 'Engineer',
        paternityBasis: 'none',
        paternityEvidenceHeld: '',
        licensedClinicTreatment: ''
      },
      informant: {
        informantRelationship: 'mother',
        informantName: 'Beatrice Ellis',
        parentsUnableToRegister: '',
        registrationRoute: 'local-register-office',
        registrationDate: '2026-08-13',
        identityPrimaryDocument: 'passport',
        identitySecondaryCount: 0,
        identityOriginals: 'yes',
        redBookPresented: 'yes'
      },
      certificate: {
        certificatesRequested: 2,
        serviceLevel: 'standard',
        deliveryAddress: '14 Orchard Road, Reading RG1 2AB',
        paymentConfirmed: 'yes',
        applicantNote: ''
      }
    }
  },
  {
    id: 'BR-2026-0005',
    childName: 'Ellis, Isla',
    informantName: 'Beatrice Ellis',
    registeredDate: '2026-10-03',
    data: {
      child: {
        childForenames: 'Amara Grace',
        childSurname: 'Ellis',
        sex: 'female',
        dateOfBirth: '2026-08-01',
        timeOfBirth: '09:15',
        placeOfBirthType: 'hospital',
        placeOfBirth: 'Royal Berkshire Hospital, London Road, Reading',
        birthCountry: 'england',
        multipleBirth: 'single',
        stillbirth: 'no'
      },
      mother: {
        motherName: 'Beatrice Ellis',
        motherMaidenSurname: 'Hartley',
        motherDateOfBirth: '1991-03-14',
        motherPlaceOfBirth: 'Leeds, England',
        motherOccupation: 'Teacher',
        motherAddress: '14 Orchard Road, Reading RG1 2AB'
      },
      parentage: {
        parentsRelationship: 'married-or-civil-partners',
        marriageDate: '2019-06-15',
        secondParentIncluded: 'yes',
        secondParentName: 'Daniel Ellis',
        secondParentDateOfBirth: '1989-11-02',
        secondParentPlaceOfBirth: 'Bristol, England',
        secondParentOccupation: 'Engineer',
        paternityBasis: 'married-or-civil-partners',
        paternityEvidenceHeld: '',
        licensedClinicTreatment: ''
      },
      informant: {
        informantRelationship: 'mother',
        informantName: 'Beatrice Ellis',
        parentsUnableToRegister: '',
        registrationRoute: 'local-register-office',
        registrationDate: '2026-10-03',
        identityPrimaryDocument: 'none',
        identitySecondaryCount: 1,
        identityOriginals: 'no',
        redBookPresented: 'yes'
      },
      certificate: {
        certificatesRequested: 2,
        serviceLevel: 'standard',
        deliveryAddress: '14 Orchard Road, Reading RG1 2AB',
        paymentConfirmed: 'yes',
        applicantNote: ''
      }
    }
  },
  {
    id: 'BR-2026-0006',
    childName: 'Macleod, Iona',
    informantName: 'Beatrice Ellis',
    registeredDate: '2026-08-13',
    data: {
      child: {
        childForenames: 'Amara Grace',
        childSurname: 'Ellis',
        sex: 'female',
        dateOfBirth: '2026-08-01',
        timeOfBirth: '09:15',
        placeOfBirthType: 'hospital',
        placeOfBirth: 'Royal Berkshire Hospital, London Road, Reading',
        birthCountry: 'scotland',
        multipleBirth: 'single',
        stillbirth: 'no'
      },
      mother: {
        motherName: 'Beatrice Ellis',
        motherMaidenSurname: 'Hartley',
        motherDateOfBirth: '1991-03-14',
        motherPlaceOfBirth: 'Leeds, England',
        motherOccupation: 'Teacher',
        motherAddress: '14 Orchard Road, Reading RG1 2AB'
      },
      parentage: {
        parentsRelationship: 'married-or-civil-partners',
        marriageDate: '2019-06-15',
        secondParentIncluded: 'yes',
        secondParentName: 'Daniel Ellis',
        secondParentDateOfBirth: '1989-11-02',
        secondParentPlaceOfBirth: 'Bristol, England',
        secondParentOccupation: 'Engineer',
        paternityBasis: 'married-or-civil-partners',
        paternityEvidenceHeld: '',
        licensedClinicTreatment: ''
      },
      informant: {
        informantRelationship: 'mother',
        informantName: 'Beatrice Ellis',
        parentsUnableToRegister: '',
        registrationRoute: 'local-register-office',
        registrationDate: '2026-08-13',
        identityPrimaryDocument: 'passport',
        identitySecondaryCount: 0,
        identityOriginals: 'yes',
        redBookPresented: 'yes'
      },
      certificate: {
        certificatesRequested: 2,
        serviceLevel: 'standard',
        deliveryAddress: '14 Orchard Road, Reading RG1 2AB',
        paymentConfirmed: 'yes',
        applicantNote: ''
      }
    }
  },
  {
    id: 'BR-2026-0007',
    childName: 'Ellis, Stillborn',
    informantName: 'Beatrice Ellis',
    registeredDate: '2026-08-13',
    data: {
      child: {
        childForenames: 'Amara Grace',
        childSurname: 'Ellis',
        sex: 'female',
        dateOfBirth: '2026-08-01',
        timeOfBirth: '09:15',
        placeOfBirthType: 'hospital',
        placeOfBirth: 'Royal Berkshire Hospital, London Road, Reading',
        birthCountry: 'england',
        multipleBirth: 'single',
        stillbirth: 'yes'
      },
      mother: {
        motherName: 'Beatrice Ellis',
        motherMaidenSurname: 'Hartley',
        motherDateOfBirth: '1991-03-14',
        motherPlaceOfBirth: 'Leeds, England',
        motherOccupation: 'Teacher',
        motherAddress: '14 Orchard Road, Reading RG1 2AB'
      },
      parentage: {
        parentsRelationship: 'married-or-civil-partners',
        marriageDate: '2019-06-15',
        secondParentIncluded: 'yes',
        secondParentName: 'Daniel Ellis',
        secondParentDateOfBirth: '1989-11-02',
        secondParentPlaceOfBirth: 'Bristol, England',
        secondParentOccupation: 'Engineer',
        paternityBasis: 'married-or-civil-partners',
        paternityEvidenceHeld: '',
        licensedClinicTreatment: ''
      },
      informant: {
        informantRelationship: 'mother',
        informantName: 'Beatrice Ellis',
        parentsUnableToRegister: '',
        registrationRoute: 'local-register-office',
        registrationDate: '2026-08-13',
        identityPrimaryDocument: 'passport',
        identitySecondaryCount: 0,
        identityOriginals: 'yes',
        redBookPresented: 'yes'
      },
      certificate: {
        certificatesRequested: 2,
        serviceLevel: 'standard',
        deliveryAddress: '14 Orchard Road, Reading RG1 2AB',
        paymentConfirmed: 'yes',
        applicantNote: ''
      }
    }
  },
  {
    id: 'BR-2026-0008',
    childName: 'Marsh, Ella',
    informantName: 'Beatrice Ellis',
    registeredDate: '2026-09-10',
    data: {
      child: {
        childForenames: 'Amara Grace',
        childSurname: 'Ellis',
        sex: 'female',
        dateOfBirth: '2026-08-01',
        timeOfBirth: '09:15',
        placeOfBirthType: 'hospital',
        placeOfBirth: 'Royal Berkshire Hospital, London Road, Reading',
        birthCountry: 'england',
        multipleBirth: 'single',
        stillbirth: 'no'
      },
      mother: {
        motherName: 'Beatrice Ellis',
        motherMaidenSurname: 'Hartley',
        motherDateOfBirth: '1991-03-14',
        motherPlaceOfBirth: 'Leeds, England',
        motherOccupation: 'Teacher',
        motherAddress: '14 Orchard Road, Reading RG1 2AB'
      },
      parentage: {
        parentsRelationship: 'female-couple-unmarried',
        marriageDate: null,
        secondParentIncluded: 'yes',
        secondParentName: 'Helen Marsh',
        secondParentDateOfBirth: '1989-11-02',
        secondParentPlaceOfBirth: 'Bristol, England',
        secondParentOccupation: 'Engineer',
        paternityBasis: 'statutory-declaration',
        paternityEvidenceHeld: 'yes',
        licensedClinicTreatment: 'yes'
      },
      informant: {
        informantRelationship: 'mother',
        informantName: 'Beatrice Ellis',
        parentsUnableToRegister: '',
        registrationRoute: 'local-register-office',
        registrationDate: '2026-09-10',
        identityPrimaryDocument: 'passport',
        identitySecondaryCount: 0,
        identityOriginals: 'yes',
        redBookPresented: 'yes'
      },
      certificate: {
        certificatesRequested: 1,
        serviceLevel: 'priority',
        deliveryAddress: '14 Orchard Road, Reading RG1 2AB',
        paymentConfirmed: 'yes',
        applicantNote: ''
      }
    }
  }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleRegistrationRows: DashboardRow[] = sampleRegistrations.map((s) => {
  const r = validateRegistration(s.data);
  return {
    id: s.id,
    childName: s.childName,
    informantName: s.informantName,
    readinessClass: r.readinessClass,
    daysSinceBirth: r.daysSinceBirth,
    lateRegistration: r.lateRegistration,
    flagCount: r.flaggedIssues.length,
    registeredDate: s.registeredDate
  };
});
