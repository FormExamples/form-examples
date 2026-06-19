// Sample request data for the obstetric ultrasound vetting dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Ten realistic rows spanning every triage tier (routine / soon / urgent /
// emergency), every appropriateness band, and every gestational-age window
// fit. NHS numbers are placeholder values in the canonical "NNN NNN NNNN"
// display form. Includes the three required worked cases: a routine dating
// request, an urgent reduced-fetal-movements case, and an outside-window NT
// request.

(function () {
'use strict';
window.PregnancyUltrasoundTestRequestDashboard =
  window.PregnancyUltrasoundTestRequestDashboard || {};

/** @type {import('./types.js').RequestRow[]} */
const sampleRequests = [
  {
    id: 'U001',
    referralDate: '2026-05-04',
    patient: 'Okafor, Amara',
    nhs: '401 234 5678',
    scanType: 'dating',
    indication: 'dating',
    gestationalAge: '12+3',
    appropriatenessBand: 'usually-appropriate',
    windowFit: 'appropriate',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'U002',
    referralDate: '2026-05-05',
    patient: 'Bianchi, Sofia',
    nhs: '402 345 6789',
    scanType: 'growth',
    indication: 'reduced-fetal-movements',
    gestationalAge: '31+5',
    appropriatenessBand: 'usually-appropriate',
    windowFit: 'appropriate',
    triageTier: 'urgent',
    completenessPercent: 90,
    clinician: 'Dr K Mensah',
    flags: ['reduced-fetal-movements']
  },
  {
    id: 'U003',
    referralDate: '2026-05-05',
    patient: 'Novak, Petra',
    nhs: '403 456 7890',
    scanType: 'nuchal-translucency',
    indication: 'aneuploidy-screening',
    gestationalAge: '16+2',
    appropriatenessBand: 'usually-appropriate',
    windowFit: 'outside-window',
    triageTier: 'routine',
    completenessPercent: 80,
    clinician: 'Dr L Romano',
    flags: ['window-mismatch']
  },
  {
    id: 'U004',
    referralDate: '2026-05-06',
    patient: 'Hassan, Layla',
    nhs: '404 567 8901',
    scanType: 'viability',
    indication: 'exclude-ectopic',
    gestationalAge: '7+0',
    appropriatenessBand: 'usually-appropriate',
    windowFit: 'appropriate',
    triageTier: 'emergency',
    completenessPercent: 100,
    clinician: 'Dr M Adebayo',
    flags: ['suspected-ectopic']
  },
  {
    id: 'U005',
    referralDate: '2026-05-06',
    patient: 'Connolly, Niamh',
    nhs: '405 678 9012',
    scanType: 'anomaly',
    indication: 'anomaly-screening',
    gestationalAge: '20+1',
    appropriatenessBand: 'usually-appropriate',
    windowFit: 'appropriate',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'U006',
    referralDate: '2026-05-07',
    patient: 'Silva, Beatriz',
    nhs: '406 789 0123',
    scanType: 'placental-location',
    indication: 'antepartum-haemorrhage',
    gestationalAge: '33+4',
    appropriatenessBand: 'usually-appropriate',
    windowFit: 'appropriate',
    triageTier: 'urgent',
    completenessPercent: 90,
    clinician: 'Dr P Sharma',
    flags: ['heavy-bleeding', 'suspected-praevia']
  },
  {
    id: 'U007',
    referralDate: '2026-05-07',
    patient: 'Andersson, Elin',
    nhs: '407 890 1234',
    scanType: 'reassurance',
    indication: 'follow-up',
    gestationalAge: '9+6',
    appropriatenessBand: 'may-be-appropriate',
    windowFit: 'appropriate',
    triageTier: 'soon',
    completenessPercent: 60,
    clinician: 'Dr R Ahmed',
    flags: ['missing-clinical-question']
  },
  {
    id: 'U008',
    referralDate: '2026-05-08',
    patient: 'Kowalski, Zofia',
    nhs: '408 901 2345',
    scanType: 'doppler',
    indication: 'growth-restriction',
    gestationalAge: '28+0',
    appropriatenessBand: 'usually-appropriate',
    windowFit: 'appropriate',
    triageTier: 'soon',
    completenessPercent: 85,
    clinician: 'Dr K Mensah',
    flags: ['suspected-severe-fgr']
  },
  {
    id: 'U009',
    referralDate: '2026-05-08',
    patient: 'Müller, Hannah',
    nhs: '409 012 3456',
    scanType: 'anomaly',
    indication: 'dating',
    gestationalAge: '13+0',
    appropriatenessBand: 'usually-not-appropriate',
    windowFit: 'outside-window',
    triageTier: 'routine',
    completenessPercent: 70,
    clinician: 'Dr L Romano',
    flags: ['window-mismatch']
  },
  {
    id: 'U010',
    referralDate: '2026-05-09',
    patient: 'Tanaka, Yuki',
    nhs: '410 123 4567',
    scanType: 'viability',
    indication: 'bleeding',
    gestationalAge: '8+4',
    appropriatenessBand: 'usually-appropriate',
    windowFit: 'appropriate',
    triageTier: 'urgent',
    completenessPercent: 95,
    clinician: 'Dr M Adebayo',
    flags: ['heavy-bleeding']
  }
];

window.PregnancyUltrasoundTestRequestDashboard.sampleRequests = sampleRequests;
})();
