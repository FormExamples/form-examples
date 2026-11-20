import type { BirthCertificateApplication, ApplicationClass } from '#lib/engine/types.js';
import { validateApplication } from '#lib/engine/birth-grader.js';
import { createDefaultApplication } from '#lib/engine/defaults.js';

/** A sample application: an identifier and the full data the engine grades. */
export interface SampleApplication {
  id: string;
  registrantName: string;
  applicantName: string;
  updatedAt: string;
  data: BirthCertificateApplication;
}

/** A row in the applications dashboard, derived by running the shared engine. */
export interface DashboardRow {
  id: string;
  registrantName: string;
  birthState: string;
  requesterRelationship: string;
  applicationClass: ApplicationClass;
  ineligibleRequester: string;
  applicantName: string;
  flagCount: number;
  updatedAt: string;
}

/** Ready: a California adult requesting their own long form for a passport. */
function readyApplication(): BirthCertificateApplication {
  const d = createDefaultApplication();
  d.applicant = {
    applicantName: 'Elena Maria Garcia',
    dateOfBirth: '1990-04-12',
    email: 'elena.garcia@example.org',
    phone: '555-0142',
    postalAddress: '410 Alder Street, Sacramento, CA 95814'
  };
  d.registrant = {
    registrantName: 'Elena Maria Garcia',
    sex: 'female',
    dateOfBirth: '1990-04-12',
    placeOfBirth: 'Fresno',
    countyOfBirth: 'Fresno',
    state: 'CA',
    birthFacility: 'Community Regional Medical Center',
    motherNameBeforeFirstMarriage: 'Rosa Lucia Hernandez',
    fatherName: 'Carlos Garcia',
    deceased: 'no',
    adopted: 'no'
  };
  d.purpose = {
    relationship: 'self',
    purpose: 'passport',
    needsApostille: 'no',
    apostilleCountry: ''
  };
  d.order = {
    certificateType: 'certified-long-form',
    copies: 1,
    deliveryMethod: 'mail',
    feeEnclosedUsd: 31
  };
  d.evidence = {
    idType: 'state-driver-license',
    idUnexpired: 'yes',
    proofOfRelationship: 'no',
    authorityDocument: 'no',
    notarizedSwornStatement: 'yes'
  };
  d.declaration = { declarationSigned: 'yes', applicationNote: '' };
  return d;
}

/** Incomplete: a New York spouse with no proof, expired ID, and a short fee. */
function incompleteApplication(): BirthCertificateApplication {
  const d = readyApplication();
  d.applicant.applicantName = 'Anna Nowak';
  d.applicant.dateOfBirth = '1980-06-01';
  d.registrant.registrantName = 'Piotr Nowak';
  d.registrant.dateOfBirth = '1978-11-20';
  d.registrant.placeOfBirth = 'Albany';
  d.registrant.state = 'NY';
  d.registrant.motherNameBeforeFirstMarriage = 'Maria Kowalski';
  d.purpose.relationship = 'spouse';
  d.purpose.purpose = 'benefits';
  d.order.feeEnclosedUsd = 15;
  d.evidence.idUnexpired = 'no';
  d.evidence.notarizedSwornStatement = 'no';
  return d;
}

/** Ineligible: a Florida sibling of a living registrant. */
function ineligibleApplication(): BirthCertificateApplication {
  const d = readyApplication();
  d.applicant.applicantName = 'Devon Brown';
  d.applicant.dateOfBirth = '1992-01-15';
  d.registrant.registrantName = 'Marcus Brown';
  d.registrant.dateOfBirth = '1989-07-07';
  d.registrant.placeOfBirth = 'Tampa';
  d.registrant.state = 'FL';
  d.registrant.motherNameBeforeFirstMarriage = 'Janet Wills';
  d.purpose.relationship = 'sibling';
  d.purpose.purpose = 'employment';
  d.order.feeEnclosedUsd = 15;
  d.evidence.proofOfRelationship = 'yes';
  d.evidence.notarizedSwornStatement = 'no';
  return d;
}

/** Ready: a Texas parent ordering two short-form copies for school. */
function parentApplication(): BirthCertificateApplication {
  const d = readyApplication();
  d.applicant.applicantName = 'Ngozi Okafor';
  d.applicant.dateOfBirth = '1985-09-30';
  d.registrant.registrantName = 'Chidi Okafor';
  d.registrant.dateOfBirth = '2016-02-03';
  d.registrant.placeOfBirth = 'Houston';
  d.registrant.state = 'TX';
  d.registrant.motherNameBeforeFirstMarriage = 'Ngozi Adeyemi';
  d.purpose.relationship = 'parent';
  d.purpose.purpose = 'school';
  d.order.certificateType = 'certified-short-form';
  d.order.copies = 2;
  d.order.feeEnclosedUsd = 25;
  d.evidence.notarizedSwornStatement = 'no';
  return d;
}

/** The sample applications, keyed by stable id (used to seed the wizard). */
export const sampleApplications: SampleApplication[] = [
  {
    id: 'BCA-2026-0001',
    registrantName: 'Garcia, Elena',
    applicantName: 'Elena Garcia',
    updatedAt: '2026-10-11',
    data: readyApplication()
  },
  {
    id: 'BCA-2026-0002',
    registrantName: 'Nowak, Piotr',
    applicantName: 'Anna Nowak',
    updatedAt: '2026-10-12',
    data: incompleteApplication()
  },
  {
    id: 'BCA-2026-0003',
    registrantName: 'Brown, Marcus',
    applicantName: 'Devon Brown',
    updatedAt: '2026-10-13',
    data: ineligibleApplication()
  },
  {
    id: 'BCA-2026-0004',
    registrantName: 'Okafor, Chidi',
    applicantName: 'Ngozi Okafor',
    updatedAt: '2026-10-14',
    data: parentApplication()
  }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleApplicationRows: DashboardRow[] = sampleApplications.map((s) => {
  const r = validateApplication(s.data);
  return {
    id: s.id,
    registrantName: s.registrantName,
    birthState: s.data.registrant.state,
    requesterRelationship: s.data.purpose.relationship,
    applicationClass: r.applicationClass,
    ineligibleRequester: r.applicationClass === 'ineligible-requester' ? 'Yes' : 'No',
    applicantName: s.applicantName,
    flagCount: r.flaggedIssues.length,
    updatedAt: s.updatedAt
  };
});
