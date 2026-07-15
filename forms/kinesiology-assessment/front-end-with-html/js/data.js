// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic athletes / patients spanning the full FMS 0-21 range,
// with a mix of pain reports, left/right asymmetries, and occupations
// (athlete, manual labour, sedentary). NHS numbers are in the canonical
// "NNN NNN NNNN" display form.
//
// `riskBand` is precomputed here from `fmsScore` using the standard FMS
// threshold (<=14 = at-risk). Painful tests are counted out of 7 movement
// patterns; asymmetric tests are counted out of 5 bilateral patterns
// (hurdle step, in-line lunge, shoulder mobility, ASLR, rotary stability).

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, John',
    occupation: 'Athlete (football)',
    fmsScore: 21,
    riskBand: 'low-risk',
    painfulTests: 0,
    asymmetricTests: 0
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    occupation: 'Athlete (distance running)',
    fmsScore: 19,
    riskBand: 'low-risk',
    painfulTests: 0,
    asymmetricTests: 1
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    occupation: 'Sedentary (office worker)',
    fmsScore: 8,
    riskBand: 'at-risk',
    painfulTests: 2,
    asymmetricTests: 3
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    occupation: 'Athlete (swimming)',
    fmsScore: 20,
    riskBand: 'low-risk',
    painfulTests: 0,
    asymmetricTests: 0
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    occupation: 'Manual labour (warehouse)',
    fmsScore: 6,
    riskBand: 'at-risk',
    painfulTests: 3,
    asymmetricTests: 2
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    occupation: 'Athlete (rugby)',
    fmsScore: 16,
    riskBand: 'low-risk',
    painfulTests: 0,
    asymmetricTests: 2
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    occupation: 'Manual labour (construction)',
    fmsScore: 12,
    riskBand: 'at-risk',
    painfulTests: 2,
    asymmetricTests: 2
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    occupation: 'Athlete (basketball)',
    fmsScore: 15,
    riskBand: 'low-risk',
    painfulTests: 0,
    asymmetricTests: 1
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    occupation: 'Sedentary (call-centre agent)',
    fmsScore: 10,
    riskBand: 'at-risk',
    painfulTests: 1,
    asymmetricTests: 3
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    occupation: 'Athlete (cricket)',
    fmsScore: 18,
    riskBand: 'low-risk',
    painfulTests: 0,
    asymmetricTests: 1
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    occupation: 'Manual labour (landscaping)',
    fmsScore: 9,
    riskBand: 'at-risk',
    painfulTests: 2,
    asymmetricTests: 4
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    occupation: 'Sedentary (software engineer)',
    fmsScore: 14,
    riskBand: 'at-risk',
    painfulTests: 1,
    asymmetricTests: 2
  }
];

export { samplePatients };
