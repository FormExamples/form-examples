// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every UKMEC category (1-4) and every review
// status (Pending, Requires review, Urgent, Completed), with a varied mix
// of preferred and current contraceptive methods. NHS numbers in the
// canonical "NNN NNN NNNN" display form.

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, Emma',
    ukmecCategory: 1,
    preferredMethod: 'Combined oral contraceptive',
    currentMethod: 'None',
    reviewStatus: 'Pending'
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Anita',
    ukmecCategory: 3,
    preferredMethod: 'Combined oral contraceptive',
    currentMethod: 'Progestogen-only pill',
    reviewStatus: 'Requires review'
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Catherine',
    ukmecCategory: 4,
    preferredMethod: 'Combined oral contraceptive',
    currentMethod: 'None',
    reviewStatus: 'Urgent'
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, Sarah',
    ukmecCategory: 1,
    preferredMethod: 'Copper IUD',
    currentMethod: 'Barrier methods',
    reviewStatus: 'Completed'
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Lisa',
    ukmecCategory: 2,
    preferredMethod: 'LNG-IUS',
    currentMethod: 'Combined oral contraceptive',
    reviewStatus: 'Pending'
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, Rachel',
    ukmecCategory: 1,
    preferredMethod: 'Implant',
    currentMethod: 'None',
    reviewStatus: 'Completed'
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    ukmecCategory: 4,
    preferredMethod: 'Contraceptive patch',
    currentMethod: 'Contraceptive patch',
    reviewStatus: 'Urgent'
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Jennifer',
    ukmecCategory: 2,
    preferredMethod: 'Progestogen-only pill',
    currentMethod: 'Injectable',
    reviewStatus: 'Pending'
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Margaret',
    ukmecCategory: 3,
    preferredMethod: 'Vaginal ring',
    currentMethod: 'Combined oral contraceptive',
    reviewStatus: 'Requires review'
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Fiona',
    ukmecCategory: 1,
    preferredMethod: 'Injectable',
    currentMethod: 'Injectable',
    reviewStatus: 'Completed'
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Claire',
    ukmecCategory: 2,
    preferredMethod: 'Copper IUD',
    currentMethod: 'Natural family planning',
    reviewStatus: 'Pending'
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, Olivia',
    ukmecCategory: 1,
    preferredMethod: 'Implant',
    currentMethod: 'Implant',
    reviewStatus: 'Completed'
  }
];

export { samplePatients };
