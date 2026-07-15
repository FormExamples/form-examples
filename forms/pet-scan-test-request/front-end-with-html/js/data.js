// Sample request data for the PET-CT vetting dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Ten realistic rows spanning every triage tier (routine / urgent / emergency),
// every appropriateness band, and every preparation-safety band. NHS numbers
// are placeholder values in the canonical "NNN NNN NNNN" display form. Includes
// the required worked cases: a routine cancer-staging FDG-PET-CT, an
// uncontrolled-glucose case, and a pregnancy case.

/** @type {import('./types.js').RequestRow[]} */
const sampleRequests = [
  {
    id: 'P001',
    referralDate: '2026-05-04',
    patient: 'Okafor, Amara',
    nhs: '501 234 5678',
    scanType: 'fdg-pet-ct',
    indication: 'cancer-staging',
    appropriatenessBand: 'usually-appropriate',
    prepSafetyBand: 'ok',
    radiationDoseBand: 'high',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: ['high-radiation-dose']
  },
  {
    id: 'P002',
    referralDate: '2026-05-05',
    patient: 'Bianchi, Sofia',
    nhs: '502 345 6789',
    scanType: 'fdg-pet-ct',
    indication: 'lymphoma',
    appropriatenessBand: 'usually-appropriate',
    prepSafetyBand: 'caution',
    radiationDoseBand: 'high',
    triageTier: 'urgent',
    completenessPercent: 90,
    clinician: 'Dr K Mensah',
    flags: ['uncontrolled-glucose', 'high-radiation-dose']
  },
  {
    id: 'P003',
    referralDate: '2026-05-05',
    patient: 'Novak, Petra',
    nhs: '503 456 7890',
    scanType: 'fdg-pet-ct',
    indication: 'treatment-response',
    appropriatenessBand: 'usually-appropriate',
    prepSafetyBand: 'contraindicated',
    radiationDoseBand: 'high',
    triageTier: 'routine',
    completenessPercent: 85,
    clinician: 'Dr L Romano',
    flags: ['pregnancy', 'high-radiation-dose']
  },
  {
    id: 'P004',
    referralDate: '2026-05-06',
    patient: 'Hassan, Layla',
    nhs: '504 567 8901',
    scanType: 'psma-pet',
    indication: 'suspected-recurrence',
    appropriatenessBand: 'usually-appropriate',
    prepSafetyBand: 'ok',
    radiationDoseBand: 'moderate',
    triageTier: 'urgent',
    completenessPercent: 100,
    clinician: 'Dr M Adebayo',
    flags: []
  },
  {
    id: 'P005',
    referralDate: '2026-05-06',
    patient: 'Connolly, Niamh',
    nhs: '505 678 9012',
    scanType: 'dotatate-pet',
    indication: 'cancer-staging',
    appropriatenessBand: 'usually-appropriate',
    prepSafetyBand: 'ok',
    radiationDoseBand: 'moderate',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'P006',
    referralDate: '2026-05-07',
    patient: 'Silva, Beatriz',
    nhs: '506 789 0123',
    scanType: 'fdg-pet-ct',
    indication: 'infection-inflammation',
    appropriatenessBand: 'usually-appropriate',
    prepSafetyBand: 'caution',
    radiationDoseBand: 'high',
    triageTier: 'emergency',
    completenessPercent: 90,
    clinician: 'Dr P Sharma',
    flags: ['breastfeeding', 'high-radiation-dose']
  },
  {
    id: 'P007',
    referralDate: '2026-05-07',
    patient: 'Andersson, Elin',
    nhs: '507 890 1234',
    scanType: 'amyloid-pet',
    indication: 'neurology-dementia',
    appropriatenessBand: 'usually-appropriate',
    prepSafetyBand: 'ok',
    radiationDoseBand: 'moderate',
    triageTier: 'routine',
    completenessPercent: 60,
    clinician: 'Dr R Ahmed',
    flags: ['missing-clinical-question']
  },
  {
    id: 'P008',
    referralDate: '2026-05-08',
    patient: 'Kowalski, Zofia',
    nhs: '508 901 2345',
    scanType: 'fdg-pet-ct',
    indication: 'solitary-pulmonary-nodule',
    appropriatenessBand: 'usually-appropriate',
    prepSafetyBand: 'caution',
    radiationDoseBand: 'high',
    triageTier: 'routine',
    completenessPercent: 75,
    clinician: 'Dr K Mensah',
    flags: ['missing-glucose', 'high-radiation-dose']
  },
  {
    id: 'P009',
    referralDate: '2026-05-08',
    patient: 'Müller, Hannah',
    nhs: '509 012 3456',
    scanType: 'amyloid-pet',
    indication: 'cancer-staging',
    appropriatenessBand: 'usually-not-appropriate',
    prepSafetyBand: 'ok',
    radiationDoseBand: 'moderate',
    triageTier: 'routine',
    completenessPercent: 70,
    clinician: 'Dr L Romano',
    flags: []
  },
  {
    id: 'P010',
    referralDate: '2026-05-09',
    patient: 'Tanaka, Yuki',
    nhs: '510 123 4567',
    scanType: 'cardiac-pet',
    indication: 'cardiac-viability',
    appropriatenessBand: 'usually-appropriate',
    prepSafetyBand: 'ok',
    radiationDoseBand: 'high',
    triageTier: 'urgent',
    completenessPercent: 95,
    clinician: 'Dr M Adebayo',
    flags: ['high-radiation-dose']
  }
];

export { sampleRequests };
