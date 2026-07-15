// Sample request data for the fluoroscopy / contrast-study vetting dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Ten realistic rows spanning every triage tier (routine / urgent /
// emergency), every appropriateness band, every safety band, and every
// radiation-dose band. NHS numbers are placeholder values in the canonical
// "NNN NNN NNNN" display form. Includes the four required worked cases: a
// routine barium-swallow, a pregnancy case, a contrast-allergy case, and a
// suspected-perforation case.

/** @type {import('./types.js').RequestRow[]} */
const sampleRequests = [
  {
    id: 'F001',
    referralDate: '2026-05-04',
    patient: 'Okafor, Amara',
    nhs: '401 234 5678',
    studyType: 'barium-swallow',
    indication: 'dysphagia',
    appropriatenessBand: 'usually-appropriate',
    safetyBand: 'ok',
    radiationDoseBand: 'low',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'F002',
    referralDate: '2026-05-05',
    patient: 'Bianchi, Sofia',
    nhs: '402 345 6789',
    studyType: 'hysterosalpingogram',
    indication: 'infertility-tubal-patency',
    appropriatenessBand: 'usually-appropriate',
    safetyBand: 'contraindicated',
    radiationDoseBand: 'moderate',
    triageTier: 'routine',
    completenessPercent: 90,
    clinician: 'Dr K Mensah',
    flags: ['pregnancy']
  },
  {
    id: 'F003',
    referralDate: '2026-05-05',
    patient: 'Novak, Petra',
    nhs: '403 456 7890',
    studyType: 'barium-meal',
    indication: 'reflux',
    appropriatenessBand: 'usually-appropriate',
    safetyBand: 'caution',
    radiationDoseBand: 'moderate',
    triageTier: 'routine',
    completenessPercent: 85,
    clinician: 'Dr L Romano',
    flags: ['contrast-allergy']
  },
  {
    id: 'F004',
    referralDate: '2026-05-06',
    patient: 'Hassan, Layla',
    nhs: '404 567 8901',
    studyType: 'barium-swallow',
    indication: 'suspected-perforation',
    appropriatenessBand: 'usually-not-appropriate',
    safetyBand: 'contraindicated',
    radiationDoseBand: 'low',
    triageTier: 'emergency',
    completenessPercent: 95,
    clinician: 'Dr M Adebayo',
    flags: ['suspected-perforation-contrast-choice']
  },
  {
    id: 'F005',
    referralDate: '2026-05-06',
    patient: 'Connolly, Niamh',
    nhs: '405 678 9012',
    studyType: 'water-soluble-contrast-swallow',
    indication: 'suspected-perforation',
    appropriatenessBand: 'usually-appropriate',
    safetyBand: 'ok',
    radiationDoseBand: 'low',
    triageTier: 'emergency',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'F006',
    referralDate: '2026-05-07',
    patient: 'Silva, Beatriz',
    nhs: '406 789 0123',
    studyType: 'barium-enema',
    indication: 'constipation',
    appropriatenessBand: 'may-be-appropriate',
    safetyBand: 'ok',
    radiationDoseBand: 'high',
    triageTier: 'routine',
    completenessPercent: 80,
    clinician: 'Dr P Sharma',
    flags: ['high-radiation-dose']
  },
  {
    id: 'F007',
    referralDate: '2026-05-07',
    patient: 'Andersson, Elin',
    nhs: '407 890 1234',
    studyType: 'barium-follow-through',
    indication: 'suspected-obstruction',
    appropriatenessBand: 'usually-appropriate',
    safetyBand: 'ok',
    radiationDoseBand: 'moderate',
    triageTier: 'urgent',
    completenessPercent: 90,
    clinician: 'Dr R Ahmed',
    flags: []
  },
  {
    id: 'F008',
    referralDate: '2026-05-08',
    patient: 'Kowalski, Zofia',
    nhs: '408 901 2345',
    studyType: 'micturating-cystourethrogram',
    indication: 'vesicoureteric-reflux',
    appropriatenessBand: 'usually-appropriate',
    safetyBand: 'ok',
    radiationDoseBand: 'moderate',
    triageTier: 'routine',
    completenessPercent: 70,
    clinician: 'Dr K Mensah',
    flags: ['missing-clinical-question']
  },
  {
    id: 'F009',
    referralDate: '2026-05-08',
    patient: 'Müller, Hannah',
    nhs: '409 012 3456',
    studyType: 'barium-enema',
    indication: 'dysphagia',
    appropriatenessBand: 'usually-not-appropriate',
    safetyBand: 'ok',
    radiationDoseBand: 'high',
    triageTier: 'routine',
    completenessPercent: 65,
    clinician: 'Dr L Romano',
    flags: ['high-radiation-dose', 'missing-clinical-question']
  },
  {
    id: 'F010',
    referralDate: '2026-05-09',
    patient: 'Tanaka, Yuki',
    nhs: '410 123 4567',
    studyType: 'arthrogram',
    indication: 'joint-assessment',
    appropriatenessBand: 'usually-appropriate',
    safetyBand: 'caution',
    radiationDoseBand: 'low',
    triageTier: 'routine',
    completenessPercent: 95,
    clinician: 'Dr M Adebayo',
    flags: ['contrast-allergy']
  }
];

export { sampleRequests };
