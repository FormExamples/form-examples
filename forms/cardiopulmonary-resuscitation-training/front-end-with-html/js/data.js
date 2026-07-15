// Sample trainee data for the training coordinator dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans both Pass and Fail outcomes, every role
// cohort, and every certification-currency band; critical-action failures
// are flagged on the trainees who failed because of them. AHA standard
// certification validity is two years, so issued + expiry dates are spaced
// accordingly.
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
    traineeId: 'BLS-2025-0042',
    traineeName: 'Ahmed, Yusuf',
    role: 'Nurse',
    outcome: 'Pass',
    criticalActionFailure: false,
    compressionRate: 112,
    compressionDepthCm: 5.4,
    certificationIssued: '2025-08-12',
    certificationExpiry: '2027-08-12',
    certificationCurrency: 'Current',
    instructorName: 'Bennett, Claire',
    trainingCentre: 'NHS Greater Glasgow Resuscitation Academy'
  },
  {
    id: '2',
    traineeId: 'BLS-2025-0061',
    traineeName: 'Okafor, Chiamaka',
    role: 'Doctor',
    outcome: 'Pass',
    criticalActionFailure: false,
    compressionRate: 108,
    compressionDepthCm: 5.7,
    certificationIssued: '2024-11-03',
    certificationExpiry: '2026-11-03',
    certificationCurrency: 'Current',
    instructorName: 'Williams, Mark',
    trainingCentre: 'Guy\u2019s and St Thomas\u2019 Simulation Centre'
  },
  {
    id: '3',
    traineeId: 'BLS-2026-0008',
    traineeName: 'Patel, Rohan',
    role: 'Healthcare Assistant',
    outcome: 'Fail',
    criticalActionFailure: true,
    compressionRate: 86,
    compressionDepthCm: 3.9,
    certificationIssued: '',
    certificationExpiry: '',
    certificationCurrency: 'Expired',
    instructorName: 'Bennett, Claire',
    trainingCentre: 'NHS Greater Glasgow Resuscitation Academy'
  },
  {
    id: '4',
    traineeId: 'BLS-2024-0117',
    traineeName: 'Jenkins, Sophie',
    role: 'Lifeguard',
    outcome: 'Pass',
    criticalActionFailure: false,
    compressionRate: 116,
    compressionDepthCm: 5.2,
    certificationIssued: '2024-05-22',
    certificationExpiry: '2026-05-22',
    certificationCurrency: 'Expiring Soon',
    instructorName: 'Khan, Adil',
    trainingCentre: 'Royal Life Saving Society UK \u2014 Manchester'
  },
  {
    id: '5',
    traineeId: 'BLS-2026-0014',
    traineeName: 'Brown, Marcus',
    role: 'Manual Handler',
    outcome: 'Fail',
    criticalActionFailure: false,
    compressionRate: 96,
    compressionDepthCm: 4.6,
    certificationIssued: '',
    certificationExpiry: '',
    certificationCurrency: 'Expired',
    instructorName: 'O\u2019Connor, Niamh',
    trainingCentre: 'NHS Tayside Workforce Training Hub'
  },
  {
    id: '6',
    traineeId: 'BLS-2025-0099',
    traineeName: 'Hughes, Eleri',
    role: 'Nurse',
    outcome: 'Pass',
    criticalActionFailure: false,
    compressionRate: 110,
    compressionDepthCm: 5.5,
    certificationIssued: '2025-02-18',
    certificationExpiry: '2027-02-18',
    certificationCurrency: 'Current',
    instructorName: 'Williams, Mark',
    trainingCentre: 'Cardiff and Vale UHB Resus Suite'
  },
  {
    id: '7',
    traineeId: 'BLS-2026-0021',
    traineeName: 'MacLeod, Iain',
    role: 'Security Officer',
    outcome: 'Fail',
    criticalActionFailure: true,
    compressionRate: 78,
    compressionDepthCm: 3.4,
    certificationIssued: '',
    certificationExpiry: '',
    certificationCurrency: 'Expired',
    instructorName: 'Bennett, Claire',
    trainingCentre: 'NHS Greater Glasgow Resuscitation Academy'
  },
  {
    id: '8',
    traineeId: 'BLS-2024-0203',
    traineeName: 'Singh, Harpreet',
    role: 'Doctor',
    outcome: 'Pass',
    criticalActionFailure: false,
    compressionRate: 104,
    compressionDepthCm: 5.8,
    certificationIssued: '2024-04-09',
    certificationExpiry: '2026-04-09',
    certificationCurrency: 'Expired',
    instructorName: 'Khan, Adil',
    trainingCentre: 'Guy\u2019s and St Thomas\u2019 Simulation Centre'
  },
  {
    id: '9',
    traineeId: 'BLS-2025-0144',
    traineeName: 'Rossi, Giulia',
    role: 'Healthcare Assistant',
    outcome: 'Pass',
    criticalActionFailure: false,
    compressionRate: 118,
    compressionDepthCm: 5.0,
    certificationIssued: '2025-12-01',
    certificationExpiry: '2027-12-01',
    certificationCurrency: 'Current',
    instructorName: 'O\u2019Connor, Niamh',
    trainingCentre: 'NHS Tayside Workforce Training Hub'
  },
  {
    id: '10',
    traineeId: 'BLS-2024-0187',
    traineeName: 'Whitfield, Thomas',
    role: 'Lifeguard',
    outcome: 'Pass',
    criticalActionFailure: false,
    compressionRate: 114,
    compressionDepthCm: 5.3,
    certificationIssued: '2024-06-15',
    certificationExpiry: '2026-06-15',
    certificationCurrency: 'Expiring Soon',
    instructorName: 'Khan, Adil',
    trainingCentre: 'Royal Life Saving Society UK \u2014 Manchester'
  },
  {
    id: '11',
    traineeId: 'BLS-2026-0030',
    traineeName: 'Nguyen, Linh',
    role: 'Manual Handler',
    outcome: 'Pass',
    criticalActionFailure: false,
    compressionRate: 106,
    compressionDepthCm: 5.1,
    certificationIssued: '2026-01-27',
    certificationExpiry: '2028-01-27',
    certificationCurrency: 'Current',
    instructorName: 'Williams, Mark',
    trainingCentre: 'Cardiff and Vale UHB Resus Suite'
  },
  {
    id: '12',
    traineeId: 'BLS-2026-0035',
    traineeName: 'Kowalski, Aleksander',
    role: 'Security Officer',
    outcome: 'Fail',
    criticalActionFailure: true,
    compressionRate: 82,
    compressionDepthCm: 3.7,
    certificationIssued: '',
    certificationExpiry: '',
    certificationCurrency: 'Expired',
    instructorName: 'O\u2019Connor, Niamh',
    trainingCentre: 'NHS Tayside Workforce Training Hub'
  }
];

export { sampleTrainees };
