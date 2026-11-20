import type {
  Applicant,
  ApplicationClass,
  BloodTestEvidence,
  LicenseType,
  MaritalStatus,
  MarriageApplication,
  MinorConsent,
  OfficiantType,
  Priority,
  Relationship,
  Sex,
  SsnStatus,
  YesNo
} from './types';

/** A blank applicant with every field at its unanswered default. */
export function createDefaultApplicant(): Applicant {
  return {
    name: '',
    sex: '',
    dateOfBirth: null,
    placeOfBirth: '',
    residenceState: '',
    idPresented: '',
    ssnStatus: '',
    maritalStatus: '',
    priorMarriageEndedDate: null
  };
}

/** A blank application with all fields at their unanswered defaults. */
export function createDefaultApplication(): MarriageApplication {
  return {
    jurisdiction: { state: '', county: '', applicationDate: null, licenseType: '' },
    applicantOne: createDefaultApplicant(),
    applicantTwo: createDefaultApplicant(),
    eligibility: {
      relationshipBetweenApplicants: '',
      minorConsent: '',
      activeDutyMilitary: '',
      appearInPerson: '',
      proxyRequested: '',
      premaritalCourseCompleted: '',
      bloodTestEvidence: ''
    },
    issuance: { feePaidUsd: null, licenseIssuedDate: null, clerkNote: '' },
    ceremony: {
      ceremonyDate: null,
      officiantType: '',
      officiantName: '',
      officiantAuthorized: '',
      witnessCount: null,
      licenseReturnedDate: null,
      certifiedCopiesRequested: null
    }
  };
}

/** US states and the District of Columbia, as [USPS code, name]. */
export const US_STATES: ReadonlyArray<readonly [string, string]> = [
  ['AL', 'Alabama'],
  ['AK', 'Alaska'],
  ['AZ', 'Arizona'],
  ['AR', 'Arkansas'],
  ['CA', 'California'],
  ['CO', 'Colorado'],
  ['CT', 'Connecticut'],
  ['DE', 'Delaware'],
  ['DC', 'District of Columbia'],
  ['FL', 'Florida'],
  ['GA', 'Georgia'],
  ['HI', 'Hawaii'],
  ['ID', 'Idaho'],
  ['IL', 'Illinois'],
  ['IN', 'Indiana'],
  ['IA', 'Iowa'],
  ['KS', 'Kansas'],
  ['KY', 'Kentucky'],
  ['LA', 'Louisiana'],
  ['ME', 'Maine'],
  ['MD', 'Maryland'],
  ['MA', 'Massachusetts'],
  ['MI', 'Michigan'],
  ['MN', 'Minnesota'],
  ['MS', 'Mississippi'],
  ['MO', 'Missouri'],
  ['MT', 'Montana'],
  ['NE', 'Nebraska'],
  ['NV', 'Nevada'],
  ['NH', 'New Hampshire'],
  ['NJ', 'New Jersey'],
  ['NM', 'New Mexico'],
  ['NY', 'New York'],
  ['NC', 'North Carolina'],
  ['ND', 'North Dakota'],
  ['OH', 'Ohio'],
  ['OK', 'Oklahoma'],
  ['OR', 'Oregon'],
  ['PA', 'Pennsylvania'],
  ['RI', 'Rhode Island'],
  ['SC', 'South Carolina'],
  ['SD', 'South Dakota'],
  ['TN', 'Tennessee'],
  ['TX', 'Texas'],
  ['UT', 'Utah'],
  ['VT', 'Vermont'],
  ['VA', 'Virginia'],
  ['WA', 'Washington'],
  ['WV', 'West Virginia'],
  ['WI', 'Wisconsin'],
  ['WY', 'Wyoming']
];

/** Application-class label for display. */
export function applicationClassLabel(cls: ApplicationClass): string {
  switch (cls) {
    case 'ready-to-apply':
      return 'Ready to apply';
    case 'incomplete':
      return 'Incomplete';
    case 'not-eligible':
      return 'Not eligible';
    default:
      return '';
  }
}

