// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every severity category (Mild / Moderate /
// Severe / Critical), every dementia type (Alzheimer's, Vascular, Lewy
// Body, Mixed, Frontotemporal, None), and every residential setting (Own
// Home, Family Carer, Residential Care, Nursing Home, Hospital). NHS
// numbers are in the canonical "NNN NNN NNNN" display form.

(function () {
'use strict';
window.SundownerSyndromeAssessmentDashboard =
  window.SundownerSyndromeAssessmentDashboard || {};

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Ashford, Eleanor',
    age: 78,
    cmaiScore: 38,
    npiScore: 14,
    severity: 'Mild',
    dementiaType: "Alzheimer's",
    residentialSetting: 'Own Home',
    managementPlan: 'Daylight exposure, structured routine, carer education on redirection.'
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Beresford, Harold',
    age: 82,
    cmaiScore: 42,
    npiScore: 18,
    severity: 'Mild',
    dementiaType: 'Vascular',
    residentialSetting: 'Family Carer',
    managementPlan: 'Evening calm-environment protocol; review BP medications timing.'
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Cartwright, Margaret',
    age: 85,
    cmaiScore: 58,
    npiScore: 32,
    severity: 'Moderate',
    dementiaType: "Alzheimer's",
    residentialSetting: 'Residential Care',
    managementPlan: 'Bright-light therapy 9-11am; trial low-dose melatonin; carer respite.'
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Donnelly, Patrick',
    age: 76,
    cmaiScore: 64,
    npiScore: 41,
    severity: 'Moderate',
    dementiaType: 'Lewy Body',
    residentialSetting: 'Own Home',
    managementPlan: 'Avoid antipsychotics (Lewy body sensitivity); review acetylcholinesterase inhibitor.'
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Edwards, Sarah',
    age: 81,
    cmaiScore: 71,
    npiScore: 48,
    severity: 'Moderate',
    dementiaType: 'Mixed',
    residentialSetting: 'Family Carer',
    managementPlan: 'Refer community mental health; structured afternoon activity; reassess sleep.'
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Fitzgerald, James',
    age: 79,
    cmaiScore: 84,
    npiScore: 62,
    severity: 'Severe',
    dementiaType: "Alzheimer's",
    residentialSetting: 'Nursing Home',
    managementPlan: 'Behavioural plan; environmental modification; safety assessment for falls and exits.'
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Greaves, Helen',
    age: 87,
    cmaiScore: 92,
    npiScore: 71,
    severity: 'Severe',
    dementiaType: 'Vascular',
    residentialSetting: 'Nursing Home',
    managementPlan: 'Multidisciplinary review; consider trazodone trial; document agitation triggers.'
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Hartley, Robert',
    age: 73,
    cmaiScore: 108,
    npiScore: 85,
    severity: 'Severe',
    dementiaType: 'Frontotemporal',
    residentialSetting: 'Residential Care',
    managementPlan: 'SSRI trial; escalate to old-age psychiatry; ensure 1:1 supervision in evenings.'
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Ingram, Catherine',
    age: 89,
    cmaiScore: 134,
    npiScore: 102,
    severity: 'Critical',
    dementiaType: "Alzheimer's",
    residentialSetting: 'Hospital',
    managementPlan: 'Acute admission; 1:1 nursing; rule out delirium causes; safeguarding review.'
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Jenkins, Michael',
    age: 84,
    cmaiScore: 142,
    npiScore: 118,
    severity: 'Critical',
    dementiaType: 'Lewy Body',
    residentialSetting: 'Hospital',
    managementPlan: 'Constant supervision; cautious low-dose quetiapine if essential; family meeting.'
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Kowalski, Emma',
    age: 80,
    cmaiScore: 156,
    npiScore: 129,
    severity: 'Critical',
    dementiaType: 'Mixed',
    residentialSetting: 'Nursing Home',
    managementPlan: 'Specialist behavioural unit referral; advance care planning discussion.'
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Lawson, George',
    age: 71,
    cmaiScore: 35,
    npiScore: 9,
    severity: 'Mild',
    dementiaType: 'None',
    residentialSetting: 'Own Home',
    managementPlan: 'Investigate non-dementia causes; sleep hygiene; review ADLs and hearing/vision.'
  }
];

window.SundownerSyndromeAssessmentDashboard.samplePatients = samplePatients;
})();
