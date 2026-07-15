// Sample request data for the blood cross-match vetting dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Ten realistic rows spanning every triage tier (routine / urgent / emergency
// / stat), every appropriateness band, and every identity / sample safety
// band. NHS numbers are placeholder values in the canonical "NNN NNN NNNN"
// display form. Includes the required worked cases: a routine group-and-save,
// a stat massive-haemorrhage case, a two-sample-rule-not-met case, and a
// known-antibodies case.

/** @type {import('./types.js').RequestRow[]} */
const sampleRequests = [
  {
    id: 'X001',
    referralDate: '2026-05-04',
    patient: 'Okafor, Amara',
    nhs: '401 234 5678',
    requestType: 'group-and-save',
    component: 'none',
    indication: 'surgery',
    bloodGroup: 'o-pos',
    appropriatenessBand: 'usually-appropriate',
    identitySafetyBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'X002',
    referralDate: '2026-05-05',
    patient: 'Bianchi, Sofia',
    nhs: '402 345 6789',
    requestType: 'emergency-o-negative',
    component: 'red-cells',
    indication: 'acute-bleeding',
    bloodGroup: 'unknown',
    appropriatenessBand: 'usually-appropriate',
    identitySafetyBand: 'ok',
    triageTier: 'stat',
    completenessPercent: 70,
    clinician: 'Dr K Mensah',
    flags: ['massive-haemorrhage-stat', 'missing-blood-group']
  },
  {
    id: 'X003',
    referralDate: '2026-05-05',
    patient: 'Novak, Petra',
    nhs: '403 456 7890',
    requestType: 'crossmatch',
    component: 'red-cells',
    indication: 'surgery',
    bloodGroup: 'a-pos',
    appropriatenessBand: 'usually-appropriate',
    identitySafetyBand: 'reject-risk',
    triageTier: 'routine',
    completenessPercent: 85,
    clinician: 'Dr L Romano',
    flags: ['two-sample-rule-not-met']
  },
  {
    id: 'X004',
    referralDate: '2026-05-06',
    patient: 'Hassan, Layla',
    nhs: '404 567 8901',
    requestType: 'crossmatch',
    component: 'red-cells',
    indication: 'anaemia',
    bloodGroup: 'b-neg',
    appropriatenessBand: 'usually-appropriate',
    identitySafetyBand: 'caution',
    triageTier: 'urgent',
    completenessPercent: 90,
    clinician: 'Dr M Adebayo',
    flags: ['known-antibodies-extra-time']
  },
  {
    id: 'X005',
    referralDate: '2026-05-06',
    patient: 'Connolly, Niamh',
    nhs: '405 678 9012',
    requestType: 'antibody-screen',
    component: 'none',
    indication: 'obstetric-haemorrhage',
    bloodGroup: 'o-neg',
    appropriatenessBand: 'may-be-appropriate',
    identitySafetyBand: 'ok',
    triageTier: 'emergency',
    completenessPercent: 95,
    clinician: 'Dr H Iqbal',
    flags: ['previous-transfusion-reaction']
  },
  {
    id: 'X006',
    referralDate: '2026-05-07',
    patient: 'Silva, Beatriz',
    nhs: '406 789 0123',
    requestType: 'crossmatch',
    component: 'platelets',
    indication: 'chemotherapy-support',
    bloodGroup: 'ab-pos',
    appropriatenessBand: 'usually-appropriate',
    identitySafetyBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr P Sharma',
    flags: []
  },
  {
    id: 'X007',
    referralDate: '2026-05-07',
    patient: 'Andersson, Elin',
    nhs: '407 890 1234',
    requestType: 'crossmatch',
    component: 'red-cells',
    indication: 'anaemia',
    bloodGroup: 'a-pos',
    appropriatenessBand: 'usually-not-appropriate',
    identitySafetyBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 75,
    clinician: 'Dr R Ahmed',
    flags: ['missing-clinical-details']
  },
  {
    id: 'X008',
    referralDate: '2026-05-08',
    patient: 'Kowalski, Zofia',
    nhs: '408 901 2345',
    requestType: 'crossmatch',
    component: 'fresh-frozen-plasma',
    indication: 'acute-bleeding',
    bloodGroup: 'o-pos',
    appropriatenessBand: 'usually-appropriate',
    identitySafetyBand: 'caution',
    triageTier: 'emergency',
    completenessPercent: 88,
    clinician: 'Dr K Mensah',
    flags: ['mislabel-risk']
  },
  {
    id: 'X009',
    referralDate: '2026-05-08',
    patient: 'Müller, Hannah',
    nhs: '409 012 3456',
    requestType: 'crossmatch',
    component: 'red-cells',
    indication: 'transfusion-dependent',
    bloodGroup: 'b-pos',
    appropriatenessBand: 'usually-appropriate',
    identitySafetyBand: 'caution',
    triageTier: 'routine',
    completenessPercent: 92,
    clinician: 'Dr L Romano',
    flags: ['known-antibodies-extra-time', 'previous-transfusion-reaction']
  },
  {
    id: 'X010',
    referralDate: '2026-05-09',
    patient: 'Tanaka, Yuki',
    nhs: '410 123 4567',
    requestType: 'crossmatch',
    component: 'red-cells',
    indication: 'acute-bleeding',
    bloodGroup: 'o-neg',
    appropriatenessBand: 'usually-appropriate',
    identitySafetyBand: 'reject-risk',
    triageTier: 'stat',
    completenessPercent: 80,
    clinician: 'Dr M Adebayo',
    flags: ['massive-haemorrhage-stat', 'two-sample-rule-not-met']
  }
];

export { sampleRequests };