/** Short application-class label for the dashboard. */
export function applicationClassShort(cls: ApplicationClass): string {
  switch (cls) {
    case 'ready-to-apply':
      return 'Ready';
    case 'incomplete':
      return 'Incomplete';
    case 'not-eligible':
      return 'Not eligible';
    default:
      return 'N/A';
  }
}

/** Lily-token colour utility classes for the class badge / banner. */
export function applicationClassColor(cls: ApplicationClass): string {
  switch (cls) {
    case 'ready-to-apply':
      return 'bg-success text-success-content border-success';
    case 'incomplete':
      return 'bg-warning text-warning-content border-warning';
    case 'not-eligible':
      return 'bg-error text-error-content border-error';
    default:
      return 'bg-base-300 text-base-content border-base-300';
  }
}

/** Lily-token colour utility classes for a flag priority. */
export function priorityColor(priority: Priority): string {
  switch (priority) {
    case 'high':
      return 'bg-error text-error-content border-error';
    case 'medium':
      return 'bg-warning text-warning-content border-warning';
    case 'low':
      return 'bg-base-300 text-base-content border-base-300';
    default:
      return 'bg-base-300 text-base-content border-base-300';
  }
}

/** Flag-priority label. */
export function priorityLabel(priority: Priority): string {
  switch (priority) {
    case 'high':
      return 'HIGH';
    case 'medium':
      return 'MEDIUM';
    case 'low':
      return 'LOW';
    default:
      return '';
  }
}

const SEX: Record<string, string> = {
  female: 'Female',
  male: 'Male',
  nonbinary: 'Nonbinary',
  unknown: 'Prefer not to say'
};
const MARITAL: Record<string, string> = {
  'never-married': 'Never married',
  divorced: 'Divorced',
  widowed: 'Widowed',
  annulled: 'Previous marriage annulled',
  'currently-married': 'Currently married'
};
const SSN: Record<string, string> = {
  provided: 'Provided to the clerk',
  'none-issued': 'No Social Security number issued',
  declined: 'Declined to provide'
};
const LICENSE: Record<string, string> = {
  standard: 'Standard (public) license',
  confidential: 'Confidential license'
};
const RELATIONSHIP: Record<string, string> = {
  'not-related': 'Not related',
  'related-prohibited': 'Related within a prohibited degree'
};
const MINOR: Record<string, string> = {
  'not-applicable': 'Not applicable (both 18 or older)',
  'parental-consent': 'Parental or guardian consent',
  'court-order': 'Court order or judicial approval',
  none: 'No consent or court order'
};
const BLOOD: Record<string, string> = {
  provided: 'Test evidence provided',
  'not-required': 'Not required',
  'not-provided': 'Not provided'
};
const OFFICIANT: Record<string, string> = {
  clergy: 'Clergy or religious officiant',
  judge: 'Judge or magistrate',
  clerk: 'Clerk or deputy clerk',
  notary: 'Notary public',
  'self-uniting': 'Self-uniting (no officiant)',
  other: 'Other authorized officiant'
};

export const sexLabel = (v: Sex): string => SEX[v] ?? '';
export const maritalStatusLabel = (v: MaritalStatus): string => MARITAL[v] ?? '';
export const ssnStatusLabel = (v: SsnStatus): string => SSN[v] ?? '';
export const licenseTypeLabel = (v: LicenseType): string => LICENSE[v] ?? '';
export const relationshipLabel = (v: Relationship): string => RELATIONSHIP[v] ?? '';
export const minorConsentLabel = (v: MinorConsent): string => MINOR[v] ?? '';
export const bloodTestLabel = (v: BloodTestEvidence): string => BLOOD[v] ?? '';
export const officiantTypeLabel = (v: OfficiantType): string => OFFICIANT[v] ?? '';

/** Yes / No label. */
export function yesNoLabel(value: YesNo): string {
  switch (value) {
    case 'yes':
      return 'Yes';
    case 'no':
      return 'No';
    default:
      return '';
  }
}
