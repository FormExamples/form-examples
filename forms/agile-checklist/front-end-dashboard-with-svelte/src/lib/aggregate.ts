import type { ChecklistRow, Maturity } from './data/sample.js';

export interface TrendPoint {
  date: string;
  overallPercent: number;
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

export function deriveMaturity(overallPercent: number | null): Maturity {
  if (overallPercent === null) return 'insufficient-data';
  if (overallPercent >= 90) return 'optimising';
  if (overallPercent >= 75) return 'mature';
  if (overallPercent >= 50) return 'developing';
  if (overallPercent >= 25) return 'initial';
  return 'ad-hoc';
}

export function aggregateByTeam(rows: ChecklistRow[]): TeamAggregate[] {
  const groups = new Map<string, ChecklistRow[]>();
  for (const r of rows) {
    const key = r.team + '\x00' + r.organisation;
    const list = groups.get(key);
    if (list) list.push(r);
    else groups.set(key, [r]);
  }

  const out: TeamAggregate[] = [];
  for (const [, list] of groups) {
    const scored = list.filter((r) => r.overallPercent !== null);
    const meanOfMeans = scored.length
      ? Math.round(
          (scored.reduce((s, r) => s + (r.overallPercent as number), 0) / scored.length) * 100,
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
      .map((r) => ({ date: r.date, overallPercent: r.overallPercent as number }));

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

const MATURITY_COLOR: Record<Maturity, string> = {
  optimising: '#15803d',
  mature: '#16a34a',
  developing: '#ca8a04',
  initial: '#ea580c',
  'ad-hoc': '#dc2626',
  'insufficient-data': '#94a3b8',
};

export interface MultiTeamSeries {
  team: string;
  organisation: string;
  maturity: Maturity;
  color: string;
  points: { x: number; y: number; date: string; overallPercent: number }[];
  pathD: string;
  endLabelX: number;
  endLabelY: number;
}

export interface MultiTeamChart {
  width: number;
  height: number;
  innerLeft: number;
  innerRight: number;
  innerTop: number;
  innerBottom: number;
  yTicks: { y: number; label: string }[];
  xTicks: { x: number; label: string }[];
  series: MultiTeamSeries[];
}

export function multiTeamChart(
  rows: ChecklistRow[],
  options?: { width?: number; height?: number },
): MultiTeamChart | null {
  const teams = aggregateByTeam(rows);
  const seriesInput = teams.filter((t) => t.trend.length > 0);
  if (seriesInput.length === 0) return null;

  const width = options?.width ?? 720;
  const height = options?.height ?? 240;
  const innerLeft = 36;
  const innerRight = width - 88; // room for end-of-line labels
  const innerTop = 12;
  const innerBottom = height - 28;

  const allDates = new Set<string>();
  for (const t of seriesInput) for (const p of t.trend) allDates.add(p.date);
  const sortedDates = [...allDates].sort();
  if (sortedDates.length === 0) return null;

  const minTs = Date.parse(sortedDates[0]);
  const maxTs = Date.parse(sortedDates[sortedDates.length - 1]);
  const spanTs = Math.max(1, maxTs - minTs);

  function xFor(date: string): number {
    if (sortedDates.length === 1) return (innerLeft + innerRight) / 2;
    const ts = Date.parse(date);
    return innerLeft + ((ts - minTs) / spanTs) * (innerRight - innerLeft);
  }
  function yFor(percent: number): number {
    return innerBottom - (percent / 100) * (innerBottom - innerTop);
  }

  const series: MultiTeamSeries[] = seriesInput.map((t) => {
    const points = t.trend.map((p) => ({
      x: xFor(p.date),
      y: yFor(p.overallPercent),
      date: p.date,
      overallPercent: p.overallPercent,
    }));
    const pathD = points
      .map((p, i) => (i === 0 ? `M${p.x.toFixed(1)},${p.y.toFixed(1)}` : `L${p.x.toFixed(1)},${p.y.toFixed(1)}`))
      .join(' ');
    const end = points[points.length - 1];
    return {
      team: t.team,
      organisation: t.organisation,
      maturity: t.maturity,
      color: MATURITY_COLOR[t.maturity] ?? MATURITY_COLOR['insufficient-data'],
      points,
      pathD,
      endLabelX: end.x + 4,
      endLabelY: end.y,
    };
  });

  const yTicks = [0, 25, 50, 75, 100].map((v) => ({ y: yFor(v), label: `${v}%` }));

  // Pick up to ~5 evenly-spaced date ticks from the sorted set.
  const tickCount = Math.min(5, sortedDates.length);
  const xTicks =
    tickCount === 1
      ? [{ x: xFor(sortedDates[0]), label: sortedDates[0] }]
      : Array.from({ length: tickCount }, (_, i) => {
          const idx = Math.round((i / (tickCount - 1)) * (sortedDates.length - 1));
          const d = sortedDates[idx];
          return { x: xFor(d), label: d };
        });

  return {
    width,
    height,
    innerLeft,
    innerRight,
    innerTop,
    innerBottom,
    yTicks,
    xTicks,
    series,
  };
}

export function sparklineGeometry(
  trend: TrendPoint[],
  width = 100,
  height = 28,
  padding = 2,
): SparklineGeometry | null {
  if (trend.length === 0) return null;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;
  const min = 0;
  const max = 100;
  const xStep = trend.length === 1 ? 0 : innerW / (trend.length - 1);
  const points = trend.map((p, i) => {
    const x = padding + (trend.length === 1 ? innerW / 2 : i * xStep);
    const y = padding + innerH - ((p.overallPercent - min) / (max - min)) * innerH;
    return { x, y };
  });
  const pathD = points.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(' ');
  const last = points[points.length - 1];
  return { pathD, width, height, lastX: last.x, lastY: last.y };
}

export function rowsToCsv(rows: ChecklistRow[]): string {
  const headers = [
    'id',
    'date',
    'respondent',
    'role',
    'team',
    'organisation',
    'answered',
    'teamsPercent',
    'stakeholdersPercent',
    'practicesPercent',
    'overallPercent',
    'maturity',
    'weakSections',
    'flags',
  ];
  const escape = (v: string): string =>
    /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
  const fmt = (n: number | null): string => (n === null ? '' : n.toFixed(0));
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
        fmt(r.teamsPercent),
        fmt(r.stakeholdersPercent),
        fmt(r.practicesPercent),
        fmt(r.overallPercent),
        r.maturity,
        r.weakSections.join('; '),
        r.flags.join('; '),
      ]
        .map(escape)
        .join(','),
    );
  }
  return lines.join('\n') + '\n';
}

export function parseCsv(text: string): string[][] {
  const out: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n') {
      row.push(field);
      out.push(row);
      row = [];
      field = '';
    } else if (c === '\r') {
      // ignore
    } else {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    out.push(row);
  }
  return out.filter((r) => r.length > 1 || (r.length === 1 && r[0] !== ''));
}

