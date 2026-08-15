import type { Arc42Documentation } from '#lib/grading/types.js';

export interface AsciiDocFile {
  filename: string;
  content: string;
}

const e = (s: string | number | null | undefined) => String(s ?? '').replace(/\|/g, '\\|');

function tableRows(headers: string[], rows: string[][]): string {
  if (rows.length === 0) return '_No entries._\n';
  const cols = headers.map(() => '1').join(',');
  const head = `|${headers.map((h) => h).join(' |')}\n`;
  const body = rows.map((r) => `|${r.map(e).join(' |')}`).join('\n');
  return `[cols="${cols}",options="header"]\n|===\n${head}${body}\n|===\n`;
}

function buildIntroduction(d: Arc42Documentation): string {
  const lines: string[] = [];
  lines.push('== §1 Introduction & Goals\n');
  lines.push(d.introduction || '_No introduction provided._');
  lines.push('');
  lines.push('=== Business Goals\n');
  lines.push(tableRows(['#', 'Name', 'Description'], d.businessGoals.map((g) => [String(g.ordinal), g.name, g.description])));
  lines.push('=== Quality Goals\n');
  lines.push(tableRows(['#', 'Name', 'Priority', 'Scenario'], d.qualityGoals.map((g) => [String(g.ordinal), g.name, g.priority, g.scenario])));
  lines.push('=== Stakeholders\n');
  lines.push(tableRows(['#', 'Name', 'Role', 'Concerns'], d.stakeholders.map((s) => [String(s.ordinal), s.name, s.role, s.concerns])));
  return lines.join('\n');
}

function buildConstraints(d: Arc42Documentation): string {
  const lines: string[] = [];
  lines.push('== §2 Constraints\n');
  lines.push(tableRows(['#', 'Kind', 'Name', 'Description'], d.constraintItems.map((c) => [String(c.ordinal), c.kind, c.name, c.description])));
  return lines.join('\n');
}

function buildContext(d: Arc42Documentation): string {
  const lines: string[] = [];
  lines.push('== §3 Context & Scope\n');
  lines.push('=== Business Context\n');
  lines.push(d.businessContextDescription || '_No description provided._');
  lines.push('');
  lines.push('=== Technical Context\n');
  lines.push(d.technicalContextDescription || '_No description provided._');
  lines.push('');
  lines.push('=== Context Partners\n');
  lines.push(tableRows(['#', 'Kind', 'Name', 'Interface', 'Protocol', 'Direction'], d.contextPartners.map((p) => [String(p.ordinal), p.kind, p.name, p.interfaceDescription, p.protocol, p.direction])));
  return lines.join('\n');
}

function buildSolutionStrategy(d: Arc42Documentation): string {
  const lines: string[] = [];
  lines.push('== §4 Solution Strategy\n');
  lines.push(d.solutionStrategySummary || '_No summary provided._');
  lines.push('');
  lines.push('=== Technology Decisions\n');
  lines.push(tableRows(['#', 'Category', 'Choice', 'Rationale'], d.technologyDecisions.map((t) => [String(t.ordinal), t.category, t.choice, t.rationale])));
  lines.push('=== Top-Level Decomposition\n');
  lines.push(d.topLevelDecompositionSummary || '_Not described._');
  lines.push('');
  lines.push('=== Quality Strategies\n');
  if (d.qualityStrategies.length === 0) {
    lines.push('_None listed._');
  } else {
    for (const s of d.qualityStrategies) lines.push(`* ${s}`);
  }
  lines.push('');
  return lines.join('\n');
}

function buildBuildingBlocks(d: Arc42Documentation): string {
  const lines: string[] = [];
  lines.push('== §5 Building Block View\n');
  lines.push(d.buildingBlockOverview || '_No overview provided._');
  lines.push('');
  lines.push(tableRows(['#', 'Parent', 'Name', 'Responsibility', 'Interfaces'], d.buildingBlocks.map((b) => [String(b.ordinal), b.parentOrdinal !== null ? String(b.parentOrdinal) : '', b.name, b.responsibility, b.interfaces])));
  return lines.join('\n');
}

function buildRuntime(d: Arc42Documentation): string {
  const lines: string[] = [];
  lines.push('== §6 Runtime View\n');
  lines.push(d.runtimeOverview || '_No overview provided._');
  lines.push('');
  lines.push(tableRows(['#', 'Name', 'Trigger', 'Steps Summary'], d.runtimeScenarios.map((r) => [String(r.ordinal), r.name, r.triggerDescription, r.stepsSummary])));
  return lines.join('\n');
}

function buildDeployment(d: Arc42Documentation): string {
  const lines: string[] = [];
  lines.push('== §7 Deployment View\n');
  lines.push(d.deploymentOverview || '_No overview provided._');
  lines.push('');
  lines.push(tableRows(['#', 'Environment', 'Node', 'Responsibility'], d.deploymentNodes.map((n) => [String(n.ordinal), n.environment, n.nodeName, n.responsibility])));
  return lines.join('\n');
}

