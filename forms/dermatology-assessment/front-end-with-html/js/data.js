// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Fifteen realistic rows: spans every DLQI severity band, with allergy
// comorbidities flagged for a subset; NHS numbers in the canonical
// "NNN NNN NNNN" display form.

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, John',
    dlqiScore: 2,
    primaryCondition: 'Mild eczema',
    severity: 'Small effect',
    allergyFlag: false
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    dlqiScore: 8,
    primaryCondition: 'Moderate psoriasis',
    severity: 'Moderate effect',
    allergyFlag: true
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    dlqiScore: 18,
    primaryCondition: 'Severe psoriasis',
    severity: 'Very large effect',
    allergyFlag: false
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    dlqiScore: 0,
    primaryCondition: 'Seborrhoeic keratosis',
    severity: 'No effect on life',
    allergyFlag: false
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    dlqiScore: 24,
    primaryCondition: 'Severe atopic dermatitis',
    severity: 'Extremely large effect',
    allergyFlag: true
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    dlqiScore: 4,
    primaryCondition: 'Acne vulgaris',
    severity: 'Small effect',
    allergyFlag: false
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    dlqiScore: 12,
    primaryCondition: 'Chronic urticaria',
    severity: 'Very large effect',
    allergyFlag: true
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    dlqiScore: 6,
    primaryCondition: 'Contact dermatitis',
    severity: 'Moderate effect',
    allergyFlag: false
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    dlqiScore: 15,
    primaryCondition: 'Hidradenitis suppurativa',
    severity: 'Very large effect',
    allergyFlag: false
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    dlqiScore: 1,
    primaryCondition: 'Mild rosacea',
    severity: 'No effect on life',
    allergyFlag: false
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    dlqiScore: 9,
    primaryCondition: 'Vitiligo',
    severity: 'Moderate effect',
    allergyFlag: true
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    dlqiScore: 22,
    primaryCondition: 'Pemphigus vulgaris',
    severity: 'Extremely large effect',
    allergyFlag: false
  }
];

export { samplePatients };
