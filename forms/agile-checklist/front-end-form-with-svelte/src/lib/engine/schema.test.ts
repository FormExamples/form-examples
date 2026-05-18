import { describe, it, expect } from 'vitest';
import { ALL_ITEMS } from '$lib/config/items.js';
import { createEmptyChecklist } from './factory.js';
import { agileChecklistSchema, safeParseChecklist } from './schema.js';

describe('agileChecklistSchema', () => {
  it('round-trips an empty checklist', () => {
    const empty = createEmptyChecklist();
    const parsed = agileChecklistSchema.parse(empty);
    expect(parsed).toEqual(empty);
  });

  it('fills missing answer keys with ""', () => {
    const partial = {
      respondent: {
        fullName: 'Alice',
        email: '',
        role: 'scrum-master' as const,
        teamName: '',
        organisationName: '',
        yearsInAgile: null,
        assessmentDate: '',
        assessmentPeriod: '',
      },
      answers: { t01: 'yes', t02: 'no' },
      actionPlan: {
        topAction1: '',
        topAction2: '',
        topAction3: '',
        coachNotes: '',
        signedAt: '',
        overallNotes: '',
      },
    };
    const parsed = agileChecklistSchema.parse(partial);
    expect(parsed.answers.t01).toBe('yes');
    expect(parsed.answers.t02).toBe('no');
    expect(parsed.answers.t25).toBe('');
    expect(parsed.answers.s14).toBe('');
    expect(parsed.answers.p18).toBe('');
    // All 57 keys present
    expect(Object.keys(parsed.answers).length).toBe(ALL_ITEMS.length);
  });

  it('rejects an invalid answer value', () => {
    const bad = {
      ...createEmptyChecklist(),
      answers: { ...createEmptyChecklist().answers, t01: 'maybe' },
    };
    expect(agileChecklistSchema.safeParse(bad).success).toBe(false);
  });

  it('rejects an invalid role', () => {
    const bad = createEmptyChecklist();
    (bad.respondent as unknown as Record<string, string>).role = 'ceo';
    expect(agileChecklistSchema.safeParse(bad).success).toBe(false);
  });

  it('rejects an out-of-range years-in-agile', () => {
    const bad = createEmptyChecklist();
    bad.respondent.yearsInAgile = -1;
    expect(agileChecklistSchema.safeParse(bad).success).toBe(false);
    bad.respondent.yearsInAgile = 100;
    expect(agileChecklistSchema.safeParse(bad).success).toBe(false);
  });
});

describe('safeParseChecklist', () => {
  it('returns the value for valid input', () => {
    const v = createEmptyChecklist();
    v.answers.t01 = 'yes';
    expect(safeParseChecklist(v)?.answers.t01).toBe('yes');
  });

  it('returns null for non-object input', () => {
    expect(safeParseChecklist(null)).toBeNull();
    expect(safeParseChecklist('foo')).toBeNull();
    expect(safeParseChecklist(42)).toBeNull();
  });

  it('returns null when respondent is missing', () => {
    expect(
      safeParseChecklist({
        answers: {},
        actionPlan: createEmptyChecklist().actionPlan,
      }),
    ).toBeNull();
  });

  it('drops unknown answer keys', () => {
    const v = createEmptyChecklist();
    const tampered = {
      ...v,
      answers: { ...v.answers, malicious: 'yes', t01: 'yes' },
    };
    const parsed = safeParseChecklist(tampered);
    expect(parsed).not.toBeNull();
    expect(parsed!.answers.t01).toBe('yes');
    expect('malicious' in parsed!.answers).toBe(false);
  });
});
