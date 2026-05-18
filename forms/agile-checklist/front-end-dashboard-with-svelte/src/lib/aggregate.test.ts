import { describe, it, expect } from 'vitest';
import type { ChecklistRow } from './data/sample.js';
import {
  aggregateByTeam,
  deriveMaturity,
  multiTeamChart,
  parseCsv,
  rowsFromCsv,
  rowsToCsv,
  sparklineGeometry,
} from './aggregate.js';

const baseRow: ChecklistRow = {
  id: '',
  date: '2026-04-01',
  respondent: '',
  role: 'team-member',
  team: '',
  organisation: 'Acme',
  answered: 57,
  teamsPercent: 80,
  stakeholdersPercent: 80,
  practicesPercent: 80,
  overallPercent: 80,
  maturity: 'mature',
  weakSections: [],
  flags: [],
};

function row(over: Partial<ChecklistRow>): ChecklistRow {
  return { ...baseRow, ...over };
}

describe('deriveMaturity', () => {
  it('matches engine thresholds (percent-based)', () => {
    expect(deriveMaturity(null)).toBe('insufficient-data');
    expect(deriveMaturity(90)).toBe('optimising');
    expect(deriveMaturity(89)).toBe('mature');
    expect(deriveMaturity(75)).toBe('mature');
    expect(deriveMaturity(74)).toBe('developing');
    expect(deriveMaturity(50)).toBe('developing');
    expect(deriveMaturity(49)).toBe('initial');
    expect(deriveMaturity(25)).toBe('initial');
    expect(deriveMaturity(24)).toBe('ad-hoc');
    expect(deriveMaturity(0)).toBe('ad-hoc');
  });
});

describe('aggregateByTeam', () => {
  it('groups by team + organisation', () => {
    const rows: ChecklistRow[] = [
      row({ id: 'a', team: 'Aurora', overallPercent: 90 }),
      row({ id: 'b', team: 'Aurora', overallPercent: 80 }),
      row({ id: 'c', team: 'Borealis', overallPercent: 60 }),
    ];
    const teams = aggregateByTeam(rows);
    expect(teams).toHaveLength(2);
    const aurora = teams.find((t) => t.team === 'Aurora');
    expect(aurora?.count).toBe(2);
    expect(aurora?.meanOfMeans).toBe(85);
    expect(aurora?.maturity).toBe('mature');
    expect(aurora?.trend).toHaveLength(2);
  });

  it('treats same team in different organisations as separate groups', () => {
    const rows: ChecklistRow[] = [
      row({ id: 'a', team: 'Aurora', organisation: 'Acme', overallPercent: 90 }),
      row({ id: 'b', team: 'Aurora', organisation: 'Globex', overallPercent: 40 }),
    ];
    expect(aggregateByTeam(rows)).toHaveLength(2);
  });

  it('insufficient-data when no rows have an overall percent', () => {
    const rows: ChecklistRow[] = [
      row({ id: 'a', team: 'Empty', overallPercent: null, maturity: 'insufficient-data' }),
    ];
    const [t] = aggregateByTeam(rows);
    expect(t.meanOfMeans).toBeNull();
    expect(t.maturity).toBe('insufficient-data');
  });

  it('returns the three most-frequent flags', () => {
    const rows: ChecklistRow[] = [
      row({ id: 'a', team: 'X', flags: ['psychological-safety-risk', 'finished-work-risk'] }),
      row({
        id: 'b',
        team: 'X',
        flags: ['psychological-safety-risk', 'experimentation-blocked', 'finished-work-risk'],
      }),
      row({ id: 'c', team: 'X', flags: ['psychological-safety-risk', 'learning-stalled'] }),
    ];
    const [t] = aggregateByTeam(rows);
    expect(t.topFlags.slice(0, 1)).toEqual(['psychological-safety-risk']);
    expect(t.topFlags).toHaveLength(3);
  });

  it('returns trend points in date-ascending order', () => {
    const rows: ChecklistRow[] = [
      row({ id: 'a', team: 'Aurora', date: '2026-04-01', overallPercent: 88 }),
      row({ id: 'b', team: 'Aurora', date: '2025-10-01', overallPercent: 60 }),
      row({ id: 'c', team: 'Aurora', date: '2026-01-01', overallPercent: 75 }),
    ];
    const [t] = aggregateByTeam(rows);
    expect(t.trend.map((p) => p.date)).toEqual(['2025-10-01', '2026-01-01', '2026-04-01']);
    expect(t.trend.map((p) => p.overallPercent)).toEqual([60, 75, 88]);
  });

  it('omits rows with null overallPercent from the trend', () => {
    const rows: ChecklistRow[] = [
      row({ id: 'a', team: 'X', date: '2026-04-01', overallPercent: 80 }),
      row({
        id: 'b',
        team: 'X',
        date: '2026-04-15',
        overallPercent: null,
        maturity: 'insufficient-data',
      }),
    ];
    const [t] = aggregateByTeam(rows);
    expect(t.trend).toHaveLength(1);
    expect(t.trend[0].date).toBe('2026-04-01');
  });
});

