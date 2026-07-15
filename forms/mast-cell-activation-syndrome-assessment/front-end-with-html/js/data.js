// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every symptom-score band (minimal, mild,
// moderate, severe), every organ-systems-affected count from 0 to 5, a
// realistic spread of serum tryptase values (in ng/mL), and the
// anaphylaxis-risk flag set on the higher-risk patients. NHS numbers are in
// the canonical "NNN NNN NNNN" display form.

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, John',
    symptomScore: 5,
    organSystemsAffected: 1,
    tryptaseLevel: '8.2',
    anaphylaxisRisk: false
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    symptomScore: 18,
    organSystemsAffected: 3,
    tryptaseLevel: '14.6',
    anaphylaxisRisk: true
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    symptomScore: 32,
    organSystemsAffected: 5,
    tryptaseLevel: '22.1',
    anaphylaxisRisk: true
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    symptomScore: 3,
    organSystemsAffected: 1,
    tryptaseLevel: '6.0',
    anaphylaxisRisk: false
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    symptomScore: 28,
    organSystemsAffected: 4,
    tryptaseLevel: '18.3',
    anaphylaxisRisk: true
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    symptomScore: 11,
    organSystemsAffected: 2,
    tryptaseLevel: '9.8',
    anaphylaxisRisk: false
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    symptomScore: 22,
    organSystemsAffected: 4,
    tryptaseLevel: '15.2',
    anaphylaxisRisk: true
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    symptomScore: 8,
    organSystemsAffected: 2,
    tryptaseLevel: '7.4',
    anaphylaxisRisk: false
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    symptomScore: 15,
    organSystemsAffected: 3,
    tryptaseLevel: '12.8',
    anaphylaxisRisk: false
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    symptomScore: 2,
    organSystemsAffected: 1,
    tryptaseLevel: '5.1',
    anaphylaxisRisk: false
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    symptomScore: 25,
    organSystemsAffected: 4,
    tryptaseLevel: '16.9',
    anaphylaxisRisk: true
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    symptomScore: 35,
    organSystemsAffected: 5,
    tryptaseLevel: '28.4',
    anaphylaxisRisk: true
  }
];

export { samplePatients };
