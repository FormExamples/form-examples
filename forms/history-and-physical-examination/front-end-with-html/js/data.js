// Sample clerking data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline. The
// rows span all three completeness statuses, the full percentage range, every
// care setting, and both blocking-flag states (a blocking flag always forces an
// incomplete status).

(function () {
'use strict';
window.HistoryAndPhysicalExaminationDashboard =
  window.HistoryAndPhysicalExaminationDashboard || {};

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: '1',
    patientIdentifier: 'AMU-100482',
    patientName: 'Osei, Grace',
    careSetting: 'acute-medical-unit',
    status: 'complete',
    completenessPercent: 100,
    blockingFlag: false,
    clerkedAt: '2026-06-24'
  },
  {
    id: '2',
    patientIdentifier: 'ED-573110',
    patientName: 'Mackenzie, Ian',
    careSetting: 'emergency-department',
    status: 'partial',
    completenessPercent: 80,
    blockingFlag: false,
    clerkedAt: '2026-06-25'
  },
  {
    id: '3',
    patientIdentifier: 'ED-100517',
    patientName: 'Nowak, Zofia',
    careSetting: 'emergency-department',
    status: 'incomplete',
    completenessPercent: 60,
    blockingFlag: true,
    clerkedAt: '2026-06-26'
  },
  {
    id: '4',
    patientIdentifier: 'WD-880204',
    patientName: 'Ahmed, Bilal',
    careSetting: 'ward',
    status: 'complete',
    completenessPercent: 100,
    blockingFlag: false,
    clerkedAt: '2026-06-26'
  },
  {
    id: '5',
    patientIdentifier: 'AMU-573642',
    patientName: 'Fletcher, Rosemary',
    careSetting: 'acute-medical-unit',
    status: 'incomplete',
    completenessPercent: 40,
    blockingFlag: true,
    clerkedAt: '2026-06-27'
  },
  {
    id: '6',
    patientIdentifier: 'WD-100639',
    patientName: 'Silva, Marcos',
    careSetting: 'ward',
    status: 'partial',
    completenessPercent: 90,
    blockingFlag: false,
    clerkedAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'ED-880351',
    patientName: 'Byrne, Aoife',
    careSetting: 'emergency-department',
    status: 'incomplete',
    completenessPercent: 20,
    blockingFlag: false,
    clerkedAt: '2026-06-28'
  }
];

window.HistoryAndPhysicalExaminationDashboard.sampleAssessments = sampleAssessments;
})();
