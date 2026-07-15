import { detectFlags } from './flags.js';
import { computeCompleteness } from './rules.js';
import { fullyPopulatedQualityScenarios, nonDraftAdrs, risksWithMitigation } from './types.js';

// Documentation-maturity grader for the arc42 form.
//
// Ported verbatim from the SvelteKit `maturity-grader.ts`. Composes the
// per-section completeness rules (rules.js) and the flagged issues (flags.js)
// into a single pure, deterministic maturity result via the max-grade
// algorithm:
//
//   1. Grade each of the 12 sections empty / partial / complete.
//   2. Derive `computedMaturity` from the lowest completeness across sections:
//      any empty -> draft; else any partial -> reviewable; else ready, upgraded
//      to mature when the mature drivers are all met.
//   3. Detect independent flags (do NOT change the band).
//   4. Apply the author's step-12 override to produce `finalMaturity`.
//
// The output shape and fired-rule / flag IDs are identical across every
// front-end and the back-end. Public entry point: `calculateMaturity(d)`.

/**
 * Derive the computed maturity band from per-section completeness plus the
 * mature-band drivers. Mirrors `bandFromCompleteness` in the Svelte engine.
 */
function bandFromCompleteness(byS, flags, d) {
  const values = Array.from({ length: 12 }, (_, i) => byS[i + 1]);
  if (values.some((v) => v === 'empty')) return 'draft';
  if (values.some((v) => v === 'partial')) return 'reviewable';
  // Every section is complete; a medium-priority flag blocks `mature`.
  const noMediumFlags = !flags.some((f) => f.priority === 'medium');
  if (
    noMediumFlags &&
    nonDraftAdrs(d) >= 5 &&
    fullyPopulatedQualityScenarios(d) >= 3 &&
    risksWithMitigation(d) >= 3
  ) return 'mature';
  return 'ready';
}

/**
 * Public entry point. Pure and deterministic.
 *
 * @param {object} d - the Arc42Documentation data model from emptyDocumentation()
 * @returns {{
 *   computedMaturity: string,
 *   finalMaturity: string,
 *   completenessBySection: Record<number, string>,
 *   firedRules: {ruleId:string, sectionNumber:number, description:string}[],
 *   additionalFlags: {category:string, priority:string, description:string}[]
 * }}
 */
function calculateMaturity(d) {
  const completenessBySection = computeCompleteness(d);
  const additionalFlags = detectFlags(d);
  const computedMaturity = bandFromCompleteness(completenessBySection, additionalFlags, d);
  const finalMaturity = d.finalMaturityOverride !== '' ? d.finalMaturityOverride : computedMaturity;
  const firedRules = additionalFlags.map((f, i) => ({
    ruleId: `R-${f.priority.toUpperCase().slice(0, 1)}-${String(i + 1).padStart(2, '0')}`,
    sectionNumber: 0, // category-based, not section-based
    description: f.description
  }));
  return { computedMaturity, finalMaturity, completenessBySection, firedRules, additionalFlags };
}

export { calculateMaturity, bandFromCompleteness };
