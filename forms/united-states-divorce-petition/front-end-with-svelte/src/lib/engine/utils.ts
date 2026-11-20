import type {
  CaseType,
  FaultGround,
  GroundType,
  Priority,
  PropertyRegime,
  ReadinessClass,
  ServiceMethod
} from './types';

/** Readiness-class label for display. */
export function readinessClassLabel(cls: ReadinessClass): string {
  switch (cls) {
    case 'ready-to-file':
      return 'Ready to file';
    case 'incomplete':
      return 'Incomplete';
    case 'not-yet-eligible':
      return 'Not yet eligible';
    default:
      return '';
  }
}

/** Short readiness-class label for the dashboard. */
export function readinessClassShort(cls: ReadinessClass): string {
  switch (cls) {
    case 'ready-to-file':
      return 'Ready';
    case 'incomplete':
      return 'Incomplete';
    case 'not-yet-eligible':
      return 'Not yet';
    default:
      return 'N/A';
  }
}

/** Lily-token colour utility classes for the readiness badge / banner. */
export function readinessClassColor(cls: ReadinessClass): string {
  switch (cls) {
    case 'ready-to-file':
      return 'bg-success text-success-content border-success';
    case 'incomplete':
      return 'bg-warning text-warning-content border-warning';
    case 'not-yet-eligible':
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

/** Case-type label. */
export function caseTypeLabel(value: CaseType): string {
  switch (value) {
    case 'uncontested':
      return 'Uncontested (agreed)';
    case 'contested':
      return 'Contested';
    default:
      return '';
  }
}

/** Ground-type label. */
export function groundTypeLabel(value: GroundType): string {
  switch (value) {
    case 'no-fault':
      return 'No-fault (irretrievable breakdown, irreconcilable differences)';
    case 'fault':
      return 'Fault ground';
    default:
      return '';
  }
}

/** Fault-ground label. */
export function faultGroundLabel(value: FaultGround): string {
  switch (value) {
    case 'adultery':
      return 'Adultery';
    case 'cruelty':
      return 'Cruelty';
    case 'abandonment':
      return 'Abandonment or desertion';
    case 'felony-conviction':
      return 'Felony conviction or imprisonment';
    case 'impotence':
      return 'Impotence';
    case 'other':
      return 'Other fault ground';
    default:
      return '';
  }
}

/** Property-regime label. */
export function propertyRegimeLabel(value: PropertyRegime | ''): string {
  switch (value) {
    case 'community':
      return 'Community property';
    case 'equitable':
      return 'Equitable distribution';
    case 'unknown':
      return 'Unknown (verify state rule)';
    default:
      return '';
  }
}

/** Service-method label. */
export function serviceMethodLabel(value: ServiceMethod): string {
  switch (value) {
    case 'personal':
      return 'Personal service by a process server or sheriff';
    case 'acceptance':
      return 'Acceptance or waiver of service signed by the respondent';
    case 'mail':
      return 'Certified mail with return receipt';
    case 'publication':
      return 'Service by publication';
    case 'none':
      return 'Not yet served';
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
