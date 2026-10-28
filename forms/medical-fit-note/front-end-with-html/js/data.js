// Sample fit-note data for the clinician dashboard.
//
// One row per persona in ../../examples/personas.json (the engine's exact
// expected grade), so the offline sample data and the persona oracle cannot
// disagree. Employee and employer names are synthetic placeholders.

/** @type {import('./types.js').FitNoteRow[]} */
const sampleFitNotes = [
  {
    id: 'FN001',
    date: '2026-10-01',
    employee: 'Smith, Alice',
    employer: 'Northern Rail',
    advice: 'not-fit-for-work',
    durationDays: 14,
    adjustments: 0,
    approval: 'approved',
    flags: [],
    clinician: 'Dr A Shah'
  },
  {
    id: 'FN002',
    date: '2026-10-01',
    employee: 'Jones, Bob',
    employer: 'City Council',
    advice: 'may-be-fit-for-work',
    durationDays: 14,
    adjustments: 2,
    approval: 'approved',
    flags: [],
    clinician: 'Dr M Okafor'
  },
  {
    id: 'FN003',
    date: '2026-10-01',
    employee: 'Lee, Carol',
    employer: 'Acme Logistics',
    advice: 'may-be-fit-for-work',
    durationDays: 14,
    adjustments: 0,
    approval: 'needs-completion',
    flags: ["missing-adjustments"],
    clinician: 'Dr A Shah'
  },
  {
    id: 'FN004',
    date: '2026-10-01',
    employee: 'Brown, David',
    employer: 'Greenfield School',
    advice: 'not-fit-for-work',
    durationDays: 14,
    adjustments: 0,
    approval: 'blocked',
    flags: ["missing-declaration"],
    clinician: 'Dr M Okafor'
  },
  {
    id: 'FN005',
    date: '2026-10-01',
    employee: 'Khan, Eva',
    employer: 'Harbour Cafe',
    advice: 'not-fit-for-work',
    durationDays: null,
    adjustments: 0,
    approval: 'blocked',
    flags: ["invalid-period"],
    clinician: 'Dr A Shah'
  },
  {
    id: 'FN006',
    date: '2026-10-01',
    employee: 'Garcia, Frank',
    employer: 'Metro Bank',
    advice: 'not-fit-for-work',
    durationDays: 120,
    adjustments: 0,
    approval: 'needs-completion',
    flags: ["long-period-without-review"],
    clinician: 'Dr M Okafor'
  },
  {
    id: 'FN007',
    date: '2026-10-01',
    employee: 'Nguyen, Grace',
    employer: 'Oakwood Care',
    advice: 'not-fit-for-work',
    durationDays: 120,
    adjustments: 0,
    approval: 'approved',
    flags: [],
    clinician: 'Dr A Shah'
  },
  {
    id: 'FN008',
    date: '2026-10-01',
    employee: 'Patel, Hari',
    employer: 'Brightside Retail',
    advice: 'not-fit-for-work',
    durationDays: 29,
    adjustments: 0,
    approval: 'needs-completion',
    flags: ["backdated"],
    clinician: 'Dr M Okafor'
  },
  {
    id: 'FN009',
    date: '2026-10-01',
    employee: 'Evans, Isla',
    employer: 'Tech Works Ltd',
    advice: 'not-fit-for-work',
    durationDays: 28,
    adjustments: 0,
    approval: 'approved',
    flags: [],
    clinician: 'Dr A Shah'
  },
  {
    id: 'FN010',
    date: '2026-10-01',
    employee: 'Murphy, Jack',
    employer: 'Riverside Farm',
    advice: 'not-fit-for-work',
    durationDays: 14,
    adjustments: 0,
    approval: 'blocked',
    flags: ["unregistered-clinician"],
    clinician: 'Dr M Okafor'
  },
  {
    id: 'FN011',
    date: '2026-10-01',
    employee: 'Wilson, Kate',
    employer: 'County Hospital',
    advice: 'not-fit-for-work',
    durationDays: 28,
    adjustments: 0,
    approval: 'approved',
    flags: [],
    clinician: 'Dr A Shah'
  },
  {
    id: 'FN012',
    date: '',
    employee: 'Taylor, Liam',
    employer: 'Cityline Buses',
    advice: '',
    durationDays: null,
    adjustments: 0,
    approval: 'blocked',
    flags: ["missing-assessment", "missing-diagnosis", "other", "invalid-period", "missing-declaration", "unregistered-clinician", "missing-consent"],
    clinician: 'Dr M Okafor'
  },
  {
    id: 'FN013',
    date: '2026-10-01',
    employee: 'Evans, Priya',
    employer: 'Harbour Dental',
    advice: 'not-fit-for-work',
    durationDays: null,
    adjustments: 0,
    approval: 'blocked',
    flags: ["invalid-period"],
    clinician: 'Dr A Shah'
  }
];

export { sampleFitNotes };
