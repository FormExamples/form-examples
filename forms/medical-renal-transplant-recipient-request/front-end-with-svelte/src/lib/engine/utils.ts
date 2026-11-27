// Label and Lily-token colour helpers for the Medical Renal Transplant Recipient Request.
//
// Pretty labels are ported from the HTML front-end's `types.js`. Colour helpers
// return Lily design-token utility classes only (success / warning / error /
// info / base-300) — never hardcoded palette colours.

import type {
  AboGroup,
  AppropriatenessBand,
  DialysisMode,
  FlagPriority,
  IdentitySafetyBand,
  Organ,
  Recommendation,
  TriageTier
} from './types';

const ORGAN_LABELS: Record<string, string> = {
  kidney: 'Kidney only',
  'kidney-pancreas': 'Kidney / pancreas',
  pancreas: 'Pancreas only'
};

const DIALYSIS_MODE_LABELS: Record<string, string> = {
  'unit-haemodialysis': 'Unit haemodialysis',
  capd: 'CAPD',
  'home-peritoneal-dialysis': 'Home peritoneal dialysis',
  'pre-dialysis': 'Pre-dialysis',
  'failing-transplant': 'Failing transplant'
};

const ABO_LABELS: Record<string, string> = {
  a: 'A',
  b: 'B',
  ab: 'AB',
  o: 'O',
  unknown: 'Unknown'
};

const APPROPRIATENESS_BAND_LABELS: Record<AppropriatenessBand, string> = {
  'usually-appropriate': 'Usually appropriate',
  'may-be-appropriate': 'May be appropriate',
  'usually-not-appropriate': 'Usually not appropriate'
};

const IDENTITY_SAFETY_BAND_LABELS: Record<IdentitySafetyBand, string> = {
  ok: 'OK',
  caution: 'Caution',
  'reject-risk': 'Reject risk'
};

const TRIAGE_TIER_LABELS: Record<TriageTier, string> = {
  routine: 'Routine',
  urgent: 'Urgent',
  emergency: 'Emergency',
  stat: 'Stat'
};

const RECOMMENDATION_LABELS: Record<Recommendation, string> = {
  accept: 'Accept and process',
  'query-referrer': 'Query the referrer',
  reject: 'Reject'
};

/** Human-readable label for the organ required, falling back to the raw value. */
export function organLabel(value: Organ): string {
  return ORGAN_LABELS[value] || value || '';
}

/** Human-readable label for a mode of dialysis, falling back to the raw value. */
export function dialysisModeLabel(value: DialysisMode): string {
  return DIALYSIS_MODE_LABELS[value] || value || '';
}

/** Human-readable label for an ABO group, falling back to the raw value. */
export function aboLabel(value: AboGroup): string {
  return ABO_LABELS[value] || value || '';
}

/** Human-readable label for an appropriateness band. */
export function appropriatenessBandLabel(band: AppropriatenessBand): string {
  return APPROPRIATENESS_BAND_LABELS[band] || band;
}

/** Human-readable label for an identity / sample-safety band. */
export function identitySafetyBandLabel(band: IdentitySafetyBand): string {
  return IDENTITY_SAFETY_BAND_LABELS[band] || band;
}

/** Human-readable label for a triage tier. */
export function triageTierLabel(tier: TriageTier): string {
  return TRIAGE_TIER_LABELS[tier] || tier;
}

/** Human-readable label for an overall vetting recommendation. */
export function recommendationLabel(rec: Recommendation): string {
  return RECOMMENDATION_LABELS[rec] || rec;
}

// ──────────────────────────────────────────────
// Lily-token colour helpers (no hardcoded palette)
// ──────────────────────────────────────────────

/** Appropriateness band → Lily token utility triple. */
export function appropriatenessBandColor(band: AppropriatenessBand): string {
  switch (band) {
    case 'usually-appropriate':
      return 'bg-success text-success-content border-success';
    case 'may-be-appropriate':
      return 'bg-warning text-warning-content border-warning';
    case 'usually-not-appropriate':
      return 'bg-error text-error-content border-error';
    default:
      return 'bg-base-300 text-base-content border-base-300';
  }
}

/** Identity / sample-safety band → Lily token utility triple. */
export function identitySafetyBandColor(band: IdentitySafetyBand): string {
  switch (band) {
    case 'ok':
      return 'bg-success text-success-content border-success';
    case 'caution':
      return 'bg-warning text-warning-content border-warning';
    case 'reject-risk':
      return 'bg-error text-error-content border-error';
    default:
      return 'bg-base-300 text-base-content border-base-300';
  }
}

/** Triage tier → Lily token utility triple. */
export function triageTierColor(tier: TriageTier): string {
  switch (tier) {
    case 'routine':
      return 'bg-success text-success-content border-success';
    case 'urgent':
      return 'bg-warning text-warning-content border-warning';
    case 'emergency':
      return 'bg-error text-error-content border-error';
    case 'stat':
      return 'bg-error text-error-content border-error';
    default:
      return 'bg-base-300 text-base-content border-base-300';
  }
}

/** Overall recommendation → Lily token utility triple. */
export function recommendationColor(rec: Recommendation): string {
  switch (rec) {
    case 'accept':
      return 'bg-success text-success-content border-success';
    case 'query-referrer':
      return 'bg-warning text-warning-content border-warning';
    case 'reject':
      return 'bg-error text-error-content border-error';
    default:
      return 'bg-base-300 text-base-content border-base-300';
  }
}

/** Flag priority → Lily token utility triple. */
export function priorityColor(priority: FlagPriority): string {
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

/** Title-case a hyphen / underscore separated token (e.g. `reject-risk` → `Reject Risk`). */
export function titleCase(s: string): string {
  return String(s || '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Calculate age in whole years from a date-of-birth string. */
export function calculateAge(dob: string): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}
