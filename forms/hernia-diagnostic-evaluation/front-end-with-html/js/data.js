// Sample evaluation data for the Hernia Diagnostic Evaluation dashboard.
//
// Used when the back-end is offline so the dashboard is usable standalone.
// Rows span every urgency band (routine, soon, urgent, emergency), several
// hernia types, and every reducibility status. NHS numbers are placeholder
// values in the canonical "NNN NNN NNNN" display form; names are invented.
//
// The set deliberately includes the worked cases a reviewer should see: a
// well-reduced routine review; a symptomatic reducible hernia scoring soon;
// an irreducible hernia with no red flags scoring urgent; an incarcerated
// hernia with a red flag scoring emergency; a recurrent hernia; a paediatric
// case; and a case where the clinician overrode the computed urgency.

/** @type {import('./dashboard-types.js').EvaluationRow[]} */
const sampleEvaluations = [
  {
    id: 'HE001',
    assessmentDate: '2026-06-02',
    patient: 'Okonkwo, Ngozi',
    nhs: '501 234 5678',
    herniaType: 'inguinal',
    reducibilityStatus: 'reducible',
    computedUrgency: 'routine',
    finalUrgency: 'routine',
    recommendation: 'watchful-waiting',
    clinician: 'Dr A Bhatt',
    flags: []
  },
  {
    id: 'HE002',
    assessmentDate: '2026-06-02',
    patient: 'Lindqvist, Marit',
    nhs: '502 345 6789',
    herniaType: 'umbilical',
    reducibilityStatus: 'reducible',
    computedUrgency: 'soon',
    finalUrgency: 'soon',
    recommendation: 'elective-repair-referral',
    clinician: 'Dr A Bhatt',
    flags: []
  },
  {
    id: 'HE003',
    assessmentDate: '2026-06-03',
    patient: 'Adeyemi, Tunde',
    nhs: '503 456 7890',
    herniaType: 'inguinal',
    reducibilityStatus: 'irreducible',
    computedUrgency: 'urgent',
    finalUrgency: 'urgent',
    recommendation: 'urgent-referral',
    clinician: 'Mr S Whitfield',
    flags: ['incarceration-risk']
  },
  {
    id: 'HE004',
    assessmentDate: '2026-06-04',
    patient: 'Petrova, Yelena',
    nhs: '504 567 8901',
    herniaType: 'femoral',
    reducibilityStatus: 'incarcerated',
    computedUrgency: 'emergency',
    finalUrgency: 'emergency',
    recommendation: 'emergency-referral',
    clinician: 'Mr S Whitfield',
    flags: ['strangulation-suspected', 'emergency-surgical-referral']
  },
  {
    id: 'HE005',
    assessmentDate: '2026-06-05',
    patient: 'Kowalski, Bartosz',
    nhs: '505 678 9012',
    herniaType: 'inguinal',
    reducibilityStatus: 'reducible',
    computedUrgency: 'soon',
    finalUrgency: 'soon',
    recommendation: 'elective-repair-referral',
    clinician: 'Dr M Osei',
    flags: ['recurrent-hernia']
  },
  {
    id: 'HE006',
    assessmentDate: '2026-06-08',
    patient: 'Ferreira, Ines',
    nhs: '506 789 0123',
    herniaType: 'incisional',
    reducibilityStatus: 'irreducible',
    computedUrgency: 'urgent',
    finalUrgency: 'urgent',
    recommendation: 'urgent-referral',
    clinician: 'Dr M Osei',
    flags: ['incarceration-risk']
  },
  {
    id: 'HE007',
    assessmentDate: '2026-06-09',
    patient: 'Haddad, Rania',
    nhs: '507 890 1234',
    herniaType: 'umbilical',
    reducibilityStatus: 'reducible',
    computedUrgency: 'routine',
    finalUrgency: 'routine',
    recommendation: 'watchful-waiting',
    clinician: 'Dr A Bhatt',
    flags: ['pregnancy']
  },
  {
    id: 'HE008',
    assessmentDate: '2026-06-10',
    patient: 'Novotny, Pavel',
    nhs: '508 901 2345',
    herniaType: 'inguinal',
    reducibilityStatus: 'reducible',
    computedUrgency: 'routine',
    finalUrgency: 'urgent',
    recommendation: 'urgent-referral',
    clinician: 'Mr S Whitfield',
    flags: []
  },
  {
    id: 'HE009',
    assessmentDate: '2026-06-11',
    patient: 'Mbeki, Thandiwe',
    nhs: '509 012 3456',
    herniaType: 'inguinal',
    reducibilityStatus: 'reducible',
    computedUrgency: 'routine',
    finalUrgency: 'routine',
    recommendation: 'watchful-waiting',
    clinician: 'Dr M Osei',
    flags: ['paediatric']
  },
  {
    id: 'HE010',
    assessmentDate: '2026-06-16',
    patient: 'Grimaldi, Luca',
    nhs: '512 345 6789',
    herniaType: 'inguinal',
    reducibilityStatus: 'incarcerated',
    computedUrgency: 'emergency',
    finalUrgency: 'emergency',
    recommendation: 'emergency-referral',
    clinician: 'Mr S Whitfield',
    flags: ['strangulation-suspected', 'emergency-surgical-referral']
  }
];

export { sampleEvaluations };
