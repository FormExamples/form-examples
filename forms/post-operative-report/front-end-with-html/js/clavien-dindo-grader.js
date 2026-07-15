import { clavienDindoRuleByGrade } from './clavien-dindo-rules.js';

// Clavien-Dindo grader. Pure functions: take an `AssessmentData` object,
// return the highest-graded complication observed (the patient's overall
// Clavien-Dindo grade), the count of complications, and the list of fired
// rules (one entry per complication actually graded).
//
// Rules:
//   * If the user explicitly recorded `complicationsOccurred = 'no'`, OR has
//     not added any complications at all and `complicationsOccurred = 'no'`,
//     the overall grade is Grade 0 (no complication).
//   * Otherwise, the overall grade is the worst grade across all entered
//     complications (using the canonical Clavien-Dindo ordering).
//   * Unanswered grade fields are skipped; if all complications are
//     unanswered, the overall grade is Grade 0.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').ClavienDindoGradeKey} ClavienDindoGradeKey
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

/** Friendly label for a Clavien-Dindo grade key. */
function gradeLabel(grade) {
  const rule = clavienDindoRuleByGrade[grade];
  return rule ? rule.label : '';
}

/** Short label (Roman numeral) for a Clavien-Dindo grade key. */
function gradeShortLabel(grade) {
  const rule = clavienDindoRuleByGrade[grade];
  return rule ? rule.shortLabel : '';
}

/** CSS class hint for the overall grade badge. */
function gradeBadgeClass(grade) {
  switch (grade) {
    case 'grade-0':    return 'grade-0';
    case 'grade-i':    return 'grade-i';
    case 'grade-ii':   return 'grade-ii';
    case 'grade-iiia': return 'grade-iiia';
    case 'grade-iiib': return 'grade-iiib';
    case 'grade-iva':  return 'grade-iva';
    case 'grade-ivb':  return 'grade-ivb';
    case 'grade-v':    return 'grade-v';
    default: return '';
  }
}

/** Numeric ordering: grade-0 = 0, grade-i = 1, ..., grade-v = 7. */
function gradeOrder(grade) {
  const rule = clavienDindoRuleByGrade[grade];
  return rule ? rule.order : -1;
}

/**
 * Evaluate the recorded complications and produce the overall grade plus
 * a per-complication audit trail.
 *
 * @param {AssessmentData} data
 * @returns {{ overallGrade: ClavienDindoGradeKey, complicationCount: number, firedRules: FiredRule[] }}
 */
function calculateClavienDindo(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  const complications = data.complicationsAssessment.complications || [];
  let worstOrder = 0;
  /** @type {ClavienDindoGradeKey} */
  let worstGrade = 'grade-0';
  let graded = 0;

  for (let i = 0; i < complications.length; i++) {
    const c = complications[i];
    if (!c || !c.grade) continue;
    const order = gradeOrder(c.grade);
    if (order < 0) continue;
    graded++;
    firedRules.push({
      id: `CD-${i + 1}`,
      category: c.description ? c.description : '(complication not described)',
      description: clavienDindoRuleByGrade[c.grade]?.description ?? '',
      grade: c.grade
    });
    if (order > worstOrder) {
      worstOrder = order;
      worstGrade = c.grade;
    }
  }

  // If user explicitly said "no complications" we record Grade 0.
  if (
    data.complicationsAssessment.complicationsOccurred === 'no' &&
    graded === 0
  ) {
    worstGrade = 'grade-0';
  }

  // If the form hasn't been touched at all, default to Grade 0.
  if (graded === 0 && data.complicationsAssessment.complicationsOccurred !== 'yes') {
    worstGrade = 'grade-0';
  }

  return {
    overallGrade: worstGrade,
    complicationCount: graded,
    firedRules
  };
}

export { gradeLabel, gradeShortLabel, gradeBadgeClass, gradeOrder, calculateClavienDindo };
