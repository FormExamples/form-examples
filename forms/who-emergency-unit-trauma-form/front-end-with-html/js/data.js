// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic trauma encounters spanning every triage category, every
// mechanism of injury, and every disposition; multiple rows with FAST
// positive findings and one dead-on-arrival row.

(function () {
'use strict';
window.WhoEmergencyUnitTraumaDashboard = window.WhoEmergencyUnitTraumaDashboard || {};

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    patientName: 'Adams, Olivia',
    dateOfBirth: '1992-04-22',
    sex: 'F',
    injuryLocation: 'Highway A1 \u2014 head-on collision',
    triageCategory: 'red',
    deadOnArrival: false,
    mechanism: 'road-traffic',
    gcsTotal: 8,
    fastPositive: true,
    urgentFlagCount: 5,
    disposition: 'admit',
    providerName: 'Dr. Mensah',
    dispositionAt: '2026-04-12T10:45:00Z'
  },
  {
    id: '2',
    patientName: 'Bashir, Amir',
    dateOfBirth: '1958-12-03',
    sex: 'M',
    injuryLocation: 'Construction site \u2014 scaffolding fall, 4m',
    triageCategory: 'red',
    deadOnArrival: false,
    mechanism: 'fall',
    gcsTotal: 11,
    fastPositive: false,
    urgentFlagCount: 4,
    disposition: 'admit',
    providerName: 'Dr. Okafor',
    dispositionAt: '2026-04-13T15:20:00Z'
  },
  {
    id: '3',
    patientName: 'Chen, Wei',
    dateOfBirth: '1995-07-15',
    sex: 'F',
    injuryLocation: 'Home \u2014 kitchen, lacerated hand',
    triageCategory: 'green',
    deadOnArrival: false,
    mechanism: 'penetrating',
    gcsTotal: 15,
    fastPositive: false,
    urgentFlagCount: 0,
    disposition: 'discharge',
    providerName: 'Dr. Thompson',
    dispositionAt: '2026-04-14T09:10:00Z'
  },
  {
    id: '4',
    patientName: 'Diallo, Mariama',
    dateOfBirth: '1972-09-30',
    sex: 'F',
    injuryLocation: 'Workplace \u2014 chemical burn, forearm',
    triageCategory: 'yellow',
    deadOnArrival: false,
    mechanism: 'burn',
    gcsTotal: 15,
    fastPositive: false,
    urgentFlagCount: 1,
    disposition: 'transfer',
    providerName: 'Dr. Mensah',
    dispositionAt: '2026-04-15T11:55:00Z'
  },
  {
    id: '5',
    patientName: 'Engstrom, Lars',
    dateOfBirth: '1949-02-18',
    sex: 'M',
    injuryLocation: 'Stairway \u2014 slip, head strike',
    triageCategory: 'yellow',
    deadOnArrival: false,
    mechanism: 'fall',
    gcsTotal: 13,
    fastPositive: false,
    urgentFlagCount: 2,
    disposition: 'admit',
    providerName: 'Dr. Okafor',
    dispositionAt: '2026-04-16T07:30:00Z'
  },
  {
    id: '6',
    patientName: 'Fernandes, Carla',
    dateOfBirth: '1988-06-09',
    sex: 'F',
    injuryLocation: 'Street \u2014 assault, blunt facial trauma',
    triageCategory: 'yellow',
    deadOnArrival: false,
    mechanism: 'blunt',
    gcsTotal: 14,
    fastPositive: false,
    urgentFlagCount: 2,
    disposition: 'discharge',
    providerName: 'Dr. Thompson',
    dispositionAt: '2026-04-17T13:45:00Z'
  },
  {
    id: '7',
    patientName: 'Goldberg, Daniel',
    dateOfBirth: '1965-11-27',
    sex: 'M',
    injuryLocation: 'Roadway \u2014 pedestrian struck',
    triageCategory: 'red',
    deadOnArrival: true,
    mechanism: 'road-traffic',
    gcsTotal: 3,
    fastPositive: true,
    urgentFlagCount: 6,
    disposition: 'died',
    providerName: 'Dr. Mensah',
    dispositionAt: '2026-04-18T08:00:00Z'
  },
  {
    id: '8',
    patientName: 'Hassan, Layla',
    dateOfBirth: '2001-03-14',
    sex: 'F',
    injuryLocation: 'Sports field \u2014 ankle sprain',
    triageCategory: 'green',
    deadOnArrival: false,
    mechanism: 'blunt',
    gcsTotal: 15,
    fastPositive: false,
    urgentFlagCount: 0,
    disposition: 'lwbs',
    providerName: '',
    dispositionAt: '2026-04-19T16:25:00Z'
  },
  {
    id: '9',
    patientName: 'Ivanov, Sergei',
    dateOfBirth: '1953-08-05',
    sex: 'M',
    injuryLocation: 'Market \u2014 stab wound, abdomen',
    triageCategory: 'red',
    deadOnArrival: false,
    mechanism: 'penetrating',
    gcsTotal: 12,
    fastPositive: true,
    urgentFlagCount: 4,
    disposition: 'admit',
    providerName: 'Dr. Okafor',
    dispositionAt: '2026-04-20T12:15:00Z'
  },
  {
    id: '10',
    patientName: 'Johansson, Astrid',
    dateOfBirth: '1992-01-21',
    sex: 'F',
    injuryLocation: 'Cycling lane \u2014 bike crash',
    triageCategory: 'yellow',
    deadOnArrival: false,
    mechanism: 'road-traffic',
    gcsTotal: 14,
    fastPositive: false,
    urgentFlagCount: 1,
    disposition: 'discharge',
    providerName: 'Dr. Thompson',
    dispositionAt: '2026-04-21T14:50:00Z'
  },
  {
    id: '11',
    patientName: 'Kumar, Ravi',
    dateOfBirth: '1976-10-12',
    sex: 'M',
    injuryLocation: 'Factory \u2014 unidentified mechanism, multi-system',
    triageCategory: 'red',
    deadOnArrival: false,
    mechanism: 'other',
    gcsTotal: 13,
    fastPositive: false,
    urgentFlagCount: 3,
    disposition: 'admit',
    providerName: 'Dr. Mensah',
    dispositionAt: '2026-04-22T10:05:00Z'
  },
  {
    id: '12',
    patientName: 'Lopez, Maria',
    dateOfBirth: '1944-05-30',
    sex: 'F',
    injuryLocation: 'Kitchen \u2014 scald, both hands',
    triageCategory: 'yellow',
    deadOnArrival: false,
    mechanism: 'burn',
    gcsTotal: 15,
    fastPositive: false,
    urgentFlagCount: 1,
    disposition: 'transfer',
    providerName: 'Dr. Okafor',
    dispositionAt: '2026-04-23T09:35:00Z'
  }
];

window.WhoEmergencyUnitTraumaDashboard.samplePatients = samplePatients;
})();
