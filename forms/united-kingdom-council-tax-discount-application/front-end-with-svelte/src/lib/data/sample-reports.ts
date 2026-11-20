import type { Application, EligibilityClass } from '#lib/engine/types.js';
import { validateApplication } from '#lib/engine/ctda-grader.js';

/** A sample application: an identifier and the full data the engine grades. */
export interface SampleApplication {
  id: string;
  applicantName: string;
  billingAuthority: string;
  appliedDate: string;
  data: Application;
}

/** A row in the dashboard, derived by running the shared engine. */
export interface DashboardRow {
  id: string;
  accountReference: string;
  applicantName: string;
  claimType: string;
  billingAuthority: string;
  eligibilityClass: EligibilityClass;
  indicativeOutcome: string;
  flagCount: number;
  appliedDate: string;
}

/** The sample applications, keyed by stable id (used to seed the wizard). */
export const sampleApplications: SampleApplication[] = [
  {
    id: 'CTD-2026-0001',
    applicantName: 'Adaeze Okonkwo',
    billingAuthority: 'Leeds City Council',
    appliedDate: '2026-09-02',
    data: {
      claim: {
        claimType: 'single-person-discount',
        billingAuthority: 'Leeds City Council',
        accountReference: 'CT-100234',
        applicationDate: '2026-09-02',
        effectiveDate: '2026-09-02'
      },
      applicant: {
        name: 'Adaeze Okonkwo',
        birthDate: '1985-04-12',
        email: 'adaeze.okonkwo@example.com',
        phone: '07700 900123',
        status: 'counted-adult'
      },
      property: {
        addressAsFullText: '14 Mill Lane, Leeds',
        postcode: 'LS6 2AB',
        band: 'C',
        mainResidence: 'yes',
        liableRole: 'owner-occupier'
      },
      household: {
        othersLive: 'no',
        occupants: []
      },
      evidence: {
        smiCertificate: '',
        qualifyingBenefit: '',
        studentCertificate: '',
        studentCourseMonths: null,
        studentHoursPerWeek: null,
        disabilityAdaptation: '',
        disabledPersonMainHome: '',
        apprenticeDeclaration: '',
        careLeaverProof: '',
        careLeaverAgeYears: null,
        notes: ''
      },
      declaration: {
        declaredTrue: 'yes',
        agreesToReportChanges: 'yes',
        fraudWarningAcknowledged: 'yes',
        declarantName: 'Adaeze Okonkwo',
        declarationDate: '2026-09-02'
      }
    } as Application
  },
  {
    id: 'CTD-2026-0002',
    applicantName: 'Adaeze Okonkwo',
    billingAuthority: 'Leeds City Council',
    appliedDate: '2026-09-02',
    data: {
      claim: {
        claimType: 'single-person-discount',
        billingAuthority: 'Leeds City Council',
        accountReference: 'CT-100234',
        applicationDate: '2026-09-02',
        effectiveDate: '2026-09-02'
      },
      applicant: {
        name: 'Adaeze Okonkwo',
        birthDate: '1985-04-12',
        email: 'adaeze.okonkwo@example.com',
        phone: '07700 900123',
        status: 'counted-adult'
      },
      property: {
        addressAsFullText: '14 Mill Lane, Leeds',
        postcode: 'LS6 2AB',
        band: 'C',
        mainResidence: 'yes',
        liableRole: 'owner-occupier'
      },
      household: {
        othersLive: 'yes',
        occupants: [
          {
            name: 'Tunde Okonkwo',
            birthDate: '1983-02-20',
            status: 'counted-adult',
            evidenceHeld: ''
          }
        ]
      },
      evidence: {
        smiCertificate: '',
        qualifyingBenefit: '',
        studentCertificate: '',
        studentCourseMonths: null,
        studentHoursPerWeek: null,
        disabilityAdaptation: '',
        disabledPersonMainHome: '',
        apprenticeDeclaration: '',
        careLeaverProof: '',
        careLeaverAgeYears: null,
        notes: ''
      },
      declaration: {
        declaredTrue: 'yes',
        agreesToReportChanges: 'yes',
        fraudWarningAcknowledged: 'yes',
        declarantName: 'Adaeze Okonkwo',
        declarationDate: '2026-09-02'
      }
    } as Application
  },
  {
    id: 'CTD-2026-0003',
    applicantName: 'Rhys Hughes',
    billingAuthority: 'Leeds City Council',
    appliedDate: '2026-09-02',
    data: {
      claim: {
        claimType: 'student-exemption',
        billingAuthority: 'Leeds City Council',
        accountReference: 'CT-100234',
        applicationDate: '2026-09-02',
        effectiveDate: '2026-09-02'
      },
      applicant: {
        name: 'Rhys Hughes',
        birthDate: '2004-06-01',
        email: 'adaeze.okonkwo@example.com',
        phone: '07700 900123',
        status: 'full-time-student'
      },
      property: {
        addressAsFullText: '14 Mill Lane, Leeds',
        postcode: 'LS6 2AB',
        band: 'C',
        mainResidence: 'yes',
        liableRole: 'owner-occupier'
      },
      household: {
        othersLive: 'yes',
        occupants: [
          {
            name: 'Sam Lee',
            birthDate: '2004-11-09',
            status: 'full-time-student',
            evidenceHeld: 'yes'
          }
        ]
      },
      evidence: {
        smiCertificate: '',
        qualifyingBenefit: '',
        studentCertificate: 'yes',
        studentCourseMonths: 36,
        studentHoursPerWeek: 25,
        disabilityAdaptation: '',
        disabledPersonMainHome: '',
        apprenticeDeclaration: '',
        careLeaverProof: '',
        careLeaverAgeYears: null,
        notes: ''
      },
      declaration: {
        declaredTrue: 'yes',
        agreesToReportChanges: 'yes',
        fraudWarningAcknowledged: 'yes',
        declarantName: 'Adaeze Okonkwo',
        declarationDate: '2026-09-02'
      }
    } as Application
  },
  {
    id: 'CTD-2026-0004',
    applicantName: 'Meera Patel',
    billingAuthority: 'Leeds City Council',
    appliedDate: '2026-09-02',
    data: {
      claim: {
        claimType: 'severe-mental-impairment',
        billingAuthority: 'Leeds City Council',
        accountReference: 'CT-100234',
        applicationDate: '2026-09-02',
        effectiveDate: '2026-09-02'
      },
      applicant: {
        name: 'Meera Patel',
        birthDate: '1979-08-30',
        email: 'adaeze.okonkwo@example.com',
        phone: '07700 900123',
        status: 'counted-adult'
      },
      property: {
        addressAsFullText: '14 Mill Lane, Leeds',
        postcode: 'LS6 2AB',
        band: 'C',
        mainResidence: 'yes',
        liableRole: 'owner-occupier'
      },
      household: {
        othersLive: 'yes',
        occupants: [
          {
            name: 'Anil Patel',
            birthDate: '1981-12-04',
            status: 'severely-mentally-impaired',
            evidenceHeld: 'no'
          }
        ]
      },
      evidence: {
        smiCertificate: 'yes',
        qualifyingBenefit: '',
        studentCertificate: '',
        studentCourseMonths: null,
        studentHoursPerWeek: null,
        disabilityAdaptation: '',
        disabledPersonMainHome: '',
        apprenticeDeclaration: '',
        careLeaverProof: '',
        careLeaverAgeYears: null,
        notes: ''
      },
      declaration: {
        declaredTrue: 'yes',
        agreesToReportChanges: '',
        fraudWarningAcknowledged: '',
        declarantName: 'Adaeze Okonkwo',
        declarationDate: '2026-09-02'
      }
    } as Application
  },
  {
    id: 'CTD-2026-0005',
    applicantName: 'Adaeze Okonkwo',
    billingAuthority: 'Leeds City Council',
    appliedDate: '2026-09-02',
    data: {
      claim: {
        claimType: 'disabled-band-reduction',
        billingAuthority: 'Leeds City Council',
        accountReference: 'CT-100234',
        applicationDate: '2026-09-02',
        effectiveDate: '2026-09-02'
      },
      applicant: {
        name: 'Adaeze Okonkwo',
        birthDate: '1985-04-12',
        email: 'adaeze.okonkwo@example.com',
        phone: '07700 900123',
        status: 'counted-adult'
      },
      property: {
        addressAsFullText: '14 Mill Lane, Leeds',
        postcode: 'LS6 2AB',
        band: 'A',
        mainResidence: 'yes',
        liableRole: 'owner-occupier'
      },
      household: {
        othersLive: 'no',
        occupants: []
      },
      evidence: {
        smiCertificate: '',
        qualifyingBenefit: '',
        studentCertificate: '',
        studentCourseMonths: null,
        studentHoursPerWeek: null,
        disabilityAdaptation: 'wheelchair-space',
        disabledPersonMainHome: 'yes',
        apprenticeDeclaration: '',
        careLeaverProof: '',
        careLeaverAgeYears: null,
        notes: ''
      },
      declaration: {
        declaredTrue: 'yes',
        agreesToReportChanges: 'yes',
        fraudWarningAcknowledged: 'yes',
        declarantName: 'Adaeze Okonkwo',
        declarationDate: '2026-09-02'
      }
    } as Application
  },
  {
    id: 'CTD-2026-0006',
    applicantName: 'Imani Brown',
    billingAuthority: 'Leeds City Council',
    appliedDate: '2026-09-02',
    data: {
      claim: {
        claimType: 'care-leaver-relief',
        billingAuthority: 'Leeds City Council',
        accountReference: 'CT-100234',
        applicationDate: '2026-09-02',
        effectiveDate: '2026-09-02'
      },
      applicant: {
        name: 'Imani Brown',
        birthDate: '2000-07-07',
        email: 'adaeze.okonkwo@example.com',
        phone: '07700 900123',
        status: 'counted-adult'
      },
      property: {
        addressAsFullText: '14 Mill Lane, Leeds',
        postcode: 'LS6 2AB',
        band: 'C',
        mainResidence: 'yes',
        liableRole: 'owner-occupier'
      },
      household: {
        othersLive: 'no',
        occupants: []
      },
      evidence: {
        smiCertificate: '',
        qualifyingBenefit: '',
        studentCertificate: '',
        studentCourseMonths: null,
        studentHoursPerWeek: null,
        disabilityAdaptation: '',
        disabledPersonMainHome: '',
        apprenticeDeclaration: '',
        careLeaverProof: 'yes',
        careLeaverAgeYears: 26,
        notes: ''
      },
      declaration: {
        declaredTrue: 'yes',
        agreesToReportChanges: 'yes',
        fraudWarningAcknowledged: 'yes',
        declarantName: 'Adaeze Okonkwo',
        declarationDate: '2026-09-02'
      }
    } as Application
  }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleApplicationRows: DashboardRow[] = sampleApplications.map((s) => {
  const r = validateApplication(s.data);
  return {
    id: s.id,
    accountReference: s.data.claim.accountReference,
    applicantName: s.applicantName,
    claimType: s.data.claim.claimType,
    billingAuthority: s.billingAuthority,
    eligibilityClass: r.eligibilityClass,
    indicativeOutcome: r.indicativeOutcome,
    flagCount: r.flaggedIssues.length,
    appliedDate: s.appliedDate
  };
});
