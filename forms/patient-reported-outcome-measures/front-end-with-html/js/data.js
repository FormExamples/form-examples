// Sample subject/visit rows for the dashboard's offline / no-backend
// fallback. Field shape matches the (aggregated) rows the Rust backend's
// GET /api/patient-reported-outcome-measures endpoint is expected to
// return: one row per completed assessment, with each of the 4
// instruments' headline computed outputs alongside the visit header.

export const SAMPLE_PATIENT_REPORTED_OUTCOME_MEASURES = [
  { id: 'S001', subjectId: 'PT-0001', visit: 'Baseline', assessmentDate: '2026-01-12', ndiPercentage: 62, ndiBand: 'severe', mjoaTotal: 10, mjoaBand: 'severe', eq5dIndex: -0.102, eq5dVas: 40 },
  { id: 'S002', subjectId: 'PT-0001', visit: '6-week', assessmentDate: '2026-02-23', ndiPercentage: 44, ndiBand: 'severe', mjoaTotal: 12, mjoaBand: 'moderate', eq5dIndex: 0.219, eq5dVas: 55 },
  { id: 'S003', subjectId: 'PT-0001', visit: '3-month', assessmentDate: '2026-04-13', ndiPercentage: 22, ndiBand: 'moderate', mjoaTotal: 15, mjoaBand: 'mild', eq5dIndex: 0.62, eq5dVas: 70 },

  { id: 'S004', subjectId: 'PT-0002', visit: 'Baseline', assessmentDate: '2026-01-20', ndiPercentage: 78, ndiBand: 'complete', mjoaTotal: 7, mjoaBand: 'severe', eq5dIndex: -0.302, eq5dVas: 25 },
  { id: 'S005', subjectId: 'PT-0002', visit: '6-week', assessmentDate: '2026-03-03', ndiPercentage: 50, ndiBand: 'complete', mjoaTotal: 9, mjoaBand: 'severe', eq5dIndex: 0.052, eq5dVas: 45 },

  { id: 'S006', subjectId: 'PT-0003', visit: 'Baseline', assessmentDate: '2026-02-02', ndiPercentage: 18, ndiBand: 'moderate', mjoaTotal: 16, mjoaBand: 'mild', eq5dIndex: 0.708, eq5dVas: 75 },
  { id: 'S007', subjectId: 'PT-0003', visit: '3-month', assessmentDate: '2026-05-04', ndiPercentage: 8, ndiBand: 'mild', mjoaTotal: 17, mjoaBand: 'mild', eq5dIndex: 1.0, eq5dVas: 90 },

  { id: 'S008', subjectId: 'PT-0004', visit: 'Baseline', assessmentDate: '2026-03-11', ndiPercentage: 36, ndiBand: 'severe', mjoaTotal: 13, mjoaBand: 'moderate', eq5dIndex: 0.157, eq5dVas: 60 },
  { id: 'S009', subjectId: 'PT-0004', visit: '1-year', assessmentDate: '2027-03-09', ndiPercentage: 12, ndiBand: 'mild', mjoaTotal: 16, mjoaBand: 'mild', eq5dIndex: 0.795, eq5dVas: 80 },

  { id: 'S010', subjectId: 'PT-0005', visit: 'Baseline', assessmentDate: '2026-04-06', ndiPercentage: 2, ndiBand: 'no-disability', mjoaTotal: 17, mjoaBand: 'mild', eq5dIndex: 1.0, eq5dVas: 95 }
];
