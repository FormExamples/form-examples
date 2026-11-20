import type {
  AttendanceMode,
  ImplantedDeviceStatus,
  PregnancyStatus,
  CoronerReason,
  DoctorGrade,
  MedicalExaminerStatus,
  Priority,
  SeenAfterDeathBy,
  Sex,
  ValidityClass
} from './types';

/** Validity-class label for display. */
export function validityClassLabel(cls: ValidityClass): string {
  switch (cls) {
    case 'valid':
      return 'Valid';
    case 'incomplete':
      return 'Incomplete';
    case 'refer-to-coroner':
      return 'Refer to coroner';
    default:
      return '';
  }
}

/** Short validity-class label for the dashboard. */
export function validityClassShort(cls: ValidityClass): string {
  switch (cls) {
    case 'valid':
      return 'Valid';
    case 'incomplete':
      return 'Incomplete';
    case 'refer-to-coroner':
      return 'Coroner';
    default:
      return 'N/A';
  }
}

/** Lily-token colour utility classes for the validity-class badge / banner. */
export function validityClassColor(cls: ValidityClass): string {
  switch (cls) {
    case 'valid':
      return 'bg-success text-success-content border-success';
    case 'incomplete':
      return 'bg-warning text-warning-content border-warning';
    case 'refer-to-coroner':
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

/** Certifying-doctor-grade label. */
export function gradeLabel(value: DoctorGrade): string {
  switch (value) {
    case 'consultant':
      return 'Consultant';
    case 'sas':
      return 'SAS doctor';
    case 'registrar':
      return 'Registrar';
    case 'foundation':
      return 'Foundation doctor';
    case 'gp':
      return 'General practitioner';
    case 'other':
      return 'Other';
    default:
      return '';
  }
}

/** Deceased-sex label. */
export function sexLabel(value: Sex): string {
  switch (value) {
    case 'female':
      return 'Female';
    case 'male':
      return 'Male';
    case 'other':
      return 'Other';
    case 'unknown':
      return 'Unknown';
    default:
      return '';
  }
}

/** Seen-after-death-by label. */
export function seenAfterDeathByLabel(value: SeenAfterDeathBy): string {
  switch (value) {
    case 'certifier':
      return 'By the certifying doctor';
    case 'another-practitioner':
      return 'By another practitioner';
    case 'not-seen':
      return 'Not seen after death';
    default:
      return '';
  }
}

/** Coroner-referral-reason label. */
export function coronerReasonLabel(value: CoronerReason): string {
  switch (value) {
    case 'unnatural':
      return 'Unnatural death';
    case 'violent':
      return 'Violent death';
    case 'suspicious':
      return 'Suspicious circumstances';
    case 'unknown-cause':
      return 'Cause of death unknown';
    case 'industrial-disease':
      return 'Industrial disease or occupational exposure';
    case 'medical-procedure':
      return 'Possibly due to a medical procedure, treatment, or neglect';
    case 'custody':
      return 'Death in custody or state detention';
    case 'no-attending-practitioner':
      return 'No attending practitioner able to certify';
    case 'neglect':
      return 'Neglect or self-neglect';
    case 'self-harm':
      return 'Self-harm';
    case 'poisoning':
      return 'Poisoning or overdose';
    case 'other':
      return 'Other reportable circumstance';
    case 'none':
      return 'None — no referral criterion met';
    default:
      return '';
  }
}

/** Medical-examiner-status label. */
export function medicalExaminerStatusLabel(value: MedicalExaminerStatus): string {
  switch (value) {
    case 'scrutinised':
      return 'Scrutinised by a medical examiner';
    case 'discussed':
      return 'Discussed with a medical examiner';
    case 'pending':
      return 'Scrutiny pending';
    case 'not-required':
      return 'Not required (coroner case)';
    default:
      return '';
  }
}

/** Yes / No label. */
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

/** Attendance-mode label. */
export function attendanceModeLabel(value: AttendanceMode): string {
  switch (value) {
    case 'in-person':
      return 'In person';
    case 'video':
      return 'Video consultation';
    case 'telephone':
      return 'Telephone only (does not qualify)';
    case 'none':
      return 'Did not attend the deceased';
    default:
      return '';
  }
}

/** Pregnancy-status label. */
export function pregnancyStatusLabel(value: PregnancyStatus): string {
  switch (value) {
    case 'not-applicable':
      return 'Not applicable';
    case 'not-pregnant':
      return 'Not pregnant in the 12 months before death';
    case 'pregnant-at-death':
      return 'Pregnant at the time of death';
    case 'pregnant-within-12-months':
      return 'Pregnant within the 12 months before death';
    case 'unknown':
      return 'Unknown';
    default:
      return '';
  }
}

/** Implanted-device-status label. */
export function implantedDeviceStatusLabel(value: ImplantedDeviceStatus): string {
  switch (value) {
    case 'none':
      return 'No hazardous implanted device';
    case 'present':
      return 'Hazardous implanted device present';
    case 'unknown':
      return 'Unknown';
    default:
      return '';
  }
}
