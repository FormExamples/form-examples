// Sample assessment data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data/sample.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every ASA grade I–V, every composite-risk
// band (low / moderate / high / critical), every urgency category, and a
// representative spread of safety flags. NHS numbers are placeholder values
// in the canonical "NNN NNN NNNN" display form.

/** @type {import('./types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: 'A001',
    date: '2026-04-20',
    patient: 'Smith, Alice',
    nhs: '123 456 7890',
    procedure: 'Right hip arthroplasty',
    urgency: 'elective',
    asa: 'III',
    composite: 'high',
    rcri: 2,
    stopbang: 4,
    cfs: 5,
    flags: ['difficult-airway', 'severe-cardiac'],
    clinician: 'Dr B Adams'
  },
  {
    id: 'A002',
    date: '2026-04-20',
    patient: 'Jones, Bob',
    nhs: '234 567 8901',
    procedure: 'Laparoscopic cholecystectomy',
    urgency: 'elective',
    asa: 'II',
    composite: 'moderate',
    rcri: 0,
    stopbang: 3,
    cfs: 3,
    flags: [],
    clinician: 'Dr C Patel'
  },
  {
    id: 'A003',
    date: '2026-04-21',
    patient: 'Lee, Carol',
    nhs: '345 678 9012',
    procedure: 'Dynamic hip screw',
    urgency: 'emergency',
    asa: 'IV',
    composite: 'critical',
    rcri: 3,
    stopbang: 5,
    cfs: 7,
    flags: ['severe-frailty', 'severe-cardiac', 'fasting-violation'],
    clinician: 'Dr D Williams'
  },
  {
    id: 'A004',
    date: '2026-04-21',
    patient: 'Brown, David',
    nhs: '456 789 0123',
    procedure: 'Inguinal hernia repair',
    urgency: 'elective',
    asa: 'I',
    composite: 'low',
    rcri: 0,
    stopbang: 1,
    cfs: null,
    flags: [],
    clinician: 'Dr E Khan'
  },
  {
    id: 'A005',
    date: '2026-04-22',
    patient: 'Patel, Eshan',
    nhs: '567 890 1234',
    procedure: 'Total knee replacement',
    urgency: 'elective',
    asa: 'II',
    composite: 'moderate',
    rcri: 1,
    stopbang: 4,
    cfs: 4,
    flags: ['recent-covid'],
    clinician: 'Dr F O\u2019Connor'
  },
  {
    id: 'A006',
    date: '2026-04-22',
    patient: 'Murphy, Fiona',
    nhs: '678 901 2345',
    procedure: 'Ruptured AAA repair',
    urgency: 'immediate',
    asa: 'V',
    composite: 'critical',
    rcri: 4,
    stopbang: 6,
    cfs: 6,
    flags: ['severe-cardiac', 'bleeding-risk', 'severe-respiratory'],
    clinician: 'Dr G Hassan'
  },
  {
    id: 'A007',
    date: '2026-04-23',
    patient: 'Nguyen, Grace',
    nhs: '789 012 3456',
    procedure: 'Cataract extraction (right)',
    urgency: 'elective',
    asa: 'I',
    composite: 'low',
    rcri: 0,
    stopbang: 0,
    cfs: 2,
    flags: [],
    clinician: 'Dr H Ito'
  },
  {
    id: 'A008',
    date: '2026-04-23',
    patient: 'Rossi, Henry',
    nhs: '890 123 4567',
    procedure: 'Coronary artery bypass graft',
    urgency: 'urgent',
    asa: 'IV',
    composite: 'high',
    rcri: 3,
    stopbang: 6,
    cfs: 5,
    flags: ['severe-cardiac', 'difficult-airway'],
    clinician: 'Dr I Johansson'
  },
  {
    id: 'A009',
    date: '2026-04-24',
    patient: 'Okafor, Isabel',
    nhs: '901 234 5678',
    procedure: 'Diagnostic laparoscopy',
    urgency: 'urgent',
    asa: 'II',
    composite: 'moderate',
    rcri: 0,
    stopbang: 2,
    cfs: 3,
    flags: [],
    clinician: 'Dr J Kowalski'
  },
  {
    id: 'A010',
    date: '2026-04-24',
    patient: 'Khan, Jamal',
    nhs: '012 345 6789',
    procedure: 'Lumbar spinal decompression',
    urgency: 'elective',
    asa: 'III',
    composite: 'high',
    rcri: 2,
    stopbang: 5,
    cfs: 4,
    flags: ['bleeding-risk'],
    clinician: 'Dr K Lopez'
  },
  {
    id: 'A011',
    date: '2026-04-25',
    patient: 'Wilson, Kathleen',
    nhs: '135 791 2468',
    procedure: 'Hemicolectomy for malignancy',
    urgency: 'urgent',
    asa: 'III',
    composite: 'high',
    rcri: 2,
    stopbang: 3,
    cfs: 6,
    flags: ['severe-frailty'],
    clinician: 'Dr L Martinez'
  },
  {
    id: 'A012',
    date: '2026-04-25',
    patient: 'Davies, Liam',
    nhs: '246 802 1357',
    procedure: 'Tonsillectomy',
    urgency: 'elective',
    asa: 'I',
    composite: 'low',
    rcri: 0,
    stopbang: 1,
    cfs: null,
    flags: [],
    clinician: 'Dr M Nakamura'
  }
];

export { sampleAssessments };
