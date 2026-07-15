// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: span every visual-acuity grade, all three affected-
// eye laterality values, and every IOP status; NHS numbers in the canonical
// "NNN NNN NNNN" display form.

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, John',
    vaGrade: 'normal',
    affectedEye: 'both',
    primaryCondition: 'Routine eye examination',
    iopStatus: 'Normal'
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    vaGrade: 'mild',
    affectedEye: 'right',
    primaryCondition: 'Cataract',
    iopStatus: 'Normal'
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    vaGrade: 'moderate',
    affectedEye: 'both',
    primaryCondition: 'Diabetic retinopathy',
    iopStatus: 'Raised'
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    vaGrade: 'mild',
    affectedEye: 'left',
    primaryCondition: 'Glaucoma suspect',
    iopStatus: 'Raised'
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    vaGrade: 'severe',
    affectedEye: 'right',
    primaryCondition: 'Age-related macular degeneration',
    iopStatus: 'Normal'
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    vaGrade: 'normal',
    affectedEye: 'both',
    primaryCondition: 'Dry eye syndrome',
    iopStatus: 'Normal'
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    vaGrade: 'moderate',
    affectedEye: 'both',
    primaryCondition: 'Primary open-angle glaucoma',
    iopStatus: 'Significantly raised'
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    vaGrade: 'mild',
    affectedEye: 'left',
    primaryCondition: 'Posterior capsule opacification',
    iopStatus: 'Normal'
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    vaGrade: 'blindness',
    affectedEye: 'right',
    primaryCondition: 'Retinal detachment',
    iopStatus: 'Normal'
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    vaGrade: 'normal',
    affectedEye: 'both',
    primaryCondition: 'Blepharitis',
    iopStatus: 'Normal'
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    vaGrade: 'mild',
    affectedEye: 'both',
    primaryCondition: 'Keratoconus',
    iopStatus: 'Normal'
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    vaGrade: 'severe',
    affectedEye: 'both',
    primaryCondition: 'Proliferative diabetic retinopathy',
    iopStatus: 'Raised'
  }
];

export { samplePatients };
