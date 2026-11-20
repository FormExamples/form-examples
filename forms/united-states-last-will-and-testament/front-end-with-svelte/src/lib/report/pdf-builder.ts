import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { Will, ValidationResult } from '#lib/engine/types.js';
import {
  validityClassLabel,
  priorityLabel,
  maritalStatusLabel,
  executionFormLabel,
  soundMindLabel,
  yesNoLabel,
  dollars
} from '#lib/engine/utils.js';
import { stateRuleFor } from '#lib/engine/will-rules.js';

export function buildPdfDocument(data: Will, result: ValidationResult): TDocumentDefinitions {
  return {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    header: {
      text: 'UNITED STATES LAST WILL AND TESTAMENT — VALIDITY REPORT',
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
        text: `Residuary total: ${result.residuaryPercentTotal}%  ·  Federal estate tax may apply: ${result.federalEstateTaxExposure ? 'Yes' : 'No'}`,
        fontSize: 11,
        alignment: 'center' as const,
        color: '#4b5563',
        margin: [0, 0, 0, 20] as [number, number, number, number]
      },

      sectionHeader('Testator and state'),
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              field('Testator', data.testator.testatorName || 'N/A'),
              field('State', `${stateRuleFor(data.testator.state).rule.name}`)
            ],
            [
              field('Date of birth', data.testator.dateOfBirth || 'N/A'),
              field('Sound mind', soundMindLabel(data.testator.soundMind) || 'N/A')
            ],
            [
              field('Marital status', maritalStatusLabel(data.testator.maritalStatus) || 'N/A'),
              field('Spouse', data.family.spouseName || 'N/A')
            ]
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 16] as [number, number, number, number]
      },

      sectionHeader('Estate and bequests'),
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              field('Estimated estate', dollars(data.estate.estimatedEstateValue) || 'N/A'),
              field('Specific bequests', dollars(data.estate.specificBequestsTotal) || 'N/A')
            ],
            [
              field('Residuary total', `${result.residuaryPercentTotal}%`),
              field(
                'Estimated elective share',
                result.electiveShareAmount === null
                  ? 'Not applicable'
                  : dollars(result.electiveShareAmount)
              )
            ],
            [
              field('Personal representative', data.provisions.personalRepresentativeName || 'N/A'),
              field(
                'Digital assets clause',
                yesNoLabel(data.provisions.digitalAssetsClause) || 'N/A'
              )
            ]
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 16] as [number, number, number, number]
      },

      sectionHeader('Execution and witnesses'),
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              field('Form of execution', executionFormLabel(data.execution.executionForm) || 'N/A'),
              field('Execution date', data.execution.executionDate || 'N/A')
            ],
            [
              field('Witnesses named', `${result.witnessCount}`),
              field('Self-proved', result.selfProved ? 'Yes' : 'No')
            ]
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 16] as [number, number, number, number]
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
                margin: [0, 2, 0, 2] as [number, number, number, number]
              })),
              margin: [0, 0, 0, 16] as [number, number, number, number]
            }
          ]
        : []),

      ...(data.provisions.drafterNote
        ? [
            sectionHeader('Drafter note'),
            {
              text: data.provisions.drafterNote,
              fontSize: 10,
              margin: [0, 0, 0, 16] as [number, number, number, number]
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
    margin: [0, 8, 0, 8] as [number, number, number, number]
  };
}

function field(label: string, value: string) {
  return {
    text: [{ text: label ? `${label}: ` : '', bold: true, color: '#6b7280' }, { text: value }],
    margin: [0, 4, 0, 4] as [number, number, number, number]
  };
}
