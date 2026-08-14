// Sample evaluation data for the Hip Replacement Surgery Evaluation dashboard.
//
// Used when the back-end is offline so the dashboard is usable standalone.
// Twelve rows spanning every OHS category band and every candidacy
// recommendation. NHS numbers are placeholder values in the canonical
// "NNN NNN NNNN" display form; names are invented.
//
// The set deliberately includes the worked cases a reviewer should see: a
// strong candidate with conservative measures exhausted; a case where
// conservative measures were not exhausted (forcing continue-conservative);
// a case with a missing Kellgren and Lawrence grade routed to
// multidisciplinary-team review; a high-BMI case; an incomplete-bloods case;
// a significant leg-length discrepancy case; a bilateral case; and a case
// where the clinician overrode the computed candidacy.

/** @type {import('./dashboard-types.js').EvaluationRow[]} */
const sampleEvaluations = [
  {
    id: 'HR001',
    assessmentDate: '2026-06-02',
    patient: 'Okonkwo, Ngozi',
    nhs: '501 234 5678',
    bmi: 26.4,
    ohsTotal: 14,
    ohsCategory: 'severe',
    kellgrenLawrenceGrade: 4,
    candidacy: 'strong-candidate',
    clinician: 'A Bhatt (Orthopaedic surgeon)',
    flags: []
  },
  {
    id: 'HR002',
    assessmentDate: '2026-06-02',
    patient: 'Lindqvist, Marit',
    nhs: '502 345 6789',
    bmi: 23.1,
    ohsTotal: 26,
    ohsCategory: 'moderate',
    kellgrenLawrenceGrade: 3,
    candidacy: 'candidate',
    clinician: 'A Bhatt (Orthopaedic surgeon)',
    flags: ['trendelenburg-positive']
  },
  {
    id: 'HR003',
    assessmentDate: '2026-06-03',
    patient: 'Adeyemi, Tunde',
    nhs: '503 456 7890',
    bmi: 31.8,
    ohsTotal: 12,
    ohsCategory: 'severe',
    kellgrenLawrenceGrade: 4,
    candidacy: 'continue-conservative',
    clinician: 'S Whitfield (Extended-scope physiotherapist)',
    flags: ['conservative-treatment-not-exhausted']
  },
  {
    id: 'HR004',
    assessmentDate: '2026-06-04',
    patient: 'Petrova, Yelena',
    nhs: '504 567 8901',
    bmi: 22.0,
    ohsTotal: 44,
    ohsCategory: 'satisfactory',
    kellgrenLawrenceGrade: 1,
    candidacy: 'not-indicated',
    clinician: 'S Whitfield (Extended-scope physiotherapist)',
    flags: []
  },
  {
    id: 'HR005',
    assessmentDate: '2026-06-05',
    patient: 'Kowalski, Bartosz',
    nhs: '505 678 9012',
    bmi: 42.7,
    ohsTotal: 18,
    ohsCategory: 'severe',
    kellgrenLawrenceGrade: 3,
    candidacy: 'strong-candidate',
    clinician: 'M Osei (Orthopaedic surgeon)',
    flags: ['high-bmi-surgical-risk']
  },
  {
    id: 'HR006',
    assessmentDate: '2026-06-08',
    patient: 'Ferreira, Ines',
    nhs: '506 789 0123',
    bmi: 24.9,
    ohsTotal: 25,
    ohsCategory: 'moderate',
    kellgrenLawrenceGrade: null,
    candidacy: 'mdt-review',
    clinician: 'M Osei (Orthopaedic surgeon)',
    flags: ['pre-op-bloods-incomplete']
  },
  {
    id: 'HR007',
    assessmentDate: '2026-06-09',
    patient: 'Haddad, Rania',
    nhs: '507 890 1234',
    bmi: 27.3,
    ohsTotal: 16,
    ohsCategory: 'severe',
    kellgrenLawrenceGrade: 4,
    candidacy: 'strong-candidate',
    clinician: 'A Bhatt (Orthopaedic surgeon)',
    flags: ['leg-length-discrepancy-significant']
  },
  {
    id: 'HR008',
    assessmentDate: '2026-06-10',
    patient: 'Novotny, Pavel',
    nhs: '508 901 2345',
    bmi: 25.5,
    ohsTotal: 28,
    ohsCategory: 'moderate',
    kellgrenLawrenceGrade: 2,
    candidacy: 'candidate',
    clinician: 'S Whitfield (Extended-scope physiotherapist)',
    flags: []
  },
  {
    id: 'HR009',
    assessmentDate: '2026-06-11',
    patient: 'Mbeki, Thandiwe',
    nhs: '509 012 3456',
    bmi: 23.9,
    ohsTotal: 10,
    ohsCategory: 'severe',
    kellgrenLawrenceGrade: 4,
    candidacy: 'strong-candidate',
    clinician: 'M Osei (Orthopaedic surgeon)',
    flags: ['bilateral-symptomatic']
  },
  {
    id: 'HR010',
    assessmentDate: '2026-06-12',
    patient: 'Sørensen, Kasper',
    nhs: '510 123 4567',
    bmi: 28.2,
    ohsTotal: 33,
    ohsCategory: 'mild-to-moderate',
    kellgrenLawrenceGrade: 2,
    candidacy: 'mdt-review',
    clinician: 'A Bhatt (Orthopaedic surgeon)',
    flags: []
  },
  {
    id: 'HR011',
    assessmentDate: '2026-06-15',
    patient: 'Yamamoto, Aiko',
    nhs: '511 234 5678',
    bmi: 21.6,
    ohsTotal: 17,
    ohsCategory: 'severe',
    kellgrenLawrenceGrade: 4,
    candidacy: 'mdt-review',
    clinician: 'S Whitfield (Extended-scope physiotherapist)',
    flags: []
  },
  {
    id: 'HR012',
    assessmentDate: '2026-06-16',
    patient: 'Grimaldi, Luca',
    nhs: '512 345 6789',
    bmi: 26.8,
    ohsTotal: 21,
    ohsCategory: 'moderate',
    kellgrenLawrenceGrade: 4,
    candidacy: 'candidate',
    clinician: 'M Osei (Orthopaedic surgeon)',
    flags: []
  }
];

export { sampleEvaluations };
