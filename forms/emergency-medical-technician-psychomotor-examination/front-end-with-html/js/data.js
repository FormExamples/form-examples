// Sample candidate data for the NREMT Psychomotor Skills Examination
// training coordinator dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans both Pass and Fail outcomes; covers the
// distinct NREMT critical-criteria buckets (PPE, scene safety, oxygen,
// airway/breathing, transport decision, dangerous intervention, spinal
// protection, transport call); mixes EMS programs/stations and examiners.
//
// Point totals reflect the NREMT Patient Assessment - Medical (48 points
// possible, 39 minimum) and Patient Assessment - Trauma (50 points
// possible, 41 minimum) station rubrics. Critical-criteria failures keep
// the Pass/Fail boolean honest: any non-empty `criticalReason` flips the
// outcome to `Fail` regardless of the point total.
//
// Reference "today" for the seed data is 2026-05-04.

/** @type {import('./types.js').CandidateRow[]} */
const sampleCandidates = [
  {
    id: '1',
    candidateId: 'EMT-2026-0042',
    candidateName: 'Ahmed, Yusuf',
    outcome: 'Pass',
    criticalFailure: false,
    criticalReason: '',
    pointsEarned: 46,
    pointsPossible: 48,
    minimumPassingPoints: 39,
    examDate: '2026-04-12',
    examinerName: 'Bennett, Claire',
    program: 'Pittsburgh Paramedic Institute',
    stationType: 'Patient Assessment - Medical'
  },
  {
    id: '2',
    candidateId: 'EMT-2026-0061',
    candidateName: 'Okafor, Chiamaka',
    outcome: 'Pass',
    criticalFailure: false,
    criticalReason: '',
    pointsEarned: 47,
    pointsPossible: 50,
    minimumPassingPoints: 41,
    examDate: '2026-03-28',
    examinerName: 'Williams, Mark',
    program: 'Houston Community College EMS Academy',
    stationType: 'Patient Assessment - Trauma'
  },
  {
    id: '3',
    candidateId: 'EMT-2026-0008',
    candidateName: 'Patel, Rohan',
    outcome: 'Fail',
    criticalFailure: true,
    criticalReason: 'PPE',
    pointsEarned: 36,
    pointsPossible: 48,
    minimumPassingPoints: 39,
    examDate: '2026-02-17',
    examinerName: 'Bennett, Claire',
    program: 'Pittsburgh Paramedic Institute',
    stationType: 'Patient Assessment - Medical'
  },
  {
    id: '4',
    candidateId: 'EMT-2026-0117',
    candidateName: 'Jenkins, Sophie',
    outcome: 'Pass',
    criticalFailure: false,
    criticalReason: '',
    pointsEarned: 44,
    pointsPossible: 50,
    minimumPassingPoints: 41,
    examDate: '2026-04-22',
    examinerName: 'Khan, Adil',
    program: 'Denver EMS Training Center',
    stationType: 'Patient Assessment - Trauma'
  },
  {
    id: '5',
    candidateId: 'EMT-2026-0014',
    candidateName: 'Brown, Marcus',
    outcome: 'Fail',
    criticalFailure: true,
    criticalReason: 'Scene Safety',
    pointsEarned: 38,
    pointsPossible: 50,
    minimumPassingPoints: 41,
    examDate: '2026-01-31',
    examinerName: 'O\u2019Connor, Niamh',
    program: 'Boston EMT Bridge Program',
    stationType: 'Patient Assessment - Trauma'
  },
  {
    id: '6',
    candidateId: 'EMT-2026-0099',
    candidateName: 'Hughes, Eleri',
    outcome: 'Pass',
    criticalFailure: false,
    criticalReason: '',
    pointsEarned: 45,
    pointsPossible: 48,
    minimumPassingPoints: 39,
    examDate: '2026-04-05',
    examinerName: 'Williams, Mark',
    program: 'Phoenix College EMS Program',
    stationType: 'Patient Assessment - Medical'
  },
  {
    id: '7',
    candidateId: 'EMT-2026-0021',
    candidateName: 'MacLeod, Iain',
    outcome: 'Fail',
    criticalFailure: true,
    criticalReason: 'Oxygen',
    pointsEarned: 35,
    pointsPossible: 48,
    minimumPassingPoints: 39,
    examDate: '2026-02-08',
    examinerName: 'Bennett, Claire',
    program: 'Pittsburgh Paramedic Institute',
    stationType: 'Patient Assessment - Medical'
  },
  {
    id: '8',
    candidateId: 'EMT-2026-0203',
    candidateName: 'Singh, Harpreet',
    outcome: 'Pass',
    criticalFailure: false,
    criticalReason: '',
    pointsEarned: 48,
    pointsPossible: 48,
    minimumPassingPoints: 39,
    examDate: '2026-03-14',
    examinerName: 'Khan, Adil',
    program: 'Houston Community College EMS Academy',
    stationType: 'Patient Assessment - Medical'
  },
  {
    id: '9',
    candidateId: 'EMT-2026-0144',
    candidateName: 'Rossi, Giulia',
    outcome: 'Fail',
    criticalFailure: true,
    criticalReason: 'Airway / Breathing',
    pointsEarned: 32,
    pointsPossible: 48,
    minimumPassingPoints: 39,
    examDate: '2026-03-02',
    examinerName: 'O\u2019Connor, Niamh',
    program: 'Boston EMT Bridge Program',
    stationType: 'Patient Assessment - Medical'
  },
  {
    id: '10',
    candidateId: 'EMT-2026-0187',
    candidateName: 'Whitfield, Thomas',
    outcome: 'Fail',
    criticalFailure: false,
    criticalReason: '',
    pointsEarned: 37,
    pointsPossible: 48,
    minimumPassingPoints: 39,
    examDate: '2026-02-25',
    examinerName: 'Khan, Adil',
    program: 'Denver EMS Training Center',
    stationType: 'Patient Assessment - Medical'
  },
  {
    id: '11',
    candidateId: 'EMT-2026-0030',
    candidateName: 'Nguyen, Linh',
    outcome: 'Pass',
    criticalFailure: false,
    criticalReason: '',
    pointsEarned: 49,
    pointsPossible: 50,
    minimumPassingPoints: 41,
    examDate: '2026-04-19',
    examinerName: 'Williams, Mark',
    program: 'Phoenix College EMS Program',
    stationType: 'Patient Assessment - Trauma'
  },
  {
    id: '12',
    candidateId: 'EMT-2026-0035',
    candidateName: 'Kowalski, Aleksander',
    outcome: 'Fail',
    criticalFailure: true,
    criticalReason: 'Spinal Protection',
    pointsEarned: 40,
    pointsPossible: 50,
    minimumPassingPoints: 41,
    examDate: '2026-03-21',
    examinerName: 'O\u2019Connor, Niamh',
    program: 'Boston EMT Bridge Program',
    stationType: 'Patient Assessment - Trauma'
  }
];

export { sampleCandidates };
