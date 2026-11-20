// Sample directive data for the reviewer dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data/sample-reports.ts` so the two
// implementations show identical demo content when the backend is offline. The
// rows are derived from `examples/personas.json` (one row per persona) and span
// all three readiness classes.

/** @type {import('./dashboard-types.js').DirectiveRow[]} */
const sampleDirectives = [
  {
    id: "1",
    state: "CA",
    principalName: "Maria Elena Vargas",
    readinessClass: "ready-to-execute",
    agentName: "Daniel Vargas",
    executionRisk: false,
    reviewerName: "S. Okoye, MSW",
    updatedAt: "2026-09-02"
  },
  {
    id: "2",
    state: "NY",
    principalName: "Harold Weiss",
    readinessClass: "ready-to-execute",
    agentName: "Ruth Weiss",
    executionRisk: false,
    reviewerName: "L. Fernandez, Esq.",
    updatedAt: "2026-09-03"
  },
  {
    id: "3",
    state: "TX",
    principalName: "Billy Ray Tucker",
    readinessClass: "ready-to-execute",
    agentName: "Daniel Vargas",
    executionRisk: false,
    reviewerName: "J. Whitfield, RN",
    updatedAt: "2026-09-04"
  },
  {
    id: "4",
    state: "IL",
    principalName: "Dolores Kowalski",
    readinessClass: "ready-to-execute",
    agentName: "Daniel Vargas",
    executionRisk: false,
    reviewerName: "A. Rahman, Esq.",
    updatedAt: "2026-09-05"
  },
  {
    id: "5",
    state: "FL",
    principalName: "Maria Elena Vargas",
    readinessClass: "incomplete",
    agentName: "Daniel Vargas",
    executionRisk: false,
    reviewerName: "S. Okoye, MSW",
    updatedAt: "2026-09-06"
  },
  {
    id: "6",
    state: "FL",
    principalName: "Evelyn Brooks",
    readinessClass: "execution-risk",
    agentName: "Tom Brooks",
    executionRisk: true,
    reviewerName: "L. Fernandez, Esq.",
    updatedAt: "2026-09-07"
  },
  {
    id: "7",
    state: "CA",
    principalName: "Walter Ng",
    readinessClass: "execution-risk",
    agentName: "Pat Hollis",
    executionRisk: true,
    reviewerName: "J. Whitfield, RN",
    updatedAt: "2026-09-08"
  },
  {
    id: "8",
    state: "WA",
    principalName: "Kai Nakamura",
    readinessClass: "execution-risk",
    agentName: "Mika Nakamura",
    executionRisk: true,
    reviewerName: "A. Rahman, Esq.",
    updatedAt: "2026-09-09"
  },
  {
    id: "9",
    state: "OH",
    principalName: "Frances Miller",
    readinessClass: "execution-risk",
    agentName: "Daniel Vargas",
    executionRisk: true,
    reviewerName: "S. Okoye, MSW",
    updatedAt: "2026-09-10"
  },
  {
    id: "10",
    state: "AK",
    principalName: "Siku Anderson",
    readinessClass: "ready-to-execute",
    agentName: "Daniel Vargas",
    executionRisk: false,
    reviewerName: "L. Fernandez, Esq.",
    updatedAt: "2026-09-11"
  },
  {
    id: "11",
    state: "PA",
    principalName: "Arthur Pell",
    readinessClass: "execution-risk",
    agentName: "Daniel Vargas",
    executionRisk: true,
    reviewerName: "J. Whitfield, RN",
    updatedAt: "2026-09-12"
  }
];

export { sampleDirectives };