describe('rowsToCsv', () => {
  it('emits a header row and one line per row', () => {
    const csv = rowsToCsv([
      row({ id: 'a', respondent: 'Alice', team: 'Aurora', flags: ['finished-work-risk'] }),
    ]);
    const lines = csv.trim().split('\n');
    expect(lines).toHaveLength(2);
    expect(lines[0]).toContain('id,date,respondent');
    expect(lines[1]).toContain('Alice');
    expect(lines[1]).toContain('Aurora');
  });

  it('quotes fields that contain commas', () => {
    const csv = rowsToCsv([row({ id: 'a', respondent: 'Doe, Jane', team: 'Aurora' })]);
    expect(csv).toContain('"Doe, Jane"');
  });

  it('escapes embedded quotes', () => {
    const csv = rowsToCsv([row({ id: 'a', respondent: 'Mc"K', team: 'Aurora' })]);
    expect(csv).toContain('"Mc""K"');
  });

  it('replaces respondent with "Anonymous" and blanks role for anonymous rows', () => {
    const csv = rowsToCsv([
      row({ id: 'a', respondent: 'Should not appear', role: 'agile-coach', isAnonymous: true }),
    ]);
    expect(csv).toContain('Anonymous');
    expect(csv).not.toContain('Should not appear');
    expect(csv).not.toContain('agile-coach');
  });

  it('blanks unanswered section percents', () => {
    const csv = rowsToCsv([
      row({ id: 'a', stakeholdersPercent: null, overallPercent: null }),
    ]);
    // empty fields between commas
    expect(csv).toContain(',,');
  });
});

describe('sparklineGeometry', () => {
  it('returns null for an empty series', () => {
    expect(sparklineGeometry([])).toBeNull();
  });

  it('places a single point at the horizontal centre', () => {
    const geom = sparklineGeometry([{ date: '2026-04-01', overallPercent: 50 }], 100, 28);
    expect(geom).not.toBeNull();
    expect(geom!.lastX).toBeCloseTo(50);
    // 50% maps to vertical midpoint within inner box
    expect(geom!.lastY).toBeCloseTo(14);
  });

  it('maps 0 and 100 to opposite vertical edges', () => {
    const geom = sparklineGeometry(
      [
        { date: '2026-01-01', overallPercent: 0 },
        { date: '2026-02-01', overallPercent: 100 },
      ],
      100,
      28,
      2,
    );
    expect(geom).not.toBeNull();
    // first point: 0 → bottom of inner box (y = padding + innerH = 26)
    expect(geom!.pathD.startsWith('M')).toBe(true);
    expect(geom!.pathD).toContain(',26');
    // last point: 100 → top of inner box (y = padding = 2)
    expect(geom!.lastY).toBeCloseTo(2);
  });
});

describe('parseCsv', () => {
  it('parses simple rows', () => {
    expect(parseCsv('a,b,c\n1,2,3\n')).toEqual([
      ['a', 'b', 'c'],
      ['1', '2', '3'],
    ]);
  });
  it('handles quoted fields with commas', () => {
    expect(parseCsv('a,b\n"Doe, Jane",x\n')).toEqual([
      ['a', 'b'],
      ['Doe, Jane', 'x'],
    ]);
  });
  it('handles escaped quotes', () => {
    expect(parseCsv('a\n"Mc""K"\n')).toEqual([['a'], ['Mc"K']]);
  });
  it('handles CRLF line endings', () => {
    expect(parseCsv('a,b\r\n1,2\r\n')).toEqual([
      ['a', 'b'],
      ['1', '2'],
    ]);
  });
  it('drops fully-empty trailing rows', () => {
    expect(parseCsv('a,b\n1,2\n\n')).toEqual([
      ['a', 'b'],
      ['1', '2'],
    ]);
  });
});

