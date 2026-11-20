import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { Directive, ReadinessResult } from '#lib/engine/types.js';
import {
  readinessClassLabel,
  priorityLabel,
  agentRelationshipLabel,
  effectiveWhenLabel,
  executionMethodLabel,
  organDonationLabel,
  polstStatusLabel,
  yesNoLabel
} from '#lib/engine/utils.js';

export function buildPdfDocument(data: Directive, result: ReadinessResult): TDocumentDefinitions {
  const row = (label: string, value: string) => [
    { text: label, bold: true, color: '#4b5563' },
    value || 'N/A'
  ];
  return {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    header: {
      text: 'UNITED STATES HEALTH CARE POWER OF ATTORNEY — READINESS REPORT',
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
        text: `Readiness: ${readinessClassLabel(result.readinessClass)}`,
        fontSize: 18,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 4]
      },
      {
        text: `State rule applied: ${result.ruleSetName}  ·  Missing required items: ${result.missingCount}`,
        fontSize: 11,
        alignment: 'center' as const,
        color: '#4b5563',
        margin: [0, 0, 0, 20] as [number, number, number, number]
      },
      { text: 'Directive summary', fontSize: 13, bold: true, margin: [0, 0, 0, 6] },
      {
        table: {
          widths: [150, '*'],
          body: [
            row('Principal', data.principal.principalName),
            row('State', data.principal.state),
            row(
              'Agent',
              `${data.agent.agentName}${data.agent.agentRelationship ? ` (${agentRelationshipLabel(data.agent.agentRelationship)})` : ''}`
            ),
            row(
              'Successors',
              [data.agent.successor1Name, data.agent.successor2Name].filter(Boolean).join(', ')
            ),
            row('Authority begins', effectiveWhenLabel(data.authority.effectiveWhen)),
            row('HIPAA release', yesNoLabel(data.authority.hipaaRelease)),
            row('Organ donation', organDonationLabel(data.authority.organDonation)),
            row('POLST', polstStatusLabel(data.wishes.polstStatus)),
            row('Signing method', executionMethodLabel(data.execution.executionMethod)),
            row('Signature date', data.execution.signatureDate ?? '')
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 16] as [number, number, number, number]
      },
      {
        text: `Flagged issues (${result.flaggedIssues.length})`,
        fontSize: 13,
        bold: true,
        margin: [0, 0, 0, 6]
      },
      ...(result.flaggedIssues.length === 0
        ? [{ text: 'No flags raised.', color: '#4b5563' }]
        : result.flaggedIssues.map((f) => ({
            text: `[${priorityLabel(f.priority)}] ${f.category}: ${f.description} — ${f.suggestedAction}`,
            fontSize: 10,
            margin: [0, 0, 0, 4] as [number, number, number, number]
          })))
    ]
  };
}
