// Sample reporting-period data for the dashboard's offline / no-backend
// fallback. Field shape matches the (aggregated) rows the Rust backend's
// GET /api/hospital-performance-indicators endpoint is expected to return.
//
// recordedCount is out of 50 (see ../js/indicators.js PERFORMANCE_INDICATORS).
// categoryGaps lists Balanced Scorecard perspective titles with at least one
// unrecorded indicator.

export const SAMPLE_PERFORMANCE_INDICATORS = [
  { id: 'P001', period: '2026-06', hospitalName: 'St. Mary District Hospital', preparedByName: 'Dr. Anjali Rao', recordedCount: 50, categoryGaps: [] },
  { id: 'P002', period: '2026-05', hospitalName: 'St. Mary District Hospital', preparedByName: 'Dr. Anjali Rao', recordedCount: 46, categoryGaps: ['Customer Indicators'] },
  { id: 'P003', period: '2026-04', hospitalName: 'St. Mary District Hospital', preparedByName: 'Dr. Anjali Rao', recordedCount: 50, categoryGaps: [] },

  { id: 'P004', period: '2026-06', hospitalName: 'Riverside Community Health Centre', preparedByName: 'Dr. Kwame Boateng', recordedCount: 31, categoryGaps: ['Process Indicators', 'Learning and Growth Indicators', 'Customer Indicators'] },
  { id: 'P005', period: '2026-05', hospitalName: 'Riverside Community Health Centre', preparedByName: 'Dr. Kwame Boateng', recordedCount: 42, categoryGaps: ['Process Indicators'] },

  { id: 'P006', period: '2026-06', hospitalName: 'Northgate General Hospital', preparedByName: 'Dr. Priya Menon', recordedCount: 50, categoryGaps: [] },
  { id: 'P007', period: '2026-05', hospitalName: 'Northgate General Hospital', preparedByName: 'Dr. Priya Menon', recordedCount: 50, categoryGaps: [] },
  { id: 'P008', period: '2026-04', hospitalName: 'Northgate General Hospital', preparedByName: 'Dr. Priya Menon', recordedCount: 44, categoryGaps: ['Learning and Growth Indicators'] },

  { id: 'P009', period: '2026-06', hospitalName: 'Elmwood Rural Health Unit', preparedByName: 'Nurse Grace Achieng', recordedCount: 14, categoryGaps: ['Finance Indicators', 'Process Indicators', 'Learning and Growth Indicators', 'Customer Indicators'] },

  { id: 'P010', period: '2026-06', hospitalName: 'Cedar Valley Medical Centre', preparedByName: 'Dr. Liu Wei', recordedCount: 50, categoryGaps: [] },
];
