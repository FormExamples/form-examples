import type { Arc42Documentation, AdditionalFlag } from './types.js';
import { nonEmpty, nonDraftAdrs } from './utils.js';

type FlagDetector = (d: Arc42Documentation) => AdditionalFlag | null;

const HIGH: FlagDetector[] = [
  (d) => d.stakeholders.length === 0 ? { category: 'no-stakeholders', priority: 'high', description: 'No stakeholders documented in §1.' } : null,
  (d) => d.qualityGoals.length === 0 ? { category: 'no-quality-goals', priority: 'high', description: 'No quality goals documented in §1.' } : null,
  (d) => d.architecturalDecisions.length === 0 ? { category: 'no-architectural-decisions', priority: 'high', description: 'No ADRs documented in §9.' } : null,
  (d) => d.riskItems.length === 0 ? { category: 'no-risks', priority: 'high', description: 'No risks or technical debt documented in §11.' } : null,
  (d) => (!nonEmpty(d.businessContextDescription) && d.contextPartners.filter((p) => p.kind === 'business').length === 0)
    ? { category: 'no-business-context', priority: 'high', description: 'Business context (§3) is empty.' }
    : null,
  (d) => d.deploymentNodes.length === 0 ? { category: 'no-deployment-view', priority: 'high', description: 'Deployment view (§7) has no nodes.' } : null,
];

const MEDIUM: FlagDetector[] = [
  (d) => d.qualityGoals.length > 0 && d.qualityGoals.length < 3
    ? { category: 'few-quality-goals', priority: 'medium', description: `Only ${d.qualityGoals.length} quality goal(s) — recommend ≥3.` }
    : null,
  (d) => nonDraftAdrs(d) > 0 && nonDraftAdrs(d) < 3
    ? { category: 'few-adrs', priority: 'medium', description: `Only ${nonDraftAdrs(d)} non-draft ADR(s) — recommend ≥3.` }
    : null,
  (d) => d.glossaryTerms.length === 0 ? { category: 'no-glossary', priority: 'medium', description: 'Glossary (§12) is empty.' } : null,
  (d) => d.runtimeScenarios.length === 0 ? { category: 'no-runtime-scenarios', priority: 'medium', description: 'Runtime view (§6) has no scenarios.' } : null,
  (d) => d.qualityScenarios.length === 0 ? { category: 'no-quality-scenarios', priority: 'medium', description: 'Quality requirements (§10) have no scenarios.' } : null,
  (d) => d.crosscuttingConcepts.length === 0 ? { category: 'no-crosscutting-concepts', priority: 'medium', description: 'Crosscutting concepts (§8) is empty.' } : null,
];

const LOW: FlagDetector[] = [
  (d) => !nonEmpty(d.introduction) ? { category: 'no-introduction', priority: 'low', description: 'Introduction (§1) is empty.' } : null,
  (d) => d.constraintItems.filter((c) => c.kind === 'convention').length === 0
    ? { category: 'no-conventions', priority: 'low', description: 'No conventions documented in §2.' }
    : null,
  (d) => d.riskItems.filter((r) => r.kind === 'technical-debt').length === 0
    ? { category: 'no-technical-debt', priority: 'low', description: 'Technical-debt section (§11) is empty.' }
    : null,
  (d) => {
    if (d.buildingBlocks.length < 6) return null;
    const nested = d.buildingBlocks.some((b) => b.parentOrdinal !== null);
    return nested ? null : { category: 'flat-decomposition', priority: 'low', description: 'Decomposition is single-tier despite ≥6 building blocks.' };
  },
];

export function detectFlags(d: Arc42Documentation): AdditionalFlag[] {
  const out: AdditionalFlag[] = [];
  for (const det of [...HIGH, ...MEDIUM, ...LOW]) {
    const f = det(d);
    if (f) out.push(f);
  }
  return out;
}
