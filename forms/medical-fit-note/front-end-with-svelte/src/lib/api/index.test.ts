import { describe, expect, it } from 'vitest';
import { createDefaultAssessment } from '#lib/engine/defaults.js';
import { gradeFitNote } from '#lib/engine/fit-note-grader.js';
import { fetchDashboardRows, joinFitNoteRows, saveFitNote } from './index.js';

type Call = { method: string; path: string; body?: Record<string, unknown> };

/** A fake fetch over an in-memory store that records every request. */
function fakeApi(seed: Record<string, Record<string, unknown>[]> = {}) {
  const tables: Record<string, Record<string, unknown>[]> = { ...seed };
  const calls: Call[] = [];
  let n = 0;
  const fetchImpl = (async (url: string, init: RequestInit = {}) => {
    const path = new URL(url).pathname.replace('/api/', '');
    const method = init.method ?? 'GET';
    const body = init.body ? JSON.parse(init.body as string) : undefined;
    calls.push({ method, path, body });
    const json = (data: unknown) =>
      ({ ok: true, status: 200, statusText: 'OK', json: async () => data }) as Response;
    if (method === 'GET') return json(tables[path] ?? []);
    const row = { id: `id-${++n}`, deletedAt: null, ...body };
    (tables[path] ??= []).push(row);
    return json(row);
  }) as unknown as typeof fetch;
  return { fetchImpl, calls, tables };
}

const filled = () => ({
  ...createDefaultAssessment(),
  employeeName: 'Alice Smith',
  employeeBirthDate: '1980-02-03',
  employerName: 'Acme',
  clinicianName: 'Dr A Shah',
  clinicianRole: 'gp',
  clinicianRegistrationBody: 'GMC',
  clinicianRegistrationNumber: '1234567',
  assessmentDate: '2026-10-01',
  assessmentMethod: 'face-to-face',
  diagnosisPrimary: 'Back pain',
  fitnessAdvice: 'not-fit-for-work',
  periodFrom: '2026-10-01',
  periodTo: '2026-10-14',
  employeeConsentToShare: 'yes',
  clinicianDeclaration: 'yes'
});

describe('saveFitNote', () => {
  it('posts employee, clinician, note, grade, rules and flags in order', async () => {
    const api = fakeApi();
    const d = filled();
    const res = gradeFitNote(d);
    const out = await saveFitNote(d, res, api.fetchImpl);
    expect(out.status).toBe('signed');
    const seq = api.calls.map((c) => `${c.method} ${c.path}`);
    expect(seq).toEqual([
      'GET employees',
      'POST employees',
      'GET clinicians',
      'POST clinicians',
      'POST medical_fit_notes',
      'POST medical_fit_note_grades'
    ]);
    expect(api.calls[4].body).toMatchObject({ employeeId: 'id-1', clinicianId: 'id-2' });
  });

  it('reuses an existing employee and clinician and saves blocked notes as draft', async () => {
    const api = fakeApi({
      employees: [{ id: 'e1', name: 'alice smith', birthDate: '1980-02-03' }],
      clinicians: [{ id: 'c1', registrationBody: 'GMC', registrationNumber: '1234567' }]
    });
    const d = { ...filled(), clinicianDeclaration: '' };
    const res = gradeFitNote(d);
    const out = await saveFitNote(d, res, api.fetchImpl);
    expect(out.status).toBe('draft');
    expect(api.calls.filter((c) => c.method === 'POST' && c.path === 'employees')).toHaveLength(0);
    expect(api.tables.medical_fit_notes[0]).toMatchObject({ employeeId: 'e1', clinicianId: 'c1' });
    expect(api.tables.medical_fit_note_grade_rules).toHaveLength(res.firedRules.length);
    expect(api.tables.medical_fit_note_grade_rules[0]).toHaveProperty('gradeId');
    expect(api.tables.medical_fit_note_grade_flags).toHaveLength(res.additionalFlags.length);
  });

  it('refuses to save without the fields the API requires', async () => {
    const api = fakeApi();
    const d = { ...filled(), employeeBirthDate: null };
    await expect(saveFitNote(d, gradeFitNote(d), api.fetchImpl)).rejects.toThrow(/date of birth/);
    expect(api.calls).toHaveLength(0);
  });
});

describe('dashboard join', () => {
  it('round-trips a saved note into a dashboard row', async () => {
    const api = fakeApi();
    const d = { ...filled(), clinicianDeclaration: '' };
    await saveFitNote(d, gradeFitNote(d), api.fetchImpl);
    const rows = await fetchDashboardRows(api.fetchImpl);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      employee: 'Alice Smith',
      employer: 'Acme',
      clinician: 'Dr A Shah',
      approval: 'blocked',
      advice: 'not-fit-for-work',
      durationDays: 14
    });
    expect(rows[0].flags).toContain('missing-declaration');
  });

  it('omits notes that were never graded', () => {
    expect(joinFitNoteRows([{ id: 'n1' }], [], [], [], [])).toEqual([]);
  });
});
