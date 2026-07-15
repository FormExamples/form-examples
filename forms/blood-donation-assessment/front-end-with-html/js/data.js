// Sample donor data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every eligibility status and vital-signs
// band, with risk flags set for a subset; NHS numbers in the canonical
// "NNN NNN NNNN" display form. Hemoglobin values in g/dL: <12.5 (female)
// and <13.5 (male) are typical JPAC deferral thresholds, captured here as
// "Out of Range" vital-sign status.

/** @type {import('./types.js').DonorRow[]} */
const sampleDonors = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    donorName: 'Smith, Jane',
    eligibility: 'Eligible',
    hemoglobinGdl: 13.8,
    vitalsStatus: 'Normal',
    riskFlag: false
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    donorName: 'Patel, Priya',
    eligibility: 'Temporarily Deferred',
    hemoglobinGdl: 12.2,
    vitalsStatus: 'Out of Range',
    riskFlag: false
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    donorName: 'Jones, Margaret',
    eligibility: 'Permanently Deferred',
    hemoglobinGdl: 13.0,
    vitalsStatus: 'Normal',
    riskFlag: true
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    donorName: 'Williams, David',
    eligibility: 'Eligible',
    hemoglobinGdl: 15.1,
    vitalsStatus: 'Normal',
    riskFlag: false
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    donorName: 'Brown, Sarah',
    eligibility: 'Temporarily Deferred',
    hemoglobinGdl: 11.8,
    vitalsStatus: 'Out of Range',
    riskFlag: true
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    donorName: 'Taylor, James',
    eligibility: 'Eligible',
    hemoglobinGdl: 14.7,
    vitalsStatus: 'Normal',
    riskFlag: false
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    donorName: 'Davies, Helen',
    eligibility: 'Permanently Deferred',
    hemoglobinGdl: 12.9,
    vitalsStatus: 'Borderline',
    riskFlag: true
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    donorName: 'Wilson, Robert',
    eligibility: 'Eligible',
    hemoglobinGdl: 14.3,
    vitalsStatus: 'Borderline',
    riskFlag: false
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    donorName: 'Evans, Catherine',
    eligibility: 'Temporarily Deferred',
    hemoglobinGdl: 12.6,
    vitalsStatus: 'Normal',
    riskFlag: true
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    donorName: 'Thomas, Michael',
    eligibility: 'Eligible',
    hemoglobinGdl: 15.4,
    vitalsStatus: 'Normal',
    riskFlag: false
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    donorName: 'Robinson, Emma',
    eligibility: 'Temporarily Deferred',
    hemoglobinGdl: 13.1,
    vitalsStatus: 'Borderline',
    riskFlag: true
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    donorName: 'Clark, George',
    eligibility: 'Permanently Deferred',
    hemoglobinGdl: 14.0,
    vitalsStatus: 'Out of Range',
    riskFlag: false
  }
];

export { sampleDonors };
