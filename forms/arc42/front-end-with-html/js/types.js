// Plain-JavaScript / JSDoc type definitions and shared helpers for the arc42
// architecture-documentation form.
//
// Builds the canonical empty `Arc42Documentation` shape so newly-added fields
// default correctly when older saved state is rehydrated from localStorage.
// Property names are camelCase to match the front-end serde / examples
// convention (mirroring the SQL snake_case columns). Also carries the small
// pure helpers (cardinality counts + display labels) shared by the completeness
// rules, grader, and wizard.

/**
 * Build a fresh, fully-blank arc42 documentation record. Strings default to
 * '' (unanswered text / enum); arrays default to []. Mirrors the SvelteKit
 * `createEmptyDocumentation()` factory byte-for-byte.
 */
function emptyDocumentation() {
  return {
    architecture: { name: '', version: '', owner: '', status: '', description: '' },
    authorName: '',
    authorRole: '',
    documentDate: '',
    introduction: '',
    businessGoals: [],
    qualityGoals: [],
    stakeholders: [],
    constraintItems: [],
    businessContextDescription: '',
    technicalContextDescription: '',
    contextPartners: [],
    solutionStrategySummary: '',
    technologyDecisions: [],
    topLevelDecompositionSummary: '',
    qualityStrategies: [],
    buildingBlockOverview: '',
    buildingBlocks: [],
    runtimeOverview: '',
    runtimeScenarios: [],
    deploymentOverview: '',
    deploymentNodes: [],
    crosscuttingOverview: '',
    crosscuttingConcepts: [],
    architecturalDecisions: [],
    qualityTreeSummary: '',
    qualityScenarios: [],
    riskItems: [],
    glossaryTerms: [],
    recommendation: '',
    additionalNotes: '',
    signedBy: '',
    signedAt: '',
    finalMaturityOverride: '',
    finalMaturityOverrideReason: ''
  };
}

// ----------------------------------------------------------------------
// Cardinality + completeness helpers (shared by rules.js / grader.js)
// ----------------------------------------------------------------------

/** True when a string has non-whitespace content. */
function nonEmpty(s) {
  return String(s == null ? '' : s).trim().length > 0;
}

/** Count of ADRs whose status is set and not `draft`. */
function nonDraftAdrs(d) {
  return d.architecturalDecisions.filter((a) => a.status !== '' && a.status !== 'draft').length;
}

/** Count of quality scenarios with all five fields populated. */
function fullyPopulatedQualityScenarios(d) {
  return d.qualityScenarios.filter((q) =>
    nonEmpty(q.source) && nonEmpty(q.stimulus) && nonEmpty(q.artifact) && nonEmpty(q.response) && nonEmpty(q.measure)
  ).length;
}

/** Count of risk items that carry a mitigation. */
function risksWithMitigation(d) {
  return d.riskItems.filter((r) => nonEmpty(r.mitigation)).length;
}

/** Count of the 12 sections graded `complete`. */
function completeSectionCount(byS) {
  let n = 0;
  for (let i = 1; i <= 12; i++) if (byS[i] === 'complete') n++;
  return n;
}

// ----------------------------------------------------------------------
// Display labels
// ----------------------------------------------------------------------

/** Human-readable label for a maturity band. */
function maturityLabel(m) {
  switch (m) {
    case 'draft': return 'Draft';
    case 'reviewable': return 'Reviewable';
    case 'ready': return 'Ready';
    case 'mature': return 'Mature';
    default: return '—';
  }
}

/** Human-readable label for a completeness state. */
function completenessLabel(c) {
  switch (c) {
    case 'complete': return 'Complete';
    case 'partial': return 'Partial';
    default: return 'Empty';
  }
}

/** Human-readable label for a sign-off recommendation. */
function recommendationLabel(r) {
  switch (r) {
    case 'proceed': return 'Proceed';
    case 'revise-first': return 'Revise first';
    case 'block': return 'Block';
    default: return '—';
  }
}

/** arc42 section number -> full title. */
const SECTION_NAMES = {
  1: 'Introduction & Goals',
  2: 'Constraints',
  3: 'Context & Scope',
  4: 'Solution Strategy',
  5: 'Building Block View',
  6: 'Runtime View',
  7: 'Deployment View',
  8: 'Crosscutting Concepts',
  9: 'Architectural Decisions',
  10: 'Quality Requirements',
  11: 'Risks & Technical Debt',
  12: 'Glossary'
};

export { emptyDocumentation, nonEmpty, nonDraftAdrs, fullyPopulatedQualityScenarios, risksWithMitigation, completeSectionCount, maturityLabel, completenessLabel, recommendationLabel, SECTION_NAMES };
