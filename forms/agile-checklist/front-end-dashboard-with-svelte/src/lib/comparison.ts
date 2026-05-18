import { parseCsv } from './aggregate.js';

export type SisterMaturity =
  | 'optimising'
  | 'mature'
  | 'developing'
  | 'initial'
  | 'ad-hoc'
  | 'insufficient-data';

export interface SisterRow {
  team: string;
  organisation: string;
  date: string;
  maturity: SisterMaturity;
  score: number | null; // principles meanScore (1-5) or checklist overallPercent (0-100)
  scoreDisplay: string;
}

export type Quadrant =
  | 'healthy-adoption'
  | 'aspirational-gap'
  | 'cargo-cult'
  | 'pre-agile'
  | 'insufficient-data';

const HIGH_SET: ReadonlySet<SisterMaturity> = new Set([
  'optimising',
  'mature',
] as SisterMaturity[]);

export function isHighMaturity(m: SisterMaturity): boolean {
  return HIGH_SET.has(m);
}

export function quadrantFor(
  principles: SisterMaturity,
  behaviour: SisterMaturity,
): Quadrant {
  if (principles === 'insufficient-data' || behaviour === 'insufficient-data') {
    return 'insufficient-data';
  }
  const pHigh = isHighMaturity(principles);
  const bHigh = isHighMaturity(behaviour);
  if (pHigh && bHigh) return 'healthy-adoption';
  if (pHigh && !bHigh) return 'aspirational-gap';
  if (!pHigh && bHigh) return 'cargo-cult';
  return 'pre-agile';
}

export function quadrantLabel(q: Quadrant): string {
  switch (q) {
    case 'healthy-adoption':
      return 'Healthy adoption';
    case 'aspirational-gap':
      return 'Aspirational gap';
    case 'cargo-cult':
      return 'Cargo-cult agile';
    case 'pre-agile':
      return 'Pre-agile / waterfall';
    case 'insufficient-data':
      return 'Insufficient data';
  }
}

export function quadrantDescription(q: Quadrant): string {
  switch (q) {
    case 'healthy-adoption':
      return 'Believes in agile and acts on it. Coaching focuses on the few weak spots.';
    case 'aspirational-gap':
      return 'Says it values agility but the day-to-day reality is different. Most common failure mode.';
    case 'cargo-cult':
      return 'Does the rituals but doesn\u2019t believe the principles. Address the why before adding more what.';
    case 'pre-agile':
      return 'Honest about being non-agile. Decide whether agility is the right fit before investing.';
    case 'insufficient-data':
      return 'At least one form has too few answers to classify the team.';
  }
}

const VALID_MATURITIES = new Set<SisterMaturity>([
  'optimising',
  'mature',
  'developing',
  'initial',
  'ad-hoc',
  'insufficient-data',
]);

function coerceMaturity(s: string): SisterMaturity {
  return (VALID_MATURITIES.has(s as SisterMaturity)
    ? (s as SisterMaturity)
    : 'insufficient-data') as SisterMaturity;
}

/**
 * Read either a principles-assessment CSV (mean-score scale 1-5) or a
 * checklist CSV (overall-percent scale 0-100). Picks up the numeric
 * column under whichever name is present.
 */
export function readSisterCsv(text: string): SisterRow[] {
  const rows = parseCsv(text);
  if (rows.length === 0) throw new Error('empty CSV');
  const headers = rows[0].map((h) => h.trim());
  const idx: Record<string, number> = {};
  headers.forEach((h, i) => {
    idx[h] = i;
  });
  for (const required of ['team', 'organisation', 'maturity']) {
    if (!(required in idx)) throw new Error(`missing required column: ${required}`);
  }
  const dateIdx = idx['date'];
  const meanIdx = idx['meanScore'];
  const overallIdx = idx['overallPercent'];

  return rows.slice(1).map<SisterRow>((row) => {
    const team = (row[idx['team']] ?? '').trim();
    const organisation = (row[idx['organisation']] ?? '').trim();
    const date = dateIdx !== undefined ? (row[dateIdx] ?? '').trim() : '';
    const maturity = coerceMaturity((row[idx['maturity']] ?? '').trim());
    let score: number | null = null;
    let scoreDisplay = '\u2014';
    if (meanIdx !== undefined && row[meanIdx] !== undefined && row[meanIdx] !== '') {
      const n = Number(row[meanIdx]);
      if (Number.isFinite(n)) {
        score = n;
        scoreDisplay = n.toFixed(2);
      }
    } else if (overallIdx !== undefined && row[overallIdx] !== undefined && row[overallIdx] !== '') {
      const n = Number(row[overallIdx]);
      if (Number.isFinite(n)) {
        score = n;
        scoreDisplay = `${n.toFixed(0)}%`;
      }
    }
    return { team, organisation, date, maturity, score, scoreDisplay };
  });
}

export interface ComparisonPair {
  team: string;
  organisation: string;
  principles: SisterRow | null;
  behaviour: SisterRow | null;
  quadrant: Quadrant;
}

/**
 * Pair rows by (team, organisation). Each team appears once. For teams
 * that have multiple submissions in a single CSV, the latest by `date`
 * is used.
 */
export function pairSubmissions(
  principlesRows: SisterRow[],
  behaviourRows: SisterRow[],
): ComparisonPair[] {
  const principles = latestByTeam(principlesRows);
  const behaviour = latestByTeam(behaviourRows);
  const keys = new Set<string>([...principles.keys(), ...behaviour.keys()]);
  const out: ComparisonPair[] = [];
  for (const key of keys) {
    const p = principles.get(key) ?? null;
    const b = behaviour.get(key) ?? null;
    const sample = p ?? b!;
    out.push({
      team: sample.team,
      organisation: sample.organisation,
      principles: p,
      behaviour: b,
      quadrant:
        p && b
          ? quadrantFor(p.maturity, b.maturity)
          : 'insufficient-data',
    });
  }
  return out.sort(
    (a, b) =>
      a.team.localeCompare(b.team) || a.organisation.localeCompare(b.organisation),
  );
}

function latestByTeam(rows: SisterRow[]): Map<string, SisterRow> {
  const map = new Map<string, SisterRow>();
  for (const r of rows) {
    const key = `${r.team}\x00${r.organisation}`;
    const prior = map.get(key);
    if (!prior || prior.date.localeCompare(r.date) < 0) {
      map.set(key, r);
    }
  }
  return map;
}
