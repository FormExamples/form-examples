import type { Arc42Documentation, MaturityResult } from '#lib/grading/types.js';

type Content = Record<string, unknown> | string;

/**
 * Build a pdfmake TDocumentDefinitions for an arc42 architecture document.
 */
export function buildPdfDocDefinition(d: Arc42Documentation, result: MaturityResult) {
  const h2 = (text: string) => ({ text, style: 'h2', pageBreak: 'before' as const });
  const h3 = (text: string) => ({ text, style: 'h3', margin: [0, 8, 0, 4] });
  const para = (text: string) => ({ text: text || '—', margin: [0, 0, 0, 6] });
  const bullet = (items: string[]) =>
    items.length === 0
      ? para('—')
      : { ul: items.map((i) => i || '—'), margin: [0, 0, 0, 6] };

  const table = (headers: string[], rows: string[][]): Content =>
    rows.length === 0
      ? para('No entries.')
      : {
          table: {
            headerRows: 1,
            widths: headers.map(() => '*'),
            body: [
              headers.map((h) => ({ text: h, bold: true, fillColor: '#e2e8f0' })),
              ...rows.map((r) => r.map((c) => c || '—')),
            ],
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 8],
        };

  const completenessLabel = (c: string) =>
    c === 'complete' ? 'Complete' : c === 'partial' ? 'Partial' : 'Empty';

  const sectionNames: Record<number, string> = {
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
    12: 'Glossary',
  };

  const content: Content[] = [
    // Title block
    { text: d.architecture.name || 'arc42 Architecture Document', style: 'title' },
    {
      columns: [
        [
          { text: `Version: ${d.architecture.version || '—'}`, margin: [0, 0, 0, 2] },
          { text: `Owner: ${d.architecture.owner || '—'}`, margin: [0, 0, 0, 2] },
          { text: `Status: ${d.architecture.status || '—'}`, margin: [0, 0, 0, 2] },
        ],
        [
          { text: `Author: ${d.authorName || '—'}`, margin: [0, 0, 0, 2] },
          { text: `Role: ${d.authorRole || '—'}`, margin: [0, 0, 0, 2] },
          { text: `Date: ${d.documentDate || '—'}`, margin: [0, 0, 0, 2] },
        ],
      ],
      columnGap: 20,
      margin: [0, 0, 0, 12],
    },
    d.architecture.description ? para(d.architecture.description) : '',

    // §1 Introduction & Goals
    h2('§1 Introduction & Goals'),
    para(d.introduction),
    h3('Business Goals'),
    table(
      ['#', 'Name', 'Description'],
      d.businessGoals.map((g) => [String(g.ordinal), g.name, g.description]),
    ),
    h3('Quality Goals'),
    table(
      ['#', 'Name', 'Priority', 'Scenario'],
      d.qualityGoals.map((g) => [String(g.ordinal), g.name, g.priority, g.scenario]),
    ),
    h3('Stakeholders'),
    table(
      ['#', 'Name', 'Role', 'Concerns'],
      d.stakeholders.map((s) => [String(s.ordinal), s.name, s.role, s.concerns]),
    ),

    // §2 Constraints
    h2('§2 Constraints'),
    table(
      ['#', 'Kind', 'Name', 'Description'],
      d.constraintItems.map((c) => [String(c.ordinal), c.kind, c.name, c.description]),
    ),

    // §3 Context & Scope
    h2('§3 Context & Scope'),
    h3('Business Context'),
    para(d.businessContextDescription),
    h3('Technical Context'),
    para(d.technicalContextDescription),
    h3('Context Partners'),
    table(
      ['#', 'Kind', 'Name', 'Interface', 'Protocol', 'Direction'],
      d.contextPartners.map((p) => [
        String(p.ordinal),
        p.kind,
        p.name,
        p.interfaceDescription,
        p.protocol,
        p.direction,
      ]),
    ),

    // §4 Solution Strategy
    h2('§4 Solution Strategy'),
    para(d.solutionStrategySummary),
    h3('Technology Decisions'),
    table(
      ['#', 'Category', 'Choice', 'Rationale'],
      d.technologyDecisions.map((t) => [String(t.ordinal), t.category, t.choice, t.rationale]),
    ),
    h3('Top-Level Decomposition'),
    para(d.topLevelDecompositionSummary),
    h3('Quality Strategies'),
    bullet(d.qualityStrategies),

    // §5 Building Block View
    h2('§5 Building Block View'),
    para(d.buildingBlockOverview),
    table(
      ['#', 'Parent', 'Name', 'Responsibility', 'Interfaces'],
      d.buildingBlocks.map((b) => [
        String(b.ordinal),
        b.parentOrdinal !== null ? String(b.parentOrdinal) : '—',
        b.name,
        b.responsibility,
        b.interfaces,
      ]),
    ),

    // §6 Runtime View
    h2('§6 Runtime View'),
    para(d.runtimeOverview),
    table(
      ['#', 'Name', 'Trigger', 'Steps Summary'],
      d.runtimeScenarios.map((r) => [
        String(r.ordinal),
        r.name,
        r.triggerDescription,
        r.stepsSummary,
      ]),
    ),

    // §7 Deployment View
    h2('§7 Deployment View'),
    para(d.deploymentOverview),
    table(
      ['#', 'Environment', 'Node', 'Responsibility'],
      d.deploymentNodes.map((n) => [
        String(n.ordinal),
        n.environment,
        n.nodeName,
        n.responsibility,
      ]),
    ),

    // §8 Crosscutting Concepts
    h2('§8 Crosscutting Concepts'),
    para(d.crosscuttingOverview),
    table(
      ['#', 'Name', 'Description'],
      d.crosscuttingConcepts.map((c) => [String(c.ordinal), c.name, c.description]),
    ),

    // §9 Architectural Decisions (ADRs)
    h2('§9 Architectural Decisions'),
    ...d.architecturalDecisions.flatMap((adr) => [
      h3(`${adr.ordinal}. ${adr.title} (${adr.status || 'draft'})`),
      { text: 'Context', bold: true, margin: [0, 4, 0, 2] },
      para(adr.context),
      { text: 'Decision', bold: true, margin: [0, 4, 0, 2] },
      para(adr.decision),
      { text: 'Consequences', bold: true, margin: [0, 4, 0, 2] },
      para(adr.consequences),
    ]),
    d.architecturalDecisions.length === 0 ? para('No ADRs recorded.') : '',

    // §10 Quality Requirements
    h2('§10 Quality Requirements'),
    para(d.qualityTreeSummary),
    table(
      ['#', 'Source', 'Stimulus', 'Artifact', 'Response', 'Measure'],
      d.qualityScenarios.map((q) => [
        String(q.ordinal),
        q.source,
        q.stimulus,
        q.artifact,
        q.response,
        q.measure,
      ]),
    ),

    // §11 Risks & Technical Debt
    h2('§11 Risks & Technical Debt'),
    table(
      ['#', 'Kind', 'Name', 'Probability', 'Impact', 'Mitigation'],
      d.riskItems.map((r) => [
        String(r.ordinal),
        r.kind,
        r.name,
        r.probability,
        r.impact,
        r.mitigation,
      ]),
    ),

    // §12 Glossary
    h2('§12 Glossary'),
    table(
      ['Term', 'Definition'],
      d.glossaryTerms.map((g) => [g.term, g.definition]),
    ),

    // Maturity Report
    h2('Maturity Report'),
    { text: `Computed Maturity: ${result.computedMaturity.toUpperCase()}`, bold: true, margin: [0, 0, 0, 4] },
    { text: `Final Maturity: ${result.finalMaturity.toUpperCase()}`, bold: true, margin: [0, 0, 0, 8] },
    d.finalMaturityOverride
      ? para(`Override reason: ${d.finalMaturityOverrideReason || '—'}`)
      : '',

    h3('Completeness by Section'),
    table(
      ['Section', 'Completeness'],
      Array.from({ length: 12 }, (_, i) => [
        `§${i + 1} ${sectionNames[i + 1]}`,
        completenessLabel(result.completenessBySection[i + 1] ?? 'empty'),
      ]),
    ),

    h3('Fired Rules'),
    result.firedRules.length === 0
      ? para('None.')
      : bullet(result.firedRules.map((r) => `[${r.ruleId}] ${r.description}`)),

    h3('Additional Flags'),
    result.additionalFlags.length === 0
      ? para('None.')
      : bullet(
          result.additionalFlags.map(
            (f) => `[${f.priority.toUpperCase()}] ${f.category}: ${f.description}`,
          ),
        ),

    d.recommendation
      ? { text: `Recommendation: ${d.recommendation}`, bold: true, margin: [0, 8, 0, 2] }
      : '',
    d.additionalNotes ? para(`Notes: ${d.additionalNotes}`) : '',
    d.signedBy
      ? para(`Signed: ${d.signedBy}   Date: ${d.signedAt || '—'}`)
      : { text: '\n\nSigned: ____________________________   Date: _______________', margin: [0, 30, 0, 0] },
  ].filter(Boolean);

  return {
    content,
    styles: {
      title: { fontSize: 20, bold: true, margin: [0, 0, 0, 10] },
      h2: { fontSize: 15, bold: true, color: '#1d4ed8', margin: [0, 12, 0, 6] },
      h3: { fontSize: 12, bold: true, margin: [0, 8, 0, 4] },
    },
    defaultStyle: { fontSize: 10 },
  };
}
