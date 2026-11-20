import type { DeathCertificate, ValidityClass } from '#lib/engine/types.js';
import { validateCertificate } from '#lib/engine/grader.js';

/** A sample certificate: an identifier and the full data the engine grades. */
export interface SampleCertificate {
  id: string;
  decedentName: string;
  certifierName: string;
  certifiedDate: string;
  data: DeathCertificate;
}

/** A row in the certifier dashboard, derived by running the shared engine. */
export interface DashboardRow {
  id: string;
  stateFileNumber: string;
  decedentName: string;
  certifierName: string;
  validityClass: ValidityClass;
  underlyingCause: string;
  flagCount: number;
  certifiedDate: string;
}

/**
 * The sample certificates, keyed by stable id (used to seed the wizard). They are
 * the same filled states as the first, second, third, fifth, seventh and ninth
 * entries of examples/personas.json, spanning all three validity classes.
 */
export const sampleCertificates: SampleCertificate[] = [
  {
    id: 'USSCD-2026-0001',
    decedentName: 'Ellis, Margaret',
    certifierName: 'Dr. Rosa Okafor',
    certifiedDate: '2026-06-19',
    data: {
      jurisdiction: { state: 'CA' },
      decedent: {
        decedentName: 'Ellis, Margaret',
        sex: 'female',
        dateOfBirth: '1943-02-11',
        ageYears: 83,
        maritalStatus: 'widowed',
        veteranStatus: 'no',
        stateOfResidence: 'CA'
      },
      death: {
        placeOfDeathType: 'hospital-inpatient',
        placeOfDeathFacility: 'St. Mary’s Hospital, Sacramento, CA',
        dateOfDeath: '2026-06-19',
        timeOfDeath: '04:20'
      },
      certifier: {
        certifierName: 'Dr. Rosa Okafor',
        certifierType: 'pronouncing-and-certifying-physician',
        certifierLicenseNumber: 'A123456',
        certificationDate: '2026-06-19',
        attendedDeceased: 'yes',
        lastSeenAliveDate: '2026-06-18'
      },
      partI: {
        causeIaCondition: 'Aspiration pneumonia',
        causeIaInterval: '3 days',
        causeIbCondition: 'Ischemic stroke of the left middle cerebral artery',
        causeIbInterval: '2 weeks',
        causeIcCondition: 'Atrial fibrillation',
        causeIcInterval: '6 years',
        causeIdCondition: '',
        causeIdInterval: ''
      },
      partII: {
        partIiConditions: 'Type 2 diabetes mellitus',
        autopsyPerformed: 'no',
        autopsyFindingsAvailable: 'no'
      },
      manner: {
        mannerOfDeath: 'natural',
        tobaccoUseContributed: 'no',
        pregnancyStatus: 'not-applicable'
      },
      injury: {
        injuryDate: null,
        injuryTime: null,
        injuryPlace: '',
        injuryAtWork: '',
        injuryLocation: '',
        injuryDescription: '',
        transportationInjuryRole: ''
      },
      referral: { referredToMedicalExaminer: 'no', referralReason: 'none', certifierNote: '' },
      funeral: {
        funeralDirectorName: 'Delgado Family Funeral Home',
        funeralDirectorLicenseNumber: 'FD-4471',
        dispositionMethod: 'burial',
        dispositionDate: '2026-06-23',
        dispositionPlace: 'Capital Memorial Cemetery',
        filedDate: '2026-06-22'
      },
      copies: {
        certifiedCopiesRequested: 5,
        requesterRelationship: 'child',
        requesterIdentityVerified: 'yes',
        feePaidInUsd: 120
      }
    }
  },
  {
    id: 'USSCD-2026-0002',
    decedentName: 'Nowak, Piotr',
    certifierName: 'Dr. Lena Mensah',
    certifiedDate: '2026-06-23',
    data: {
      jurisdiction: { state: 'TX' },
      decedent: {
        decedentName: 'Nowak, Piotr',
        sex: 'male',
        dateOfBirth: '1951-09-30',
        ageYears: 74,
        maritalStatus: 'married',
        veteranStatus: 'no',
        stateOfResidence: 'TX'
      },
      death: {
        placeOfDeathType: 'decedent-home',
        placeOfDeathFacility: '1140 Bluebonnet Lane, Austin, TX',
        dateOfDeath: '2026-06-22',
        timeOfDeath: '18:45'
      },
      certifier: {
        certifierName: 'Dr. Lena Mensah',
        certifierType: 'pronouncing-and-certifying-physician',
        certifierLicenseNumber: 'A123456',
        certificationDate: '2026-06-23',
        attendedDeceased: 'yes',
        lastSeenAliveDate: '2026-06-18'
      },
      partI: {
        causeIaCondition: 'Cardiac arrest',
        causeIaInterval: 'minutes',
        causeIbCondition: '',
        causeIbInterval: '',
        causeIcCondition: '',
        causeIcInterval: '',
        causeIdCondition: '',
        causeIdInterval: ''
      },
      partII: { partIiConditions: '', autopsyPerformed: 'no', autopsyFindingsAvailable: 'no' },
      manner: {
        mannerOfDeath: 'natural',
        tobaccoUseContributed: 'probably',
        pregnancyStatus: 'not-applicable'
      },
      injury: {
        injuryDate: null,
        injuryTime: null,
        injuryPlace: '',
        injuryAtWork: '',
        injuryLocation: '',
        injuryDescription: '',
        transportationInjuryRole: ''
      },
      referral: { referredToMedicalExaminer: 'no', referralReason: 'none', certifierNote: '' },
      funeral: {
        funeralDirectorName: 'Delgado Family Funeral Home',
        funeralDirectorLicenseNumber: 'FD-4471',
        dispositionMethod: 'burial',
        dispositionDate: '2026-06-26',
        dispositionPlace: 'Capital Memorial Cemetery',
        filedDate: '2026-06-25'
      },
      copies: {
        certifiedCopiesRequested: 2,
        requesterRelationship: 'child',
        requesterIdentityVerified: 'yes',
        feePaidInUsd: 23
      }
    }
  },
  {
    id: 'USSCD-2026-0003',
    decedentName: 'Okafor, Chidi',
    certifierName: 'Dr. James Hughes',
    certifiedDate: '2026-06-26',
    data: {
      jurisdiction: { state: 'NY' },
      decedent: {
        decedentName: 'Okafor, Chidi',
        sex: 'male',
        dateOfBirth: '1968-03-02',
        ageYears: 58,
        maritalStatus: 'married',
        veteranStatus: 'yes',
        stateOfResidence: 'NY'
      },
      death: {
        placeOfDeathType: 'hospital-emergency-outpatient',
        placeOfDeathFacility: 'Bellevue Hospital Center, New York, NY',
        dateOfDeath: '2026-06-25',
        timeOfDeath: '22:10'
      },
      certifier: {
        certifierName: 'Dr. James Hughes',
        certifierType: 'pronouncing-and-certifying-physician',
        certifierLicenseNumber: 'NY-338812',
        certificationDate: '2026-06-26',
        attendedDeceased: 'no',
        lastSeenAliveDate: null
      },
      partI: {
        causeIaCondition: 'Subdural hematoma',
        causeIaInterval: 'hours',
        causeIbCondition: 'Blunt force head injury',
        causeIbInterval: 'hours',
        causeIcCondition: 'Fall from a ladder',
        causeIcInterval: 'hours',
        causeIdCondition: '',
        causeIdInterval: ''
      },
      partII: { partIiConditions: '', autopsyPerformed: 'yes', autopsyFindingsAvailable: 'no' },
      manner: {
        mannerOfDeath: 'accident',
        tobaccoUseContributed: 'no',
        pregnancyStatus: 'not-applicable'
      },
      injury: {
        injuryDate: '2026-06-25',
        injuryTime: '20:30',
        injuryPlace: 'Decedent’s home',
        injuryAtWork: 'no',
        injuryLocation: '88 Court Street, Brooklyn, NY 11201',
        injuryDescription: 'Fell from a ladder while painting a ceiling',
        transportationInjuryRole: ''
      },
      referral: { referredToMedicalExaminer: 'yes', referralReason: 'accident', certifierNote: '' },
      funeral: {
        funeralDirectorName: 'Delgado Family Funeral Home',
        funeralDirectorLicenseNumber: 'FD-4471',
        dispositionMethod: 'cremation',
        dispositionDate: '2026-06-28',
        dispositionPlace: 'Green-Wood Crematory',
        filedDate: '2026-06-27'
      },
      copies: {
        certifiedCopiesRequested: 2,
        requesterRelationship: 'spouse',
        requesterIdentityVerified: 'yes',
        feePaidInUsd: 60
      }
    }
  },
  {
    id: 'USSCD-2026-0004',
    decedentName: 'Fletcher, Rosemary',
    certifierName: 'Dr. Alan Brooks',
    certifiedDate: '2026-06-13',
    data: {
      jurisdiction: { state: 'OH' },
      decedent: {
        decedentName: 'Fletcher, Rosemary',
        sex: 'female',
        dateOfBirth: '1960-04-09',
        ageYears: 66,
        maritalStatus: 'divorced',
        veteranStatus: 'no',
        stateOfResidence: 'OH'
      },
      death: {
        placeOfDeathType: 'hospice',
        placeOfDeathFacility: 'Riverside Hospice, Columbus, OH',
        dateOfDeath: '2026-06-10',
        timeOfDeath: '03:05'
      },
      certifier: {
        certifierName: 'Dr. Alan Brooks',
        certifierType: 'pronouncing-and-certifying-physician',
        certifierLicenseNumber: '35.123456',
        certificationDate: '2026-06-13',
        attendedDeceased: 'yes',
        lastSeenAliveDate: '2026-06-09'
      },
      partI: {
        causeIaCondition: 'Sepsis',
        causeIaInterval: '2 days',
        causeIbCondition: 'Metastatic cancer of the pancreas',
        causeIbInterval: '14 months',
        causeIcCondition: '',
        causeIcInterval: '',
        causeIdCondition: '',
        causeIdInterval: ''
      },
      partII: {
        partIiConditions: 'Hypertension',
        autopsyPerformed: 'no',
        autopsyFindingsAvailable: 'no'
      },
      manner: {
        mannerOfDeath: 'natural',
        tobaccoUseContributed: 'yes',
        pregnancyStatus: 'not-applicable'
      },
      injury: {
        injuryDate: null,
        injuryTime: null,
        injuryPlace: '',
        injuryAtWork: '',
        injuryLocation: '',
        injuryDescription: '',
        transportationInjuryRole: ''
      },
      referral: { referredToMedicalExaminer: 'no', referralReason: 'none', certifierNote: '' },
      funeral: {
        funeralDirectorName: 'Delgado Family Funeral Home',
        funeralDirectorLicenseNumber: 'FD-4471',
        dispositionMethod: 'cremation',
        dispositionDate: '2026-06-16',
        dispositionPlace: 'Columbus Crematory',
        filedDate: '2026-06-15'
      },
      copies: {
        certifiedCopiesRequested: 3,
        requesterRelationship: 'child',
        requesterIdentityVerified: 'yes',
        feePaidInUsd: 63
      }
    }
  },
  {
    id: 'USSCD-2026-0005',
    decedentName: 'Whitaker, Daniel',
    certifierName: 'Dr. Mei Tanaka',
    certifiedDate: '2026-06-15',
    data: {
      jurisdiction: { state: 'WA' },
      decedent: {
        decedentName: 'Whitaker, Daniel',
        sex: 'male',
        dateOfBirth: '1985-05-05',
        ageYears: 41,
        maritalStatus: 'divorced',
        veteranStatus: 'no',
        stateOfResidence: 'WA'
      },
      death: {
        placeOfDeathType: 'decedent-home',
        placeOfDeathFacility: '2210 Pine Street, Seattle, WA',
        dateOfDeath: '2026-06-12',
        timeOfDeath: '07:30'
      },
      certifier: {
        certifierName: 'Dr. Mei Tanaka',
        certifierType: 'certifying-physician',
        certifierLicenseNumber: 'MD60112233',
        certificationDate: '2026-06-15',
        attendedDeceased: 'no',
        lastSeenAliveDate: null
      },
      partI: {
        causeIaCondition: 'Acute diphenhydramine toxicity',
        causeIaInterval: 'hours',
        causeIbCondition: '',
        causeIbInterval: '',
        causeIcCondition: '',
        causeIcInterval: '',
        causeIdCondition: '',
        causeIdInterval: ''
      },
      partII: {
        partIiConditions: 'Major depressive disorder',
        autopsyPerformed: 'yes',
        autopsyFindingsAvailable: 'yes'
      },
      manner: {
        mannerOfDeath: 'suicide',
        tobaccoUseContributed: 'unknown',
        pregnancyStatus: 'not-applicable'
      },
      injury: {
        injuryDate: null,
        injuryTime: null,
        injuryPlace: '',
        injuryAtWork: '',
        injuryLocation: '',
        injuryDescription: '',
        transportationInjuryRole: ''
      },
      referral: { referredToMedicalExaminer: 'yes', referralReason: 'suicide', certifierNote: '' },
      funeral: {
        funeralDirectorName: 'Delgado Family Funeral Home',
        funeralDirectorLicenseNumber: 'FD-4471',
        dispositionMethod: 'cremation',
        dispositionDate: '2026-06-16',
        dispositionPlace: 'Evergreen Crematory',
        filedDate: '2026-06-18'
      },
      copies: {
        certifiedCopiesRequested: null,
        requesterRelationship: '',
        requesterIdentityVerified: '',
        feePaidInUsd: null
      }
    }
  },
  {
    id: 'USSCD-2026-0006',
    decedentName: 'Pruitt, Eleanor',
    certifierName: 'Dr. Omar Haddad',
    certifiedDate: '2026-06-03',
    data: {
      jurisdiction: { state: 'GA' },
      decedent: {
        decedentName: 'Pruitt, Eleanor',
        sex: 'female',
        dateOfBirth: '1960-02-01',
        ageYears: 80,
        maritalStatus: 'widowed',
        veteranStatus: 'no',
        stateOfResidence: 'GA'
      },
      death: {
        placeOfDeathType: 'decedent-home',
        placeOfDeathFacility: '77 Peachtree Way, Atlanta, GA',
        dateOfDeath: '2026-06-05',
        timeOfDeath: '09:15'
      },
      certifier: {
        certifierName: 'Dr. Omar Haddad',
        certifierType: 'pronouncing-and-certifying-physician',
        certifierLicenseNumber: 'GA-77231',
        certificationDate: '2026-06-03',
        attendedDeceased: 'no',
        lastSeenAliveDate: '2026-05-10'
      },
      partI: {
        causeIaCondition: 'Pneumonia',
        causeIaInterval: '5 days',
        causeIbCondition: 'Hip fracture',
        causeIbInterval: '3 weeks',
        causeIcCondition: '',
        causeIcInterval: '',
        causeIdCondition: '',
        causeIdInterval: ''
      },
      partII: {
        partIiConditions: 'Osteoporosis',
        autopsyPerformed: 'no',
        autopsyFindingsAvailable: 'no'
      },
      manner: {
        mannerOfDeath: 'natural',
        tobaccoUseContributed: 'no',
        pregnancyStatus: 'not-applicable'
      },
      injury: {
        injuryDate: null,
        injuryTime: null,
        injuryPlace: '',
        injuryAtWork: '',
        injuryLocation: '',
        injuryDescription: '',
        transportationInjuryRole: ''
      },
      referral: { referredToMedicalExaminer: 'no', referralReason: 'none', certifierNote: '' },
      funeral: {
        funeralDirectorName: 'Delgado Family Funeral Home',
        funeralDirectorLicenseNumber: 'FD-4471',
        dispositionMethod: 'burial',
        dispositionDate: '2026-06-09',
        dispositionPlace: 'Capital Memorial Cemetery',
        filedDate: '2026-06-08'
      },
      copies: {
        certifiedCopiesRequested: null,
        requesterRelationship: '',
        requesterIdentityVerified: '',
        feePaidInUsd: null
      }
    }
  }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleCertificateRows: DashboardRow[] = sampleCertificates.map((s) => {
  const r = validateCertificate(s.data);
  return {
    id: s.id,
    stateFileNumber: `${s.data.jurisdiction.state}-${s.id.slice(-9)}`,
    decedentName: s.decedentName,
    certifierName: s.certifierName,
    validityClass: r.validityClass,
    underlyingCause: r.underlyingCause,
    flagCount: r.flaggedIssues.length,
    certifiedDate: s.certifiedDate
  };
});
