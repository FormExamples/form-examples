// Sample request data for the histopathology vetting dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Ten realistic rows spanning every urgency tier (routine / urgent /
// two-week-wait), every appropriateness band, and every specimen-quality band.
// NHS numbers are placeholder values in the canonical "NNN NNN NNNN" display
// form. Includes the four required worked cases: a routine inflammatory case,
// a two-week-wait suspected-cancer case, an urgent frozen-section case, and a
// specimen-fixation-issue case.

(function () {
'use strict';
window.HistopathologyTestRequestDashboard =
  window.HistopathologyTestRequestDashboard || {};

/** @type {import('./types.js').RequestRow[]} */
const sampleRequests = [
  {
    id: 'H001',
    referralDate: '2026-05-04',
    patient: 'Okafor, Amara',
    nhs: '401 234 5678',
    specimenType: 'endoscopic-biopsy',
    indication: 'inflammatory-disease',
    appropriatenessBand: 'usually-appropriate',
    specimenQualityBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'H002',
    referralDate: '2026-05-05',
    patient: 'Bianchi, Sofia',
    nhs: '402 345 6789',
    specimenType: 'biopsy',
    indication: 'suspected-malignancy',
    appropriatenessBand: 'usually-appropriate',
    specimenQualityBand: 'ok',
    triageTier: 'two-week-wait',
    completenessPercent: 95,
    clinician: 'Dr K Mensah',
    flags: ['suspected-cancer-2ww']
  },
  {
    id: 'H003',
    referralDate: '2026-05-05',
    patient: 'Novak, Petra',
    nhs: '403 456 7890',
    specimenType: 'frozen-section',
    indication: 'margin-assessment',
    appropriatenessBand: 'may-be-appropriate',
    specimenQualityBand: 'ok',
    triageTier: 'two-week-wait',
    completenessPercent: 90,
    clinician: 'Dr L Romano',
    flags: ['frozen-section-urgent']
  },
  {
    id: 'H004',
    referralDate: '2026-05-06',
    patient: 'Hassan, Layla',
    nhs: '404 567 8901',
    specimenType: 'excision',
    indication: 'characterise-lesion',
    appropriatenessBand: 'usually-appropriate',
    specimenQualityBand: 'reject-risk',
    triageTier: 'routine',
    completenessPercent: 80,
    clinician: 'Dr M Adebayo',
    flags: ['specimen-fixation-issue']
  },
  {
    id: 'H005',
    referralDate: '2026-05-06',
    patient: 'Connolly, Niamh',
    nhs: '405 678 9012',
    specimenType: 'resection',
    indication: 'cancer-staging',
    appropriatenessBand: 'usually-appropriate',
    specimenQualityBand: 'ok',
    triageTier: 'urgent',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'H006',
    referralDate: '2026-05-07',
    patient: 'Silva, Beatriz',
    nhs: '406 789 0123',
    specimenType: 'skin-lesion',
    indication: 'suspected-malignancy',
    appropriatenessBand: 'usually-appropriate',
    specimenQualityBand: 'caution',
    triageTier: 'two-week-wait',
    completenessPercent: 85,
    clinician: 'Dr P Sharma',
    flags: ['suspected-cancer-2ww', 'mislabel-risk']
  },
  {
    id: 'H007',
    referralDate: '2026-05-07',
    patient: 'Andersson, Elin',
    nhs: '407 890 1234',
    specimenType: 'biopsy',
    indication: 'other',
    appropriatenessBand: 'may-be-appropriate',
    specimenQualityBand: 'caution',
    triageTier: 'routine',
    completenessPercent: 55,
    clinician: 'Dr R Ahmed',
    flags: ['missing-clinical-details']
  },
  {
    id: 'H008',
    referralDate: '2026-05-08',
    patient: 'Kowalski, Zofia',
    nhs: '408 901 2345',
    specimenType: 'biopsy',
    indication: 'transplant-monitoring',
    appropriatenessBand: 'usually-appropriate',
    specimenQualityBand: 'ok',
    triageTier: 'urgent',
    completenessPercent: 90,
    clinician: 'Dr K Mensah',
    flags: []
  },
  {
    id: 'H009',
    referralDate: '2026-05-08',
    patient: 'Müller, Hannah',
    nhs: '409 012 3456',
    specimenType: 'resection',
    indication: 'inflammatory-disease',
    appropriatenessBand: 'usually-not-appropriate',
    specimenQualityBand: 'caution',
    triageTier: 'routine',
    completenessPercent: 70,
    clinician: 'Dr L Romano',
    flags: ['missing-indication']
  },
  {
    id: 'H010',
    referralDate: '2026-05-09',
    patient: 'Tanaka, Yuki',
    nhs: '410 123 4567',
    specimenType: 'endoscopic-biopsy',
    indication: 'infection',
    appropriatenessBand: 'usually-appropriate',
    specimenQualityBand: 'reject-risk',
    triageTier: 'routine',
    completenessPercent: 75,
    clinician: 'Dr M Adebayo',
    flags: ['specimen-fixation-issue', 'mislabel-risk']
  }
];

window.HistopathologyTestRequestDashboard.sampleRequests = sampleRequests;
})();
