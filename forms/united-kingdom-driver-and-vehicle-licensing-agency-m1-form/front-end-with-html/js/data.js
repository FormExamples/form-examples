// Sample applicant data for the UK DVLA M1 clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every Q2 category, three with the suicidal-
// thoughts variant, varied recent-contact and high-priority flag counts.

/**
 * Mental health condition category labels (Q2) for the DVLA M1 form.
 * These exact strings are the canonical labels also used as filter values.
 */
const conditionCategories = {
  anxietyDepressionMild: 'Anxiety or depression (without impairment)',
  anxietyDepressionSevere: 'Anxiety or depression (with suicidal thoughts or impairment)',
  bipolar: 'Bipolar affective disorder',
  eatingDisorder: 'Eating disorder',
  ocdPtsd: 'OCD or PTSD',
  personalityDisorder: 'Personality disorder',
  schizophreniaPsychosis: 'Schizophrenia, psychosis, delusional or schizoaffective disorder',
  other: 'Other'
};

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    applicantName: 'Smith, Jane',
    dateOfBirth: '1985-04-12',
    drivingLicenceNumber: 'SMITH854124JM9AB',
    mentalHealthConditions: [conditionCategories.anxietyDepressionMild],
    suicidalThoughtsVariant: false,
    recentContact: true,
    highPriorityFlagCount: 0,
    submittedAt: '2026-04-15T09:24:00Z'
  },
  {
    id: '2',
    applicantName: 'Patel, Priya',
    dateOfBirth: '1972-09-30',
    drivingLicenceNumber: 'PATEL729302PR9CD',
    mentalHealthConditions: [conditionCategories.bipolar],
    suicidalThoughtsVariant: false,
    recentContact: true,
    highPriorityFlagCount: 1,
    submittedAt: '2026-04-16T10:05:00Z'
  },
  {
    id: '3',
    applicantName: 'Jones, Margaret',
    dateOfBirth: '1968-01-21',
    drivingLicenceNumber: 'JONES681213MA9EF',
    mentalHealthConditions: [conditionCategories.anxietyDepressionSevere],
    suicidalThoughtsVariant: true,
    recentContact: true,
    highPriorityFlagCount: 2,
    submittedAt: '2026-04-17T14:42:00Z'
  },
  {
    id: '4',
    applicantName: 'Williams, David',
    dateOfBirth: '1990-07-08',
    drivingLicenceNumber: 'WILLI907084DA9GH',
    mentalHealthConditions: [conditionCategories.ocdPtsd],
    suicidalThoughtsVariant: false,
    recentContact: false,
    highPriorityFlagCount: 0,
    submittedAt: '2026-04-18T08:11:00Z'
  },
  {
    id: '5',
    applicantName: 'Brown, Sarah',
    dateOfBirth: '1979-12-15',
    drivingLicenceNumber: 'BROWN791215SA9IJ',
    mentalHealthConditions: [
      conditionCategories.schizophreniaPsychosis,
      conditionCategories.anxietyDepressionSevere
    ],
    suicidalThoughtsVariant: true,
    recentContact: true,
    highPriorityFlagCount: 3,
    submittedAt: '2026-04-19T16:30:00Z'
  },
  {
    id: '6',
    applicantName: 'Taylor, James',
    dateOfBirth: '1995-03-27',
    drivingLicenceNumber: 'TAYLO953272JA9KL',
    mentalHealthConditions: [conditionCategories.eatingDisorder],
    suicidalThoughtsVariant: false,
    recentContact: true,
    highPriorityFlagCount: 1,
    submittedAt: '2026-04-20T11:18:00Z'
  },
  {
    id: '7',
    applicantName: 'Davies, Helen',
    dateOfBirth: '1963-06-04',
    drivingLicenceNumber: 'DAVIE636044HE9MN',
    mentalHealthConditions: [conditionCategories.personalityDisorder],
    suicidalThoughtsVariant: false,
    recentContact: false,
    highPriorityFlagCount: 1,
    submittedAt: '2026-04-21T13:55:00Z'
  },
  {
    id: '8',
    applicantName: 'Wilson, Robert',
    dateOfBirth: '1982-11-18',
    drivingLicenceNumber: 'WILSO821118RO9OP',
    mentalHealthConditions: [conditionCategories.anxietyDepressionMild],
    suicidalThoughtsVariant: false,
    recentContact: false,
    highPriorityFlagCount: 0,
    submittedAt: '2026-04-22T09:47:00Z'
  },
  {
    id: '9',
    applicantName: 'Evans, Catherine',
    dateOfBirth: '1957-02-09',
    drivingLicenceNumber: 'EVANS572094CA9QR',
    mentalHealthConditions: [conditionCategories.schizophreniaPsychosis],
    suicidalThoughtsVariant: false,
    recentContact: true,
    highPriorityFlagCount: 2,
    submittedAt: '2026-04-23T15:22:00Z'
  },
  {
    id: '10',
    applicantName: 'Thomas, Michael',
    dateOfBirth: '1988-08-23',
    drivingLicenceNumber: 'THOMA888234MI9ST',
    mentalHealthConditions: [conditionCategories.other],
    suicidalThoughtsVariant: false,
    recentContact: true,
    highPriorityFlagCount: 0,
    submittedAt: '2026-04-24T10:39:00Z'
  },
  {
    id: '11',
    applicantName: 'Robinson, Emma',
    dateOfBirth: '1976-05-02',
    drivingLicenceNumber: 'ROBIN765024EM9UV',
    mentalHealthConditions: [
      conditionCategories.anxietyDepressionSevere,
      conditionCategories.ocdPtsd
    ],
    suicidalThoughtsVariant: true,
    recentContact: true,
    highPriorityFlagCount: 2,
    submittedAt: '2026-04-25T12:14:00Z'
  },
  {
    id: '12',
    applicantName: 'Clark, George',
    dateOfBirth: '1949-10-31',
    drivingLicenceNumber: 'CLARK491031GE9WX',
    mentalHealthConditions: [
      conditionCategories.bipolar,
      conditionCategories.personalityDisorder
    ],
    suicidalThoughtsVariant: false,
    recentContact: false,
    highPriorityFlagCount: 1,
    submittedAt: '2026-04-26T17:06:00Z'
  }
];

export { conditionCategories, samplePatients };
