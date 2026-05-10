import type { AssessmentRow, Maturity } from './data/sample.js';

export interface TrendPoint {
  date: string;
  meanScore: number;
}

export interface TeamAggregate {
  team: string;
  organisation: string;
  count: number;
  meanOfMeans: number | null;
  maturity: Maturity;
  topFlags: string[];
  trend: TrendPoint[];
}

export interface SparklineGeometry {
  pathD: string;
  width: number;
  height: number;
  lastX: number;
  lastY: number;
}

export function deriveMaturity(meanScore: number | null): Maturity {
  if (meanScore === null) return 'insufficient-data';
  if (meanScore >= 4.5) return 'optimising';
  if (meanScore >= 3.75) return 'mature';
  if (meanScore >= 3.0) return 'developing';
  if (meanScore >= 2.0) return 'initial';
  return 'ad-hoc';
}

export function aggregateByTeam(rows: AssessmentRow[]): TeamAggregate[] {
  const groups = new Map<string, AssessmentRow[]>();
  for (const r of rows) {
    const key = r.team + '\x00' + r.organisation;
    const list = groups.get(key);
    if (list) list.push(r);
    else groups.set(key, [r]);
  }

  const out: TeamAggregate[] = [];
  for (const [, list] of groups) {
    const scored = list.filter((r) => r.meanScore !== null);
    const meanOfMeans = scored.length
      ? Math.round(
          (scored.reduce((s, r) => s + (r.meanScore as number), 0) / scored.length) * 100,
        ) / 100
      : null;

    const flagCounts = new Map<string, number>();
    for (const r of list) for (const f of r.flags) flagCounts.set(f, (flagCounts.get(f) ?? 0) + 1);
    const topFlags = [...flagCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([f]) => f);

    const trend: TrendPoint[] = scored
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((r) => ({ date: r.date, meanScore: r.meanScore as number }));

    out.push({
      team: list[0].team,
      organisation: list[0].organisation,
      count: list.length,
      meanOfMeans,
      maturity: deriveMaturity(meanOfMeans),
      topFlags,
      trend,
    });
  }
  return out.sort((a, b) => a.team.localeCompare(b.team));
}

export function sparklineGeometry(
  trend: TrendPoint[],
  width = 80,
  height = 24,
  padding = 2,
): SparklineGeometry | null {
  if (trend.length === 0) return null;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;
  const min = 1;
  const max = 5;
  const xStep = trend.length === 1 ? 0 : innerW / (trend.length - 1);
  const points = trend.map((p, i) => {
    const x = padding + (trend.length === 1 ? innerW / 2 : i * xStep);
    const y = padding + innerH - ((p.meanScore - min) / (max - min)) * innerH;
    return { x, y };
  });
  const pathD = points.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(' ');
  const last = points[points.length - 1];
  return { pathD, width, height, lastX: last.x, lastY: last.y };
}

export function rowsToCsv(rows: AssessmentRow[]): string {
  const headers = [
    'id',
    'date',
    'respondent',
    'role',
    'team',
    'organisation',
    'answered',
    'meanScore',
    'maturity',
    'weakPrinciples',
    'flags',
  ];
  const escape = (v: string): string =>
    /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
  const lines: string[] = [headers.join(',')];
  for (const r of rows) {
    lines.push(
      [
        r.id,
        r.date,
        r.isAnonymous ? 'Anonymous' : r.respondent,
        r.isAnonymous ? '' : r.role,
        r.team,
        r.organisation,
        String(r.answered),
        r.meanScore !== null ? r.meanScore.toFixed(2) : '',
        r.maturity,
        r.weakPrinciples.join('; '),
        r.flags.join('; '),
      ]
        .map(escape)
        .join(','),
    );
  }
  return lines.join('\n') + '\n';
}

export function downloadCsv(filename: string, csv: string): void {
  if (typeof window === 'undefined') return;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
