// Sample request data for the vascular angiography vetting dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Ten realistic rows spanning every triage tier (routine / urgent /
// emergency), every appropriateness band, and every contrast / radiation
// safety band. NHS numbers are placeholder values in the canonical
// "NNN NNN NNNN" display form. Includes the required worked cases: a routine
// peripheral-arterial-disease request, a contrast-allergy case, a
// renal-impairment case, and an emergency GI-bleeding case.

(function () {
'use strict';
window.AngiographyTestRequestDashboard =
  window.AngiographyTestRequestDashboard || {};

/** @type {import('./types.js').RequestRow[]} */
const sampleRequests = [
  {
    id: 'A001',
    referralDate: '2026-05-04',
    patient: 'Okafor, Amara',
    nhs: '401 234 5678',
    angiographyType: 'ct-angiography',
    bodyRegion: 'peripheral-lower-limb',
    indication: 'peripheral-arterial-disease',
    appropriatenessBand: 'usually-appropriate',
    safetyBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'A002',
    referralDate: '2026-05-05',
    patient: 'Bianchi, Sofia',
    nhs: '402 345 6789',
    angiographyType: 'ct-angiography',
    bodyRegion: 'aorta',
    indication: 'aneurysm',
    appropriatenessBand: 'usually-appropriate',
    safetyBand: 'contraindicated',
    triageTier: 'urgent',
    completenessPercent: 95,
    clinician: 'Dr K Mensah',
    flags: ['contrast-allergy']
  },
  {
    id: 'A003',
    referralDate: '2026-05-05',
    patient: 'Novak, Petra',
    nhs: '403 456 7890',
    angiographyType: 'ct-angiography',
    bodyRegion: 'renal',
    indication: 'stenosis',
    appropriatenessBand: 'usually-appropriate',
    safetyBand: 'contraindicated',
    triageTier: 'routine',
    completenessPercent: 90,
    clinician: 'Dr L Romano',
    flags: ['renal-impairment', 'metformin-contrast']
  },
  {
    id: 'A004',
    referralDate: '2026-05-06',
    patient: 'Hassan, Layla',
    nhs: '404 567 8901',
    angiographyType: 'catheter-dsa',
    bodyRegion: 'mesenteric',
    indication: 'gi-bleeding',
    appropriatenessBand: 'usually-appropriate',
    safetyBand: 'caution',
    triageTier: 'emergency',
    completenessPercent: 100,
    clinician: 'Dr M Adebayo',
    flags: ['high-bleeding-risk-anticoag']
  },
  {
    id: 'A005',
    referralDate: '2026-05-06',
    patient: 'Connolly, Niamh',
    nhs: '405 678 9012',
    angiographyType: 'ct-angiography',
    bodyRegion: 'pulmonary',
    indication: 'suspected-pulmonary-embolism',
    appropriatenessBand: 'usually-appropriate',
    safetyBand: 'ok',
    triageTier: 'emergency',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'A006',
    referralDate: '2026-05-07',
    patient: 'Silva, Beatriz',
    nhs: '406 789 0123',
    angiographyType: 'mr-angiography',
    bodyRegion: 'carotid',
    indication: 'stenosis',
    appropriatenessBand: 'usually-appropriate',
    safetyBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 85,
    clinician: 'Dr P Sharma',
    flags: []
  },
  {
    id: 'A007',
    referralDate: '2026-05-07',
    patient: 'Andersson, Elin',
    nhs: '407 890 1234',
    angiographyType: 'cerebral-angiography',
    bodyRegion: 'cerebral',
    indication: 'suspected-stroke',
    appropriatenessBand: 'may-be-appropriate',
    safetyBand: 'caution',
    triageTier: 'emergency',
    completenessPercent: 70,
    clinician: 'Dr R Ahmed',
    flags: ['pregnancy', 'missing-clinical-question']
  },
  {
    id: 'A008',
    referralDate: '2026-05-08',
    patient: 'Kowalski, Zofia',
    nhs: '408 901 2345',
    angiographyType: 'coronary-angiography',
    bodyRegion: 'coronary',
    indication: 'suspected-coronary-disease',
    appropriatenessBand: 'usually-appropriate',
    safetyBand: 'caution',
    triageTier: 'urgent',
    completenessPercent: 90,
    clinician: 'Dr K Mensah',
    flags: ['metformin-contrast']
  },
  {
    id: 'A009',
    referralDate: '2026-05-08',
    patient: 'Müller, Hannah',
    nhs: '409 012 3456',
    angiographyType: 'mr-angiography',
    bodyRegion: 'coronary',
    indication: 'gi-bleeding',
    appropriatenessBand: 'usually-not-appropriate',
    safetyBand: 'ok',
    triageTier: 'emergency',
    completenessPercent: 60,
    clinician: 'Dr L Romano',
    flags: ['missing-indication']
  },
  {
    id: 'A010',
    referralDate: '2026-05-09',
    patient: 'Tanaka, Yuki',
    nhs: '410 123 4567',
    angiographyType: 'peripheral-angiography',
    bodyRegion: 'peripheral-lower-limb',
    indication: 'pre-intervention-planning',
    appropriatenessBand: 'usually-appropriate',
    safetyBand: 'caution',
    triageTier: 'urgent',
    completenessPercent: 95,
    clinician: 'Dr M Adebayo',
    flags: ['high-bleeding-risk-anticoag']
  }
];

window.AngiographyTestRequestDashboard.sampleRequests = sampleRequests;
})();
