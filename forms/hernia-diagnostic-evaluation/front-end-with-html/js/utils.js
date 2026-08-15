// Small pure helpers shared by the classification rules and the grader.
//
// Plain-JavaScript port of ../front-end-with-svelte/src/lib/engine/utils.ts —
// same function names, same behaviour.

/** Coerce a possibly-empty numeric field to a number or null. */
function num(v) {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/** Build a fired-rule record in the shape a rule audit trail stores. */
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

/** Title-case a kebab-case value for display. */
function titleCase(s) {
  return String(s || '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Look up a label in a lookup table, falling back to the raw value. */
function labelFor(table, value) {
  return table[value] || value || '';
}

export { num, rule, ageInYears, titleCase, labelFor };
