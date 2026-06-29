export interface PrincipleDef {
  number: number;
  slug: string;
  shortTitle: string;
  prompt: string;
  description: string;
}

export const PRINCIPLES: PrincipleDef[] = [
  {
    number: 1,
    slug: 'customer-satisfaction',
    shortTitle: 'Customer satisfaction',
    prompt:
      'Our highest priority is to satisfy the customer through early and continuous delivery of valuable software.',
    description:
      'We measure success by customer outcomes, not by milestones met. Working software reaches real users early and often, and feedback shapes the next iteration.',
  },
  {
    number: 2,
    slug: 'welcome-change',
    shortTitle: 'Welcome change',
    prompt:
      'Changing requirements are welcomed, even late in development, to harness competitive advantage.',
    description:
      'New information is treated as a gift, not a threat. The team adapts the plan when the world changes; change-control overhead is light.',
  },
  {
    number: 3,
    slug: 'deliver-frequently',
    shortTitle: 'Deliver frequently',
    prompt:
      'We deliver working software frequently, in short cycles ranging from a couple of weeks to a couple of months, with a preference for the shorter timescale.',
    description:
      'Releases are routine and low-drama. Cycle time is measured in days or low weeks, not quarters.',
  },
  {
    number: 4,
    slug: 'collaboration',
    shortTitle: 'Daily collaboration',
    prompt:
      'Business stakeholders and developers work together daily throughout the project.',
    description:
      'Product, business, and engineering share context and decisions in real time. There is no over-the-wall handover.',
  },
  {
    number: 5,
    slug: 'motivated-individuals',
    shortTitle: 'Motivated individuals',
    prompt:
      'We build projects around motivated individuals, give them the environment and support they need, and trust them to get the job done.',
    description:
      'Hiring, environment, tooling, and management style are all set up to attract and keep motivated people, and to remove obstacles instead of adding them.',
  },
  {
    number: 6,
    slug: 'face-to-face',
    shortTitle: 'Face-to-face conversation',
    prompt:
      'The most efficient and effective method of conveying information within and to a development team is rich, real-time conversation (face-to-face or its synchronous video equivalent).',
    description:
      'Critical decisions are made in conversation, not in long async threads. Documentation captures decisions; it does not replace them.',
  },
  {
    number: 7,
    slug: 'working-software',
    shortTitle: 'Working software',
    prompt: 'Working software is the primary measure of progress.',
    description:
      'We track shipped, working capability — not story points, hours, or the percentage of a Gantt chart that is green.',
  },
  {
    number: 8,
    slug: 'sustainable-development',
    shortTitle: 'Sustainable development',
    prompt:
      'Agile processes promote sustainable development. Sponsors, developers, and users should be able to maintain a constant pace indefinitely.',
    description:
      'We do not rely on heroics, weekends, or crunch. Velocity is what the team can hold next quarter and the quarter after that.',
  },
  {
    number: 9,
    slug: 'technical-excellence',
    shortTitle: 'Technical excellence',
    prompt:
      'Continuous attention to technical excellence and good design enhances agility.',
    description:
      'Refactoring, automated tests, code review, and infrastructure quality are part of the work, not a separate "later" project.',
  },
  {
    number: 10,
    slug: 'simplicity',
    shortTitle: 'Simplicity',
    prompt:
      'Simplicity — the art of maximising the amount of work not done — is essential.',
    description:
      'We pull only what we are certain we need. Scope is actively trimmed; we do not gold-plate, over-engineer, or build for hypothetical futures.',
  },
  {
    number: 11,
    slug: 'self-organising-teams',
    shortTitle: 'Self-organising teams',
    prompt:
      'The best architectures, requirements, and designs emerge from self-organising teams.',
    description:
      'Teams choose how to deliver outcomes. Architecture decisions sit with the people closest to the work; managers set context and remove blockers.',
  },
  {
    number: 12,
    slug: 'regular-reflection',
    shortTitle: 'Regular reflection',
    prompt:
      'At regular intervals the team reflects on how to become more effective, then tunes and adjusts its behaviour accordingly.',
    description:
      'Retrospectives happen on a schedule, produce concrete experiments, and the team verifies whether each experiment worked.',
  },
];

export const TOTAL_PRINCIPLES = PRINCIPLES.length;
