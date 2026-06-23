// Sample request data for the colonoscopy vetting dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Ten realistic rows spanning every triage tier (routine / urgent /
// two-week-wait / emergency), every appropriateness band, and every
// pre-procedure risk band. NHS numbers are placeholder values in the canonical
// "NNN NNN NNNN" display form. Includes the four required worked cases: a
// routine polyp-surveillance request, a two-week-wait positive-FIT case, a
// high-bleeding-risk anticoagulant case, and an unfit-for-prep case.

(function () {
'use strict';
window.ColonoscopyTestRequestDashboard =
  window.ColonoscopyTestRequestDashboard || {};

/** @type {import('./types.js').RequestRow[]} */
const sampleRequests = [
  {
    id: 'C001',
    referralDate: '2026-05-04',
    patient: 'Okafor, Amara',
    nhs: '401 234 5678',
    procedure: 'colonoscopy',
    indication: 'polyp-surveillance',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'routine',
    twoWeekWaitEligible: false,
    riskBand: 'low',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'C002',
    referralDate: '2026-05-05',
    patient: 'Bianchi, Sofia',
    nhs: '402 345 6789',
    procedure: 'colonoscopy',
    indication: 'positive-fit',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'two-week-wait',
    twoWeekWaitEligible: true,
    riskBand: 'low',
    completenessPercent: 95,
    clinician: 'Dr K Mensah',
    flags: ['suspected-cancer-2ww']
  },
  {
    id: 'C003',
    referralDate: '2026-05-05',
    patient: 'Novak, Petra',
    nhs: '403 456 7890',
    procedure: 'colonoscopy',
    indication: 'change-in-bowel-habit',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'urgent',
    twoWeekWaitEligible: false,
    riskBand: 'high',
    completenessPercent: 85,
    clinician: 'Dr L Romano',
    flags: ['high-bleeding-risk-anticoag']
  },
  {
    id: 'C004',
    referralDate: '2026-05-06',
    patient: 'Hassan, Layla',
    nhs: '404 567 8901',
    procedure: 'ct-colonography',
    indication: 'iron-deficiency-anaemia',
    appropriatenessBand: 'may-be-appropriate',
    triageTier: 'routine',
    twoWeekWaitEligible: false,
    riskBand: 'high',
    completenessPercent: 80,
    clinician: 'Dr M Adebayo',
    flags: ['unfit-for-prep']
  },
  {
    id: 'C005',
    referralDate: '2026-05-06',
    patient: 'Connolly, Niamh',
    nhs: '405 678 9012',
    procedure: 'colonoscopy',
    indication: 'crc-screening',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'routine',
    twoWeekWaitEligible: false,
    riskBand: 'low',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'C006',
    referralDate: '2026-05-07',
    patient: 'Silva, Beatriz',
    nhs: '406 789 0123',
    procedure: 'colonoscopy',
    indication: 'abdominal-mass',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'two-week-wait',
    twoWeekWaitEligible: true,
    riskBand: 'moderate',
    completenessPercent: 90,
    clinician: 'Dr P Sharma',
    flags: ['suspected-cancer-2ww', 'asa-iv']
  },
  {
    id: 'C007',
    referralDate: '2026-05-07',
    patient: 'Andersson, Elin',
    nhs: '407 890 1234',
    procedure: 'flexible-sigmoidoscopy',
    indication: 'rectal-bleeding',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'routine',
    twoWeekWaitEligible: false,
    riskBand: 'low',
    completenessPercent: 60,
    clinician: 'Dr R Ahmed',
    flags: ['missing-fit', 'missing-clinical-question']
  },
  {
    id: 'C008',
    referralDate: '2026-05-08',
    patient: 'Kowalski, Zofia',
    nhs: '408 901 2345',
    procedure: 'colonoscopy',
    indication: 'ibd-surveillance',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'routine',
    twoWeekWaitEligible: false,
    riskBand: 'moderate',
    completenessPercent: 85,
    clinician: 'Dr K Mensah',
    flags: []
  },
  {
    id: 'C009',
    referralDate: '2026-05-08',
    patient: 'Müller, Hannah',
    nhs: '409 012 3456',
    procedure: 'flexible-sigmoidoscopy',
    indication: 'ibd-diagnosis',
    appropriatenessBand: 'may-be-appropriate',
    triageTier: 'routine',
    twoWeekWaitEligible: false,
    riskBand: 'low',
    completenessPercent: 70,
    clinician: 'Dr L Romano',
    flags: ['missing-indication']
  },
  {
    id: 'C010',
    referralDate: '2026-05-09',
    patient: 'Tanaka, Yuki',
    nhs: '410 123 4567',
    procedure: 'colonoscopy',
    indication: 'rectal-bleeding',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'emergency',
    twoWeekWaitEligible: true,
    riskBand: 'high',
    completenessPercent: 95,
    clinician: 'Dr M Adebayo',
    flags: ['suspected-cancer-2ww', 'high-bleeding-risk-anticoag']
  }
];

window.ColonoscopyTestRequestDashboard.sampleRequests = sampleRequests;
})();
