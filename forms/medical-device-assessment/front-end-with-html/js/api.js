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
// Base URL, highest priority first: the `?api=` query parameter,
// `window.__API_BASE__`, then http://localhost:5150. When a fetch fails or
// the list is empty the dashboard falls back to the sample data in data.js.

const DEFAULT_API_BASE = 'http://localhost:5150';

/** Resolve the API base URL (no trailing slash). */
function resolveApiBase() {
  let base = DEFAULT_API_BASE;
  try {
    const q = new URLSearchParams(window.location.search).get('api');
    if (q) base = q;
    else if (typeof window.__API_BASE__ === 'string' && window.__API_BASE__) base = window.__API_BASE__;
  } catch (e) {
    // No window (should not happen in a browser); keep the default.
  }
  return base.replace(/\/+$/, '');
}

const API_BASE = resolveApiBase();

const PATHS = {
  manufacturers: '/api/manufacturers',
  assessors: '/api/assessors',
  assessments: '/api/medical_device_assessments',
  grades: '/api/medical_device_assessment_grades',
  rules: '/api/medical_device_assessment_grade_rules',
  flags: '/api/medical_device_assessment_grade_flags'
};

async function request(method, path, body) {
  const init = { method, headers: { Accept: 'application/json' } };
  if (body !== undefined) {
    init.headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(body);
  }
  const res = await fetch(`${API_BASE}${path}`, init);
  if (!res.ok) {
    throw new Error(`${method} ${path} failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

/** GET a collection; returns the live (not soft-deleted) rows. */
async function list(path) {
  const data = await request('GET', path);
  const items = Array.isArray(data) ? data : data && Array.isArray(data.items) ? data.items : [];
  return items.filter((r) => r && !r.deletedAt);
}

// ----------------------------------------------------------------------
// Dashboard: client-side join into AssessmentRow
// ----------------------------------------------------------------------

/**
 * Fetch assessments, grades and flags and join them into dashboard rows.
 * Rejects on any network or non-2xx response so the caller can fall back to
 * sample data. Manufacturers and assessors are fetched too (the join keeps
 * the device row working even if a party row is missing).
 *
 * @returns {Promise<import('./dashboard-types.js').AssessmentRow[]>}
 */
async function fetchAssessments() {
  const [assessments, , , grades, flags] = await Promise.all([
    list(PATHS.assessments),
    list(PATHS.manufacturers),
    list(PATHS.assessors),
    list(PATHS.grades),
    list(PATHS.flags)
  ]);
  const gradeByAssessment = new Map(grades.map((g) => [g.medicalDeviceAssessmentId, g]));
  const flagsByGrade = new Map();
  for (const f of flags) {
    const k = f.medicalDeviceAssessmentGradeId;
    if (!flagsByGrade.has(k)) flagsByGrade.set(k, []);
    flagsByGrade.get(k).push(f.flagId);
  }
  return assessments.map((a) => {
    const g = gradeByAssessment.get(a.id);
    return {
      id: a.id,
      date: a.assessmentDate || String(a.createdAt || '').slice(0, 10),
      device: a.deviceName || 'Unnamed device',
      deviceKind: a.deviceKind || '',
      computedClass: g ? g.computedDeviceClass : '',
      finalClass: g ? g.finalDeviceClass : '',
      classSuffix: g ? g.classSuffix : '',
      conformityRoute: g ? g.conformityRoute : '',
      determiningRule: g ? g.determiningRule : '',
      // An assessment saved without a grade (blocked / draft) has no readiness.
      readiness: g && g.regulatoryReadiness ? g.regulatoryReadiness : 'blocked',
      flags: g ? flagsByGrade.get(g.id) || [] : [],
      summary: a.intendedPurpose || ''
    };
  });
}

// ----------------------------------------------------------------------
// Wizard: submit as find-or-create parties + assessment + grade + rules + flags
// ----------------------------------------------------------------------

const FLAG_CATEGORIES = [
  'missing-intended-purpose', 'clinical-evidence-gap', 'risk-management-gap', 'quality-system-gap',
  'cybersecurity-gap', 'post-market-surveillance-gap', 'udi-gap', 'notified-body-required',
  'software-as-medical-device', 'medicinal-substance-combination', 'tissue-origin', 'nanomaterial',
  'in-vitro-diagnostic-out-of-scope', 'class-override', 'other', ''
];

const clip = (s, n) => String(s ?? '').slice(0, n);
const orNull = (s) => (s === '' || s === undefined ? null : s);
const norm = (s) => String(s ?? '').trim().toLowerCase();

/** Find a live row by case-insensitive name, else POST a new one. */
async function findOrCreateByName(path, body) {
  const wanted = norm(body.name);
  const existing = (await list(path)).find((r) => norm(r.name) === wanted);
  if (existing) return existing;
  return request('POST', path, body);
}

/**
 * Map the wizard state to a medical_device_assessment POST body. Every enum
 * and text column is sent (the API treats them as required); unanswered
 * enums are '' which the SQL CHECKs allow.
 */
function assessmentBody(state, manufacturerId, assessorId, status) {
  const s = state;
  return {
    manufacturerId,
    assessorId,
    status,
    assessmentDate: s.assessmentDate || null,
    deviceName: clip(s.deviceName, 255),
    modelOrCatalogueNumber: clip(s.modelOrCatalogueNumber, 100),
    uniqueDeviceIdentifier: clip(s.uniqueDeviceIdentifier, 255),
    intendedPurpose: s.intendedPurpose ?? '',
    intendedUser: s.intendedUser ?? '',
    targetJurisdiction: s.targetJurisdiction ?? '',
    isInVitroDiagnostic: s.isInVitroDiagnostic ?? '',
    deviceKind: s.deviceKind ?? '',
    contactDuration: s.contactDuration ?? '',
    bodySite: s.bodySite ?? '',
    channelsOrStoresBodySubstances: s.channelsOrStoresBodySubstances ?? '',
    connectedToActiveDeviceClassIiaOrHigher: s.connectedToActiveDeviceClassIiaOrHigher ?? '',
    reusableSurgicalInstrument: s.reusableSurgicalInstrument ?? '',
    activeTherapeutic: s.activeTherapeutic ?? '',
    activeDiagnostic: s.activeDiagnostic ?? '',
    administersOrExchangesEnergy: s.administersOrExchangesEnergy ?? '',
    energyPotentiallyHazardous: s.energyPotentiallyHazardous ?? '',
    administersOrRemovesMedicinalSubstances: s.administersOrRemovesMedicinalSubstances ?? '',
    administrationPotentiallyHazardous: s.administrationPotentiallyHazardous ?? '',
    monitorsVitalPhysiologicalParameters: s.monitorsVitalPhysiologicalParameters ?? '',
    closedLoopTherapy: s.closedLoopTherapy ?? '',
    softwarePurpose: s.softwarePurpose ?? '',
    softwareWorstCaseHarm: s.softwareWorstCaseHarm ?? '',
    containsMedicinalSubstance: s.containsMedicinalSubstance ?? '',
    containsHumanOrAnimalTissue: s.containsHumanOrAnimalTissue ?? '',
    containsNanomaterialWithHighExposurePotential: s.containsNanomaterialWithHighExposurePotential ?? '',
    composedOfAbsorbedSubstances: s.composedOfAbsorbedSubstances ?? '',
    contraceptionOrStiPrevention: s.contraceptionOrStiPrevention ?? '',
    disinfectsOrCleansDevices: s.disinfectsOrCleansDevices ?? '',
    suppliedSterile: s.suppliedSterile ?? '',
    hasMeasuringFunction: s.hasMeasuringFunction ?? '',
    clinicalEvidenceStatus: s.clinicalEvidenceStatus ?? '',
    riskManagementFileIso14971: s.riskManagementFileIso14971 ?? '',
    qualityManagementSystemIso13485: s.qualityManagementSystemIso13485 ?? '',
    cybersecurityAssessmentDone: s.cybersecurityAssessmentDone ?? '',
    postMarketSurveillancePlan: s.postMarketSurveillancePlan ?? '',
    uniqueDeviceIdentifierAssigned: s.uniqueDeviceIdentifierAssigned ?? '',
    assessorNotes: s.assessorNotes ?? ''
  };
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
 *
 * @param {Record<string, any>} state  wizard state
 * @param {Record<string, any>} result gradeDevice(state) output
 * @returns {Promise<{assessmentId: string, gradeId: string|null, blocked: boolean, rules: number, flags: number}>}
 */
async function submitAssessment(state, result) {
  const m = state.manufacturer || {};
  const a = state.assessor || {};
  const manufacturer = await findOrCreateByName(PATHS.manufacturers, {
    name: m.name?.trim() || 'Unspecified manufacturer',
    email: orNull(m.email),
    phone: orNull(m.phone),
    postalAddressAsFullText: orNull(m.postalAddressAsFullText),
    countryAsIso31661Alpha2: orNull(m.countryAsIso31661Alpha2),
    postcode: orNull(m.postcode),
    singleRegistrationNumber: m.singleRegistrationNumber ?? '',
    authorizedRepresentativeName: m.authorizedRepresentativeName ?? '',
    unitedKingdomResponsiblePersonName: m.unitedKingdomResponsiblePersonName ?? ''
  });
  const assessor = await findOrCreateByName(PATHS.assessors, {
    name: a.name?.trim() || 'Unspecified assessor',
    email: orNull(a.email),
    phone: orNull(a.phone),
    role: a.role ?? '',
    organization: a.organization ?? ''
  });

  const blocked = !result.computedDeviceClass;
  const status = blocked ? 'draft' : state.status === 'draft' || !state.status ? 'submitted' : state.status;
  const assessment = await request(
    'POST',
    PATHS.assessments,
    assessmentBody(state, manufacturer.id, assessor.id, status)
  );
  const out = { assessmentId: assessment.id, gradeId: null, blocked, rules: 0, flags: 0 };
  if (blocked) return out;

  const grade = await request('POST', PATHS.grades, {
    medicalDeviceAssessmentId: assessment.id,
    computedDeviceClass: result.computedDeviceClass,
    finalDeviceClass: result.finalDeviceClass,
    classSuffix: result.classSuffix ?? '',
    overrideReason: clip(result.overrideReason, 500),
    conformityRoute: result.conformityRoute,
    determiningRule: clip(result.determiningRule, 20),
    regulatoryReadiness: result.regulatoryReadiness,
    assessorNotes: state.assessorNotes ?? '',
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

export { fetchAssessments, submitAssessment, API_BASE };
