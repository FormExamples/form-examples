// Sample note data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span all three completeness statuses, the full completeness-percent
// range, a variety of clinician grades and wards, and both safety-flag states.

/** @type {import('./dashboard-types.js').NoteRow[]} */
const sampleNotes = [
  {
    id: '1',
    patientIdentifier: 'MRN-204815',
    patientName: 'Okafor, Chidi',
    ward: 'Ward 12B — AMU',
    clinicianGrade: 'consultant',
    status: 'complete',
    completenessPercent: 100,
    safetyFlag: false,
    reviewedAt: '2026-06-29'
  },
  {
    id: '2',
    patientIdentifier: 'MRN-771302',
    patientName: 'Doyle, Aoife',
    ward: 'Ward 7 — Respiratory',
    clinicianGrade: 'fy1',
    status: 'incomplete',
    completenessPercent: 50,
    safetyFlag: true,
    reviewedAt: '2026-06-30'
  },
  {
    id: '3',
    patientIdentifier: 'MRN-330149',
    patientName: 'Nowak, Piotr',
    ward: 'Ward 12B — AMU',
    clinicianGrade: 'specialty-registrar',
    status: 'partial',
    completenessPercent: 75,
    safetyFlag: false,
    reviewedAt: '2026-06-30'
  },
  {
    id: '4',
    patientIdentifier: 'MRN-905513',
    patientName: 'Fernandez, Rosa',
    ward: 'Ward 3 — Surgery',
    clinicianGrade: 'core-trainee',
    status: 'complete',
    completenessPercent: 100,
    safetyFlag: false,
    reviewedAt: '2026-06-30'
  },
  {
    id: '5',
    patientIdentifier: 'MRN-118427',
    patientName: 'Thompson, Gary',
    ward: 'Ward 7 — Respiratory',
    clinicianGrade: 'acp',
    status: 'partial',
    completenessPercent: 63,
    safetyFlag: true,
    reviewedAt: '2026-07-01'
  },
  {
    id: '6',
    patientIdentifier: 'MRN-771488',
    patientName: 'Abadi, Layla',
    ward: 'Ward 3 — Surgery',
    clinicianGrade: 'fy2',
    status: 'incomplete',
    completenessPercent: 38,
    safetyFlag: true,
    reviewedAt: '2026-07-01'
  },
  {
    id: '7',
    patientIdentifier: 'MRN-560234',
    patientName: 'Whitfield, Eleanor',
    ward: 'Ward 9 — Care of the Elderly',
    clinicianGrade: 'consultant',
    status: 'complete',
    completenessPercent: 100,
    safetyFlag: false,
    reviewedAt: '2026-07-01'
  },
  {
    id: '8',
    patientIdentifier: 'MRN-330217',
    patientName: 'Sato, Kenji',
    ward: 'Ward 9 — Care of the Elderly',
    clinicianGrade: 'physician-associate',
    status: 'partial',
    completenessPercent: 88,
    safetyFlag: false,
    reviewedAt: '2026-07-01'
  }
];

export { sampleNotes };
