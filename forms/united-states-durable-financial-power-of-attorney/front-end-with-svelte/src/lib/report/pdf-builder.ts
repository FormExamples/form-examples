import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { PowerOfAttorney, ValidationResult } from '#lib/engine/types.js';
import {
  validityClassLabel,
  priorityLabel,
  relationshipLabel,
  effectivenessLabel,
  compensationLabel,
  giftLimitLabel,
  bankFormLabel,
  form2848Label,
  yesNoLabel,
  GRANT_LABELS,
  HOT_LABELS
} from '#lib/engine/utils.js';
import { GRANT_FIELDS, HOT_FIELDS, ruleFor } from '#lib/engine/dpoa-rules.js';

export function buildPdfDocument(
  data: PowerOfAttorney,
  result: ValidationResult
): TDocumentDefinitions {
  const rule = ruleFor(data);
  const grants = GRANT_FIELDS.filter((f) => data.authority[f] === 'yes').map(
    (f) => GRANT_LABELS[f]
  );
  const hots = HOT_FIELDS.filter((f) => data.authority[f] === 'yes').map((f) => HOT_LABELS[f]);
  return {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    header: {
      text: 'DURABLE FINANCIAL POWER OF ATTORNEY — READINESS REPORT',
      alignment: 'center',
      margin: [0, 20, 0, 0],
      fontSize: 10,
      color: '#6b7280',
      bold: true
    },
    footer: (currentPage: number, pageCount: number) => ({
      text: `Page ${currentPage} of ${pageCount} | Documentation support, not legal advice | Generated ${new Date(result.timestamp).toLocaleString()}`,
      alignment: 'center',
      margin: [0, 20, 0, 0],
      fontSize: 8,
      color: '#9ca3af'
    }),
    content: [
      {
        text: `Validity: ${validityClassLabel(result.validityClass)}`,
        fontSize: 18,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 4]
      },
      {
        text: `Governing rule: ${result.governingState} (${rule.citation})  ·  Execution risk indicated: ${result.executionRiskIndicated ? 'Yes' : 'No'}`,
        fontSize: 11,
        alignment: 'center' as const,
        color: '#4b5563',
        margin: [0, 0, 0, 20] as [number, number, number, number]
      },

      sectionHeader('Instrument'),
      field('Principal', data.principal.principalName || 'N/A'),
      field('State', data.principal.state || 'N/A'),
      field(
        'Agent',
        `${data.agents.agentName || 'N/A'}${data.agents.agentRelationship ? ' (' + relationshipLabel(data.agents.agentRelationship) + ')' : ''}`
      ),
      field('Successor agent', data.agents.successorAgentName || 'N/A'),
      field('Effective', effectivenessLabel(data.instrument.effectiveness) || 'N/A'),
      field('Durable', yesNoLabel(data.instrument.durableStatement) || 'N/A'),
      field('Compensation', compensationLabel(data.agents.compensation) || 'N/A'),

      sectionHeader('Authority'),
      field('General authority', grants.join('; ') || 'N/A'),
      field('Hot powers granted', hots.join('; ') || 'None'),
      field('Gift limit', giftLimitLabel(data.authority.giftLimitType) || 'N/A'),

      sectionHeader('Signing and acceptance'),
      field('Notary arranged', yesNoLabel(data.execution.notaryArranged) || 'N/A'),
      field('Witnesses', String(data.execution.witnessCount ?? 'N/A')),
      field('Bank form', bankFormLabel(data.acceptance.bankFormCompleted) || 'N/A'),
      field('IRS Form 2848', form2848Label(data.acceptance.form2848Status) || 'N/A'),

      sectionHeader(`Flagged issues (${result.flaggedIssues.length})`),
      ...result.flaggedIssues.map((f) =>
        field(
          `${priorityLabel(f.priority)} ${f.category}`,
          `${f.description} — ${f.suggestedAction}`
        )
      )
    ],
    defaultStyle: {
      fontSize: 10
    }
  };
}

function sectionHeader(text: string) {
  return {
    text,
    fontSize: 14,
    bold: true,
    color: '#1f2937',
    margin: [0, 8, 0, 8] as [number, number, number, number]
  };
}

function field(label: string, value: string) {
  return {
    text: [{ text: label ? `${label}: ` : '', bold: true, color: '#6b7280' }, { text: value }],
    margin: [0, 4, 0, 4] as [number, number, number, number]
  };
}
