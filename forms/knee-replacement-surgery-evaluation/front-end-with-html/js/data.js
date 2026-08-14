// Sample evaluation data for the Knee Replacement Surgery Evaluation
// dashboard.
//
// Used when the back-end is offline so the dashboard is usable standalone.
// Twelve rows spanning every Oxford Knee Score category, every surgical-
// candidacy recommendation, and every safety-flag category. NHS numbers are
// placeholder values in the canonical "NNN NNN NNNN" display form; names are
// invented.

/** @type {import('./dashboard-types.js').EvaluationRow[]} */
const sampleEvaluations = [
  {
    id: 'KR001',
    assessmentDate: '2026-06-02',
    patient: 'Okonkwo, Ngozi',
    nhs: '501 234 5678',
    kneeSide: 'right',
    oksTotal: 14,
    oksCategory: 'severe',
    candidacy: 'strong-candidate',
    clinician: 'A Bhatt FRCS(Orth)',
    planRecommendation: 'total-knee-replacement',
    flags: []
  },
  {
    id: 'KR002',
    assessmentDate: '2026-06-02',
    patient: 'Lindqvist, Marit',
    nhs: '502 345 6789',
    kneeSide: 'left',
    oksTotal: 22,
    oksCategory: 'moderate',
    candidacy: 'candidate',
    clinician: 'A Bhatt FRCS(Orth)',
    planRecommendation: 'partial-knee-replacement',
    flags: ['high-bmi-surgical-risk']
  },
  {
    id: 'KR003',
    assessmentDate: '2026-06-03',
    patient: 'Adeyemi, Tunde',
    nhs: '503 456 7890',
    kneeSide: 'bilateral',
    oksTotal: 11,
    oksCategory: 'severe',
    candidacy: 'strong-candidate',
    clinician: 'S Whitfield ESP',
    planRecommendation: 'total-knee-replacement',
    flags: ['bilateral-symptomatic', 'pre-op-bloods-incomplete']
  },
  {
    id: 'KR004',
    assessmentDate: '2026-06-04',
    patient: 'Petrova, Yelena',
    nhs: '504 567 8901',
    kneeSide: 'left',
    oksTotal: 33,
    oksCategory: 'mild-to-moderate',
    candidacy: 'continue-conservative',
    clinician: 'S Whitfield ESP',
    planRecommendation: 'continue-conservative-management',
    flags: []
  },
  {
    id: 'KR005',
    assessmentDate: '2026-06-05',
    patient: 'Kowalski, Bartosz',
    nhs: '505 678 9012',
    kneeSide: 'right',
    oksTotal: 44,
    oksCategory: 'satisfactory',
    candidacy: 'not-indicated',
    clinician: 'M Osei FRCS(Orth)',
    planRecommendation: 'not-currently-a-candidate',
    flags: []
  },
  {
    id: 'KR006',
    assessmentDate: '2026-06-08',
    patient: 'Ferreira, Ines',
    nhs: '506 789 0123',
    kneeSide: 'right',
    oksTotal: 35,
    oksCategory: 'mild-to-moderate',
    candidacy: 'mdt-review',
    clinician: 'M Osei FRCS(Orth)',
    planRecommendation: 'mdt-review',
    flags: []
  },
  {
    id: 'KR007',
    assessmentDate: '2026-06-09',
    patient: 'Haddad, Rania',
    nhs: '507 890 1234',
    kneeSide: 'left',
    oksTotal: 18,
    oksCategory: 'severe',
    candidacy: 'strong-candidate',
    clinician: 'A Bhatt FRCS(Orth)',
    planRecommendation: 'total-knee-replacement',
    flags: ['fixed-flexion-deformity']
  },
  {
    id: 'KR008',
    assessmentDate: '2026-06-10',
    patient: 'Novotny, Pavel',
    nhs: '508 901 2345',
    kneeSide: 'right',
    oksTotal: 27,
    oksCategory: 'moderate',
    candidacy: 'candidate',
    clinician: 'S Whitfield ESP',
    planRecommendation: 'partial-knee-replacement',
    flags: []
  },
  {
    id: 'KR009',
    assessmentDate: '2026-06-11',
    patient: 'Mbeki, Thandiwe',
    nhs: '509 012 3456',
    kneeSide: 'left',
    oksTotal: 12,
    oksCategory: 'severe',
    candidacy: 'continue-conservative',
    clinician: 'M Osei FRCS(Orth)',
    planRecommendation: 'continue-conservative-management',
    flags: ['conservative-treatment-not-exhausted']
  },
  {
    id: 'KR010',
    assessmentDate: '2026-06-12',
    patient: 'Sørensen, Kasper',
    nhs: '510 123 4567',
    kneeSide: 'right',
    oksTotal: 16,
    oksCategory: 'severe',
    candidacy: 'strong-candidate',
    clinician: 'A Bhatt FRCS(Orth)',
    planRecommendation: 'total-knee-replacement',
    flags: ['high-bmi-surgical-risk', 'pre-op-bloods-incomplete']
  },
  {
    id: 'KR011',
    assessmentDate: '2026-06-15',
    patient: 'Yamamoto, Aiko',
    nhs: '511 234 5678',
    kneeSide: 'left',
    oksTotal: 25,
    oksCategory: 'moderate',
    candidacy: 'candidate',
    clinician: 'S Whitfield ESP',
    planRecommendation: 'partial-knee-replacement',
    flags: []
  },
  {
    id: 'KR012',
    assessmentDate: '2026-06-16',
    patient: 'Grimaldi, Luca',
    nhs: '512 345 6789',
    kneeSide: 'bilateral',
    oksTotal: 9,
    oksCategory: 'severe',
    candidacy: 'strong-candidate',
    clinician: 'M Osei FRCS(Orth)',
    planRecommendation: 'total-knee-replacement',
    flags: ['bilateral-symptomatic', 'fixed-flexion-deformity', 'high-bmi-surgical-risk']
  }
];

export { sampleEvaluations };
