// Sample screening data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline. The
// rows span every result class and management action, both care settings, and
// the urgent flag is set whenever urgent colposcopy is indicated.

(function () {
'use strict';
window.CervicalScreeningDashboard = window.CervicalScreeningDashboard || {};

/** @type {import('./dashboard-types.js').ScreeningRow[]} */
const sampleScreenings = [
  {
    id: '1',
    patientIdentifier: 'GP-448120',
    patientName: 'Okoro, Amara',
    careSetting: 'general-practice',
    resultClass: 'hpv-negative',
    managementAction: 'routine-recall',
    urgentFlag: false,
    screenedAt: '2026-06-22'
  },
  {
    id: '2',
    patientIdentifier: 'GP-448377',
    patientName: 'Nowak, Zofia',
    careSetting: 'general-practice',
    resultClass: 'hpv-positive-cytology-normal',
    managementAction: 'early-repeat-12-months',
    urgentFlag: false,
    screenedAt: '2026-06-23'
  },
  {
    id: '3',
    patientIdentifier: 'SH-100517',
    patientName: 'Fletcher, Rosemary',
    careSetting: 'sexual-health',
    resultClass: 'hpv-positive-cytology-abnormal-low',
    managementAction: 'colposcopy-referral',
    urgentFlag: false,
    screenedAt: '2026-06-24'
  },
  {
    id: '4',
    patientIdentifier: 'GP-448512',
    patientName: 'Silva, Marta',
    careSetting: 'general-practice',
    resultClass: 'hpv-positive-cytology-abnormal-high',
    managementAction: 'urgent-colposcopy-referral',
    urgentFlag: true,
    screenedAt: '2026-06-25'
  },
  {
    id: '5',
    patientIdentifier: 'SH-100639',
    patientName: 'Byrne, Aoife',
    careSetting: 'sexual-health',
    resultClass: 'inadequate',
    managementAction: 'repeat-sample-3-months',
    urgentFlag: false,
    screenedAt: '2026-06-26'
  },
  {
    id: '6',
    patientIdentifier: 'GP-448690',
    patientName: 'MacLeod, Iona',
    careSetting: 'general-practice',
    resultClass: 'cease-not-eligible',
    managementAction: 'cease-screening',
    urgentFlag: false,
    screenedAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'SH-100742',
    patientName: 'Adeyemi, Grace',
    careSetting: 'sexual-health',
    resultClass: 'hpv-positive-cytology-pending',
    managementAction: 'awaiting-cytology',
    urgentFlag: false,
    screenedAt: '2026-06-28'
  }
];

window.CervicalScreeningDashboard.sampleScreenings = sampleScreenings;
})();
