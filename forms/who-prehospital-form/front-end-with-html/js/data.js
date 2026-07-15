// Sample EMS call data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic prehospital encounters spanning every scene type, triage
// category, reassessment count (0-3), and a mix of completed/in-progress
// handovers.

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    patientName: 'Adams, Olivia',
    age: 45,
    sex: 'F',
    sceneType: 'home',
    chiefComplaint: 'Crushing chest pain, diaphoresis',
    triageCategory: 'red',
    gcsTotal: 14,
    reassessmentCount: 3,
    urgentFlagCount: 4,
    providerName: 'Medic Mensah',
    dispatchedAt: '2026-04-12T10:05:00Z',
    handoverAt: '2026-04-12T10:42:00Z'
  },
  {
    id: '2',
    patientName: 'Bashir, Amir',
    age: 68,
    sex: 'M',
    sceneType: 'roadside',
    chiefComplaint: 'High-speed MVC, chest and pelvis pain',
    triageCategory: 'red',
    gcsTotal: 11,
    reassessmentCount: 3,
    urgentFlagCount: 5,
    providerName: 'Medic Okafor',
    dispatchedAt: '2026-04-13T14:50:00Z',
    handoverAt: '2026-04-13T15:30:00Z'
  },
  {
    id: '3',
    patientName: 'Chen, Wei',
    age: 30,
    sex: 'F',
    sceneType: 'workplace',
    chiefComplaint: 'Hand laceration from machinery',
    triageCategory: 'green',
    gcsTotal: 15,
    reassessmentCount: 1,
    urgentFlagCount: 0,
    providerName: 'Medic Thompson',
    dispatchedAt: '2026-04-14T08:55:00Z',
    handoverAt: '2026-04-14T09:25:00Z'
  },
  {
    id: '4',
    patientName: 'Diallo, Mariama',
    age: 53,
    sex: 'F',
    sceneType: 'public',
    chiefComplaint: 'Syncope at market, alert on arrival',
    triageCategory: 'yellow',
    gcsTotal: 15,
    reassessmentCount: 2,
    urgentFlagCount: 1,
    providerName: 'Medic Mensah',
    dispatchedAt: '2026-04-15T11:25:00Z',
    handoverAt: '2026-04-15T12:00:00Z'
  },
  {
    id: '5',
    patientName: 'Engstrom, Lars',
    age: 76,
    sex: 'M',
    sceneType: 'home',
    chiefComplaint: 'Altered mental status, suspected stroke',
    triageCategory: 'red',
    gcsTotal: 9,
    reassessmentCount: 3,
    urgentFlagCount: 4,
    providerName: 'Medic Okafor',
    dispatchedAt: '2026-04-16T07:00:00Z',
    handoverAt: '2026-04-16T07:35:00Z'
  },
  {
    id: '6',
    patientName: 'Fernandes, Carla',
    age: 37,
    sex: 'F',
    sceneType: 'home',
    chiefComplaint: 'Severe migraine, vomiting',
    triageCategory: 'yellow',
    gcsTotal: 15,
    reassessmentCount: 1,
    urgentFlagCount: 1,
    providerName: 'Medic Thompson',
    dispatchedAt: '2026-04-17T13:10:00Z',
    handoverAt: '2026-04-17T13:50:00Z'
  },
  {
    id: '7',
    patientName: 'Goldberg, Daniel',
    age: 60,
    sex: 'M',
    sceneType: 'public',
    chiefComplaint: 'Witnessed cardiac arrest, ROSC after CPR',
    triageCategory: 'red',
    gcsTotal: 3,
    reassessmentCount: 3,
    urgentFlagCount: 6,
    providerName: 'Medic Mensah',
    dispatchedAt: '2026-04-18T07:30:00Z',
    handoverAt: '2026-04-18T08:05:00Z'
  },
  {
    id: '8',
    patientName: 'Hassan, Layla',
    age: 24,
    sex: 'F',
    sceneType: 'home',
    chiefComplaint: 'Possible overdose, pinpoint pupils',
    triageCategory: 'red',
    gcsTotal: 7,
    reassessmentCount: 2,
    urgentFlagCount: 3,
    providerName: 'Medic Okafor',
    dispatchedAt: '2026-04-19T16:00:00Z',
    handoverAt: null
  },
  {
    id: '9',
    patientName: 'Ivanov, Sergei',
    age: 71,
    sex: 'M',
    sceneType: 'medical-facility',
    chiefComplaint: 'Inter-facility transfer, GI bleed',
    triageCategory: 'yellow',
    gcsTotal: 14,
    reassessmentCount: 2,
    urgentFlagCount: 2,
    providerName: 'Medic Thompson',
    dispatchedAt: '2026-04-20T11:45:00Z',
    handoverAt: '2026-04-20T12:30:00Z'
  },
  {
    id: '10',
    patientName: 'Johansson, Astrid',
    age: 33,
    sex: 'F',
    sceneType: 'roadside',
    chiefComplaint: 'Pedestrian struck, leg deformity',
    triageCategory: 'yellow',
    gcsTotal: 15,
    reassessmentCount: 2,
    urgentFlagCount: 2,
    providerName: 'Medic Mensah',
    dispatchedAt: '2026-04-21T14:20:00Z',
    handoverAt: '2026-04-21T15:00:00Z'
  },
  {
    id: '11',
    patientName: 'Kumar, Ravi',
    age: 49,
    sex: 'M',
    sceneType: 'workplace',
    chiefComplaint: 'Fall from scaffolding, back pain',
    triageCategory: 'red',
    gcsTotal: 13,
    reassessmentCount: 3,
    urgentFlagCount: 3,
    providerName: 'Medic Okafor',
    dispatchedAt: '2026-04-22T09:30:00Z',
    handoverAt: null
  },
  {
    id: '12',
    patientName: 'Lopez, Maria',
    age: 82,
    sex: 'F',
    sceneType: 'other',
    chiefComplaint: 'Dehydration, weakness at relative\u2019s home',
    triageCategory: 'green',
    gcsTotal: 15,
    reassessmentCount: 0,
    urgentFlagCount: 0,
    providerName: 'Medic Thompson',
    dispatchedAt: '2026-04-23T08:55:00Z',
    handoverAt: '2026-04-23T09:30:00Z'
  }
];

export { samplePatients };
