import type { ClinicalPriority } from './types.js';

// Maximum permitted wait by NHS England clinical priority, expressed in weeks.
// Sourced from the NHS England Clinical Prioritisation framework (P1–P6) and
// the 18-week RTT consultant-led standard. P1a/P1b are expressed in fractional
// weeks (24h = 0.142w, 72h = 0.428w) so they can take part in the same
// arithmetic as longer priorities.
export const PRIORITY_TARGET_WEEKS: Record<Exclude<ClinicalPriority, ''>, number | null> = {
  P1a: 1 / 7, // 24 hours
  P1b: 3 / 7, // 72 hours
  P2: 4,
  P3: 12,
  P4: 18,
  P5: 26, // 6 months
  P6: null, // removed from list — no target applies
};

// 18-week NHS RTT consultant-led standard. Always enforced regardless of
// priority (except P6).
export const RTT_BREACH_WEEKS = 18;

// > 52-week long waiter — triggers harm-review processes.
export const LONG_WAIT_WEEKS = 52;

// "Approaching breach" window, in weeks, before the target or the 18-week
// RTT standard is reached.
export const APPROACHING_BREACH_WINDOW_WEEKS = 4;

export function targetWaitWeeks(priority: ClinicalPriority): number | null {
  if (priority === '' || priority === 'P6') return null;
  return PRIORITY_TARGET_WEEKS[priority];
}
