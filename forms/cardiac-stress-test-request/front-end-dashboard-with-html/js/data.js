// Sample request data for the cardiac stress test vetting dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Ten realistic rows spanning every triage tier (routine / urgent /
// emergency), every appropriateness band, and every safety / contraindication
// band. NHS numbers are placeholder values in the canonical "NNN NNN NNNN"
// display form. Includes the required worked cases: a routine
// suspected-angina exercise-treadmill request, a recent-ACS contraindication
// case, and a severe-aortic-stenosis case.

(function () {
'use strict';
window.CardiacStressTestRequestDashboard =
  window.CardiacStressTestRequestDashboard || {};

/** @type {import('./types.js').RequestRow[]} */
const sampleRequests = [
  {
    id: 'C001',
    referralDate: '2026-05-04',
    patient: 'Okafor, Amara',
    nhs: '401 234 5678',
    testType: 'exercise-treadmill-ecg',
    indication: 'suspected-angina',
    appropriatenessBand: 'usually-appropriate',
    contraindicationBand: 'ok',
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
    testType: 'exercise-treadmill-ecg',
    indication: 'risk-stratification-post-mi',
    appropriatenessBand: 'may-be-appropriate',
    contraindicationBand: 'contraindicated',
    triageTier: 'emergency',
    completenessPercent: 95,
    clinician: 'Dr K Mensah',
    flags: ['recent-acs-contraindication']
  },
  {
    id: 'C003',
    referralDate: '2026-05-05',
    patient: 'Novak, Petra',
    nhs: '403 456 7890',
    testType: 'stress-echo',
    indication: 'valve-disease',
    appropriatenessBand: 'usually-appropriate',
    contraindicationBand: 'contraindicated',
    triageTier: 'urgent',
    completenessPercent: 90,
    clinician: 'Dr L Romano',
    flags: ['severe-aortic-stenosis']
  },
  {
    id: 'C004',
    referralDate: '2026-05-06',
    patient: 'Hassan, Layla',
    nhs: '404 567 8901',
    testType: 'dobutamine-stress-echo',
    indication: 'known-cad-assessment',
    appropriatenessBand: 'may-be-appropriate',
    contraindicationBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr M Adebayo',
    flags: []
  },
  {
    id: 'C005',
    referralDate: '2026-05-06',
    patient: 'Connolly, Niamh',
    nhs: '405 678 9012',
    testType: 'exercise-treadmill-ecg',
    indication: 'known-cad-assessment',
    appropriatenessBand: 'may-be-appropriate',
    contraindicationBand: 'caution',
    triageTier: 'routine',
    completenessPercent: 70,
    clinician: 'Dr H Iqbal',
    flags: ['unable-to-exercise']
  },
  {
    id: 'C006',
    referralDate: '2026-05-07',
    patient: 'Silva, Beatriz',
    nhs: '406 789 0123',
    testType: 'myocardial-perfusion-spect',
    indication: 'risk-stratification-post-mi',
    appropriatenessBand: 'usually-appropriate',
    contraindicationBand: 'ok',
    triageTier: 'urgent',
    completenessPercent: 90,
    clinician: 'Dr P Sharma',
    flags: []
  },
  {
    id: 'C007',
    referralDate: '2026-05-07',
    patient: 'Andersson, Elin',
    nhs: '407 890 1234',
    testType: 'exercise-treadmill-ecg',
    indication: 'exercise-tolerance',
    appropriatenessBand: 'usually-appropriate',
    contraindicationBand: 'caution',
    triageTier: 'routine',
    completenessPercent: 60,
    clinician: 'Dr R Ahmed',
    flags: ['uncontrolled-hypertension', 'missing-clinical-question']
  },
  {
    id: 'C008',
    referralDate: '2026-05-08',
    patient: 'Kowalski, Zofia',
    nhs: '408 901 2345',
    testType: 'stress-cardiac-mri',
    indication: 'known-cad-assessment',
    appropriatenessBand: 'usually-appropriate',
    contraindicationBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 85,
    clinician: 'Dr K Mensah',
    flags: []
  },
  {
    id: 'C009',
    referralDate: '2026-05-08',
    patient: 'Müller, Hannah',
    nhs: '409 012 3456',
    testType: 'myocardial-perfusion-spect',
    indication: 'exercise-tolerance',
    appropriatenessBand: 'usually-not-appropriate',
    contraindicationBand: 'ok',
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
    testType: 'stress-echo',
    indication: 'suspected-angina',
    appropriatenessBand: 'usually-appropriate',
    contraindicationBand: 'ok',
    triageTier: 'urgent',
    completenessPercent: 95,
    clinician: 'Dr M Adebayo',
    flags: []
  }
];

window.CardiacStressTestRequestDashboard.sampleRequests = sampleRequests;
})();
