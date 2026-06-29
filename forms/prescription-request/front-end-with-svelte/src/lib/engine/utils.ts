import type { PriorityLevel } from './types';

/** Priority level label. */
export function priorityLevelLabel(level: PriorityLevel): string {
  switch (level) {
    case 'routine':
      return 'Routine - Standard processing';
    case 'urgent':
      return 'Urgent - Requires prompt attention';
    case 'emergency':
      return 'Emergency - Immediate action required';
    default:
      return `Priority: ${level}`;
  }
}

/** Short priority level label (single word, capitalised). */
export function priorityLevelShortLabel(level: PriorityLevel): string {
  switch (level) {
    case 'routine':
      return 'Routine';
    case 'urgent':
      return 'Urgent';
    case 'emergency':
      return 'Emergency';
    default:
      return '—';
  }
}

/** Priority level colour class (Lily design tokens). */
export function priorityLevelColor(level: PriorityLevel): string {
  switch (level) {
    case 'routine':
      return 'bg-success text-success-content border-success';
    case 'urgent':
      return 'bg-warning text-warning-content border-warning';
    case 'emergency':
      return 'bg-error text-error-content border-error';
    default:
      return 'bg-base-300 text-base-content border-base-300';
  }
}
