// Sample candidate data for the training coordinator dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans Pass / Needs Development / Fail outcomes,
// every venue type (pool, beach, leisure centre, water park, lido, hotel
// pool), and every certification-currency band; critical-competency
// failures are flagged on the candidates who failed because of them. RLSS
// NPLQ standard certification validity is two years, so issued + expiry
// dates are spaced accordingly. Annual CPR refresher dates are tracked
// separately on each row.
//
// Reference "today" for the seed data is 2026-05-04. Some expiry dates
// fall before that (Expired), some within ~60 days (Expiring Soon), most
// well after it (Current). The sample is static so the page is
// deterministic, but `app.js` recomputes the currency band from the
// expiry date at render time, so the dataset stays sensible if "today"
// drifts.

/** @type {import('./types.js').CandidateRow[]} */
const sampleCandidates = [
  {
    id: '1',
    candidateId: 'NPLQ-2025-0042',
    candidateName: 'Ahmed, Yusuf',
    venueType: 'Pool',
    venueName: 'Glasgow Club Tollcross',
    outcome: 'Pass',
    criticalCompetencyFailure: false,
    timedSwimSeconds: 88,
    competenciesPassed: 10,
    competenciesTotal: 10,
    certificationIssued: '2025-08-12',
    certificationExpiry: '2027-08-12',
    certificationCurrency: 'Current',
    cprRefresherDue: '2026-08-12',
    examinerName: 'Bennett, Claire'
  },
  {
    id: '2',
    candidateId: 'NPLQ-2025-0061',
    candidateName: 'Okafor, Chiamaka',
    venueType: 'Beach',
    venueName: 'Bournemouth Pier Approach',
    outcome: 'Pass',
    criticalCompetencyFailure: false,
    timedSwimSeconds: 81,
    competenciesPassed: 10,
    competenciesTotal: 10,
    certificationIssued: '2024-11-03',
    certificationExpiry: '2026-11-03',
    certificationCurrency: 'Current',
    cprRefresherDue: '2026-11-03',
    examinerName: 'Williams, Mark'
  },
  {
    id: '3',
    candidateId: 'NPLQ-2026-0008',
    candidateName: 'Patel, Rohan',
    venueType: 'Leisure Centre',
    venueName: 'Better \u2014 Stratford Leisure Centre',
    outcome: 'Fail',
    criticalCompetencyFailure: true,
    timedSwimSeconds: 118,
    competenciesPassed: 5,
    competenciesTotal: 10,
    certificationIssued: '',
    certificationExpiry: '',
    certificationCurrency: 'Expired',
    cprRefresherDue: '',
    examinerName: 'Bennett, Claire'
  },
  {
    id: '4',
    candidateId: 'NPLQ-2024-0117',
    candidateName: 'Jenkins, Sophie',
    venueType: 'Water Park',
    venueName: 'Alton Towers Waterpark',
    outcome: 'Pass',
    criticalCompetencyFailure: false,
    timedSwimSeconds: 92,
    competenciesPassed: 10,
    competenciesTotal: 10,
    certificationIssued: '2024-05-22',
    certificationExpiry: '2026-05-22',
    certificationCurrency: 'Expiring Soon',
    cprRefresherDue: '2026-05-22',
    examinerName: 'Khan, Adil'
  },
  {
    id: '5',
    candidateId: 'NPLQ-2026-0014',
    candidateName: 'Brown, Marcus',
    venueType: 'Pool',
    venueName: 'Aberdeen Sports Village Aquatics Centre',
    outcome: 'Needs Development',
    criticalCompetencyFailure: false,
    timedSwimSeconds: 104,
    competenciesPassed: 8,
    competenciesTotal: 10,
    certificationIssued: '',
    certificationExpiry: '',
    certificationCurrency: 'Expired',
    cprRefresherDue: '',
    examinerName: 'O\u2019Connor, Niamh'
  },
  {
    id: '6',
    candidateId: 'NPLQ-2025-0099',
    candidateName: 'Hughes, Eleri',
    venueType: 'Lido',
    venueName: 'Brockwell Lido',
    outcome: 'Pass',
    criticalCompetencyFailure: false,
    timedSwimSeconds: 85,
    competenciesPassed: 10,
    competenciesTotal: 10,
    certificationIssued: '2025-02-18',
    certificationExpiry: '2027-02-18',
    certificationCurrency: 'Current',
    cprRefresherDue: '2026-02-18',
    examinerName: 'Williams, Mark'
  },
  {
    id: '7',
    candidateId: 'NPLQ-2026-0021',
    candidateName: 'MacLeod, Iain',
    venueType: 'Beach',
    venueName: 'Tynemouth Longsands',
    outcome: 'Fail',
    criticalCompetencyFailure: true,
    timedSwimSeconds: 132,
    competenciesPassed: 4,
    competenciesTotal: 10,
    certificationIssued: '',
    certificationExpiry: '',
    certificationCurrency: 'Expired',
    cprRefresherDue: '',
    examinerName: 'Bennett, Claire'
  },
  {
    id: '8',
    candidateId: 'NPLQ-2024-0203',
    candidateName: 'Singh, Harpreet',
    venueType: 'Hotel Pool',
    venueName: 'Celtic Manor Resort \u2014 Forum Spa',
    outcome: 'Pass',
    criticalCompetencyFailure: false,
    timedSwimSeconds: 94,
    competenciesPassed: 10,
    competenciesTotal: 10,
    certificationIssued: '2024-04-09',
    certificationExpiry: '2026-04-09',
    certificationCurrency: 'Expired',
    cprRefresherDue: '2025-04-09',
    examinerName: 'Khan, Adil'
  },
  {
    id: '9',
    candidateId: 'NPLQ-2025-0144',
    candidateName: 'Rossi, Giulia',
    venueType: 'Leisure Centre',
    venueName: 'Everyone Active \u2014 Mile End Park',
    outcome: 'Pass',
    criticalCompetencyFailure: false,
    timedSwimSeconds: 89,
    competenciesPassed: 10,
    competenciesTotal: 10,
    certificationIssued: '2025-12-01',
    certificationExpiry: '2027-12-01',
    certificationCurrency: 'Current',
    cprRefresherDue: '2026-12-01',
    examinerName: 'O\u2019Connor, Niamh'
  },
  {
    id: '10',
    candidateId: 'NPLQ-2024-0187',
    candidateName: 'Whitfield, Thomas',
    venueType: 'Water Park',
    venueName: 'Splash Landings \u2014 Drayton Manor',
    outcome: 'Needs Development',
    criticalCompetencyFailure: false,
    timedSwimSeconds: 99,
    competenciesPassed: 9,
    competenciesTotal: 10,
    certificationIssued: '2024-06-15',
    certificationExpiry: '2026-06-15',
    certificationCurrency: 'Expiring Soon',
    cprRefresherDue: '2025-06-15',
    examinerName: 'Khan, Adil'
  },
  {
    id: '11',
    candidateId: 'NPLQ-2026-0030',
    candidateName: 'Nguyen, Linh',
    venueType: 'Lido',
    venueName: 'Tooting Bec Lido',
    outcome: 'Pass',
    criticalCompetencyFailure: false,
    timedSwimSeconds: 86,
    competenciesPassed: 10,
    competenciesTotal: 10,
    certificationIssued: '2026-01-27',
    certificationExpiry: '2028-01-27',
    certificationCurrency: 'Current',
    cprRefresherDue: '2027-01-27',
    examinerName: 'Williams, Mark'
  },
  {
    id: '12',
    candidateId: 'NPLQ-2026-0035',
    candidateName: 'Kowalski, Aleksander',
    venueType: 'Hotel Pool',
    venueName: 'Gleneagles Hotel \u2014 Resort Pool',
    outcome: 'Fail',
    criticalCompetencyFailure: true,
    timedSwimSeconds: 124,
    competenciesPassed: 6,
    competenciesTotal: 10,
    certificationIssued: '',
    certificationExpiry: '',
    certificationCurrency: 'Expired',
    cprRefresherDue: '',
    examinerName: 'O\u2019Connor, Niamh'
  }
];

export { sampleCandidates };
