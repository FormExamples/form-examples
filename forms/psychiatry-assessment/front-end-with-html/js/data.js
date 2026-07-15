// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every GAF band, every risk level, and both
// legal statuses; NHS numbers in the canonical "NNN NNN NNNN" display form.
// Two rows carry `riskLevel: 'imminent'` to exercise the row-level
// suicidal-ideation visual emphasis.

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, John',
    gafScore: 85,
    riskLevel: 'low',
    legalStatus: 'voluntary',
    primaryDiagnosis: 'Generalised anxiety disorder'
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    gafScore: 45,
    riskLevel: 'high',
    legalStatus: 'involuntary',
    primaryDiagnosis: 'Paranoid schizophrenia'
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    gafScore: 62,
    riskLevel: 'moderate',
    legalStatus: 'voluntary',
    primaryDiagnosis: 'Major depressive disorder'
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    gafScore: 78,
    riskLevel: 'low',
    legalStatus: 'voluntary',
    primaryDiagnosis: 'Adjustment disorder'
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    gafScore: 22,
    riskLevel: 'imminent',
    legalStatus: 'involuntary',
    primaryDiagnosis: 'Schizoaffective disorder'
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    gafScore: 91,
    riskLevel: 'none',
    legalStatus: 'voluntary',
    primaryDiagnosis: 'Mild depression (resolved)'
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    gafScore: 38,
    riskLevel: 'high',
    legalStatus: 'involuntary',
    primaryDiagnosis: 'Bipolar I disorder (manic episode)'
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    gafScore: 55,
    riskLevel: 'moderate',
    legalStatus: 'voluntary',
    primaryDiagnosis: 'PTSD'
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    gafScore: 48,
    riskLevel: 'high',
    legalStatus: 'voluntary',
    primaryDiagnosis: 'Borderline personality disorder'
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    gafScore: 72,
    riskLevel: 'low',
    legalStatus: 'voluntary',
    primaryDiagnosis: 'OCD'
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    gafScore: 58,
    riskLevel: 'moderate',
    legalStatus: 'voluntary',
    primaryDiagnosis: 'Recurrent depressive disorder'
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    gafScore: 15,
    riskLevel: 'imminent',
    legalStatus: 'involuntary',
    primaryDiagnosis: 'Acute psychosis'
  }
];

export { samplePatients };
