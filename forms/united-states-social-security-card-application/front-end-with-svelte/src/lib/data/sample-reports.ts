import type { ApplicationClass, SocialSecurityApplication } from '#lib/engine/types.js';
import { validateApplication } from '#lib/engine/ss5-grader.js';

/** A sample application: an identifier and the full data the engine grades. */
export interface SampleApplication {
  id: string;
  applicantName: string;
  preparerName: string;
  applicationDate: string;
  data: SocialSecurityApplication;
}

/** A row in the dashboard, derived by running the shared engine. */
export interface DashboardRow {
  id: string;
  applicantName: string;
  requestType: string;
  applicationClass: ApplicationClass;
  missingEvidenceCount: number;
  replacementLimitReached: string;
  flagCount: number;
  preparerName: string;
  applicationDate: string;
}

/** The sample applications (invented people), keyed by stable id (used to seed the wizard). */
export const sampleApplications: SampleApplication[] = [
  {
    id: 'SS5-2026-0001',
    applicantName: 'Santos, Maria Elena',
    preparerName: 'F. Monroe',
    applicationDate: '2026-09-03',
    data: {
      request: {
        applicationDate: '2026-09-03',
        requestType: 'original',
        channel: 'in-person',
        previouslyApplied: 'no',
        nameChange: 'no',
        nameChangeReason: '',
        dateOfBirthCorrection: '',
        replacementsThisYear: null,
        replacementsLifetime: null,
        limitExceptionReason: '',
        limitExceptionEvidence: ''
      },
      applicant: {
        nameOnCard: 'Maria Elena Santos',
        nameAtBirth: 'Maria Elena Santos',
        otherNamesUsed: '',
        nameOnMostRecentCard: '',
        dateOfBirth: '1994-05-17',
        placeOfBirthCity: 'Houston',
        placeOfBirthRegion: 'Texas',
        sex: 'female',
        citizenship: 'us-citizen',
        nonWorkReasonValid: '',
        motherNameAtBirth: 'Rosa Delgado',
        fatherName: 'Luis Santos',
        stateOfResidence: 'TX',
        mailingAddress: '1420 Elm Street, Houston, TX 77002',
        phone: '713-555-0142'
      },
      evidence: {
        identityDocument: 'us-driver-license',
        identityDocumentExpired: 'no',
        ageDocument: 'us-birth-certificate',
        citizenshipDocument: 'us-birth-certificate',
        citizenshipOnFile: '',
        nameChangeDocument: '',
        documentsOriginalOrCertified: 'yes'
      },
      filer: {
        signerRelationship: 'self',
        signerName: '',
        signerIdentityDocument: '',
        signaturePresent: 'yes'
      },
      tellSsa: {
        applicantDeceased: 'no',
        deathReportedToSsa: '',
        preparerNote: ''
      }
    }
  },
  {
    id: 'SS5-2026-0002',
    applicantName: 'Santos, Maria Elena',
    preparerName: 'F. Monroe',
    applicationDate: '2026-09-03',
    data: {
      request: {
        applicationDate: '2026-09-03',
        requestType: 'replacement',
        channel: 'in-person',
        previouslyApplied: 'yes',
        nameChange: 'no',
        nameChangeReason: '',
        dateOfBirthCorrection: '',
        replacementsThisYear: 2,
        replacementsLifetime: 3,
        limitExceptionReason: '',
        limitExceptionEvidence: ''
      },
      applicant: {
        nameOnCard: 'Maria Elena Santos',
        nameAtBirth: 'Maria Elena Santos',
        otherNamesUsed: '',
        nameOnMostRecentCard: 'Maria Elena Santos',
        dateOfBirth: '1994-05-17',
        placeOfBirthCity: 'Houston',
        placeOfBirthRegion: 'Texas',
        sex: 'female',
        citizenship: 'us-citizen',
        nonWorkReasonValid: '',
        motherNameAtBirth: 'Rosa Delgado',
        fatherName: 'Luis Santos',
        stateOfResidence: 'CA',
        mailingAddress: '1420 Elm Street, Houston, TX 77002',
        phone: '713-555-0142'
      },
      evidence: {
        identityDocument: 'us-passport',
        identityDocumentExpired: 'no',
        ageDocument: 'none',
        citizenshipDocument: 'none',
        citizenshipOnFile: 'yes',
        nameChangeDocument: '',
        documentsOriginalOrCertified: 'yes'
      },
      filer: {
        signerRelationship: 'self',
        signerName: '',
        signerIdentityDocument: '',
        signaturePresent: 'yes'
      },
      tellSsa: {
        applicantDeceased: 'no',
        deathReportedToSsa: '',
        preparerNote: ''
      }
    }
  },
  {
    id: 'SS5-2026-0003',
    applicantName: 'Whitfield, Noah James',
    preparerName: 'K. Hughes',
    applicationDate: '2026-09-03',
    data: {
      request: {
        applicationDate: '2026-09-03',
        requestType: 'original',
        channel: 'in-person',
        previouslyApplied: 'no',
        nameChange: 'no',
        nameChangeReason: '',
        dateOfBirthCorrection: '',
        replacementsThisYear: null,
        replacementsLifetime: null,
        limitExceptionReason: '',
        limitExceptionEvidence: ''
      },
      applicant: {
        nameOnCard: 'Noah James Whitfield',
        nameAtBirth: 'Noah James Whitfield',
        otherNamesUsed: '',
        nameOnMostRecentCard: '',
        dateOfBirth: '2019-02-02',
        placeOfBirthCity: 'Columbus',
        placeOfBirthRegion: 'Ohio',
        sex: 'male',
        citizenship: 'us-citizen',
        nonWorkReasonValid: '',
        motherNameAtBirth: 'Rosa Delgado',
        fatherName: 'Luis Santos',
        stateOfResidence: 'OH',
        mailingAddress: '1420 Elm Street, Houston, TX 77002',
        phone: '713-555-0142'
      },
      evidence: {
        identityDocument: 'school-id',
        identityDocumentExpired: 'no',
        ageDocument: 'us-birth-certificate',
        citizenshipDocument: 'us-birth-certificate',
        citizenshipOnFile: '',
        nameChangeDocument: '',
        documentsOriginalOrCertified: 'yes'
      },
      filer: {
        signerRelationship: 'parent',
        signerName: 'Dana Whitfield',
        signerIdentityDocument: 'yes',
        signaturePresent: 'yes'
      },
      tellSsa: {
        applicantDeceased: 'no',
        deathReportedToSsa: '',
        preparerNote: ''
      }
    }
  },
  {
    id: 'SS5-2026-0004',
    applicantName: 'Chen, Wei',
    preparerName: 'R. Patel',
    applicationDate: '2026-09-03',
    data: {
      request: {
        applicationDate: '2026-09-03',
        requestType: 'original',
        channel: 'in-person',
        previouslyApplied: 'no',
        nameChange: 'no',
        nameChangeReason: '',
        dateOfBirthCorrection: '',
        replacementsThisYear: null,
        replacementsLifetime: null,
        limitExceptionReason: '',
        limitExceptionEvidence: ''
      },
      applicant: {
        nameOnCard: 'Chen Wei',
        nameAtBirth: 'Chen Wei',
        otherNamesUsed: '',
        nameOnMostRecentCard: '',
        dateOfBirth: '1994-05-17',
        placeOfBirthCity: 'Chengdu',
        placeOfBirthRegion: 'China',
        sex: 'female',
        citizenship: 'legal-alien-not-allowed-to-work',
        nonWorkReasonValid: 'no',
        motherNameAtBirth: 'Rosa Delgado',
        fatherName: 'Luis Santos',
        stateOfResidence: 'WA',
        mailingAddress: '1420 Elm Street, Houston, TX 77002',
        phone: '713-555-0142'
      },
      evidence: {
        identityDocument: 'other',
        identityDocumentExpired: 'no',
        ageDocument: 'immigration-record',
        citizenshipDocument: 'permanent-resident-card',
        citizenshipOnFile: '',
        nameChangeDocument: '',
        documentsOriginalOrCertified: 'yes'
      },
      filer: {
        signerRelationship: 'self',
        signerName: '',
        signerIdentityDocument: '',
        signaturePresent: 'yes'
      },
      tellSsa: {
        applicantDeceased: 'no',
        deathReportedToSsa: '',
        preparerNote: ''
      }
    }
  },
  {
    id: 'SS5-2026-0005',
    applicantName: 'Santos, Maria Elena',
    preparerName: 'R. Patel',
    applicationDate: '2026-09-03',
    data: {
      request: {
        applicationDate: '2026-09-03',
        requestType: 'replacement',
        channel: 'in-person',
        previouslyApplied: 'yes',
        nameChange: 'no',
        nameChangeReason: '',
        dateOfBirthCorrection: '',
        replacementsThisYear: 3,
        replacementsLifetime: 5,
        limitExceptionReason: '',
        limitExceptionEvidence: ''
      },
      applicant: {
        nameOnCard: 'Maria Elena Santos',
        nameAtBirth: 'Maria Elena Santos',
        otherNamesUsed: '',
        nameOnMostRecentCard: 'Maria Elena Santos',
        dateOfBirth: '1994-05-17',
        placeOfBirthCity: 'Houston',
        placeOfBirthRegion: 'Texas',
        sex: 'female',
        citizenship: 'us-citizen',
        nonWorkReasonValid: '',
        motherNameAtBirth: 'Rosa Delgado',
        fatherName: 'Luis Santos',
        stateOfResidence: 'IL',
        mailingAddress: '1420 Elm Street, Houston, TX 77002',
        phone: '713-555-0142'
      },
      evidence: {
        identityDocument: 'us-driver-license',
        identityDocumentExpired: 'no',
        ageDocument: 'us-birth-certificate',
        citizenshipDocument: 'none',
        citizenshipOnFile: 'yes',
        nameChangeDocument: '',
        documentsOriginalOrCertified: 'yes'
      },
      filer: {
        signerRelationship: 'self',
        signerName: '',
        signerIdentityDocument: '',
        signaturePresent: 'yes'
      },
      tellSsa: {
        applicantDeceased: 'no',
        deathReportedToSsa: '',
        preparerNote: ''
      }
    }
  },
  {
    id: 'SS5-2026-0006',
    applicantName: 'Pruitt, Walter Alan',
    preparerName: 'K. Hughes',
    applicationDate: '2026-09-03',
    data: {
      request: {
        applicationDate: '2026-09-03',
        requestType: 'original',
        channel: 'in-person',
        previouslyApplied: 'no',
        nameChange: 'no',
        nameChangeReason: '',
        dateOfBirthCorrection: '',
        replacementsThisYear: null,
        replacementsLifetime: null,
        limitExceptionReason: '',
        limitExceptionEvidence: ''
      },
      applicant: {
        nameOnCard: 'Maria Elena Santos',
        nameAtBirth: 'Maria Elena Santos',
        otherNamesUsed: '',
        nameOnMostRecentCard: '',
        dateOfBirth: '1994-05-17',
        placeOfBirthCity: 'Houston',
        placeOfBirthRegion: 'Texas',
        sex: 'female',
        citizenship: 'us-citizen',
        nonWorkReasonValid: '',
        motherNameAtBirth: 'Rosa Delgado',
        fatherName: 'Luis Santos',
        stateOfResidence: 'TX',
        mailingAddress: '1420 Elm Street, Houston, TX 77002',
        phone: '713-555-0142'
      },
      evidence: {
        identityDocument: 'us-driver-license',
        identityDocumentExpired: 'no',
        ageDocument: 'us-birth-certificate',
        citizenshipDocument: 'us-birth-certificate',
        citizenshipOnFile: '',
        nameChangeDocument: '',
        documentsOriginalOrCertified: 'yes'
      },
      filer: {
        signerRelationship: 'self',
        signerName: '',
        signerIdentityDocument: '',
        signaturePresent: 'yes'
      },
      tellSsa: {
        applicantDeceased: 'yes',
        deathReportedToSsa: 'no',
        preparerNote: ''
      }
    }
  }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleApplicationRows: DashboardRow[] = sampleApplications.map((s) => {
  const r = validateApplication(s.data);
  return {
    id: s.id,
    applicantName: s.applicantName,
    requestType: s.data.request.requestType,
    applicationClass: r.applicationClass,
    missingEvidenceCount: r.missingEvidenceCount,
    replacementLimitReached: r.replacementLimitReached ? 'Yes' : 'No',
    flagCount: r.flaggedIssues.length,
    preparerName: s.preparerName,
    applicationDate: s.applicationDate
  };
});
