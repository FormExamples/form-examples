import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { DivorcePetition, ValidationResult } from '#lib/engine/types.js';
import {
  readinessClassLabel,
  priorityLabel,
  caseTypeLabel,
  groundTypeLabel,
  propertyRegimeLabel,
  serviceMethodLabel,
  yesNoLabel
} from '#lib/engine/utils.js';

type Margin = [number, number, number, number];
const GAP: Margin = [0, 0, 0, 16];

export function buildPdfDocument(
  data: DivorcePetition,
  result: ValidationResult
): TDocumentDefinitions {
  return {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    header: {
      text: 'UNITED STATES DIVORCE PETITION — READINESS REPORT',
      alignment: 'center',
      margin: [0, 20, 0, 0],
      fontSize: 10,
      color: '#6b7280',
      bold: true
    },
    footer: (currentPage: number, pageCount: number) => ({
      text: `Page ${currentPage} of ${pageCount} | Documentation support, not legal advice; the court decides | Generated ${new Date(result.timestamp).toLocaleString()}`,
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
        text: `Property regime: ${propertyRegimeLabel(result.propertyRegime)}  ·  Earliest decree: ${result.earliestDecreeDate ?? 'none or not yet determinable'}`,
        fontSize: 11,
        alignment: 'center' as const,
        color: '#4b5563',
        margin: [0, 0, 0, 20] as Margin
      },

      sectionHeader('Filing'),
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              field('State', data.filing.state || 'N/A'),
              field('County', data.filing.county || 'N/A')
            ],
            [
              field('Filing date', data.filing.filingDate || 'N/A'),
              field('Case type', caseTypeLabel(data.filing.caseType) || 'N/A')
            ],
            [field('Ground', groundTypeLabel(data.filing.groundType) || 'N/A'), field('', '')]
          ]
        },
        layout: 'lightHorizontalLines',
        margin: GAP
      },

      sectionHeader('Spouses'),
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              field('Petitioner', data.spouses.petitionerName || 'N/A'),
              field('Respondent', data.spouses.respondentName || 'N/A')
            ],
            [
              field('Marriage date', data.spouses.marriageDate || 'N/A'),
              field('Separation date', data.spouses.separationDate || 'N/A')
            ],
            [
              field(
                'State residency (months)',
                data.spouses.petitionerResidencyMonths != null
                  ? String(data.spouses.petitionerResidencyMonths)
                  : 'N/A'
              ),
              field(
                'County residency (days)',
                data.spouses.countyResidencyDays != null
                  ? String(data.spouses.countyResidencyDays)
                  : 'N/A'
              )
            ]
          ]
        },
        layout: 'lightHorizontalLines',
        margin: GAP
      },

      sectionHeader('Children, property and service'),
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              field('Minor children', yesNoLabel(data.children.hasMinorChildren) || 'N/A'),
              field('Custody plan', yesNoLabel(data.children.custodyPlanDocumented) || 'N/A')
            ],
            [
              field(
                'Settlement agreement',
                yesNoLabel(data.property.settlementAgreementSigned) || 'N/A'
              ),
              field(
                'Financial disclosure',
                yesNoLabel(data.property.financialDisclosureFiled) || 'N/A'
              )
            ],
            [
              field('Service', serviceMethodLabel(data.service.serviceMethod) || 'N/A'),
              field('Service date', data.service.serviceDate || 'N/A')
            ]
          ]
        },
        layout: 'lightHorizontalLines',
        margin: GAP
      },

      sectionHeader('Decree'),
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              field('Decree entered', yesNoLabel(data.decree.decreeEntered) || 'N/A'),
              field('Decree date', data.decree.decreeDate || 'N/A')
            ],
            [
              field('Name restoration', yesNoLabel(data.decree.nameRestorationRequested) || 'N/A'),
              field('Certificate requested', yesNoLabel(data.decree.certificateRequested) || 'N/A')
            ]
          ]
        },
        layout: 'lightHorizontalLines',
        margin: GAP
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
              margin: GAP
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
