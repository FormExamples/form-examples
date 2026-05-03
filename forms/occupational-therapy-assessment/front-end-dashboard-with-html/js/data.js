// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every COPM score band (significant /
// moderate / good) across both performance and satisfaction, with a varied
// mix of diagnoses and priority areas; NHS numbers are in the canonical
// "NNN NNN NNNN" display form.

(function () {
'use strict';
window.OccupationalTherapyAssessmentDashboard =
  window.OccupationalTherapyAssessmentDashboard || {};

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, John',
    performanceScore: 3.2,
    satisfactionScore: 2.8,
    primaryDiagnosis: 'Right hip replacement',
    priorityArea: 'Self-care'
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    performanceScore: 6.4,
    satisfactionScore: 5.6,
    primaryDiagnosis: 'Rheumatoid arthritis',
    priorityArea: 'Household management'
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    performanceScore: 2.0,
    satisfactionScore: 1.8,
    primaryDiagnosis: 'Stroke - left hemiplegia',
    priorityArea: 'Mobility'
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    performanceScore: 8.6,
    satisfactionScore: 8.2,
    primaryDiagnosis: 'Post-surgical rehabilitation',
    priorityArea: 'Return to work'
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    performanceScore: 4.2,
    satisfactionScore: 3.4,
    primaryDiagnosis: 'Multiple sclerosis',
    priorityArea: 'Fatigue management'
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    performanceScore: 7.8,
    satisfactionScore: 7.2,
    primaryDiagnosis: 'Carpal tunnel syndrome',
    priorityArea: 'Fine motor tasks'
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    performanceScore: 3.6,
    satisfactionScore: 3.0,
    primaryDiagnosis: 'Traumatic brain injury',
    priorityArea: 'Cognitive rehabilitation'
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    performanceScore: 5.8,
    satisfactionScore: 5.4,
    primaryDiagnosis: 'Chronic pain syndrome',
    priorityArea: 'Pain management'
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    performanceScore: 4.0,
    satisfactionScore: 3.6,
    primaryDiagnosis: 'Spinal cord injury - T12',
    priorityArea: 'Community access'
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    performanceScore: 9.0,
    satisfactionScore: 8.8,
    primaryDiagnosis: 'Minor hand fracture',
    priorityArea: 'Grip strength'
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    performanceScore: 5.0,
    satisfactionScore: 4.6,
    primaryDiagnosis: 'Parkinson disease',
    priorityArea: 'Self-care and dressing'
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    performanceScore: 2.4,
    satisfactionScore: 2.0,
    primaryDiagnosis: 'Severe dementia',
    priorityArea: 'Safety and supervision'
  }
];

window.OccupationalTherapyAssessmentDashboard.samplePatients = samplePatients;
})();
