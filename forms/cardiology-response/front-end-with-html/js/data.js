// Sample response data for the cardiology response interpretation dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Ported from the svelte data/sample-reports.ts `sampleReports` ResponseRow
// array. Rows span every classification (no-abnormality / cardiac-condition /
// critical / inconclusive), severity, and follow-up urgency (including the
// critical-result auto-escalation to critical-alert).

(function () {
'use strict';
window.CardiologyResponseDashboard =
  window.CardiologyResponseDashboard || {};

/** @type {import('./dashboard-types.js').ResponseRow[]} */
const sampleResponses = [
  {
    id: 'CR-2026-0001',
    patientName: 'Aisha Khan',
    consultationType: 'inpatient-review',
    responseStatus: 'final',
    respondedDate: '2026-06-02',
    responseClassification: 'critical',
    severity: 'major',
    followUpUrgency: 'critical-alert',
    completenessPercent: 100,
    flagCount: 3
  },
  {
    id: 'CR-2026-0002',
    patientName: 'Brian O’Connor',
    consultationType: 'clinic-review',
    responseStatus: 'final',
    respondedDate: '2026-06-03',
    responseClassification: 'cardiac-condition',
    severity: 'major',
    followUpUrgency: 'urgent',
    completenessPercent: 100,
    flagCount: 1
  },
  {
    id: 'CR-2026-0003',
    patientName: 'Carmen Diaz',
    consultationType: 'advice-and-guidance',
    responseStatus: 'final',
    respondedDate: '2026-06-04',
    responseClassification: 'no-abnormality',
    severity: 'none',
    followUpUrgency: 'routine',
    completenessPercent: 100,
    flagCount: 0
  },
  {
    id: 'CR-2026-0004',
    patientName: 'David Müller',
    consultationType: 'clinic-review',
    responseStatus: 'final',
    respondedDate: '2026-06-05',
    responseClassification: 'cardiac-condition',
    severity: 'moderate',
    followUpUrgency: 'recommended',
    completenessPercent: 100,
    flagCount: 1
  },
  {
    id: 'CR-2026-0005',
    patientName: 'Evelyn Wright',
    consultationType: 'telephone',
    responseStatus: 'preliminary',
    respondedDate: '2026-06-06',
    responseClassification: 'inconclusive',
    severity: 'none',
    followUpUrgency: 'recommended',
    completenessPercent: 80,
    flagCount: 1
  },
  {
    id: 'CR-2026-0006',
    patientName: 'Farid Hassan',
    consultationType: 'virtual',
    responseStatus: 'final',
    respondedDate: '2026-06-07',
    responseClassification: 'cardiac-condition',
    severity: 'minor',
    followUpUrgency: 'recommended',
    completenessPercent: 100,
    flagCount: 1
  }
];

window.CardiologyResponseDashboard.sampleResponses = sampleResponses;
})();
