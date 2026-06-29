import type {
  AdditionalFlag,
  AgileAssessment,
  FlagCategory,
  FlagPriority,
} from './types.js';
import { PRINCIPLES } from '$lib/config/principles.js';

interface PrincipleFlagSpec {
  category: FlagCategory;
  priority: FlagPriority;
  description: string;
  suggestedAction: string;
}

const PRINCIPLE_FLAGS: Record<string, PrincipleFlagSpec> = {
  'customer-satisfaction': {
    category: 'customer-disconnect',
    priority: 'high',
    description: 'The team is at risk of building features that customers do not value.',
    suggestedAction: 'Stand up a real customer-feedback loop within the next two weeks (interviews, beta cohort, or analytics).',
  },
  'welcome-change': {
    category: 'change-resistance',
    priority: 'high',
    description: 'Change is treated as a threat; competitive responsiveness will suffer.',
    suggestedAction: 'Replace heavy change-control with a lightweight backlog re-prioritisation ritual.',
  },
  'deliver-frequently': {
    category: 'slow-delivery',
    priority: 'medium',
    description: 'Long delivery cycles delay learning and increase batch risk.',
    suggestedAction: 'Pick one initiative and ship a thin slice within two weeks; measure cycle time.',
  },
  'collaboration': {
    category: 'silo-collaboration',
    priority: 'high',
    description: 'Engineering and business are operating in silos.',
    suggestedAction: 'Schedule a daily 15-minute product-engineering sync and rotate attendees.',
  },
  'motivated-individuals': {
    category: 'morale-risk',
    priority: 'high',
    description: 'Trust, environment, or motivation are weak. People will leave or disengage.',
    suggestedAction: 'Run a structured 1:1 listening tour; surface and remove the top three friction points.',
  },
  'face-to-face': {
    category: 'communication-gap',
    priority: 'medium',
    description: 'Critical decisions are stuck in async threads.',
    suggestedAction: 'Define which decision classes require synchronous conversation; capture outcomes (not deliberations) in writing.',
  },
  'working-software': {
    category: 'output-not-outcome',
    priority: 'medium',
    description: 'Progress is being judged by activity rather than working software.',
    suggestedAction: 'Replace velocity / hours dashboards with a shipped-features dashboard.',
  },
  'sustainable-development': {
    category: 'burnout-risk',
    priority: 'high',
    description: 'Crunch is the default; burnout and quality regressions are likely.',
    suggestedAction: 'Reset capacity to a sustainable baseline and protect non-overtime delivery before adding scope.',
  },
  'technical-excellence': {
    category: 'technical-debt',
    priority: 'high',
    description: 'Technical debt is growing faster than it is being repaid; future agility is at risk.',
    suggestedAction: 'Allocate explicit weekly capacity to tests, refactoring, and infrastructure quality.',
  },
  'simplicity': {
    category: 'over-engineering',
    priority: 'medium',
    description: 'Scope creep or over-engineering is the norm; the team is doing more work than is required.',
    suggestedAction: 'Add a written "what we are NOT doing" list to every initiative; review weekly.',
  },
  'self-organising-teams': {
    category: 'command-and-control',
    priority: 'high',
    description: 'Decision-making sits with managers, not with the team closest to the work.',
    suggestedAction: 'Push design and architecture decisions back to the team; managers provide context, not directives.',
  },
  'regular-reflection': {
    category: 'no-retrospective',
    priority: 'high',
    description: 'Retrospectives are skipped or theatrical; the team cannot improve itself.',
    suggestedAction: 'Reinstate retrospectives on a fixed cadence; track each follow-up like a top-priority story.',
  },
};

export function detectAdditionalFlags(data: AgileAssessment): AdditionalFlag[] {
  const flags: AdditionalFlag[] = [];

  let answeredCount = 0;
  for (const principle of PRINCIPLES) {
    const idx = principle.number - 1;
    const score = data.responses[idx]?.score ?? null;
    if (score === null) continue;
    answeredCount += 1;

    if (score <= 2) {
      const spec = PRINCIPLE_FLAGS[principle.slug];
      if (spec) {
        flags.push({
          flagId: `F-${spec.category.toUpperCase()}`,
          category: spec.category,
          priority: spec.priority,
          principleNumber: principle.number,
          description: spec.description,
          suggestedAction: spec.suggestedAction,
        });
      }
    }

    if (score === 1) {
      flags.push({
        flagId: `F-CRITICAL-P${pad2(principle.number)}`,
        category: 'critical-principle-gap',
        priority: 'high',
        principleNumber: principle.number,
        description: `Principle ${principle.number} (${principle.shortTitle}) scored the minimum (1).`,
        suggestedAction: 'Treat this principle as a top-priority coaching focus this cycle.',
      });
    }
  }

  if (answeredCount < 6) {
    flags.push({
      flagId: 'F-INSUFFICIENT-DATA',
      category: 'insufficient-data',
      priority: 'medium',
      principleNumber: null,
      description: 'Fewer than six principles received a score; the composite maturity is not reportable.',
      suggestedAction: 'Complete the remaining principles before relying on the maturity result.',
    });
  }

  return flags;
}

function pad2(n: number): string {
  return n.toString().padStart(2, '0');
}
