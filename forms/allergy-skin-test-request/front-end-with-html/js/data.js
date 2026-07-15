// Sample request data for the allergy testing vetting dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Ten realistic rows spanning both triage tiers (routine / urgent), every
// appropriateness band, and every validity-and-safety band. NHS numbers are
// placeholder values in the canonical "NNN NNN NNNN" display form. Includes
// the required worked cases: a routine aeroallergen skin-prick test, a
// previous-anaphylaxis case, an antihistamines-invalidate case, and a
// no-allergen-selected case.

/** @type {import('./types.js').RequestRow[]} */
const sampleRequests = [
  {
    id: 'A001',
    referralDate: '2026-05-04',
    patient: 'Okafor, Amara',
    nhs: '401 234 5678',
    testType: 'skin-prick-test',
    allergens: ['aeroallergens'],
    indication: 'rhinitis-asthma',
    appropriatenessBand: 'usually-appropriate',
    validitySafetyBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'A002',
    referralDate: '2026-05-05',
    patient: 'Bianchi, Sofia',
    nhs: '402 345 6789',
    testType: 'skin-prick-test',
    allergens: ['food'],
    indication: 'anaphylaxis-investigation',
    appropriatenessBand: 'usually-appropriate',
    validitySafetyBand: 'caution',
    triageTier: 'urgent',
    completenessPercent: 95,
    clinician: 'Dr K Mensah',
    flags: ['previous-anaphylaxis-resus-ready']
  },
  {
    id: 'A003',
    referralDate: '2026-05-05',
    patient: 'Novak, Petra',
    nhs: '403 456 7890',
    testType: 'skin-prick-test',
    allergens: ['food', 'aeroallergens'],
    indication: 'suspected-food-allergy',
    appropriatenessBand: 'usually-appropriate',
    validitySafetyBand: 'contraindicated',
    triageTier: 'routine',
    completenessPercent: 90,
    clinician: 'Dr L Romano',
    flags: ['antihistamines-invalidate-test']
  },
  {
    id: 'A004',
    referralDate: '2026-05-06',
    patient: 'Hassan, Layla',
    nhs: '404 567 8901',
    testType: 'specific-ige-blood',
    allergens: [],
    indication: 'suspected-food-allergy',
    appropriatenessBand: 'usually-not-appropriate',
    validitySafetyBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 60,
    clinician: 'Dr M Adebayo',
    flags: ['no-allergen-selected']
  },
  {
    id: 'A005',
    referralDate: '2026-05-06',
    patient: 'Connolly, Niamh',
    nhs: '405 678 9012',
    testType: 'patch-test',
    allergens: ['contact'],
    indication: 'contact-dermatitis',
    appropriatenessBand: 'usually-appropriate',
    validitySafetyBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'A006',
    referralDate: '2026-05-07',
    patient: 'Silva, Beatriz',
    nhs: '406 789 0123',
    testType: 'intradermal-test',
    allergens: ['venom'],
    indication: 'venom-allergy',
    appropriatenessBand: 'usually-appropriate',
    validitySafetyBand: 'caution',
    triageTier: 'urgent',
    completenessPercent: 90,
    clinician: 'Dr P Sharma',
    flags: ['previous-anaphylaxis-resus-ready', 'beta-blocker-caution']
  },
  {
    id: 'A007',
    referralDate: '2026-05-07',
    patient: 'Andersson, Elin',
    nhs: '407 890 1234',
    testType: 'specific-ige-blood',
    allergens: ['aeroallergens'],
    indication: 'urticaria',
    appropriatenessBand: 'may-be-appropriate',
    validitySafetyBand: 'ok',
    triageTier: 'routine',
    completenessPercent: 65,
    clinician: 'Dr R Ahmed',
    flags: ['missing-clinical-details']
  },
  {
    id: 'A008',
    referralDate: '2026-05-08',
    patient: 'Kowalski, Zofia',
    nhs: '408 901 2345',
    testType: 'drug-provocation-challenge',
    allergens: ['drug'],
    indication: 'suspected-drug-allergy',
    appropriatenessBand: 'usually-appropriate',
    validitySafetyBand: 'caution',
    triageTier: 'urgent',
    completenessPercent: 95,
    clinician: 'Dr K Mensah',
    flags: ['beta-blocker-caution']
  },
  {
    id: 'A009',
    referralDate: '2026-05-08',
    patient: 'Müller, Hannah',
    nhs: '409 012 3456',
    testType: 'skin-prick-test',
    allergens: ['contact'],
    indication: 'contact-dermatitis',
    appropriatenessBand: 'usually-not-appropriate',
    validitySafetyBand: 'caution',
    triageTier: 'routine',
    completenessPercent: 70,
    clinician: 'Dr L Romano',
    flags: ['active-skin-disease']
  },
  {
    id: 'A010',
    referralDate: '2026-05-09',
    patient: 'Tanaka, Yuki',
    nhs: '410 123 4567',
    testType: 'skin-prick-test',
    allergens: ['food', 'venom'],
    indication: 'anaphylaxis-investigation',
    appropriatenessBand: 'usually-appropriate',
    validitySafetyBand: 'contraindicated',
    triageTier: 'urgent',
    completenessPercent: 85,
    clinician: 'Dr M Adebayo',
    flags: ['previous-anaphylaxis-resus-ready', 'antihistamines-invalidate-test']
  }
];

export { sampleRequests };
