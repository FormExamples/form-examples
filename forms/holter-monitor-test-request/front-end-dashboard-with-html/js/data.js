// Sample request data for the Holter monitor vetting dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Ten realistic rows spanning every triage tier (routine / urgent / emergency),
// every appropriateness band, and every clinical-priority band. NHS numbers are
// placeholder values in the canonical "NNN NNN NNNN" display form. Includes the
// required worked cases: a routine palpitations request, a syncope red-flag
// case, a post-stroke-AF-detection case, and a symptom-frequency / monitor
// mismatch case.

(function () {
'use strict';
window.HolterMonitorTestRequestDashboard =
  window.HolterMonitorTestRequestDashboard || {};

/** @type {import('./types.js').RequestRow[]} */
const sampleRequests = [
  {
    id: 'H001',
    referralDate: '2026-05-04',
    patient: 'Okafor, Amara',
    nhs: '401 234 5678',
    monitorType: '24-hour',
    indication: 'palpitations',
    symptomFrequency: 'daily',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'routine',
    priorityBand: 'low',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'H002',
    referralDate: '2026-05-05',
    patient: 'Bianchi, Sofia',
    nhs: '402 345 6789',
    monitorType: '7-day',
    indication: 'syncope',
    symptomFrequency: 'weekly',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'emergency',
    priorityBand: 'high',
    completenessPercent: 95,
    clinician: 'Dr K Mensah',
    flags: ['syncope-red-flag']
  },
  {
    id: 'H003',
    referralDate: '2026-05-05',
    patient: 'Novak, Petra',
    nhs: '403 456 7890',
    monitorType: '14-day',
    indication: 'post-stroke-af-screen',
    symptomFrequency: 'rare',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'urgent',
    priorityBand: 'moderate',
    completenessPercent: 90,
    clinician: 'Dr L Romano',
    flags: ['post-stroke-af-detection']
  },
  {
    id: 'H004',
    referralDate: '2026-05-06',
    patient: 'Hassan, Layla',
    nhs: '404 567 8901',
    monitorType: '24-hour',
    indication: 'atrial-fibrillation-detection',
    symptomFrequency: 'rare',
    appropriatenessBand: 'may-be-appropriate',
    triageTier: 'routine',
    priorityBand: 'low',
    completenessPercent: 85,
    clinician: 'Dr M Adebayo',
    flags: ['symptom-frequency-monitor-mismatch']
  },
  {
    id: 'H005',
    referralDate: '2026-05-06',
    patient: 'Connolly, Niamh',
    nhs: '405 678 9012',
    monitorType: '48-hour',
    indication: 'rate-control-assessment',
    symptomFrequency: 'daily',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'routine',
    priorityBand: 'moderate',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'H006',
    referralDate: '2026-05-07',
    patient: 'Silva, Beatriz',
    nhs: '406 789 0123',
    monitorType: 'implantable-loop-recorder',
    indication: 'syncope',
    symptomFrequency: 'rare',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'emergency',
    priorityBand: 'high',
    completenessPercent: 90,
    clinician: 'Dr P Sharma',
    flags: ['syncope-red-flag']
  },
  {
    id: 'H007',
    referralDate: '2026-05-07',
    patient: 'Andersson, Elin',
    nhs: '407 890 1234',
    monitorType: '24-hour',
    indication: 'suspected-arrhythmia',
    symptomFrequency: '',
    appropriatenessBand: 'may-be-appropriate',
    triageTier: 'routine',
    priorityBand: 'low',
    completenessPercent: 60,
    clinician: 'Dr R Ahmed',
    flags: ['missing-clinical-question']
  },
  {
    id: 'H008',
    referralDate: '2026-05-08',
    patient: 'Kowalski, Zofia',
    nhs: '408 901 2345',
    monitorType: '48-hour',
    indication: 'suspected-arrhythmia',
    symptomFrequency: 'daily',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'emergency',
    priorityBand: 'high',
    completenessPercent: 95,
    clinician: 'Dr K Mensah',
    flags: ['suspected-vt']
  },
  {
    id: 'H009',
    referralDate: '2026-05-08',
    patient: 'Müller, Hannah',
    nhs: '409 012 3456',
    monitorType: '24-hour',
    indication: 'qt-monitoring',
    symptomFrequency: 'monthly',
    appropriatenessBand: 'usually-not-appropriate',
    triageTier: 'routine',
    priorityBand: 'low',
    completenessPercent: 70,
    clinician: 'Dr L Romano',
    flags: ['symptom-frequency-monitor-mismatch']
  },
  {
    id: 'H010',
    referralDate: '2026-05-09',
    patient: 'Tanaka, Yuki',
    nhs: '410 123 4567',
    monitorType: '7-day',
    indication: 'palpitations',
    symptomFrequency: 'weekly',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'urgent',
    priorityBand: 'moderate',
    completenessPercent: 100,
    clinician: 'Dr M Adebayo',
    flags: []
  }
];

window.HolterMonitorTestRequestDashboard.sampleRequests = sampleRequests;
})();
