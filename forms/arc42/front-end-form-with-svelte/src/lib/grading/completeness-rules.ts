import type { Arc42Documentation, Completeness } from './types.js';
import { nonEmpty, nonDraftAdrs, fullyPopulatedQualityScenarios, risksWithMitigation } from './utils.js';

type SectionRules = (d: Arc42Documentation) => { populated: boolean; complete: boolean };

const RULES: Record<number, SectionRules> = {
  1: (d) => {
    const populated = nonEmpty(d.introduction) || d.businessGoals.length > 0 || d.qualityGoals.length > 0 || d.stakeholders.length > 0;
    const qg = d.qualityGoals.filter((q) => q.priority !== '' && nonEmpty(q.scenario));
    const complete = nonEmpty(d.introduction) && d.businessGoals.length >= 1 && qg.length >= 3 && d.stakeholders.length >= 2;
    return { populated, complete };
  },
  2: (d) => {
    const populated = d.constraintItems.length > 0;
    const complete = d.constraintItems.length >= 1;
    return { populated, complete };
  },
  3: (d) => {
    const populated = nonEmpty(d.businessContextDescription) || nonEmpty(d.technicalContextDescription) || d.contextPartners.length > 0;
    const business = nonEmpty(d.businessContextDescription) && d.contextPartners.some((p) => p.kind === 'business');
    const technical = nonEmpty(d.technicalContextDescription) && d.contextPartners.some((p) => p.kind === 'technical');
    return { populated, complete: business && technical };
  },
  4: (d) => {
    const populated = nonEmpty(d.solutionStrategySummary) || d.technologyDecisions.length > 0;
    const complete = nonEmpty(d.solutionStrategySummary) && d.technologyDecisions.length >= 1;
    return { populated, complete };
  },
  5: (d) => ({
    populated: nonEmpty(d.buildingBlockOverview) || d.buildingBlocks.length > 0,
    complete: nonEmpty(d.buildingBlockOverview) && d.buildingBlocks.length >= 3,
  }),
  6: (d) => ({
    populated: nonEmpty(d.runtimeOverview) || d.runtimeScenarios.length > 0,
    complete: d.runtimeScenarios.some((s) => nonEmpty(s.stepsSummary)),
  }),
  7: (d) => ({
    populated: nonEmpty(d.deploymentOverview) || d.deploymentNodes.length > 0,
    complete: d.deploymentNodes.length >= 1,
  }),
  8: (d) => ({
    populated: nonEmpty(d.crosscuttingOverview) || d.crosscuttingConcepts.length > 0,
    complete: d.crosscuttingConcepts.length >= 1,
  }),
  9: (d) => ({
    populated: d.architecturalDecisions.length > 0,
    complete: nonDraftAdrs(d) >= 3,
  }),
  10: (d) => ({
    populated: nonEmpty(d.qualityTreeSummary) || d.qualityScenarios.length > 0,
    complete: fullyPopulatedQualityScenarios(d) >= 3,
  }),
  11: (d) => ({
    populated: d.riskItems.length > 0,
    complete: risksWithMitigation(d) >= 1,
  }),
  12: (d) => ({
    populated: d.glossaryTerms.length > 0,
    complete: d.glossaryTerms.length >= 5,
  }),
};

export function computeCompleteness(d: Arc42Documentation): Record<number, Completeness> {
  const out: Record<number, Completeness> = {};
  for (let i = 1; i <= 12; i++) {
    const { populated, complete } = RULES[i](d);
    out[i] = complete ? 'complete' : populated ? 'partial' : 'empty';
  }
  return out;
}