export function rowsFromCsv(text: string): ChecklistRow[] {
  const rows = parseCsv(text);
  if (rows.length === 0) throw new Error('empty CSV');
  const headers = rows[0].map((h) => h.trim());
  const idx: Record<string, number> = {};
  headers.forEach((h, i) => {
    idx[h] = i;
  });
  for (const required of ['id', 'date', 'team', 'organisation', 'maturity']) {
    if (!(required in idx)) throw new Error(`missing required column: ${required}`);
  }
  const pickPct = (row: string[], key: string): number | null => {
    if (!(key in idx)) return null;
    const v = row[idx[key]];
    if (v === undefined || v === '') return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };
  const pickStr = (row: string[], key: string): string =>
    key in idx ? (row[idx[key]] ?? '').trim() : '';
  const splitList = (s: string): string[] =>
    s ? s.split(/;\s*/).filter(Boolean) : [];

  const validMaturities = new Set<Maturity>([
    'optimising',
    'mature',
    'developing',
    'initial',
    'ad-hoc',
    'insufficient-data',
  ]);

  return rows.slice(1).map<ChecklistRow>((row) => {
    const respondent = pickStr(row, 'respondent');
    const m = pickStr(row, 'maturity');
    const maturity = (validMaturities.has(m as Maturity) ? m : 'insufficient-data') as Maturity;
    return {
      id: pickStr(row, 'id'),
      date: pickStr(row, 'date'),
      respondent,
      role: pickStr(row, 'role'),
      team: pickStr(row, 'team'),
      organisation: pickStr(row, 'organisation'),
      answered: Number(pickStr(row, 'answered')) || 0,
      teamsPercent: pickPct(row, 'teamsPercent'),
      stakeholdersPercent: pickPct(row, 'stakeholdersPercent'),
      practicesPercent: pickPct(row, 'practicesPercent'),
      overallPercent: pickPct(row, 'overallPercent'),
      maturity,
      weakSections: splitList(pickStr(row, 'weakSections')),
      flags: splitList(pickStr(row, 'flags')),
      isAnonymous: respondent === 'Anonymous',
    };
  });
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
