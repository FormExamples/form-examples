// Sample request data for the HLA disease association vetting dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// One illustrative row per persona in examples/personas.json, spanning the
// triage tiers, appropriateness bands and identity / sample safety bands.
// Names and identifiers are fictitious.

/** @type {import('./dashboard-types.js').RequestRow[]} */
const sampleRequests = [
  {
    id: 'HLA-2026-000001',
    requestDate: '2026-09-01',
    patient: 'Ashworth, Claire',
    identifier: '900 000 0101',
    indication: 'suspected-disease',
    tests: 'HLA-B27',
    plannedDrug: '',
    appropriatenessBand: 'usually-appropriate',
    identitySafetyBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr R Menon',
    flags: []
  },
  {
    id: 'HLA-2026-000002',
    requestDate: '2026-09-01',
    patient: 'Mbeki, Thabo',
    identifier: '900 000 0101',
    indication: 'pre-treatment-drug-hypersensitivity',
    tests: 'HLA-B*57:01',
    plannedDrug: 'abacavir',
    appropriatenessBand: 'usually-appropriate',
    identitySafetyBand: 'ok',
    triageTier: 'urgent',
    completenessPercent: 100,
    clinician: 'Dr S Patel',
    flags: ['abacavir-start-pending']
  },
  {
    id: 'HLA-2026-000003',
    requestDate: '2026-09-01',
    patient: 'Lindgren, Sven',
    identifier: '900 000 0101',
    indication: 'suspected-disease',
    tests: 'HLA-B27',
    plannedDrug: '',
    appropriatenessBand: 'usually-not-appropriate',
    identitySafetyBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr R Menon',
    flags: ['previous-hla-result-possible-duplicate']
  },
  {
    id: 'HLA-2026-000004',
    requestDate: '2026-09-01',
    patient: 'Rossi, Marco',
    identifier: '900 000 0101',
    indication: '',
    tests: 'HLA-DQ2/DQ8',
    plannedDrug: '',
    appropriatenessBand: 'may-be-appropriate',
    identitySafetyBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 55,
    clinician: 'Dr R Menon',
    flags: ['no-clinical-details', 'report-destination-missing']
  },
  {
    id: 'HLA-2026-000005',
    requestDate: '2026-09-01',
    patient: 'Haddad, Leila',
    identifier: '900 000 0101',
    indication: 'suspected-disease',
    tests: 'Other HLA-disease association (specify)',
    plannedDrug: '',
    appropriatenessBand: 'may-be-appropriate',
    identitySafetyBand: 'caution',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr R Menon',
    flags: ['high-risk-sample']
  },
  {
    id: 'HLA-2026-000006',
    requestDate: '2026-09-01',
    patient: 'Okonkwo, Ngozi',
    identifier: '900 000 0101',
    indication: 'treatment-response',
    tests: 'HLA-DQA1*05',
    plannedDrug: 'infliximab',
    appropriatenessBand: 'may-be-appropriate',
    identitySafetyBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr R Menon',
    flags: ['other']
  },
  {
    id: 'HLA-2026-000007',
    requestDate: '2026-09-01',
    patient: 'Varga, Eszter',
    identifier: '900 000 0101',
    indication: 'suspected-disease',
    tests: 'HLA-A29',
    plannedDrug: '',
    appropriatenessBand: 'usually-appropriate',
    identitySafetyBand: 'reject-risk',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr R Menon',
    flags: ['identity-mismatch-risk']
  }
];

export { sampleRequests };
