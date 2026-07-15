// Sample request data for the microbiology culture vetting dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Ten realistic rows spanning every triage tier (routine / urgent / stat),
// every appropriateness band, and every pre-analytical band. NHS numbers are
// placeholder values in the canonical "NNN NNN NNNN" display form. Includes the
// four required worked cases: a routine wound-swab request, a suspected-sepsis
// stat blood-culture case, a specimen-not-collected case, and a
// no-test-selected case.

/** @type {import('./types.js').RequestRow[]} */
const sampleRequests = [
  {
    id: 'M001',
    referralDate: '2026-05-04',
    patient: 'Okafor, Amara',
    nhs: '401 234 5678',
    specimenType: 'wound-swab',
    indication: 'wound-infection',
    tests: ['cultureAndSensitivity'],
    appropriatenessBand: 'usually-appropriate',
    preanalyticalBand: 'ok',
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
    specimenType: 'blood-culture',
    indication: 'suspected-sepsis',
    tests: ['cultureAndSensitivity', 'gramStain'],
    appropriatenessBand: 'usually-appropriate',
    preanalyticalBand: 'ok',
    triageTier: 'stat',
    completenessPercent: 100,
    clinician: 'Dr K Mensah',
    flags: ['suspected-sepsis-stat']
  },
  {
    id: 'M003',
    referralDate: '2026-05-05',
    patient: 'Novak, Petra',
    nhs: '403 456 7890',
    specimenType: 'blood-culture',
    indication: 'suspected-sepsis',
    tests: ['cultureAndSensitivity'],
    appropriatenessBand: 'usually-appropriate',
    preanalyticalBand: 'reject-risk',
    triageTier: 'stat',
    completenessPercent: 90,
    clinician: 'Dr L Romano',
    flags: ['suspected-sepsis-stat', 'blood-culture-before-antibiotics']
  },
  {
    id: 'M004',
    referralDate: '2026-05-06',
    patient: 'Hassan, Layla',
    nhs: '404 567 8901',
    specimenType: 'urine',
    indication: 'urinary-tract-infection',
    tests: ['cultureAndSensitivity'],
    appropriatenessBand: 'usually-appropriate',
    preanalyticalBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr M Adebayo',
    flags: []
  },
  {
    id: 'M005',
    referralDate: '2026-05-06',
    patient: 'Connolly, Niamh',
    nhs: '405 678 9012',
    specimenType: 'wound-swab',
    indication: 'wound-infection',
    tests: [],
    appropriatenessBand: 'usually-not-appropriate',
    preanalyticalBand: 'caution',
    triageTier: 'routine',
    completenessPercent: 70,
    clinician: 'Dr H Iqbal',
    flags: ['no-test-selected']
  },
  {
    id: 'M006',
    referralDate: '2026-05-07',
    patient: 'Silva, Beatriz',
    nhs: '406 789 0123',
    specimenType: 'csf',
    indication: 'meningitis',
    tests: ['cultureAndSensitivity', 'gramStain', 'pcrMolecular'],
    appropriatenessBand: 'usually-appropriate',
    preanalyticalBand: 'ok',
    triageTier: 'stat',
    completenessPercent: 100,
    clinician: 'Dr P Sharma',
    flags: []
  },
  {
    id: 'M007',
    referralDate: '2026-05-07',
    patient: 'Andersson, Elin',
    nhs: '407 890 1234',
    specimenType: 'sputum',
    indication: 'respiratory-infection',
    tests: ['cultureAndSensitivity', 'acidFastBacilliTb'],
    appropriatenessBand: 'usually-appropriate',
    preanalyticalBand: 'caution',
    triageTier: 'routine',
    completenessPercent: 85,
    clinician: 'Dr R Ahmed',
    flags: []
  },
  {
    id: 'M008',
    referralDate: '2026-05-08',
    patient: 'Kowalski, Zofia',
    nhs: '408 901 2345',
    specimenType: 'stool',
    indication: 'gastroenteritis',
    tests: ['cultureAndSensitivity', 'cDifficileToxin'],
    appropriatenessBand: 'usually-appropriate',
    preanalyticalBand: 'reject-risk',
    triageTier: 'routine',
    completenessPercent: 60,
    clinician: 'Dr K Mensah',
    flags: ['specimen-not-collected']
  },
  {
    id: 'M009',
    referralDate: '2026-05-08',
    patient: 'Müller, Hannah',
    nhs: '409 012 3456',
    specimenType: 'throat-swab',
    indication: 'gastroenteritis',
    tests: ['cultureAndSensitivity'],
    appropriatenessBand: 'usually-not-appropriate',
    preanalyticalBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 75,
    clinician: 'Dr L Romano',
    flags: ['missing-clinical-details']
  },
  {
    id: 'M010',
    referralDate: '2026-05-09',
    patient: 'Tanaka, Yuki',
    nhs: '410 123 4567',
    specimenType: 'urine',
    indication: 'pyrexia-unknown-origin',
    tests: ['cultureAndSensitivity', 'mrsaScreen'],
    appropriatenessBand: 'may-be-appropriate',
    preanalyticalBand: 'caution',
    triageTier: 'urgent',
    completenessPercent: 90,
    clinician: 'Dr M Adebayo',
    flags: []
  }
];

export { sampleRequests };
