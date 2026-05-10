import { describe, it, expect } from 'vitest';
import type { AssessmentRow } from './data/sample.js';
import {
  aggregateByTeam,
  deriveMaturity,
  rowsToCsv,
  sparklineGeometry,
} from './aggregate.js';

const baseRow: AssessmentRow = {
  id: '',
  date: '2026-04-01',
  respondent: '',
  role: 'individual-contributor',
  team: '',
  organisation: 'Acme',
  answered: 12,
  meanScore: 4,
  maturity: 'mature',
  weakPrinciples: [],
  flags: [],
};

function row(over: Partial<AssessmentRow>): AssessmentRow {
  return { ...baseRow, ...over };
}

describe('deriveMaturity (dashboard copy)', () => {
  it('matches engine thresholds', () => {
    expect(deriveMaturity(null)).toBe('insufficient-data');
    expect(deriveMaturity(4.5)).toBe('optimising');
    expect(deriveMaturity(3.75)).toBe('mature');
    expect(deriveMaturity(3.0)).toBe('developing');
    expect(deriveMaturity(2.0)).toBe('initial');
    expect(deriveMaturity(1.5)).toBe('ad-hoc');
  });
});

describe('aggregateByTeam', () => {
  it('groups by team + organisation', () => {
    const rows: AssessmentRow[] = [
      row({ id: 'a', team: 'Aurora', meanScore: 4.5 }),
      row({ id: 'b', team: 'Aurora', meanScore: 4.0 }),
      row({ id: 'c', team: 'Borealis', meanScore: 3.0 }),
    ];
    const teams = aggregateByTeam(rows);
    expect(teams).toHaveLength(2);
    const aurora = teams.find((t) => t.team === 'Aurora');
    expect(aurora?.count).toBe(2);
    expect(aurora?.meanOfMeans).toBe(4.25);
    expect(aurora?.maturity).toBe('mature');
    expect(aurora?.trend).toHaveLength(2);
  });

  it('treats same team in different organisations as separate groups', () => {
    const rows: AssessmentRow[] = [
      row({ id: 'a', team: 'Aurora', organisation: 'Acme', meanScore: 4.5 }),
      row({ id: 'b', team: 'Aurora', organisation: 'Globex', meanScore: 2.0 }),
    ];
    expect(aggregateByTeam(rows)).toHaveLength(2);
  });

  it('insufficient-data when no rows have a mean score', () => {
    const rows: AssessmentRow[] = [
      row({ id: 'a', team: 'Empty', meanScore: null, maturity: 'insufficient-data' }),
    ];
    const [t] = aggregateByTeam(rows);
    expect(t.meanOfMeans).toBeNull();
    expect(t.maturity).toBe('insufficient-data');
  });

  it('returns the three most-frequent flags', () => {
    const rows: AssessmentRow[] = [
      row({ id: 'a', team: 'X', flags: ['burnout-risk', 'technical-debt'] }),
      row({ id: 'b', team: 'X', flags: ['burnout-risk', 'slow-delivery', 'technical-debt'] }),
      row({ id: 'c', team: 'X', flags: ['burnout-risk', 'no-retrospective'] }),
    ];
    const [t] = aggregateByTeam(rows);
    expect(t.topFlags.slice(0, 1)).toEqual(['burnout-risk']);
    expect(t.topFlags).toHaveLength(3);
  });
});

describe('rowsToCsv', () => {
  it('emits a header row and one line per row', () => {
    const csv = rowsToCsv([
      row({ id: 'a', respondent: 'Alice', team: 'Aurora', flags: ['burnout-risk'] }),
    ]);
    const lines = csv.trim().split('\n');
    expect(lines).toHaveLength(2);
    expect(lines[0]).toContain('id,date,respondent');
    expect(lines[1]).toContain('Alice');
    expect(lines[1]).toContain('Aurora');
  });

  it('quotes fields that contain commas', () => {
    const csv = rowsToCsv([
      row({ id: 'a', respondent: 'Doe, Jane', team: 'Aurora' }),
    ]);
    expect(csv).toContain('"Doe, Jane"');
  });

  it('escapes embedded quotes', () => {
    const csv = rowsToCsv([
      row({ id: 'a', respondent: 'Mc"K', team: 'Aurora' }),
    ]);
    expect(csv).toContain('"Mc""K"');
  });
});

describe('aggregateByTeam — trend ordering', () => {
  it('returns trend points in date-ascending order', () => {
    const rows: AssessmentRow[] = [
      row({ id: 'a', team: 'Aurora', date: '2026-04-01', meanScore: 4.5 }),
      row({ id: 'b', team: 'Aurora', date: '2025-10-01', meanScore: 3.0 }),
      row({ id: 'c', team: 'Aurora', date: '2026-01-01', meanScore: 4.0 }),
    ];
    const [t] = aggregateByTeam(rows);
    expect(t.trend.map((p) => p.date)).toEqual(['2025-10-01', '2026-01-01', '2026-04-01']);
    expect(t.trend.map((p) => p.meanScore)).toEqual([3.0, 4.0, 4.5]);
  });

  it('omits rows with null meanScore from the trend', () => {
    const rows: AssessmentRow[] = [
      row({ id: 'a', team: 'X', date: '2026-04-01', meanScore: 4.0 }),
      row({ id: 'b', team: 'X', date: '2026-04-15', meanScore: null, maturity: 'insufficient-data' }),
    ];
    const [t] = aggregateByTeam(rows);
    expect(t.trend).toHaveLength(1);
    expect(t.trend[0].date).toBe('2026-04-01');
  });
});

describe('rowsToCsv with anonymous rows', () => {
  it('replaces respondent with "Anonymous" and blanks role for anonymous rows', () => {
    const csv = rowsToCsv([
      row({ id: 'a', respondent: 'Should not appear', role: 'agile-coach', isAnonymous: true }),
    ]);
    expect(csv).toContain('Anonymous');
    expect(csv).not.toContain('Should not appear');
    expect(csv).not.toContain('agile-coach');
  });

  it('leaves non-anonymous rows untouched', () => {
    const csv = rowsToCsv([row({ id: 'a', respondent: 'Alice', role: 'scrum-master' })]);
    expect(csv).toContain('Alice');
    expect(csv).toContain('scrum-master');
  });
});

describe('sparklineGeometry', () => {
  it('returns null for an empty series', () => {
    expect(sparklineGeometry([])).toBeNull();
  });

  it('places a single point at the horizontal centre', () => {
    const geom = sparklineGeometry([{ date: '2026-04-01', meanScore: 3 }], 80, 24);
    expect(geom).not.toBeNull();
    expect(geom!.lastX).toBeCloseTo(40);
    // mean 3 maps to vertical midpoint within inner box
    expect(geom!.lastY).toBeCloseTo(12);
  });

  it('maps min and max scores to opposite vertical edges', () => {
    const geom = sparklineGeometry(
      [
        { date: '2026-01-01', meanScore: 1 },
        { date: '2026-02-01', meanScore: 5 },
      ],
      80,
      24,
      2,
    );
    expect(geom).not.toBeNull();
    // first point: score 1 → bottom of inner box (y = padding + innerH = 22)
    expect(geom!.pathD.startsWith('M')).toBe(true);
    expect(geom!.pathD).toContain(',22');
    // last point: score 5 → top of inner box (y = padding = 2)
    expect(geom!.lastY).toBeCloseTo(2);
  });
});
