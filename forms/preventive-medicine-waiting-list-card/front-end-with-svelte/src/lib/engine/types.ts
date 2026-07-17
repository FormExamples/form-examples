// Domain types for the Preventive Medicine Waiting List Card scoring engine.
//
// Empty string '' for unanswered text and enum fields.
// null for unanswered numeric, date, and time fields.
// camelCase throughout.

export type ClinicalPriority = 'P1a' | 'P1b' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6' | '';

export type WaitingTimeStatus =
  | 'within-target'
  | 'approaching-breach'
  | 'breached'
  | 'long-wait'
  | '';

export type CardStatus = 'draft' | 'submitted' | 'reviewed' | 'closed';

export type YesNo = 'yes' | 'no' | '';

export type ReferralSource =
  | 'gp'
  | 'consultant'
  | 'a-and-e'
  | 'self'
  | 'community'
  | 'screening'
  | 'other'
  | '';

export type ExpectedProcedureType =
  | 'first-outpatient-appointment'
  | 'follow-up-appointment'
  | 'day-case-procedure'
  | 'inpatient-procedure'
  | 'diagnostic'
  | 'therapy'
  | 'multi-disciplinary-team-review'
  | 'other'
  | '';

export type AppointmentType =
  | 'first-outpatient'
  | 'follow-up'
  | 'pre-assessment'
  | 'diagnostic'
  | 'treatment'
  | 'procedure'
  | 'admission'
  | 'telephone'
  | 'video'
  | 'other'
  | '';

export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'rebooked'
  | 'cancelled'
  | 'attended'
  | 'did-not-attend';

export type PreferredContactChannel = 'sms' | 'email' | 'phone' | 'letter' | 'nhs-app' | '';

export type PractitionerRole =
  | 'gp'
  | 'consultant'
  | 'specialist-nurse'
  | 'referral-coordinator'
  | 'booking-clerk'
  | 'rtt-validator'
  | 'other'
  | '';

export type RegistrationBody = 'GMC' | 'NMC' | 'HCPC' | 'GPhC' | 'other' | '';

export interface Practitioner {
  name: string;
  role: PractitionerRole;
  registrationBody: RegistrationBody;
  registrationNumber: string;
  organisationName: string;
  organisationOdsCode: string;
  siteName: string;
  email: string;
  phone: string;
}

export interface Patient {
  name: string;
  birthDate: string | null;
  sex: 'female' | 'male' | 'intersex' | 'unknown' | '';
  unitedKingdomNhsNumber: string;
  email: string;
  phone: string;
  postalAddressAsFullText: string;
  postcode: string;
  preferredLanguageAsIso6391: string;
  interpreterRequired: YesNo;
  accessibilityNeeds: string;
  preferredContactChannel: PreferredContactChannel;
}

export interface Referral {
  referralSource: ReferralSource;
  referralDate: string | null;
  referralLetterReference: string;
  reasonForReferral: string;
  presentingCondition: string;
  icd10Code: string;
  snomedCtCode: string;
  suspectedCancer: YesNo;
}

export interface WaitingListEntry {
  listName: string;
  specialty: string;
  subSpecialty: string;
  procedureDescription: string;
  opcs4Code: string;
  clinicalPriority: ClinicalPriority;
  rttClockStartDate: string | null;
  expectedProcedureType: ExpectedProcedureType;
  expectedWaitWeeks: number | null;
}

export interface Appointment {
  appointmentDate: string | null;
  appointmentTime: string | null;
  durationMinutes: number | null;
  appointmentType: AppointmentType;
  siteName: string;
  siteAddress: string;
  clinicName: string;
  room: string;
  clinicianName: string;
  clinicianTeam: string;
  status: AppointmentStatus;
  travelNotes: string;
  accessNotes: string;
}

export interface Communication {
  consentToReminders: YesNo;
  communicationNotes: string;
}

export interface Signoff {
  additionalNotes: string;
  signedAt: string | null;
}

export interface WaitingListCard {
  status: CardStatus;
  entryDate: string | null;
  entryTime: string | null;
  practitioner: Practitioner;
  patient: Patient;
  referral: Referral;
  waitingList: WaitingListEntry;
  appointment: Appointment;
  communication: Communication;
  signoff: Signoff;
}

export type GraderInstrument = 'waiting-time-status' | 'clinical-priority' | 'long-wait';

export interface FiredRule {
  ruleId: string;
  instrument: GraderInstrument;
  band: WaitingTimeStatus;
  category: string;
  description: string;
}

export type FlagCategory =
  | 'breach-risk'
  | 'long-waiter-52-week'
  | 'priority-1-escalation'
  | 'two-week-wait-cancer'
  | 'missing-appointment'
  | 'accessibility-unmet'
  | 'interpreter-required'
  | 'contact-details-missing'
  | 'other';

export type FlagPriority = 'low' | 'medium' | 'high';

export interface AdditionalFlag {
  flagId: string;
  category: FlagCategory;
  priority: FlagPriority;
  description: string;
  suggestedAction: string;
}

export interface GradingResult {
  waitingTimeStatus: WaitingTimeStatus;
  clinicalPriority: ClinicalPriority;
  targetWaitWeeks: number | null;
  daysWaited: number | null;
  weeksWaited: number | null;
  daysToTarget: number | null;
  daysToBreach: number | null;
  daysToAppointment: number | null;
  firedRules: FiredRule[];
  additionalFlags: AdditionalFlag[];
  graderNotes: string;
}
