/**
 * Back-end API client for the medical fit note front-end.
 *
 * The Loco back-end (forms/medical-fit-note/back-end-with-loco) serves plain
 * REST JSON (camelCase, UUID ids) at /api/employees, /api/clinicians,
 * /api/medical_fit_notes, /api/medical_fit_note_grades,
 * /api/medical_fit_note_grade_rules and /api/medical_fit_note_grade_flags
 * (GET + POST on the bare path; no trailing slash). There is no bespoke
 * dashboard or submit endpoint, so this module joins the tables client-side
 * for the dashboard and saves a submitted wizard as a sequence of POSTs.
 *
 * The base URL comes from `VITE_API_BASE` (default http://localhost:5150).
 * Callers fall back to the offline sample data when a call rejects.
 */
import type { DashboardRow, FitNoteAssessment, FitNoteGrade } from '#lib/engine/types.js';

export const DEFAULT_API_BASE = 'http://localhost:5150';

/** The configured API base URL, without a trailing slash. */
export const API_BASE: string = (
  (import.meta.env?.VITE_API_BASE as string | undefined) || DEFAULT_API_BASE
).replace(/\/+$/, '');

const PATHS = {
  employees: '/api/employees',
  clinicians: '/api/clinicians',
  notes: '/api/medical_fit_notes',
  grades: '/api/medical_fit_note_grades',
  rules: '/api/medical_fit_note_grade_rules',
  flags: '/api/medical_fit_note_grade_flags'
} as const;

/** Flag categories the SQL CHECK list in sql/07 accepts (`''` is also valid). */
export const FLAG_CATEGORIES: ReadonlySet<string> = new Set([
  'missing-diagnosis',
  'missing-assessment',
  'invalid-period',
  'long-period-without-review',
  'missing-adjustments',
  'missing-consent',
  'missing-declaration',
  'unregistered-clinician',
  'backdated',
  'other',
  ''
]);

/** A row as the API returns it (camelCase JSON). */
type ApiRow = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

type Fetch = typeof fetch;

async function request(
  fetchImpl: Fetch,
  method: 'GET' | 'POST',
  path: string,
  body?: unknown
): Promise<unknown> {
  const init: RequestInit = { method, headers: { Accept: 'application/json' } };
  if (body !== undefined) {
    (init.headers as Record<string, string>)['Content-Type'] = 'application/json';
    init.body = JSON.stringify(body);
  }
  const res = await fetchImpl(`${API_BASE}${path}`, init);
  if (!res.ok) {
    let detail = '';
    try {
      detail = (await res.text()).slice(0, 200);
    } catch {
      // Ignore body read failures.
    }
    throw new Error(
      `${method} ${path} failed: ${res.status} ${res.statusText}${detail ? ` ${detail}` : ''}`
    );
  }
  return res.json();
}

/** GET a collection (bare array or `{ items }` envelope), dropping soft-deleted rows. */
async function list(fetchImpl: Fetch, path: string): Promise<ApiRow[]> {
  const data = (await request(fetchImpl, 'GET', path)) as ApiRow[] | { items?: ApiRow[] };
  const rows = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
  return rows.filter((r) => !r.deletedAt);
}

const post = (fetchImpl: Fetch, path: string, body: unknown) =>
  request(fetchImpl, 'POST', path, body) as Promise<ApiRow>;

// ----------------------------------------------------------------------
// Dashboard: client-side join
// ----------------------------------------------------------------------

/**
 * Join the API collections into dashboard rows. Notes with no grade row
 * (never graded) are omitted: the dashboard needs an approval status.
 */
