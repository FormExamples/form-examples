// Sample screening data for the dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows spanning every overall outcome, referral status, and
// sample-quality combination; NHS numbers in the canonical "NNN NNN NNNN" form.

(function () {
'use strict';
window.NewbornBloodSpotScreeningDashboard = window.NewbornBloodSpotScreeningDashboard || {};

/** @type {import('./types.js').ScreeningRow[]} */
const sampleScreenings = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    babyName: 'Baby Ahmed',
    overallOutcome: 'all-not-suspected',
    referralStatus: 'routine',
    ageAtSampleDays: 5,
    sampleAdequate: true,
    suspectedCount: 0,
    carrierFlag: false
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    babyName: 'Baby Okafor',
    overallOutcome: 'referral-required',
    referralStatus: 'urgent',
    ageAtSampleDays: 6,
    sampleAdequate: true,
    suspectedCount: 1,
    carrierFlag: false
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    babyName: 'Baby Nguyen',
    overallOutcome: 'repeat-required',
    referralStatus: 'repeat',
    ageAtSampleDays: 4,
    sampleAdequate: false,
    suspectedCount: 0,
    carrierFlag: false
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    babyName: 'Baby Kowalski',
    overallOutcome: 'all-not-suspected',
    referralStatus: 'routine',
    ageAtSampleDays: 7,
    sampleAdequate: true,
    suspectedCount: 0,
    carrierFlag: true
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    babyName: 'Baby Rossi',
    overallOutcome: 'referral-required',
    referralStatus: 'urgent',
    ageAtSampleDays: 8,
    sampleAdequate: true,
    suspectedCount: 2,
    carrierFlag: true
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    babyName: 'Baby Thompson',
    overallOutcome: 'incomplete',
    referralStatus: 'routine',
    ageAtSampleDays: 5,
    sampleAdequate: true,
    suspectedCount: 0,
    carrierFlag: false
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    babyName: 'Baby Patel',
    overallOutcome: 'all-not-suspected',
    referralStatus: 'routine',
    ageAtSampleDays: 6,
    sampleAdequate: true,
    suspectedCount: 0,
    carrierFlag: false
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    babyName: 'Baby Murphy',
    overallOutcome: 'declined-only-outstanding',
    referralStatus: 'routine',
    ageAtSampleDays: 5,
    sampleAdequate: true,
    suspectedCount: 0,
    carrierFlag: false
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    babyName: 'Baby Williams',
    overallOutcome: 'repeat-required',
    referralStatus: 'repeat',
    ageAtSampleDays: 9,
    sampleAdequate: true,
    suspectedCount: 0,
    carrierFlag: false
  },
  {
    id: '10',
    nhsNumber: '742 051 3896',
    babyName: 'Baby Chen',
    overallOutcome: 'all-not-suspected',
    referralStatus: 'routine',
    ageAtSampleDays: 5,
    sampleAdequate: true,
    suspectedCount: 0,
    carrierFlag: false
  },
  {
    id: '11',
    nhsNumber: '386 219 5740',
    babyName: 'Baby Ivanova',
    overallOutcome: 'referral-required',
    referralStatus: 'urgent',
    ageAtSampleDays: 6,
    sampleAdequate: false,
    suspectedCount: 1,
    carrierFlag: false
  },
  {
    id: '12',
    nhsNumber: '618 305 9247',
    babyName: 'Baby Santos',
    overallOutcome: 'incomplete',
    referralStatus: 'routine',
    ageAtSampleDays: null,
    sampleAdequate: true,
    suspectedCount: 0,
    carrierFlag: false
  }
];

window.NewbornBloodSpotScreeningDashboard.sampleScreenings = sampleScreenings;
})();
