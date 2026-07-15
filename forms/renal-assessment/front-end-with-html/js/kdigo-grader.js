import { kdigoCompositeRisk, kdigoRules, resolveAlbuminuriaCategory, resolveEgfr, resolveGfrCategory } from './kdigo-rules.js';

// KDIGO grader. Pure functions: take an AssessmentData object, return the
// resolved GFR category (G1-G5), albuminuria category (A1-A3), composite
// risk level (low / moderate / high / very-high), the underlying numeric
// eGFR and ACR values, and the per-rule audit trail.
//
// Risk heatmap (KDIGO 2012/2024):
//
//                A1 (<3)   A2 (3-30)  A3 (>30)
//   G1 (>=90)    Low       Moderate   High
//   G2 (60-89)   Low       Moderate   High
//   G3a (45-59)  Moderate  High       Very High
//   G3b (30-44)  High      Very High  Very High
//   G4 (15-29)   Very High Very High  Very High
//   G5 (<15)     Very High Very High  Very High

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FiredRule} FiredRule
 * @typedef {import('./types.js').GfrCategory} GfrCategory
 * @typedef {import('./types.js').AlbuminuriaCategory} AlbuminuriaCategory
 * @typedef {import('./types.js').RiskLevel} RiskLevel
 */

/**
 * Run the KDIGO classification against the supplied assessment data and
 * produce the resolved categories, composite risk, and per-rule audit trail.
 *
 * @param {AssessmentData} data
 * @returns {{
 *   gfrCategory: GfrCategory,
 *   albuminuriaCategory: AlbuminuriaCategory,
 *   riskLevel: RiskLevel,
 *   egfr: number | null,
 *   acr: number | null,
 *   firedRules: FiredRule[]
 * }}
 */
function calculateKdigo(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  for (const rule of kdigoRules) {
    try {
      const value = rule.evaluate(data);
      if (value) {
        firedRules.push({
          id: rule.id,
          category: rule.category,
          description: rule.description,
          value
        });
      }
    } catch (e) {
      console.warn(`KDIGO rule ${rule.id} evaluation failed:`, e);
    }
  }

  const gfrCategory = resolveGfrCategory(data) || '';
  const albuminuriaCategory = resolveAlbuminuriaCategory(data) || '';
  const riskLevel = kdigoCompositeRisk(gfrCategory, albuminuriaCategory);
  const egfr = resolveEgfr(data);
  const acr = typeof data.urineTests.acr === 'number' ? data.urineTests.acr : null;

  return { gfrCategory, albuminuriaCategory, riskLevel, egfr, acr, firedRules };
}

export { calculateKdigo };
