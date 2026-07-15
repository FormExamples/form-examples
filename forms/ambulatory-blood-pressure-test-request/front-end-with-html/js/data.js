// Sample request data for the ABPM vetting dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Ten realistic rows spanning every triage tier (routine / urgent /
// emergency), every appropriateness band, and every suitability band. NHS
// numbers are placeholder values in the canonical "NNN NNN NNNN" display form.
// Includes the four required worked cases: a routine diagnose-hypertension
// request, a severe-hypertension urgent case, an atrial-fibrillation accuracy
// case, and a missing-clinic-BP case.

/** @type {import('./types.js').RequestRow[]} */
const sampleRequests = [
  {
    id: 'A001',
    referralDate: '2026-05-04',
    patient: 'Okafor, Amara',
    nhs: '401 234 5678',
    testType: '24-hour-abpm',
    indication: 'diagnose-hypertension',
    clinicBp: '152/96',
    appropriatenessBand: 'usually-appropriate',
    suitabilityBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'A002',
    referralDate: '2026-05-05',
    patient: 'Bianchi, Sofia',
    nhs: '402 345 6789',
    testType: '24-hour-abpm',
    indication: 'diagnose-hypertension',
    clinicBp: '186/124',
    appropriatenessBand: 'may-be-appropriate',
    suitabilityBand: 'ok',
    triageTier: 'urgent',
    completenessPercent: 95,
    clinician: 'Dr K Mensah',
    flags: ['severe-hypertension-urgent']
  },
  {
    id: 'A003',
    referralDate: '2026-05-05',
    patient: 'Novak, Petra',
    nhs: '403 456 7890',
    testType: '24-hour-abpm',
    indication: 'resistant-hypertension',
    clinicBp: '158/92',
    appropriatenessBand: 'usually-appropriate',
    suitabilityBand: 'limited',
    triageTier: 'routine',
    completenessPercent: 90,
    clinician: 'Dr L Romano',
    flags: ['atrial-fibrillation-accuracy']
  },
  {
    id: 'A004',
    referralDate: '2026-05-06',
    patient: 'Hassan, Layla',
    nhs: '404 567 8901',
    testType: 'home-blood-pressure-monitoring',
    indication: 'white-coat-hypertension',
    clinicBp: '148/90',
    appropriatenessBand: 'usually-appropriate',
    suitabilityBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr M Adebayo',
    flags: []
  },
  {
    id: 'A005',
    referralDate: '2026-05-06',
    patient: 'Connolly, Niamh',
    nhs: '405 678 9012',
    testType: '24-hour-abpm',
    indication: 'treatment-monitoring',
    clinicBp: '',
    appropriatenessBand: 'may-be-appropriate',
    suitabilityBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 65,
    clinician: 'Dr H Iqbal',
    flags: ['missing-clinic-bp']
  },
  {
    id: 'A006',
    referralDate: '2026-05-07',
    patient: 'Silva, Beatriz',
    nhs: '406 789 0123',
    testType: '24-hour-abpm',
    indication: 'diagnose-hypertension',
    clinicBp: '204/132',
    appropriatenessBand: 'may-be-appropriate',
    suitabilityBand: 'caution',
    triageTier: 'urgent',
    completenessPercent: 90,
    clinician: 'Dr P Sharma',
    flags: ['accelerated-hypertension']
  },
  {
    id: 'A007',
    referralDate: '2026-05-07',
    patient: 'Andersson, Elin',
    nhs: '407 890 1234',
    testType: 'home-blood-pressure-monitoring',
    indication: 'treatment-monitoring',
    clinicBp: '136/84',
    appropriatenessBand: 'may-be-appropriate',
    suitabilityBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 60,
    clinician: 'Dr R Ahmed',
    flags: ['missing-clinical-question']
  },
  {
    id: 'A008',
    referralDate: '2026-05-08',
    patient: 'Kowalski, Zofia',
    nhs: '408 901 2345',
    testType: '24-hour-abpm',
    indication: 'masked-hypertension',
    clinicBp: '134/86',
    appropriatenessBand: 'usually-appropriate',
    suitabilityBand: 'caution',
    triageTier: 'routine',
    completenessPercent: 85,
    clinician: 'Dr K Mensah',
    flags: []
  },
  {
    id: 'A009',
    referralDate: '2026-05-08',
    patient: 'Müller, Hannah',
    nhs: '409 012 3456',
    testType: '24-hour-abpm',
    indication: 'diagnose-hypertension',
    clinicBp: '122/76',
    appropriatenessBand: 'usually-not-appropriate',
    suitabilityBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 80,
    clinician: 'Dr L Romano',
    flags: []
  },
  {
    id: 'A010',
    referralDate: '2026-05-09',
    patient: 'Tanaka, Yuki',
    nhs: '410 123 4567',
    testType: '24-hour-abpm',
    indication: 'hypotension-symptoms',
    clinicBp: '210/118',
    appropriatenessBand: 'may-be-appropriate',
    suitabilityBand: 'limited',
    triageTier: 'emergency',
    completenessPercent: 95,
    clinician: 'Dr M Adebayo',
    flags: ['accelerated-hypertension', 'atrial-fibrillation-accuracy']
  }
];

export { sampleRequests };
