// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every screening outcome, every age group,
// and every referral status; NHS numbers in the canonical "NNN NNN NNNN"
// display form.

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Thompson, Alex',
    aq10Score: 7,
    screeningOutcome: 'At or above threshold',
    ageGroup: 'Adult',
    referralStatus: 'Referred for assessment'
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Anika',
    aq10Score: 3,
    screeningOutcome: 'Below threshold',
    ageGroup: 'Adolescent',
    referralStatus: 'No referral needed'
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Oliver',
    aq10Score: 9,
    screeningOutcome: 'At or above threshold',
    ageGroup: 'Child',
    referralStatus: 'Urgent referral'
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, Emma',
    aq10Score: 2,
    screeningOutcome: 'Below threshold',
    ageGroup: 'Adult',
    referralStatus: 'No referral needed'
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Liam',
    aq10Score: 8,
    screeningOutcome: 'At or above threshold',
    ageGroup: 'Adult',
    referralStatus: 'Referred for assessment'
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, Sophie',
    aq10Score: 6,
    screeningOutcome: 'At or above threshold',
    ageGroup: 'Adolescent',
    referralStatus: 'Referred for assessment'
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Noah',
    aq10Score: 4,
    screeningOutcome: 'Below threshold',
    ageGroup: 'Child',
    referralStatus: 'Monitoring'
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Charlotte',
    aq10Score: 10,
    screeningOutcome: 'At or above threshold',
    ageGroup: 'Child',
    referralStatus: 'Urgent referral'
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, James',
    aq10Score: 5,
    screeningOutcome: 'Below threshold',
    ageGroup: 'Adult',
    referralStatus: 'No referral needed'
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Amelia',
    aq10Score: 1,
    screeningOutcome: 'Below threshold',
    ageGroup: 'Adult',
    referralStatus: 'No referral needed'
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Harry',
    aq10Score: 7,
    screeningOutcome: 'At or above threshold',
    ageGroup: 'Adolescent',
    referralStatus: 'Referred for assessment'
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, Isabella',
    aq10Score: 0,
    screeningOutcome: 'Below threshold',
    ageGroup: 'Child',
    referralStatus: 'No referral needed'
  }
];

export { samplePatients };
