import type { FitNoteAssessment } from '#lib/engine/types.js';

export interface StepDef {
  number: number;
  slug: string;
  title: string;
  short: string;
  /** Fields tracked for progress (the same lists the HTML front-end counts). */
  fields: Array<keyof FitNoteAssessment>;
  /** True when answering any one tracked field completes the step. */
  any?: boolean;
}

export const STEPS: StepDef[] = [
  {
    number: 1,
    slug: 'employee',
    title: 'Employee',
    short: 'Employee',
    fields: ['employeeName', 'employeeBirthDate', 'employerName']
  },
  {
    number: 2,
    slug: 'assessment',
    title: 'Assessment',
    short: 'Assessment',
    fields: ['assessmentDate', 'assessmentMethod']
  },
  {
    number: 3,
    slug: 'condition',
    title: 'Condition',
    short: 'Condition',
    fields: ['diagnosisPrimary']
  },
  {
    number: 4,
    slug: 'advice',
    title: 'Fitness advice',
    short: 'Advice',
    fields: ['fitnessAdvice']
  },
  {
    number: 5,
    slug: 'adjustments',
    title: 'Adjustments',
    short: 'Adjustments',
    fields: [
      'adjustmentPhasedReturn',
      'adjustmentAlteredHours',
      'adjustmentAmendedDuties',
      'adjustmentWorkplaceAdaptations'
    ],
    any: true
  },
  {
    number: 6,
    slug: 'period',
    title: 'Period',
    short: 'Period',
    fields: ['periodFrom', 'periodTo', 'reassessmentRequired']
  },
  {
    number: 7,
    slug: 'sign-off',
    title: 'Consent and sign-off',
    short: 'Sign-off',
    fields: [
      'employeeConsentToShare',
      'clinicianRegistrationBody',
      'clinicianRegistrationNumber',
      'clinicianDeclaration'
    ]
  },
  { number: 8, slug: 'report', title: 'Report', short: 'Report', fields: [] }
];

export const TOTAL_STEPS = STEPS.length;
