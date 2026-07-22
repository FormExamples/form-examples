// Sample inspection-round data for the dashboard's offline / no-backend
// fallback. Field shape matches the (aggregated) rows the Rust backend's
// GET /api/checklists endpoint is expected to return.

export const SAMPLE_CHECKLISTS = [
  { id: 'H001', date: '2026-06-01', hospitalName: 'St. Mary District Hospital', departmentOrSite: 'Main block', inspectingOfficerName: 'Dr. Anjali Rao', inspectingOfficerDesignation: 'Medical Superintendent', answeredCount: 97, needsAttentionCount: 0, sectionsFlaggedCount: 0, topFlaggedAreas: [] },
  { id: 'H002', date: '2026-06-08', hospitalName: 'St. Mary District Hospital', departmentOrSite: 'Main block', inspectingOfficerName: 'Dr. Anjali Rao', inspectingOfficerDesignation: 'Medical Superintendent', answeredCount: 97, needsAttentionCount: 3, sectionsFlaggedCount: 2, topFlaggedAreas: ['Water Supply', 'House Keeping'] },
  { id: 'H003', date: '2026-06-15', hospitalName: 'St. Mary District Hospital', departmentOrSite: 'Main block', inspectingOfficerName: 'Dr. Anjali Rao', inspectingOfficerDesignation: 'Medical Superintendent', answeredCount: 97, needsAttentionCount: 1, sectionsFlaggedCount: 1, topFlaggedAreas: ['Electric Supply'] },

  { id: 'H004', date: '2026-06-02', hospitalName: 'Riverside Community Health Centre', departmentOrSite: 'OPD wing', inspectingOfficerName: 'Dr. Kwame Boateng', inspectingOfficerDesignation: 'Resident Medical Officer', answeredCount: 82, needsAttentionCount: 6, sectionsFlaggedCount: 4, topFlaggedAreas: ['OPD', 'Store', 'Diet', 'Hospital Waste Management'] },
  { id: 'H005', date: '2026-06-09', hospitalName: 'Riverside Community Health Centre', departmentOrSite: 'OPD wing', inspectingOfficerName: 'Dr. Kwame Boateng', inspectingOfficerDesignation: 'Resident Medical Officer', answeredCount: 97, needsAttentionCount: 2, sectionsFlaggedCount: 2, topFlaggedAreas: ['Store', 'Diet'] },

  { id: 'H006', date: '2026-06-03', hospitalName: 'Northgate General Hospital', departmentOrSite: 'Surgical block', inspectingOfficerName: 'Dr. Priya Menon', inspectingOfficerDesignation: 'Medical Superintendent', answeredCount: 97, needsAttentionCount: 11, sectionsFlaggedCount: 6, topFlaggedAreas: ['O.T. / ICU', 'Labour Room', 'Observance & Practice of Infection Control Protocols'] },
  { id: 'H007', date: '2026-06-10', hospitalName: 'Northgate General Hospital', departmentOrSite: 'Surgical block', inspectingOfficerName: 'Dr. Priya Menon', inspectingOfficerDesignation: 'Medical Superintendent', answeredCount: 97, needsAttentionCount: 7, sectionsFlaggedCount: 4, topFlaggedAreas: ['O.T. / ICU', 'Labour Room'] },
  { id: 'H008', date: '2026-06-17', hospitalName: 'Northgate General Hospital', departmentOrSite: 'Surgical block', inspectingOfficerName: 'Dr. Priya Menon', inspectingOfficerDesignation: 'Medical Superintendent', answeredCount: 97, needsAttentionCount: 4, sectionsFlaggedCount: 3, topFlaggedAreas: ['Labour Room'] },

  { id: 'H009', date: '2026-06-04', hospitalName: 'Elmwood Rural Health Unit', departmentOrSite: 'Whole facility', inspectingOfficerName: 'Nurse Grace Achieng', inspectingOfficerDesignation: 'Quality / Infection-control Officer', answeredCount: 45, needsAttentionCount: 0, sectionsFlaggedCount: 0, topFlaggedAreas: [] },

  { id: 'H010', date: '2026-06-05', hospitalName: 'Cedar Valley Medical Centre', departmentOrSite: 'Whole facility', inspectingOfficerName: 'Dr. Liu Wei', inspectingOfficerDesignation: 'Hospital Administrator', answeredCount: 97, needsAttentionCount: 18, sectionsFlaggedCount: 9, topFlaggedAreas: ['Hospital Waste Management', 'House Keeping', 'Water Supply', 'Electric Supply'] },
];
