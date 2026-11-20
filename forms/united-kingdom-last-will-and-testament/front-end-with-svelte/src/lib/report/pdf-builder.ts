import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { Will, ValidationResult } from '#lib/engine/types.js';
import { beneficiaries, witnesses } from '#lib/engine/will-rules.js';
import {
  validityClassLabel,
  priorityLabel,
  domicileLabel,
  maritalStatusLabel,
  estateValueBandLabel,
  relationshipLabel,
  funeralWishesLabel,
  executionStatusLabel
} from '#lib/engine/utils.js';

type Margin = [number, number, number, number];

export function buildPdfDocument(data: Will, result: ValidationResult): TDocumentDefinitions {
  const bens = beneficiaries(data);
  const executors =
    [data.executors.executorFirstName, data.executors.executorSecondName]
      .filter((n) => n.trim() !== '')
      .join(', ') || 'N/A';
  return {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    header: {
      text: 'UNITED KINGDOM LAST WILL AND TESTAMENT — VALIDITY REPORT',
      alignment: 'center',
      margin: [0, 20, 0, 0],
      fontSize: 10,
      color: '#6b7280',
      bold: true
    },
    footer: (currentPage: number, pageCount: number) => ({
      text: `Page ${currentPage} of ${pageCount} | Documentation support — NOT legal advice and NOT a will | Generated ${new Date(result.timestamp).toLocaleString()}`,
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
        text: `Shares total: ${result.sharesTotalPercent}%  ·  Witnesses named: ${result.witnessCount}  ·  Formality risk indicated: ${result.formalityRisk ? 'Yes' : 'No'}`,
        fontSize: 11,
        alignment: 'center' as const,
        color: '#4b5563',
        margin: [0, 0, 0, 20] as Margin
      },

      sectionHeader('Testator and estate'),
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              field('Testator', data.testator.testatorName || 'N/A'),
              field('Date of birth', data.testator.dateOfBirth || 'N/A')
            ],
            [
              field('Domicile', domicileLabel(data.testator.domicile) || 'N/A'),
              field('Marital status', maritalStatusLabel(data.testator.maritalStatus) || 'N/A')
            ],
            [
              field('Estate value', estateValueBandLabel(data.estate.estateValueBand) || 'N/A'),
              field('Executors', executors)
            ],
            [
              field('Guardian', data.family.guardianName || 'N/A'),
              field('Funeral wishes', funeralWishesLabel(data.family.funeralWishes) || 'N/A')
            ]
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 16] as Margin
      },

      sectionHeader('Beneficiaries'),
      {
        table: {
          headerRows: 1,
          widths: ['*', 'auto', 'auto'],
          body: [
            [
              { text: 'Name', bold: true, fontSize: 9 },
              { text: 'Relationship', bold: true, fontSize: 9 },
              { text: 'Share', bold: true, fontSize: 9 }
            ],
            ...(bens.length === 0
              ? [[{ text: 'No beneficiary named', fontSize: 9 }, { text: '—' }, { text: '—' }]]
              : bens.map((b) => [
                  { text: b.name, fontSize: 9 },
                  {
                    text: relationshipLabel(b.relationship as never) || '—',
                    fontSize: 9
                  },
                  { text: b.share != null ? `${b.share}%` : '—', fontSize: 9 }
                ]))
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 16] as Margin
      },

      sectionHeader('Signing and witnessing'),
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              field('Status', executionStatusLabel(data.execution.executionStatus) || 'N/A'),
              field('Date of will', data.execution.dateOfWill || 'N/A')
            ],
            [
              field(
                'Witnesses',
                witnesses(data)
                  .map((w) => w.name)
                  .join(', ') || 'N/A'
              ),
              field('', '')
            ]
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 16] as Margin
      },

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
        : []),

      {
        text: 'Disclaimer: this report is documentation support, not legal advice. It cannot confirm that a will is valid. Take advice from a solicitor or a regulated will writer if your situation is not straightforward.',
        fontSize: 8,
        color: '#6b7280',
        margin: [0, 8, 0, 0] as Margin
      },

      ...(data.execution.drafterNote
        ? [
            sectionHeader('Drafter note'),
            {
              text: data.execution.drafterNote,
              fontSize: 10,
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
