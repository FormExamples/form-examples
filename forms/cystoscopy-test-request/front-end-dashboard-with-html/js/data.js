// Sample request data for the cystoscopy vetting dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Ten realistic rows spanning every triage tier (routine / urgent /
// two-week-wait / emergency), every appropriateness band, and every
// pre-procedure risk band. NHS numbers are placeholder values in the
// canonical "NNN NNN NNNN" display form. Includes the required worked cases:
// a routine surveillance request, a 2WW visible-haematuria case, an
// active-UTI defer case, and a high-bleeding-risk anticoagulant case.

(function () {
'use strict';
window.CystoscopyTestRequestDashboard =
  window.CystoscopyTestRequestDashboard || {};

/** @type {import('./types.js').RequestRow[]} */
const sampleRequests = [
  {
    id: 'C001',
    referralDate: '2026-05-04',
    patient: 'Okafor, Amara',
    nhs: '401 234 5678',
    procedure: 'flexible-cystoscopy',
    indication: 'bladder-cancer-surveillance',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'routine',
    twoWeekWaitEligible: false,
    riskBand: 'low',
    completenessPercent: 100,
    clinician: 'Mr H Iqbal',
    flags: []
  },
  {
    id: 'C002',
    referralDate: '2026-05-05',
    patient: 'Bianchi, Sofia',
    nhs: '402 345 6789',
    procedure: 'flexible-cystoscopy',
    indication: 'visible-haematuria',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'two-week-wait',
    twoWeekWaitEligible: true,
    riskBand: 'low',
    completenessPercent: 100,
    clinician: 'Dr K Mensah',
    flags: ['suspected-cancer-2ww', 'visible-haematuria']
  },
  {
    id: 'C003',
    referralDate: '2026-05-05',
    patient: 'Novak, Petra',
    nhs: '403 456 7890',
    procedure: 'flexible-cystoscopy',
    indication: 'recurrent-uti',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'routine',
    twoWeekWaitEligible: false,
    riskBand: 'high',
    completenessPercent: 85,
    clinician: 'Dr L Romano',
    flags: ['active-uti-defer']
  },
  {
    id: 'C004',
    referralDate: '2026-05-06',
    patient: 'Hassan, Layla',
    nhs: '404 567 8901',
    procedure: 'flexible-cystoscopy',
    indication: 'visible-haematuria',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'two-week-wait',
    twoWeekWaitEligible: true,
    riskBand: 'high',
    completenessPercent: 90,
    clinician: 'Mr M Adebayo',
    flags: ['suspected-cancer-2ww', 'visible-haematuria', 'high-bleeding-risk-anticoag']
  },
  {
    id: 'C005',
    referralDate: '2026-05-06',
    patient: 'Connolly, Niamh',
    nhs: '405 678 9012',
    procedure: 'flexible-cystoscopy',
    indication: 'lower-urinary-tract-symptoms',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'routine',
    twoWeekWaitEligible: false,
    riskBand: 'low',
    completenessPercent: 100,
    clinician: 'Mr H Iqbal',
    flags: []
  },
  {
    id: 'C006',
    referralDate: '2026-05-07',
    patient: 'Silva, Beatriz',
    nhs: '406 789 0123',
    procedure: 'flexible-cystoscopy',
    indication: 'suspected-bladder-tumour',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'two-week-wait',
    twoWeekWaitEligible: true,
    riskBand: 'moderate',
    completenessPercent: 95,
    clinician: 'Mr P Sharma',
    flags: ['suspected-cancer-2ww']
  },
  {
    id: 'C007',
    referralDate: '2026-05-07',
    patient: 'Andersson, Elin',
    nhs: '407 890 1234',
    procedure: 'flexible-cystoscopy',
    indication: 'non-visible-haematuria',
    appropriatenessBand: 'may-be-appropriate',
    triageTier: 'routine',
    twoWeekWaitEligible: false,
    riskBand: 'low',
    completenessPercent: 60,
    clinician: 'Dr R Ahmed',
    flags: ['missing-clinical-question']
  },
  {
    id: 'C008',
    referralDate: '2026-05-08',
    patient: 'Kowalski, Zofia',
    nhs: '408 901 2345',
    procedure: 'rigid-cystoscopy',
    indication: 'urethral-stricture',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'urgent',
    twoWeekWaitEligible: false,
    riskBand: 'low',
    completenessPercent: 85,
    clinician: 'Dr K Mensah',
    flags: []
  },
  {
    id: 'C009',
    referralDate: '2026-05-08',
    patient: 'Mueller, Hannah',
    nhs: '409 012 3456',
    procedure: 'rigid-cystoscopy',
    indication: 'lower-urinary-tract-symptoms',
    appropriatenessBand: 'may-be-appropriate',
    triageTier: 'routine',
    twoWeekWaitEligible: false,
    riskBand: 'moderate',
    completenessPercent: 70,
    clinician: 'Dr L Romano',
    flags: []
  },
  {
    id: 'C010',
    referralDate: '2026-05-09',
    patient: 'Tanaka, Yuki',
    nhs: '410 123 4567',
    procedure: 'rigid-cystoscopy',
    indication: 'visible-haematuria',
    appropriatenessBand: 'usually-not-appropriate',
    triageTier: 'emergency',
    twoWeekWaitEligible: false,
    riskBand: 'high',
    completenessPercent: 75,
    clinician: 'Mr M Adebayo',
    flags: ['visible-haematuria', 'high-bleeding-risk-anticoag']
  }
];

window.CystoscopyTestRequestDashboard.sampleRequests = sampleRequests;
})();
