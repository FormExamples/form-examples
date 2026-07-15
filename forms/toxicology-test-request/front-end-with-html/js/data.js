// Sample request data for the toxicology vetting dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Ten realistic rows spanning every triage tier (routine / urgent / stat),
// every appropriateness band, and every ingestion-timing band. NHS numbers
// are placeholder values in the canonical "NNN NNN NNNN" display form.
// Includes the required worked cases: a stat suspected-overdose case (T002), a
// paracetamol-timing-critical case (T003), a deliberate-self-harm safeguarding
// case (T004), and a no-test-selected case (T007).

/** @type {import('./types.js').RequestRow[]} */
const sampleRequests = [
  {
    id: 'T001',
    referralDate: '2026-05-04',
    patient: 'Okafor, Amara',
    nhs: '401 234 5678',
    assays: ['lithiumLevel'],
    indication: 'therapeutic-drug-monitoring',
    appropriatenessBand: 'usually-appropriate',
    timingBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 95,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'T002',
    referralDate: '2026-05-05',
    patient: 'Bianchi, Sofia',
    nhs: '402 345 6789',
    assays: ['paracetamolLevel', 'salicylateLevel'],
    indication: 'suspected-overdose',
    appropriatenessBand: 'usually-appropriate',
    timingBand: 'ok',
    triageTier: 'stat',
    completenessPercent: 100,
    clinician: 'Dr K Mensah',
    flags: ['suspected-overdose-stat']
  },
  {
    id: 'T003',
    referralDate: '2026-05-05',
    patient: 'Novak, Petra',
    nhs: '403 456 7890',
    assays: ['paracetamolLevel'],
    indication: 'suspected-overdose',
    appropriatenessBand: 'usually-appropriate',
    timingBand: 'invalid',
    triageTier: 'stat',
    completenessPercent: 90,
    clinician: 'Dr L Romano',
    flags: ['suspected-overdose-stat', 'paracetamol-timing-critical']
  },
  {
    id: 'T004',
    referralDate: '2026-05-06',
    patient: 'Hassan, Layla',
    nhs: '404 567 8901',
    assays: ['paracetamolLevel', 'drugsOfAbuseScreen'],
    indication: 'deliberate-self-harm',
    appropriatenessBand: 'usually-appropriate',
    timingBand: 'ok',
    triageTier: 'stat',
    completenessPercent: 100,
    clinician: 'Dr M Adebayo',
    flags: ['deliberate-self-harm-safeguarding', 'suspected-overdose-stat']
  },
  {
    id: 'T005',
    referralDate: '2026-05-06',
    patient: 'Connolly, Niamh',
    nhs: '405 678 9012',
    assays: ['drugsOfAbuseScreen'],
    indication: 'substance-misuse-screen',
    appropriatenessBand: 'usually-appropriate',
    timingBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 80,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'T006',
    referralDate: '2026-05-07',
    patient: 'Silva, Beatriz',
    nhs: '406 789 0123',
    assays: ['carboxyhaemoglobin'],
    indication: 'suspected-poisoning',
    appropriatenessBand: 'usually-appropriate',
    timingBand: 'ok',
    triageTier: 'urgent',
    completenessPercent: 85,
    clinician: 'Dr P Sharma',
    flags: ['suspected-overdose-stat']
  },
  {
    id: 'T007',
    referralDate: '2026-05-07',
    patient: 'Andersson, Elin',
    nhs: '407 890 1234',
    assays: [],
    indication: 'other',
    appropriatenessBand: 'usually-not-appropriate',
    timingBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 45,
    clinician: 'Dr R Ahmed',
    flags: ['no-test-selected', 'missing-clinical-details']
  },
  {
    id: 'T008',
    referralDate: '2026-05-08',
    patient: 'Kowalski, Zofia',
    nhs: '408 901 2345',
    assays: ['digoxinLevel'],
    indication: 'therapeutic-drug-monitoring',
    appropriatenessBand: 'usually-appropriate',
    timingBand: 'ok',
    triageTier: 'urgent',
    completenessPercent: 90,
    clinician: 'Dr K Mensah',
    flags: []
  },
  {
    id: 'T009',
    referralDate: '2026-05-08',
    patient: 'Müller, Hannah',
    nhs: '409 012 3456',
    assays: ['lithiumLevel'],
    indication: 'occupational-screen',
    appropriatenessBand: 'usually-not-appropriate',
    timingBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 70,
    clinician: 'Dr L Romano',
    flags: ['missing-clinical-details']
  },
  {
    id: 'T010',
    referralDate: '2026-05-09',
    patient: 'Tanaka, Yuki',
    nhs: '410 123 4567',
    assays: ['paracetamolLevel', 'salicylateLevel'],
    indication: 'suspected-overdose',
    appropriatenessBand: 'usually-appropriate',
    timingBand: 'caution',
    triageTier: 'stat',
    completenessPercent: 95,
    clinician: 'Dr M Adebayo',
    flags: ['suspected-overdose-stat', 'specimen-not-collected']
  }
];

export { sampleRequests };
