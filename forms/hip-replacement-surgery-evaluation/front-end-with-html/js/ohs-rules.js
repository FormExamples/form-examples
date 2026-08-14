// Oxford Hip Score (OHS) rules for the Hip Replacement Surgery Evaluation
// engine.
//
// The OHS is the validated 12-item patient-reported outcome measure for hip
// osteoarthritis (Dawson et al., J Bone Joint Surg Br 1996). Each item is
// scored 0 (worst) to 4 (best); the total is 0-48. The four-band split below
// is this form's operational convention -- see ../../doc/ohs-scoring.md and
// ../../spec/index.md section 3.
//
// This module also holds the small pure-utility helpers (round1, num, rule,
// ageInYears, calculateBmi, titleCase) shared by flagged-issues.js and
// composite-grader.js, mirroring src/lib/engine/utils.ts on the Svelte side.
//
// Every function here is pure: same inputs, same outputs, no I/O, no clock.

/** Round to one decimal place, the precision the SQL schema stores. */
function round1(n) {
  return Math.round(n * 10) / 10;
}

/** Coerce a possibly-empty numeric field to a number or null. */
function num(v) {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/** Build a fired-rule record in the shape the grade table's audit trail stores. */
function rule(ruleId, instrument, component, score, band, category, description) {
  return { ruleId, instrument, component, score, band, category, description };
}

/**
 * Age in whole years at the assessment date, or null when either date is
 * unknown. The assessment date is passed in rather than read from the clock
 * so the engine stays pure.
 */
function ageInYears(birthDate, assessmentDate) {
  if (!birthDate) return null;
  const born = new Date(birthDate);
  const at = assessmentDate ? new Date(assessmentDate) : null;
  if (Number.isNaN(born.getTime()) || !at || Number.isNaN(at.getTime())) return null;
  let age = at.getFullYear() - born.getFullYear();
  const m = at.getMonth() - born.getMonth();
  if (m < 0 || (m === 0 && at.getDate() < born.getDate())) age -= 1;
  return age;
}

/** Body mass index in kg/m^2, or null when height or weight is unknown. */
function calculateBmi(heightAsCm, weightAsKg) {
  const h = num(heightAsCm);
  const w = num(weightAsKg);
  if (!h || !w || h <= 0) return null;
  const heightAsM = h / 100;
  return round1(w / (heightAsM * heightAsM));
}

/** Title-case a kebab-case value for display. */
function titleCase(s) {
  return String(s || '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const OHS_ITEM_KEYS = [
  'painSeverity',
  'washingAndDrying',
  'transport',
  'dressingSocks',
  'shopping',
  'walkingPain',
  'limping',
  'kneeling',
  'nightPain',
  'workInterference',
  'givingWay',
  'stairs'
];

/** Derive the OHS category from the total, per this form's four-band convention. */
function ohsCategoryFromTotal(total) {
  if (total <= 19) return 'severe';
  if (total <= 29) return 'moderate';
  if (total <= 39) return 'mild-to-moderate';
  return 'satisfactory';
}

/**
 * Score the 12-item Oxford Hip Score. Unanswered items are treated as 0 in
 * the sum (the wizard requires all 12 before completion; the engine stays
 * defensive so partial data still produces a deterministic result).
 *
 * @param {object} data - the evaluation data model from emptyEvaluation()
 * @returns {{ total:number, itemsAnswered:number, category:string, firedRules:object[] }}
 */
function scoreOhs(data) {
  const firedRules = [];
  let total = 0;
  let itemsAnswered = 0;

  for (const key of OHS_ITEM_KEYS) {
    const value = num(data.ohs[key]);
    if (value !== null) {
      total += value;
      itemsAnswered += 1;
    }
  }

  const category = ohsCategoryFromTotal(total);

  firedRules.push(
    rule(
      'R-OHS-TOTAL',
      'ohs',
      'total',
      total,
      category,
      'oxford-hip-score',
      `Oxford Hip Score total ${total} of 48 falls in the ${category} band.`
    )
  );

  return { total, itemsAnswered, category, firedRules };
}

export {
  scoreOhs,
  ohsCategoryFromTotal,
  round1,
  num,
  rule,
  ageInYears,
  calculateBmi,
  titleCase,
  OHS_ITEM_KEYS
};
