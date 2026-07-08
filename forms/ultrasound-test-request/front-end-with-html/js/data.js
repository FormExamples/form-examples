// Sample request data for the general (non-obstetric) ultrasound vetting
// dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Ten realistic rows spanning every triage tier (routine / urgent /
// emergency), every appropriateness band, and every suitability band. NHS
// numbers are placeholder values in the canonical "NNN NNN NNNN" display
// form. Includes the required worked cases: a routine abdominal scan, a
// suspected-DVT urgent case, a suspected-testicular-torsion emergency case,
// and a prep-not-met case.

(function () {
'use strict';
window.UltrasoundTestRequestDashboard =
  window.UltrasoundTestRequestDashboard || {};

/** @type {import('./types.js').RequestRow[]} */
const sampleRequests = [
  {
    id: 'U001',
    referralDate: '2026-05-04',
    patient: 'Okafor, Amara',
    nhs: '401 234 5678',
    bodyRegion: 'abdomen',
    indication: 'abdominal-pain',
    appropriatenessBand: 'usually-appropriate',
    suitabilityBand: 'ok',
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
    bodyRegion: 'dvt-leg',
    indication: 'suspected-dvt',
    appropriatenessBand: 'usually-appropriate',
    suitabilityBand: 'ok',
    triageTier: 'urgent',
    completenessPercent: 95,
    clinician: 'Dr K Mensah',
    flags: ['suspected-dvt-urgent']
  },
  {
    id: 'U003',
    referralDate: '2026-05-05',
    patient: 'Novak, Petr',
    nhs: '403 456 7890',
    bodyRegion: 'scrotum-testes',
    indication: 'testicular-pain',
    appropriatenessBand: 'usually-appropriate',
    suitabilityBand: 'ok',
    triageTier: 'emergency',
    completenessPercent: 100,
    clinician: 'Dr L Romano',
    flags: ['suspected-testicular-torsion']
  },
  {
    id: 'U004',
    referralDate: '2026-05-06',
    patient: 'Hassan, Karim',
    nhs: '404 567 8901',
    bodyRegion: 'abdomen',
    indication: 'suspected-aaa',
    appropriatenessBand: 'usually-appropriate',
    suitabilityBand: 'caution',
    triageTier: 'emergency',
    completenessPercent: 90,
    clinician: 'Dr M Adebayo',
    flags: ['suspected-aaa', 'prep-not-met']
  },
  {
    id: 'U005',
    referralDate: '2026-05-06',
    patient: 'Connolly, Niamh',
    nhs: '405 678 9012',
    bodyRegion: 'liver-biliary',
    indication: 'suspected-gallstones',
    appropriatenessBand: 'usually-appropriate',
    suitabilityBand: 'caution',
    triageTier: 'routine',
    completenessPercent: 85,
    clinician: 'Dr H Iqbal',
    flags: ['prep-not-met']
  },
  {
    id: 'U006',
    referralDate: '2026-05-07',
    patient: 'Silva, Beatriz',
    nhs: '406 789 0123',
    bodyRegion: 'renal-tract',
    indication: 'haematuria',
    appropriatenessBand: 'usually-appropriate',
    suitabilityBand: 'limited',
    triageTier: 'urgent',
    completenessPercent: 90,
    clinician: 'Dr P Sharma',
    flags: ['prep-not-met']
  },
  {
    id: 'U007',
    referralDate: '2026-05-07',
    patient: 'Andersson, Elin',
    nhs: '407 890 1234',
    bodyRegion: 'thyroid-neck',
    indication: 'thyroid-nodule',
    appropriatenessBand: 'usually-appropriate',
    suitabilityBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 60,
    clinician: 'Dr R Ahmed',
    flags: ['missing-clinical-question']
  },
  {
    id: 'U008',
    referralDate: '2026-05-08',
    patient: 'Kowalski, Zofia',
    nhs: '408 901 2345',
    bodyRegion: 'pelvis',
    indication: 'palpable-mass',
    appropriatenessBand: 'usually-appropriate',
    suitabilityBand: 'caution',
    triageTier: 'routine',
    completenessPercent: 80,
    clinician: 'Dr K Mensah',
    flags: ['prep-not-met']
  },
  {
    id: 'U009',
    referralDate: '2026-05-08',
    patient: 'Müller, Hannah',
    nhs: '409 012 3456',
    bodyRegion: 'scrotum-testes',
    indication: 'renal-impairment',
    appropriatenessBand: 'usually-not-appropriate',
    suitabilityBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 70,
    clinician: 'Dr L Romano',
    flags: ['missing-indication']
  },
  {
    id: 'U010',
    referralDate: '2026-05-09',
    patient: 'Tanaka, Haruki',
    nhs: '410 123 4567',
    bodyRegion: 'carotid',
    indication: 'follow-up',
    appropriatenessBand: 'may-be-appropriate',
    suitabilityBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 95,
    clinician: 'Dr M Adebayo',
    flags: []
  }
];

window.UltrasoundTestRequestDashboard.sampleRequests = sampleRequests;
})();