export function joinFitNoteRows(
  notes: ApiRow[],
  employees: ApiRow[],
  clinicians: ApiRow[],
  grades: ApiRow[],
  flags: ApiRow[]
): DashboardRow[] {
  const employeeById = new Map(employees.map((e) => [e.id, e]));
  const clinicianById = new Map(clinicians.map((c) => [c.id, c]));
  const gradeByNote = new Map(grades.map((g) => [g.medicalFitNoteId, g]));
  const flagsByGrade = new Map<string, ApiRow[]>();
  for (const f of flags) {
    const bucket = flagsByGrade.get(f.medicalFitNoteGradeId) ?? [];
    bucket.push(f);
    flagsByGrade.set(f.medicalFitNoteGradeId, bucket);
  }

  const rows: DashboardRow[] = [];
  for (const n of notes) {
    const g = gradeByNote.get(n.id);
    if (!g) continue;
    const e = employeeById.get(n.employeeId);
    const c = clinicianById.get(n.clinicianId);
    const categories: string[] = [];
    for (const f of flagsByGrade.get(g.id) ?? []) {
      if (f.category && !categories.includes(f.category)) categories.push(f.category);
    }
    const yesCount = [
      n.adjustmentPhasedReturn,
      n.adjustmentAlteredHours,
      n.adjustmentAmendedDuties,
      n.adjustmentWorkplaceAdaptations
    ].filter((v) => v === 'yes').length;
    rows.push({
      id: n.id,
      date: n.assessmentDate || String(n.createdAt ?? '').slice(0, 10),
      employee: e?.name ?? '',
      employer: e?.employerName ?? '',
      advice: g.outcome || n.fitnessAdvice || '',
      durationDays: g.durationDays ?? n.periodDurationDays ?? null,
      adjustments: g.adjustmentCount ?? yesCount,
      approval: g.approvalStatus,
      flagCount: categories.length,
      flags: categories.join(', '),
      clinician: c?.name ?? ''
    });
  }
  return rows;
}

/** Fetch and join the dashboard rows; rejects on any network or HTTP error. */
export async function fetchDashboardRows(fetchImpl: Fetch = fetch): Promise<DashboardRow[]> {
  const [notes, employees, clinicians, grades, flags] = await Promise.all([
    list(fetchImpl, PATHS.notes),
    list(fetchImpl, PATHS.employees),
    list(fetchImpl, PATHS.clinicians),
    list(fetchImpl, PATHS.grades),
    list(fetchImpl, PATHS.flags)
  ]);
  return joinFitNoteRows(notes, employees, clinicians, grades, flags);
}

// ----------------------------------------------------------------------
// Wizard submit
// ----------------------------------------------------------------------

const norm = (s: unknown) =>
  String(s ?? '')
    .trim()
    .toLowerCase();

/** Names of the wizard fields the API needs that are still empty. */
export function missingForSave(d: FitNoteAssessment): string[] {
  const missing: string[] = [];
  if (!d.employeeName.trim()) missing.push('employee name');
  if (!d.employeeBirthDate) missing.push('employee date of birth');
  if (!d.clinicianName.trim()) missing.push('clinician name');
  return missing;
}

function findEmployee(employees: ApiRow[], d: FitNoteAssessment): ApiRow | undefined {
  const nhs = norm(d.employeeNhsNumber);
  return employees.find((e) => {
    if (nhs && norm(e.unitedKingdomNhsNumber) === nhs) return true;
    return norm(e.name) === norm(d.employeeName) && e.birthDate === d.employeeBirthDate;
  });
}

function findClinician(clinicians: ApiRow[], d: FitNoteAssessment): ApiRow | undefined {
  const number = norm(d.clinicianRegistrationNumber);
  return clinicians.find((c) => {
    if (number) {
      return (
        norm(c.registrationNumber) === number &&
        c.registrationBody === (d.clinicianRegistrationBody || '')
      );
    }
    return norm(c.name) === norm(d.clinicianName) && !norm(c.registrationNumber);
  });
}

