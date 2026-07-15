// Sample request data for the bronchoscopy vetting dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Ten realistic rows spanning every urgency tier (routine / urgent /
// two-week-wait / emergency), every appropriateness band, and every
// pre-procedure risk band. NHS numbers are placeholder values in the
// canonical "NNN NNN NNNN" display form. Includes the required worked cases:
// a routine suspected-lung-cancer two-week-wait request, an emergency
// massive-haemoptysis case, a high-bleeding-risk anticoagulant case, and a
// hypoxia case.

/** @type {import('./types.js').RequestRow[]} */
const sampleRequests = [
  {
    id: 'B001',
    referralDate: '2026-05-04',
    patient: 'Okafor, Amara',
    nhs: '401 234 5678',
    procedure: 'ebus',
    indication: 'suspected-lung-cancer',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'two-week-wait',
    twoWeekWaitEligible: true,
    riskBand: 'low',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: ['suspected-cancer-2ww']
  },
  {
    id: 'B002',
    referralDate: '2026-05-05',
    patient: 'Bianchi, Sofia',
    nhs: '402 345 6789',
    procedure: 'flexible-bronchoscopy',
    indication: 'haemoptysis',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'emergency',
    twoWeekWaitEligible: true,
    riskBand: 'moderate',
    completenessPercent: 95,
    clinician: 'Dr K Mensah',
    flags: ['massive-haemoptysis-emergency', 'suspected-cancer-2ww']
  },
  {
    id: 'B003',
    referralDate: '2026-05-05',
    patient: 'Novak, Petra',
    nhs: '403 456 7890',
    procedure: 'flexible-bronchoscopy',
    indication: 'lung-mass-on-imaging',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'two-week-wait',
    twoWeekWaitEligible: true,
    riskBand: 'high',
    completenessPercent: 90,
    clinician: 'Dr L Romano',
    flags: ['suspected-cancer-2ww', 'high-bleeding-risk-anticoag']
  },
  {
    id: 'B004',
    referralDate: '2026-05-06',
    patient: 'Hassan, Layla',
    nhs: '404 567 8901',
    procedure: 'flexible-bronchoscopy',
    indication: 'persistent-cough',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'routine',
    twoWeekWaitEligible: false,
    riskBand: 'high',
    completenessPercent: 85,
    clinician: 'Dr M Adebayo',
    flags: ['hypoxia']
  },
  {
    id: 'B005',
    referralDate: '2026-05-06',
    patient: 'Connolly, Niamh',
    nhs: '405 678 9012',
    procedure: 'ebus',
    indication: 'mediastinal-lymphadenopathy',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'routine',
    twoWeekWaitEligible: false,
    riskBand: 'low',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'B006',
    referralDate: '2026-05-07',
    patient: 'Silva, Beatriz',
    nhs: '406 789 0123',
    procedure: 'rigid-bronchoscopy',
    indication: 'foreign-body',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'urgent',
    twoWeekWaitEligible: false,
    riskBand: 'moderate',
    completenessPercent: 90,
    clinician: 'Dr P Sharma',
    flags: ['asa-iv']
  },
  {
    id: 'B007',
    referralDate: '2026-05-07',
    patient: 'Andersson, Elin',
    nhs: '407 890 1234',
    procedure: 'bronchoalveolar-lavage',
    indication: 'infection-sampling',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'routine',
    twoWeekWaitEligible: false,
    riskBand: 'low',
    completenessPercent: 60,
    clinician: 'Dr R Ahmed',
    flags: ['missing-clinical-question']
  },
  {
    id: 'B008',
    referralDate: '2026-05-08',
    patient: 'Kowalski, Zofia',
    nhs: '408 901 2345',
    procedure: 'flexible-bronchoscopy',
    indication: 'stridor',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'emergency',
    twoWeekWaitEligible: false,
    riskBand: 'moderate',
    completenessPercent: 80,
    clinician: 'Dr K Mensah',
    flags: ['hypoxia']
  },
  {
    id: 'B009',
    referralDate: '2026-05-08',
    patient: 'Müller, Hannah',
    nhs: '409 012 3456',
    procedure: 'rigid-bronchoscopy',
    indication: 'persistent-cough',
    appropriatenessBand: 'usually-not-appropriate',
    triageTier: 'routine',
    twoWeekWaitEligible: false,
    riskBand: 'low',
    completenessPercent: 70,
    clinician: 'Dr L Romano',
    flags: ['missing-indication']
  },
  {
    id: 'B010',
    referralDate: '2026-05-09',
    patient: 'Tanaka, Yuki',
    nhs: '410 123 4567',
    procedure: 'ebus',
    indication: 'suspected-lung-cancer',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'two-week-wait',
    twoWeekWaitEligible: true,
    riskBand: 'moderate',
    completenessPercent: 95,
    clinician: 'Dr M Adebayo',
    flags: ['suspected-cancer-2ww']
  }
];

export { sampleRequests };
