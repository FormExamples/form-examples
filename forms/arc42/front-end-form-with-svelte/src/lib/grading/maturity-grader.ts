import type { Arc42Documentation, MaturityResult, Maturity, FiredRule } from './types.js';
import { computeCompleteness } from './completeness-rules.js';
import { detectFlags } from './flagged-issues.js';
import { nonDraftAdrs, fullyPopulatedQualityScenarios, risksWithMitigation } from './utils.js';

function bandFromCompleteness(byS: Record<number, string>, flags: { priority: string }[], d: Arc42Documentation): Maturity {
  const values = Array.from({ length: 12 }, (_, i) => byS[i + 1]);
  if (values.some((v) => v === 'empty')) return 'draft';
  if (values.some((v) => v === 'partial')) return 'reviewable';
  // every section is complete; high-priority flags (e.g. no-stakeholders, no-ADRs) all
  // also imply an incomplete section, so by construction none can fire here.
  const noMediumFlags = !flags.some((f) => f.priority === 'medium');
  if (
    noMediumFlags &&
    nonDraftAdrs(d) >= 5 &&
    fullyPopulatedQualityScenarios(d) >= 3 &&
    risksWithMitigation(d) >= 3
  ) return 'mature';
  return 'ready';
}

export function calculateMaturity(d: Arc42Documentation): MaturityResult {
  const completenessBySection = computeCompleteness(d);
  const additionalFlags = detectFlags(d);
  const computedMaturity = bandFromCompleteness(completenessBySection, additionalFlags, d);
  const finalMaturity: Maturity = d.finalMaturityOverride !== '' ? d.finalMaturityOverride : computedMaturity;
  const firedRules: FiredRule[] = additionalFlags.map((f, i) => ({
    ruleId: `R-${f.priority.toUpperCase().slice(0, 1)}-${String(i + 1).padStart(2, '0')}`,
    sectionNumber: 0, // category-based, not section-based
    description: f.description,
  }));
  return { computedMaturity, finalMaturity, completenessBySection, firedRules, additionalFlags };
}
