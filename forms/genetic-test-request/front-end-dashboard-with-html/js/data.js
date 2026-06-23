// Sample request data for the genetic test request vetting dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Ten realistic rows spanning every triage tier (routine / urgent), every
// appropriateness band, and every consent & counselling band. NHS numbers are
// placeholder values in the canonical "NNN NNN NNNN" display form. Includes
// the required worked cases: a routine diagnostic request, a
// predictive-test-counselling-required case, a consent-not-obtained case, and
// a prenatal-time-critical case.

(function () {
'use strict';
window.GeneticTestRequestDashboard =
  window.GeneticTestRequestDashboard || {};

/** @type {import('./types.js').RequestRow[]} */
const sampleRequests = [
  {
    id: 'G001',
    referralDate: '2026-05-04',
    patient: 'Okafor, Amara',
    nhs: '401 234 5678',
    testType: 'gene-panel',
    indication: 'familial-cancer',
    appropriatenessBand: 'usually-appropriate',
    consentBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'G002',
    referralDate: '2026-05-05',
    patient: 'Bianchi, Sofia',
    nhs: '402 345 6789',
    testType: 'predictive-presymptomatic',
    indication: 'predictive-family-history',
    appropriatenessBand: 'usually-appropriate',
    consentBand: 'not-met',
    triageTier: 'routine',
    completenessPercent: 80,
    clinician: 'Dr K Mensah',
    flags: ['predictive-test-counselling-required']
  },
  {
    id: 'G003',
    referralDate: '2026-05-05',
    patient: 'Novak, Petra',
    nhs: '403 456 7890',
    testType: 'prenatal',
    indication: 'prenatal-diagnosis',
    appropriatenessBand: 'usually-appropriate',
    consentBand: 'ok',
    triageTier: 'urgent',
    completenessPercent: 90,
    clinician: 'Dr L Romano',
    flags: ['prenatal-time-critical']
  },
  {
    id: 'G004',
    referralDate: '2026-05-06',
    patient: 'Hassan, Layla',
    nhs: '404 567 8901',
    testType: 'whole-genome',
    indication: 'developmental-delay',
    appropriatenessBand: 'usually-appropriate',
    consentBand: 'caution',
    triageTier: 'routine',
    completenessPercent: 70,
    clinician: 'Dr M Adebayo',
    flags: ['consent-not-obtained']
  },
  {
    id: 'G005',
    referralDate: '2026-05-06',
    patient: 'Connolly, Niamh',
    nhs: '405 678 9012',
    testType: 'chromosomal-microarray',
    indication: 'congenital-anomaly',
    appropriatenessBand: 'usually-appropriate',
    consentBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'G006',
    referralDate: '2026-05-07',
    patient: 'Silva, Beatriz',
    nhs: '406 789 0123',
    testType: 'gene-panel',
    indication: 'cardiomyopathy-arrhythmia',
    appropriatenessBand: 'usually-appropriate',
    consentBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 85,
    clinician: 'Dr P Sharma',
    flags: ['missing-family-history']
  },
  {
    id: 'G007',
    referralDate: '2026-05-07',
    patient: 'Andersson, Elin',
    nhs: '407 890 1234',
    testType: 'whole-exome',
    indication: 'pharmacogenomics',
    appropriatenessBand: 'usually-not-appropriate',
    consentBand: 'caution',
    triageTier: 'routine',
    completenessPercent: 55,
    clinician: 'Dr R Ahmed',
    flags: ['missing-clinical-details', 'consent-not-obtained']
  },
  {
    id: 'G008',
    referralDate: '2026-05-08',
    patient: 'Kowalski, Zofia',
    nhs: '408 901 2345',
    testType: 'carrier-testing',
    indication: 'carrier-screening',
    appropriatenessBand: 'usually-appropriate',
    consentBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 95,
    clinician: 'Dr K Mensah',
    flags: []
  },
  {
    id: 'G009',
    referralDate: '2026-05-08',
    patient: 'Müller, Hannah',
    nhs: '409 012 3456',
    testType: 'karyotype',
    indication: 'familial-cancer',
    appropriatenessBand: 'usually-not-appropriate',
    consentBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 60,
    clinician: 'Dr L Romano',
    flags: ['missing-indication']
  },
  {
    id: 'G010',
    referralDate: '2026-05-09',
    patient: 'Tanaka, Yuki',
    nhs: '410 123 4567',
    testType: 'prenatal',
    indication: 'prenatal-diagnosis',
    appropriatenessBand: 'usually-appropriate',
    consentBand: 'caution',
    triageTier: 'urgent',
    completenessPercent: 75,
    clinician: 'Dr M Adebayo',
    flags: ['prenatal-time-critical', 'consent-not-obtained']
  }
];

window.GeneticTestRequestDashboard.sampleRequests = sampleRequests;
})();
