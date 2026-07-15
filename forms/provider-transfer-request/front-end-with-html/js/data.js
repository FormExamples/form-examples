// Sample transfer-request data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every completeness level and urgency band,
// with acknowledgement status set for a subset; NHS numbers in the canonical
// "NNN NNN NNNN" display form.

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, Jane',
    requestingProvider: 'Dr A. Khan, Acute Medicine',
    receivingProvider: 'Cardiology Ward 4B',
    urgency: 'Routine',
    completeness: 'Complete',
    acknowledged: true
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    requestingProvider: 'Dr S. Roberts, A&E',
    receivingProvider: 'Stroke Unit',
    urgency: 'Emergency',
    completeness: 'Partial',
    acknowledged: false
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    requestingProvider: 'Dr M. Chen, General Practice',
    receivingProvider: 'Oncology Outpatients',
    urgency: 'Urgent',
    completeness: 'Incomplete',
    acknowledged: false
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    requestingProvider: 'Dr L. Brown, Respiratory',
    receivingProvider: 'Rehabilitation Ward 7',
    urgency: 'Routine',
    completeness: 'Complete',
    acknowledged: true
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    requestingProvider: 'Dr R. Patel, A&E',
    receivingProvider: 'ITU',
    urgency: 'Emergency',
    completeness: 'Incomplete',
    acknowledged: false
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    requestingProvider: 'Dr H. Davies, Surgical Assessment',
    receivingProvider: 'Orthopaedic Ward 3',
    urgency: 'Routine',
    completeness: 'Complete',
    acknowledged: true
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    requestingProvider: 'Dr E. Nakamura, A&E',
    receivingProvider: 'Cardiac ICU',
    urgency: 'Emergency',
    completeness: 'Partial',
    acknowledged: true
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    requestingProvider: 'Dr T. Murphy, Acute Medicine',
    receivingProvider: 'Renal Ward 2',
    urgency: 'Urgent',
    completeness: 'Complete',
    acknowledged: false
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    requestingProvider: 'Dr P. Singh, General Practice',
    receivingProvider: 'Mental Health Liaison',
    urgency: 'Urgent',
    completeness: 'Partial',
    acknowledged: false
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    requestingProvider: 'Dr V. Owusu, Surgical Assessment',
    receivingProvider: 'Vascular Surgery',
    urgency: 'Routine',
    completeness: 'Complete',
    acknowledged: true
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    requestingProvider: 'Dr K. Green, Paediatrics',
    receivingProvider: 'Paediatric HDU',
    urgency: 'Urgent',
    completeness: 'Incomplete',
    acknowledged: false
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    requestingProvider: 'Dr J. Hughes, Geriatric Medicine',
    receivingProvider: 'Community Hospital — Step Down',
    urgency: 'Routine',
    completeness: 'Partial',
    acknowledged: true
  }
];

export { samplePatients };
