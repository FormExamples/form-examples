// Sample note data for the ward dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span all eight note types, all three completeness statuses, all four
// acuity bands, the full completeness-percent range, a variety of author grades
// and wards, and both safety-flag states.
//
// The rows are deliberately consistent with the engines: a `critical` row
// carries a NEWS2 at or above 9 or another critical driver, and a row with a
// high-priority flag has something for that flag to fire on.

/** @type {import('./dashboard-types.js').NoteRow[]} */
const sampleNotes = [
  {
    id: '1',
    hospitalMrn: 'MRN-204815',
    patientName: 'Okafor, Chidi',
    wardName: 'Ward 12B — AMU',
    noteType: 'admission-clerking',
    authorGrade: 'consultant',
    status: 'complete',
    completenessPercent: 100,
    acuityBand: 'stable',
    news2Total: 1,
    safetyFlag: false,
    lengthOfStayDays: 0,
    noteAt: '2026-07-29'
  },
  {
    id: '2',
    hospitalMrn: 'MRN-771302',
    patientName: 'Doyle, Aoife',
    wardName: 'Ward 7 — Respiratory',
    noteType: 'event',
    authorGrade: 'FY1',
    status: 'incomplete',
    completenessPercent: 44,
    acuityBand: 'escalate',
    news2Total: 7,
    safetyFlag: true,
    lengthOfStayDays: 3,
    noteAt: '2026-07-30'
  },
  {
    id: '3',
    hospitalMrn: 'MRN-330149',
    patientName: 'Nowak, Piotr',
    wardName: 'Ward 12B — AMU',
    noteType: 'progress',
    authorGrade: 'ST4',
    status: 'partial',
    completenessPercent: 78,
    acuityBand: 'watch',
    news2Total: 5,
    safetyFlag: false,
    lengthOfStayDays: 2,
    noteAt: '2026-07-30'
  },
  {
    id: '4',
    hospitalMrn: 'MRN-905513',
    patientName: 'Fernandez, Rosa',
    wardName: 'Ward 3 — Surgery',
    noteType: 'procedure',
    authorGrade: 'CT2',
    status: 'complete',
    completenessPercent: 100,
    acuityBand: 'stable',
    news2Total: 2,
    safetyFlag: false,
    lengthOfStayDays: 5,
    noteAt: '2026-07-30'
  },
  {
    id: '5',
    hospitalMrn: 'MRN-118427',
    patientName: 'Thompson, Gary',
    wardName: 'Ward 7 — Respiratory',
    noteType: 'consult',
    authorGrade: 'acp',
    status: 'partial',
    completenessPercent: 64,
    acuityBand: 'critical',
    news2Total: 10,
    safetyFlag: true,
    lengthOfStayDays: 9,
    noteAt: '2026-07-31'
  },
  {
    id: '6',
    hospitalMrn: 'MRN-771488',
    patientName: 'Abadi, Layla',
    wardName: 'Ward 3 — Surgery',
    noteType: 'handover',
    authorGrade: 'FY2',
    status: 'incomplete',
    completenessPercent: 33,
    acuityBand: 'watch',
    news2Total: 4,
    safetyFlag: true,
    lengthOfStayDays: 12,
    noteAt: '2026-07-31'
  },
  {
    id: '7',
    hospitalMrn: 'MRN-560234',
    patientName: 'Whitfield, Eleanor',
    wardName: 'Ward 9 — Care of the Elderly',
    noteType: 'discharge-planning',
    authorGrade: 'consultant',
    status: 'complete',
    completenessPercent: 100,
    acuityBand: 'stable',
    news2Total: 0,
    safetyFlag: false,
    lengthOfStayDays: 14,
    noteAt: '2026-07-31'
  },
  {
    id: '8',
    hospitalMrn: 'MRN-330217',
    patientName: 'Sato, Kenji',
    wardName: 'Ward 9 — Care of the Elderly',
    noteType: 'transfer',
    authorGrade: 'physician-associate',
    status: 'partial',
    completenessPercent: 80,
    acuityBand: 'watch',
    news2Total: 6,
    safetyFlag: false,
    lengthOfStayDays: 6,
    noteAt: '2026-07-31'
  },
  {
    id: '9',
    hospitalMrn: 'MRN-448190',
    patientName: 'Beaumont, Iris',
    wardName: 'Ward 12B — AMU',
    noteType: 'progress',
    authorGrade: 'ST1',
    status: 'complete',
    completenessPercent: 100,
    acuityBand: 'escalate',
    news2Total: 8,
    safetyFlag: false,
    lengthOfStayDays: 1,
    noteAt: '2026-07-31'
  },
  {
    id: '10',
    hospitalMrn: 'MRN-662035',
    patientName: 'Adeyemi, Tunde',
    wardName: 'Ward 5 — Cardiology',
    noteType: 'progress',
    authorGrade: 'FY1',
    status: 'incomplete',
    completenessPercent: 22,
    acuityBand: 'stable',
    news2Total: null,
    safetyFlag: true,
    lengthOfStayDays: 8,
    noteAt: '2026-07-31'
  }
];

export { sampleNotes };
