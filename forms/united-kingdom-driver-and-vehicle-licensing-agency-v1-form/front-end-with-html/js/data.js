// Sample applicant data for the UK DVLA V1 clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans monocular vision, glaucoma, and diplopia
// declarations; mix of complete and partial validation states.

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    applicantName: 'Smith, Jane',
    dateOfBirth: '1962-04-12',
    drivingLicenceNumber: 'SMITH604124JE9AB',
    monocularVision: false,
    glaucomaDeclared: false,
    diplopiaDeclared: false,
    highPriorityFlagCount: 0,
    validationCompleteness: 100,
    submittedAt: '2026-04-12T09:14:00Z'
  },
  {
    id: '2',
    applicantName: 'Patel, Priya',
    dateOfBirth: '1975-11-03',
    drivingLicenceNumber: 'PATEL751103PR9CD',
    monocularVision: false,
    glaucomaDeclared: true,
    diplopiaDeclared: false,
    highPriorityFlagCount: 1,
    validationCompleteness: 100,
    submittedAt: '2026-04-13T14:22:00Z'
  },
  {
    id: '3',
    applicantName: 'Jones, Margaret',
    dateOfBirth: '1948-06-27',
    drivingLicenceNumber: 'JONES486276MA2EF',
    monocularVision: true,
    glaucomaDeclared: true,
    diplopiaDeclared: true,
    highPriorityFlagCount: 3,
    validationCompleteness: 100,
    submittedAt: '2026-04-14T10:05:00Z'
  },
  {
    id: '4',
    applicantName: 'Williams, David',
    dateOfBirth: '1981-09-15',
    drivingLicenceNumber: 'WILLI809155DA3GH',
    monocularVision: false,
    glaucomaDeclared: false,
    diplopiaDeclared: false,
    highPriorityFlagCount: 0,
    validationCompleteness: 75,
    submittedAt: '2026-04-15T08:48:00Z'
  },
  {
    id: '5',
    applicantName: 'Brown, Sarah',
    dateOfBirth: '1957-02-19',
    drivingLicenceNumber: 'BROWN572195SA4IJ',
    monocularVision: true,
    glaucomaDeclared: false,
    diplopiaDeclared: false,
    highPriorityFlagCount: 1,
    validationCompleteness: 100,
    submittedAt: '2026-04-16T16:31:00Z'
  },
  {
    id: '6',
    applicantName: 'Taylor, James',
    dateOfBirth: '1990-12-01',
    drivingLicenceNumber: 'TAYLO901201JA5KL',
    monocularVision: false,
    glaucomaDeclared: false,
    diplopiaDeclared: false,
    highPriorityFlagCount: 0,
    validationCompleteness: 100,
    submittedAt: '2026-04-17T11:09:00Z'
  },
  {
    id: '7',
    applicantName: 'Davies, Helen',
    dateOfBirth: '1969-08-23',
    drivingLicenceNumber: 'DAVIE698236HE6MN',
    monocularVision: false,
    glaucomaDeclared: true,
    diplopiaDeclared: false,
    highPriorityFlagCount: 1,
    validationCompleteness: 50,
    submittedAt: '2026-04-18T13:54:00Z'
  },
  {
    id: '8',
    applicantName: 'Wilson, Robert',
    dateOfBirth: '1953-05-08',
    drivingLicenceNumber: 'WILSO535086RO7OP',
    monocularVision: false,
    glaucomaDeclared: false,
    diplopiaDeclared: true,
    highPriorityFlagCount: 1,
    validationCompleteness: 100,
    submittedAt: '2026-04-19T15:27:00Z'
  },
  {
    id: '9',
    applicantName: 'Evans, Catherine',
    dateOfBirth: '1986-10-14',
    drivingLicenceNumber: 'EVANS861014CA8QR',
    monocularVision: false,
    glaucomaDeclared: false,
    diplopiaDeclared: false,
    highPriorityFlagCount: 0,
    validationCompleteness: 100,
    submittedAt: '2026-04-20T10:42:00Z'
  },
  {
    id: '10',
    applicantName: 'Thomas, Michael',
    dateOfBirth: '1944-03-30',
    drivingLicenceNumber: 'THOMA443301MI9ST',
    monocularVision: true,
    glaucomaDeclared: true,
    diplopiaDeclared: true,
    highPriorityFlagCount: 3,
    validationCompleteness: 100,
    submittedAt: '2026-04-21T09:18:00Z'
  },
  {
    id: '11',
    applicantName: 'Robinson, Emma',
    dateOfBirth: '1995-07-21',
    drivingLicenceNumber: 'ROBIN957215EM0UV',
    monocularVision: false,
    glaucomaDeclared: false,
    diplopiaDeclared: false,
    highPriorityFlagCount: 0,
    validationCompleteness: 25,
    submittedAt: '2026-04-22T14:03:00Z'
  },
  {
    id: '12',
    applicantName: 'Clark, George',
    dateOfBirth: '1971-01-05',
    drivingLicenceNumber: 'CLARK710105GE1WX',
    monocularVision: false,
    glaucomaDeclared: false,
    diplopiaDeclared: true,
    highPriorityFlagCount: 1,
    validationCompleteness: 100,
    submittedAt: '2026-04-23T11:36:00Z'
  }
];

export { samplePatients };
