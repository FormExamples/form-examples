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
