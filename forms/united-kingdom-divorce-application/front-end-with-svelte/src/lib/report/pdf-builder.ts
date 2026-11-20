import type { TDocumentDefinitions, TableCell } from 'pdfmake/interfaces';
import type { DivorceApplication, ValidationResult } from '#lib/engine/types.js';
import {
  applicationClassLabel,
  applicationModeLabel,
  applicationTypeLabel,
  certificateTypeLabel,
  childrenArrangementsLabel,
  feeStatusLabel,
  financialOrderLabel,
  priorityLabel,
  serviceMethodLabel,
  stageLabel,
  yesNoLabel
} from '#lib/engine/utils.js';

type Margin = [number, number, number, number];

export function buildPdfDocument(
  data: DivorceApplication,
  result: ValidationResult
): TDocumentDefinitions {
  return {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    header: {
      text: 'UNITED KINGDOM DIVORCE APPLICATION — READINESS REPORT',
      alignment: 'center',
      margin: [0, 20, 0, 0],
      fontSize: 10,
      color: '#6b7280',
      bold: true
    },
    footer: (currentPage: number, pageCount: number) => ({
      text: `Page ${currentPage} of ${pageCount} | Completeness check — NOT legal advice | Generated ${new Date(result.timestamp).toLocaleString()}`,
      alignment: 'center',
      margin: [0, 20, 0, 0],
      fontSize: 8,
      color: '#9ca3af'
    }),
    content: [
      {
        text: `Readiness: ${applicationClassLabel(result.applicationClass)}`,
        fontSize: 18,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 4]
      },
      {
        text: `Earliest eligible date: ${result.earliestEligibleDate || 'not determinable'}  ·  Jurisdiction ground met: ${result.jurisdictionMet ? 'Yes' : 'No'}`,
        fontSize: 11,
        alignment: 'center' as const,
        color: '#4b5563',
        margin: [0, 0, 0, 20] as Margin
      },

      sectionHeader('Application'),
      table([
        [
          field('Type', applicationTypeLabel(data.application.applicationType) || 'N/A'),
          field('Mode', applicationModeLabel(data.application.applicationMode) || 'N/A')
        ],
        [
          field('Stage', stageLabel(data.application.stage) || 'N/A'),
          field('Date of check', data.application.asOfDate || 'N/A')
        ]
      ]),

      sectionHeader('Marriage'),
      table([
        [
          field('Married on', data.marriage.marriageDate || 'N/A'),
          field('Certificate', certificateTypeLabel(data.marriage.marriageCertificateType) || 'N/A')
        ],
        [
          field('Recognized in the UK', yesNoLabel(data.marriage.legallyRecognised) || 'N/A'),
          field('Irretrievable breakdown', yesNoLabel(data.marriage.breakdownConfirmed) || 'N/A')
        ]
      ]),

      sectionHeader('Parties'),
      table([
        [
          field('Applicant', data.parties.applicantName || 'N/A'),
          field('Other spouse', data.parties.respondentName || 'N/A')
        ],
        [field('Service', serviceMethodLabel(data.parties.serviceMethod) || 'N/A'), field('', '')]
      ]),

      sectionHeader('Children, money and fee'),
      table([
        [
          field('Children under 18', yesNoLabel(data.children.childrenUnder18) || 'N/A'),
          field(
            'Arrangements',
            childrenArrangementsLabel(data.children.childrenArrangements) || 'N/A'
          )
        ],
        [
          field(
            'Financial order',
            financialOrderLabel(data.finances.financialOrderIntended) || 'N/A'
          ),
          field('Fee', feeStatusLabel(data.finances.feeStatus) || 'N/A')
        ]
      ]),

      ...(result.rules.length > 0
        ? [
            sectionHeader('Rules fired'),
            {
              ul: result.rules.map((r) => ({
                text: `${r.id} (${r.dimension}): ${r.description}`,
                margin: [0, 2, 0, 2] as Margin
              })),
              margin: [0, 0, 0, 16] as Margin
            }
          ]
        : []),

      ...(result.flaggedIssues.length > 0
        ? [
            sectionHeader('Flagged issues'),
            {
              ul: result.flaggedIssues.map((f) => ({
                text: `[${priorityLabel(f.priority)}] ${f.category}: ${f.description} — ${f.suggestedAction}`,
                color:
                  f.priority === 'high'
                    ? '#dc2626'
                    : f.priority === 'medium'
                      ? '#d97706'
                      : '#4b5563',
                margin: [0, 2, 0, 2] as Margin
              })),
              margin: [0, 0, 0, 16] as Margin
            }
          ]
        : [])
    ],
    defaultStyle: {
      fontSize: 10
    }
  };
}

function table(body: TableCell[][]) {
  return {
    table: { widths: ['*', '*'], body },
    layout: 'lightHorizontalLines',
    margin: [0, 0, 0, 16] as Margin
  };
}

function sectionHeader(text: string) {
  return {
    text,
    fontSize: 14,
    bold: true,
    color: '#1f2937',
    margin: [0, 8, 0, 8] as Margin
  };
}

function field(label: string, value: string) {
  return {
    text: [{ text: label ? `${label}: ` : '', bold: true, color: '#6b7280' }, { text: value }],
    margin: [0, 4, 0, 4] as Margin
  };
}
