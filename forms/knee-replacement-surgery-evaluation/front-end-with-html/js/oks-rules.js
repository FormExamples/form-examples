// Oxford Knee Score (OKS) and surgical-candidacy rules.
//
// OKS is published by Dawson, Fitzpatrick, Murray & Carr (J Bone Joint Surg
// Br 1998) and is free to use for non-commercial clinical purposes with
// attribution. See ../../doc/oks-scoring.md for the item-by-item table and
// the candidacy precedence order. This module is the plain-JS port of
// ../../front-end-with-svelte/src/lib/engine/oks-rules.ts and utils.ts.
//
// Every function here is pure: same inputs, same outputs, no I/O, no clock.

import { OKS_ITEM_KEYS } from './types.js';

/** Coerce a possibly-empty numeric field to a number or null. */
function num(v) {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/** Round to one decimal place, the precision the SQL schema stores BMI at. */
function round1(n) {
  return Math.round(n * 10) / 10;
}

/** Build a fired-rule record for the audit trail and the report. */
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

/** Body mass index from height (cm) and weight (kg), or null if either is missing. */
function computeBmi(heightAsCm, weightAsKg) {
  const height = num(heightAsCm);
  const weight = num(weightAsKg);
  if (height === null || height <= 0 || weight === null) return null;
  const metres = height / 100;
  return round1(weight / (metres * metres));
}

/** Sum the 12 Oxford Knee Score items, treating an unanswered item as 0. */
function scoreOks(oks) {
  const itemScores = {};
  let total = 0;
  let answeredCount = 0;

  for (const key of OKS_ITEM_KEYS) {
    const v = num(oks[key]);
    itemScores[key] = v;
    if (v !== null) {
      total += v;
      answeredCount += 1;
    }
  }

  const category = oksCategory(total);
  const firedRules = [
    rule(
      'R-OKS-TOTAL',
      'oks',
      'total',
      total,
      category,
      'oxford-knee-score',
      `Oxford Knee Score total ${total} of 48 falls in the ${category.replace(/-/g, ' ')} band.`
    )
  ];

  if (answeredCount < OKS_ITEM_KEYS.length) {
    firedRules.push(
      rule(
        'R-OKS-INCOMPLETE',
        'oks',
        'total',
        answeredCount,
        '',
        'oxford-knee-score',
        `Only ${answeredCount} of the 12 Oxford Knee Score items have been answered; the total is a partial score.`
      )
    );
  }

  return { itemScores, total, category, firedRules };
}

/** Map an Oxford Knee Score total to this form's operational category. */
function oksCategory(total) {
  if (total <= 19) return 'severe';
  if (total <= 29) return 'moderate';
  if (total <= 39) return 'mild-to-moderate';
  return 'satisfactory';
}

/** Highest Kellgren-Lawrence radiographic grade across the three compartments. */
function maxKellgrenLawrenceGrade(imaging) {
  const grades = [
    num(imaging.kellgrenLawrenceGradeMedial),
    num(imaging.kellgrenLawrenceGradeLateral),
    num(imaging.kellgrenLawrenceGradePatellofemoral)
  ].filter((g) => g !== null);
  if (grades.length === 0) return null;
  return Math.max(...grades);
}

/**
 * Compute the surgical-candidacy recommendation. Evaluated in order; the
 * first matching rule wins. See ../../AGENTS.md "Candidacy computation".
 */
function scoreCandidacy(data, oksTotal) {
  const maxKl = maxKellgrenLawrenceGrade(data.imaging);
  const conservativeExhausted = data.conservative.conservativeMeasuresExhausted === 'yes';

  let candidacy;
  let description;

  if (oksTotal <= 19 && maxKl !== null && maxKl >= 3 && conservativeExhausted) {
    candidacy = 'strong-candidate';
    description = `Oxford Knee Score ${oksTotal} is 19 or below, Kellgren-Lawrence grade ${maxKl} is 3 or above, and conservative measures are exhausted.`;
  } else if (oksTotal <= 29 && conservativeExhausted && maxKl !== null && maxKl >= 2) {
    candidacy = 'candidate';
    description = `Oxford Knee Score ${oksTotal} is 29 or below, conservative measures are exhausted, and Kellgren-Lawrence grade ${maxKl} is 2 or above.`;
  } else if (!conservativeExhausted) {
    candidacy = 'continue-conservative';
    description =
      'Conservative measures have not been recorded as exhausted, regardless of Oxford Knee Score or Kellgren-Lawrence grade.';
  } else if (oksTotal >= 40 || maxKl === null || maxKl <= 1) {
    candidacy = 'not-indicated';
    description =
      oksTotal >= 40
        ? `Oxford Knee Score ${oksTotal} is 40 or above, a satisfactory outcome.`
        : 'Kellgren-Lawrence grade is 1 or below in every recorded compartment.';
  } else {
    candidacy = 'mdt-review';
    description =
      'The findings are mixed or borderline and do not clearly satisfy the strong-candidate, candidate, continue-conservative, or not-indicated criteria.';
  }

  const firedRules = [
    rule('R-CANDIDACY', 'candidacy', 'recommendation', null, candidacy, 'surgical-candidacy', description)
  ];

  return { candidacy, maxKellgrenLawrenceGrade: maxKl, firedRules };
}

export {
  num,
  round1,
  rule,
  ageInYears,
  computeBmi,
  scoreOks,
  oksCategory,
  maxKellgrenLawrenceGrade,
  scoreCandidacy
};
