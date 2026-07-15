// Sample candidate data for the Welsh-language (Cymraeg) clinical speaking
// sub-test (Medicine) admin dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every grade band (A, B, C+, C, D, E),
// every supported profession (Doctor, Nurse, Pharmacist, Dentist,
// Physiotherapist), several examiners, scaled scores 0-500, and the full
// set of registration outcomes (Eligible / Not Eligible / Pending). Names
// and locations reflect Welsh-speaking NHS Wales clinical settings such as
// Bangor, Aberystwyth, Caernarfon, and Carmarthen.
//
// Scaled-score / grade mapping (informational; the engine is canonical):
//   450-500 -> A,  350-440 -> B,  300-340 -> C+,
//   200-290 -> C,  100-190 -> D,  0-90    -> E

/** @type {import('./types.js').CandidateRow[]} */
const sampleCandidates = [
  {
    id: '1',
    candidateNumber: 'CYM-2026-00417',
    candidateName: 'Williams, Aled',
    profession: 'Doctor',
    scaledScore: 470,
    grade: 'A',
    examiner: 'Dr. Eleri Pugh (Bangor)',
    sittingDate: '2026-04-12',
    registrationOutcome: 'Eligible'
  },
  {
    id: '2',
    candidateNumber: 'CYM-2026-00422',
    candidateName: 'Davies, Carys',
    profession: 'Nurse',
    scaledScore: 380,
    grade: 'B',
    examiner: 'Mrs. Bethan Morgan (Aberystwyth)',
    sittingDate: '2026-04-12',
    registrationOutcome: 'Eligible'
  },
  {
    id: '3',
    candidateNumber: 'CYM-2026-00431',
    candidateName: 'Jones, Rhys',
    profession: 'Pharmacist',
    scaledScore: 320,
    grade: 'C+',
    examiner: 'Mr. Iwan Roberts (Caernarfon)',
    sittingDate: '2026-04-13',
    registrationOutcome: 'Pending'
  },
  {
    id: '4',
    candidateNumber: 'CYM-2026-00438',
    candidateName: 'Hughes, Llinos',
    profession: 'Doctor',
    scaledScore: 360,
    grade: 'B',
    examiner: 'Dr. Eleri Pugh (Bangor)',
    sittingDate: '2026-04-13',
    registrationOutcome: 'Eligible'
  },
  {
    id: '5',
    candidateNumber: 'CYM-2026-00445',
    candidateName: 'Evans, Sioned',
    profession: 'Dentist',
    scaledScore: 130,
    grade: 'D',
    examiner: 'Mrs. Bethan Morgan (Aberystwyth)',
    sittingDate: '2026-04-14',
    registrationOutcome: 'Not Eligible'
  },
  {
    id: '6',
    candidateNumber: 'CYM-2026-00451',
    candidateName: 'Pritchard, Gwilym',
    profession: 'Physiotherapist',
    scaledScore: 460,
    grade: 'A',
    examiner: 'Mr. Iwan Roberts (Caernarfon)',
    sittingDate: '2026-04-14',
    registrationOutcome: 'Eligible'
  },
  {
    id: '7',
    candidateNumber: 'CYM-2026-00459',
    candidateName: 'Thomas, Heledd',
    profession: 'Nurse',
    scaledScore: 70,
    grade: 'E',
    examiner: 'Dr. Geraint Lewis (Carmarthen)',
    sittingDate: '2026-04-15',
    registrationOutcome: 'Not Eligible'
  },
  {
    id: '8',
    candidateNumber: 'CYM-2026-00463',
    candidateName: 'Owen, Dafydd',
    profession: 'Doctor',
    scaledScore: 250,
    grade: 'C',
    examiner: 'Dr. Geraint Lewis (Carmarthen)',
    sittingDate: '2026-04-15',
    registrationOutcome: 'Pending'
  },
  {
    id: '9',
    candidateNumber: 'CYM-2026-00471',
    candidateName: 'Morris, Mared',
    profession: 'Pharmacist',
    scaledScore: 170,
    grade: 'D',
    examiner: 'Mrs. Bethan Morgan (Aberystwyth)',
    sittingDate: '2026-04-16',
    registrationOutcome: 'Not Eligible'
  },
  {
    id: '10',
    candidateNumber: 'CYM-2026-00479',
    candidateName: 'Edwards, Ioan',
    profession: 'Physiotherapist',
    scaledScore: 410,
    grade: 'B',
    examiner: 'Dr. Eleri Pugh (Bangor)',
    sittingDate: '2026-04-16',
    registrationOutcome: 'Eligible'
  },
  {
    id: '11',
    candidateNumber: 'CYM-2026-00484',
    candidateName: 'Griffiths, Angharad',
    profession: 'Dentist',
    scaledScore: 310,
    grade: 'C+',
    examiner: 'Mr. Iwan Roberts (Caernarfon)',
    sittingDate: '2026-04-17',
    registrationOutcome: 'Pending'
  },
  {
    id: '12',
    candidateNumber: 'CYM-2026-00492',
    candidateName: 'Lloyd, Cerys',
    profession: 'Nurse',
    scaledScore: 220,
    grade: 'C',
    examiner: 'Dr. Geraint Lewis (Carmarthen)',
    sittingDate: '2026-04-17',
    registrationOutcome: 'Not Eligible'
  }
];

export { sampleCandidates };
