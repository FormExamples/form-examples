import type { AgileAssessment, FiredRule, PrincipleBand } from './types.js';
import { PRINCIPLES } from '$lib/config/principles.js';

export function bandFor(score: number | null): PrincipleBand {
  if (score === null) return 'unanswered';
  if (score >= 4) return 'high';
  if (score === 3) return 'mid';
  return 'low';
}

const COACHING: Record<string, { high: string; mid: string; low: string }> = {
  'customer-satisfaction': {
    high: 'Customer feedback loops are tight; keep tracking outcome metrics, not output.',
    mid: 'Customer-feedback loops exist but are inconsistent. Define a cadence for user research and outcome metrics.',
    low: 'Customer is at arm\'s length. Establish a recurring feedback loop with real users this quarter.',
  },
  'welcome-change': {
    high: 'Change is treated as an opportunity; preserve light-weight change-control overhead.',
    mid: 'Change is tolerated but slow. Audit hand-offs and approval gates that delay re-prioritisation.',
    low: 'Change is treated as a threat. Replace heavy change-control with a lightweight backlog re-ordering ritual.',
  },
  'deliver-frequently': {
    high: 'Releases are routine and low-drama. Continue to shrink batch size where possible.',
    mid: 'Delivery cadence is uneven. Set a target cycle time and identify the largest batch-size constraint.',
    low: 'Delivery is rare or unpredictable. Reduce batch size and remove release ceremonies that add no value.',
  },
  'collaboration': {
    high: 'Daily collaboration is healthy; safeguard the rituals that keep stakeholders close to the work.',
    mid: 'Stakeholder collaboration is intermittent. Schedule a recurring product-engineering sync.',
    low: 'Stakeholders and engineers are working in silos. Co-locate decisions or create a daily 15-minute joint stand-up.',
  },
  'motivated-individuals': {
    high: 'People feel trusted and supported. Continue investing in autonomy and tools.',
    mid: 'Motivation is mixed. Run a 1:1 listening tour to surface friction.',
    low: 'Morale is low or trust is thin. Address environment, tooling, or management style before adding more process.',
  },
  'face-to-face': {
    high: 'Real-time conversation is the default for important decisions; document outcomes, not deliberations.',
    mid: 'Conversation happens but key decisions still drift in async threads. Define which decisions must be live.',
    low: 'Important decisions are stuck in chat or email. Establish a synchronous decision ritual.',
  },
  'working-software': {
    high: 'Progress is measured by shipped, working capability. Continue.',
    mid: 'Progress is partly tracked by output proxies. Replace velocity / hours dashboards with shipped-feature counts.',
    low: 'Progress is reported by activity, not by working software. Make working software the headline metric.',
  },
  'sustainable-development': {
    high: 'Pace is sustainable. Watch for early signs of crunch creeping in.',
    mid: 'Pace is variable; crunch is creeping in. Capacity-plan with explicit slack.',
    low: 'Crunch and heroics are routine. Reset capacity and protect non-overtime delivery before scope.',
  },
  'technical-excellence': {
    high: 'Technical health is part of definition-of-done; keep refactoring continuous.',
    mid: 'Quality work is squeezed. Carve out explicit capacity for testing and refactoring.',
    low: 'Technical debt is accumulating faster than it is being repaid. Treat this as the top organisational risk.',
  },
  'simplicity': {
    high: 'Scope is actively trimmed; resist gold-plating.',
    mid: 'Scope creeps in. Add a written "what we are NOT doing" list to every initiative.',
    low: 'Over-engineering or scope creep is the norm. Make trimming a non-optional part of planning.',
  },
  'self-organising-teams': {
    high: 'Teams choose how to deliver. Reinforce psychological safety to keep emergence working.',
    mid: 'Self-organisation is partial. Audit which decisions managers still own that the team could.',
    low: 'Command-and-control culture. Push architecture and design decisions back to the team and provide context, not directives.',
  },
  'regular-reflection': {
    high: 'Retrospectives drive concrete experiments. Continue closing the loop on each.',
    mid: 'Retrospectives happen but actions slip. Track each retro action like a top-priority story.',
    low: 'Retrospectives are skipped or theatrical. Reinstate them on a fixed schedule with one written follow-up.',
  },
};

export function applyMaturityRules(data: AgileAssessment): {
  perPrincipleBands: PrincipleBand[];
  firedRules: FiredRule[];
} {
  const perPrincipleBands: PrincipleBand[] = [];
  const firedRules: FiredRule[] = [];

  for (const principle of PRINCIPLES) {
    const idx = principle.number - 1;
    const score = data.responses[idx]?.score ?? null;
    const band = bandFor(score);
    perPrincipleBands.push(band);

    if (band === 'unanswered') {
      firedRules.push({
        ruleId: `R-P${pad2(principle.number)}-UNANSWERED`,
        principleNumber: principle.number,
        principleSlug: principle.slug,
        band,
        description: `Principle ${principle.number} (${principle.shortTitle}) was not answered.`,
      });
      continue;
    }

    const coaching = COACHING[principle.slug];
    const description = coaching ? coaching[band] : '';
    firedRules.push({
      ruleId: `R-P${pad2(principle.number)}-${band.toUpperCase()}`,
      principleNumber: principle.number,
      principleSlug: principle.slug,
      band,
      description,
    });
  }

  return { perPrincipleBands, firedRules };
}

function pad2(n: number): string {
  return n.toString().padStart(2, '0');
}
