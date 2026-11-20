import type { Application, ValidityClass } from '#lib/engine/types.js';
import { validateApplication } from '#lib/engine/marriage-grader.js';
import { createDefaultApplication } from '#lib/stores/assessment.svelte.js';

/** A sample application: an identifier and the full data the engine grades. */
export interface SampleApplication {
  id: string;
  partyNames: string;
  registrationDistrict: string;
  noticeDate: string;
  data: Application;
}

/** A row in the register-office dashboard, derived by running the shared engine. */
export interface DashboardRow {
  id: string;
  partyNames: string;
  registrationDistrict: string;
  validityClass: ValidityClass;
  ceremonyDate: string;
  immigrationReferral: string;
  flagCount: number;
  noticeDate: string;
}

/** A complete, eligible, fully evidenced baseline; each sample adjusts it. */
function readyApplication(): Application {
  const d = createDefaultApplication();
  d.notice = {
    noticeType: 'marriage',
    noticeDate: '2026-06-01',
    registrationDistrict: 'Leeds',
    noticeGivenTogether: 'yes'
  };
  d.ceremony = {
    ceremonyType: 'civil-register-office',
    ceremonyDate: '2026-08-15',
    venueName: 'Leeds Register Office, Park Row, Leeds',
    venueConfirmed: 'yes',
    witnessCount: 2
  };
  d.partyOne = {
    name: 'Amara Okafor',
    dateOfBirth: '1993-04-12',
    daysResidentInDistrict: 400,
    nationalityStatus: 'british-or-irish',
    maritalStatus: 'never-married',
    identityProvided: 'yes',
    addressProofProvided: 'yes',
    priorEndEvidenceProvided: 'not-applicable',
    immigrationEvidenceProvided: 'not-applicable'
  };
  d.partyTwo = {
    name: 'Daniel Hughes',
    dateOfBirth: '1991-11-03',
    daysResidentInDistrict: 900,
    nationalityStatus: 'british-or-irish',
    maritalStatus: 'never-married',
    identityProvided: 'yes',
    addressProofProvided: 'yes',
    priorEndEvidenceProvided: 'not-applicable',
    immigrationEvidenceProvided: 'not-applicable'
  };
  d.relationship = { closelyRelated: 'no' };
  d.certificate = {
    certificateCopies: 2,
    certificateService: 'standard',
    groIndexReference: 'GRO-2026-884213',
    applicantNote: ''
  };
  return d;
}

/** Needs evidence: a widowed party without a death certificate, and short residence. */
function needsEvidenceApplication(): Application {
  const d = readyApplication();
  d.notice.registrationDistrict = 'Bristol';
  d.partyOne.name = 'Piotr Nowak';
  d.partyOne.daysResidentInDistrict = 3;
  d.partyTwo.name = 'Helen Marsh';
  d.partyTwo.maritalStatus = 'widowed';
  d.partyTwo.priorEndEvidenceProvided = 'no';
  return d;
}

/** Incomplete: only a notice type and one name, with a certificate request but no service. */
function incompleteApplication(): Application {
  const d = createDefaultApplication();
  d.notice.noticeType = 'civil-partnership';
  d.notice.registrationDistrict = 'Manchester';
  d.partyOne.name = 'Aoife Byrne';
  d.certificate.certificateCopies = 1;
  return d;
}

/** Needs evidence: an overseas party without immigration evidence, notice not joint. */
function immigrationApplication(): Application {
  const d = readyApplication();
  d.notice.registrationDistrict = 'Birmingham';
  d.notice.noticeGivenTogether = 'no';
  d.partyOne.name = 'Chidi Eze';
  d.partyTwo.name = 'Lena Fischer';
  d.partyTwo.nationalityStatus = 'other';
  d.partyTwo.immigrationEvidenceProvided = 'no';
  return d;
}

/** Ineligible: the second party is 17 on the ceremony date. */
function ineligibleApplication(): Application {
  const d = readyApplication();
  d.notice.registrationDistrict = 'Cardiff';
  d.partyOne.name = 'Jamie Cole';
  d.partyTwo.name = 'Riley Cole';
  d.partyTwo.dateOfBirth = '2009-03-01';
  return d;
}

/** The sample applications, keyed by stable id (used to seed the wizard). */
export const sampleCertificates: SampleApplication[] = [
  {
    id: 'UKMCA-2026-0001',
    partyNames: 'Amara Okafor and Daniel Hughes',
    registrationDistrict: 'Leeds',
    noticeDate: '2026-06-01',
    data: readyApplication()
  },
  {
    id: 'UKMCA-2026-0002',
    partyNames: 'Piotr Nowak and Helen Marsh',
    registrationDistrict: 'Bristol',
    noticeDate: '2026-06-01',
    data: needsEvidenceApplication()
  },
  {
    id: 'UKMCA-2026-0003',
    partyNames: 'Aoife Byrne',
    registrationDistrict: 'Manchester',
    noticeDate: '',
    data: incompleteApplication()
  },
  {
    id: 'UKMCA-2026-0004',
    partyNames: 'Chidi Eze and Lena Fischer',
    registrationDistrict: 'Birmingham',
    noticeDate: '2026-06-01',
    data: immigrationApplication()
  },
  {
    id: 'UKMCA-2026-0005',
    partyNames: 'Jamie Cole and Riley Cole',
    registrationDistrict: 'Cardiff',
    noticeDate: '2026-06-01',
    data: ineligibleApplication()
  }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleCertificateRows: DashboardRow[] = sampleCertificates.map((s) => {
  const r = validateApplication(s.data);
  return {
    id: s.id,
    partyNames: s.partyNames,
    registrationDistrict: s.registrationDistrict,
    validityClass: r.validityClass,
    ceremonyDate: s.data.ceremony.ceremonyDate ?? '',
    immigrationReferral: r.immigrationReferralIndicated ? 'Yes' : 'No',
    flagCount: r.flaggedIssues.length,
    noticeDate: s.noticeDate
  };
});
