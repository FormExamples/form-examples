// Sample request data for the CT scan vetting dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Ten realistic rows spanning every triage tier (routine / urgent /
// emergency), every appropriateness band, and every contrast-safety band.
// NHS numbers are placeholder values in the canonical "NNN NNN NNNN" display
// form. Includes the required worked cases: a routine case, an urgent case, a
// contrast / renal-caution case, and a pregnancy-flag case.

/** @type {import('./types.js').RequestRow[]} */
const sampleRequests = [
  {
    id: 'CT001',
    referralDate: '2026-05-04',
    patient: 'Okafor, Amara',
    nhs: '401 234 5678',
    bodyRegion: 'chest',
    indication: 'follow-up-surveillance',
    appropriatenessBand: 'usually-appropriate',
    contrastSafetyBand: 'safe',
    estimatedDoseBand: 'moderate',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'CT002',
    referralDate: '2026-05-05',
    patient: 'Bianchi, Sofia',
    nhs: '402 345 6789',
    bodyRegion: 'head',
    indication: 'suspected-stroke',
    appropriatenessBand: 'usually-appropriate',
    contrastSafetyBand: 'safe',
    estimatedDoseBand: 'low',
    triageTier: 'emergency',
    completenessPercent: 95,
    clinician: 'Dr K Mensah',
    flags: []
  },
  {
    id: 'CT003',
    referralDate: '2026-05-05',
    patient: 'Novak, Petra',
    nhs: '403 456 7890',
    bodyRegion: 'ct-angiogram',
    indication: 'pulmonary-embolism',
    appropriatenessBand: 'usually-appropriate',
    contrastSafetyBand: 'caution',
    estimatedDoseBand: 'moderate',
    triageTier: 'emergency',
    completenessPercent: 90,
    clinician: 'Dr L Romano',
    flags: ['renal-impairment', 'metformin-contrast']
  },
  {
    id: 'CT004',
    referralDate: '2026-05-06',
    patient: 'Hassan, Layla',
    nhs: '404 567 8901',
    bodyRegion: 'abdomen-pelvis',
    indication: 'renal-colic',
    appropriatenessBand: 'usually-appropriate',
    contrastSafetyBand: 'safe',
    estimatedDoseBand: 'high',
    triageTier: 'urgent',
    completenessPercent: 100,
    clinician: 'Dr M Adebayo',
    flags: ['high-radiation-dose']
  },
  {
    id: 'CT005',
    referralDate: '2026-05-06',
    patient: 'Connolly, Niamh',
    nhs: '405 678 9012',
    bodyRegion: 'abdomen-pelvis',
    indication: 'cancer-staging',
    appropriatenessBand: 'usually-appropriate',
    contrastSafetyBand: 'contraindicated',
    estimatedDoseBand: 'high',
    triageTier: 'routine',
    completenessPercent: 90,
    clinician: 'Dr H Iqbal',
    flags: ['contrast-allergy', 'high-radiation-dose']
  },
  {
    id: 'CT006',
    referralDate: '2026-05-07',
    patient: 'Silva, Beatriz',
    nhs: '406 789 0123',
    bodyRegion: 'abdomen-pelvis',
    indication: 'abdominal-pain',
    appropriatenessBand: 'usually-appropriate',
    contrastSafetyBand: 'caution',
    estimatedDoseBand: 'high',
    triageTier: 'urgent',
    completenessPercent: 85,
    clinician: 'Dr P Sharma',
    flags: ['pregnancy', 'high-radiation-dose']
  },
  {
    id: 'CT007',
    referralDate: '2026-05-07',
    patient: 'Andersson, Elin',
    nhs: '407 890 1234',
    bodyRegion: 'chest',
    indication: 'follow-up-surveillance',
    appropriatenessBand: 'may-be-appropriate',
    contrastSafetyBand: 'caution',
    estimatedDoseBand: 'moderate',
    triageTier: 'routine',
    completenessPercent: 60,
    clinician: 'Dr R Ahmed',
    flags: ['missing-egfr', 'missing-clinical-question']
  },
  {
    id: 'CT008',
    referralDate: '2026-05-08',
    patient: 'Kowalski, Zofia',
    nhs: '408 901 2345',
    bodyRegion: 'spine',
    indication: 'pre-surgical-planning',
    appropriatenessBand: 'usually-appropriate',
    contrastSafetyBand: 'safe',
    estimatedDoseBand: 'moderate',
    triageTier: 'routine',
    completenessPercent: 85,
    clinician: 'Dr K Mensah',
    flags: ['unjustified-exposure']
  },
  {
    id: 'CT009',
    referralDate: '2026-05-08',
    patient: 'Müller, Hannah',
    nhs: '409 012 3456',
    bodyRegion: 'head',
    indication: 'cancer-staging',
    appropriatenessBand: 'usually-not-appropriate',
    contrastSafetyBand: 'safe',
    estimatedDoseBand: 'low',
    triageTier: 'routine',
    completenessPercent: 70,
    clinician: 'Dr L Romano',
    flags: ['missing-indication']
  },
  {
    id: 'CT010',
    referralDate: '2026-05-09',
    patient: 'Tanaka, Yuki',
    nhs: '410 123 4567',
    bodyRegion: 'whole-body',
    indication: 'trauma',
    appropriatenessBand: 'usually-appropriate',
    contrastSafetyBand: 'safe',
    estimatedDoseBand: 'high',
    triageTier: 'emergency',
    completenessPercent: 95,
    clinician: 'Dr M Adebayo',
    flags: ['high-radiation-dose']
  }
];

export { sampleRequests };
