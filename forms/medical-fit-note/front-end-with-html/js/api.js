// Backend API client for the medical fit note front-end.
//
// The Loco back-end (forms/medical-fit-note/back-end-with-loco) serves plain
// REST JSON (camelCase, UUID ids) at /api/employees, /api/clinicians,
// /api/medical_fit_notes, /api/medical_fit_note_grades,
// /api/medical_fit_note_grade_rules and /api/medical_fit_note_grade_flags
// (GET + POST on the bare path, GET/PUT/PATCH/DELETE on /{id}; no trailing
// slash). There is no bespoke dashboard or submit endpoint, so this module
//   - joins the six tables client-side into the dashboard's FitNoteRow shape
//     (fetchFitNotes), and
//   - saves a submitted wizard as a sequence of POSTs (saveFitNote).
//
// The API base defaults to http://localhost:5150 and can be overridden by
// `window.__API_BASE__` or a `?api=` query parameter. Callers fall back to the
// sample data in `data.js` when a fetch fails, so the pages work offline.

const DEFAULT_API_BASE = 'http://localhost:5150';

/** Resolve the API base URL (no trailing slash). */
function resolveApiBase() {
  let base = '';
  try {
    base = new URLSearchParams(window.location.search).get('api') || '';
  } catch (e) {
    // No window/location (e.g. a headless import): fall through.
  }
  if (!base && typeof window !== 'undefined' && window.__API_BASE__) base = String(window.__API_BASE__);
  return (base || DEFAULT_API_BASE).replace(/\/+$/, '');
}

const API_BASE = resolveApiBase();

const PATHS = {
  employees: '/api/employees',
  clinicians: '/api/clinicians',
  notes: '/api/medical_fit_notes',
  grades: '/api/medical_fit_note_grades',
  rules: '/api/medical_fit_note_grade_rules',
  flags: '/api/medical_fit_note_grade_flags'
};

