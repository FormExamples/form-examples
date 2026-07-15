import { albuminuriaCategoryLabel, calculateAge, classifyAlbuminuriaCategory, classifyGfrCategory, estimateEgfrCkdEpi2021, gfrCategoryLabel } from './types.js';

// KDIGO CKD classification rules.
//
// Each rule produces a single named contribution to the report's audit
// trail. Together they describe how the GFR category, albuminuria category,
// and composite risk level were derived from the underlying eGFR and ACR
// values entered (or computed from creatinine).
//
// KDIGO-001: GFR category derived from eGFR (mL/min/1.73 m^2)
// KDIGO-002: Albuminuria category derived from ACR (mg/mmol)
// KDIGO-003: Composite KDIGO risk (G x A heatmap)

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 *
 * @typedef {Object} KdigoRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {(d: AssessmentData) => string} evaluate
 */

/**
 * Resolve the eGFR used for staging: prefer an explicitly entered eGFR;
 * otherwise estimate from creatinine + age + sex via CKD-EPI 2021.
 * @param {AssessmentData} d
 * @returns {number | null}
 */
function resolveEgfr(d) {
  if (typeof d.bloodTests.egfr === 'number' && d.bloodTests.egfr > 0) {
    return d.bloodTests.egfr;
  }
  const age = d.demographics.age ?? calculateAge(d.demographics.dateOfBirth);
  return estimateEgfrCkdEpi2021(d.bloodTests.serumCreatinine, age, d.demographics.sex);
}

/**
 * Resolve the GFR category used for staging: prefer the clinician-entered
 * value if present; otherwise derive from the resolved eGFR.
 */
function resolveGfrCategory(d) {
  if (d.clinicalImpression.gfrCategory) return d.clinicalImpression.gfrCategory;
  return classifyGfrCategory(resolveEgfr(d));
}

/**
 * Resolve the albuminuria category used for staging: prefer the clinician-
 * entered value; otherwise derive from urine ACR.
 */
function resolveAlbuminuriaCategory(d) {
  if (d.clinicalImpression.albuminuriaCategory) {
    return d.clinicalImpression.albuminuriaCategory;
  }
  return classifyAlbuminuriaCategory(d.urineTests.acr);
}

/**
 * KDIGO heatmap: composite risk by (GFR, Albuminuria) category. Values are
 * 'low' | 'moderate' | 'high' | 'very-high'. Returns 'unknown' when either
 * input is missing.
 * @param {string} g
 * @param {string} a
 * @returns {'low' | 'moderate' | 'high' | 'very-high' | 'unknown'}
 */
function kdigoCompositeRisk(g, a) {
  if (!g || !a) return 'unknown';
  /** @type {Record<string, Record<string, string>>} */
  const heatmap = {
    G1:  { A1: 'low',       A2: 'moderate',  A3: 'high' },
    G2:  { A1: 'low',       A2: 'moderate',  A3: 'high' },
    G3a: { A1: 'moderate',  A2: 'high',      A3: 'very-high' },
    G3b: { A1: 'high',      A2: 'very-high', A3: 'very-high' },
    G4:  { A1: 'very-high', A2: 'very-high', A3: 'very-high' },
    G5:  { A1: 'very-high', A2: 'very-high', A3: 'very-high' }
  };
  return heatmap[g]?.[a] || 'unknown';
}

function riskLevelLabel(risk) {
  switch (risk) {
    case 'low': return 'Low risk';
    case 'moderate': return 'Moderately increased risk';
    case 'high': return 'High risk';
    case 'very-high': return 'Very high risk';
    default: return 'Insufficient data';
  }
}

function riskLevelClass(risk) {
  switch (risk) {
    case 'low': return 'risk-low';
    case 'moderate': return 'risk-moderate';
    case 'high': return 'risk-high';
    case 'very-high': return 'risk-very-high';
    default: return 'risk-unknown';
  }
}

/** @type {KdigoRule[]} */
const kdigoRules = [
  {
    id: 'KDIGO-001',
    category: 'GFR Category',
    description: 'GFR stage derived from eGFR (mL/min/1.73 m^2).',
    evaluate: (d) => {
      const g = resolveGfrCategory(d);
      if (!g) return '';
      return gfrCategoryLabel(g);
    }
  },
  {
    id: 'KDIGO-002',
    category: 'Albuminuria Category',
    description: 'Albuminuria stage derived from urine ACR (mg/mmol).',
    evaluate: (d) => {
      const a = resolveAlbuminuriaCategory(d);
      if (!a) return '';
      return albuminuriaCategoryLabel(a);
    }
  },
  {
    id: 'KDIGO-003',
    category: 'Composite Risk',
    description: 'KDIGO composite risk from GFR x Albuminuria heatmap.',
    evaluate: (d) => {
      const g = resolveGfrCategory(d);
      const a = resolveAlbuminuriaCategory(d);
      const risk = kdigoCompositeRisk(g, a);
      return riskLevelLabel(risk);
    }
  }
];

export { kdigoRules, resolveEgfr, resolveGfrCategory, resolveAlbuminuriaCategory, kdigoCompositeRisk, riskLevelLabel, riskLevelClass };
