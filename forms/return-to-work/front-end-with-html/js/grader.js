import { detectAdditionalFlags } from './flags.js';
import { restrictionRules } from './rules.js';
import { gradeToPriority } from './types.js';

// Grader for the Return to Work statement of fitness for work.
//
// Ported byte-for-byte from the Svelte engine (`src/lib/engine/rtw-grader.ts`).
// Composes the restriction rules in rules.js and the safety flags in flags.js
// into a single pure, deterministic grading result. The public entry point is
// `calculateReturnToWork(data)`. The output shape and rule / flag IDs are
// identical across every front-end and the back-end:
//
//   { fitnessStatement, computedFitness, overridden, restrictionPriority,
//     firedRules[], additionalFlags[], timestamp }

/** Derive the computed fitness statement from the clinician's outcome. */
function deriveFitness(data) {
  const outcome = data.fitness.outcome;
  if (outcome === 'fit' || outcome === 'may-be-fit' || outcome === 'not-fit') {
    return outcome;
  }
  // No positive statement of fitness → conservative default.
  return 'not-fit';
}

/** Derive the overall restriction priority via the max-grade rule. */
function deriveRestrictionPriority(firedRules) {
  const maxGrade = firedRules.length > 0 ? Math.max(...firedRules.map((r) => r.grade)) : 1;
  return gradeToPriority(maxGrade);
}

/**
 * Pure function: computes the return-to-work fitness statement and the
 * restriction-priority grade from clinician input.
 *
 * @param {object} data - the assessment data model from emptyAssessment()
 * @returns {{
 *   fitnessStatement:string,
 *   computedFitness:string,
 *   overridden:boolean,
 *   restrictionPriority:string,
 *   firedRules:object[],
 *   additionalFlags:object[],
 *   timestamp:string
 * }}
 */
function calculateReturnToWork(data) {
  const firedRules = [];
  for (const rule of restrictionRules) {
    try {
      if (rule.evaluate(data)) {
        firedRules.push({
          id: rule.id,
          system: rule.system,
          description: rule.description,
          grade: rule.grade
        });
      }
    } catch (e) {
      // Rule evaluation failed - log for debugging but continue grading.
      console.warn(`Restriction rule ${rule.id} evaluation failed:`, e);
    }
  }

  const restrictionPriority = deriveRestrictionPriority(firedRules);
  const computedFitness = deriveFitness(data);
  const overridden =
    data.signOff.clinicianOverride === 'yes' && data.signOff.overrideOutcome !== '';
  const fitnessStatement = overridden
    ? data.signOff.overrideOutcome
    : computedFitness;

  const additionalFlags = detectAdditionalFlags(data);

  return {
    fitnessStatement,
    computedFitness,
    overridden,
    restrictionPriority,
    firedRules,
    additionalFlags,
    timestamp: new Date().toISOString()
  };
}

export { calculateReturnToWork, deriveFitness, deriveRestrictionPriority };
