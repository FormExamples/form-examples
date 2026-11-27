// Sample request data for the renal transplant recipient vetting dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Eight illustrative rows spanning the triage tiers, appropriateness bands and
// identity / sample safety bands. Names and identifiers are fictitious.

/** @type {import('./dashboard-types.js').RequestRow[]} */
const sampleRequests = [
  {
    id: 'R001',
    requestDate: '2026-10-05',
    patient: 'Okafor, Amara',
    identifier: '100 200 3001',
    organ: 'kidney',
    tests: 'First typing and re-typing, Routine transplant list',
    dialysisMode: 'unit-haemodialysis',
    appropriatenessBand: 'usually-appropriate',
    identitySafetyBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'R002',
    requestDate: '2026-10-06',
    patient: 'Bianchi, Sofia',
    identifier: '100 200 3002',
    organ: 'kidney',
    tests: 'Deceased donor full crossmatch, Deceased donor day of transplant',
    dialysisMode: 'unit-haemodialysis',
    appropriatenessBand: 'usually-appropriate',
    identitySafetyBand: 'ok',
    triageTier: 'stat',
    completenessPercent: 95,
    clinician: 'Dr K Mensah',
    flags: ['day-of-transplant-stat','sensitised-recipient']
  },
  {
    id: 'R003',
    requestDate: '2026-10-07',
    patient: 'Novak, Petra',
    identifier: '100 200 3003',
    organ: 'kidney-pancreas',
    tests: 'Living donor virtual crossmatch',
    dialysisMode: 'pre-dialysis',
    appropriatenessBand: 'may-be-appropriate',
    identitySafetyBand: 'caution',
    triageTier: 'routine',
    completenessPercent: 80,
    clinician: 'Dr R Adeyemi',
    flags: ['virtual-crossmatch-without-antibody-profile']
  },
  {
    id: 'R004',
    requestDate: '2026-10-08',
    patient: 'Haddad, Omar',
    identifier: '100 200 3004',
    organ: 'kidney',
    tests: 'HLA rejection investigation',
    dialysisMode: 'failing-transplant',
    appropriatenessBand: 'usually-appropriate',
    identitySafetyBand: 'ok',
    triageTier: 'urgent',
    completenessPercent: 90,
    clinician: 'Dr S Chowdhury',
    flags: ['sensitised-recipient']
  },
  {
    id: 'R005',
    requestDate: '2026-10-09',
    patient: 'Lindqvist, Elin',
    identifier: '100 200 3005',
    organ: 'kidney',
    tests: 'HLA rejection investigation',
    dialysisMode: 'capd',
    appropriatenessBand: 'usually-not-appropriate',
    identitySafetyBand: 'ok',
    triageTier: 'urgent',
    completenessPercent: 85,
    clinician: 'Dr J Walsh',
    flags: []
  },
  {
    id: 'R006',
    requestDate: '2026-10-10',
    patient: 'Mwangi, Joseph',
    identifier: '100 200 3006',
    organ: 'kidney',
    tests: 'Routine post-transplant list',
    dialysisMode: 'home-peritoneal-dialysis',
    appropriatenessBand: 'usually-appropriate',
    identitySafetyBand: 'reject-risk',
    triageTier: 'routine',
    completenessPercent: 70,
    clinician: 'Dr A Banerjee',
    flags: ['identity-mismatch-risk','missing-abo-group']
  },
  {
    id: 'R007',
    requestDate: '2026-10-11',
    patient: 'Tanaka, Yuki',
    identifier: '100 200 3007',
    organ: 'pancreas',
    tests: 'ABO-incompatible transplant monitoring',
    dialysisMode: 'pre-dialysis',
    appropriatenessBand: 'may-be-appropriate',
    identitySafetyBand: 'caution',
    triageTier: 'routine',
    completenessPercent: 75,
    clinician: 'Dr L Fischer',
    flags: ['abo-incompatible-without-dfpp-status']
  },
  {
    id: 'R008',
    requestDate: '2026-10-12',
    patient: 'Reyes, Lucia',
    identifier: '100 200 3008',
    organ: 'kidney',
    tests: 'Returning to list, Autologous crossmatch',
    dialysisMode: 'unit-haemodialysis',
    appropriatenessBand: 'usually-appropriate',
    identitySafetyBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr M Costa',
    flags: ['sensitised-recipient']
  }
];

export { sampleRequests };