/** Map wizard state to the medical_fit_note POST body. */
export function buildNotePayload(
  d: FitNoteAssessment,
  employeeId: string,
  clinicianId: string,
  status: 'draft' | 'signed',
  signedAt: string | null
) {
  return {
    employeeId,
    clinicianId,
    status,
    assessmentDate: d.assessmentDate || null,
    assessmentMethod: d.assessmentMethod || '',
    diagnosisPrimary: d.diagnosisPrimary || '',
    diagnosisAdditional: d.diagnosisAdditional || '',
    fitnessAdvice: d.fitnessAdvice || '',
    periodFrom: d.periodFrom || null,
    periodTo: d.periodTo || null,
    periodDurationDays:
      d.periodDurationDays != null && d.periodDurationDays > 0 ? d.periodDurationDays : null,
    reassessmentRequired: d.reassessmentRequired || '',
    adjustmentPhasedReturn: d.adjustmentPhasedReturn || '',
    adjustmentAlteredHours: d.adjustmentAlteredHours || '',
    adjustmentAmendedDuties: d.adjustmentAmendedDuties || '',
    adjustmentWorkplaceAdaptations: d.adjustmentWorkplaceAdaptations || '',
    functionalEffects: d.functionalEffects || '',
    comments: d.comments || '',
    employeeConsentToShare: d.employeeConsentToShare || '',
    clinicianDeclaration: d.clinicianDeclaration || '',
    signedAt
  };
}

/**
 * Save a submitted wizard. Request order: employee (find or POST), clinician
 * (find or POST), medical_fit_note, medical_fit_note_grade, then one POST per
 * fired rule and per flag. `result` is the local engine's grade.
 */
export async function saveFitNote(
  d: FitNoteAssessment,
  result: FitNoteGrade,
  fetchImpl: Fetch = fetch
): Promise<{ noteId: string; status: 'draft' | 'signed' }> {
  const missing = missingForSave(d);
  if (missing.length > 0) throw new Error(`Not saved: enter ${missing.join(', ')} first.`);

  const employee =
    findEmployee(await list(fetchImpl, PATHS.employees), d) ??
    (await post(fetchImpl, PATHS.employees, {
      name: d.employeeName.trim(),
      birthDate: d.employeeBirthDate,
      unitedKingdomNhsNumber: d.employeeNhsNumber.trim() || null,
      employerName: d.employerName || '',
      jobTitle: d.jobTitle || ''
    }));

  const clinician =
    findClinician(await list(fetchImpl, PATHS.clinicians), d) ??
    (await post(fetchImpl, PATHS.clinicians, {
      name: d.clinicianName.trim(),
      role: d.clinicianRole || '',
      registrationBody: d.clinicianRegistrationBody || '',
      registrationNumber: d.clinicianRegistrationNumber.trim(),
      practiceName: ''
    }));

  const signed = result.approvalStatus === 'approved' && d.clinicianDeclaration === 'yes';
  const status = signed ? 'signed' : 'draft';
  const note = await post(
    fetchImpl,
    PATHS.notes,
    buildNotePayload(d, employee.id, clinician.id, status, signed ? new Date().toISOString() : null)
  );

  const grade = await post(fetchImpl, PATHS.grades, {
    medicalFitNoteId: note.id,
    outcome: result.outcome || '',
    approvalStatus: result.approvalStatus,
    durationDays: result.durationDays,
    adjustmentCount: result.adjustmentCount,
    gradedAt: new Date().toISOString()
  });

  for (const r of result.firedRules) {
    await post(fetchImpl, PATHS.rules, {
      gradeId: grade.id,
      ruleId: r.ruleId,
      category: r.category || '',
      description: r.description || ''
    });
  }
  for (const f of result.additionalFlags) {
    // The SQL CHECK list is closed: skip any category it does not accept.
    if (!FLAG_CATEGORIES.has(f.category)) continue;
    await post(fetchImpl, PATHS.flags, {
      medicalFitNoteGradeId: grade.id,
      flagId: f.flagId,
      category: f.category,
      priority: f.priority || '',
      description: f.description || '',
      suggestedAction: f.suggestedAction || ''
    });
  }

  return { noteId: note.id as string, status };
}
