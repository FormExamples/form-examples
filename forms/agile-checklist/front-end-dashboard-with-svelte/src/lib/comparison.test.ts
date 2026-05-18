import { describe, it, expect } from 'vitest';
import {
  pairSubmissions,
  quadrantFor,
  readSisterCsv,
  type SisterRow,
} from './comparison.js';

const PRINCIPLES_HEADER =
  'id,date,respondent,role,team,organisation,answered,meanScore,maturity,weakPrinciples,flags';
const CHECKLIST_HEADER =
  'id,date,respondent,role,team,organisation,answered,teamsPercent,stakeholdersPercent,practicesPercent,overallPercent,maturity,weakSections,flags';

describe('quadrantFor', () => {
  it('classifies the four base quadrants', () => {
    expect(quadrantFor('mature', 'mature')).toBe('healthy-adoption');
    expect(quadrantFor('mature', 'initial')).toBe('aspirational-gap');
    expect(quadrantFor('initial', 'mature')).toBe('cargo-cult');
    expect(quadrantFor('initial', 'initial')).toBe('pre-agile');
  });
  it('treats optimising as high', () => {
    expect(quadrantFor('optimising', 'optimising')).toBe('healthy-adoption');
    expect(quadrantFor('optimising', 'developing')).toBe('aspirational-gap');
  });
  it('treats developing/initial/ad-hoc as low', () => {
    expect(quadrantFor('developing', 'developing')).toBe('pre-agile');
    expect(quadrantFor('developing', 'mature')).toBe('cargo-cult');
  });
  it('returns insufficient-data when either side lacks data', () => {
    expect(quadrantFor('insufficient-data', 'mature')).toBe('insufficient-data');
    expect(quadrantFor('mature', 'insufficient-data')).toBe('insufficient-data');
  });
});

describe('readSisterCsv', () => {
  it('reads a principles-assessment CSV with meanScore', () => {
    const csv = `${PRINCIPLES_HEADER}\nA1,2026-01-01,Alice,scrum-master,Aurora,Acme,12,4.25,mature,,\n`;
    const rows = readSisterCsv(csv);
    expect(rows).toHaveLength(1);
    expect(rows[0].team).toBe('Aurora');
    expect(rows[0].maturity).toBe('mature');
    expect(rows[0].score).toBe(4.25);
    expect(rows[0].scoreDisplay).toBe('4.25');
  });

  it('reads a checklist CSV with overallPercent', () => {
    const csv = `${CHECKLIST_HEADER}\nB1,2026-01-01,Alice,scrum-master,Aurora,Acme,57,90,85,80,85,mature,,\n`;
    const rows = readSisterCsv(csv);
    expect(rows[0].score).toBe(85);
    expect(rows[0].scoreDisplay).toBe('85%');
  });

  it('coerces unknown maturity to insufficient-data', () => {
    const csv = `${PRINCIPLES_HEADER}\nA1,2026-01-01,Alice,scrum-master,Aurora,Acme,12,4.25,bogus,,\n`;
    expect(readSisterCsv(csv)[0].maturity).toBe('insufficient-data');
  });

  it('throws on missing required column', () => {
    expect(() => readSisterCsv('foo,bar\n1,2')).toThrow(/required column/);
  });
});

describe('pairSubmissions', () => {
  const row = (over: Partial<SisterRow> = {}): SisterRow => ({
    team: 'Aurora',
    organisation: 'Acme',
    date: '2026-01-01',
    maturity: 'mature',
    score: 4.0,
    scoreDisplay: '4.00',
    ...over,
  });

  it('pairs rows by team+organisation', () => {
    const pairs = pairSubmissions(
      [row({ maturity: 'mature' })],
      [row({ maturity: 'developing' })],
    );
    expect(pairs).toHaveLength(1);
    expect(pairs[0].team).toBe('Aurora');
    expect(pairs[0].quadrant).toBe('aspirational-gap');
  });

  it('keeps unpaired rows with insufficient-data', () => {
    const pairs = pairSubmissions(
      [row({ team: 'Aurora' }), row({ team: 'Borealis' })],
      [row({ team: 'Aurora' })],
    );
    expect(pairs).toHaveLength(2);
    const borealis = pairs.find((p) => p.team === 'Borealis')!;
    expect(borealis.behaviour).toBeNull();
    expect(borealis.quadrant).toBe('insufficient-data');
  });

  it('uses the latest date when a team has multiple submissions', () => {
    const pairs = pairSubmissions(
      [
        row({ date: '2025-01-01', maturity: 'initial' }),
        row({ date: '2026-05-01', maturity: 'mature' }),
      ],
      [row({ maturity: 'mature' })],
    );
    expect(pairs[0].principles!.date).toBe('2026-05-01');
    expect(pairs[0].principles!.maturity).toBe('mature');
    expect(pairs[0].quadrant).toBe('healthy-adoption');
  });

  it('sorts by team then organisation', () => {
    const pairs = pairSubmissions(
      [row({ team: 'Borealis' }), row({ team: 'Aurora' })],
      [],
    );
    expect(pairs.map((p) => p.team)).toEqual(['Aurora', 'Borealis']);
  });
});
