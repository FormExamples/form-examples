// Sample donor data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every eligibility classification and risk
// level, mixes living and deceased donors (DBD / DCD), covers the full
// organ list (kidney, liver, heart, lung, pancreas, intestine), and varies
// ABO compatibility and HLA match grade. NHS numbers are in the canonical
// "NNN NNN NNNN" display form.

(function () {
'use strict';
window.OrganDonationAssessmentDashboard =
  window.OrganDonationAssessmentDashboard || {};

/** @type {import('./types.js').DonorRow[]} */
const sampleDonors = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    donorName: 'Smith, Jane',
    donorType: 'Living',
    organ: 'Kidney',
    aboCompatibility: 'Compatible',
    hlaMatch: '10/10',
    eligibility: 'Suitable',
    riskLevel: 'Low'
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    donorName: 'Patel, Priya',
    donorType: 'Living',
    organ: 'Liver',
    aboCompatibility: 'Compatible',
    hlaMatch: '9/10',
    eligibility: 'Suitable',
    riskLevel: 'Low'
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    donorName: 'Jones, Margaret',
    donorType: 'DBD',
    organ: 'Heart',
    aboCompatibility: 'Compatible',
    hlaMatch: '8/10',
    eligibility: 'Conditionally Suitable',
    riskLevel: 'Moderate'
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    donorName: 'Williams, David',
    donorType: 'DBD',
    organ: 'Lung',
    aboCompatibility: 'Compatible',
    hlaMatch: '10/10',
    eligibility: 'Suitable',
    riskLevel: 'Low'
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    donorName: 'Brown, Sarah',
    donorType: 'DCD',
    organ: 'Kidney',
    aboCompatibility: 'Incompatible',
    hlaMatch: '<7/10',
    eligibility: 'Unsuitable',
    riskLevel: 'Critical'
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    donorName: 'Taylor, James',
    donorType: 'DBD',
    organ: 'Pancreas',
    aboCompatibility: 'Compatible',
    hlaMatch: '9/10',
    eligibility: 'Suitable',
    riskLevel: 'Low'
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    donorName: 'Davies, Helen',
    donorType: 'DCD',
    organ: 'Liver',
    aboCompatibility: 'Incompatible',
    hlaMatch: '7/10',
    eligibility: 'Unsuitable',
    riskLevel: 'Critical'
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    donorName: 'Wilson, Robert',
    donorType: 'DBD',
    organ: 'Kidney',
    aboCompatibility: 'Compatible',
    hlaMatch: '8/10',
    eligibility: 'Conditionally Suitable',
    riskLevel: 'Moderate'
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    donorName: 'Evans, Catherine',
    donorType: 'DCD',
    organ: 'Intestine',
    aboCompatibility: 'Compatible',
    hlaMatch: '7/10',
    eligibility: 'Conditionally Suitable',
    riskLevel: 'High'
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    donorName: 'Thomas, Michael',
    donorType: 'Living',
    organ: 'Kidney',
    aboCompatibility: 'Compatible',
    hlaMatch: '10/10',
    eligibility: 'Suitable',
    riskLevel: 'Low'
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    donorName: 'Robinson, Emma',
    donorType: 'DBD',
    organ: 'Heart',
    aboCompatibility: 'Compatible',
    hlaMatch: '8/10',
    eligibility: 'Conditionally Suitable',
    riskLevel: 'High'
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    donorName: 'Clark, George',
    donorType: 'DCD',
    organ: 'Lung',
    aboCompatibility: 'Incompatible',
    hlaMatch: '<7/10',
    eligibility: 'Unsuitable',
    riskLevel: 'Critical'
  }
];

window.OrganDonationAssessmentDashboard.sampleDonors = sampleDonors;
})();
