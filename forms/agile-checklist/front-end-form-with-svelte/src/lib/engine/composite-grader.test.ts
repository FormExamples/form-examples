import { describe, it, expect } from 'vitest';
import { createEmptyChecklist } from './factory.js';
import { calculateMaturity, deriveMaturity, bandFor } from './composite-grader.js';
import { ALL_ITEMS, TEAMS_ITEMS, STAKEHOLDERS_ITEMS, PRACTICES_ITEMS } from '$lib/config/items.js';
import type { Answer } from './types.js';

function answerAll(value: Answer): ReturnType<typeof createEmptyChecklist> {
  const data = createEmptyChecklist();
  for (const item of ALL_ITEMS) {
    data.answers[item.id] = value;
  }
  return data;
}

function answerSection(
  section: 'teams' | 'stakeholders' | 'practices',
  value: Answer,
): ReturnType<typeof createEmptyChecklist> {
  const data = createEmptyChecklist();
  const items =
    section === 'teams'
      ? TEAMS_ITEMS
      : section === 'stakeholders'
        ? STAKEHOLDERS_ITEMS
        : PRACTICES_ITEMS;
  for (const item of items) {
    data.answers[item.id] = value;
  }
  return data;
}

describe('bandFor', () => {
  it('high at >=75', () => {
    expect(bandFor(75)).toBe('high');
    expect(bandFor(100)).toBe('high');
  });
  it('mid at 50..74', () => {
    expect(bandFor(50)).toBe('mid');
    expect(bandFor(74)).toBe('mid');
  });
  it('low below 50', () => {
    expect(bandFor(49)).toBe('low');
    expect(bandFor(0)).toBe('low');
  });
  it('unanswered when null', () => {
    expect(bandFor(null)).toBe('unanswered');
  });
});

describe('deriveMaturity', () => {
  it('insufficient-data when null', () => {
    expect(deriveMaturity(null)).toBe('insufficient-data');
  });
  it('optimising at >=90', () => {
    expect(deriveMaturity(90)).toBe('optimising');
    expect(deriveMaturity(100)).toBe('optimising');
  });
  it('mature at 75..89', () => {
    expect(deriveMaturity(75)).toBe('mature');
    expect(deriveMaturity(89)).toBe('mature');
  });
  it('developing at 50..74', () => {
    expect(deriveMaturity(50)).toBe('developing');
    expect(deriveMaturity(74)).toBe('developing');
  });
  it('initial at 25..49', () => {
    expect(deriveMaturity(25)).toBe('initial');
    expect(deriveMaturity(49)).toBe('initial');
  });
  it('ad-hoc below 25', () => {
    expect(deriveMaturity(24)).toBe('ad-hoc');
    expect(deriveMaturity(0)).toBe('ad-hoc');
  });
});

