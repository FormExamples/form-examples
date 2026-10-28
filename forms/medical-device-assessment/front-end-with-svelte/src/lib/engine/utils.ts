import type { ConformityRoute, DeviceClass, FlagPriority, Readiness } from './types';

export const ROUTE_LABELS: Record<string, string> = {
  'self-declaration': 'Self-declaration (Class I)',
  'notified-body-partial': 'Notified body, partial involvement (Is / Im / Ir)',
  'notified-body-full': 'Notified body, full conformity assessment',
  '': 'Not determined'
};

export const READINESS_LABELS: Record<string, string> = {
  ready: 'Ready',
  gaps: 'Gaps to close',
  blocked: 'Blocked',
  '': 'Not determined'
};

/** Format a class with its Class I suffix, e.g. "Class Is". */
export function classLabel(deviceClass: DeviceClass, suffix = ''): string {
  return deviceClass ? `Class ${deviceClass}${suffix}` : 'Not determined';
}

/** Short class text for a table cell, e.g. "Is" or an em dash. */
export function shortClass(deviceClass: DeviceClass, suffix = ''): string {
  return deviceClass ? `${deviceClass}${suffix}` : '—';
}

export function routeLabel(route: ConformityRoute): string {
  return ROUTE_LABELS[route] ?? route;
}

export function readinessLabel(readiness: Readiness | ''): string {
  return READINESS_LABELS[readiness] ?? readiness;
}

/** Lily-token colour utility classes for a device class. */
export function classColor(deviceClass: DeviceClass): string {
  switch (deviceClass) {
    case 'I':
      return 'bg-success text-success-content border-success';
    case 'IIa':
    case 'IIb':
      return 'bg-warning text-warning-content border-warning';
    case 'III':
      return 'bg-error text-error-content border-error';
    default:
      return 'bg-base-300 text-base-content border-base-300';
  }
}

/** Lily-token colour utility classes for regulatory readiness. */
export function readinessColor(readiness: Readiness): string {
  switch (readiness) {
    case 'ready':
      return 'bg-success text-success-content border-success';
    case 'gaps':
      return 'bg-warning text-warning-content border-warning';
    case 'blocked':
      return 'bg-error text-error-content border-error';
    default:
      return 'bg-base-300 text-base-content border-base-300';
  }
}

/** Lily-token colour utility classes for a flag priority. */
export function priorityColor(priority: FlagPriority): string {
  switch (priority) {
    case 'high':
      return 'bg-error text-error-content border-error';
    case 'medium':
      return 'bg-warning text-warning-content border-warning';
    default:
      return 'bg-base-300 text-base-content border-base-300';
  }
}
