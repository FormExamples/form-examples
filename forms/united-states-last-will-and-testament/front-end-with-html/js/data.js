// Sample will-plan data for the drafter dashboard.
//
// One row per persona in `examples/personas.json`, graded by the engine, so the
// dashboard's offline sample data and the persona oracle cannot disagree. The
// rows span all three validity classes (valid-ready-to-execute, incomplete,
// formality-risk).

/** @type {import('./dashboard-types.js').WillRow[]} */
const sampleWills = [
  {
    id: '1',
    testatorName: 'Sullivan, Margaret Anne',
    state: 'FL',
    executionForm: 'witnessed',
    validityClass: 'valid-ready-to-execute',
    highFlagCount: 0,
    personalRepresentativeName: 'Daniel Sullivan',
    updatedAt: '2026-09-10'
  },
  {
    id: '2',
    testatorName: 'Unnamed, Draft',
    state: '—',
    executionForm: '',
    validityClass: 'incomplete',
    highFlagCount: 0,
    personalRepresentativeName: '',
    updatedAt: '2026-09-11'
  },
  {
    id: '3',
    testatorName: 'Raman, Priya',
    state: 'NY',
    executionForm: '',
    validityClass: 'incomplete',
    highFlagCount: 0,
    personalRepresentativeName: '',
    updatedAt: '2026-09-12'
  },
  {
    id: '4',
    testatorName: 'Sullivan, Margaret Anne',
    state: 'TX',
    executionForm: 'witnessed',
    validityClass: 'formality-risk',
    highFlagCount: 7,
    personalRepresentativeName: 'Daniel Sullivan',
    updatedAt: '2026-09-13'
  },
  {
    id: '5',
    testatorName: 'Lee, Jordan',
    state: 'NY',
    executionForm: 'holographic',
    validityClass: 'formality-risk',
    highFlagCount: 5,
    personalRepresentativeName: 'Daniel Sullivan',
    updatedAt: '2026-09-14'
  },
  {
    id: '6',
    testatorName: 'Kowalski, Walter',
    state: 'OH',
    executionForm: 'electronic',
    validityClass: 'formality-risk',
    highFlagCount: 2,
    personalRepresentativeName: 'Daniel Sullivan',
    updatedAt: '2026-09-15'
  },
  {
    id: '7',
    testatorName: 'Reyes, Alma',
    state: 'CA',
    executionForm: 'witnessed',
    validityClass: 'valid-ready-to-execute',
    highFlagCount: 0,
    personalRepresentativeName: 'Daniel Sullivan',
    updatedAt: '2026-09-16'
  },
  {
    id: '8',
    testatorName: 'Brandt, Harold',
    state: 'FL',
    executionForm: 'witnessed',
    validityClass: 'valid-ready-to-execute',
    highFlagCount: 0,
    personalRepresentativeName: 'Daniel Sullivan',
    updatedAt: '2026-09-17'
  },
  {
    id: '9',
    testatorName: 'Okafor, Victor',
    state: 'IL',
    executionForm: 'witnessed',
    validityClass: 'valid-ready-to-execute',
    highFlagCount: 0,
    personalRepresentativeName: 'Daniel Sullivan',
    updatedAt: '2026-09-18'
  },
  {
    id: '10',
    testatorName: 'Whitfield, Samuel',
    state: 'PA',
    executionForm: 'witnessed',
    validityClass: 'valid-ready-to-execute',
    highFlagCount: 0,
    personalRepresentativeName: 'Daniel Sullivan',
    updatedAt: '2026-09-19'
  },
  {
    id: '11',
    testatorName: 'Whitaker, Dana',
    state: 'NV',
    executionForm: 'witnessed',
    validityClass: 'valid-ready-to-execute',
    highFlagCount: 0,
    personalRepresentativeName: 'Daniel Sullivan',
    updatedAt: '2026-09-20'
  },
  {
    id: '12',
    testatorName: 'Larsen, Ingrid',
    state: 'WA',
    executionForm: 'witnessed',
    validityClass: 'valid-ready-to-execute',
    highFlagCount: 0,
    personalRepresentativeName: 'Daniel Sullivan',
    updatedAt: '2026-09-21'
  },
  {
    id: '13',
    testatorName: 'Delgado, Rosa',
    state: 'TX',
    executionForm: 'holographic',
    validityClass: 'valid-ready-to-execute',
    highFlagCount: 0,
    personalRepresentativeName: 'Daniel Sullivan',
    updatedAt: '2026-09-22'
  }
];

export { sampleWills };
