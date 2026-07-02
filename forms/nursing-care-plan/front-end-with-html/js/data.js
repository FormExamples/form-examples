// Sample care-plan data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows spanning every completeness status, a range of
// completeness percentages, care settings, problem counts, and high-priority
// flag counts. Identifiers use the canonical NHS "NNN NNN NNNN" display form.

(function () {
'use strict';
window.NursingCarePlanDashboard = window.NursingCarePlanDashboard || {};

/** @type {import('./dashboard-types.js').PlanRow[]} */
const samplePlans = [
  { id: '1',  patientIdentifier: '943 476 5919', patientName: 'Smith, John',        wardLocation: 'Ward 12',      careSetting: 'ward',       status: 'complete',   completenessPercent: 100, problemCount: 3, flagCount: 0 },
  { id: '2',  patientIdentifier: '721 938 4102', patientName: 'Patel, Priya',       wardLocation: 'Ward 7',       careSetting: 'ward',       status: 'partial',    completenessPercent: 67,  problemCount: 2, flagCount: 0 },
  { id: '3',  patientIdentifier: '384 615 7230', patientName: 'Jones, Margaret',    wardLocation: 'Bramble Unit', careSetting: 'care-home',  status: 'partial',    completenessPercent: 56,  problemCount: 3, flagCount: 1 },
  { id: '4',  patientIdentifier: '512 847 9063', patientName: 'Williams, David',    wardLocation: 'District',     careSetting: 'community',  status: 'incomplete', completenessPercent: 0,   problemCount: 1, flagCount: 0 },
  { id: '5',  patientIdentifier: '167 293 8451', patientName: 'Brown, Sarah',       wardLocation: 'Ward 3',       careSetting: 'ward',       status: 'partial',    completenessPercent: 44,  problemCount: 3, flagCount: 2 },
  { id: '6',  patientIdentifier: '835 162 4097', patientName: 'Taylor, James',      wardLocation: 'Ward 12',      careSetting: 'ward',       status: 'complete',   completenessPercent: 100, problemCount: 2, flagCount: 0 },
  { id: '7',  patientIdentifier: '294 708 5316', patientName: 'Davies, Helen',      wardLocation: 'Meadow House', careSetting: 'hospice',    status: 'partial',    completenessPercent: 78,  problemCount: 3, flagCount: 0 },
  { id: '8',  patientIdentifier: '608 341 2975', patientName: 'Wilson, Robert',     wardLocation: 'Ward 7',       careSetting: 'ward',       status: 'partial',    completenessPercent: 50,  problemCount: 2, flagCount: 1 },
  { id: '9',  patientIdentifier: '473 926 1084', patientName: 'Evans, Catherine',   wardLocation: 'District',     careSetting: 'community',  status: 'incomplete', completenessPercent: 0,   problemCount: 2, flagCount: 0 },
  { id: '10', patientIdentifier: '742 051 3896', patientName: 'Robinson, Emma',     wardLocation: 'Ward 3',       careSetting: 'ward',       status: 'complete',   completenessPercent: 100, problemCount: 4, flagCount: 0 },
  { id: '11', patientIdentifier: '386 219 5740', patientName: 'Clark, George',      wardLocation: 'Bramble Unit', careSetting: 'care-home',  status: 'partial',    completenessPercent: 33,  problemCount: 3, flagCount: 2 },
  { id: '12', patientIdentifier: '618 305 9247', patientName: 'Hall, Richard',      wardLocation: 'Ward 12',      careSetting: 'ward',       status: 'incomplete', completenessPercent: 0,   problemCount: 0, flagCount: 0 }
];

window.NursingCarePlanDashboard.samplePlans = samplePlans;
})();
