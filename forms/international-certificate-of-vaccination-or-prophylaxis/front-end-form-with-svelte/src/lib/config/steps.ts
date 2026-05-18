export const STEPS = [
  { n: 1, slug: 'centre-and-clinician', title: 'Centre & clinician' },
  { n: 2, slug: 'vaccinee-identity', title: 'Vaccinee identity' },
  { n: 3, slug: 'vaccinee-signature', title: 'Vaccinee signature & consent' },
  { n: 4, slug: 'travel-context', title: 'Travel context' },
  { n: 5, slug: 'entry-disease-vaccine', title: 'Vaccination entry — disease & vaccine' },
  { n: 6, slug: 'entry-administration', title: 'Vaccination entry — administration' },
  { n: 7, slug: 'entry-validity-stamp', title: 'Vaccination entry — validity & stamp' },
  { n: 8, slug: 'summary', title: 'Summary & sign-off' },
] as const;

export const TOTAL_STEPS = STEPS.length;
