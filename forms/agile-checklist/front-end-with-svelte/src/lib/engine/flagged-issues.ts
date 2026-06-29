import type {
  AdditionalFlag,
  AgileChecklist,
  Answer,
  SectionScore,
} from './types.js';

const SECTION_LOW_THRESHOLD = 50;
const SECTION_IMBALANCE_THRESHOLD = 30;
const MIN_ANSWERED_FOR_REPORT = 30;

interface Context {
  teams: SectionScore;
  stakeholders: SectionScore;
  practices: SectionScore;
  answeredCount: number;
}

function isNo(a: Answer): boolean {
  return a === 'no';
}

export function detectAdditionalFlags(data: AgileChecklist, ctx: Context): AdditionalFlag[] {
  const flags: AdditionalFlag[] = [];

  // Section-level low-band risks
  if (ctx.teams.percent !== null && ctx.teams.percent < SECTION_LOW_THRESHOLD) {
    flags.push({
      flagId: 'F-TEAMS-AUTONOMY',
      category: 'teams-autonomy-risk',
      priority: 'high',
      section: 'teams',
      triggeringItems: [],
      description: `Teams section scored ${ctx.teams.percent.toFixed(0)}% — autonomy and finishing habits are weak.`,
      suggestedAction: 'Run a focused retrospective on autonomy, finishing work, and decision authority.',
    });
  }
  if (ctx.stakeholders.percent !== null && ctx.stakeholders.percent < SECTION_LOW_THRESHOLD) {
    flags.push({
      flagId: 'F-STAKEHOLDERS-TRUST',
      category: 'stakeholders-trust-risk',
      priority: 'high',
      section: 'stakeholders',
      triggeringItems: [],
      description: `Stakeholders section scored ${ctx.stakeholders.percent.toFixed(0)}% — sponsorship is the binding constraint.`,
      suggestedAction: 'Brief executive sponsors on agile delegation; renegotiate explicit decision rights.',
    });
  }
  if (ctx.practices.percent !== null && ctx.practices.percent < SECTION_LOW_THRESHOLD) {
    flags.push({
      flagId: 'F-PRACTICES-DISCIPLINE',
      category: 'practices-discipline-risk',
      priority: 'high',
      section: 'practices',
      triggeringItems: [],
      description: `Practices section scored ${ctx.practices.percent.toFixed(0)}% — operating practices are working against agility.`,
      suggestedAction: 'Address finished-over-WIP, quality-over-deadline, and blame culture as system-level changes.',
    });
  }

  // Section imbalance (any pair > 30 points apart)
  const definedScores = [ctx.teams, ctx.stakeholders, ctx.practices].filter(
    (s) => s.percent !== null,
  ) as Array<SectionScore & { percent: number }>;
  if (definedScores.length >= 2) {
    let maxSpread = 0;
    for (let i = 0; i < definedScores.length; i += 1) {
      for (let j = i + 1; j < definedScores.length; j += 1) {
        maxSpread = Math.max(
          maxSpread,
          Math.abs(definedScores[i].percent - definedScores[j].percent),
        );
      }
    }
    if (maxSpread > SECTION_IMBALANCE_THRESHOLD) {
      flags.push({
        flagId: 'F-SECTION-IMBALANCE',
        category: 'section-imbalance',
        priority: 'medium',
        section: '',
        triggeringItems: [],
        description: `Section spread is ${maxSpread.toFixed(0)} percentage points — adoption is uneven across audiences.`,
        suggestedAction: 'Align coaching across teams, stakeholders, and practices so improvements are not undone elsewhere.',
      });
    }
  }

  // Item-triplet flags
  if (isNo(data.answers.t08) && isNo(data.answers.p12)) {
    flags.push({
      flagId: 'F-FINISHED-WORK',
      category: 'finished-work-risk',
      priority: 'high',
      section: '',
      triggeringItems: ['t08', 'p12'],
      description: 'Teams wait on others (t08=no) and the organisation values WIP over finished work (p12=no).',
      suggestedAction: 'Set explicit WIP limits and prioritise finishing in-flight work over starting new work.',
    });
  }
  if (isNo(data.answers.s09) && isNo(data.answers.s10)) {
    flags.push({
      flagId: 'F-EXPERIMENTATION-BLOCKED',
      category: 'experimentation-blocked',
      priority: 'high',
      section: 'stakeholders',
      triggeringItems: ['s09', 's10'],
      description: 'Stakeholders neither support experiments (s09=no) nor tolerate failed ones (s10=no).',
      suggestedAction: 'Negotiate a formal experiment budget with the sponsor; agree explicitly that some experiments will fail.',
    });
  }
  if (isNo(data.answers.t17) && isNo(data.answers.t18)) {
    flags.push({
      flagId: 'F-LEARNING-STALLED',
      category: 'learning-stalled',
      priority: 'medium',
      section: 'teams',
      triggeringItems: ['t17', 't18'],
      description: 'Teams neither seek (t17=no) nor improve (t18=no) skills — long-term capability is decaying.',
      suggestedAction: 'Schedule recurring learning time and pair people deliberately on unfamiliar work.',
    });
  }

  // Psychological safety: any of t22, s08, p14 = no
  const psychTriggers: string[] = [];
  if (isNo(data.answers.t22)) psychTriggers.push('t22');
  if (isNo(data.answers.s08)) psychTriggers.push('s08');
  if (isNo(data.answers.p14)) psychTriggers.push('p14');
  if (psychTriggers.length > 0) {
    flags.push({
      flagId: 'F-PSYCHOLOGICAL-SAFETY',
      category: 'psychological-safety-risk',
      priority: 'high',
      section: '',
      triggeringItems: psychTriggers,
      description: 'Psychological safety is at risk — dissent, sustained authority, or blameless problem-solving is missing.',
      suggestedAction: 'Address safety before adding rituals or processes; nothing else compounds without it.',
    });
  }

  // Insufficient data
  if (ctx.answeredCount < MIN_ANSWERED_FOR_REPORT) {
    flags.push({
      flagId: 'F-INSUFFICIENT-DATA',
      category: 'insufficient-data',
      priority: 'medium',
      section: '',
      triggeringItems: [],
      description: `Only ${ctx.answeredCount} of 57 items answered; the composite maturity is not reportable below 30.`,
      suggestedAction: 'Complete more items before relying on the maturity result.',
    });
  }

  return flags;
}
