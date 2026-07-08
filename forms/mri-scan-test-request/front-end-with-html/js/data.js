// Sample request data for the MRI scan vetting dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Ten realistic rows spanning every triage tier (routine / urgent /
// emergency), every appropriateness band, and every MRI safety band. NHS
// numbers are placeholder values in the canonical "NNN NNN NNNN" display form.
// Includes the four required worked cases: a routine cleared case, a
// conditional/implant case, a contraindicated pacemaker case, and a
// gadolinium-renal case.

(function () {
'use strict';
window.MriScanTestRequestDashboard =
  window.MriScanTestRequestDashboard || {};

/** @type {import('./types.js').RequestRow[]} */
const sampleRequests = [
  {
    id: 'M001',
    referralDate: '2026-05-04',
    patient: 'Okafor, Amara',
    nhs: '401 234 5678',
    bodyRegion: 'spine-lumbar',
    indication: 'back-pain-radiculopathy',
    appropriatenessBand: 'usually-appropriate',
    mriSafetyBand: 'cleared',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'M002',
    referralDate: '2026-05-05',
    patient: 'Bianchi, Sofia',
    nhs: '402 345 6789',
    bodyRegion: 'brain',
    indication: 'suspected-stroke',
    appropriatenessBand: 'usually-appropriate',
    mriSafetyBand: 'cleared',
    triageTier: 'emergency',
    completenessPercent: 95,
    clinician: 'Dr K Mensah',
    flags: []
  },
  {
    id: 'M003',
    referralDate: '2026-05-05',
    patient: 'Novak, Petra',
    nhs: '403 456 7890',
    bodyRegion: 'brain',
    indication: 'neurological-deficit',
    appropriatenessBand: 'usually-appropriate',
    mriSafetyBand: 'needs-mri-physics-review',
    triageTier: 'urgent',
    completenessPercent: 90,
    clinician: 'Dr L Romano',
    flags: ['ferromagnetic-implant']
  },
  {
    id: 'M004',
    referralDate: '2026-05-06',
    patient: 'Hassan, Layla',
    nhs: '404 567 8901',
    bodyRegion: 'cardiac',
    indication: 'cardiac-function',
    appropriatenessBand: 'usually-appropriate',
    mriSafetyBand: 'contraindicated',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr M Adebayo',
    flags: ['pacemaker-icd']
  },
  {
    id: 'M005',
    referralDate: '2026-05-06',
    patient: 'Connolly, Niamh',
    nhs: '405 678 9012',
    bodyRegion: 'abdomen',
    indication: 'cancer-staging',
    appropriatenessBand: 'usually-appropriate',
    mriSafetyBand: 'cleared',
    triageTier: 'routine',
    completenessPercent: 85,
    clinician: 'Dr H Iqbal',
    flags: ['gadolinium-renal-risk']
  },
  {
    id: 'M006',
    referralDate: '2026-05-07',
    patient: 'Silva, Beatriz',
    nhs: '406 789 0123',
    bodyRegion: 'musculoskeletal-joint',
    indication: 'joint-derangement',
    appropriatenessBand: 'usually-appropriate',
    mriSafetyBand: 'conditional',
    triageTier: 'routine',
    completenessPercent: 90,
    clinician: 'Dr P Sharma',
    flags: ['ferromagnetic-implant']
  },
  {
    id: 'M007',
    referralDate: '2026-05-07',
    patient: 'Andersson, Elin',
    nhs: '407 890 1234',
    bodyRegion: 'whole-body',
    indication: 'follow-up-surveillance',
    appropriatenessBand: 'may-be-appropriate',
    mriSafetyBand: 'cleared',
    triageTier: 'routine',
    completenessPercent: 60,
    clinician: 'Dr R Ahmed',
    flags: ['missing-clinical-question']
  },
  {
    id: 'M008',
    referralDate: '2026-05-08',
    patient: 'Kowalski, Zofia',
    nhs: '408 901 2345',
    bodyRegion: 'brain',
    indication: 'suspected-ms',
    appropriatenessBand: 'usually-appropriate',
    mriSafetyBand: 'needs-mri-physics-review',
    triageTier: 'routine',
    completenessPercent: 80,
    clinician: 'Dr K Mensah',
    flags: ['orbital-foreign-body']
  },
  {
    id: 'M009',
    referralDate: '2026-05-08',
    patient: 'Müller, Hannah',
    nhs: '409 012 3456',
    bodyRegion: 'pelvis',
    indication: 'epilepsy',
    appropriatenessBand: 'usually-not-appropriate',
    mriSafetyBand: 'cleared',
    triageTier: 'routine',
    completenessPercent: 70,
    clinician: 'Dr L Romano',
    flags: ['missing-indication']
  },
  {
    id: 'M010',
    referralDate: '2026-05-09',
    patient: 'Tanaka, Yuki',
    nhs: '410 123 4567',
    bodyRegion: 'pelvis',
    indication: 'suspected-malignancy',
    appropriatenessBand: 'usually-appropriate',
    mriSafetyBand: 'conditional',
    triageTier: 'urgent',
    completenessPercent: 95,
    clinician: 'Dr M Adebayo',
    flags: ['gadolinium-renal-risk', 'claustrophobia']
  }
];

window.MriScanTestRequestDashboard.sampleRequests = sampleRequests;
})();
