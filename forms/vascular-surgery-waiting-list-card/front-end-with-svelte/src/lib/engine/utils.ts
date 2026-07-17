const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function parseIsoDate(iso: string | null): Date | null {
  if (!iso) return null;
  const d = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function daysBetween(fromIso: string | null, toIso: string | null): number | null {
  const from = parseIsoDate(fromIso);
  const to = parseIsoDate(toIso);
  if (!from || !to) return null;
  return Math.round((to.getTime() - from.getTime()) / MS_PER_DAY);
}

export function weeksBetween(fromIso: string | null, toIso: string | null): number | null {
  const d = daysBetween(fromIso, toIso);
  return d === null ? null : Math.round((d / 7) * 10) / 10;
}

export function todayIso(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

// ---------------------------------------------------------------------------
// Presentation helpers — labels and Lily-token colour classes for the grading
// result. Shared by the wizard, the dashboard, and the report so the rendered
// status stays consistent everywhere.
// ---------------------------------------------------------------------------

import type {
  ClinicalPriority,
  FlagPriority,
  WaitingTimeStatus
} from './types.js';

/** Human-readable label for a Waiting Time Status band. */
export function waitingTimeStatusLabel(status: WaitingTimeStatus): string {
  switch (status) {
    case 'within-target':
      return 'Within target';
    case 'approaching-breach':
      return 'Approaching breach';
    case 'breached':
      return 'Breached';
    case 'long-wait':
      return 'Long wait (> 52 wk)';
    default:
      return 'Not yet computed';
  }
}

/** Lily-token colour triple for a Waiting Time Status band. */
export function waitingTimeStatusColor(status: WaitingTimeStatus): string {
  switch (status) {
    case 'within-target':
      return 'bg-success text-success-content border-success';
    case 'approaching-breach':
      return 'bg-warning text-warning-content border-warning';
    case 'breached':
      return 'bg-error text-error-content border-error';
    case 'long-wait':
      return 'bg-error text-error-content border-error';
    default:
      return 'bg-base-300 text-base-content border-base-300';
  }
}

/** Human-readable label for an NHS England clinical priority. */
export function clinicalPriorityLabel(priority: ClinicalPriority): string {
  switch (priority) {
    case 'P1a':
      return 'P1a — Emergency (24 h)';
    case 'P1b':
      return 'P1b — Urgent (72 h)';
    case 'P2':
      return 'P2 — Cancer / time-critical (4 wk)';
    case 'P3':
      return 'P3 — Substantial harm if delayed (12 wk)';
    case 'P4':
      return 'P4 — Routine (18-wk RTT)';
    case 'P5':
      return 'P5 — Deferred (6 mo)';
    case 'P6':
      return 'P6 — Removed from list';
    default:
      return 'Not set';
  }
}

/** Lily-token colour triple for a flag priority. */
export function flagPriorityColor(priority: FlagPriority): string {
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
