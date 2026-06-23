// Sample request data for the cytology vetting dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Ten realistic rows spanning every triage tier (routine / urgent /
// two-week-wait), every appropriateness band, and every pre-analytical
// adequacy band. NHS numbers are placeholder values in the canonical
// "NNN NNN NNNN" display form. Includes the required worked cases: a routine
// cervical-screening request, a two-week-wait suspected-malignancy case, a
// previous-high-grade-cytology case, and a specimen-not-collected case.

(function () {
'use strict';
window.CytologyTestRequestDashboard =
  window.CytologyTestRequestDashboard || {};

/** @type {import('./types.js').RequestRow[]} */
const sampleRequests = [
  {
    id: 'C001',
    referralDate: '2026-05-04',
    patient: 'Okafor, Amara',
    nhs: '401 234 5678',
    specimenType: 'cervical-smear',
    indication: 'cervical-screening',
    appropriatenessBand: 'usually-appropriate',
    preanalyticalBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'C002',
    referralDate: '2026-05-05',
    patient: 'Bianchi, Sofia',
    nhs: '402 345 6789',
    specimenType: 'fluid-pleural-ascitic',
    indication: 'suspected-malignancy',
    appropriatenessBand: 'usually-appropriate',
    preanalyticalBand: 'ok',
    triageTier: 'two-week-wait',
    completenessPercent: 95,
    clinician: 'Dr K Mensah',
    flags: ['suspected-cancer-2ww']
  },
  {
    id: 'C003',
    referralDate: '2026-05-05',
    patient: 'Novak, Petra',
    nhs: '403 456 7890',
    specimenType: 'cervical-smear',
    indication: 'follow-up',
    appropriatenessBand: 'usually-appropriate',
    preanalyticalBand: 'caution',
    triageTier: 'two-week-wait',
    completenessPercent: 90,
    clinician: 'Dr L Romano',
    flags: ['previous-high-grade-cytology']
  },
  {
    id: 'C004',
    referralDate: '2026-05-06',
    patient: 'Hassan, Layla',
    nhs: '404 567 8901',
    specimenType: 'urine-cytology',
    indication: 'haematuria',
    appropriatenessBand: 'usually-appropriate',
    preanalyticalBand: 'ok',
    triageTier: 'urgent',
    completenessPercent: 100,
    clinician: 'Dr M Adebayo',
    flags: []
  },
  {
    id: 'C005',
    referralDate: '2026-05-06',
    patient: 'Connolly, Niamh',
    nhs: '405 678 9012',
    specimenType: 'fine-needle-aspiration-thyroid',
    indication: 'thyroid-nodule',
    appropriatenessBand: 'usually-appropriate',
    preanalyticalBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'C006',
    referralDate: '2026-05-07',
    patient: 'Silva, Beatriz',
    nhs: '406 789 0123',
    specimenType: 'fine-needle-aspiration-breast',
    indication: 'breast-lump',
    appropriatenessBand: 'usually-appropriate',
    preanalyticalBand: 'caution',
    triageTier: 'two-week-wait',
    completenessPercent: 85,
    clinician: 'Dr P Sharma',
    flags: ['suspected-cancer-2ww']
  },
  {
    id: 'C007',
    referralDate: '2026-05-07',
    patient: 'Andersson, Elin',
    nhs: '407 890 1234',
    specimenType: 'sputum-cytology',
    indication: 'suspected-malignancy',
    appropriatenessBand: 'usually-appropriate',
    preanalyticalBand: 'reject-risk',
    triageTier: 'two-week-wait',
    completenessPercent: 70,
    clinician: 'Dr R Ahmed',
    flags: ['suspected-cancer-2ww', 'specimen-not-collected']
  },
  {
    id: 'C008',
    referralDate: '2026-05-08',
    patient: 'Kowalski, Zofia',
    nhs: '408 901 2345',
    specimenType: 'csf-cytology',
    indication: 'effusion-investigation',
    appropriatenessBand: 'may-be-appropriate',
    preanalyticalBand: 'caution',
    triageTier: 'routine',
    completenessPercent: 60,
    clinician: 'Dr K Mensah',
    flags: ['missing-clinical-details']
  },
  {
    id: 'C009',
    referralDate: '2026-05-08',
    patient: 'Müller, Hannah',
    nhs: '409 012 3456',
    specimenType: 'urine-cytology',
    indication: 'thyroid-nodule',
    appropriatenessBand: 'usually-not-appropriate',
    preanalyticalBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 75,
    clinician: 'Dr L Romano',
    flags: []
  },
  {
    id: 'C010',
    referralDate: '2026-05-09',
    patient: 'Tanaka, Yuki',
    nhs: '410 123 4567',
    specimenType: 'cervical-smear',
    indication: 'cervical-screening',
    appropriatenessBand: 'usually-appropriate',
    preanalyticalBand: 'reject-risk',
    triageTier: 'routine',
    completenessPercent: 80,
    clinician: 'Dr M Adebayo',
    flags: ['specimen-not-collected']
  }
];

window.CytologyTestRequestDashboard.sampleRequests = sampleRequests;
})();
