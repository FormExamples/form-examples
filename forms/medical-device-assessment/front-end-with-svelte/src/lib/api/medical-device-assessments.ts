// Backend API client for the dashboard and the wizard.
//
// Talks to the Loco REST API in ../back-end-with-loco: plain per-table CRUD
// (camelCase JSON, UUID ids) at /api/manufacturers, /api/assessors,
// /api/medical_device_assessments, /api/medical_device_assessment_grades,
// /api/medical_device_assessment_grade_rules and
// /api/medical_device_assessment_grade_flags. There is no bespoke submit or
// dashboard endpoint, so this module
//   * joins the tables client-side into the dashboard row shape, and
//   * saves a wizard submission as a sequence of POSTs.
//
// Mirrors front-end-with-html/js/api.js. The base URL comes from
// VITE_API_BASE (default http://localhost:5150). When a fetch fails or the
// list is empty the dashboard falls back to the sample data.

import type { AssessmentData, DashboardRow, GradingResult } from '#lib/engine/types.js';

const DEFAULT_API_BASE = 'http://localhost:5150';

/** API base URL without a trailing slash. */
export const API_BASE: string = (
  (import.meta.env?.VITE_API_BASE as string | undefined) || DEFAULT_API_BASE
).replace(/\/+$/, '');

const PATHS = {
  manufacturers: '/api/manufacturers',
  assessors: '/api/assessors',
  assessments: '/api/medical_device_assessments',
  grades: '/api/medical_device_assessment_grades',
  rules: '/api/medical_device_assessment_grade_rules',
  flags: '/api/medical_device_assessment_grade_flags'
} as const;

// Row shapes returned by the API (only the fields this client reads).
interface ApiRow {
  id: string;
  deletedAt?: string | null;
  [key: string]: unknown;
}

