// Sample request data for the DEXA bone-density vetting dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Nine realistic rows spanning both triage tiers (routine / urgent), every
// appropriateness band, and a range of scan regions and indications. NHS
// numbers are placeholder values in the canonical "NNN NNN NNNN" display
// form. Includes the required worked cases: a routine osteoporosis-screening
// request, a recent-fragility-fracture case, a high-FRAX case, and a
// duplicate-recent-dexa case.

(function () {
'use strict';
window.DexaBoneDensityTestRequestDashboard =
  window.DexaBoneDensityTestRequestDashboard || {};

/** @type {import('./types.js').RequestRow[]} */
const sampleRequests = [
  {
    id: 'D001',
    referralDate: '2026-05-04',
    patient: 'Okafor, Amara',
    nhs: '401 234 5678',
    scanRegion: 'hip-and-spine',
    indication: 'osteoporosis-screening',
    fraxPercent: 12.0,
    appropriatenessBand: 'usually-appropriate',
    radiationDoseBand: 'low',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'D002',
    referralDate: '2026-05-05',
    patient: 'Bianchi, Sofia',
    nhs: '402 345 6789',
    scanRegion: 'hip-and-spine',
    indication: 'fragility-fracture',
    fraxPercent: 24.5,
    appropriatenessBand: 'usually-appropriate',
    radiationDoseBand: 'low',
    triageTier: 'urgent',
    completenessPercent: 95,
    clinician: 'Dr K Mensah',
    flags: ['recent-fragility-fracture']
  },
  {
    id: 'D003',
    referralDate: '2026-05-05',
    patient: 'Novak, Petra',
    nhs: '403 456 7890',
    scanRegion: 'hip',
    indication: 'high-frax-risk',
    fraxPercent: 34.0,
    appropriatenessBand: 'usually-appropriate',
    radiationDoseBand: 'low',
    triageTier: 'urgent',
    completenessPercent: 90,
    clinician: 'Dr L Romano',
    flags: ['high-frax-risk']
  },
  {
    id: 'D004',
    referralDate: '2026-05-06',
    patient: 'Hassan, Layla',
    nhs: '404 567 8901',
    scanRegion: 'spine',
    indication: 'monitoring-treatment',
    fraxPercent: 18.0,
    appropriatenessBand: 'usually-appropriate',
    radiationDoseBand: 'low',
    triageTier: 'routine',
    completenessPercent: 85,
    clinician: 'Dr M Adebayo',
    flags: ['duplicate-recent-dexa']
  },
  {
    id: 'D005',
    referralDate: '2026-05-06',
    patient: 'Connolly, Niamh',
    nhs: '405 678 9012',
    scanRegion: 'hip-and-spine',
    indication: 'long-term-steroids',
    fraxPercent: 21.5,
    appropriatenessBand: 'usually-appropriate',
    radiationDoseBand: 'low',
    triageTier: 'urgent',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'D006',
    referralDate: '2026-05-07',
    patient: 'Silva, Beatriz',
    nhs: '406 789 0123',
    scanRegion: 'whole-body',
    indication: 'secondary-osteoporosis',
    fraxPercent: 9.0,
    appropriatenessBand: 'may-be-appropriate',
    radiationDoseBand: 'moderate',
    triageTier: 'routine',
    completenessPercent: 75,
    clinician: 'Dr P Sharma',
    flags: []
  },
  {
    id: 'D007',
    referralDate: '2026-05-07',
    patient: 'Andersson, Elin',
    nhs: '407 890 1234',
    scanRegion: 'forearm',
    indication: 'early-menopause',
    fraxPercent: 6.0,
    appropriatenessBand: 'may-be-appropriate',
    radiationDoseBand: 'low',
    triageTier: 'routine',
    completenessPercent: 60,
    clinician: 'Dr R Ahmed',
    flags: ['missing-clinical-question']
  },
  {
    id: 'D008',
    referralDate: '2026-05-08',
    patient: 'Kowalski, Zofia',
    nhs: '408 901 2345',
    scanRegion: 'spine',
    indication: 'other',
    fraxPercent: null,
    appropriatenessBand: 'may-be-appropriate',
    radiationDoseBand: 'low',
    triageTier: 'routine',
    completenessPercent: 55,
    clinician: 'Dr K Mensah',
    flags: ['other', 'missing-indication']
  },
  {
    id: 'D009',
    referralDate: '2026-05-08',
    patient: 'Müller, Hannah',
    nhs: '409 012 3456',
    scanRegion: 'whole-body',
    indication: 'osteoporosis-screening',
    fraxPercent: 4.0,
    appropriatenessBand: 'usually-not-appropriate',
    radiationDoseBand: 'moderate',
    triageTier: 'routine',
    completenessPercent: 70,
    clinician: 'Dr L Romano',
    flags: []
  }
];

window.DexaBoneDensityTestRequestDashboard.sampleRequests = sampleRequests;
})();
