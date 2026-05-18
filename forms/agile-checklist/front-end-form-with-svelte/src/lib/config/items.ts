export type SectionId = 'teams' | 'stakeholders' | 'practices';

export interface ItemDef {
  id: string;          // stable slug-id, e.g. 't08' or 's07' or 'p12'
  ordinal: number;     // 1-based ordinal within section
  section: SectionId;
  slug: string;        // kebab-case mnemonic, e.g. 'rarely-wait'
  text: string;        // full question text
}

export const TEAMS_ITEMS: ItemDef[] = [
  { id: 't01', ordinal: 1, section: 'teams', slug: 'problems-to-solve',
    text: 'Teams have problems to solve rather than lists of tasks to perform.' },
  { id: 't02', ordinal: 2, section: 'teams', slug: 'decisions-without-manager',
    text: "Teams generally make decisions without a manager's approval." },
  { id: 't03', ordinal: 3, section: 'teams', slug: 'adopt-and-improve-practices',
    text: 'Teams adopt appropriate practices and improve them over time.' },
  { id: 't04', ordinal: 4, section: 'teams', slug: 'actively-coordinate',
    text: 'Teams working on a common product actively coordinate.' },
  { id: 't05', ordinal: 5, section: 'teams', slug: 'openly-share-ideas',
    text: 'Teams openly share new ideas and experiences with others.' },
  { id: 't06', ordinal: 6, section: 'teams', slug: 'decide-how-to-execute',
    text: 'Teams decide how to execute work.' },
  { id: 't07', ordinal: 7, section: 'teams', slug: 'act-on-feedback',
    text: 'Teams quickly act on stakeholder feedback to improve the product.' },
  { id: 't08', ordinal: 8, section: 'teams', slug: 'rarely-wait',
    text: 'Teams rarely wait for work to be completed by others.' },
  { id: 't09', ordinal: 9, section: 'teams', slug: 'fully-complete-work',
    text: 'Teams make every effort to fully complete all planned work.' },
  { id: 't10', ordinal: 10, section: 'teams', slug: 'manage-own-performance',
    text: 'Teams monitor and manage their own performance.' },
  { id: 't11', ordinal: 11, section: 'teams', slug: 'understand-agile',
    text: 'Teams understand the benefits and challenges of agile.' },
  { id: 't12', ordinal: 12, section: 'teams', slug: 'high-quality',
    text: 'Teams responsibly deliver high quality work.' },
  { id: 't13', ordinal: 13, section: 'teams', slug: 'welcome-change',
    text: 'Teams welcome rather than resist changing requirements.' },
  { id: 't14', ordinal: 14, section: 'teams', slug: 'collaborate-to-finish',
    text: 'Teams collaborate to finish items.' },
  { id: 't15', ordinal: 15, section: 'teams', slug: 'admit-mistakes',
    text: 'Teams admit challenges and mistakes.' },
  { id: 't16', ordinal: 16, section: 'teams', slug: 'work-outside-specialty',
    text: 'Teams can work outside their specialties to achieve goals.' },
  { id: 't17', ordinal: 17, section: 'teams', slug: 'seek-new-skills',
    text: 'Teams seek to learn relevant, new skills.' },
  { id: 't18', ordinal: 18, section: 'teams', slug: 'improve-skills',
    text: 'Teams continue to learn and improve skills.' },
  { id: 't19', ordinal: 19, section: 'teams', slug: 'improve-ways-of-working',
    text: 'Teams actively seek ways to improve ways of working.' },
  { id: 't20', ordinal: 20, section: 'teams', slug: 'various-ways-communicating',
    text: 'Teams choose and use various ways of communicating.' },
  { id: 't21', ordinal: 21, section: 'teams', slug: 'received-basic-training',
    text: 'Teams have all received basic training on agile concepts.' },
  { id: 't22', ordinal: 22, section: 'teams', slug: 'safe-to-dissent',
    text: 'Teams feel safe to express dissenting views.' },
  { id: 't23', ordinal: 23, section: 'teams', slug: 'start-with-open-issues',
    text: 'Teams start work even when some open issues remain.' },
  { id: 't24', ordinal: 24, section: 'teams', slug: 'motivated',
    text: 'Teams are motivated by performing their work.' },
  { id: 't25', ordinal: 25, section: 'teams', slug: 'pride-in-craft',
    text: 'Teams take pride in their craft.' },
];

