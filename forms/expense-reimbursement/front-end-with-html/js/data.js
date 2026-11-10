// Sample claim data for the expense reimbursement dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Ten realistic rows spanning every compliance band, approval tier and
// recommendation.

/** @type {import('./dashboard-types.js').ClaimRow[]} */
const sampleClaims = [
  {
    id: 'C001',
    claimDate: '2026-10-02',
    worker: 'Adeyemi, Funmi',
    jobTitle: 'Staff Nurse',
    department: 'Cardiology',
    claimTitle: 'Resuscitation course travel',
    total: 84.6,
    complianceBand: 'compliant',
    approvalTier: 'line-manager',
    completenessPercent: 100,
    recommendation: 'approve',
    manager: 'K Mensah',
    flags: []
  },
  {
    id: 'C002',
    claimDate: '2026-10-03',
    worker: 'Brennan, Cathal',
    jobTitle: 'Registrar',
    department: 'Emergency Medicine',
    claimTitle: 'Stethoscope replacement',
    total: 142.0,
    complianceBand: 'needs-review',
    approvalTier: 'budget-holder',
    completenessPercent: 92,
    recommendation: 'escalate',
    manager: 'L Romano',
    flags: ['no-prior-approval']
  },
  {
    id: 'C003',
    claimDate: '2026-10-05',
    worker: 'Castillo, Elena',
    jobTitle: 'Physiotherapist',
    department: 'Rehabilitation',
    claimTitle: 'Conference registration',
    total: 620.0,
    complianceBand: 'needs-review',
    approvalTier: 'finance-review',
    completenessPercent: 100,
    recommendation: 'escalate',
    manager: 'J Iqbal',
    flags: ['over-limit', 'no-prior-approval']
  },
  {
    id: 'C004',
    claimDate: '2026-10-06',
    worker: 'Dlamini, Thabo',
    jobTitle: 'Paramedic',
    department: 'Ambulance Service',
    claimTitle: 'Taxi home after late shift',
    total: 38.4,
    complianceBand: 'compliant',
    approvalTier: 'line-manager',
    completenessPercent: 100,
    recommendation: 'approve',
    manager: 'K Mensah',
    flags: []
  },
  {
    id: 'C005',
    claimDate: '2026-10-07',
    worker: 'Eriksson, Lena',
    jobTitle: 'Pharmacist',
    department: 'Pharmacy',
    claimTitle: 'Team dinner (wine)',
    total: 96.0,
    complianceBand: 'likely-ineligible',
    approvalTier: 'finance-review',
    completenessPercent: 83,
    recommendation: 'reject',
    manager: 'L Romano',
    flags: ['alcohol-or-personal', 'missing-receipt']
  },
  {
    id: 'C006',
    claimDate: '2026-10-08',
    worker: 'Fofana, Idris',
    jobTitle: 'Locum GP',
    department: 'Primary Care',
    claimTitle: 'Mileage to branch surgery',
    total: 57.15,
    complianceBand: 'needs-review',
    approvalTier: 'line-manager',
    completenessPercent: 75,
    recommendation: 'escalate',
    manager: 'J Iqbal',
    flags: []
  },
  {
    id: 'C007',
    claimDate: '2026-10-09',
    worker: 'Gallagher, Siobhan',
    jobTitle: 'Radiographer',
    department: 'Imaging',
    claimTitle: 'Professional registration fee',
    total: 120.0,
    complianceBand: 'compliant',
    approvalTier: 'budget-holder',
    completenessPercent: 100,
    recommendation: 'approve',
    manager: 'K Mensah',
    flags: []
  },
  {
    id: 'C008',
    claimDate: '2026-10-12',
    worker: 'Haddad, Karim',
    jobTitle: 'Surgeon',
    department: 'Theatre',
    claimTitle: 'Course in Zurich (CHF)',
    total: 410.25,
    complianceBand: 'needs-review',
    approvalTier: 'budget-holder',
    completenessPercent: 58,
    recommendation: 'request-more-information',
    manager: 'L Romano',
    flags: ['foreign-currency', 'missing-receipt']
  },
  {
    id: 'C009',
    claimDate: '2026-10-13',
    worker: 'Ibrahim, Aisha',
    jobTitle: 'Midwife',
    department: 'Maternity',
    claimTitle: 'Duplicate parking claim',
    total: 12.0,
    complianceBand: 'needs-review',
    approvalTier: 'finance-review',
    completenessPercent: 100,
    recommendation: 'escalate',
    manager: 'J Iqbal',
    flags: ['duplicate-suspected']
  },
  {
    id: 'C010',
    claimDate: '2026-10-14',
    worker: 'Jensen, Mads',
    jobTitle: 'Healthcare Assistant',
    department: 'Elderly Care',
    claimTitle: 'Uniform shoes',
    total: 45.0,
    complianceBand: 'compliant',
    approvalTier: 'line-manager',
    completenessPercent: 100,
    recommendation: 'approve',
    manager: 'K Mensah',
    flags: []
  }
];

export { sampleClaims };