// Flag categories the SQL CHECK list in sql/07 accepts ('' is also valid).
const FLAG_CATEGORIES = new Set([
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

// ----------------------------------------------------------------------
// HTTP helpers
// ----------------------------------------------------------------------

async function request(method, path, body) {
  const init = { method, headers: { Accept: 'application/json' } };
  if (body !== undefined) {
    init.headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(body);
  }
  const res = await fetch(`${API_BASE}${path}`, init);
  if (!res.ok) {
    let detail = '';
    try {
      detail = (await res.text()).slice(0, 200);
    } catch (e) {
      // Ignore body read failures.
    }
    throw new Error(`${method} ${path} failed: ${res.status} ${res.statusText}${detail ? ` ${detail}` : ''}`);
  }
  return res.json();
}

/** GET a collection; accepts a bare array or an `{ items }` envelope. */
async function list(path) {
  const data = await request('GET', path);
  if (Array.isArray(data)) return data.filter((r) => !r.deletedAt);
  if (data && Array.isArray(data.items)) return data.items.filter((r) => !r.deletedAt);
  return [];
}

const post = (path, body) => request('POST', path, body);

// ----------------------------------------------------------------------
// Dashboard: client-side join
// ----------------------------------------------------------------------

/**
 * Join the six API collections into dashboard rows. Notes with no grade row
 * (never graded) are omitted: the dashboard needs an approval status.
 *
 * @returns {import('./types.js').FitNoteRow[]}
 */
function joinFitNoteRows(notes, employees, clinicians, grades, flags) {
  const employeeById = new Map(employees.map((e) => [e.id, e]));
  const clinicianById = new Map(clinicians.map((c) => [c.id, c]));
  const gradeByNote = new Map(grades.map((g) => [g.medicalFitNoteId, g]));
  const flagsByGrade = new Map();
  for (const f of flags) {
    if (!flagsByGrade.has(f.medicalFitNoteGradeId)) flagsByGrade.set(f.medicalFitNoteGradeId, []);
    flagsByGrade.get(f.medicalFitNoteGradeId).push(f);
  }

  const rows = [];
  for (const n of notes) {
    const g = gradeByNote.get(n.id);
    if (!g) continue;
    const e = employeeById.get(n.employeeId);
    const c = clinicianById.get(n.clinicianId);
    const categories = [];
    for (const f of flagsByGrade.get(g.id) || []) {
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
      date: n.assessmentDate || String(n.createdAt || '').slice(0, 10),
      employee: e ? e.name : '',
      employer: e ? e.employerName || '' : '',
      advice: g.outcome || n.fitnessAdvice || '',
      durationDays: g.durationDays ?? n.periodDurationDays ?? null,
      adjustments: g.adjustmentCount ?? yesCount,
      approval: g.approvalStatus,
      flags: categories,
      clinician: c ? c.name : ''
    });
  }
  return rows;
}

/**
 * Fetch and join the dashboard rows. Rejects on any network error or non-2xx
 * response so the caller can fall back to sample data.
 *
 * @returns {Promise<import('./types.js').FitNoteRow[]>}
 */
async function fetchFitNotes() {
  const [notes, employees, clinicians, grades, flags] = await Promise.all([
    list(PATHS.notes),
    list(PATHS.employees),
    list(PATHS.clinicians),
    list(PATHS.grades),
    list(PATHS.flags)
  ]);
  return joinFitNoteRows(notes, employees, clinicians, grades, flags);
}

// ----------------------------------------------------------------------
// Wizard submit
// ----------------------------------------------------------------------

const norm = (s) => String(s ?? '').trim().toLowerCase();

/** Names of the wizard fields the API needs that are still empty. */
function missingForSave(state) {
  const missing = [];
  if (!String(state.employeeName || '').trim()) missing.push('employee name');
  if (!state.employeeBirthDate) missing.push('employee date of birth');
  if (!String(state.clinicianName || '').trim()) missing.push('clinician name');
  return missing;
}

function findEmployee(employees, state) {
  const nhs = norm(state.employeeNhsNumber);
  return employees.find((e) => {
    if (nhs && norm(e.unitedKingdomNhsNumber) === nhs) return true;
    return norm(e.name) === norm(state.employeeName) && e.birthDate === state.employeeBirthDate;
  });
}

function findClinician(clinicians, state) {
  const number = norm(state.clinicianRegistrationNumber);
  return clinicians.find((c) => {
    if (number) {
      return norm(c.registrationNumber) === number && c.registrationBody === (state.clinicianRegistrationBody || '');
    }
    return norm(c.name) === norm(state.clinicianName) && !norm(c.registrationNumber);
  });
}

/** Map wizard state to the medical_fit_note POST body. */
function buildNotePayload(state, employeeId, clinicianId, status, signedAt) {
  return {
    employeeId,
    clinicianId,
    status,
    assessmentDate: state.assessmentDate || null,
    assessmentMethod: state.assessmentMethod || '',
    diagnosisPrimary: state.diagnosisPrimary || '',
    diagnosisAdditional: state.diagnosisAdditional || '',
    fitnessAdvice: state.fitnessAdvice || '',
    periodFrom: state.periodFrom || null,
    periodTo: state.periodTo || null,
    periodDurationDays: state.periodDurationDays > 0 ? state.periodDurationDays : null,
    reassessmentRequired: state.reassessmentRequired || '',
    adjustmentPhasedReturn: state.adjustmentPhasedReturn || '',
    adjustmentAlteredHours: state.adjustmentAlteredHours || '',
    adjustmentAmendedDuties: state.adjustmentAmendedDuties || '',
    adjustmentWorkplaceAdaptations: state.adjustmentWorkplaceAdaptations || '',
    functionalEffects: state.functionalEffects || '',
    comments: state.comments || '',
    employeeConsentToShare: state.employeeConsentToShare || '',
    clinicianDeclaration: state.clinicianDeclaration || '',
    signedAt
  };
}

/**
 * Save a submitted wizard. Request order: employee (find or POST), clinician
 * (find or POST), medical_fit_note, medical_fit_note_grade, then one POST per
 * fired rule and per flag. `result` is the local engine's output.
 *
 * @returns {Promise<{ noteId: string, status: string }>}
 */
async function saveFitNote(state, result) {
  const missing = missingForSave(state);
  if (missing.length > 0) {
    throw new Error(`Not saved: enter ${missing.join(', ')} first.`);
  }

  const employees = await list(PATHS.employees);
  const employee =
    findEmployee(employees, state) ||
    (await post(PATHS.employees, {
      name: state.employeeName.trim(),
      birthDate: state.employeeBirthDate,
      unitedKingdomNhsNumber: String(state.employeeNhsNumber || '').trim() || null,
      employerName: state.employerName || '',
      jobTitle: state.jobTitle || ''
    }));

  const clinicians = await list(PATHS.clinicians);
  const clinician =
    findClinician(clinicians, state) ||
    (await post(PATHS.clinicians, {
      name: state.clinicianName.trim(),
      role: state.clinicianRole || '',
      registrationBody: state.clinicianRegistrationBody || '',
      registrationNumber: String(state.clinicianRegistrationNumber || '').trim(),
      practiceName: ''
    }));

  const signed = result.approvalStatus === 'approved' && state.clinicianDeclaration === 'yes';
  const status = signed ? 'signed' : 'draft';
  const note = await post(
    PATHS.notes,
    buildNotePayload(state, employee.id, clinician.id, status, signed ? new Date().toISOString() : null)
  );

  const grade = await post(PATHS.grades, {
    medicalFitNoteId: note.id,
    outcome: result.outcome || '',
    approvalStatus: result.approvalStatus,
    durationDays: result.durationDays,
    adjustmentCount: result.adjustmentCount,
    gradedAt: new Date().toISOString()
  });

  for (const r of result.firedRules) {
    await post(PATHS.rules, {
      gradeId: grade.id,
      ruleId: r.ruleId,
      category: r.category || '',
      description: r.description || ''
    });
  }
  for (const f of result.additionalFlags) {
    // The SQL CHECK list is closed: skip any category it does not accept.
    if (!FLAG_CATEGORIES.has(f.category)) continue;
    await post(PATHS.flags, {
      medicalFitNoteGradeId: grade.id,
      flagId: f.flagId,
      category: f.category,
      priority: f.priority || '',
      description: f.description || '',
      suggestedAction: f.suggestedAction || ''
    });
  }

  return { noteId: note.id, status };
}

export { fetchFitNotes, saveFitNote, joinFitNoteRows, buildNotePayload, API_BASE };
