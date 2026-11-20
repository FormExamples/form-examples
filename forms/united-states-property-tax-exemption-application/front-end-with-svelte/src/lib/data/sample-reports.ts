import type { PropertyTaxApplication, EligibilityClass } from '#lib/engine/types.js';
import { gradeApplication } from '#lib/engine/grader.js';
import { detectFlaggedIssues } from '#lib/engine/flags.js';
import { createDefaultApplication } from '#lib/engine/defaults.js';

/** A sample application: an identifier and the full data the engine grades. */
export interface SampleApplication {
  id: string;
  applicantName: string;
  data: PropertyTaxApplication;
}

/** A row in the assessor dashboard, derived by running the shared engine. */
export interface DashboardRow {
  id: string;
  parcelNumber: string;
  applicantName: string;
  countyState: string;
  filingDate: string;
  eligibilityClass: EligibilityClass;
  exemptionsClaimed: string;
  filedLate: string;
  flagCount: number;
}

function sample(patch: (d: PropertyTaxApplication) => void): PropertyTaxApplication {
  const d = createDefaultApplication();
  patch(d);
  return d;
}

export const sampleApplications: SampleApplication[] = [
  {
    id: '1',
    applicantName: 'Maria Elena Gonzalez',
    data: sample((d) => {
      Object.assign(d.applicant, {
        applicantName: 'Maria Elena Gonzalez',
        dateOfBirth: '1954-03-12',
        ageOnAssessmentDate: 71,
        mailingAddress: '4821 Live Oak Lane, Austin, TX 78745'
      });
      Object.assign(d.property, {
        state: 'TX',
        county: 'Travis',
        parcelNumber: '0412-3300-0017',
        propertyAddress: '4821 Live Oak Lane, Austin, TX 78745',
        propertyType: 'single-family',
        ownershipType: 'sole',
        ownerOnAssessmentDate: 'yes',
        occupiedAsPrimaryResidence: 'yes',
        occupancyStartDate: '2011-06-01',
        otherHomesteadClaimed: 'no'
      });
      Object.assign(d.exemptions, {
        claimHomestead: 'yes',
        claimSenior: 'yes',
        claimDisability: 'no',
        claimVeteran: 'no',
        claimCircuitBreaker: 'no',
        veteranDisabilityPercent: null
      });
      Object.assign(d.income, { householdIncomeDollars: 38200, incomeTaxYear: 2025 });
      Object.assign(d.documents, {
        proofOfOwnership: 'yes',
        proofOfResidency: 'yes',
        proofOfAge: 'yes',
        proofOfIncome: 'yes',
        proofOfDisability: 'no'
      });
      Object.assign(d.filing, {
        assessmentYear: 2026,
        filingDate: '2026-03-18',
        applicationType: 'initial'
      });
      Object.assign(d.appeal, {
        appealRequested: 'no',
        noticeOfValueDate: null,
        appealFiled: 'no'
      });
      Object.assign(d.declaration, {
        penaltyAcknowledged: 'yes',
        signedByApplicant: 'yes',
        signatureDate: '2026-03-18'
      });
    })
  },
  {
    id: '2',
    applicantName: 'Ngozi Okafor',
    data: sample((d) => {
      Object.assign(d.applicant, {
        applicantName: 'Ngozi Okafor',
        dateOfBirth: '1985-09-02',
        ageOnAssessmentDate: 40,
        mailingAddress: '4821 Live Oak Lane, Austin, TX 78745'
      });
      Object.assign(d.property, {
        state: 'CA',
        county: 'Los Angeles',
        parcelNumber: '5043-012-031',
        propertyAddress: '1180 W 36th St, Los Angeles, CA 90007',
        propertyType: 'single-family',
        ownershipType: 'sole',
        ownerOnAssessmentDate: 'yes',
        occupiedAsPrimaryResidence: 'yes',
        occupancyStartDate: '2011-06-01',
        otherHomesteadClaimed: 'no'
      });
      Object.assign(d.exemptions, {
        claimHomestead: 'yes',
        claimSenior: 'no',
        claimDisability: 'no',
        claimVeteran: 'no',
        claimCircuitBreaker: 'no',
        veteranDisabilityPercent: null
      });
      Object.assign(d.income, { householdIncomeDollars: null, incomeTaxYear: null });
      Object.assign(d.documents, {
        proofOfOwnership: 'yes',
        proofOfResidency: 'yes',
        proofOfAge: 'no',
        proofOfIncome: 'no',
        proofOfDisability: 'no'
      });
      Object.assign(d.filing, {
        assessmentYear: 2026,
        filingDate: '2026-02-03',
        applicationType: 'initial'
      });
      Object.assign(d.appeal, {
        appealRequested: 'yes',
        noticeOfValueDate: '2026-02-01',
        appealFiled: 'no'
      });
      Object.assign(d.declaration, {
        penaltyAcknowledged: 'yes',
        signedByApplicant: 'yes',
        signatureDate: '2026-02-03'
      });
    })
  },
  {
    id: '3',
    applicantName: 'Dale Whitaker',
    data: sample((d) => {
      Object.assign(d.applicant, {
        applicantName: 'Dale Whitaker',
        dateOfBirth: '1954-03-12',
        ageOnAssessmentDate: 68,
        mailingAddress: '4821 Live Oak Lane, Austin, TX 78745'
      });
      Object.assign(d.property, {
        state: 'FL',
        county: 'Orange',
        parcelNumber: 'R-2291-0045',
        propertyAddress: '77 Cypress Court, Orlando, FL 32801',
        propertyType: 'single-family',
        ownershipType: 'sole',
        ownerOnAssessmentDate: 'yes',
        occupiedAsPrimaryResidence: 'yes',
        occupancyStartDate: '2011-06-01',
        otherHomesteadClaimed: 'no'
      });
      Object.assign(d.exemptions, {
        claimHomestead: 'yes',
        claimSenior: 'yes',
        claimDisability: 'no',
        claimVeteran: 'no',
        claimCircuitBreaker: 'no',
        veteranDisabilityPercent: null
      });
      Object.assign(d.income, { householdIncomeDollars: 38200, incomeTaxYear: 2025 });
      Object.assign(d.documents, {
        proofOfOwnership: 'no',
        proofOfResidency: 'no',
        proofOfAge: 'no',
        proofOfIncome: 'no',
        proofOfDisability: 'no'
      });
      Object.assign(d.filing, {
        assessmentYear: 2026,
        filingDate: '2026-02-20',
        applicationType: 'initial'
      });
      Object.assign(d.appeal, {
        appealRequested: 'no',
        noticeOfValueDate: null,
        appealFiled: 'no'
      });
      Object.assign(d.declaration, {
        penaltyAcknowledged: 'no',
        signedByApplicant: 'no',
        signatureDate: null
      });
    })
  },
  {
    id: '4',
    applicantName: 'Anna Kowalski',
    data: sample((d) => {
      Object.assign(d.applicant, {
        applicantName: 'Anna Kowalski',
        dateOfBirth: '1954-03-12',
        ageOnAssessmentDate: 59,
        mailingAddress: '4821 Live Oak Lane, Austin, TX 78745'
      });
      Object.assign(d.property, {
        state: 'IL',
        county: 'Cook',
        parcelNumber: '17-04-226-019',
        propertyAddress: '1560 N Damen Ave, Chicago, IL 60622',
        propertyType: 'single-family',
        ownershipType: 'sole',
        ownerOnAssessmentDate: 'yes',
        occupiedAsPrimaryResidence: 'no',
        occupancyStartDate: '2011-06-01',
        otherHomesteadClaimed: 'yes'
      });
      Object.assign(d.exemptions, {
        claimHomestead: 'yes',
        claimSenior: 'no',
        claimDisability: 'no',
        claimVeteran: 'no',
        claimCircuitBreaker: 'no',
        veteranDisabilityPercent: null
      });
      Object.assign(d.income, { householdIncomeDollars: null, incomeTaxYear: null });
      Object.assign(d.documents, {
        proofOfOwnership: 'yes',
        proofOfResidency: 'yes',
        proofOfAge: 'no',
        proofOfIncome: 'no',
        proofOfDisability: 'no'
      });
      Object.assign(d.filing, {
        assessmentYear: 2026,
        filingDate: '2026-06-02',
        applicationType: 'initial'
      });
      Object.assign(d.appeal, {
        appealRequested: 'no',
        noticeOfValueDate: null,
        appealFiled: 'no'
      });
      Object.assign(d.declaration, {
        penaltyAcknowledged: 'yes',
        signedByApplicant: 'yes',
        signatureDate: '2026-06-02'
      });
    })
  },
  {
    id: '5',
    applicantName: 'Harold Brooks',
    data: sample((d) => {
      Object.assign(d.applicant, {
        applicantName: 'Harold Brooks',
        dateOfBirth: '1954-03-12',
        ageOnAssessmentDate: 70,
        mailingAddress: '4821 Live Oak Lane, Austin, TX 78745'
      });
      Object.assign(d.property, {
        state: 'OH',
        county: 'Franklin',
        parcelNumber: '010-001234',
        propertyAddress: '918 Elm St, Columbus, OH 43215',
        propertyType: 'single-family',
        ownershipType: 'sole',
        ownerOnAssessmentDate: 'yes',
        occupiedAsPrimaryResidence: 'yes',
        occupancyStartDate: '2011-06-01',
        otherHomesteadClaimed: 'no'
      });
      Object.assign(d.exemptions, {
        claimHomestead: 'no',
        claimSenior: 'yes',
        claimDisability: 'no',
        claimVeteran: 'no',
        claimCircuitBreaker: 'no',
        veteranDisabilityPercent: null
      });
      Object.assign(d.income, { householdIncomeDollars: 52000, incomeTaxYear: 2025 });
      Object.assign(d.documents, {
        proofOfOwnership: 'yes',
        proofOfResidency: 'yes',
        proofOfAge: 'yes',
        proofOfIncome: 'yes',
        proofOfDisability: 'no'
      });
      Object.assign(d.filing, {
        assessmentYear: 2026,
        filingDate: '2027-01-04',
        applicationType: 'initial'
      });
      Object.assign(d.appeal, {
        appealRequested: 'no',
        noticeOfValueDate: null,
        appealFiled: 'no'
      });
      Object.assign(d.declaration, {
        penaltyAcknowledged: 'yes',
        signedByApplicant: 'yes',
        signatureDate: '2027-01-04'
      });
    })
  },
  {
    id: '6',
    applicantName: 'Linh Nguyen',
    data: sample((d) => {
      Object.assign(d.applicant, {
        applicantName: 'Linh Nguyen',
        dateOfBirth: '1954-03-12',
        ageOnAssessmentDate: 66,
        mailingAddress: '4821 Live Oak Lane, Austin, TX 78745'
      });
      Object.assign(d.property, {
        state: 'PA',
        county: 'Allegheny',
        parcelNumber: '0045-K-00312',
        propertyAddress: '408 Beechwood Blvd, Pittsburgh, PA 15217',
        propertyType: 'single-family',
        ownershipType: 'sole',
        ownerOnAssessmentDate: 'yes',
        occupiedAsPrimaryResidence: 'yes',
        occupancyStartDate: '2011-06-01',
        otherHomesteadClaimed: 'no'
      });
      Object.assign(d.exemptions, {
        claimHomestead: 'yes',
        claimSenior: 'no',
        claimDisability: 'no',
        claimVeteran: 'no',
        claimCircuitBreaker: 'yes',
        veteranDisabilityPercent: null
      });
      Object.assign(d.income, { householdIncomeDollars: 31000, incomeTaxYear: 2025 });
      Object.assign(d.documents, {
        proofOfOwnership: 'yes',
        proofOfResidency: 'yes',
        proofOfAge: 'no',
        proofOfIncome: 'yes',
        proofOfDisability: 'no'
      });
      Object.assign(d.filing, {
        assessmentYear: 2026,
        filingDate: '2026-04-10',
        applicationType: 'late'
      });
      Object.assign(d.appeal, {
        appealRequested: 'no',
        noticeOfValueDate: null,
        appealFiled: 'no'
      });
      Object.assign(d.declaration, {
        penaltyAcknowledged: 'yes',
        signedByApplicant: 'yes',
        signatureDate: '2026-04-10'
      });
    })
  }
];

/** Dashboard rows computed by the shared engine over the samples. */
export const sampleApplicationRows: DashboardRow[] = sampleApplications.map((s) => {
  const g = gradeApplication(s.data);
  const d = s.data;
  const claimed = [
    d.exemptions.claimHomestead === 'yes' ? 'Homestead' : '',
    d.exemptions.claimSenior === 'yes' ? 'Senior' : '',
    d.exemptions.claimDisability === 'yes' ? 'Disability' : '',
    d.exemptions.claimVeteran === 'yes' ? 'Veteran' : '',
    d.exemptions.claimCircuitBreaker === 'yes' ? 'Circuit-breaker' : ''
  ].filter(Boolean);
  return {
    id: s.id,
    parcelNumber: d.property.parcelNumber,
    applicantName: d.applicant.applicantName,
    countyState: `${d.property.county}, ${d.property.state}`,
    filingDate: d.filing.filingDate ?? '',
    eligibilityClass: g.eligibilityClass,
    exemptionsClaimed: claimed.join(', '),
    filedLate: g.filedLate ? 'Late' : 'On time',
    flagCount: detectFlaggedIssues(d).length
  };
});
