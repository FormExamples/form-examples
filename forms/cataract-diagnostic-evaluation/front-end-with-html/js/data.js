// Sample evaluation data for the Cataract Diagnostic Evaluation dashboard.
//
// Used when the back-end is offline so the dashboard is usable standalone.
// Twelve rows spanning every LOCS III severity band and every
// surgical-candidacy recommendation. NHS numbers are placeholder values in
// the canonical "NNN NNN NNNN" display form; names are invented.
//
// The set deliberately includes the worked cases a reviewer should see: a
// routine mild case with no referral; a moderate case where surgery is being
// considered; a severe case with surgery indicated; a case where a safety
// flag overrides the recommendation to urgent referral; a paediatric case;
// and a case where the clinician overrode the computed recommendation.

/** @type {import('./dashboard-types.js').EvaluationRow[]} */
const sampleEvaluations = [
  {
    id: 'CE001',
    assessmentDate: '2026-06-02',
    patient: 'Okonkwo, Ngozi',
    nhs: '501 234 5678',
    locsIIISeverityRight: 'mild',
    locsIIISeverityLeft: 'mild',
    computedSurgicalCandidacy: 'not-indicated',
    finalSurgicalCandidacy: 'not-indicated',
    clinician: 'A Bhatt GOC',
    reviewDate: '2026-12-02',
    flags: []
  },
  {
    id: 'CE002',
    assessmentDate: '2026-06-02',
    patient: 'Lindqvist, Marit',
    nhs: '502 345 6789',
    locsIIISeverityRight: 'moderate',
    locsIIISeverityLeft: 'mild',
    computedSurgicalCandidacy: 'consider',
    finalSurgicalCandidacy: 'consider',
    clinician: 'A Bhatt GOC',
    reviewDate: '2026-09-02',
    flags: []
  },
  {
    id: 'CE003',
    assessmentDate: '2026-06-03',
    patient: 'Adeyemi, Tunde',
    nhs: '503 456 7890',
    locsIIISeverityRight: 'severe',
    locsIIISeverityLeft: 'moderate',
    computedSurgicalCandidacy: 'indicated',
    finalSurgicalCandidacy: 'indicated',
    clinician: 'S Whitfield GMC',
    reviewDate: '2026-06-24',
    flags: []
  },
  {
    id: 'CE004',
    assessmentDate: '2026-06-04',
    patient: 'Petrova, Yelena',
    nhs: '504 567 8901',
    locsIIISeverityRight: 'severe',
    locsIIISeverityLeft: 'severe',
    computedSurgicalCandidacy: 'urgent-referral',
    finalSurgicalCandidacy: 'urgent-referral',
    clinician: 'S Whitfield GMC',
    reviewDate: '2026-06-05',
    flags: ['competing-pathology-suspected', 'raised-iop']
  },
  {
    id: 'CE005',
    assessmentDate: '2026-06-05',
    patient: 'Kowalski, Bartosz',
    nhs: '505 678 9012',
    locsIIISeverityRight: 'moderate',
    locsIIISeverityLeft: 'mild',
    computedSurgicalCandidacy: 'urgent-referral',
    finalSurgicalCandidacy: 'urgent-referral',
    clinician: 'M Osei GOC',
    reviewDate: '2026-06-08',
    flags: ['view-obscured-fundus-not-assessed']
  },
  {
    id: 'CE006',
    assessmentDate: '2026-06-08',
    patient: 'Ferreira, Ines',
    nhs: '506 789 0123',
    locsIIISeverityRight: 'severe',
    locsIIISeverityLeft: 'mild',
    computedSurgicalCandidacy: 'urgent-referral',
    finalSurgicalCandidacy: 'urgent-referral',
    clinician: 'M Osei GOC',
    reviewDate: '2026-06-10',
    flags: ['rapid-progression']
  },
  {
    id: 'CE007',
    assessmentDate: '2026-06-09',
    patient: 'Haddad, Rania',
    nhs: '507 890 1234',
    locsIIISeverityRight: 'mild',
    locsIIISeverityLeft: 'mild',
    computedSurgicalCandidacy: 'not-indicated',
    finalSurgicalCandidacy: 'not-indicated',
    clinician: 'A Bhatt GOC',
    reviewDate: '2026-12-09',
    flags: []
  },
  {
    id: 'CE008',
    assessmentDate: '2026-06-10',
    patient: 'Novotny, Pavel',
    nhs: '508 901 2345',
    locsIIISeverityRight: 'severe',
    locsIIISeverityLeft: 'severe',
    computedSurgicalCandidacy: 'indicated',
    finalSurgicalCandidacy: 'indicated',
    clinician: 'S Whitfield GMC',
    reviewDate: '2026-06-24',
    flags: ['biometry-incomplete-for-surgical-planning']
  },
  {
    id: 'CE009',
    assessmentDate: '2026-06-11',
    patient: 'Mbeki, Thandiwe',
    nhs: '509 012 3456',
    locsIIISeverityRight: 'moderate',
    locsIIISeverityLeft: 'moderate',
    computedSurgicalCandidacy: 'consider',
    finalSurgicalCandidacy: 'not-indicated',
    clinician: 'M Osei GOC',
    reviewDate: '2026-12-11',
    flags: []
  },
  {
    id: 'CE010',
    assessmentDate: '2026-06-12',
    patient: 'Sørensen, Kasper',
    nhs: '510 123 4567',
    locsIIISeverityRight: '',
    locsIIISeverityLeft: '',
    computedSurgicalCandidacy: 'urgent-referral',
    finalSurgicalCandidacy: 'urgent-referral',
    clinician: 'A Bhatt GOC',
    reviewDate: '2026-06-13',
    flags: ['paediatric']
  },
  {
    id: 'CE011',
    assessmentDate: '2026-06-15',
    patient: 'Yamamoto, Aiko',
    nhs: '511 234 5678',
    locsIIISeverityRight: 'mild',
    locsIIISeverityLeft: 'moderate',
    computedSurgicalCandidacy: 'consider',
    finalSurgicalCandidacy: 'consider',
    clinician: 'S Whitfield GMC',
    reviewDate: '2026-09-15',
    flags: []
  },
  {
    id: 'CE012',
    assessmentDate: '2026-06-16',
    patient: 'Grimaldi, Luca',
    nhs: '512 345 6789',
    locsIIISeverityRight: 'severe',
    locsIIISeverityLeft: 'moderate',
    computedSurgicalCandidacy: 'indicated',
    finalSurgicalCandidacy: 'indicated',
    clinician: 'M Osei GOC',
    reviewDate: '2026-06-30',
    flags: ['raised-iop', 'biometry-incomplete-for-surgical-planning']
  }
];

export { sampleEvaluations };