describe('rowsFromCsv', () => {
  const HEADER =
    'id,date,respondent,role,team,organisation,answered,teamsPercent,stakeholdersPercent,practicesPercent,overallPercent,maturity,weakSections,flags';

  it('round-trips a row from rowsToCsv', () => {
    const original = [
      {
        id: 'A1',
        date: '2026-05-12',
        respondent: 'Alice',
        role: 'scrum-master',
        team: 'Aurora',
        organisation: 'Acme',
        answered: 57,
        teamsPercent: 80,
        stakeholdersPercent: 75,
        practicesPercent: 70,
        overallPercent: 75,
        maturity: 'mature' as const,
        weakSections: ['Practices'],
        flags: ['finished-work-risk'],
      },
    ];
    const csv = rowsToCsv(original);
    const parsed = rowsFromCsv(csv);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].id).toBe('A1');
    expect(parsed[0].overallPercent).toBe(75);
    expect(parsed[0].weakSections).toEqual(['Practices']);
    expect(parsed[0].flags).toEqual(['finished-work-risk']);
    expect(parsed[0].isAnonymous).toBe(false);
  });

  it('marks Anonymous respondents', () => {
    const csv = `${HEADER}\nA1,2026-05-12,Anonymous,,Aurora,Acme,57,80,75,70,75,mature,,\n`;
    const parsed = rowsFromCsv(csv);
    expect(parsed[0].isAnonymous).toBe(true);
  });

  it('coerces missing percent columns to null', () => {
    const csv = `${HEADER}\nA1,2026-05-12,Alice,scrum-master,Aurora,Acme,10,75,,,,insufficient-data,,insufficient-data\n`;
    const parsed = rowsFromCsv(csv);
    expect(parsed[0].overallPercent).toBeNull();
    expect(parsed[0].stakeholdersPercent).toBeNull();
    expect(parsed[0].teamsPercent).toBe(75);
  });

  it('throws on missing required columns', () => {
    expect(() => rowsFromCsv('just,a,header\nnot,a,row')).toThrow(/required column/);
  });

  it('coerces invalid maturity to insufficient-data', () => {
    const csv = `${HEADER}\nA1,2026-05-12,Alice,scrum-master,Aurora,Acme,57,80,75,70,75,bogus,,\n`;
    const parsed = rowsFromCsv(csv);
    expect(parsed[0].maturity).toBe('insufficient-data');
  });
});

describe('multiTeamChart', () => {
  it('returns null when no rows have a trend', () => {
    const r = row({ id: 'a', team: 'Empty', overallPercent: null, maturity: 'insufficient-data' });
    expect(multiTeamChart([r])).toBeNull();
  });

  it('emits one series per scored team with a path', () => {
    const rows = [
      row({ id: 'a', team: 'Aurora', date: '2026-01-01', overallPercent: 60 }),
      row({ id: 'b', team: 'Aurora', date: '2026-04-01', overallPercent: 90 }),
      row({ id: 'c', team: 'Borealis', date: '2026-01-01', overallPercent: 70 }),
    ];
    const chart = multiTeamChart(rows, { width: 600, height: 200 });
    expect(chart).not.toBeNull();
    expect(chart!.series.length).toBe(2);
    const aurora = chart!.series.find((s) => s.team === 'Aurora')!;
    expect(aurora.points).toHaveLength(2);
    expect(aurora.pathD.startsWith('M')).toBe(true);
    expect(aurora.pathD).toContain('L');
  });

  it('maps 0% to innerBottom and 100% to innerTop', () => {
    const rows = [
      row({ id: 'a', team: 'Aurora', date: '2026-01-01', overallPercent: 0 }),
      row({ id: 'b', team: 'Aurora', date: '2026-04-01', overallPercent: 100 }),
    ];
    const chart = multiTeamChart(rows, { width: 600, height: 200 })!;
    const pts = chart.series[0].points;
    expect(pts[0].y).toBeCloseTo(chart.innerBottom);
    expect(pts[1].y).toBeCloseTo(chart.innerTop);
  });

  it('places y ticks at 0 / 25 / 50 / 75 / 100', () => {
    const rows = [row({ id: 'a', team: 'Aurora', date: '2026-01-01', overallPercent: 50 })];
    const chart = multiTeamChart(rows)!;
    expect(chart.yTicks.map((t) => t.label)).toEqual(['0%', '25%', '50%', '75%', '100%']);
  });

  it('emits at most 5 x ticks', () => {
    const rows = [
      row({ id: 'a', team: 'Aurora', date: '2026-01-01', overallPercent: 50 }),
      row({ id: 'b', team: 'Aurora', date: '2026-02-01', overallPercent: 55 }),
      row({ id: 'c', team: 'Aurora', date: '2026-03-01', overallPercent: 60 }),
      row({ id: 'd', team: 'Aurora', date: '2026-04-01', overallPercent: 65 }),
      row({ id: 'e', team: 'Aurora', date: '2026-05-01', overallPercent: 70 }),
      row({ id: 'f', team: 'Aurora', date: '2026-06-01', overallPercent: 75 }),
      row({ id: 'g', team: 'Aurora', date: '2026-07-01', overallPercent: 80 }),
    ];
    const chart = multiTeamChart(rows)!;
    expect(chart.xTicks.length).toBeLessThanOrEqual(5);
  });
});
