// Sample candidate data for the OET Speaking Sub-test (Medicine) admin
// dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every grade band (A, B, C+, C, D, E),
// every supported profession (Doctor, Nurse, Pharmacist, Dentist,
// Physiotherapist), several examiners, scaled scores 0-500, and the full
// set of registration outcomes (Eligible / Not Eligible / Pending).
//
// Scaled-score / grade mapping (informational; the engine is canonical):
//   450-500 -> A,  350-440 -> B,  300-340 -> C+,
//   200-290 -> C,  100-190 -> D,  0-90    -> E

/** @type {import('./types.js').CandidateRow[]} */
const sampleCandidates = [
  {
    id: '1',
    candidateNumber: 'OET-2026-00417',
    candidateName: 'Smith, Jane',
    profession: 'Doctor',
    scaledScore: 470,
    grade: 'A',
    examiner: 'Dr. R. Khan',
    sittingDate: '2026-04-12',
    registrationOutcome: 'Eligible'
  },
  {
    id: '2',
    candidateNumber: 'OET-2026-00422',
    candidateName: 'Patel, Priya',
    profession: 'Nurse',
    scaledScore: 380,
    grade: 'B',
    examiner: 'Ms. L. Adeyemi',
    sittingDate: '2026-04-12',
    registrationOutcome: 'Eligible'
  },
  {
    id: '3',
    candidateNumber: 'OET-2026-00431',
    candidateName: 'Jones, Margaret',
    profession: 'Pharmacist',
    scaledScore: 320,
    grade: 'C+',
    examiner: 'Mr. P. O\u2019Connor',
    sittingDate: '2026-04-13',
    registrationOutcome: 'Pending'
  },
  {
    id: '4',
    candidateNumber: 'OET-2026-00438',
    candidateName: 'Williams, David',
    profession: 'Doctor',
    scaledScore: 360,
    grade: 'B',
    examiner: 'Dr. R. Khan',
    sittingDate: '2026-04-13',
    registrationOutcome: 'Eligible'
  },
  {
    id: '5',
    candidateNumber: 'OET-2026-00445',
    candidateName: 'Brown, Sarah',
    profession: 'Dentist',
    scaledScore: 130,
    grade: 'D',
    examiner: 'Ms. L. Adeyemi',
    sittingDate: '2026-04-14',
    registrationOutcome: 'Not Eligible'
  },
  {
    id: '6',
    candidateNumber: 'OET-2026-00451',
    candidateName: 'Taylor, James',
    profession: 'Physiotherapist',
    scaledScore: 460,
    grade: 'A',
    examiner: 'Mr. P. O\u2019Connor',
    sittingDate: '2026-04-14',
    registrationOutcome: 'Eligible'
  },
  {
    id: '7',
    candidateNumber: 'OET-2026-00459',
    candidateName: 'Davies, Helen',
    profession: 'Nurse',
    scaledScore: 70,
    grade: 'E',
    examiner: 'Dr. S. Hernandez',
    sittingDate: '2026-04-15',
    registrationOutcome: 'Not Eligible'
  },
  {
    id: '8',
    candidateNumber: 'OET-2026-00463',
    candidateName: 'Wilson, Robert',
    profession: 'Doctor',
    scaledScore: 250,
    grade: 'C',
    examiner: 'Dr. S. Hernandez',
    sittingDate: '2026-04-15',
    registrationOutcome: 'Pending'
  },
  {
    id: '9',
    candidateNumber: 'OET-2026-00471',
    candidateName: 'Evans, Catherine',
    profession: 'Pharmacist',
    scaledScore: 170,
    grade: 'D',
    examiner: 'Ms. L. Adeyemi',
    sittingDate: '2026-04-16',
    registrationOutcome: 'Not Eligible'
  },
  {
    id: '10',
    candidateNumber: 'OET-2026-00479',
    candidateName: 'Thomas, Michael',
    profession: 'Physiotherapist',
    scaledScore: 410,
    grade: 'B',
    examiner: 'Dr. R. Khan',
    sittingDate: '2026-04-16',
    registrationOutcome: 'Eligible'
  },
  {
    id: '11',
    candidateNumber: 'OET-2026-00484',
    candidateName: 'Robinson, Emma',
    profession: 'Dentist',
    scaledScore: 310,
    grade: 'C+',
    examiner: 'Mr. P. O\u2019Connor',
    sittingDate: '2026-04-17',
    registrationOutcome: 'Pending'
  },
  {
    id: '12',
    candidateNumber: 'OET-2026-00492',
    candidateName: 'Clark, George',
    profession: 'Nurse',
    scaledScore: 220,
    grade: 'C',
    examiner: 'Dr. S. Hernandez',
    sittingDate: '2026-04-17',
    registrationOutcome: 'Not Eligible'
  }
];

export { sampleCandidates };
