// Sample request data for the X-ray vetting dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Ten realistic rows spanning every triage tier (routine / urgent / emergency),
// every appropriateness band, every radiation-safety band, and a range of dose
// bands. NHS numbers are placeholder values in the canonical "NNN NNN NNNN"
// display form. Includes the required worked cases: a routine chest X-ray, an
// urgent trauma case, a pregnancy-flag case, and a repeat-recent-imaging case.

(function () {
'use strict';
window.XRayTestRequestDashboard = window.XRayTestRequestDashboard || {};

/** @type {import('./types.js').RequestRow[]} */
const sampleRequests = [
  {
    id: 'X001',
    referralDate: '2026-05-04',
    patient: 'Okafor, Amara',
    nhs: '401 234 5678',
    bodyRegion: 'chest',
    laterality: 'not-applicable',
    indication: 'chest-infection',
    appropriatenessBand: 'usually-appropriate',
    radiationSafetyBand: 'safe',
    radiationDoseBand: 'low',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'X002',
    referralDate: '2026-05-05',
    patient: 'Bianchi, Sofia',
    nhs: '402 345 6789',
    bodyRegion: 'wrist-hand',
    laterality: 'right',
    indication: 'trauma-fracture',
    appropriatenessBand: 'usually-appropriate',
    radiationSafetyBand: 'safe',
    radiationDoseBand: 'low',
    triageTier: 'urgent',
    completenessPercent: 95,
    clinician: 'Dr K Mensah',
    flags: []
  },
  {
    id: 'X003',
    referralDate: '2026-05-05',
    patient: 'Novak, Petra',
    nhs: '403 456 7890',
    bodyRegion: 'abdomen',
    laterality: 'not-applicable',
    indication: 'abdominal-obstruction',
    appropriatenessBand: 'usually-appropriate',
    radiationSafetyBand: 'caution',
    radiationDoseBand: 'moderate',
    triageTier: 'urgent',
    completenessPercent: 85,
    clinician: 'Dr L Romano',
    flags: ['possible-pregnancy']
  },
  {
    id: 'X004',
    referralDate: '2026-05-06',
    patient: 'Hassan, Layla',
    nhs: '404 567 8901',
    bodyRegion: 'pelvis',
    laterality: 'not-applicable',
    indication: 'trauma-fracture',
    appropriatenessBand: 'usually-appropriate',
    radiationSafetyBand: 'contraindicated',
    radiationDoseBand: 'moderate',
    triageTier: 'urgent',
    completenessPercent: 90,
    clinician: 'Dr M Adebayo',
    flags: ['pregnancy']
  },
  {
    id: 'X005',
    referralDate: '2026-05-06',
    patient: 'Connolly, Niamh',
    nhs: '405 678 9012',
    bodyRegion: 'chest',
    laterality: 'not-applicable',
    indication: 'line-position-check',
    appropriatenessBand: 'usually-appropriate',
    radiationSafetyBand: 'safe',
    radiationDoseBand: 'low',
    triageTier: 'urgent',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'X006',
    referralDate: '2026-05-07',
    patient: 'Silva, Beatriz',
    nhs: '406 789 0123',
    bodyRegion: 'knee',
    laterality: 'left',
    indication: 'joint-pain',
    appropriatenessBand: 'usually-appropriate',
    radiationSafetyBand: 'caution',
    radiationDoseBand: 'low',
    triageTier: 'routine',
    completenessPercent: 80,
    clinician: 'Dr P Sharma',
    flags: ['repeat-recent-imaging']
  },
  {
    id: 'X007',
    referralDate: '2026-05-07',
    patient: 'Andersson, Elin',
    nhs: '407 890 1234',
    bodyRegion: 'spine-lumbar',
    laterality: 'not-applicable',
    indication: 'arthritis',
    appropriatenessBand: 'may-be-appropriate',
    radiationSafetyBand: 'caution',
    radiationDoseBand: 'high',
    triageTier: 'routine',
    completenessPercent: 60,
    clinician: 'Dr R Ahmed',
    flags: ['unjustified-exposure', 'high-dose']
  },
  {
    id: 'X008',
    referralDate: '2026-05-08',
    patient: 'Kowalski, Zofia',
    nhs: '408 901 2345',
    bodyRegion: 'shoulder',
    laterality: 'not-applicable',
    indication: 'joint-pain',
    appropriatenessBand: 'usually-appropriate',
    radiationSafetyBand: 'caution',
    radiationDoseBand: 'low',
    triageTier: 'routine',
    completenessPercent: 75,
    clinician: 'Dr K Mensah',
    flags: ['wrong-laterality-risk']
  },
  {
    id: 'X009',
    referralDate: '2026-05-08',
    patient: 'Müller, Hannah',
    nhs: '409 012 3456',
    bodyRegion: 'chest',
    laterality: 'not-applicable',
    indication: 'joint-pain',
    appropriatenessBand: 'usually-not-appropriate',
    radiationSafetyBand: 'caution',
    radiationDoseBand: 'low',
    triageTier: 'routine',
    completenessPercent: 65,
    clinician: 'Dr L Romano',
    flags: ['missing-clinical-question']
  },
  {
    id: 'X010',
    referralDate: '2026-05-09',
    patient: 'Tanaka, Yuki',
    nhs: '410 123 4567',
    bodyRegion: 'chest',
    laterality: 'not-applicable',
    indication: 'suspected-pneumothorax',
    appropriatenessBand: 'usually-appropriate',
    radiationSafetyBand: 'safe',
    radiationDoseBand: 'low',
    triageTier: 'emergency',
    completenessPercent: 95,
    clinician: 'Dr M Adebayo',
    flags: []
  }
];

window.XRayTestRequestDashboard.sampleRequests = sampleRequests;
})();
