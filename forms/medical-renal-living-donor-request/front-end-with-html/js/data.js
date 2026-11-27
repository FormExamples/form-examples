// Sample request data for the renal living donor vetting dashboard.
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
    identifier: '200 300 4001',
    pathway: 'directed',
    tests: 'Full crossmatch',
    donorAbo: 'o',
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
    patient: 'Bianchi, Marco',
    identifier: '200 300 4002',
    pathway: 'paired-exchange',
    tests: 'Day-of-transplant samples',
    donorAbo: 'a',
    appropriatenessBand: 'usually-appropriate',
    identitySafetyBand: 'ok',
    triageTier: 'stat',
    completenessPercent: 95,
    clinician: 'Dr K Mensah',
    flags: ['donor-and-recipient-on-one-form']
  },
  {
    id: 'R003',
    requestDate: '2026-10-07',
    patient: 'Novak, Petr',
    identifier: '200 300 4003',
    pathway: 'directed',
    tests: 'Virtual crossmatch',
    donorAbo: 'b',
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
    patient: 'Haddad, Samir',
    identifier: '200 300 4004',
    pathway: 'altruistic',
    tests: 'Altruistic donor work-up',
    donorAbo: 'ab',
    appropriatenessBand: 'usually-appropriate',
    identitySafetyBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 90,
    clinician: 'Dr S Chowdhury',
    flags: []
  },
  {
    id: 'R005',
    requestDate: '2026-10-09',
    patient: 'Lindqvist, Nils',
    identifier: '200 300 4005',
    pathway: 'altruistic',
    tests: 'Full crossmatch',
    donorAbo: 'o',
    appropriatenessBand: 'usually-not-appropriate',
    identitySafetyBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 85,
    clinician: 'Dr J Walsh',
    flags: ['altruistic-donor-with-recipient']
  },
  {
    id: 'R006',
    requestDate: '2026-10-10',
    patient: 'Mwangi, Peter',
    identifier: '200 300 4006',
    pathway: 'directed',
    tests: 'ABO titres only',
    donorAbo: 'a',
    appropriatenessBand: 'usually-appropriate',
    identitySafetyBand: 'reject-risk',
    triageTier: 'urgent',
    completenessPercent: 70,
    clinician: 'Dr A Banerjee',
    flags: ['identity-mismatch-risk','missing-abo-group']
  },
  {
    id: 'R007',
    requestDate: '2026-10-11',
    patient: 'Tanaka, Ken',
    identifier: '200 300 4007',
    pathway: 'directed',
    tests: 'Full crossmatch',
    donorAbo: 'a',
    appropriatenessBand: 'may-be-appropriate',
    identitySafetyBand: 'caution',
    triageTier: 'routine',
    completenessPercent: 75,
    clinician: 'Dr L Fischer',
    flags: ['donor-recipient-abo-incompatible']
  },
  {
    id: 'R008',
    requestDate: '2026-10-12',
    patient: 'Reyes, Mateo',
    identifier: '200 300 4008',
    pathway: 'directed',
    tests: 'Match grade, Follow-up red-cell antibody investigation',
    donorAbo: 'o',
    appropriatenessBand: 'usually-appropriate',
    identitySafetyBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr M Costa',
    flags: []
  }
];

export { sampleRequests };
