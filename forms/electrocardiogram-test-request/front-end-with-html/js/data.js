// Sample request data for the electrocardiogram (ECG) vetting dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Ten realistic rows spanning every triage tier (routine / urgent / emergency),
// every appropriateness band, and every clinical-priority band. NHS numbers are
// placeholder values in the canonical "NNN NNN NNNN" display form. Includes the
// required worked cases: a routine resting 12-lead ECG, an emergency suspected-
// ACS case with active chest pain, and a syncope red-flag case.

/** @type {import('./types.js').RequestRow[]} */
const sampleRequests = [
  {
    id: 'E001',
    referralDate: '2026-05-04',
    patient: 'Okafor, Amara',
    nhs: '401 234 5678',
    ecgType: 'resting-12-lead',
    indication: 'pre-operative',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'routine',
    completenessPercent: 100,
    priorityBand: 'low',
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'E002',
    referralDate: '2026-05-05',
    patient: 'Bianchi, Sofia',
    nhs: '402 345 6789',
    ecgType: 'resting-12-lead',
    indication: 'suspected-mi-acs',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'emergency',
    completenessPercent: 95,
    priorityBand: 'high',
    clinician: 'Dr K Mensah',
    flags: ['suspected-acs', 'active-chest-pain']
  },
  {
    id: 'E003',
    referralDate: '2026-05-05',
    patient: 'Novak, Petra',
    nhs: '403 456 7890',
    ecgType: 'resting-12-lead',
    indication: 'syncope',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'urgent',
    completenessPercent: 90,
    priorityBand: 'moderate',
    clinician: 'Dr L Romano',
    flags: ['syncope-red-flag']
  },
  {
    id: 'E004',
    referralDate: '2026-05-06',
    patient: 'Hassan, Layla',
    nhs: '404 567 8901',
    ecgType: 'ambulatory-holter-24h',
    indication: 'palpitations',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'routine',
    completenessPercent: 100,
    priorityBand: 'low',
    clinician: 'Dr M Adebayo',
    flags: []
  },
  {
    id: 'E005',
    referralDate: '2026-05-06',
    patient: 'Connolly, Niamh',
    nhs: '405 678 9012',
    ecgType: 'event-recorder',
    indication: 'suspected-arrhythmia',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'urgent',
    completenessPercent: 85,
    priorityBand: 'moderate',
    clinician: 'Dr H Iqbal',
    flags: ['suspected-vt']
  },
  {
    id: 'E006',
    referralDate: '2026-05-07',
    patient: 'Silva, Beatriz',
    nhs: '406 789 0123',
    ecgType: 'resting-12-lead',
    indication: 'chest-pain',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'emergency',
    completenessPercent: 90,
    priorityBand: 'high',
    clinician: 'Dr P Sharma',
    flags: ['active-chest-pain']
  },
  {
    id: 'E007',
    referralDate: '2026-05-07',
    patient: 'Andersson, Elin',
    nhs: '407 890 1234',
    ecgType: 'exercise-stress',
    indication: 'follow-up',
    appropriatenessBand: 'may-be-appropriate',
    triageTier: 'routine',
    completenessPercent: 60,
    priorityBand: 'low',
    clinician: 'Dr R Ahmed',
    flags: ['missing-clinical-question']
  },
  {
    id: 'E008',
    referralDate: '2026-05-08',
    patient: 'Kowalski, Zofia',
    nhs: '408 901 2345',
    ecgType: 'resting-12-lead',
    indication: 'medication-monitoring-qt',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'routine',
    completenessPercent: 95,
    priorityBand: 'low',
    clinician: 'Dr K Mensah',
    flags: []
  },
  {
    id: 'E009',
    referralDate: '2026-05-08',
    patient: 'Müller, Hannah',
    nhs: '409 012 3456',
    ecgType: 'ambulatory-48h',
    indication: 'hypertension',
    appropriatenessBand: 'usually-not-appropriate',
    triageTier: 'routine',
    completenessPercent: 70,
    priorityBand: 'moderate',
    clinician: 'Dr L Romano',
    flags: []
  },
  {
    id: 'E010',
    referralDate: '2026-05-09',
    patient: 'Tanaka, Yuki',
    nhs: '410 123 4567',
    ecgType: 'resting-12-lead',
    indication: 'palpitations',
    appropriatenessBand: 'may-be-appropriate',
    triageTier: 'urgent',
    completenessPercent: 80,
    priorityBand: 'moderate',
    clinician: 'Dr M Adebayo',
    flags: []
  }
];

export { sampleRequests };
