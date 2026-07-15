// Sample request data for the tumour-marker vetting dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Ten realistic rows spanning every urgency tier (routine / urgent /
// two-week-wait), every appropriateness band, and every interpretation band.
// NHS numbers are placeholder values in the canonical "NNN NNN NNNN" display
// form. Includes the four required worked cases: a routine cancer-monitoring
// request, a two-week-wait suspected-malignancy case, an inappropriate-
// screening case, and a no-marker-selected case.

/** @type {import('./types.js').RequestRow[]} */
const sampleRequests = [
  {
    id: 'T001',
    referralDate: '2026-05-04',
    patient: 'Okafor, Amara',
    nhs: '401 234 5678',
    markers: ['CEA'],
    indication: 'cancer-monitoring',
    appropriatenessBand: 'usually-appropriate',
    interpretationBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'T002',
    referralDate: '2026-05-05',
    patient: 'Bianchi, Sofia',
    nhs: '402 345 6789',
    markers: ['CA125'],
    indication: 'suspected-malignancy',
    appropriatenessBand: 'usually-appropriate',
    interpretationBand: 'ok',
    triageTier: 'two-week-wait',
    completenessPercent: 95,
    clinician: 'Dr K Mensah',
    flags: ['suspected-cancer-2ww']
  },
  {
    id: 'T003',
    referralDate: '2026-05-05',
    patient: 'Novak, Petra',
    nhs: '403 456 7890',
    markers: ['PSA', 'CA125', 'CA19-9', 'CEA', 'AFP'],
    indication: 'screening-high-risk',
    appropriatenessBand: 'usually-not-appropriate',
    interpretationBand: 'misuse-risk',
    triageTier: 'routine',
    completenessPercent: 70,
    clinician: 'Dr L Romano',
    flags: ['inappropriate-screening-use']
  },
  {
    id: 'T004',
    referralDate: '2026-05-06',
    patient: 'Hassan, Layla',
    nhs: '404 567 8901',
    markers: [],
    indication: 'suspected-malignancy',
    appropriatenessBand: 'usually-not-appropriate',
    interpretationBand: 'ok',
    triageTier: 'urgent',
    completenessPercent: 55,
    clinician: 'Dr M Adebayo',
    flags: ['no-marker-selected']
  },
  {
    id: 'T005',
    referralDate: '2026-05-06',
    patient: 'Connolly, Niamh',
    nhs: '405 678 9012',
    markers: ['CA15-3'],
    indication: 'recurrence-surveillance',
    appropriatenessBand: 'usually-appropriate',
    interpretationBand: 'caution',
    triageTier: 'routine',
    completenessPercent: 90,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'T006',
    referralDate: '2026-05-07',
    patient: 'Silva, Beatriz',
    nhs: '406 789 0123',
    markers: ['AFP', 'beta-hCG', 'LDH'],
    indication: 'suspected-malignancy',
    appropriatenessBand: 'usually-appropriate',
    interpretationBand: 'ok',
    triageTier: 'urgent',
    completenessPercent: 100,
    clinician: 'Dr P Sharma',
    flags: []
  },
  {
    id: 'T007',
    referralDate: '2026-05-07',
    patient: 'Andersson, Elin',
    nhs: '407 890 1234',
    markers: ['CA19-9', 'PSA'],
    indication: 'cancer-monitoring',
    appropriatenessBand: 'may-be-appropriate',
    interpretationBand: 'caution',
    triageTier: 'routine',
    completenessPercent: 60,
    clinician: 'Dr R Ahmed',
    flags: ['marker-indication-mismatch', 'missing-clinical-details']
  },
  {
    id: 'T008',
    referralDate: '2026-05-08',
    patient: 'Kowalski, Zofia',
    nhs: '408 901 2345',
    markers: ['Calcitonin'],
    indication: 'suspected-malignancy',
    appropriatenessBand: 'usually-appropriate',
    interpretationBand: 'ok',
    triageTier: 'urgent',
    completenessPercent: 85,
    clinician: 'Dr K Mensah',
    flags: []
  },
  {
    id: 'T009',
    referralDate: '2026-05-08',
    patient: 'Müller, Hannah',
    nhs: '409 012 3456',
    markers: ['Chromogranin A'],
    indication: 'treatment-response',
    appropriatenessBand: 'usually-appropriate',
    interpretationBand: 'caution',
    triageTier: 'routine',
    completenessPercent: 75,
    clinician: 'Dr L Romano',
    flags: ['missing-clinical-details']
  },
  {
    id: 'T010',
    referralDate: '2026-05-09',
    patient: 'Tanaka, Yuki',
    nhs: '410 123 4567',
    markers: ['CA125'],
    indication: '',
    appropriatenessBand: 'may-be-appropriate',
    interpretationBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 65,
    clinician: 'Dr M Adebayo',
    flags: ['missing-indication']
  }
];

export { sampleRequests };
