// Declarative ward-round-note completeness rules.
//
// The ward round note is a documentation-and-completeness instrument, not a
// numeric score. A component is "documented" when its required field(s) hold a
// meaningful entry OR an explicit negative flag is set (e.g. "no changes",
// "none outstanding") — a deliberate negative is a valid clinical record. This
// module exposes:
//
//   componentPresence(data)   -> per-component `documented` booleans keyed by
//                                component name (spec §4)
//   requiredComponents(data)  -> the eight required components, each
//                                { id, component, category, label, description,
//                                  present }, for the completeness tally
//   recommendedComponents(d)  -> the two recommended components (do not affect
//                                the status, surfaced in documentedComponents[])
//
// The grader (`grader.js`) reads these to derive the completeness percentage and
// the complete / partial / incomplete status, and to build the fired-rule audit
// trail that mirrors `ward_round_note_grade_rule` (rule_id, component, category,
// description).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 *
 * @typedef {Object} RuleComponent
 * @property {string} id          - stable rule id, e.g. R-PLAN-DOCUMENTED-01
 * @property {string} component   - header | problems | ... | estimated-discharge
 * @property {string} category    - required-component | recommended-component
 * @property {string} label       - human-readable component name
 * @property {string} description
 * @property {boolean} present    - whether the component is documented
 */

// Wrapped in an IIFE; published via window.WardRoundNote.

/** A text/enum field is present when it is a non-blank string. */
function has(v) {
  return v !== null && v !== undefined && String(v).trim() !== '';
}

/**
 * Per-component `documented` predicates (spec §4).
 * @param {AssessmentData} data
 * @returns {{header: boolean, problems: boolean, examination: boolean,
 *            investigations: boolean, vte: boolean, medication: boolean,
 *            plan: boolean, escalation: boolean, overnightEvents: boolean,
 *            estimatedDischarge: boolean}}
 */
function componentPresence(data) {
  const h = data.header;
  const ex = data.examination;
  const inv = data.investigations;
  const med = data.medication;
  const esc = data.escalation;
  const ov = data.overnight;

  return {
    header: has(h.clinicianName) && has(h.clinicianGrade) && has(h.reviewedAt),
    problems: has(data.problems.problemList),
    examination: has(ex.examinationSummary) && ex.news2Total !== null,
    investigations:
      has(inv.investigationsReviewed) || inv.noInvestigationsOutstanding === 'yes',
    vte: has(data.vte.vteStatus),
    medication: has(med.medicationChanges) || med.noMedicationChanges === 'yes',
    plan: has(data.plan.planAndJobs),
    escalation:
      has(esc.escalationStatus) && esc.escalationStatus !== 'not-recorded',
    overnightEvents: has(ov.overnightEvents) || ov.noOvernightEvents === 'yes',
    estimatedDischarge:
      has(esc.estimatedDischargeDate) || esc.dischargeNotEstimable === 'yes'
  };
}

/**
 * The eight required components for the completeness percentage (spec §4).
 * @param {AssessmentData} data
 * @returns {RuleComponent[]}
 */
function requiredComponents(data) {
  const p = componentPresence(data);
  return [
    {
      id: 'R-HEADER-DOCUMENTED-01',
      component: 'header',
      category: 'required-component',
      label: 'Review header',
      description: 'Header: clinician name, grade, and date/time of review recorded',
      present: p.header
    },
    {
      id: 'R-PROBLEMS-DOCUMENTED-01',
      component: 'problems',
      category: 'required-component',
      label: 'Problems and progress',
      description: 'Problems: the current problem list and progress recorded',
      present: p.problems
    },
    {
      id: 'R-EXAMINATION-DOCUMENTED-01',
      component: 'examination',
      category: 'required-component',
      label: 'Examination and NEWS2',
      description: 'Examination: examination summary recorded with a NEWS2 total',
      present: p.examination
    },
    {
      id: 'R-INVESTIGATIONS-DOCUMENTED-01',
      component: 'investigations',
      category: 'required-component',
      label: 'Investigations reviewed',
      description: 'Investigations: results reviewed, or "none outstanding" recorded',
      present: p.investigations
    },
    {
      id: 'R-VTE-DOCUMENTED-01',
      component: 'vte',
      category: 'required-component',
      label: 'VTE assessment',
      description: 'VTE: assessment status recorded (assessed, not required, or not done)',
      present: p.vte
    },
    {
      id: 'R-MEDICATION-DOCUMENTED-01',
      component: 'medication',
      category: 'required-component',
      label: 'Medication changes',
      description: 'Medication: changes recorded, or "no changes" recorded',
      present: p.medication
    },
    {
      id: 'R-PLAN-DOCUMENTED-01',
      component: 'plan',
      category: 'required-component',
      label: 'Plan and jobs',
      description: 'Plan: at least one plan item or job for the day recorded',
      present: p.plan
    },
    {
      id: 'R-ESCALATION-DOCUMENTED-01',
      component: 'escalation',
      category: 'required-component',
      label: 'Escalation status',
      description: 'Escalation: a ceiling-of-care / escalation status recorded',
      present: p.escalation
    }
  ];
}

/**
 * The two recommended components (spec §4). They do not affect the status but
 * are surfaced in `documentedComponents[]`.
 * @param {AssessmentData} data
 * @returns {RuleComponent[]}
 */
function recommendedComponents(data) {
  const p = componentPresence(data);
  return [
    {
      id: 'R-OVERNIGHT-DOCUMENTED-01',
      component: 'overnight-events',
      category: 'recommended-component',
      label: 'Overnight events',
      description: 'Overnight: events recorded, or "no events overnight" recorded',
      present: p.overnightEvents
    },
    {
      id: 'R-DISCHARGE-DOCUMENTED-01',
      component: 'estimated-discharge',
      category: 'recommended-component',
      label: 'Estimated discharge',
      description: 'Discharge: an estimated discharge date, or "not yet estimable" recorded',
      present: p.estimatedDischarge
    }
  ];
}

export { has, componentPresence, requiredComponents, recommendedComponents };
