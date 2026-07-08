// Genetics Assessment grader. Pure functions: take an `AssessmentData`
// object, compute the Manchester score, count Bethesda criteria met,
// extract PREMM5 and Tyrer-Cuzick external scores, build a grader context,
// run every rule from `rules.js`, and resolve the final risk level
// as the maximum severity of any fired rule.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').RiskLevel} RiskLevel
 * @typedef {import('./types.js').FiredRule} FiredRule
 * @typedef {import('./types.js').Relative} Relative
 * @typedef {import('./rules.js').GraderContext} GraderContext
 */

(function () {
'use strict';
window.GeneticsAssessment = window.GeneticsAssessment || {};
const { rules, maxRiskLevel } = window.GeneticsAssessment;

// Manchester scoring weights (Evans 2004 / Evans & Lalloo). Per-cancer
// points; the breast male/female rows differ between proband and relatives
// because the published table is symmetric — the points apply to the
// individual diagnosed.

const MAN_WEIGHTS = {
  // Female breast cancer by age band
  femaleBreastUnder30: 6,
  femaleBreast30to39: 4,
  femaleBreast40to49: 3,
  // Male breast cancer (any age)
  maleBreast: 8,
  // Ovarian cancer < 60
  ovarianUnder60: 8,
  // Pancreatic cancer < 60
  pancreaticUnder60: 1,
  // Prostate cancer < 60
  prostateUnder60: 1
};

/**
 * @param {number | null} n
 * @returns {number}
 */
function nz(n) {
  return (n === null || n === undefined || isNaN(n)) ? 0 : Number(n);
}

/**
 * Compute the Manchester score for BRCA1/2 from per-cancer counts.
 * @param {AssessmentData} d
 * @returns {number}
 */
function calculateManchesterScore(d) {
  const m = d.targetedRiskScoring.manchester;
  let score = 0;
  // Proband contributions
  score += nz(m.probandFemaleBreastUnder30) * MAN_WEIGHTS.femaleBreastUnder30;
  score += nz(m.probandFemaleBreast30to39)  * MAN_WEIGHTS.femaleBreast30to39;
  score += nz(m.probandFemaleBreast40to49)  * MAN_WEIGHTS.femaleBreast40to49;
  score += nz(m.probandOvarianUnder60)      * MAN_WEIGHTS.ovarianUnder60;
  score += nz(m.probandMaleBreast)          * MAN_WEIGHTS.maleBreast;
  // Relative contributions
  score += nz(m.relativeFemaleBreastUnder30) * MAN_WEIGHTS.femaleBreastUnder30;
  score += nz(m.relativeFemaleBreast30to39)  * MAN_WEIGHTS.femaleBreast30to39;
  score += nz(m.relativeFemaleBreast40to49)  * MAN_WEIGHTS.femaleBreast40to49;
  score += nz(m.relativeOvarianUnder60)      * MAN_WEIGHTS.ovarianUnder60;
  score += nz(m.relativeMaleBreast)          * MAN_WEIGHTS.maleBreast;
  score += nz(m.relativePancreaticUnder60)   * MAN_WEIGHTS.pancreaticUnder60;
  score += nz(m.relativeProstateUnder60)     * MAN_WEIGHTS.prostateUnder60;
  return score;
}

/**
 * Count how many of the five Revised Bethesda criteria the patient meets.
 * @param {AssessmentData} d
 * @returns {number}
 */
function countBethesdaMet(d) {
  const b = d.targetedRiskScoring.bethesda;
  let n = 0;
  if (b.crcUnder50 === 'yes') n++;
  if (b.synchronousMetachronous === 'yes') n++;
  if (b.msiHistology === 'yes') n++;
  if (b.firstDegreeLynchTumour === 'yes') n++;
  if (b.multipleRelativesLynch === 'yes') n++;
  return n;
}

/**
 * Iterate every relative in the pedigree (grandparents, parents,
 * aunts/uncles, siblings, children, cousins).
 * @param {AssessmentData} d
 * @returns {Relative[]}
 */
function flattenPedigree(d) {
  const fp = d.familyPedigree;
  const fixed = [
    fp.maternalGrandmother, fp.maternalGrandfather,
    fp.paternalGrandmother, fp.paternalGrandfather,
    fp.mother, fp.father
  ];
  return fixed.concat(
    fp.maternalAuntsUncles || [],
    fp.paternalAuntsUncles || [],
    fp.siblings || [],
    fp.children || [],
    fp.maternalCousins || [],
    fp.paternalCousins || []
  );
}

/**
 * Build the context object that rules consume.
 * @param {AssessmentData} d
 * @returns {GraderContext}
 */
function buildContext(d) {
  const manchesterScore = calculateManchesterScore(d);
  const bethesdaMet = countBethesdaMet(d);
  const premm5Raw = d.targetedRiskScoring.premm5.externalPREMM5Percent;
  const premm5Score = (premm5Raw === null || premm5Raw === undefined) ? null : Number(premm5Raw);
  const tcRaw = d.targetedRiskScoring.tyrerCuzick.externalLifetimeRisk;
  const tyrerCuzickLifetime = (tcRaw === null || tcRaw === undefined) ? 0 : Number(tcRaw);

  const all = flattenPedigree(d);
  let affectedFirstDegree = 0;
  let earlyOnsetUnder50 = 0;
  let paediatricCancers = 0;
  let hasMaleBreast = false;
  let hasOvarian = false;
  let hasPancreatic = false;

  // First-degree relatives (parents, siblings, children).
  const fp = d.familyPedigree;
  const firstDegree = [fp.mother, fp.father]
    .concat(fp.siblings || [])
    .concat(fp.children || []);

  for (const r of firstDegree) {
    if (r.affectedWithCancer === 'yes' && (r.cancers || []).length > 0) {
      affectedFirstDegree++;
    }
  }

  for (const r of all) {
    for (const c of (r.cancers || [])) {
      const type = (c.type || '').toLowerCase();
      const age = c.ageAtDiagnosis;
      if (age !== null && age !== undefined && Number.isFinite(Number(age))) {
        if (Number(age) <= 50) earlyOnsetUnder50++;
        if (Number(age) < 18) paediatricCancers++;
      }
      if (type.includes('male breast') || (type.includes('breast') && r.sex === 'male')) {
        hasMaleBreast = true;
      }
      if (type.includes('ovar')) hasOvarian = true;
      if (type.includes('pancrea')) hasPancreatic = true;
    }
  }

  // Proband history
  const probandCancers = d.personalMedicalHistory.cancers || [];
  let hasBilateralBreast = false;
  for (const c of probandCancers) {
    const type = (c.type || '').toLowerCase();
    const age = c.ageAtDiagnosis;
    if (type.includes('breast') && c.bilateral === 'yes') hasBilateralBreast = true;
    if (age !== null && age !== undefined && Number.isFinite(Number(age))) {
      if (Number(age) <= 50) earlyOnsetUnder50++;
      if (Number(age) < 18) paediatricCancers++;
    }
    if (type.includes('ovar')) hasOvarian = true;
    if (type.includes('pancrea')) hasPancreatic = true;
  }
  const hasMultiplePrimaries = d.personalMedicalHistory.multiplePrimaryCancers === 'yes';

  return {
    manchesterScore,
    bethesdaMet,
    premm5Score,
    tyrerCuzickLifetime,
    affectedFirstDegree,
    earlyOnsetUnder50,
    paediatricCancers,
    hasMaleBreast,
    hasOvarian,
    hasPancreatic,
    hasBilateralBreast,
    hasMultiplePrimaries
  };
}

/**
 * Run every rule and return the fired rules + final risk level.
 * @param {AssessmentData} data
 * @returns {{
 *   riskLevel: RiskLevel,
 *   manchesterScore: number,
 *   bethesdaMet: number,
 *   premm5Score: number | null,
 *   tyrerCuzickLifetime: number,
 *   firedRules: FiredRule[]
 * }}
 */
function gradeGenetics(data) {
  const ctx = buildContext(data);
  /** @type {FiredRule[]} */
  const firedRules = [];
  /** @type {RiskLevel} */
  let level = 'low';

  for (const rule of rules) {
    try {
      const severity = rule.evaluate(data, ctx);
      if (severity === 'low' || severity === 'moderate' || severity === 'high') {
        firedRules.push({
          id: rule.id,
          category: rule.category,
          description: rule.description,
          severity
        });
        level = maxRiskLevel(level, severity);
      }
    } catch (e) {
      console.warn(`Genetics rule ${rule.id} evaluation failed:`, e);
    }
  }

  // If no rules fired, the level remains 'low'.
  return {
    riskLevel: level,
    manchesterScore: ctx.manchesterScore,
    bethesdaMet: ctx.bethesdaMet,
    premm5Score: ctx.premm5Score,
    tyrerCuzickLifetime: ctx.tyrerCuzickLifetime,
    firedRules
  };
}

Object.assign(window.GeneticsAssessment, {
  calculateManchesterScore,
  countBethesdaMet,
  buildContext,
  gradeGenetics
});
})();
