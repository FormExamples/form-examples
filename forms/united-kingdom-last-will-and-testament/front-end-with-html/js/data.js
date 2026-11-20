// Sample will data for the wills dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data/sample-reports.ts` so the two
// implementations show identical demo content when the backend is offline. One
// row per `examples/personas.json` entry, so the three validity classes
// (valid, incomplete, formality-risk) and the formality-risk cases are all
// represented.

/** @type {import('./dashboard-types.js').WillRow[]} */
const sampleWills = [
  {
    id: '1',
    testatorName: 'Ellis, Margaret',
    executionStatus: 'draft',
    validityClass: 'valid',
    sharesTotalPercent: 100,
    witnessCount: 0,
    formalityRisk: false,
    updatedAt: '2026-06-20'
  },
  {
    id: '2',
    testatorName: 'Okafor, Chidi',
    executionStatus: 'signed',
    validityClass: 'valid',
    sharesTotalPercent: 100,
    witnessCount: 2,
    formalityRisk: false,
    updatedAt: '2026-06-21'
  },
  {
    id: '3',
    testatorName: 'Unnamed testator',
    executionStatus: 'draft',
    validityClass: 'incomplete',
    sharesTotalPercent: 0,
    witnessCount: 0,
    formalityRisk: false,
    updatedAt: '2026-06-22'
  },
  {
    id: '4',
    testatorName: 'Byrne, Aoife',
    executionStatus: 'draft',
    validityClass: 'incomplete',
    sharesTotalPercent: 80,
    witnessCount: 0,
    formalityRisk: false,
    updatedAt: '2026-06-23'
  },
  {
    id: '5',
    testatorName: 'Nowak, Piotr',
    executionStatus: 'signed',
    validityClass: 'formality-risk',
    sharesTotalPercent: 100,
    witnessCount: 1,
    formalityRisk: true,
    updatedAt: '2026-06-24'
  },
  {
    id: '6',
    testatorName: 'Fletcher, Rosemary',
    executionStatus: 'signed',
    validityClass: 'formality-risk',
    sharesTotalPercent: 100,
    witnessCount: 2,
    formalityRisk: true,
    updatedAt: '2026-06-25'
  },
  {
    id: '7',
    testatorName: 'Silva, Marcos',
    executionStatus: 'draft',
    validityClass: 'formality-risk',
    sharesTotalPercent: 100,
    witnessCount: 0,
    formalityRisk: true,
    updatedAt: '2026-06-26'
  },
  {
    id: '8',
    testatorName: 'Doyle, Sinead',
    executionStatus: 'draft',
    validityClass: 'formality-risk',
    sharesTotalPercent: 100,
    witnessCount: 0,
    formalityRisk: true,
    updatedAt: '2026-06-27'
  },
  {
    id: '9',
    testatorName: 'MacLeod, Iain',
    executionStatus: 'draft',
    validityClass: 'formality-risk',
    sharesTotalPercent: 100,
    witnessCount: 0,
    formalityRisk: true,
    updatedAt: '2026-06-28'
  },
  {
    id: '10',
    testatorName: 'Hughes, Gwen',
    executionStatus: 'draft',
    validityClass: 'formality-risk',
    sharesTotalPercent: 100,
    witnessCount: 0,
    formalityRisk: true,
    updatedAt: '2026-06-29'
  },
  {
    id: '11',
    testatorName: 'Whitfield, Callum',
    executionStatus: 'draft',
    validityClass: 'valid',
    sharesTotalPercent: 100,
    witnessCount: 0,
    formalityRisk: false,
    updatedAt: '2026-06-30'
  }
];

export { sampleWills };
