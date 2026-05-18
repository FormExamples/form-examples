import type { Band, FiredRule, SectionScore } from './types.js';
import type { SectionId } from '$lib/config/items.js';

const COACHING: Record<SectionId, Record<Exclude<Band, 'unanswered'>, string>> = {
  teams: {
    high: 'Teams have strong agile habits — autonomy, learning, and finishing. Preserve psychological safety as the team grows.',
    mid: 'Team behaviours are uneven. Identify two or three weak items and turn them into named retrospective experiments.',
    low: 'Teams are not yet operating with agile habits. Start with autonomy, finishing work, and dissent-safety; coaching is needed.',
  },
  stakeholders: {
    high: 'Stakeholders trust and support the team. Continue investing in transparency and shared goals.',
    mid: 'Stakeholder support is partial. Audit which decisions sponsors still take back at the first sign of trouble.',
    low: 'Stakeholder behaviour is the binding constraint. No team can outrun a sponsor who revokes authority and punishes experiments.',
  },
  practices: {
    high: 'Operating practices are healthy — quick decisions, finished-work focus, blame-free culture. Keep watching for over-engineering.',
    mid: 'Practices are partly in place. Pick the two weakest items and address them at the system level, not the team level.',
    low: 'Operating practices are working against agility. Address finished-over-WIP, quality-over-deadline, and blame culture before adding rituals.',
  },
};

export function applyMaturityRules(
  scores: { teams: SectionScore; stakeholders: SectionScore; practices: SectionScore },
): { firedRules: FiredRule[] } {
  const firedRules: FiredRule[] = [];
  for (const s of [scores.teams, scores.stakeholders, scores.practices]) {
    if (s.band === 'unanswered') {
      firedRules.push({
        ruleId: `R-${s.section.toUpperCase()}-UNANSWERED`,
        section: s.section,
        band: s.band,
        description: `${capitalise(s.section)} section was not answered.`,
      });
      continue;
    }
    const description = COACHING[s.section][s.band];
    firedRules.push({
      ruleId: `R-${s.section.toUpperCase()}-${s.band.toUpperCase()}`,
      section: s.section,
      band: s.band,
      description,
    });
  }
  return { firedRules };
}

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
