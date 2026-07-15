// Sample request data for the hearing test request vetting dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Ten realistic rows spanning every triage tier (routine / urgent /
// emergency), every appropriateness band, and every clinical priority band.
// NHS numbers are placeholder values in the canonical "NNN NNN NNNN" display
// form. Includes the required worked cases: a routine hearing-loss request, a
// sudden-SNHL urgent / emergency case, a unilateral-symptoms case, and an
// ear-discharge case.

/** @type {import('./types.js').RequestRow[]} */
const sampleRequests = [
  {
    id: 'H001',
    referralDate: '2026-05-04',
    patient: 'Okafor, Amara',
    nhs: '401 234 5678',
    testType: 'pure-tone-audiometry',
    laterality: 'bilateral',
    indication: 'hearing-loss',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'routine',
    priorityBand: 'low',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'H002',
    referralDate: '2026-05-05',
    patient: 'Bianchi, Sofia',
    nhs: '402 345 6789',
    testType: 'pure-tone-audiometry',
    laterality: 'left',
    indication: 'sudden-hearing-loss',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'emergency',
    priorityBand: 'high',
    completenessPercent: 95,
    clinician: 'Mr K Mensah',
    flags: ['sudden-sensorineural-hearing-loss-urgent', 'unilateral-symptoms-red-flag']
  },
  {
    id: 'H003',
    referralDate: '2026-05-05',
    patient: 'Novak, Petra',
    nhs: '403 456 7890',
    testType: 'auditory-brainstem-response',
    laterality: 'right',
    indication: 'vertigo',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'urgent',
    priorityBand: 'moderate',
    completenessPercent: 90,
    clinician: 'Dr L Romano',
    flags: ['unilateral-symptoms-red-flag']
  },
  {
    id: 'H004',
    referralDate: '2026-05-06',
    patient: 'Hassan, Layla',
    nhs: '404 567 8901',
    testType: 'tympanometry',
    laterality: 'left',
    indication: 'ear-discharge',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'urgent',
    priorityBand: 'moderate',
    completenessPercent: 85,
    clinician: 'Dr M Adebayo',
    flags: ['ear-discharge']
  },
  {
    id: 'H005',
    referralDate: '2026-05-06',
    patient: 'Connolly, Niamh',
    nhs: '405 678 9012',
    testType: 'otoacoustic-emissions',
    laterality: 'bilateral',
    indication: 'ototoxic-monitoring',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'routine',
    priorityBand: 'low',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'H006',
    referralDate: '2026-05-07',
    patient: 'Silva, Beatriz',
    nhs: '406 789 0123',
    testType: 'pure-tone-audiometry',
    laterality: 'bilateral',
    indication: 'occupational-noise',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'routine',
    priorityBand: 'low',
    completenessPercent: 90,
    clinician: 'Dr P Sharma',
    flags: []
  },
  {
    id: 'H007',
    referralDate: '2026-05-07',
    patient: 'Andersson, Elin',
    nhs: '407 890 1234',
    testType: 'hearing-aid-assessment',
    laterality: 'bilateral',
    indication: 'hearing-aid-review',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'routine',
    priorityBand: 'low',
    completenessPercent: 60,
    clinician: 'Dr R Ahmed',
    flags: ['missing-clinical-question']
  },
  {
    id: 'H008',
    referralDate: '2026-05-08',
    patient: 'Kowalski, Zofia',
    nhs: '408 901 2345',
    testType: 'speech-audiometry',
    laterality: 'right',
    indication: 'tinnitus',
    appropriatenessBand: 'may-be-appropriate',
    triageTier: 'urgent',
    priorityBand: 'moderate',
    completenessPercent: 80,
    clinician: 'Mr K Mensah',
    flags: ['unilateral-symptoms-red-flag']
  },
  {
    id: 'H009',
    referralDate: '2026-05-08',
    patient: 'Müller, Hannah',
    nhs: '409 012 3456',
    testType: 'newborn-hearing-screen',
    laterality: 'not-applicable',
    indication: 'occupational-noise',
    appropriatenessBand: 'usually-not-appropriate',
    triageTier: 'routine',
    priorityBand: 'moderate',
    completenessPercent: 70,
    clinician: 'Dr L Romano',
    flags: []
  },
  {
    id: 'H010',
    referralDate: '2026-05-09',
    patient: 'Tanaka, Yuki',
    nhs: '410 123 4567',
    testType: 'tympanometry',
    laterality: 'right',
    indication: 'suspected-otosclerosis',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'routine',
    priorityBand: 'low',
    completenessPercent: 100,
    clinician: 'Dr M Adebayo',
    flags: []
  }
];

export { sampleRequests };
