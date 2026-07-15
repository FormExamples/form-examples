// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every REBA risk band (Negligible, Low,
// Medium, High, Very high) with varied occupations and pain severities;
// NHS numbers in the canonical "NNN NNN NNNN" display form.

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, John',
    rebaScore: 2,
    riskLevel: 'Low risk',
    occupation: 'Software Developer',
    painSeverity: 3,
    keyFinding: 'Minor workstation setup issues'
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    rebaScore: 8,
    riskLevel: 'High risk',
    occupation: 'Data Entry Clerk',
    painSeverity: 7,
    keyFinding: 'Constant repetitive tasks with wrist deviation'
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    rebaScore: 12,
    riskLevel: 'Very high risk',
    occupation: 'Warehouse Operative',
    painSeverity: 9,
    keyFinding: 'Heavy lifting >20kg without mechanical aids'
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    rebaScore: 1,
    riskLevel: 'Negligible risk',
    occupation: 'Manager',
    painSeverity: 0,
    keyFinding: 'Good workstation setup, no issues found'
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    rebaScore: 6,
    riskLevel: 'Medium risk',
    occupation: 'Assembly Line Worker',
    painSeverity: 5,
    keyFinding: 'Frequent repetitive tasks, moderate force'
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    rebaScore: 4,
    riskLevel: 'Medium risk',
    occupation: 'Graphic Designer',
    painSeverity: 4,
    keyFinding: 'Slouched posture, monitor below eye level'
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    rebaScore: 9,
    riskLevel: 'High risk',
    occupation: 'Nurse',
    painSeverity: 8,
    keyFinding: 'Trunk flexed >60 degrees, chronic back pain'
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    rebaScore: 3,
    riskLevel: 'Low risk',
    occupation: 'Accountant',
    painSeverity: 2,
    keyFinding: 'Keyboard placement too high, minor neck flexion'
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    rebaScore: 11,
    riskLevel: 'Very high risk',
    occupation: 'Construction Worker',
    painSeverity: 8,
    keyFinding: 'Multiple posture issues, heavy manual handling'
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    rebaScore: 5,
    riskLevel: 'Medium risk',
    occupation: 'Teacher',
    painSeverity: 4,
    keyFinding: 'Prolonged standing, no breaks taken'
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    rebaScore: 7,
    riskLevel: 'Medium risk',
    occupation: 'Lab Technician',
    painSeverity: 6,
    keyFinding: 'Vibration exposure, arms abducted'
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    rebaScore: 10,
    riskLevel: 'High risk',
    occupation: 'Delivery Driver',
    painSeverity: 7,
    keyFinding: 'Constant lifting, heavy push/pull forces'
  }
];

export { samplePatients };
