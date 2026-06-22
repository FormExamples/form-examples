// Sample request data for the biopsy vetting dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Ten realistic rows spanning every triage tier (routine / urgent /
// two-week-wait / emergency), every appropriateness band, and every
// bleeding-risk band. NHS numbers are placeholder values in the canonical
// "NNN NNN NNNN" display form. Includes the required worked cases: a routine
// request, a two-week-wait suspected-cancer case, a high-bleeding-risk
// anticoagulant case, and a thrombocytopenia case.

(function () {
'use strict';
window.BiopsyTestRequestDashboard =
  window.BiopsyTestRequestDashboard || {};

/** @type {import('./types.js').RequestRow[]} */
const sampleRequests = [
  {
    id: 'B001',
    referralDate: '2026-05-04',
    patient: 'Okafor, Amara',
    nhs: '401 234 5678',
    biopsySite: 'skin',
    biopsyMethod: 'punch',
    indication: 'characterise-lesion',
    appropriatenessBand: 'usually-appropriate',
    bleedingRiskBand: 'low',
    triageTier: 'routine',
    twoWeekWaitEligible: false,
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'B002',
    referralDate: '2026-05-05',
    patient: 'Bianchi, Sofia',
    nhs: '402 345 6789',
    biopsySite: 'breast',
    biopsyMethod: 'core-needle',
    indication: 'suspected-malignancy',
    appropriatenessBand: 'usually-appropriate',
    bleedingRiskBand: 'low',
    triageTier: 'two-week-wait',
    twoWeekWaitEligible: true,
    completenessPercent: 95,
    clinician: 'Dr K Mensah',
    flags: ['suspected-cancer-2ww']
  },
  {
    id: 'B003',
    referralDate: '2026-05-05',
    patient: 'Novak, Petra',
    nhs: '403 456 7890',
    biopsySite: 'liver',
    biopsyMethod: 'image-guided',
    indication: 'characterise-lesion',
    appropriatenessBand: 'usually-appropriate',
    bleedingRiskBand: 'high',
    triageTier: 'routine',
    twoWeekWaitEligible: false,
    completenessPercent: 90,
    clinician: 'Dr L Romano',
    flags: ['high-bleeding-risk-anticoag']
  },
  {
    id: 'B004',
    referralDate: '2026-05-06',
    patient: 'Hassan, Layla',
    nhs: '404 567 8901',
    biopsySite: 'bone-marrow',
    biopsyMethod: 'aspiration',
    indication: 'suspected-malignancy',
    appropriatenessBand: 'usually-appropriate',
    bleedingRiskBand: 'high',
    triageTier: 'two-week-wait',
    twoWeekWaitEligible: true,
    completenessPercent: 100,
    clinician: 'Dr M Adebayo',
    flags: ['suspected-cancer-2ww', 'thrombocytopenia']
  },
  {
    id: 'B005',
    referralDate: '2026-05-06',
    patient: 'Connolly, Niamh',
    nhs: '405 678 9012',
    biopsySite: 'lymph-node',
    biopsyMethod: 'excision',
    indication: 'lymphadenopathy',
    appropriatenessBand: 'usually-appropriate',
    bleedingRiskBand: 'low',
    triageTier: 'urgent',
    twoWeekWaitEligible: false,
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'B006',
    referralDate: '2026-05-07',
    patient: 'Silva, Beatriz',
    nhs: '406 789 0123',
    biopsySite: 'kidney',
    biopsyMethod: 'core-needle',
    indication: 'transplant-monitoring',
    appropriatenessBand: 'usually-appropriate',
    bleedingRiskBand: 'moderate',
    triageTier: 'routine',
    twoWeekWaitEligible: false,
    completenessPercent: 90,
    clinician: 'Dr P Sharma',
    flags: ['immunosuppression']
  },
  {
    id: 'B007',
    referralDate: '2026-05-07',
    patient: 'Andersson, Elin',
    nhs: '407 890 1234',
    biopsySite: 'thyroid',
    biopsyMethod: 'fine-needle-aspiration',
    indication: 'characterise-lesion',
    appropriatenessBand: 'may-be-appropriate',
    bleedingRiskBand: 'low',
    triageTier: 'routine',
    twoWeekWaitEligible: false,
    completenessPercent: 60,
    clinician: 'Dr R Ahmed',
    flags: ['missing-clinical-question']
  },
  {
    id: 'B008',
    referralDate: '2026-05-08',
    patient: 'Kowalski, Zofia',
    nhs: '408 901 2345',
    biopsySite: 'prostate',
    biopsyMethod: 'core-needle',
    indication: 'suspected-malignancy',
    appropriatenessBand: 'usually-appropriate',
    bleedingRiskBand: 'moderate',
    triageTier: 'two-week-wait',
    twoWeekWaitEligible: true,
    completenessPercent: 85,
    clinician: 'Dr K Mensah',
    flags: ['suspected-cancer-2ww']
  },
  {
    id: 'B009',
    referralDate: '2026-05-08',
    patient: 'Müller, Hannah',
    nhs: '409 012 3456',
    biopsySite: 'kidney',
    biopsyMethod: 'punch',
    indication: 'suspected-malignancy',
    appropriatenessBand: 'usually-not-appropriate',
    bleedingRiskBand: 'low',
    triageTier: 'two-week-wait',
    twoWeekWaitEligible: true,
    completenessPercent: 70,
    clinician: 'Dr L Romano',
    flags: ['suspected-cancer-2ww']
  },
  {
    id: 'B010',
    referralDate: '2026-05-09',
    patient: 'Tanaka, Yuki',
    nhs: '410 123 4567',
    biopsySite: 'lung',
    biopsyMethod: 'image-guided',
    indication: 'suspected-infection',
    appropriatenessBand: 'usually-appropriate',
    bleedingRiskBand: 'high',
    triageTier: 'emergency',
    twoWeekWaitEligible: false,
    completenessPercent: 95,
    clinician: 'Dr M Adebayo',
    flags: ['coagulopathy', 'thrombocytopenia']
  }
];

window.BiopsyTestRequestDashboard.sampleRequests = sampleRequests;
})();