export const STAKEHOLDERS_ITEMS: ItemDef[] = [
  { id: 's01', ordinal: 1, section: 'stakeholders', slug: 'know-priority-factors',
    text: 'Stakeholders know which factors determine priorities and deadlines.' },
  { id: 's02', ordinal: 2, section: 'stakeholders', slug: 'accept-plan-ranges',
    text: 'Stakeholders accept plans that are expressed with ranges.' },
  { id: 's03', ordinal: 3, section: 'stakeholders', slug: 'accept-plan-changes',
    text: 'Stakeholders and the team accept that plans may need to change.' },
  { id: 's04', ordinal: 4, section: 'stakeholders', slug: 'evaluate-product',
    text: 'Stakeholders have frequent opportunities to evaluate the product.' },
  { id: 's05', ordinal: 5, section: 'stakeholders', slug: 'champion-agile',
    text: 'Stakeholders champion agile values and agile principles.' },
  { id: 's06', ordinal: 6, section: 'stakeholders', slug: 'respect-quality',
    text: 'Stakeholders see quality as a right that the team has and they respect it.' },
  { id: 's07', ordinal: 7, section: 'stakeholders', slug: 'delegate-authority',
    text: 'Stakeholders delegate authority to teams.' },
  { id: 's08', ordinal: 8, section: 'stakeholders', slug: 'keep-authority-delegated',
    text: "Stakeholders don't take authority back at the first sign of trouble." },
  { id: 's09', ordinal: 9, section: 'stakeholders', slug: 'support-experiments',
    text: 'Stakeholders support teams in experimenting.' },
  { id: 's10', ordinal: 10, section: 'stakeholders', slug: 'no-punish-experiments',
    text: "Stakeholders don't punish an unsuccessful experiment." },
  { id: 's11', ordinal: 11, section: 'stakeholders', slug: 'communicate-agile-goals',
    text: 'Stakeholders communicate what they hope to achieve by becoming more agile.' },
  { id: 's12', ordinal: 12, section: 'stakeholders', slug: 'encourage-new-skills',
    text: 'Stakeholders actively encourage teams to learn new skills.' },
  { id: 's13', ordinal: 13, section: 'stakeholders', slug: 'encourage-new-ways',
    text: 'Stakeholders actively encourage teams to learn new ways of working.' },
  { id: 's14', ordinal: 14, section: 'stakeholders', slug: 'develop-people',
    text: 'Stakeholders develop people rather than manage their performance.' },
];

export const PRACTICES_ITEMS: ItemDef[] = [
  { id: 'p01', ordinal: 1, section: 'practices', slug: 'early-good-release',
    text: 'The early release of a good product is generally favoured over the later release of a perfect product.' },
  { id: 'p02', ordinal: 2, section: 'practices', slug: 'educated-sponsor',
    text: 'An educated executive sponsor ensures the change agent is empowered to make decisions.' },
  { id: 'p03', ordinal: 3, section: 'practices', slug: 'quick-decisions',
    text: 'Decisions are made quickly, sometimes with incomplete knowledge.' },
  { id: 'p04', ordinal: 4, section: 'practices', slug: 'plans-data-based',
    text: 'Plans are based on data and experience.' },
  { id: 'p05', ordinal: 5, section: 'practices', slug: 'proactive-dependencies',
    text: 'Dependencies between teams are proactively identified and addressed.' },
  { id: 'p06', ordinal: 6, section: 'practices', slug: 'good-intentions',
    text: 'People are assumed to have acted with good intentions even when something goes wrong.' },
  { id: 'p07', ordinal: 7, section: 'practices', slug: 'reciprocal-trust',
    text: 'Trust is reciprocal within the team and with stakeholders.' },
  { id: 'p08', ordinal: 8, section: 'practices', slug: 'docs-plus-conversations',
    text: 'Although formal documentation may exist, it is supplemented by conversations to the extent possible.' },
  { id: 'p09', ordinal: 9, section: 'practices', slug: 'update-plans',
    text: 'As more is learned, plans are updated rather than remaining based on outdated information.' },
  { id: 'p10', ordinal: 10, section: 'practices', slug: 'non-punitive',
    text: "A non-punitive attitude leads to the team's willingness to experiment with new tools, technologies, and ways of working." },
  { id: 'p11', ordinal: 11, section: 'practices', slug: 'outside-groups-aware',
    text: 'Outside groups that partner with the team are aware of how this new way of working may affect their interactions.' },
  { id: 'p12', ordinal: 12, section: 'practices', slug: 'finished-over-wip',
    text: 'The organisation places a higher value on finished work than it does on the number of work items in process.' },
  { id: 'p13', ordinal: 13, section: 'practices', slug: 'quality-over-deadline',
    text: 'Quality is rarely, if ever, sacrificed to meet a deadline.' },
  { id: 'p14', ordinal: 14, section: 'practices', slug: 'solution-over-blame',
    text: 'When problems arise between teams, everyone focuses on a solution rather than blame.' },
  { id: 'p15', ordinal: 15, section: 'practices', slug: 'change-agents-in-place',
    text: 'Change agents are in place to help support and guide the transition.' },
  { id: 'p16', ordinal: 16, section: 'practices', slug: 'agile-beyond-origin',
    text: 'Agile practices are being implemented beyond the group in which agile began.' },
  { id: 'p17', ordinal: 17, section: 'practices', slug: 'one-team',
    text: 'Most people are assigned to only one team.' },
  { id: 'p18', ordinal: 18, section: 'practices', slug: 'honor-commitments',
    text: 'People honour commitments and keep promises.' },
];

export const ALL_ITEMS: ItemDef[] = [
  ...TEAMS_ITEMS,
  ...STAKEHOLDERS_ITEMS,
  ...PRACTICES_ITEMS,
];

export const TOTAL_ITEMS = ALL_ITEMS.length; // 57
export const TOTAL_TEAMS_ITEMS = TEAMS_ITEMS.length; // 25
export const TOTAL_STAKEHOLDERS_ITEMS = STAKEHOLDERS_ITEMS.length; // 14
export const TOTAL_PRACTICES_ITEMS = PRACTICES_ITEMS.length; // 18

export function itemById(id: string): ItemDef | undefined {
  return ALL_ITEMS.find((i) => i.id === id);
}

export const SECTION_LABEL: Record<SectionId, string> = {
  teams: 'Teams',
  stakeholders: 'Stakeholders',
  practices: 'Practices',
};
