export interface StepDefinition {
  number: number;
  slug: string;
  title: string;
  lp1hSection: string;
  description: string;
}

export const STEPS: StepDefinition[] = [
  {
    number: 1,
    slug: 'donor',
    title: 'Donor identification',
    lp1hSection: 's.1',
    description: 'Full name, date of birth, address, and any other names the donor uses.',
  },
  {
    number: 2,
    slug: 'scope',
    title: 'LPA scope and activation',
    lp1hSection: 's.4–5',
    description: 'Jurisdiction (England or Wales) and confirmation that the LPA only operates after registration and loss of capacity.',
  },
  {
    number: 3,
    slug: 'attorneys',
    title: 'Attorneys',
    lp1hSection: 's.2',
    description: '1 to 4 named attorneys with their details and relationship to the donor.',
  },
  {
    number: 4,
    slug: 'decision-rule',
    title: 'Attorney decision rules',
    lp1hSection: 's.3',
    description: 'Jointly, jointly and severally, or jointly for some decisions and severally for others.',
  },
  {
    number: 5,
    slug: 'replacement-attorneys',
    title: 'Replacement attorneys',
    lp1hSection: 's.4',
    description: '0 to 4 replacement attorneys and the conditions under which they take over.',
  },
  {
    number: 6,
    slug: 'life-sustaining-treatment',
    title: 'Life-sustaining treatment',
    lp1hSection: 's.5',
    description: 'Option A (attorneys may decide) or Option B (donor reserves the decision).',
  },
  {
    number: 7,
    slug: 'preferences',
    title: 'Preferences',
    lp1hSection: 's.7 (preferences)',
    description: 'Non-binding guidance for the attorneys on residence, contact, religion, food, and end-of-life care.',
  },
  {
    number: 8,
    slug: 'instructions',
    title: 'Instructions',
    lp1hSection: 's.7 (instructions)',
    description: 'Binding constraints on the attorneys; must be lawful, possible, and consistent with any ADRT.',
  },
  {
    number: 9,
    slug: 'people-to-notify',
    title: 'People to notify',
    lp1hSection: 's.6',
    description: '0 to 5 named recipients of the notice of intention to register.',
  },
  {
    number: 10,
    slug: 'certificate-provider',
    title: 'Certificate provider',
    lp1hSection: 's.10',
    description: 'Independent skill-based (registered profession) or knowledge-based (known donor ≥ 2 years) certifier.',
  },
  {
    number: 11,
    slug: 'donor-signature',
    title: 'Donor signature and witness',
    lp1hSection: 's.9',
    description: 'Donor signature, signing date, and witness details.',
  },
  {
    number: 12,
    slug: 'attorney-signatures',
    title: 'Attorney signatures and witnesses',
    lp1hSection: 's.11',
    description: 'Each attorney signs after the donor and certificate provider; witness details for each signature.',
  },
  {
    number: 13,
    slug: 'registration',
    title: 'Registration application',
    lp1hSection: 'Part C',
    description: 'Applicant identity, signature, and registration fee (or remission / exemption).',
  },
  {
    number: 14,
    slug: 'summary',
    title: 'Validity summary',
    lp1hSection: 'computed',
    description: 'Completeness score, fired statutory rules, ambiguity flags, and OPG submission packet.',
  },
];

export const STEP_COUNT = STEPS.length;

export function stepByNumber(n: number): StepDefinition | undefined {
  return STEPS.find((s) => s.number === n);
}
