// Sample trainee data for the First Aid at Work training coordinator
// dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans Pass, Needs Development, and Fail outcomes;
// covers every workplace-role cohort; spans every certification-currency
// band. UK HSE FAW standard certification validity is three years, so
// issued + expiry dates are spaced accordingly.
//
// Reference "today" for the seed data is 2026-05-04. Some expiry dates
// fall before that (Expired), some within ~60 days (Expiring Soon), most
// well after it (Current). The sample is static so the page is
// deterministic, but `app.js` recomputes the currency band from the
// expiry date at render time, so the dataset stays sensible if "today"
// drifts.

/** @type {import('./types.js').TraineeRow[]} */
const sampleTrainees = [
  {
    id: '1',
    traineeId: 'FAW-2025-0042',
    traineeName: 'Ahmed, Yusuf',
    role: 'Designated First Aider',
    outcome: 'Pass',
    skillsPassed: 24,
    skillsTotal: 24,
    certificationIssued: '2025-08-12',
    certificationExpiry: '2028-08-12',
    certificationCurrency: 'Current',
    assessorName: 'Bennett, Claire',
    trainingCentre: 'St John Ambulance \u2014 London Regional Centre'
  },
  {
    id: '2',
    traineeId: 'FAW-2025-0061',
    traineeName: 'Okafor, Chiamaka',
    role: 'Manager',
    outcome: 'Pass',
    skillsPassed: 23,
    skillsTotal: 24,
    certificationIssued: '2024-11-03',
    certificationExpiry: '2027-11-03',
    certificationCurrency: 'Current',
    assessorName: 'Williams, Mark',
    trainingCentre: 'British Red Cross Training \u2014 Manchester'
  },
  {
    id: '3',
    traineeId: 'FAW-2026-0008',
    traineeName: 'Patel, Rohan',
    role: 'NHS Reception',
    outcome: 'Fail',
    skillsPassed: 14,
    skillsTotal: 24,
    certificationIssued: '',
    certificationExpiry: '',
    certificationCurrency: 'Expired',
    assessorName: 'Bennett, Claire',
    trainingCentre: 'St John Ambulance \u2014 London Regional Centre'
  },
  {
    id: '4',
    traineeId: 'FAW-2024-0117',
    traineeName: 'Jenkins, Sophie',
    role: 'Lifeguard',
    outcome: 'Pass',
    skillsPassed: 24,
    skillsTotal: 24,
    certificationIssued: '2023-05-22',
    certificationExpiry: '2026-05-22',
    certificationCurrency: 'Expiring Soon',
    assessorName: 'Khan, Adil',
    trainingCentre: 'Royal Life Saving Society UK \u2014 Manchester'
  },
  {
    id: '5',
    traineeId: 'FAW-2026-0014',
    traineeName: 'Brown, Marcus',
    role: 'Factory Worker',
    outcome: 'Needs Development',
    skillsPassed: 19,
    skillsTotal: 24,
    certificationIssued: '',
    certificationExpiry: '',
    certificationCurrency: 'Expired',
    assessorName: 'O\u2019Connor, Niamh',
    trainingCentre: 'Highfield Awarding Body \u2014 Doncaster'
  },
  {
    id: '6',
    traineeId: 'FAW-2025-0099',
    traineeName: 'Hughes, Eleri',
    role: 'School Teacher',
    outcome: 'Pass',
    skillsPassed: 24,
    skillsTotal: 24,
    certificationIssued: '2025-02-18',
    certificationExpiry: '2028-02-18',
    certificationCurrency: 'Current',
    assessorName: 'Williams, Mark',
    trainingCentre: 'St John Cymru \u2014 Cardiff Centre'
  },
  {
    id: '7',
    traineeId: 'FAW-2026-0021',
    traineeName: 'MacLeod, Iain',
    role: 'Security Officer',
    outcome: 'Fail',
    skillsPassed: 12,
    skillsTotal: 24,
    certificationIssued: '',
    certificationExpiry: '',
    certificationCurrency: 'Expired',
    assessorName: 'Bennett, Claire',
    trainingCentre: 'St Andrew\u2019s First Aid \u2014 Glasgow'
  },
  {
    id: '8',
    traineeId: 'FAW-2023-0203',
    traineeName: 'Singh, Harpreet',
    role: 'Hotel Staff',
    outcome: 'Pass',
    skillsPassed: 22,
    skillsTotal: 24,
    certificationIssued: '2023-04-09',
    certificationExpiry: '2026-04-09',
    certificationCurrency: 'Expired',
    assessorName: 'Khan, Adil',
    trainingCentre: 'British Red Cross Training \u2014 Manchester'
  },
  {
    id: '9',
    traineeId: 'FAW-2025-0144',
    traineeName: 'Rossi, Giulia',
    role: 'Hotel Staff',
    outcome: 'Pass',
    skillsPassed: 24,
    skillsTotal: 24,
    certificationIssued: '2025-12-01',
    certificationExpiry: '2028-12-01',
    certificationCurrency: 'Current',
    assessorName: 'O\u2019Connor, Niamh',
    trainingCentre: 'Highfield Awarding Body \u2014 Doncaster'
  },
  {
    id: '10',
    traineeId: 'FAW-2024-0187',
    traineeName: 'Whitfield, Thomas',
    role: 'Lifeguard',
    outcome: 'Needs Development',
    skillsPassed: 20,
    skillsTotal: 24,
    certificationIssued: '2023-06-15',
    certificationExpiry: '2026-06-15',
    certificationCurrency: 'Expiring Soon',
    assessorName: 'Khan, Adil',
    trainingCentre: 'Royal Life Saving Society UK \u2014 Manchester'
  },
  {
    id: '11',
    traineeId: 'FAW-2026-0030',
    traineeName: 'Nguyen, Linh',
    role: 'School Teacher',
    outcome: 'Pass',
    skillsPassed: 23,
    skillsTotal: 24,
    certificationIssued: '2026-01-27',
    certificationExpiry: '2029-01-27',
    certificationCurrency: 'Current',
    assessorName: 'Williams, Mark',
    trainingCentre: 'St John Cymru \u2014 Cardiff Centre'
  },
  {
    id: '12',
    traineeId: 'FAW-2026-0035',
    traineeName: 'Kowalski, Aleksander',
    role: 'Designated First Aider',
    outcome: 'Fail',
    skillsPassed: 11,
    skillsTotal: 24,
    certificationIssued: '',
    certificationExpiry: '',
    certificationCurrency: 'Expired',
    assessorName: 'O\u2019Connor, Niamh',
    trainingCentre: 'Highfield Awarding Body \u2014 Doncaster'
  }
];

export { sampleTrainees };
