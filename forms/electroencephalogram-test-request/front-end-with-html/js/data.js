// Sample request data for the EEG vetting dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Ten realistic rows spanning every urgency tier (routine / urgent /
// emergency), every appropriateness band, and every clinical-priority band.
// NHS numbers are placeholder values in the canonical "NNN NNN NNNN" display
// form. Includes the required worked cases: a routine suspected-epilepsy
// request, an emergency suspected-status-epilepticus case, and an
// encephalopathy case.

(function () {
'use strict';
window.ElectroencephalogramTestRequestDashboard =
  window.ElectroencephalogramTestRequestDashboard || {};

/** @type {import('./types.js').RequestRow[]} */
const sampleRequests = [
  {
    id: 'E001',
    referralDate: '2026-05-04',
    patient: 'Okafor, Amara',
    nhs: '401 234 5678',
    eegType: 'routine-awake',
    indication: 'suspected-epilepsy',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'routine',
    priorityBand: 'low',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'E002',
    referralDate: '2026-05-05',
    patient: 'Bianchi, Sofia',
    nhs: '402 345 6789',
    eegType: 'routine-awake',
    indication: 'status-epilepticus',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'emergency',
    priorityBand: 'high',
    completenessPercent: 95,
    clinician: 'Dr K Mensah',
    flags: ['suspected-status-epilepticus']
  },
  {
    id: 'E003',
    referralDate: '2026-05-05',
    patient: 'Novak, Petra',
    nhs: '403 456 7890',
    eegType: 'routine-awake',
    indication: 'encephalopathy',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'urgent',
    priorityBand: 'high',
    completenessPercent: 90,
    clinician: 'Dr L Romano',
    flags: ['encephalopathy']
  },
  {
    id: 'E004',
    referralDate: '2026-05-06',
    patient: 'Hassan, Layla',
    nhs: '404 567 8901',
    eegType: 'routine-awake',
    indication: 'first-seizure',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'urgent',
    priorityBand: 'moderate',
    completenessPercent: 100,
    clinician: 'Dr M Adebayo',
    flags: ['recent-first-seizure']
  },
  {
    id: 'E005',
    referralDate: '2026-05-06',
    patient: 'Connolly, Niamh',
    nhs: '405 678 9012',
    eegType: 'video-telemetry',
    indication: 'pre-surgical-evaluation',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'routine',
    priorityBand: 'moderate',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'E006',
    referralDate: '2026-05-07',
    patient: 'Silva, Beatriz',
    nhs: '406 789 0123',
    eegType: 'ambulatory-24h',
    indication: 'funny-turns',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'routine',
    priorityBand: 'low',
    completenessPercent: 85,
    clinician: 'Dr P Sharma',
    flags: []
  },
  {
    id: 'E007',
    referralDate: '2026-05-07',
    patient: 'Andersson, Elin',
    nhs: '407 890 1234',
    eegType: 'routine-awake',
    indication: 'suspected-epilepsy',
    appropriatenessBand: 'may-be-appropriate',
    triageTier: 'routine',
    priorityBand: 'low',
    completenessPercent: 55,
    clinician: 'Dr R Ahmed',
    flags: ['eeg-not-to-exclude-epilepsy', 'missing-clinical-question']
  },
  {
    id: 'E008',
    referralDate: '2026-05-08',
    patient: 'Kowalski, Zofia',
    nhs: '408 901 2345',
    eegType: 'sleep-deprived',
    indication: 'seizure-classification',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'routine',
    priorityBand: 'low',
    completenessPercent: 90,
    clinician: 'Dr K Mensah',
    flags: []
  },
  {
    id: 'E009',
    referralDate: '2026-05-08',
    patient: 'Müller, Hannah',
    nhs: '409 012 3456',
    eegType: 'video-telemetry',
    indication: 'dementia',
    appropriatenessBand: 'usually-not-appropriate',
    triageTier: 'routine',
    priorityBand: 'low',
    completenessPercent: 70,
    clinician: 'Dr L Romano',
    flags: ['missing-clinical-question']
  },
  {
    id: 'E010',
    referralDate: '2026-05-09',
    patient: 'Tanaka, Yuki',
    nhs: '410 123 4567',
    eegType: 'routine-awake',
    indication: 'encephalopathy',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'emergency',
    priorityBand: 'high',
    completenessPercent: 100,
    clinician: 'Dr M Adebayo',
    flags: ['suspected-status-epilepticus', 'encephalopathy']
  }
];

window.ElectroencephalogramTestRequestDashboard.sampleRequests = sampleRequests;
})();
