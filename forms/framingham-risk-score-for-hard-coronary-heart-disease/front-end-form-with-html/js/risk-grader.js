// Framingham Risk Score — risk grader.
//
// Vanilla-JS port of `src/lib/engine/risk-grader.ts`. Pure function:
// computes the 10-year hard-CHD risk percentage, fires every rule whose
// predicate evaluates true, and assigns a low/intermediate/high category.
// Returns 'draft' when age and sex are both missing.
(function () {
  'use strict';

  const NS = window.FraminghamRiskScore;
  const { isLikelyDraft, calculateFraminghamRisk, allRules } = NS;

  /**
   * @param {object} data Full assessment data.
   * @returns {{ riskCategory: string, tenYearRiskPercent: number,
   *             firedRules: Array<{id:string,category:string,description:string,riskLevel:string}> }}
   */
  function calculateRisk(data) {
    if (isLikelyDraft(data)) {
      return { riskCategory: 'draft', tenYearRiskPercent: 0, firedRules: [] };
    }

    const rawRisk = calculateFraminghamRisk(data);
    // Round to 1 decimal place (matches Svelte engine behaviour).
    const tenYearRiskPercent = Math.round(rawRisk * 10) / 10;

    const firedRules = [];
    for (const rule of allRules()) {
      if (rule.evaluate(data, tenYearRiskPercent)) {
        firedRules.push({
          id: rule.id,
          category: rule.category,
          description: rule.description,
          riskLevel: rule.riskLevel
        });
      }
    }

    let riskCategory;
    if (tenYearRiskPercent < 10.0) riskCategory = 'low';
    else if (tenYearRiskPercent < 20.0) riskCategory = 'intermediate';
    else riskCategory = 'high';

    return { riskCategory, tenYearRiskPercent, firedRules };
  }

  Object.assign(window.FraminghamRiskScore, {
    calculateRisk
  });
})();
