// Sample request data for the eye vision test request vetting dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Ten realistic rows spanning every triage tier (routine / urgent /
// emergency), every appropriateness band, and every clinical-priority band.
// NHS numbers are placeholder values in the canonical "NNN NNN NNNN" display
// form. Includes the required worked cases: a routine reduced-vision request,
// an emergency sudden-visual-loss case, a retinal-detachment (flashes /
// floaters) case, and a suspected giant cell arteritis case.

(function () {
'use strict';
window.EyeVisionTestRequestDashboard =
  window.EyeVisionTestRequestDashboard || {};

/** @type {import('./types.js').RequestRow[]} */
const sampleRequests = [
  {
    id: 'E001',
    referralDate: '2026-05-04',
    patient: 'Okafor, Amara',
    nhs: '401 234 5678',
    testType: 'visual-acuity',
    indication: 'reduced-vision',
    laterality: 'bilateral',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'routine',
    completenessPercent: 100,
    priorityBand: 'low',
    clinician: 'Mr H Iqbal',
    flags: []
  },
  {
    id: 'E002',
    referralDate: '2026-05-05',
    patient: 'Bianchi, Sofia',
    nhs: '402 345 6789',
    testType: 'fundus-examination',
    indication: 'sudden-visual-loss',
    laterality: 'left',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'emergency',
    completenessPercent: 95,
    priorityBand: 'high',
    clinician: 'Dr K Mensah',
    flags: ['sudden-visual-loss-emergency']
  },
  {
    id: 'E003',
    referralDate: '2026-05-05',
    patient: 'Novak, Petra',
    nhs: '403 456 7890',
    testType: 'fundus-examination',
    indication: 'flashes-floaters',
    laterality: 'right',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'emergency',
    completenessPercent: 90,
    priorityBand: 'high',
    clinician: 'Ms L Romano',
    flags: ['retinal-detachment-symptoms']
  },
  {
    id: 'E004',
    referralDate: '2026-05-06',
    patient: 'Hassan, Layla',
    nhs: '404 567 8901',
    testType: 'slit-lamp',
    indication: 'red-eye',
    laterality: 'left',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'emergency',
    completenessPercent: 100,
    priorityBand: 'high',
    clinician: 'Dr M Adebayo',
    flags: ['acute-painful-red-eye']
  },
  {
    id: 'E005',
    referralDate: '2026-05-06',
    patient: 'Connolly, Niamh',
    nhs: '405 678 9012',
    testType: 'fundus-examination',
    indication: 'headache-visual-symptoms',
    laterality: 'bilateral',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'emergency',
    completenessPercent: 95,
    priorityBand: 'high',
    clinician: 'Mr H Iqbal',
    flags: ['suspected-giant-cell-arteritis', 'sudden-visual-loss-emergency']
  },
  {
    id: 'E006',
    referralDate: '2026-05-07',
    patient: 'Silva, Beatriz',
    nhs: '406 789 0123',
    testType: 'visual-fields',
    indication: 'suspected-glaucoma',
    laterality: 'bilateral',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'routine',
    completenessPercent: 90,
    priorityBand: 'low',
    clinician: 'Dr P Sharma',
    flags: []
  },
  {
    id: 'E007',
    referralDate: '2026-05-07',
    patient: 'Andersson, Elin',
    nhs: '407 890 1234',
    testType: 'optical-coherence-tomography',
    indication: 'diabetic-retinopathy-screening',
    laterality: 'bilateral',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'routine',
    completenessPercent: 70,
    priorityBand: 'moderate',
    clinician: 'Dr R Ahmed',
    flags: ['missing-clinical-question']
  },
  {
    id: 'E008',
    referralDate: '2026-05-08',
    patient: 'Kowalski, Zofia',
    nhs: '408 901 2345',
    testType: 'orthoptic-assessment',
    indication: 'childhood-squint',
    laterality: 'bilateral',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'routine',
    completenessPercent: 85,
    priorityBand: 'low',
    clinician: 'Ms K Mensah',
    flags: []
  },
  {
    id: 'E009',
    referralDate: '2026-05-08',
    patient: 'Müller, Hannah',
    nhs: '409 012 3456',
    testType: 'fluorescein-angiography',
    indication: 'childhood-squint',
    laterality: 'bilateral',
    appropriatenessBand: 'usually-not-appropriate',
    triageTier: 'routine',
    completenessPercent: 60,
    priorityBand: 'low',
    clinician: 'Ms L Romano',
    flags: []
  },
  {
    id: 'E010',
    referralDate: '2026-05-09',
    patient: 'Tanaka, Yuki',
    nhs: '410 123 4567',
    testType: 'tonometry',
    indication: 'red-eye',
    laterality: 'right',
    appropriatenessBand: 'may-be-appropriate',
    triageTier: 'urgent',
    completenessPercent: 80,
    priorityBand: 'moderate',
    clinician: 'Dr M Adebayo',
    flags: []
  }
];

window.EyeVisionTestRequestDashboard.sampleRequests = sampleRequests;
})();
