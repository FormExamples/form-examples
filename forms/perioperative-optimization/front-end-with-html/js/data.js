// Sample assessment data for the Perioperative Optimization dashboard.
//
// Used when the back-end is offline so the dashboard is usable standalone.
// Twelve rows spanning every readiness band and every gate decision. NHS
// numbers are placeholder values in the canonical "NNN NNN NNNN" display form;
// names are invented.
//
// The set deliberately includes the cases a reviewer should see: a fully ready
// patient; one already in progress; one with plenty of time; one short on
// anaemia lead time; one short on HbA1c; one where the clinician accepted the
// unoptimized risk for a cancer resection; and one with no surgery date at all,
// where gating cannot be applied.

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: 'PO001',
    assessmentDate: '2026-09-01',
    surgeryDate: '2026-12-08',
    weeksToSurgery: 14,
    patient: 'Whitcombe, Alan',
    nhs: '601 234 5678',
    procedure: 'Total knee replacement',
    severity: 'major',
    readiness: 'ready',
    domainsShortOnTime: [],
    actionRequired: 0,
    gateDecision: 'proceed',
    surgeon: 'Ms R Kaur',
    flagCount: 0
  },
  {
    id: 'PO002',
    assessmentDate: '2026-09-01',
    surgeryDate: '2026-11-24',
    weeksToSurgery: 12,
    patient: 'Ferrari, Giulia',
    nhs: '602 345 6789',
    procedure: 'Laparoscopic cholecystectomy',
    severity: 'intermediate',
    readiness: 'optimization-in-progress',
    domainsShortOnTime: [],
    actionRequired: 0,
    gateDecision: 'proceed-with-prehabilitation',
    surgeon: 'Mr D Okoro',
    flagCount: 1
  },
  {
    id: 'PO003',
    assessmentDate: '2026-09-02',
    surgeryDate: '2026-12-15',
    weeksToSurgery: 14,
    patient: 'Nowak, Piotr',
    nhs: '603 456 7890',
    procedure: 'Total hip replacement',
    severity: 'major',
    readiness: 'optimization-required',
    domainsShortOnTime: [],
    actionRequired: 3,
    gateDecision: 'proceed-with-prehabilitation',
    surgeon: 'Ms R Kaur',
    flagCount: 2
  },
  {
    id: 'PO004',
    assessmentDate: '2026-09-02',
    surgeryDate: '2026-09-29',
    weeksToSurgery: 3,
    patient: 'Abioye, Folake',
    nhs: '604 567 8901',
    procedure: 'Anterior resection',
    severity: 'major-plus',
    readiness: 'defer-surgery',
    domainsShortOnTime: ['anaemia', 'nutrition'],
    actionRequired: 1,
    gateDecision: 'defer-and-optimize',
    surgeon: 'Mr D Okoro',
    flagCount: 4
  },
  {
    id: 'PO005',
    assessmentDate: '2026-09-03',
    surgeryDate: '2026-10-06',
    weeksToSurgery: 4,
    patient: 'Lindgren, Erik',
    nhs: '605 678 9012',
    procedure: 'Inguinal hernia repair',
    severity: 'intermediate',
    readiness: 'defer-surgery',
    domainsShortOnTime: ['glycaemic-control'],
    actionRequired: 1,
    gateDecision: 'defer-and-optimize',
    surgeon: 'Mr S Patel',
    flagCount: 2
  },
  {
    id: 'PO006',
    assessmentDate: '2026-09-03',
    surgeryDate: '2026-09-17',
    weeksToSurgery: 2,
    patient: 'Costa, Mariana',
    nhs: '606 789 0123',
    procedure: 'Whipple procedure for pancreatic carcinoma',
    severity: 'major-plus',
    readiness: 'defer-surgery',
    domainsShortOnTime: ['anaemia', 'nutrition', 'physical-fitness'],
    actionRequired: 0,
    gateDecision: 'accept-unoptimized-risk',
    surgeon: 'Mr D Okoro',
    flagCount: 5
  },
  {
    id: 'PO007',
    assessmentDate: '2026-09-04',
    surgeryDate: '',
    weeksToSurgery: null,
    patient: 'Ivanova, Daria',
    nhs: '607 890 1234',
    procedure: 'Awaiting date — shoulder arthroplasty',
    severity: 'major',
    readiness: 'optimization-required',
    domainsShortOnTime: [],
    actionRequired: 2,
    gateDecision: '',
    surgeon: 'Ms R Kaur',
    flagCount: 1
  },
  {
    id: 'PO008',
    assessmentDate: '2026-09-07',
    surgeryDate: '2027-01-12',
    weeksToSurgery: 18,
    patient: 'Bergström, Nils',
    nhs: '608 901 2345',
    procedure: 'Radical prostatectomy',
    severity: 'major',
    readiness: 'optimization-required',
    domainsShortOnTime: [],
    actionRequired: 2,
    gateDecision: 'proceed-with-prehabilitation',
    surgeon: 'Mr S Patel',
    flagCount: 1
  },
  {
    id: 'PO009',
    assessmentDate: '2026-09-08',
    surgeryDate: '2026-10-13',
    weeksToSurgery: 5,
    patient: 'Rahman, Nadia',
    nhs: '609 012 3456',
    procedure: 'Hysterectomy',
    severity: 'major',
    readiness: 'defer-surgery',
    domainsShortOnTime: ['anaemia'],
    actionRequired: 1,
    gateDecision: 'mdt-review',
    surgeon: 'Ms L Chen',
    flagCount: 3
  },
  {
    id: 'PO010',
    assessmentDate: '2026-09-09',
    surgeryDate: '2026-12-01',
    weeksToSurgery: 12,
    patient: 'Dubois, Henri',
    nhs: '610 123 4567',
    procedure: 'Coronary artery bypass graft',
    severity: 'major-plus',
    readiness: 'optimization-in-progress',
    domainsShortOnTime: [],
    actionRequired: 0,
    gateDecision: 'proceed-with-prehabilitation',
    surgeon: 'Mr A Varga',
    flagCount: 2
  },
  {
    id: 'PO011',
    assessmentDate: '2026-09-10',
    surgeryDate: '2026-09-24',
    weeksToSurgery: 2,
    patient: 'Tanaka, Hiroshi',
    nhs: '611 234 5678',
    procedure: 'Cataract extraction',
    severity: 'minor',
    readiness: 'ready',
    domainsShortOnTime: [],
    actionRequired: 0,
    gateDecision: 'proceed',
    surgeon: 'Ms L Chen',
    flagCount: 0
  },
  {
    id: 'PO012',
    assessmentDate: '2026-09-11',
    surgeryDate: '2026-10-01',
    weeksToSurgery: 2,
    patient: 'Mensah, Kwabena',
    nhs: '612 345 6789',
    procedure: 'Emergency-listed laparotomy',
    severity: 'major-plus',
    readiness: 'defer-surgery',
    domainsShortOnTime: ['smoking', 'physical-fitness', 'medication'],
    actionRequired: 0,
    gateDecision: 'accept-unoptimized-risk',
    surgeon: 'Mr D Okoro',
    flagCount: 6
  }
];

export { sampleAssessments };
