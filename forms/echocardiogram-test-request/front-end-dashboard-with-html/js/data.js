// Sample request data for the echocardiogram vetting dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Ten realistic rows spanning every urgency triage tier (routine / urgent /
// emergency), every appropriateness band, and every clinical-priority band.
// NHS numbers are placeholder values in the canonical "NNN NNN NNNN" display
// form. Includes the required worked cases: a routine TTE, an urgent
// suspected-endocarditis case, a raised-BNP heart-failure case, and a
// rarely-appropriate case.

(function () {
'use strict';
window.EchocardiogramTestRequestDashboard =
  window.EchocardiogramTestRequestDashboard || {};

/** @type {import('./types.js').RequestRow[]} */
const sampleRequests = [
  {
    id: 'E001',
    referralDate: '2026-05-04',
    patient: 'Okafor, Amara',
    nhs: '401 234 5678',
    echoType: 'transthoracic-tte',
    indication: 'murmur',
    appropriatenessBand: 'appropriate',
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
    echoType: 'transoesophageal-toe',
    indication: 'endocarditis',
    appropriatenessBand: 'appropriate',
    triageTier: 'emergency',
    priorityBand: 'high',
    completenessPercent: 95,
    clinician: 'Dr K Mensah',
    flags: ['suspected-endocarditis']
  },
  {
    id: 'E003',
    referralDate: '2026-05-05',
    patient: 'Novak, Petra',
    nhs: '403 456 7890',
    echoType: 'transthoracic-tte',
    indication: 'heart-failure',
    appropriatenessBand: 'appropriate',
    triageTier: 'urgent',
    priorityBand: 'high',
    completenessPercent: 90,
    clinician: 'Dr L Romano',
    flags: ['raised-bnp']
  },
  {
    id: 'E004',
    referralDate: '2026-05-06',
    patient: 'Hassan, Layla',
    nhs: '404 567 8901',
    echoType: 'transthoracic-tte',
    indication: 'suspected-valve-disease',
    appropriatenessBand: 'appropriate',
    triageTier: 'urgent',
    priorityBand: 'high',
    completenessPercent: 100,
    clinician: 'Dr M Adebayo',
    flags: ['severe-symptomatic-valve']
  },
  {
    id: 'E005',
    referralDate: '2026-05-06',
    patient: 'Connolly, Niamh',
    nhs: '405 678 9012',
    echoType: 'stress-echo',
    indication: 'chest-pain',
    appropriatenessBand: 'appropriate',
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
    echoType: 'transthoracic-tte',
    indication: 'breathlessness',
    appropriatenessBand: 'appropriate',
    triageTier: 'emergency',
    priorityBand: 'high',
    completenessPercent: 90,
    clinician: 'Dr P Sharma',
    flags: ['acute-heart-failure']
  },
  {
    id: 'E007',
    referralDate: '2026-05-07',
    patient: 'Andersson, Elin',
    nhs: '407 890 1234',
    echoType: 'transthoracic-tte',
    indication: 'surveillance-known-disease',
    appropriatenessBand: 'may-be-appropriate',
    triageTier: 'routine',
    priorityBand: 'low',
    completenessPercent: 60,
    clinician: 'Dr R Ahmed',
    flags: ['missing-clinical-question']
  },
  {
    id: 'E008',
    referralDate: '2026-05-08',
    patient: 'Kowalski, Zofia',
    nhs: '408 901 2345',
    echoType: 'transthoracic-tte',
    indication: 'pre-chemotherapy',
    appropriatenessBand: 'appropriate',
    triageTier: 'routine',
    priorityBand: 'low',
    completenessPercent: 85,
    clinician: 'Dr K Mensah',
    flags: ['duplicate-recent-echo']
  },
  {
    id: 'E009',
    referralDate: '2026-05-08',
    patient: 'Müller, Hannah',
    nhs: '409 012 3456',
    echoType: 'stress-echo',
    indication: 'palpitations',
    appropriatenessBand: 'rarely-appropriate',
    triageTier: 'routine',
    priorityBand: 'low',
    completenessPercent: 70,
    clinician: 'Dr L Romano',
    flags: ['rarely-appropriate-indication']
  },
  {
    id: 'E010',
    referralDate: '2026-05-09',
    patient: 'Tanaka, Yuki',
    nhs: '410 123 4567',
    echoType: 'transoesophageal-toe',
    indication: 'stroke-tia-source',
    appropriatenessBand: 'appropriate',
    triageTier: 'urgent',
    priorityBand: 'moderate',
    completenessPercent: 95,
    clinician: 'Dr M Adebayo',
    flags: []
  }
];

window.EchocardiogramTestRequestDashboard.sampleRequests = sampleRequests;
})();
