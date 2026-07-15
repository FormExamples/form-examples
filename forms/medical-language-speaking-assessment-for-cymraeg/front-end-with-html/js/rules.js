import { CRITERIA } from './types.js';

// Declarative criterion registry for the clinical Welsh-language
// (Cymraeg) speaking assessment.
//
// This file re-exposes the canonical criterion list from `types.js` and
// adds anchor-text descriptions per rating point. The grader iterates the
// registry to produce the per-criterion audit trail; the wizard consumes
// the same data to render the radio scales.
//
// Linguistic criteria   - 0..6  (7 anchor points)  — mapped to CEFR A1..C2
// Clinical indicators   - 0..3  (4 anchor points)

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').LinguisticRating} LinguisticRating
 * @typedef {import('./types.js').ClinicalIndicators} ClinicalIndicators
 */

// ----------------------------------------------------------------------
// Anchor descriptors per rating point
// ----------------------------------------------------------------------

/** 0..6 anchors used by all four linguistic criteria. Mapped to CEFR. */
const LINGUISTIC_ANCHORS = [
  { value: 0, label: '0', description: 'Performance falls short of the lowest descriptor; communication in Welsh not achieved.' },
  { value: 1, label: '1', description: 'Limited control (CEFR A1/A2); communication in Welsh frequently breaks down.' },
  { value: 2, label: '2', description: 'Modest control (CEFR B1); communication in Welsh is achieved with effort.' },
  { value: 3, label: '3', description: 'Acceptable control (CEFR B2); communication in Welsh is generally maintained.' },
  { value: 4, label: '4', description: 'Good control (CEFR B2+/C1); the candidate communicates effectively in Welsh.' },
  { value: 5, label: '5', description: 'Very good control (CEFR C1); minor lapses do not impede Welsh-language communication.' },
  { value: 6, label: '6', description: 'Excellent control (CEFR C2); performance approaches that of a fluent Welsh speaker.' }
];

/** 0..3 anchors used by all five clinical communication indicators. */
const CLINICAL_ANCHORS = [
  { value: 0, label: '0', description: 'Indicator not demonstrated; behaviour absent or counter-productive.' },
  { value: 1, label: '1', description: 'Partially demonstrated; key elements are missing or under-developed.' },
  { value: 2, label: '2', description: 'Demonstrated to a satisfactory standard; minor gaps remain.' },
  { value: 3, label: '3', description: 'Demonstrated to a high standard; behaviour is consistent and effective.' }
];

/**
 * Build the registry consumed by the wizard, the grader, and the report.
 * Each entry combines the canonical criterion metadata with its 0..N
 * anchor descriptors.
 */
const criterionRegistry = CRITERIA.map((c) => ({
  ...c,
  anchors: c.domain === 'linguistic' ? LINGUISTIC_ANCHORS : CLINICAL_ANCHORS
}));

/** Look up a single criterion by id. */
function findCriterion(id) {
  return criterionRegistry.find((c) => c.id === id) || null;
}

/** Linguistic criteria only (4 entries, each 0..6). */
function linguisticCriteria() {
  return criterionRegistry.filter((c) => c.domain === 'linguistic');
}

/** Clinical communication indicators only (5 entries, each 0..3). */
function clinicalCriteria() {
  return criterionRegistry.filter((c) => c.domain === 'clinical');
}

export { LINGUISTIC_ANCHORS, CLINICAL_ANCHORS, criterionRegistry, findCriterion, linguisticCriteria, clinicalCriteria };
