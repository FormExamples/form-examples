import type {
  AgentRelationship,
  EffectiveWhen,
  ExecutionMethod,
  LifeSustainingTreatment,
  OrganDonation,
  PolstStatus,
  Priority,
  ReadinessClass,
  TreatmentChoice,
  YesNo
} from './types';

/** Readiness-class label for display. */
export function readinessClassLabel(cls: ReadinessClass): string {
  switch (cls) {
    case 'ready-to-execute':
      return 'Ready to execute';
    case 'incomplete':
      return 'Incomplete';
    case 'execution-risk':
      return 'Execution risk';
    default:
      return '';
  }
}

/** Short readiness-class label for the dashboard. */
export function readinessClassShort(cls: ReadinessClass): string {
  switch (cls) {
    case 'ready-to-execute':
      return 'Ready';
    case 'incomplete':
      return 'Incomplete';
    case 'execution-risk':
      return 'At risk';
    default:
      return 'N/A';
  }
}

/** Lily-token colour utility classes for the readiness badge / banner. */
export function readinessClassColor(cls: ReadinessClass): string {
  switch (cls) {
    case 'ready-to-execute':
      return 'bg-success text-success-content border-success';
    case 'incomplete':
      return 'bg-warning text-warning-content border-warning';
    case 'execution-risk':
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
      return 'bg-info text-info-content border-info';
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

export function agentRelationshipLabel(value: AgentRelationship): string {
  switch (value) {
    case 'spouse':
      return 'Spouse or partner';
    case 'adult-child':
      return 'Adult child';
    case 'parent':
      return 'Parent';
    case 'sibling':
      return 'Sibling';
    case 'other-relative':
      return 'Other relative';
    case 'friend':
      return 'Friend';
    case 'other':
      return 'Other';
    default:
      return '';
  }
}

export function effectiveWhenLabel(value: EffectiveWhen): string {
  switch (value) {
    case 'immediately':
      return 'Immediately on signing';
    case 'upon-incapacity':
      return 'Only when the principal cannot decide';
    default:
      return '';
  }
}

export function organDonationLabel(value: OrganDonation): string {
  switch (value) {
    case 'any-needs':
      return 'Any needed organs and tissues';
    case 'transplant-only':
      return 'Transplant or therapy only';
    case 'research-only':
      return 'Research only';
    case 'none':
      return 'No donation';
    case 'not-addressed':
      return 'Not addressed';
    default:
      return '';
  }
}

export function lifeSustainingTreatmentLabel(value: LifeSustainingTreatment): string {
  switch (value) {
    case 'refuse':
      return 'Refuse life-sustaining treatment when terminal or permanently unconscious';
    case 'time-limited-trial':
      return 'Accept a time-limited trial';
    case 'want-all':
      return 'Want all available treatment';
    case 'agent-decides':
      return 'Leave to the agent';
    default:
      return '';
  }
}

export function treatmentChoiceLabel(value: TreatmentChoice): string {
  switch (value) {
    case 'accept':
      return 'Accept';
    case 'refuse':
      return 'Refuse';
    case 'agent-decides':
      return 'Agent decides';
    default:
      return '';
  }
}

export function polstStatusLabel(value: PolstStatus): string {
  switch (value) {
    case 'none':
      return 'No POLST';
    case 'in-place':
      return 'POLST in place';
    case 'discussing':
      return 'Discussing a POLST with a clinician';
    default:
      return '';
  }
}

export function executionMethodLabel(value: ExecutionMethod): string {
  switch (value) {
    case 'two-witnesses':
      return 'Two witnesses';
    case 'one-witness':
      return 'One witness';
    case 'notary':
      return 'Notary acknowledgment';
    case 'witnesses-and-notary':
      return 'Witnesses and notary';
    default:
      return '';
  }
}

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
