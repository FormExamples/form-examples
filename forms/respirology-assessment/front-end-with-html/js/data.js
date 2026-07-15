// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans the full MRC Dyspnoea Scale (1-5), a mix of
// primary respiratory conditions, and oxygen statuses ranging from room air
// to LTOT + non-invasive ventilation; NHS numbers in the canonical
// "NNN NNN NNNN" display form.

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, John',
    mrcGrade: 1,
    primaryCondition: 'Mild asthma',
    oxygenStatus: 'Room air'
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    mrcGrade: 2,
    primaryCondition: 'COPD (mild)',
    oxygenStatus: 'Room air'
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    mrcGrade: 3,
    primaryCondition: 'COPD (moderate)',
    oxygenStatus: 'Room air'
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    mrcGrade: 4,
    primaryCondition: 'COPD (severe)',
    oxygenStatus: 'LTOT 2L/min'
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    mrcGrade: 5,
    primaryCondition: 'IPF',
    oxygenStatus: 'LTOT 4L/min'
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    mrcGrade: 2,
    primaryCondition: 'Bronchiectasis',
    oxygenStatus: 'Room air'
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    mrcGrade: 3,
    primaryCondition: 'Asthma (severe)',
    oxygenStatus: 'Room air'
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    mrcGrade: 1,
    primaryCondition: 'Post-pneumonia review',
    oxygenStatus: 'Room air'
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    mrcGrade: 4,
    primaryCondition: 'ILD (sarcoidosis)',
    oxygenStatus: 'Ambulatory O2'
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    mrcGrade: 2,
    primaryCondition: 'OSA',
    oxygenStatus: 'CPAP'
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    mrcGrade: 3,
    primaryCondition: 'COPD + bronchiectasis',
    oxygenStatus: 'Room air'
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    mrcGrade: 5,
    primaryCondition: 'End-stage COPD',
    oxygenStatus: 'LTOT + BiPAP'
  }
];

export { samplePatients };
