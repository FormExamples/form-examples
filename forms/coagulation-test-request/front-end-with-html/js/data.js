// Sample request data for the coagulation test request vetting dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Ten realistic rows spanning every triage tier (routine / urgent / stat),
// every appropriateness band, and every pre-analytical specimen-safety band.
// NHS numbers are placeholder values in the canonical "NNN NNN NNNN" display
// form. Includes the required worked cases: a routine anticoagulation-monitoring
// request, a STAT active-bleeding case, a suspected-DIC case, and a
// no-test-selected case.

/** @type {import('./types.js').RequestRow[]} */
const sampleRequests = [
  {
    id: 'C001',
    referralDate: '2026-05-04',
    patient: 'Okafor, Amara',
    nhs: '401 234 5678',
    tests: ['Prothrombin time / INR'],
    indication: 'anticoagulation-monitoring',
    appropriatenessBand: 'usually-appropriate',
    preanalyticalBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'C002',
    referralDate: '2026-05-05',
    patient: 'Bianchi, Sofia',
    nhs: '402 345 6789',
    tests: ['Prothrombin time / INR', 'APTT', 'Fibrinogen (Clauss)', 'D-dimer'],
    indication: 'disseminated-intravascular-coagulation',
    appropriatenessBand: 'usually-appropriate',
    preanalyticalBand: 'caution',
    triageTier: 'stat',
    completenessPercent: 95,
    clinician: 'Dr K Mensah',
    flags: ['suspected-dic']
  },
  {
    id: 'C003',
    referralDate: '2026-05-05',
    patient: 'Novak, Petra',
    nhs: '403 456 7890',
    tests: ['Fibrinogen (Clauss)', 'D-dimer'],
    indication: 'abnormal-bleeding',
    appropriatenessBand: 'usually-appropriate',
    preanalyticalBand: 'ok',
    triageTier: 'stat',
    completenessPercent: 90,
    clinician: 'Dr L Romano',
    flags: ['active-bleeding-stat']
  },
  {
    id: 'C004',
    referralDate: '2026-05-06',
    patient: 'Hassan, Layla',
    nhs: '404 567 8901',
    tests: ['D-dimer'],
    indication: 'suspected-dvt-pe',
    appropriatenessBand: 'usually-appropriate',
    preanalyticalBand: 'ok',
    triageTier: 'urgent',
    completenessPercent: 85,
    clinician: 'Dr M Adebayo',
    flags: ['d-dimer-low-pretest-caution']
  },
  {
    id: 'C005',
    referralDate: '2026-05-06',
    patient: 'Connolly, Niamh',
    nhs: '405 678 9012',
    tests: ['Prothrombin time / INR', 'APTT'],
    indication: 'pre-operative',
    appropriatenessBand: 'usually-appropriate',
    preanalyticalBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'C006',
    referralDate: '2026-05-07',
    patient: 'Silva, Beatriz',
    nhs: '406 789 0123',
    tests: ['APTT', 'Anti-Xa assay'],
    indication: 'anticoagulation-monitoring',
    appropriatenessBand: 'usually-appropriate',
    preanalyticalBand: 'reject-risk',
    triageTier: 'routine',
    completenessPercent: 80,
    clinician: 'Dr P Sharma',
    flags: ['specimen-underfilled-risk']
  },
  {
    id: 'C007',
    referralDate: '2026-05-07',
    patient: 'Andersson, Elin',
    nhs: '407 890 1234',
    tests: [],
    indication: 'other',
    appropriatenessBand: 'usually-not-appropriate',
    preanalyticalBand: 'caution',
    triageTier: 'routine',
    completenessPercent: 55,
    clinician: 'Dr R Ahmed',
    flags: ['no-test-selected', 'missing-clinical-details']
  },
  {
    id: 'C008',
    referralDate: '2026-05-08',
    patient: 'Kowalski, Zofia',
    nhs: '408 901 2345',
    tests: ['Thrombophilia screen'],
    indication: 'thrombophilia-investigation',
    appropriatenessBand: 'usually-appropriate',
    preanalyticalBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 90,
    clinician: 'Dr K Mensah',
    flags: []
  },
  {
    id: 'C009',
    referralDate: '2026-05-08',
    patient: 'Müller, Hannah',
    nhs: '409 012 3456',
    tests: ['Thrombophilia screen'],
    indication: 'pre-operative',
    appropriatenessBand: 'usually-not-appropriate',
    preanalyticalBand: 'caution',
    triageTier: 'routine',
    completenessPercent: 70,
    clinician: 'Dr L Romano',
    flags: ['missing-clinical-details']
  },
  {
    id: 'C010',
    referralDate: '2026-05-09',
    patient: 'Tanaka, Yuki',
    nhs: '410 123 4567',
    tests: ['Factor assays', 'Von Willebrand screen', 'Mixing studies'],
    indication: 'bleeding-disorder',
    appropriatenessBand: 'may-be-appropriate',
    preanalyticalBand: 'ok',
    triageTier: 'urgent',
    completenessPercent: 85,
    clinician: 'Dr M Adebayo',
    flags: []
  }
];

export { sampleRequests };
