// Composite grader for the Knee Replacement Surgery Evaluation.
//
// Composes the Oxford Knee Score, the Kellgren-Lawrence-driven candidacy
// rule, and the safety flags into a single pure, deterministic grading
// result. The public entry point is `calculateKneeEvaluation(data)`. The
// output shape and the rule / flag IDs are identical across every front-end
// and the back-end. This module is the plain-JS port of
// ../../front-end-with-svelte/src/lib/engine/grader.ts.

import { detectFlags } from './flagged-issues.js';
import { ageInYears, scoreCandidacy, scoreOks } from './oks-rules.js';

const OKS_CATEGORIES = ['severe', 'moderate', 'mild-to-moderate', 'satisfactory'];
const CANDIDACIES = ['strong-candidate', 'candidate', 'continue-conservative', 'not-indicated', 'mdt-review'];

/**
 * Public entry point. Pure and deterministic: no I/O, no clock. The caller
 * supplies the assessment date via `data.clinician.assessmentDate`, so age is
 * computed from recorded data rather than from `Date.now()`.
 *
 * @param {object} data - the evaluation data model from emptyEvaluation()
 * @returns {{
 *   oksItemScores: Record<string, number|null>,
 *   oksTotal: number,
 *   computedOksCategory: string,
 *   finalOksCategory: string,
 *   maxKellgrenLawrenceGrade: number|null,
 *   computedCandidacy: string,
 *   finalCandidacy: string,
 *   overrideReason: string,
 *   firedRules: object[],
 *   flags: object[]
 * }}
 */
function calculateKneeEvaluation(data) {
  const firedRules = [];

  const age = ageInYears(data.patient.birthDate, data.clinician.assessmentDate);

  // --- Oxford Knee Score ----------------------------------------------------
  const oks = scoreOks(data.oks);
  firedRules.push(...oks.firedRules);

  // --- Surgical candidacy -----------------------------------------------------
  const candidacyResult = scoreCandidacy(data, oks.total);
  firedRules.push(...candidacyResult.firedRules);

  // --- Clinician override ------------------------------------------------------
  // The override changes the candidacy recommendation only. Safety flags are
  // computed independently below and are always reported.
  const overrideCandidacy = data.summary.overrideCandidacy;
  const finalCandidacy =
    overrideCandidacy && CANDIDACIES.includes(overrideCandidacy) ? overrideCandidacy : candidacyResult.candidacy;
  const overrideReason = finalCandidacy !== candidacyResult.candidacy ? data.summary.overrideReason : '';

  // The OKS category itself is not clinician-overridable independently of the
  // candidacy override; final and computed match unless a future clinical
  // need separates them.
  const computedOksCategory = oks.category;
  const finalOksCategory = OKS_CATEGORIES.includes(computedOksCategory) ? computedOksCategory : '';

  const flags = detectFlags(data, {
    candidacy: finalCandidacy,
    maxKellgrenLawrenceGrade: candidacyResult.maxKellgrenLawrenceGrade,
    age
  });

  return {
    oksItemScores: oks.itemScores,
    oksTotal: oks.total,
    computedOksCategory,
    finalOksCategory,
    maxKellgrenLawrenceGrade: candidacyResult.maxKellgrenLawrenceGrade,
    computedCandidacy: candidacyResult.candidacy,
    finalCandidacy,
    overrideReason,
    firedRules,
    flags
  };
}

/** Display labels for the Oxford Knee Score category. */
const OKS_CATEGORY_LABELS = {
  severe: 'Severe (0–19)',
  moderate: 'Moderate (20–29)',
  'mild-to-moderate': 'Mild to moderate (30–39)',
  satisfactory: 'Satisfactory (40–48)',
  '': 'Not yet scored'
};

/** Display labels for the surgical-candidacy recommendation. */
const CANDIDACY_LABELS = {
  'strong-candidate': 'Strong candidate for surgery',
  candidate: 'Candidate for surgery',
  'continue-conservative': 'Continue conservative management',
  'not-indicated': 'Surgery not indicated',
  'mdt-review': 'Refer for multidisciplinary team review',
  '': 'Not yet assessed'
};

export { calculateKneeEvaluation, OKS_CATEGORY_LABELS, CANDIDACY_LABELS };
