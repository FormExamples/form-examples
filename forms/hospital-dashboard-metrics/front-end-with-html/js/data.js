// Sample reporting-period data for the dashboard's offline / no-backend
// fallback. Field shape matches the (aggregated) rows the Rust backend's
// GET /api/hospital-dashboard-metrics endpoint is expected to return.
//
// recordedCount is out of 67 (see ../js/metrics.js DASHBOARD_METRICS).
// categoryGaps lists category titles with at least one unrecorded metric.

export const SAMPLE_DASHBOARD_METRICS = [
  { id: 'D001', period: '2026-06', hospitalName: 'St. Mary District Hospital', preparedByName: 'Dr. Anjali Rao', recordedCount: 67, categoryGaps: [] },
  { id: 'D002', period: '2026-05', hospitalName: 'St. Mary District Hospital', preparedByName: 'Dr. Anjali Rao', recordedCount: 65, categoryGaps: ['Radiology Metrics'] },
  { id: 'D003', period: '2026-04', hospitalName: 'St. Mary District Hospital', preparedByName: 'Dr. Anjali Rao', recordedCount: 67, categoryGaps: [] },

  { id: 'D004', period: '2026-06', hospitalName: 'Riverside Community Health Centre', preparedByName: 'Dr. Kwame Boateng', recordedCount: 41, categoryGaps: ['Blood Bank Metrics', 'Surgery / Operating Room Metrics', 'Radiology Metrics', 'Occurrence Variance Report (OVR) Metrics'] },
  { id: 'D005', period: '2026-05', hospitalName: 'Riverside Community Health Centre', preparedByName: 'Dr. Kwame Boateng', recordedCount: 58, categoryGaps: ['Blood Bank Metrics', 'Radiology Metrics'] },

  { id: 'D006', period: '2026-06', hospitalName: 'Northgate General Hospital', preparedByName: 'Dr. Priya Menon', recordedCount: 67, categoryGaps: [] },
  { id: 'D007', period: '2026-05', hospitalName: 'Northgate General Hospital', preparedByName: 'Dr. Priya Menon', recordedCount: 67, categoryGaps: [] },
  { id: 'D008', period: '2026-04', hospitalName: 'Northgate General Hospital', preparedByName: 'Dr. Priya Menon', recordedCount: 60, categoryGaps: ['Human Resources Metrics'] },

  { id: 'D009', period: '2026-06', hospitalName: 'Elmwood Rural Health Unit', preparedByName: 'Nurse Grace Achieng', recordedCount: 19, categoryGaps: ['Emergency Department Metrics', 'Blood Bank Metrics', 'Surgery / Operating Room Metrics', 'Radiology Metrics', 'Human Resources Metrics', 'Occurrence Variance Report (OVR) Metrics', 'Facilities & Biomedical Engineering Metrics'] },

  { id: 'D010', period: '2026-06', hospitalName: 'Cedar Valley Medical Centre', preparedByName: 'Dr. Liu Wei', recordedCount: 67, categoryGaps: [] },
];
