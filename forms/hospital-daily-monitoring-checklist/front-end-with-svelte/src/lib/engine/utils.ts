import type { ChecklistStatus } from './types.js';

/** Human-readable label for a checkpoint status. */
export function statusLabel(status: ChecklistStatus): string {
  switch (status) {
    case 'satisfactory':
      return 'Satisfactory';
    case 'needs-attention':
      return 'Needs attention';
    case 'not-applicable':
      return 'Not applicable';
    default:
      return 'Unanswered';
  }
}

/** Lily token colour triple for a checkpoint status, used by report and dashboard. */
export function statusColor(status: ChecklistStatus): string {
  switch (status) {
    case 'satisfactory':
      return 'bg-success text-success-content border-success';
    case 'needs-attention':
      return 'bg-error text-error-content border-error';
    case 'not-applicable':
      return 'bg-base-300 text-base-content border-base-300';
    default:
      return 'bg-base-200 text-base-content/70 border-base-300';
  }
}
