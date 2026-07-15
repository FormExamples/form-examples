// Sample patient data for the clinician dashboard.
//
// Mirrors what the SvelteKit dashboard's `src/lib/data.ts` would expose so
// the two implementations show identical demo content when the backend is
// offline. Twelve realistic rows: spans every MUST risk category and every
// overall risk level, with a mix of BMI values and nutritional-support
// flags; NHS numbers in the canonical "NNN NNN NNNN" display form.

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, Jane',
    mustTotalScore: 0,
    mustRiskCategory: 'low',
    overallRiskLevel: 'low',
    bmi: 22.4,
    nutritionalSupportFlag: false
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    mustTotalScore: 1,
    mustRiskCategory: 'medium',
    overallRiskLevel: 'moderate',
    bmi: 19.1,
    nutritionalSupportFlag: false
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    mustTotalScore: 4,
    mustRiskCategory: 'high',
    overallRiskLevel: 'high',
    bmi: 17.8,
    nutritionalSupportFlag: true
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    mustTotalScore: 0,
    mustRiskCategory: 'low',
    overallRiskLevel: 'low',
    bmi: 24.7,
    nutritionalSupportFlag: false
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    mustTotalScore: 6,
    mustRiskCategory: 'high',
    overallRiskLevel: 'critical',
    bmi: 14.9,
    nutritionalSupportFlag: true
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    mustTotalScore: 0,
    mustRiskCategory: 'low',
    overallRiskLevel: 'low',
    bmi: 26.3,
    nutritionalSupportFlag: false
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    mustTotalScore: 5,
    mustRiskCategory: 'high',
    overallRiskLevel: 'critical',
    bmi: 15.6,
    nutritionalSupportFlag: true
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    mustTotalScore: 1,
    mustRiskCategory: 'medium',
    overallRiskLevel: 'moderate',
    bmi: 19.8,
    nutritionalSupportFlag: false
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    mustTotalScore: 2,
    mustRiskCategory: 'high',
    overallRiskLevel: 'high',
    bmi: 18.2,
    nutritionalSupportFlag: false
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    mustTotalScore: 0,
    mustRiskCategory: 'low',
    overallRiskLevel: 'low',
    bmi: 23.1,
    nutritionalSupportFlag: false
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    mustTotalScore: 1,
    mustRiskCategory: 'medium',
    overallRiskLevel: 'moderate',
    bmi: 19.5,
    nutritionalSupportFlag: true
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    mustTotalScore: 3,
    mustRiskCategory: 'high',
    overallRiskLevel: 'high',
    bmi: 16.4,
    nutritionalSupportFlag: true
  }
];

export { samplePatients };
