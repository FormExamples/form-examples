// Sample request data for the cardiology request vetting dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Ten realistic rows spanning every triage tier (routine / urgent /
// emergency), every appropriateness band, and every safety / red-flag band.
// NHS numbers are placeholder values in the canonical "NNN NNN NNNN" display
// form. Includes the required worked cases: a routine chest-pain rapid-access
// referral, a suspected-ACS red-flag case, an exertional-syncope case, and a
// new-onset-heart-failure case.

(function () {
'use strict';
window.CardiologyRequestDashboard =
  window.CardiologyRequestDashboard || {};

/** @type {import('./types.js').RequestRow[]} */
const sampleRequests = [
  {
    id: 'R001',
    referralDate: '2026-05-04',
    patient: 'Okafor, Amara',
    nhs: '401 234 5678',
    service: 'rapid-access-chest-pain',
    reason: 'chest-pain',
    appropriatenessBand: 'usually-appropriate',
    safetyBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 100,
    recommendation: 'accept',
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'R002',
    referralDate: '2026-05-05',
    patient: 'Bianchi, Sofia',
    nhs: '402 345 6789',
    service: 'general-cardiology',
    reason: 'chest-pain',
    appropriatenessBand: 'may-be-appropriate',
    safetyBand: 'red-flag',
    triageTier: 'emergency',
    completenessPercent: 95,
    recommendation: 'accept',
    clinician: 'Dr K Mensah',
    flags: ['suspected-acs']
  },
  {
    id: 'R003',
    referralDate: '2026-05-05',
    patient: 'Novak, Petra',
    nhs: '403 456 7890',
    service: 'arrhythmia-ep',
    reason: 'syncope',
    appropriatenessBand: 'may-be-appropriate',
    safetyBand: 'red-flag',
    triageTier: 'urgent',
    completenessPercent: 90,
    recommendation: 'accept',
    clinician: 'Dr L Romano',
    flags: ['exertional-syncope']
  },
  {
    id: 'R004',
    referralDate: '2026-05-06',
    patient: 'Hassan, Layla',
    nhs: '404 567 8901',
    service: 'heart-failure',
    reason: 'breathlessness',
    appropriatenessBand: 'usually-appropriate',
    safetyBand: 'red-flag',
    triageTier: 'urgent',
    completenessPercent: 100,
    recommendation: 'accept',
    clinician: 'Dr M Adebayo',
    flags: ['new-onset-heart-failure']
  },
  {
    id: 'R005',
    referralDate: '2026-05-06',
    patient: 'Connolly, Niamh',
    nhs: '405 678 9012',
    service: 'general-cardiology',
    reason: 'palpitations',
    appropriatenessBand: 'may-be-appropriate',
    safetyBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 70,
    recommendation: 'query-referrer',
    clinician: 'Dr H Iqbal',
    flags: ['missing-clinical-question']
  },
  {
    id: 'R006',
    referralDate: '2026-05-07',
    patient: 'Silva, Beatriz',
    nhs: '406 789 0123',
    service: 'valve-clinic',
    reason: 'murmur-or-valve',
    appropriatenessBand: 'usually-appropriate',
    safetyBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 90,
    recommendation: 'accept',
    clinician: 'Dr P Sharma',
    flags: []
  },
  {
    id: 'R007',
    referralDate: '2026-05-07',
    patient: 'Andersson, Elin',
    nhs: '407 890 1234',
    service: 'rapid-access-chest-pain',
    reason: 'chest-pain',
    appropriatenessBand: 'usually-appropriate',
    safetyBand: 'caution',
    triageTier: 'urgent',
    completenessPercent: 85,
    recommendation: 'accept',
    clinician: 'Dr R Ahmed',
    flags: ['red-flag-chest-pain']
  },
  {
    id: 'R008',
    referralDate: '2026-05-08',
    patient: 'Kowalski, Zofia',
    nhs: '408 901 2345',
    service: 'heart-failure',
    reason: 'heart-failure-symptoms',
    appropriatenessBand: 'usually-appropriate',
    safetyBand: 'caution',
    triageTier: 'urgent',
    completenessPercent: 85,
    recommendation: 'accept',
    clinician: 'Dr K Mensah',
    flags: []
  },
  {
    id: 'R009',
    referralDate: '2026-05-08',
    patient: 'Müller, Hannah',
    nhs: '409 012 3456',
    service: 'valve-clinic',
    reason: 'palpitations',
    appropriatenessBand: 'usually-not-appropriate',
    safetyBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 60,
    recommendation: 'redirect',
    clinician: 'Dr L Romano',
    flags: []
  },
  {
    id: 'R010',
    referralDate: '2026-05-09',
    patient: 'Tanaka, Yuki',
    nhs: '410 123 4567',
    service: 'general-cardiology',
    reason: 'abnormal-ecg',
    appropriatenessBand: 'usually-appropriate',
    safetyBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 95,
    recommendation: 'accept',
    clinician: 'Dr M Adebayo',
    flags: []
  }
];

window.CardiologyRequestDashboard.sampleRequests = sampleRequests;
})();
