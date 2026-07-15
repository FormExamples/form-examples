// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every disturbance severity and primary
// affected axis, with flagged-issue counts varying from zero to many; NHS
// numbers in the canonical "NNN NNN NNNN" display form.

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, Jane',
    primaryAxis: 'Thyroid',
    severity: 'Mild',
    flaggedIssuesCount: 1,
    lastReviewDate: '2026-03-12'
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    primaryAxis: 'Reproductive',
    severity: 'Moderate',
    flaggedIssuesCount: 2,
    lastReviewDate: '2026-02-28'
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    primaryAxis: 'Adrenal',
    severity: 'Severe',
    flaggedIssuesCount: 5,
    lastReviewDate: '2026-04-08'
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    primaryAxis: 'Glucose',
    severity: 'Moderate',
    flaggedIssuesCount: 3,
    lastReviewDate: '2026-01-19'
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    primaryAxis: 'Pituitary',
    severity: 'Severe',
    flaggedIssuesCount: 6,
    lastReviewDate: '2026-04-22'
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    primaryAxis: 'None',
    severity: 'Normal',
    flaggedIssuesCount: 0,
    lastReviewDate: '2026-03-30'
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    primaryAxis: 'Thyroid',
    severity: 'Subclinical',
    flaggedIssuesCount: 1,
    lastReviewDate: '2026-02-14'
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    primaryAxis: 'Bone & Calcium',
    severity: 'Mild',
    flaggedIssuesCount: 2,
    lastReviewDate: '2025-12-09'
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    primaryAxis: 'Adrenal',
    severity: 'Moderate',
    flaggedIssuesCount: 3,
    lastReviewDate: '2026-04-01'
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    primaryAxis: 'Glucose',
    severity: 'Mild',
    flaggedIssuesCount: 1,
    lastReviewDate: '2026-03-17'
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    primaryAxis: 'Reproductive',
    severity: 'Subclinical',
    flaggedIssuesCount: 0,
    lastReviewDate: '2026-04-25'
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    primaryAxis: 'Thyroid',
    severity: 'Severe',
    flaggedIssuesCount: 4,
    lastReviewDate: '2026-04-19'
  }
];

export { samplePatients };
