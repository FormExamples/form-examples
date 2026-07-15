// Sample patient data for the Research and Planning Privacy Notice
// compliance dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` (forthcoming) so the
// two implementations show identical demo content when the backend is
// offline. Twelve realistic rows: spans every aggregated opt-in status
// (Opted In, Type 1 Opt-Out, National Opt-Out, Both Opt-Outs, Not
// Recorded), every UK GDPR Art.6 lawful basis (Public Task, Consent, Vital
// Interests), and a mix of complete / incomplete validator states.

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '485 777 3456',
    patientName: 'Ahmed, Yusuf',
    organisationName: 'Riverside Medical Centre',
    optInStatus: 'Opted In',
    type1OptOut: false,
    nationalDataOptOut: false,
    lawfulBasis: 'Public Task',
    completionStatus: 'Complete',
    acknowledgementDate: '2026-04-12'
  },
  {
    id: '2',
    nhsNumber: '623 091 8742',
    patientName: 'Bennett, Olivia',
    organisationName: 'Northgate Community Hospital',
    optInStatus: 'Type 1 Opt-Out',
    type1OptOut: true,
    nationalDataOptOut: false,
    lawfulBasis: 'Public Task',
    completionStatus: 'Complete',
    acknowledgementDate: '2026-03-28'
  },
  {
    id: '3',
    nhsNumber: '901 246 5318',
    patientName: 'Chowdhury, Rina',
    organisationName: 'Riverside Medical Centre',
    optInStatus: 'National Opt-Out',
    type1OptOut: false,
    nationalDataOptOut: true,
    lawfulBasis: 'Public Task',
    completionStatus: 'Complete',
    acknowledgementDate: '2026-02-09'
  },
  {
    id: '4',
    nhsNumber: '154 332 0098',
    patientName: 'Davies, Owen',
    organisationName: 'Llanfair Health Board',
    optInStatus: 'Both Opt-Outs',
    type1OptOut: true,
    nationalDataOptOut: true,
    lawfulBasis: 'Public Task',
    completionStatus: 'Complete',
    acknowledgementDate: '2025-11-17'
  },
  {
    id: '5',
    nhsNumber: '337 818 2244',
    patientName: 'Ellis, Margaret',
    organisationName: 'Northgate Community Hospital',
    optInStatus: 'Opted In',
    type1OptOut: false,
    nationalDataOptOut: false,
    lawfulBasis: 'Consent',
    completionStatus: 'Complete',
    acknowledgementDate: '2026-04-02'
  },
  {
    id: '6',
    nhsNumber: '472 661 5503',
    patientName: 'Fitzgerald, Sean',
    organisationName: 'St. Cuthbert\u2019s Foundation Trust',
    optInStatus: 'Not Recorded',
    type1OptOut: false,
    nationalDataOptOut: false,
    lawfulBasis: 'Public Task',
    completionStatus: 'Incomplete',
    acknowledgementDate: ''
  },
  {
    id: '7',
    nhsNumber: '589 200 7716',
    patientName: 'Gallagher, Aoife',
    organisationName: 'Riverside Medical Centre',
    optInStatus: 'Opted In',
    type1OptOut: false,
    nationalDataOptOut: false,
    lawfulBasis: 'Vital Interests',
    completionStatus: 'Complete',
    acknowledgementDate: '2026-01-23'
  },
  {
    id: '8',
    nhsNumber: '690 415 2830',
    patientName: 'Hassan, Layla',
    organisationName: 'Eastside Primary Care Network',
    optInStatus: 'Type 1 Opt-Out',
    type1OptOut: true,
    nationalDataOptOut: false,
    lawfulBasis: 'Consent',
    completionStatus: 'Complete',
    acknowledgementDate: '2026-03-05'
  },
  {
    id: '9',
    nhsNumber: '741 092 6628',
    patientName: 'Iversen, Lukas',
    organisationName: 'St. Cuthbert\u2019s Foundation Trust',
    optInStatus: 'National Opt-Out',
    type1OptOut: false,
    nationalDataOptOut: true,
    lawfulBasis: 'Public Task',
    completionStatus: 'Incomplete',
    acknowledgementDate: '2025-09-14'
  },
  {
    id: '10',
    nhsNumber: '813 557 4407',
    patientName: 'Johnson, Marcus',
    organisationName: 'Northgate Community Hospital',
    optInStatus: 'Opted In',
    type1OptOut: false,
    nationalDataOptOut: false,
    lawfulBasis: 'Public Task',
    completionStatus: 'Complete',
    acknowledgementDate: '2026-04-21'
  },
  {
    id: '11',
    nhsNumber: '922 300 1185',
    patientName: 'Kowalski, Beata',
    organisationName: 'Eastside Primary Care Network',
    optInStatus: 'Not Recorded',
    type1OptOut: false,
    nationalDataOptOut: false,
    lawfulBasis: 'Public Task',
    completionStatus: 'Incomplete',
    acknowledgementDate: ''
  },
  {
    id: '12',
    nhsNumber: '108 644 9921',
    patientName: 'Llewellyn, Bronwen',
    organisationName: 'Llanfair Health Board',
    optInStatus: 'Both Opt-Outs',
    type1OptOut: true,
    nationalDataOptOut: true,
    lawfulBasis: 'Consent',
    completionStatus: 'Complete',
    acknowledgementDate: '2025-12-30'
  }
];

export { samplePatients };
