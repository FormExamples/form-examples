// Sample request data for the sleep study vetting dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Ten realistic rows spanning both triage tiers (routine / urgent), every
// appropriateness band, and every clinical-priority band. NHS numbers are
// placeholder values in the canonical "NNN NNN NNNN" display form. Includes
// the required worked cases: a routine suspected-OSA request, an occupational-
// driver case, and a severe-daytime-sleepiness case.

/** @type {import('./types.js').RequestRow[]} */
const sampleRequests = [
  {
    id: 'S001',
    referralDate: '2026-05-04',
    patient: 'Okafor, Amara',
    nhs: '401 234 5678',
    studyType: 'home-sleep-apnoea-test',
    indication: 'suspected-osa',
    epworthScore: 9,
    stopBangScore: 4,
    appropriatenessBand: 'usually-appropriate',
    priorityBand: 'low',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'S002',
    referralDate: '2026-05-05',
    patient: 'Bianchi, Sofia',
    nhs: '402 345 6789',
    studyType: 'home-sleep-apnoea-test',
    indication: 'driver-assessment',
    epworthScore: 14,
    stopBangScore: 6,
    appropriatenessBand: 'usually-appropriate',
    priorityBand: 'high',
    triageTier: 'urgent',
    completenessPercent: 95,
    clinician: 'Dr K Mensah',
    flags: ['occupational-driver-osa']
  },
  {
    id: 'S003',
    referralDate: '2026-05-05',
    patient: 'Novak, Petra',
    nhs: '403 456 7890',
    studyType: 'polysomnography',
    indication: 'daytime-sleepiness',
    epworthScore: 19,
    stopBangScore: 5,
    appropriatenessBand: 'usually-appropriate',
    priorityBand: 'high',
    triageTier: 'urgent',
    completenessPercent: 90,
    clinician: 'Dr L Romano',
    flags: ['severe-daytime-sleepiness']
  },
  {
    id: 'S004',
    referralDate: '2026-05-06',
    patient: 'Hassan, Layla',
    nhs: '404 567 8901',
    studyType: 'multiple-sleep-latency-test',
    indication: 'suspected-narcolepsy',
    epworthScore: 17,
    stopBangScore: 2,
    appropriatenessBand: 'usually-appropriate',
    priorityBand: 'high',
    triageTier: 'urgent',
    completenessPercent: 100,
    clinician: 'Dr M Adebayo',
    flags: ['severe-daytime-sleepiness', 'suspected-narcolepsy']
  },
  {
    id: 'S005',
    referralDate: '2026-05-06',
    patient: 'Connolly, Niamh',
    nhs: '405 678 9012',
    studyType: 'overnight-oximetry',
    indication: 'copd-overlap',
    epworthScore: 8,
    stopBangScore: 3,
    appropriatenessBand: 'may-be-appropriate',
    priorityBand: 'moderate',
    triageTier: 'routine',
    completenessPercent: 85,
    clinician: 'Dr H Iqbal',
    flags: []
  },
  {
    id: 'S006',
    referralDate: '2026-05-07',
    patient: 'Silva, Beatriz',
    nhs: '406 789 0123',
    studyType: 'actigraphy',
    indication: 'insomnia',
    epworthScore: 6,
    stopBangScore: 1,
    appropriatenessBand: 'usually-appropriate',
    priorityBand: 'low',
    triageTier: 'routine',
    completenessPercent: 100,
    clinician: 'Dr P Sharma',
    flags: []
  },
  {
    id: 'S007',
    referralDate: '2026-05-07',
    patient: 'Andersson, Elin',
    nhs: '407 890 1234',
    studyType: 'home-sleep-apnoea-test',
    indication: 'snoring',
    epworthScore: null,
    stopBangScore: null,
    appropriatenessBand: 'may-be-appropriate',
    priorityBand: 'low',
    triageTier: 'routine',
    completenessPercent: 55,
    clinician: 'Dr R Ahmed',
    flags: ['missing-epworth', 'missing-clinical-question']
  },
  {
    id: 'S008',
    referralDate: '2026-05-08',
    patient: 'Kowalski, Zofia',
    nhs: '408 901 2345',
    studyType: 'polysomnography',
    indication: 'restless-legs',
    epworthScore: 7,
    stopBangScore: 2,
    appropriatenessBand: 'usually-appropriate',
    priorityBand: 'low',
    triageTier: 'routine',
    completenessPercent: 90,
    clinician: 'Dr K Mensah',
    flags: []
  },
  {
    id: 'S009',
    referralDate: '2026-05-08',
    patient: 'Müller, Hannah',
    nhs: '409 012 3456',
    studyType: 'actigraphy',
    indication: 'suspected-osa',
    epworthScore: 12,
    stopBangScore: 5,
    appropriatenessBand: 'usually-not-appropriate',
    priorityBand: 'moderate',
    triageTier: 'routine',
    completenessPercent: 80,
    clinician: 'Dr L Romano',
    flags: []
  },
  {
    id: 'S010',
    referralDate: '2026-05-09',
    patient: 'Tanaka, Yuki',
    nhs: '410 123 4567',
    studyType: 'home-sleep-apnoea-test',
    indication: 'pre-bariatric',
    epworthScore: 11,
    stopBangScore: 6,
    appropriatenessBand: 'usually-appropriate',
    priorityBand: 'moderate',
    triageTier: 'routine',
    completenessPercent: 95,
    clinician: 'Dr M Adebayo',
    flags: []
  }
];

export { sampleRequests };
