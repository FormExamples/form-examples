// Display helpers: enum labels and Lily-token colour classes.

import type {
  CopyOrderChannel,
  DeadlineStatus,
  DeathJurisdiction,
  DisposalMethod,
  InformantRelationship,
  MedicalExaminerStatus,
  Priority,
  RegistrationClass,
  Sex,
  TellUsOnceStatus,
  CoronerStage
} from './types';

const REGISTRATION_CLASS_LABELS: Record<RegistrationClass, string> = {
  'ready-to-register': 'Ready to register',
  incomplete: 'Incomplete',
  'referred-to-coroner-pending': 'Referred to coroner - pending',
  registered: 'Registered'
};

/** Registration-class label for display. */
export function registrationClassLabel(cls: RegistrationClass): string {
  return REGISTRATION_CLASS_LABELS[cls] ?? '';
}

/** Short registration-class label for the dashboard. */
export function registrationClassShort(cls: RegistrationClass): string {
  switch (cls) {
    case 'ready-to-register':
      return 'Ready';
    case 'incomplete':
      return 'Incomplete';
    case 'referred-to-coroner-pending':
      return 'Coroner';
    case 'registered':
      return 'Registered';
    default:
      return '';
  }
}

/** Lily-token colour utility classes for the registration-class badge / banner. */
export function registrationClassColor(cls: RegistrationClass): string {
  switch (cls) {
    case 'ready-to-register':
    case 'registered':
      return 'bg-success text-success-content border-success';
    case 'incomplete':
      return 'bg-warning text-warning-content border-warning';
    case 'referred-to-coroner-pending':
      return 'bg-error text-error-content border-error';
    default:
      return 'bg-base-300 text-base-content border-base-300';
  }
}

const DEADLINE_LABELS: Record<DeadlineStatus, string> = {
  'not-started': 'Clock not started',
  'paused-coroner': 'Paused (coroner)',
  'on-track': 'On track',
  'due-soon': 'Due soon',
  overdue: 'Overdue',
  registered: 'Registered in time',
  'registered-late': 'Registered late'
};

/** 5-day deadline status label. */
export function deadlineStatusLabel(status: DeadlineStatus): string {
  return DEADLINE_LABELS[status] ?? '';
}

/** Lily-token colour utility classes for a flag priority. */
export function priorityColor(priority: Priority): string {
  switch (priority) {
    case 'high':
      return 'bg-error text-error-content border-error';
    case 'medium':
      return 'bg-warning text-warning-content border-warning';
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
  other: 'Other',
  unknown: 'Unknown'
};
export function sexLabel(value: Sex): string {
  return SEX[value] ?? '';
}

const JURISDICTION: Record<string, string> = {
  'england-wales': 'England or Wales',
  scotland: 'Scotland',
  'northern-ireland': 'Northern Ireland',
  abroad: 'Abroad'
};
export function jurisdictionLabel(value: DeathJurisdiction): string {
  return JURISDICTION[value] ?? '';
}

const ME: Record<string, string> = {
  confirmed: 'Confirmed by the medical examiner',
  pending: 'Awaiting the medical examiner'
};
export function medicalExaminerStatusLabel(value: MedicalExaminerStatus): string {
  return ME[value] ?? '';
}

const STAGE: Record<string, string> = {
  investigating: 'Coroner investigating',
  'post-mortem': 'Post-mortem ordered',
  'inquest-opened': 'Inquest opened',
  'released-no-inquest': 'Released, no inquest needed',
  'inquest-concluded': 'Inquest concluded'
};
export function coronerStageLabel(value: CoronerStage): string {
  return STAGE[value] ?? '';
}

const RELATIONSHIP: Record<string, string> = {
  'relative-present-at-death': 'Relative present at the death',
  'relative-in-attendance': 'Relative in attendance during the last illness',
  'relative-in-district': 'Relative living in the registration district',
  'person-present-at-death': 'Person present at the death',
  'occupier-of-premises': 'Occupier of the premises where the death occurred',
  'person-arranging-funeral': 'Person arranging the funeral',
  'not-qualified': 'None of these (not a qualified informant)'
};
export function relationshipLabel(value: InformantRelationship): string {
  return RELATIONSHIP[value] ?? '';
}

const DISPOSAL: Record<string, string> = {
  burial: 'Burial',
  cremation: 'Cremation',
  other: 'Other',
  undecided: 'Not yet decided'
};
export function disposalMethodLabel(value: DisposalMethod): string {
  return DISPOSAL[value] ?? '';
}

const TUO: Record<string, string> = {
  'reference-received': 'Reference number received',
  'not-offered': 'Not offered',
  declined: 'Declined'
};
export function tellUsOnceStatusLabel(value: TellUsOnceStatus): string {
  return TUO[value] ?? '';
}

const CHANNEL: Record<string, string> = {
  'at-registration': 'At registration',
  'gro-online': 'GRO online',
  phone: 'GRO by phone',
  post: 'GRO by post',
  'local-register-office': 'Local register office'
};
export function copyOrderChannelLabel(value: CopyOrderChannel): string {
  return CHANNEL[value] ?? '';
}

/** Yes/no label. */
export function yesNoLabel(value: string): string {
  switch (value) {
    case 'yes':
      return 'Yes';
    case 'no':
      return 'No';
    default:
      return '';
  }
}
