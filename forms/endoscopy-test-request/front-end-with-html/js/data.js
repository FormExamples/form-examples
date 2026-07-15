// Sample request data for the GI endoscopy vetting dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Ten realistic rows spanning every triage tier (routine / urgent /
// two-week-wait / emergency), every appropriateness band, and every
// pre-procedure risk band. NHS numbers are placeholder values in the
// canonical "NNN NNN NNNN" display form. Includes the three required worked
// cases: a routine surveillance request, a two-week-wait suspected-cancer
// case, and a high-bleeding-risk anticoagulant case.

/** @type {import('./types.js').RequestRow[]} */
const sampleRequests = [
  {
    id: 'E001',
    referralDate: '2026-05-04',
    patient: 'Okafor, Amara',
    nhs: '401 234 5678',
    procedure: 'colonoscopy',
    indication: 'polyp-surveillance',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'routine',
    twoWeekWaitEligible: false,
    riskBand: 'low',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'E002',
    referralDate: '2026-05-05',
    patient: 'Bianchi, Sofia',
    nhs: '402 345 6789',
    procedure: 'ogd',
    indication: 'dysphagia',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'two-week-wait',
    twoWeekWaitEligible: true,
    riskBand: 'low',
    completenessPercent: 95,
    clinician: 'Dr K Mensah',
    flags: ['suspected-cancer-2ww']
  },
  {
    id: 'E003',
    referralDate: '2026-05-05',
    patient: 'Novak, Petra',
    nhs: '403 456 7890',
    procedure: 'colonoscopy',
    indication: 'positive-fit',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'two-week-wait',
    twoWeekWaitEligible: true,
    riskBand: 'low',
    completenessPercent: 90,
    clinician: 'Dr L Romano',
    flags: ['suspected-cancer-2ww']
  },
  {
    id: 'E004',
    referralDate: '2026-05-06',
    patient: 'Hassan, Layla',
    nhs: '404 567 8901',
    procedure: 'ercp',
    indication: 'abnormal-imaging',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'urgent',
    twoWeekWaitEligible: false,
    riskBand: 'high',
    completenessPercent: 90,
    clinician: 'Dr M Adebayo',
    flags: ['high-bleeding-risk-anticoag']
  },
  {
    id: 'E005',
    referralDate: '2026-05-06',
    patient: 'Connolly, Niamh',
    nhs: '405 678 9012',
    procedure: 'ogd',
    indication: 'barretts-surveillance',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'routine',
    twoWeekWaitEligible: false,
    riskBand: 'low',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'E006',
    referralDate: '2026-05-07',
    patient: 'Silva, Beatriz',
    nhs: '406 789 0123',
    procedure: 'ogd',
    indication: 'upper-gi-bleeding',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'emergency',
    twoWeekWaitEligible: false,
    riskBand: 'high',
    completenessPercent: 85,
    clinician: 'Dr P Sharma',
    flags: ['acute-gi-bleed', 'high-bleeding-risk-anticoag']
  },
  {
    id: 'E007',
    referralDate: '2026-05-07',
    patient: 'Andersson, Elin',
    nhs: '407 890 1234',
    procedure: 'flexible-sigmoidoscopy',
    indication: 'rectal-bleeding',
    appropriatenessBand: 'may-be-appropriate',
    triageTier: 'routine',
    twoWeekWaitEligible: false,
    riskBand: 'low',
    completenessPercent: 55,
    clinician: 'Dr R Ahmed',
    flags: ['missing-clinical-question', 'missing-fit']
  },
  {
    id: 'E008',
    referralDate: '2026-05-08',
    patient: 'Kowalski, Zofia',
    nhs: '408 901 2345',
    procedure: 'eus',
    indication: 'suspected-malignancy',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'two-week-wait',
    twoWeekWaitEligible: true,
    riskBand: 'moderate',
    completenessPercent: 88,
    clinician: 'Dr K Mensah',
    flags: ['suspected-cancer-2ww', 'asa-iv']
  },
  {
    id: 'E009',
    referralDate: '2026-05-08',
    patient: 'Müller, Hannah',
    nhs: '409 012 3456',
    procedure: 'eus',
    indication: 'dyspepsia',
    appropriatenessBand: 'usually-not-appropriate',
    triageTier: 'routine',
    twoWeekWaitEligible: false,
    riskBand: 'moderate',
    completenessPercent: 70,
    clinician: 'Dr L Romano',
    flags: []
  },
  {
    id: 'E010',
    referralDate: '2026-05-09',
    patient: 'Tanaka, Yuki',
    nhs: '410 123 4567',
    procedure: 'colonoscopy',
    indication: 'change-in-bowel-habit',
    appropriatenessBand: 'usually-appropriate',
    triageTier: 'urgent',
    twoWeekWaitEligible: false,
    riskBand: 'moderate',
    completenessPercent: 80,
    clinician: 'Dr M Adebayo',
    flags: ['unfit-for-prep']
  }
];

export { sampleRequests };
