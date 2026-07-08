// Sample request data for the nerve conduction study vetting dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Ten realistic rows spanning both triage tiers (routine / urgent), every
// appropriateness band, and every procedural-risk band. NHS numbers are
// placeholder values in the canonical "NNN NNN NNNN" display form. Includes
// the three required worked cases: a routine carpal-tunnel request, a suspected
// motor-neurone-disease urgent case, and an anticoagulant + needle-EMG
// bleeding-risk case.

(function () {
'use strict';
window.NerveConductionStudyTestRequestDashboard =
  window.NerveConductionStudyTestRequestDashboard || {};

/** @type {import('./types.js').RequestRow[]} */
const sampleRequests = [
  {
    id: 'N001',
    referralDate: '2026-05-04',
    patient: 'Okafor, Amara',
    nhs: '401 234 5678',
    studyType: 'nerve-conduction',
    region: 'upper-limb',
    indication: 'carpal-tunnel',
    appropriatenessBand: 'usually-appropriate',
    proceduralRiskBand: 'low',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'N002',
    referralDate: '2026-05-05',
    patient: 'Bianchi, Sofia',
    nhs: '402 345 6789',
    studyType: 'nerve-conduction-and-emg',
    region: 'generalised',
    indication: 'suspected-motor-neurone-disease',
    appropriatenessBand: 'usually-appropriate',
    proceduralRiskBand: 'moderate',
    triageTier: 'urgent',
    completenessPercent: 95,
    clinician: 'Dr K Mensah',
    flags: ['suspected-mnd-urgent']
  },
  {
    id: 'N003',
    referralDate: '2026-05-05',
    patient: 'Novak, Petra',
    nhs: '403 456 7890',
    studyType: 'emg',
    region: 'lower-limb',
    indication: 'radiculopathy',
    appropriatenessBand: 'usually-appropriate',
    proceduralRiskBand: 'high',
    triageTier: 'routine',
    completenessPercent: 90,
    clinician: 'Dr L Romano',
    flags: ['anticoag-emg-bleeding-risk']
  },
  {
    id: 'N004',
    referralDate: '2026-05-06',
    patient: 'Hassan, Layla',
    nhs: '404 567 8901',
    studyType: 'nerve-conduction-and-emg',
    region: 'all-limbs',
    indication: 'peripheral-neuropathy',
    appropriatenessBand: 'usually-appropriate',
    proceduralRiskBand: 'moderate',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr M Adebayo',
    flags: ['pacemaker-stimulation-caution']
  },
  {
    id: 'N005',
    referralDate: '2026-05-06',
    patient: 'Connolly, Niamh',
    nhs: '405 678 9012',
    studyType: 'repetitive-stimulation',
    region: 'cranial',
    indication: 'suspected-myasthenia',
    appropriatenessBand: 'usually-appropriate',
    proceduralRiskBand: 'low',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'N006',
    referralDate: '2026-05-07',
    patient: 'Silva, Beatriz',
    nhs: '406 789 0123',
    studyType: 'emg',
    region: 'generalised',
    indication: 'myopathy',
    appropriatenessBand: 'usually-appropriate',
    proceduralRiskBand: 'moderate',
    triageTier: 'routine',
    completenessPercent: 85,
    clinician: 'Dr P Sharma',
    flags: []
  },
  {
    id: 'N007',
    referralDate: '2026-05-07',
    patient: 'Andersson, Elin',
    nhs: '407 890 1234',
    studyType: 'nerve-conduction',
    region: 'upper-limb',
    indication: 'other',
    appropriatenessBand: 'may-be-appropriate',
    proceduralRiskBand: 'low',
    triageTier: 'routine',
    completenessPercent: 60,
    clinician: 'Dr R Ahmed',
    flags: ['missing-clinical-question']
  },
  {
    id: 'N008',
    referralDate: '2026-05-08',
    patient: 'Kowalski, Zofia',
    nhs: '408 901 2345',
    studyType: 'nerve-conduction-and-emg',
    region: 'upper-limb',
    indication: 'plexopathy',
    appropriatenessBand: 'usually-appropriate',
    proceduralRiskBand: 'high',
    triageTier: 'urgent',
    completenessPercent: 90,
    clinician: 'Dr K Mensah',
    flags: ['anticoag-emg-bleeding-risk']
  },
  {
    id: 'N009',
    referralDate: '2026-05-08',
    patient: 'Müller, Hannah',
    nhs: '409 012 3456',
    studyType: 'emg',
    region: 'upper-limb',
    indication: 'carpal-tunnel',
    appropriatenessBand: 'may-be-appropriate',
    proceduralRiskBand: 'moderate',
    triageTier: 'routine',
    completenessPercent: 80,
    clinician: 'Dr L Romano',
    flags: []
  },
  {
    id: 'N010',
    referralDate: '2026-05-09',
    patient: 'Tanaka, Yuki',
    nhs: '410 123 4567',
    studyType: 'repetitive-stimulation',
    region: 'lower-limb',
    indication: 'radiculopathy',
    appropriatenessBand: 'usually-not-appropriate',
    proceduralRiskBand: 'low',
    triageTier: 'routine',
    completenessPercent: 70,
    clinician: 'Dr M Adebayo',
    flags: []
  }
];

window.NerveConductionStudyTestRequestDashboard.sampleRequests = sampleRequests;
})();
