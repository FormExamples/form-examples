// Sample request data for the urinalysis vetting dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Ten realistic rows spanning every triage tier (routine / urgent / stat),
// every appropriateness band, and every preanalytical specimen band. NHS
// numbers are placeholder values in the canonical "NNN NNN NNNN" display
// form. Includes the four required worked cases: a routine UTI screen, a
// visible-haematuria 2WW case, a specimen-not-collected case, and a
// no-test-selected case. `tests` lists the selected tests (camelCase keys).

/** @type {import('./types.js').RequestRow[]} */
const sampleRequests = [
  {
    id: 'U001',
    referralDate: '2026-05-04',
    patient: 'Okafor, Amara',
    nhs: '401 234 5678',
    tests: ['dipstick'],
    indication: 'suspected-uti',
    appropriatenessBand: 'usually-appropriate',
    preanalyticalBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'U002',
    referralDate: '2026-05-05',
    patient: 'Bianchi, Sofia',
    nhs: '402 345 6789',
    tests: ['microscopyCultureSensitivity', 'cytology'],
    indication: 'haematuria',
    appropriatenessBand: 'usually-appropriate',
    preanalyticalBand: 'ok',
    triageTier: 'urgent',
    completenessPercent: 95,
    clinician: 'Dr K Mensah',
    flags: ['visible-haematuria-2ww']
  },
  {
    id: 'U003',
    referralDate: '2026-05-05',
    patient: 'Novak, Petra',
    nhs: '403 456 7890',
    tests: ['microscopyCultureSensitivity'],
    indication: 'suspected-uti',
    appropriatenessBand: 'usually-appropriate',
    preanalyticalBand: 'reject-risk',
    triageTier: 'routine',
    completenessPercent: 70,
    clinician: 'Dr L Romano',
    flags: ['specimen-not-collected']
  },
  {
    id: 'U004',
    referralDate: '2026-05-06',
    patient: 'Hassan, Layla',
    nhs: '404 567 8901',
    tests: ['microscopyCultureSensitivity'],
    indication: 'suspected-uti',
    appropriatenessBand: 'usually-appropriate',
    preanalyticalBand: 'caution',
    triageTier: 'stat',
    completenessPercent: 100,
    clinician: 'Dr M Adebayo',
    flags: ['suspected-pyelonephritis']
  },
  {
    id: 'U005',
    referralDate: '2026-05-06',
    patient: 'Connolly, Niamh',
    nhs: '405 678 9012',
    tests: ['albuminCreatinineRatio'],
    indication: 'diabetes-monitoring',
    appropriatenessBand: 'usually-appropriate',
    preanalyticalBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'U006',
    referralDate: '2026-05-07',
    patient: 'Silva, Beatriz',
    nhs: '406 789 0123',
    tests: [],
    indication: 'renal-monitoring',
    appropriatenessBand: 'may-be-appropriate',
    preanalyticalBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 55,
    clinician: 'Dr P Sharma',
    flags: ['no-test-selected']
  },
  {
    id: 'U007',
    referralDate: '2026-05-07',
    patient: 'Andersson, Elin',
    nhs: '407 890 1234',
    tests: ['proteinCreatinineRatio', 'twentyFourHourCollection'],
    indication: 'proteinuria',
    appropriatenessBand: 'usually-appropriate',
    preanalyticalBand: 'caution',
    triageTier: 'routine',
    completenessPercent: 85,
    clinician: 'Dr R Ahmed',
    flags: []
  },
  {
    id: 'U008',
    referralDate: '2026-05-08',
    patient: 'Kowalski, Zofia',
    nhs: '408 901 2345',
    tests: ['drugScreen'],
    indication: 'suspected-uti',
    appropriatenessBand: 'usually-not-appropriate',
    preanalyticalBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 60,
    clinician: 'Dr K Mensah',
    flags: ['missing-clinical-details']
  },
  {
    id: 'U009',
    referralDate: '2026-05-08',
    patient: 'Müller, Hannah',
    nhs: '409 012 3456',
    tests: ['microscopyCultureSensitivity'],
    indication: 'catheter-related',
    appropriatenessBand: 'usually-appropriate',
    preanalyticalBand: 'caution',
    triageTier: 'routine',
    completenessPercent: 90,
    clinician: 'Dr L Romano',
    flags: []
  },
  {
    id: 'U010',
    referralDate: '2026-05-09',
    patient: 'Tanaka, Yuki',
    nhs: '410 123 4567',
    tests: ['dipstick', 'pregnancyTest'],
    indication: 'pregnancy-screen',
    appropriatenessBand: 'usually-appropriate',
    preanalyticalBand: 'ok',
    triageTier: 'urgent',
    completenessPercent: 95,
    clinician: 'Dr M Adebayo',
    flags: []
  }
];

export { sampleRequests };
