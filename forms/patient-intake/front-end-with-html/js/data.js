// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every risk level (low/medium/high) with
// allergy comorbidities flagged for a subset; NHS numbers in the canonical
// "NNN NNN NNNN" display form.

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, John',
    riskLevel: 'low',
    reasonForVisit: 'Annual check-up',
    allergyFlag: false
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    riskLevel: 'medium',
    reasonForVisit: 'Persistent cough for 3 weeks',
    allergyFlag: true
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    riskLevel: 'high',
    reasonForVisit: 'Chest pain and shortness of breath',
    allergyFlag: false
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    riskLevel: 'low',
    reasonForVisit: 'Prescription renewal',
    allergyFlag: false
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    riskLevel: 'high',
    reasonForVisit: 'Uncontrolled diabetes and hypertension',
    allergyFlag: true
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    riskLevel: 'low',
    reasonForVisit: 'Sports physical examination',
    allergyFlag: false
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    riskLevel: 'medium',
    reasonForVisit: 'Recurring headaches',
    allergyFlag: true
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    riskLevel: 'medium',
    reasonForVisit: 'Follow-up for hypertension management',
    allergyFlag: false
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    riskLevel: 'high',
    reasonForVisit: 'Multiple chronic conditions review',
    allergyFlag: false
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    riskLevel: 'low',
    reasonForVisit: 'Vaccination appointment',
    allergyFlag: false
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    riskLevel: 'medium',
    reasonForVisit: 'Skin rash assessment',
    allergyFlag: true
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    riskLevel: 'high',
    reasonForVisit: 'Emergency referral - cardiac symptoms',
    allergyFlag: false
  }
];

export { samplePatients };
