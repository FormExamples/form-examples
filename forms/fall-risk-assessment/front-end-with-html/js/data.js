// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every severity band (Low / Moderate / High /
// Critical) and every ward (Geriatric, Orthopaedic, Stroke, Surgical,
// Neurology, Community), with anticoagulant + recent-fall flags set so the
// Critical-tier rule (recurrent falls with injury OR anticoagulated OR
// MFS >= 75) is visible across multiple example patients. NHS numbers are in
// the canonical "NNN NNN NNNN" display form.

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, Jane',
    mfsScore: 15,
    severity: 'Low',
    ward: 'Community',
    anticoagulant: false,
    recentFall: false
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    mfsScore: 20,
    severity: 'Low',
    ward: 'Surgical',
    anticoagulant: false,
    recentFall: false
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    mfsScore: 30,
    severity: 'Moderate',
    ward: 'Geriatric',
    anticoagulant: false,
    recentFall: true
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    mfsScore: 35,
    severity: 'Moderate',
    ward: 'Orthopaedic',
    anticoagulant: false,
    recentFall: false
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    mfsScore: 40,
    severity: 'Moderate',
    ward: 'Neurology',
    anticoagulant: false,
    recentFall: true
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    mfsScore: 50,
    severity: 'High',
    ward: 'Stroke',
    anticoagulant: false,
    recentFall: false
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    mfsScore: 60,
    severity: 'High',
    ward: 'Geriatric',
    anticoagulant: false,
    recentFall: true
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    mfsScore: 65,
    severity: 'High',
    ward: 'Orthopaedic',
    anticoagulant: false,
    recentFall: false
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    mfsScore: 55,
    severity: 'Critical',
    ward: 'Stroke',
    anticoagulant: true,
    recentFall: true
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    mfsScore: 80,
    severity: 'Critical',
    ward: 'Geriatric',
    anticoagulant: false,
    recentFall: true
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    mfsScore: 45,
    severity: 'Critical',
    ward: 'Neurology',
    anticoagulant: true,
    recentFall: false
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    mfsScore: 95,
    severity: 'Critical',
    ward: 'Community',
    anticoagulant: true,
    recentFall: true
  }
];

export { samplePatients };
