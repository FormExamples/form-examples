// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every menopausal-status band and every
// screening-status value, with symptom scores covering the full
// minimal -> severe range; NHS numbers in the canonical "NNN NNN NNNN" form.

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, Emily',
    symptomScore: 3,
    primaryConcern: 'Routine cervical screening',
    menopausalStatus: 'Pre-menopausal',
    screeningStatus: 'Up to date'
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    symptomScore: 14,
    primaryConcern: 'Heavy menstrual bleeding',
    menopausalStatus: 'Pre-menopausal',
    screeningStatus: 'Up to date'
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    symptomScore: 22,
    primaryConcern: 'Post-menopausal bleeding',
    menopausalStatus: 'Post-menopausal',
    screeningStatus: 'Overdue'
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, Sarah',
    symptomScore: 0,
    primaryConcern: 'Contraception review',
    menopausalStatus: 'Pre-menopausal',
    screeningStatus: 'Up to date'
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Rachel',
    symptomScore: 26,
    primaryConcern: 'Severe dysmenorrhoea with suspected endometriosis',
    menopausalStatus: 'Pre-menopausal',
    screeningStatus: 'Up to date'
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, Helen',
    symptomScore: 8,
    primaryConcern: 'Irregular periods',
    menopausalStatus: 'Peri-menopausal',
    screeningStatus: 'Up to date'
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Catherine',
    symptomScore: 16,
    primaryConcern: 'Pelvic pain and abnormal discharge',
    menopausalStatus: 'Pre-menopausal',
    screeningStatus: 'Abnormal result'
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Angela',
    symptomScore: 5,
    primaryConcern: 'Urinary incontinence',
    menopausalStatus: 'Post-menopausal',
    screeningStatus: 'Up to date'
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Laura',
    symptomScore: 18,
    primaryConcern: 'Ovarian cyst follow-up',
    menopausalStatus: 'Pre-menopausal',
    screeningStatus: 'Up to date'
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Jennifer',
    symptomScore: 2,
    primaryConcern: 'HRT review',
    menopausalStatus: 'Post-menopausal',
    screeningStatus: 'Up to date'
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Claire',
    symptomScore: 12,
    primaryConcern: 'PCOS management',
    menopausalStatus: 'Pre-menopausal',
    screeningStatus: 'Overdue'
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, Patricia',
    symptomScore: 24,
    primaryConcern: 'Fibroid-related heavy bleeding',
    menopausalStatus: 'Peri-menopausal',
    screeningStatus: 'Up to date'
  }
];

export { samplePatients };
