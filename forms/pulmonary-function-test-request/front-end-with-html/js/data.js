// Sample request data for the pulmonary function test vetting dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Ten realistic rows spanning both triage tiers (routine / urgent), every
// appropriateness band, and every safety / contraindication band. NHS numbers
// are placeholder values in the canonical "NNN NNN NNNN" display form.
// Includes the required worked cases: a routine suspected-asthma request, a
// recent-MI contraindication case, and an active-respiratory-infection case.

/** @type {import('./types.js').RequestRow[]} */
const sampleRequests = [
  {
    id: 'P001',
    referralDate: '2026-05-04',
    patient: 'Okafor, Amara',
    nhs: '401 234 5678',
    testType: 'spirometry-with-reversibility',
    indication: 'suspected-asthma',
    appropriatenessBand: 'usually-appropriate',
    contraindicationBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'P002',
    referralDate: '2026-05-05',
    patient: 'Bianchi, Sofia',
    nhs: '402 345 6789',
    testType: 'spirometry',
    indication: 'suspected-copd',
    appropriatenessBand: 'usually-appropriate',
    contraindicationBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 90,
    clinician: 'Dr K Mensah',
    flags: []
  },
  {
    id: 'P003',
    referralDate: '2026-05-05',
    patient: 'Novak, Petra',
    nhs: '403 456 7890',
    testType: 'spirometry',
    indication: 'breathlessness',
    appropriatenessBand: 'usually-appropriate',
    contraindicationBand: 'contraindicated',
    triageTier: 'routine',
    completenessPercent: 85,
    clinician: 'Dr L Romano',
    flags: ['recent-mi-contraindication']
  },
  {
    id: 'P004',
    referralDate: '2026-05-06',
    patient: 'Hassan, Layla',
    nhs: '404 567 8901',
    testType: 'spirometry',
    indication: 'chronic-cough',
    appropriatenessBand: 'usually-appropriate',
    contraindicationBand: 'caution',
    triageTier: 'routine',
    completenessPercent: 80,
    clinician: 'Dr M Adebayo',
    flags: ['active-respiratory-infection']
  },
  {
    id: 'P005',
    referralDate: '2026-05-06',
    patient: 'Connolly, Niamh',
    nhs: '405 678 9012',
    testType: 'full-lung-function',
    indication: 'restrictive-disease',
    appropriatenessBand: 'usually-appropriate',
    contraindicationBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'P006',
    referralDate: '2026-05-07',
    patient: 'Silva, Beatriz',
    nhs: '406 789 0123',
    testType: 'gas-transfer-dlco',
    indication: 'breathlessness',
    appropriatenessBand: 'may-be-appropriate',
    contraindicationBand: 'contraindicated',
    triageTier: 'urgent',
    completenessPercent: 90,
    clinician: 'Dr P Sharma',
    flags: ['haemoptysis']
  },
  {
    id: 'P007',
    referralDate: '2026-05-07',
    patient: 'Andersson, Elin',
    nhs: '407 890 1234',
    testType: 'peak-flow',
    indication: 'monitoring',
    appropriatenessBand: 'may-be-appropriate',
    contraindicationBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 60,
    clinician: 'Dr R Ahmed',
    flags: ['missing-clinical-question']
  },
  {
    id: 'P008',
    referralDate: '2026-05-08',
    patient: 'Kowalski, Zofia',
    nhs: '408 901 2345',
    testType: 'full-lung-function',
    indication: 'pre-operative',
    appropriatenessBand: 'usually-appropriate',
    contraindicationBand: 'ok',
    triageTier: 'urgent',
    completenessPercent: 95,
    clinician: 'Dr K Mensah',
    flags: []
  },
  {
    id: 'P009',
    referralDate: '2026-05-08',
    patient: 'Müller, Hannah',
    nhs: '409 012 3456',
    testType: 'feno',
    indication: 'restrictive-disease',
    appropriatenessBand: 'usually-not-appropriate',
    contraindicationBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 70,
    clinician: 'Dr L Romano',
    flags: []
  },
  {
    id: 'P010',
    referralDate: '2026-05-09',
    patient: 'Tanaka, Yuki',
    nhs: '410 123 4567',
    testType: 'spirometry',
    indication: 'occupational-lung-disease',
    appropriatenessBand: 'may-be-appropriate',
    contraindicationBand: 'caution',
    triageTier: 'routine',
    completenessPercent: 75,
    clinician: 'Dr M Adebayo',
    flags: ['suspected-tb-infection-control']
  }
];

export { sampleRequests };
