// Sample request data for the HSCT HLA typing vetting dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// One illustrative row per persona in examples/personas.json, spanning the
// triage tiers, appropriateness bands and identity / sample safety bands.
// Names and identifiers are fictitious.

/** @type {import('./dashboard-types.js').RequestRow[]} */
const sampleRequests = [
  {
    id: 'HSCT-2026-000001',
    requestDate: '2026-09-01',
    patient: 'Brennan, Tomas',
    identifier: '900 000 0201',
    role: 'hsct-recipient',
    recipient: '',
    donorType: '',
    appropriatenessBand: 'usually-appropriate',
    identitySafetyBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr A Rahman',
    flags: []
  },
  {
    id: 'HSCT-2026-000002',
    requestDate: '2026-09-01',
    patient: 'Brennan, Aoife',
    identifier: '900 000 0202',
    role: 'potential-donor',
    recipient: 'Brennan, Tomas',
    donorType: 'matched-sibling',
    appropriatenessBand: 'usually-appropriate',
    identitySafetyBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr A Rahman',
    flags: []
  },
  {
    id: 'HSCT-2026-000003',
    requestDate: '2026-09-01',
    patient: 'Brennan, Aoife',
    identifier: '900 000 0202',
    role: 'potential-donor',
    recipient: '',
    donorType: 'matched-sibling',
    appropriatenessBand: 'usually-not-appropriate',
    identitySafetyBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 90,
    clinician: 'Dr A Rahman',
    flags: ['donor-without-recipient-details']
  },
  {
    id: 'HSCT-2026-000004',
    requestDate: '2026-09-01',
    patient: 'Brennan, Aoife',
    identifier: '900 000 0202',
    role: 'potential-donor',
    recipient: 'Brennan, Tomas',
    donorType: 'unrelated-volunteer',
    appropriatenessBand: 'may-be-appropriate',
    identitySafetyBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr A Rahman',
    flags: ['other']
  },
  {
    id: 'HSCT-2026-000005',
    requestDate: '2026-09-01',
    patient: 'Brennan, Tomas',
    identifier: '900 000 0201',
    role: 'hsct-recipient',
    recipient: '',
    donorType: '',
    appropriatenessBand: 'may-be-appropriate',
    identitySafetyBand: 'ok',
    triageTier: 'urgent',
    completenessPercent: 75,
    clinician: 'Dr A Rahman',
    flags: ['urgent-without-reason', 'missing-ethnicity', 'no-clinical-details']
  },
  {
    id: 'HSCT-2026-000006',
    requestDate: '2026-09-01',
    patient: 'Brennan, Tomas',
    identifier: '900 000 0201',
    role: 'hsct-recipient',
    recipient: '',
    donorType: '',
    appropriatenessBand: 'usually-appropriate',
    identitySafetyBand: 'caution',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr A Rahman',
    flags: ['sample-volume-insufficient']
  },
  {
    id: 'HSCT-2026-000007',
    requestDate: '2026-09-01',
    patient: 'Brennan, Tomas',
    identifier: '900 000 0201',
    role: 'hsct-recipient',
    recipient: '',
    donorType: '',
    appropriatenessBand: 'usually-appropriate',
    identitySafetyBand: 'reject-risk',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr A Rahman',
    flags: ['identity-mismatch-risk']
  }
];

export { sampleRequests };