describe('calculateMaturity', () => {
  it('reports insufficient-data when fewer than 30 items answered', () => {
    const data = createEmptyChecklist();
    // answer only 5 items
    data.answers.t01 = 'yes';
    data.answers.t02 = 'yes';
    data.answers.t03 = 'no';
    data.answers.s01 = 'yes';
    data.answers.p01 = 'no';
    const r = calculateMaturity(data);
    expect(r.answeredCount).toBe(5);
    expect(r.overallPercent).toBeNull();
    expect(r.maturity).toBe('insufficient-data');
    expect(r.additionalFlags.some((f) => f.category === 'insufficient-data')).toBe(true);
  });

  it('returns optimising for all yes', () => {
    const r = calculateMaturity(answerAll('yes'));
    expect(r.maturity).toBe('optimising');
    expect(r.overallPercent).toBe(100);
    expect(r.teams.percent).toBe(100);
    expect(r.stakeholders.percent).toBe(100);
    expect(r.practices.percent).toBe(100);
  });

  it('returns ad-hoc for all no', () => {
    const r = calculateMaturity(answerAll('no'));
    expect(r.maturity).toBe('ad-hoc');
    expect(r.overallPercent).toBe(0);
    expect(r.teams.band).toBe('low');
    expect(r.stakeholders.band).toBe('low');
    expect(r.practices.band).toBe('low');
    // all three section-low flags fire
    expect(r.additionalFlags.some((f) => f.category === 'teams-autonomy-risk')).toBe(true);
    expect(r.additionalFlags.some((f) => f.category === 'stakeholders-trust-risk')).toBe(true);
    expect(r.additionalFlags.some((f) => f.category === 'practices-discipline-risk')).toBe(true);
  });

  it('not-applicable answers count toward answeredCount but not the denominator', () => {
    const data = answerAll('yes');
    // mark all 25 teams items not-applicable
    for (const item of TEAMS_ITEMS) {
      data.answers[item.id] = 'not-applicable';
    }
    const r = calculateMaturity(data);
    expect(r.answeredCount).toBe(57);
    expect(r.teams.applicableCount).toBe(0);
    expect(r.teams.percent).toBeNull();
    expect(r.teams.band).toBe('unanswered');
    // overall is null because one section is unanswered
    expect(r.overallPercent).toBeNull();
    expect(r.maturity).toBe('insufficient-data');
  });

  it('section-imbalance flag fires when spread > 30 points', () => {
    const data = createEmptyChecklist();
    for (const it of TEAMS_ITEMS) data.answers[it.id] = 'yes';        // 100%
    for (const it of STAKEHOLDERS_ITEMS) data.answers[it.id] = 'yes'; // 100%
    for (const it of PRACTICES_ITEMS) data.answers[it.id] = 'no';     // 0%
    const r = calculateMaturity(data);
    expect(r.additionalFlags.some((f) => f.category === 'section-imbalance')).toBe(true);
  });

  it('finished-work flag fires when t08 and p12 are both no', () => {
    const data = answerAll('yes');
    data.answers.t08 = 'no';
    data.answers.p12 = 'no';
    const r = calculateMaturity(data);
    expect(r.additionalFlags.some((f) => f.category === 'finished-work-risk')).toBe(true);
  });

  it('experimentation-blocked flag fires when s09 and s10 are both no', () => {
    const data = answerAll('yes');
    data.answers.s09 = 'no';
    data.answers.s10 = 'no';
    const r = calculateMaturity(data);
    expect(r.additionalFlags.some((f) => f.category === 'experimentation-blocked')).toBe(true);
  });

  it('learning-stalled flag fires when t17 and t18 are both no', () => {
    const data = answerAll('yes');
    data.answers.t17 = 'no';
    data.answers.t18 = 'no';
    const r = calculateMaturity(data);
    expect(r.additionalFlags.some((f) => f.category === 'learning-stalled')).toBe(true);
  });

  it('psychological-safety flag fires when any of t22, s08, p14 is no', () => {
    const data = answerAll('yes');
    data.answers.t22 = 'no';
    const r = calculateMaturity(data);
    expect(r.additionalFlags.some((f) => f.category === 'psychological-safety-risk')).toBe(true);
  });

  it('returns developing when overall percent is in [50, 74]', () => {
    // 60% yes overall: every item yes/no alternating
    const data = createEmptyChecklist();
    ALL_ITEMS.forEach((item, i) => {
      data.answers[item.id] = i % 5 < 3 ? 'yes' : 'no'; // 60% yes
    });
    const r = calculateMaturity(data);
    expect(r.maturity).toBe('developing');
  });

  it('answeredSection percent is yes / (yes+no), not / total', () => {
    const data = createEmptyChecklist();
    for (const item of TEAMS_ITEMS) data.answers[item.id] = 'yes';
    for (const item of STAKEHOLDERS_ITEMS) data.answers[item.id] = 'yes';
    for (const item of PRACTICES_ITEMS) data.answers[item.id] = 'yes';
    // override two practices items with not-applicable
    data.answers.p01 = 'not-applicable';
    data.answers.p02 = 'not-applicable';
    const r = calculateMaturity(data);
    // 16 yes / 16 applicable for practices
    expect(r.practices.applicableCount).toBe(16);
    expect(r.practices.percent).toBe(100);
  });
});
