// Sample proband data for the Genetics Assessment clinician dashboard.
//
// Twelve realistic rows spanning the three risk levels (Low / Moderate /
// High) and a mix of presenting concerns: BRCA/HBOC, Lynch/HNPCC,
// paediatric, neurogenetic, and reproductive. Targeted-scoring fields are
// populated only for the relevant referral pathway:
//
//   - Manchester Score (BRCA): integer ~15-35, with >=20 indicating strong
//     justification for testing. `null` for non-BRCA referrals.
//   - Tyrer-Cuzick lifetime breast-cancer risk: percent (0-50). `null` for
//     non-BRCA referrals.
//   - Bethesda criteria (Lynch): 'Met' / 'Not Met' / 'N/A'.
//   - PREMM5 percent (Lynch): predicted MMR-mutation probability ~1-25%.
//     `null` for non-Lynch referrals.
//
// NHS numbers are in the canonical "NNN NNN NNNN" display form.

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, John',
    riskLevel: 'Low',
    presentingConcern: 'Reproductive',
    manchesterScore: null,
    tyrerCuzickLifetime: null,
    bethesdaResult: 'N/A',
    premm5Percent: null,
    recommendedTesting: 'Carrier screening'
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    riskLevel: 'High',
    presentingConcern: 'BRCA / HBOC',
    manchesterScore: 22,
    tyrerCuzickLifetime: 32.4,
    bethesdaResult: 'N/A',
    premm5Percent: null,
    recommendedTesting: 'BRCA1/2 panel'
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    riskLevel: 'Moderate',
    presentingConcern: 'BRCA / HBOC',
    manchesterScore: 17,
    tyrerCuzickLifetime: 22.1,
    bethesdaResult: 'N/A',
    premm5Percent: null,
    recommendedTesting: 'BRCA1/2 panel'
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    riskLevel: 'High',
    presentingConcern: 'Neurogenetic',
    manchesterScore: null,
    tyrerCuzickLifetime: null,
    bethesdaResult: 'N/A',
    premm5Percent: null,
    recommendedTesting: 'Predictive testing'
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    riskLevel: 'High',
    presentingConcern: 'BRCA / HBOC',
    manchesterScore: 31,
    tyrerCuzickLifetime: 41.7,
    bethesdaResult: 'N/A',
    premm5Percent: null,
    recommendedTesting: 'HBOC extended panel'
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    riskLevel: 'Low',
    presentingConcern: 'Reproductive',
    manchesterScore: null,
    tyrerCuzickLifetime: null,
    bethesdaResult: 'N/A',
    premm5Percent: null,
    recommendedTesting: 'No testing indicated'
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    riskLevel: 'Moderate',
    presentingConcern: 'Lynch / HNPCC',
    manchesterScore: null,
    tyrerCuzickLifetime: null,
    bethesdaResult: 'Met',
    premm5Percent: 7.2,
    recommendedTesting: 'Lynch / MMR panel'
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    riskLevel: 'High',
    presentingConcern: 'Lynch / HNPCC',
    manchesterScore: null,
    tyrerCuzickLifetime: null,
    bethesdaResult: 'Met',
    premm5Percent: 18.5,
    recommendedTesting: 'Lynch / MMR panel'
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    riskLevel: 'Moderate',
    presentingConcern: 'BRCA / HBOC',
    manchesterScore: 15,
    tyrerCuzickLifetime: 19.8,
    bethesdaResult: 'N/A',
    premm5Percent: null,
    recommendedTesting: 'BRCA1/2 panel'
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    riskLevel: 'Low',
    presentingConcern: 'Paediatric',
    manchesterScore: null,
    tyrerCuzickLifetime: null,
    bethesdaResult: 'N/A',
    premm5Percent: null,
    recommendedTesting: 'No testing indicated'
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    riskLevel: 'High',
    presentingConcern: 'BRCA / HBOC',
    manchesterScore: 35,
    tyrerCuzickLifetime: 46.2,
    bethesdaResult: 'N/A',
    premm5Percent: null,
    recommendedTesting: 'HBOC extended panel'
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    riskLevel: 'Moderate',
    presentingConcern: 'Paediatric',
    manchesterScore: null,
    tyrerCuzickLifetime: null,
    bethesdaResult: 'N/A',
    premm5Percent: null,
    recommendedTesting: 'Whole-exome sequencing'
  }
];

export { samplePatients };