async function request<T = ApiRow>(
  method: 'GET' | 'POST',
  path: string,
  body?: unknown,
  fetchFn: typeof fetch = fetch
): Promise<T> {
  const init: RequestInit = { method, headers: { Accept: 'application/json' } };
  if (body !== undefined) {
    (init.headers as Record<string, string>)['Content-Type'] = 'application/json';
    init.body = JSON.stringify(body);
  }
  const res = await fetchFn(`${API_BASE}${path}`, init);
  if (!res.ok) throw new Error(`${method} ${path} failed: ${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

/** GET a collection; returns the live (not soft-deleted) rows. */
async function list(path: string, fetchFn?: typeof fetch): Promise<ApiRow[]> {
  const data = await request<unknown>('GET', path, undefined, fetchFn);
  const items = Array.isArray(data) ? (data as ApiRow[]) : [];
  return items.filter((r) => r && !r.deletedAt);
}

// ----------------------------------------------------------------------
// Dashboard: client-side join into DashboardRow
// ----------------------------------------------------------------------

/**
 * Fetch assessments, grades and flags and join them into dashboard rows.
 * Rejects on any network or non-2xx response so the caller can fall back to
 * sample data.
 */
export async function fetchDashboardRows(fetchFn?: typeof fetch): Promise<DashboardRow[]> {
  const [assessments, , , grades, flags] = await Promise.all([
    list(PATHS.assessments, fetchFn),
    list(PATHS.manufacturers, fetchFn),
    list(PATHS.assessors, fetchFn),
    list(PATHS.grades, fetchFn),
    list(PATHS.flags, fetchFn)
  ]);
  const gradeByAssessment = new Map(grades.map((g) => [g.medicalDeviceAssessmentId as string, g]));
  const flagsByGrade = new Map<string, string[]>();
  for (const f of flags) {
    const k = f.medicalDeviceAssessmentGradeId as string;
    flagsByGrade.set(k, [...(flagsByGrade.get(k) ?? []), f.flagId as string]);
  }
  return assessments.map((a): DashboardRow => {
    const g = gradeByAssessment.get(a.id);
    const s = (key: string) => (g?.[key] as string | undefined) ?? '';
    return {
      id: a.id,
      date: (a.assessmentDate as string | null) || String(a.createdAt ?? '').slice(0, 10),
      device: (a.deviceName as string) || 'Unnamed device',
      deviceKind: (a.deviceKind as string) || '',
      computedClass: s('computedDeviceClass') as DashboardRow['computedClass'],
      finalClass: s('finalDeviceClass') as DashboardRow['finalClass'],
      classSuffix: s('classSuffix'),
      conformityRoute: s('conformityRoute') as DashboardRow['conformityRoute'],
      determiningRule: s('determiningRule'),
      // An assessment saved without a grade (blocked / draft) has no readiness.
      readiness: (s('regulatoryReadiness') || 'blocked') as DashboardRow['readiness'],
      flags: g ? (flagsByGrade.get(g.id) ?? []) : [],
      summary: (a.intendedPurpose as string) || ''
    };
  });
}

// ----------------------------------------------------------------------
// Wizard: submit as find-or-create parties + assessment + grade + rules + flags
// ----------------------------------------------------------------------

const FLAG_CATEGORIES = [
  'missing-intended-purpose',
  'clinical-evidence-gap',
  'risk-management-gap',
  'quality-system-gap',
  'cybersecurity-gap',
  'post-market-surveillance-gap',
  'udi-gap',
  'notified-body-required',
  'software-as-medical-device',
  'medicinal-substance-combination',
  'tissue-origin',
  'nanomaterial',
  'in-vitro-diagnostic-out-of-scope',
  'class-override',
  'other',
  ''
];

const clip = (s: unknown, n: number) => String(s ?? '').slice(0, n);
const orNull = (s: string | null | undefined) => (s === '' || s === undefined ? null : s);
const norm = (s: unknown) =>
  String(s ?? '')
    .trim()
    .toLowerCase();

/** Find a live row by case-insensitive name, else POST a new one. */
async function findOrCreateByName(
  path: string,
  body: { name: string } & Record<string, unknown>
): Promise<ApiRow> {
  const wanted = norm(body.name);
  const existing = (await list(path)).find((r) => norm(r.name) === wanted);
  return existing ?? request('POST', path, body);
}

/**
 * Map the wizard state to a medical_device_assessment POST body. Every enum
 * and text column is sent (the API treats them as required); unanswered
 * enums are '' which the SQL CHECKs allow. The descriptive fields that live
 * in other tables (manufacturer, assessor) and the engine-only override
 * fields (finalDeviceClass, overrideReason, stored on the grade) are not part
 * of this body.
 */
function assessmentBody(
  d: AssessmentData,
  manufacturerId: string,
  assessorId: string,
  status: string
): Record<string, unknown> {
  const {
    manufacturer: _manufacturer,
    assessor: _assessor,
    finalDeviceClass: _finalDeviceClass,
    overrideReason: _overrideReason,
    ...rest
  } = d;
  void [_manufacturer, _assessor, _finalDeviceClass, _overrideReason];
  return {
    ...rest,
    manufacturerId,
    assessorId,
    status,
    assessmentDate: d.assessmentDate || null,
    deviceName: clip(d.deviceName, 255),
    modelOrCatalogueNumber: clip(d.modelOrCatalogueNumber, 100),
    uniqueDeviceIdentifier: clip(d.uniqueDeviceIdentifier, 255)
  };
}

export interface SaveOutcome {
  assessmentId: string;
  gradeId: string | null;
  /** True when no class could be determined: draft saved, grade skipped. */
  blocked: boolean;
  rules: number;
  flags: number;
}

/**
 * Save a wizard submission. Request sequence:
 *   1. GET /api/manufacturers, then POST if no name match
 *   2. GET /api/assessors, then POST if no name match
 *   3. POST /api/medical_device_assessments
 *   4. POST /api/medical_device_assessment_grades   (skipped when blocked)
 *   5. POST /api/medical_device_assessment_grade_rules, one per fired rule
 *   6. POST /api/medical_device_assessment_grade_flags, one per flag
 *
 * A blocked result (IVD, or missing device kind / intended purpose: empty
 * computed class) saves the assessment as status 'draft' and skips steps 4-6.
 * Otherwise a wizard status of 'draft' is saved as 'submitted'; reviewed and
 * urgent are kept as chosen.
 */
export async function submitAssessment(
  d: AssessmentData,
  result: GradingResult
): Promise<SaveOutcome> {
  const m = d.manufacturer;
  const a = d.assessor;
  const manufacturer = await findOrCreateByName(PATHS.manufacturers, {
    name: m.name.trim() || 'Unspecified manufacturer',
    email: orNull(m.email),
    phone: orNull(m.phone),
    postalAddressAsFullText: orNull(m.postalAddressAsFullText),
    countryAsIso31661Alpha2: orNull(m.countryAsIso31661Alpha2),
    postcode: orNull(m.postcode),
    singleRegistrationNumber: m.singleRegistrationNumber,
    authorizedRepresentativeName: m.authorizedRepresentativeName,
    unitedKingdomResponsiblePersonName: m.unitedKingdomResponsiblePersonName
  });
  const assessor = await findOrCreateByName(PATHS.assessors, {
    name: a.name.trim() || 'Unspecified assessor',
    email: orNull(a.email),
    phone: orNull(a.phone),
    role: a.role,
    organization: a.organization
  });

  const blocked = !result.computedDeviceClass;
  const status = blocked ? 'draft' : d.status === 'draft' || !d.status ? 'submitted' : d.status;
  const assessment = await request(
    'POST',
    PATHS.assessments,
    assessmentBody(d, manufacturer.id, assessor.id, status)
  );
  const out: SaveOutcome = {
    assessmentId: assessment.id,
    gradeId: null,
    blocked,
    rules: 0,
    flags: 0
  };
  if (blocked) return out;

  const grade = await request('POST', PATHS.grades, {
    medicalDeviceAssessmentId: assessment.id,
    computedDeviceClass: result.computedDeviceClass,
    finalDeviceClass: result.finalDeviceClass,
    classSuffix: result.classSuffix,
    overrideReason: clip(result.overrideReason, 500),
    conformityRoute: result.conformityRoute,
    determiningRule: clip(result.determiningRule, 20),
    regulatoryReadiness: result.regulatoryReadiness,
    assessorNotes: d.assessorNotes,
    signedAt: null,
    gradedAt: new Date().toISOString()
  });
  out.gradeId = grade.id;

  for (const r of result.firedRules) {
    await request('POST', PATHS.rules, {
      gradeId: grade.id,
      ruleId: clip(r.ruleId, 30),
      annexViiiRule: r.annexViiiRule,
      deviceClass: r.deviceClass,
      category: clip(r.category, 50),
      description: clip(r.description, 500)
    });
    out.rules++;
  }
  for (const f of result.additionalFlags) {
    await request('POST', PATHS.flags, {
      medicalDeviceAssessmentGradeId: grade.id,
      flagId: clip(f.flagId, 50),
      category: FLAG_CATEGORIES.includes(f.category) ? f.category : 'other',
      priority: f.priority,
      description: clip(f.description, 500),
      suggestedAction: clip(f.suggestedAction, 500)
    });
    out.flags++;
  }
  return out;
}