function buildCrosscutting(d: Arc42Documentation): string {
  const lines: string[] = [];
  lines.push('== §8 Crosscutting Concepts\n');
  lines.push(d.crosscuttingOverview || '_No overview provided._');
  lines.push('');
  lines.push(tableRows(['#', 'Name', 'Description'], d.crosscuttingConcepts.map((c) => [String(c.ordinal), c.name, c.description])));
  return lines.join('\n');
}

function buildDesignDecisions(d: Arc42Documentation): string {
  const lines: string[] = [];
  lines.push('== §9 Architectural Decisions\n');
  if (d.architecturalDecisions.length === 0) {
    lines.push('_No ADRs recorded._');
  } else {
    for (const adr of d.architecturalDecisions) {
      lines.push(`=== ${adr.ordinal}. ${adr.title} (${adr.status || 'draft'})\n`);
      lines.push('*Context*\n');
      lines.push(adr.context || '_Not described._');
      lines.push('');
      lines.push('*Decision*\n');
      lines.push(adr.decision || '_Not described._');
      lines.push('');
      lines.push('*Consequences*\n');
      lines.push(adr.consequences || '_Not described._');
      lines.push('');
    }
  }
  return lines.join('\n');
}

function buildQuality(d: Arc42Documentation): string {
  const lines: string[] = [];
  lines.push('== §10 Quality Requirements\n');
  lines.push(d.qualityTreeSummary || '_No summary provided._');
  lines.push('');
  lines.push(tableRows(['#', 'Source', 'Stimulus', 'Artifact', 'Response', 'Measure'], d.qualityScenarios.map((q) => [String(q.ordinal), q.source, q.stimulus, q.artifact, q.response, q.measure])));
  return lines.join('\n');
}

function buildRisks(d: Arc42Documentation): string {
  const lines: string[] = [];
  lines.push('== §11 Risks & Technical Debt\n');
  lines.push(tableRows(['#', 'Kind', 'Name', 'Probability', 'Impact', 'Mitigation'], d.riskItems.map((r) => [String(r.ordinal), r.kind, r.name, r.probability, r.impact, r.mitigation])));
  return lines.join('\n');
}

function buildGlossary(d: Arc42Documentation): string {
  const lines: string[] = [];
  lines.push('== §12 Glossary\n');
  lines.push(tableRows(['Term', 'Definition'], d.glossaryTerms.map((g) => [g.term, g.definition])));
  return lines.join('\n');
}

function buildIndex(d: Arc42Documentation): string {
  return `:doctype: book
:toc: left
:toclevels: 3
:sectnums:
:title-page:

= ${d.architecture.name || 'arc42 Architecture Document'}
${d.authorName || ''}
${d.documentDate || ''}
:revnumber: ${d.architecture.version || '1.0'}
:revdate: ${d.documentDate || ''}
:revremark: ${d.architecture.status || 'draft'}

include::01_introduction_and_goals.adoc[]

include::02_constraints.adoc[]

include::03_context_and_scope.adoc[]

include::04_solution_strategy.adoc[]

include::05_building_block_view.adoc[]

include::06_runtime_view.adoc[]

include::07_deployment_view.adoc[]

include::08_concepts.adoc[]

include::09_design_decisions.adoc[]

include::10_quality_requirements.adoc[]

include::11_technical_risks.adoc[]

include::12_glossary.adoc[]
`;
}

/**
 * Build a bundle of 13 AsciiDoc files matching the arc42 canonical filenames.
 */
export function buildAsciiDocBundle(d: Arc42Documentation): AsciiDocFile[] {
  return [
    { filename: 'arc42.adoc', content: buildIndex(d) },
    { filename: '01_introduction_and_goals.adoc', content: buildIntroduction(d) },
    { filename: '02_constraints.adoc', content: buildConstraints(d) },
    { filename: '03_context_and_scope.adoc', content: buildContext(d) },
    { filename: '04_solution_strategy.adoc', content: buildSolutionStrategy(d) },
    { filename: '05_building_block_view.adoc', content: buildBuildingBlocks(d) },
    { filename: '06_runtime_view.adoc', content: buildRuntime(d) },
    { filename: '07_deployment_view.adoc', content: buildDeployment(d) },
    { filename: '08_concepts.adoc', content: buildCrosscutting(d) },
    { filename: '09_design_decisions.adoc', content: buildDesignDecisions(d) },
    { filename: '10_quality_requirements.adoc', content: buildQuality(d) },
    { filename: '11_technical_risks.adoc', content: buildRisks(d) },
    { filename: '12_glossary.adoc', content: buildGlossary(d) },
  ];
}
