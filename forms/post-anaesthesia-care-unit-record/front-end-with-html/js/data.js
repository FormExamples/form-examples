// Sample recovery-record data for the recovery-team dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline. The
// rows span the Aldrete score range, both readiness bands, and every anaesthetic
// technique, with the not-ready flag set whenever the band is 'not-ready'.

(function () {
'use strict';
window.PostAnaesthesiaCareUnitRecordDashboard =
  window.PostAnaesthesiaCareUnitRecordDashboard || {};

/** @type {import('./dashboard-types.js').RecordRow[]} */
const sampleRecords = [
  {
    id: '1',
    patientIdentifier: 'PACU-100482',
    patientName: 'Osei, Grace',
    anaestheticTechnique: 'general',
    aldreteTotal: 10,
    readinessBand: 'discharge-ready',
    notReadyFlag: false,
    admittedAt: '2026-06-24'
  },
  {
    id: '2',
    patientIdentifier: 'PACU-573110',
    patientName: 'Mackenzie, Ian',
    anaestheticTechnique: 'regional',
    aldreteTotal: 9,
    readinessBand: 'discharge-ready',
    notReadyFlag: false,
    admittedAt: '2026-06-25'
  },
  {
    id: '3',
    patientIdentifier: 'PACU-100517',
    patientName: 'Nowak, Zofia',
    anaestheticTechnique: 'general',
    aldreteTotal: 9,
    readinessBand: 'not-ready',
    notReadyFlag: true,
    admittedAt: '2026-06-26'
  },
  {
    id: '4',
    patientIdentifier: 'PACU-880204',
    patientName: 'Ahmed, Bilal',
    anaestheticTechnique: 'sedation',
    aldreteTotal: 6,
    readinessBand: 'not-ready',
    notReadyFlag: true,
    admittedAt: '2026-06-26'
  },
  {
    id: '5',
    patientIdentifier: 'PACU-573642',
    patientName: 'Fletcher, Rosemary',
    anaestheticTechnique: 'combined',
    aldreteTotal: 8,
    readinessBand: 'not-ready',
    notReadyFlag: true,
    admittedAt: '2026-06-27'
  },
  {
    id: '6',
    patientIdentifier: 'PACU-100639',
    patientName: 'Silva, Marcos',
    anaestheticTechnique: 'general',
    aldreteTotal: 10,
    readinessBand: 'discharge-ready',
    notReadyFlag: false,
    admittedAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'PACU-880351',
    patientName: 'Byrne, Aoife',
    anaestheticTechnique: 'regional',
    aldreteTotal: 7,
    readinessBand: 'not-ready',
    notReadyFlag: true,
    admittedAt: '2026-06-28'
  }
];

window.PostAnaesthesiaCareUnitRecordDashboard.sampleRecords = sampleRecords;
})();
