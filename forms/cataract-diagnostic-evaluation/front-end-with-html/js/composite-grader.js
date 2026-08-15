// Composite grader for the Cataract Diagnostic Evaluation.
//
// Composes the LOCS III severity rules, the surgical-candidacy computation,
// and the safety flags into a single pure, deterministic grading result. The
// public entry point is `calculateCataractEvaluation(data)`. The output
// shape and the rule / flag IDs are identical across every front-end and the
// back-end. This is the vanilla-JS mirror of
// ../../front-end-with-svelte/src/lib/engine/grader.ts.
//
// Algorithm: max-grade. The worse eye's LOCS III severity, the worse of
// acuity/glare, and any fired safety flag each only ever push the computed
// surgical candidacy to a worse band, never a milder one. A fired safety
// flag always overrides to `urgent-referral`, regardless of the LOCS III /
// acuity computation, so it can never be diluted by an otherwise reassuring
// grade.

import { detectFlags } from './flagged-issues.js';
import {
  ageInYears,
  computeFunctionalImpactScore,
  computeSurgicalCandidacy,
  scoreLocsIII,
  worseCandidacy
} from './locs-rules.js';

/**
 * Public entry point. Pure and deterministic: no I/O, no clock. The caller
 * supplies the assessment date via `data.clinician.assessmentDate`, so age is
 * computed from recorded data rather than from `Date.now()`.
 *
 * @param {object} data - the evaluation data model from emptyEvaluation()
 * @returns {{
 *   locsIIISeverityRight: string, locsIIISeverityLeft: string,
 *   computedSurgicalCandidacy: string, finalSurgicalCandidacy: string,
 *   overrideReason: string, functionalImpactScore: number|null,
 *   firedRules: object[], flags: object[]
 * }}
 */
function calculateCataractEvaluation(data) {
  const firedRules = [];

  const age = ageInYears(data.patient.birthDate, data.clinician.assessmentDate);

  // --- LOCS III severity, per eye -----------------------------------------
  const locs = scoreLocsIII(data);
  firedRules.push(...locs.firedRules);

  // --- Surgical candidacy from severity, acuity, and glare -----------------
  const candidacyResult = computeSurgicalCandidacy(
    locs.severityRight,
    locs.severityLeft,
    data.acuity,
    data.glare
  );
  firedRules.push(...candidacyResult.firedRules);
  let computedSurgicalCandidacy = candidacyResult.candidacy;

  // --- Functional / quality-of-life composite score -------------------------
  const functionalImpactScore = computeFunctionalImpactScore(data);

  // --- Safety flags ----------------------------------------------------------
  const flags = detectFlags(data, {
    severityRight: locs.severityRight,
    severityLeft: locs.severityLeft,
    age
  });

  // A fired safety flag always overrides the computed candidacy to
  // urgent-referral; it is never suppressed by a clinician override.
  if (flags.length > 0) {
    computedSurgicalCandidacy = worseCandidacy(computedSurgicalCandidacy, 'urgent-referral');
    firedRules.push({
      ruleId: 'R-CANDIDACY-URGENT-FLAG',
      instrument: 'composite',
      component: 'safety-flag',
      score: null,
      band: 'urgent-referral',
      category: 'surgical candidacy',
      description: `${flags.length} safety flag(s) fired, overriding the computed surgical candidacy to urgent-referral.`
    });
  }

  // --- Clinician override -----------------------------------------------------
  // The override changes the final surgical-candidacy recommendation only.
  // Safety flags are computed independently above and are always reported.
  const override = data.summary.overrideSurgicalCandidacy;
  const finalSurgicalCandidacy = override || computedSurgicalCandidacy;
  const overrideReason =
    finalSurgicalCandidacy !== computedSurgicalCandidacy ? data.summary.overrideReason : '';

  return {
    locsIIISeverityRight: locs.severityRight,
    locsIIISeverityLeft: locs.severityLeft,
    computedSurgicalCandidacy,
    finalSurgicalCandidacy,
    overrideReason,
    functionalImpactScore,
    firedRules,
    flags
  };
}

export { calculateCataractEvaluation };
