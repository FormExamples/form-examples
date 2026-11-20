import type { ApplicationClass, MaritalStatus, MarriageApplication } from '#lib/engine/types.js';
import { gradeApplication } from '#lib/engine/application-grader.js';
import { createDefaultApplication } from '#lib/engine/utils.js';

/** A sample application: an identifier and the full data the engine grades. */
export interface SampleApplication {
  id: string;
  applicants: string;
  data: MarriageApplication;
}

/** A row in the review dashboard, derived by running the shared engine. */
export interface DashboardRow {
  id: string;
  applicants: string;
  jurisdiction: string;
  applicationDate: string;
  applicationClass: ApplicationClass;
  earliestCeremonyDate: string;
  flagCount: number;
}

type Overrides = {
  state: string;
  county: string;
  applied: string;
  one: [name: string, dob: string, marital?: MarriageApplication['applicantOne']['maritalStatus']];
  two: [name: string, dob: string, marital?: MarriageApplication['applicantTwo']['maritalStatus']];
  issued?: string;
  ceremony?: string;
  extra?: (d: MarriageApplication) => void;
};

/** Build a sample application: two identified applicants, then any overrides. */
function build(o: Overrides): MarriageApplication {
  const d = createDefaultApplication();
  d.jurisdiction = {
    state: o.state,
    county: o.county,
    applicationDate: o.applied,
    licenseType: 'standard'
  };
  const person = (name: string, dob: string, marital: MaritalStatus | undefined) => ({
    name,
    sex: '' as const,
    dateOfBirth: dob,
    placeOfBirth: 'United States',
    residenceState: o.state,
    idPresented: 'yes' as const,
    ssnStatus: 'provided' as const,
    maritalStatus: marital ?? ('never-married' as const),
    priorMarriageEndedDate:
      marital && marital !== 'never-married' && marital !== 'currently-married'
        ? '2024-01-15'
        : null
  });
  d.applicantOne = person(...o.one);
  d.applicantTwo = person(...o.two);
  d.eligibility = {
    relationshipBetweenApplicants: 'not-related',
    minorConsent: 'not-applicable',
    activeDutyMilitary: 'no',
    appearInPerson: 'yes',
    proxyRequested: 'no',
    premaritalCourseCompleted: 'no',
    bloodTestEvidence: 'not-required'
  };
  if (o.issued) d.issuance.licenseIssuedDate = o.issued;
  if (o.ceremony) d.ceremony.ceremonyDate = o.ceremony;
  o.extra?.(d);
  return d;
}

export const sampleApplications: SampleApplication[] = [
  {
    id: 'A-1001',
    applicants: 'Garcia and Lee',
    data: build({
      state: 'CA',
      county: 'Los Angeles County',
      applied: '2026-08-20',
      one: ['Maria Garcia', '1990-03-14'],
      two: ['Jordan Lee', '1988-07-02'],
      issued: '2026-08-20'
    })
  },
  {
    id: 'A-1002',
    applicants: 'Okafor and Reyes',
    data: build({
      state: 'NY',
      county: 'Kings County',
      applied: '2026-08-27',
      one: ['Chidi Okafor', '1987-02-11', 'divorced'],
      two: ['Ana Reyes', '1989-09-30'],
      issued: '2026-08-27'
    })
  },
  {
    id: 'A-1003',
    applicants: 'Nowak and Silva',
    data: build({
      state: 'TX',
      county: 'Travis County',
      applied: '2026-08-30',
      one: ['Tomasz Nowak', '1985-05-30'],
      two: ['Elena Silva', '1987-12-12'],
      issued: '2026-08-30',
      ceremony: '2026-08-31'
    })
  },
  {
    id: 'A-1004',
    applicants: 'Hughes and Patel',
    data: build({
      state: 'PA',
      county: 'Allegheny County',
      applied: '2026-09-01',
      one: ['Grace Hughes', '2009-01-17'],
      two: ['Samir Patel', '1986-09-03', 'currently-married']
    })
  },
  {
    id: 'A-1005',
    applicants: 'Byrne and Doyle',
    data: build({
      state: 'VT',
      county: 'Chittenden County',
      applied: '2026-09-01',
      one: ['Noah Byrne', '1992-03-03'],
      two: ['Sinead Doyle', '1993-06-21']
    })
  },
  {
    id: 'A-1006',
    applicants: 'Ellis and Fletcher',
    data: build({
      state: 'WA',
      county: 'King County',
      applied: '2026-09-02',
      one: ['Rosa Ellis', '1991-04-04'],
      two: ['Marcus Fletcher', '1990-08-19', 'widowed'],
      issued: '2026-09-02'
    })
  }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleApplicationRows: DashboardRow[] = sampleApplications.map((s) => {
  const r = gradeApplication(s.data);
  return {
    id: s.id,
    applicants: s.applicants,
    jurisdiction: `${s.data.jurisdiction.state}, ${s.data.jurisdiction.county}`,
    applicationDate: s.data.jurisdiction.applicationDate ?? '',
    applicationClass: r.applicationClass,
    earliestCeremonyDate: r.earliestCeremonyDate ?? '',
    flagCount: r.flaggedIssues.length
  };
});
