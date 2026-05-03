// Sample patient data for the WHO Emergency First Aid clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic CFAR encounters spanning medical and trauma cases, the
// three GCS levels, and a range of urgent-flag counts.

(function () {
'use strict';
window.WhoEmergencyFirstAidDashboard = window.WhoEmergencyFirstAidDashboard || {};

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    patientName: 'Adeyemi, Tunde',
    age: 34,
    sex: 'M',
    problemType: 'trauma',
    majorBleeding: true,
    tourniquetApplied: true,
    airwayIntervention: false,
    gcsLevel: 'alert',
    urgentFlagCount: 2,
    recordedBy: 'Okafor, Chinwe',
    recordedAt: '2026-04-12T08:35:00Z'
  },
  {
    id: '2',
    patientName: 'Patel, Priya',
    age: 67,
    sex: 'F',
    problemType: 'medical',
    majorBleeding: false,
    tourniquetApplied: false,
    airwayIntervention: true,
    gcsLevel: 'unconscious',
    urgentFlagCount: 3,
    recordedBy: 'Singh, Ravi',
    recordedAt: '2026-04-13T13:10:00Z'
  },
  {
    id: '3',
    patientName: 'Jones, Margaret',
    age: 71,
    sex: 'F',
    problemType: 'medical',
    majorBleeding: false,
    tourniquetApplied: false,
    airwayIntervention: false,
    gcsLevel: 'confused',
    urgentFlagCount: 1,
    recordedBy: 'Brown, Sarah',
    recordedAt: '2026-04-14T09:55:00Z'
  },
  {
    id: '4',
    patientName: 'Williams, David',
    age: 58,
    sex: 'M',
    problemType: 'trauma',
    majorBleeding: true,
    tourniquetApplied: false,
    airwayIntervention: true,
    gcsLevel: 'unconscious',
    urgentFlagCount: 3,
    recordedBy: 'Taylor, James',
    recordedAt: '2026-04-15T07:25:00Z'
  },
  {
    id: '5',
    patientName: 'Nakamura, Yuki',
    age: 29,
    sex: 'F',
    problemType: 'medical',
    majorBleeding: false,
    tourniquetApplied: false,
    airwayIntervention: false,
    gcsLevel: 'alert',
    urgentFlagCount: 0,
    recordedBy: 'Davies, Helen',
    recordedAt: '2026-04-16T15:50:00Z'
  },
  {
    id: '6',
    patientName: 'Garcia, Luis',
    age: 42,
    sex: 'M',
    problemType: 'trauma',
    majorBleeding: true,
    tourniquetApplied: true,
    airwayIntervention: true,
    gcsLevel: 'unconscious',
    urgentFlagCount: 4,
    recordedBy: 'Wilson, Robert',
    recordedAt: '2026-04-17T10:15:00Z'
  },
  {
    id: '7',
    patientName: "O'Connor, Niamh",
    age: 16,
    sex: 'F',
    problemType: 'medical',
    majorBleeding: false,
    tourniquetApplied: false,
    airwayIntervention: false,
    gcsLevel: 'alert',
    urgentFlagCount: 1,
    recordedBy: 'Evans, Catherine',
    recordedAt: '2026-04-18T13:05:00Z'
  },
  {
    id: '8',
    patientName: 'Thomas, Michael',
    age: 63,
    sex: 'M',
    problemType: 'medical',
    majorBleeding: false,
    tourniquetApplied: false,
    airwayIntervention: true,
    gcsLevel: 'confused',
    urgentFlagCount: 2,
    recordedBy: 'Robinson, Emma',
    recordedAt: '2026-04-19T14:55:00Z'
  },
  {
    id: '9',
    patientName: 'Martinez, Sofia',
    age: 24,
    sex: 'F',
    problemType: 'trauma',
    majorBleeding: true,
    tourniquetApplied: false,
    airwayIntervention: false,
    gcsLevel: 'alert',
    urgentFlagCount: 1,
    recordedBy: 'Clark, George',
    recordedAt: '2026-04-20T10:00:00Z'
  },
  {
    id: '10',
    patientName: 'Hassan, Amira',
    age: 38,
    sex: 'F',
    problemType: 'medical',
    majorBleeding: false,
    tourniquetApplied: false,
    airwayIntervention: false,
    gcsLevel: 'alert',
    urgentFlagCount: 0,
    recordedBy: 'Okafor, Chinwe',
    recordedAt: '2026-04-21T09:05:00Z'
  },
  {
    id: '11',
    patientName: 'Schneider, Karl',
    age: 81,
    sex: 'M',
    problemType: 'trauma',
    majorBleeding: false,
    tourniquetApplied: false,
    airwayIntervention: false,
    gcsLevel: 'confused',
    urgentFlagCount: 2,
    recordedBy: 'Singh, Ravi',
    recordedAt: '2026-04-22T14:05:00Z'
  },
  {
    id: '12',
    patientName: 'Chen, Wei',
    age: 9,
    sex: 'M',
    problemType: 'medical',
    majorBleeding: false,
    tourniquetApplied: false,
    airwayIntervention: true,
    gcsLevel: 'unconscious',
    urgentFlagCount: 3,
    recordedBy: 'Brown, Sarah',
    recordedAt: '2026-04-23T11:30:00Z'
  }
];

window.WhoEmergencyFirstAidDashboard.samplePatients = samplePatients;
})();
