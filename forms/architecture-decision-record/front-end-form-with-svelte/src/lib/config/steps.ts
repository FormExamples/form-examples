export interface StepDef {
  number: number;
  slug: string;
  title: string;
  short: string;
}

export const STEPS: StepDef[] = [
  { number: 1,  slug: 'author',                title: 'Author identification',         short: 'Author' },
  { number: 2,  slug: 'organization',          title: 'Organization & context',        short: 'Org' },
  { number: 3,  slug: 'issue',                 title: 'Issue',                         short: 'Issue' },
  { number: 4,  slug: 'decision',              title: 'Decision',                      short: 'Decision' },
  { number: 5,  slug: 'status-group',          title: 'Status & group',                short: 'Status' },
  { number: 6,  slug: 'assumptions',           title: 'Assumptions',                   short: 'Assumptions' },
  { number: 7,  slug: 'constraints',           title: 'Constraints',                   short: 'Constraints' },
  { number: 8,  slug: 'positions',             title: 'Positions (alternatives)',      short: 'Positions' },
  { number: 9,  slug: 'argument',              title: 'Argument',                      short: 'Argument' },
  { number: 10, slug: 'implications',          title: 'Implications',                  short: 'Implications' },
  { number: 11, slug: 'related-decisions',     title: 'Related decisions',             short: 'Decisions' },
  { number: 12, slug: 'related-requirements',  title: 'Related requirements',          short: 'Requirements' },
  { number: 13, slug: 'related-artifacts',     title: 'Related artifacts',             short: 'Artifacts' },
  { number: 14, slug: 'related-principles',    title: 'Related principles',            short: 'Principles' },
  { number: 15, slug: 'notes',                 title: 'Notes',                         short: 'Notes' },
  { number: 16, slug: 'summary',               title: 'Summary & sign-off',            short: 'Sign-off' }
];
