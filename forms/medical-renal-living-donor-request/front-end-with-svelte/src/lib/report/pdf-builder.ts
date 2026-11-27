import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { GradingResult, RenalLivingDonorRequest } from '#lib/engine/types.js';
import {
  aboLabel,
  appropriatenessBandLabel,
  calculateAge,
  identitySafetyBandLabel,
  pathwayLabel,
  titleCase
} from '#lib/engine/utils.js';
import { selectedTests } from '#lib/engine/tests.js';

export function buildPdfDocument(
  data: RenalLivingDonorRequest,
  result: GradingResult
): TDocumentDefinitions {
  const age = calculateAge(data.donor.birthDate);

  return {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    header: {
      text: 'RENAL LIVING DONOR REQUEST — VETTING REPORT',
      alignment: 'center',
      margin: [0, 20, 0, 0],
      fontSize: 10,
      color: '#6b7280',
      bold: true
    },
    footer: (currentPage: number, pageCount: number) => ({
      text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.timestamp).toLocaleString()}`,
      alignment: 'center',
      margin: [0, 20, 0, 0],
      fontSize: 8,
      color: '#9ca3af'
    }),
    content: [
      {
        text: result.recommendationLabel,
        fontSize: 22,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 4]
      },
      {
        text: `${titleCase(result.triageTier)}${result.targetTimeframe ? ` · ${result.targetTimeframe}` : ''}`,
        fontSize: 12,
        alignment: 'center',
        color: '#4b5563',
        margin: [0, 0, 0, 16] as [number, number, number, number]
      },

      sectionHeader('Four-axis grade'),
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              field(
                'A · Appropriateness',
                `${result.appropriatenessScore} / 9 — ${appropriatenessBandLabel(result.appropriatenessBand)}`
              ),
              field(
                'B · Identity / sample safety',
                identitySafetyBandLabel(result.identitySafetyBand)
              )
            ],
            [
              field('C · Completeness', `${result.completenessPercent}%`),
              field('D · Triage priority', titleCase(result.triageTier))
            ]
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 16] as [number, number, number, number]
      },

      sectionHeader('Sample tubes needed'),
      {
        text: result.requiredSamplesSummary || 'N/A',
        margin: [0, 0, 0, 16] as [number, number, number, number]
      },

      sectionHeader('Request summary'),
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              field('Donor', `${data.donor.givenNames} ${data.donor.familyName}`),
              field(
                'Date of birth',
                `${data.donor.birthDate || 'N/A'}${age ? ` (Age ${age})` : ''}`
              )
            ],
            [
              field('Pathway', pathwayLabel(data.pathway.donationPathway) || 'N/A'),
              field('Donor ABO group', aboLabel(data.pathway.donorAboGroup) || 'N/A')
            ],
            [
              field(
                'Tests',
                selectedTests(data)
                  .map((x) => x.label)
                  .join(', ') || 'N/A'
              ),
              field(
                'Recipient',
                `${data.recipient.givenNames} ${data.recipient.familyName}`.trim() || 'None'
              )
            ]
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 16] as [number, number, number, number]
      },

      ...(result.flags.length > 0
        ? [
            sectionHeader('Safety flags'),
            {
              ul: result.flags.map((f) => ({
                text: `[${f.priority.toUpperCase()}] ${f.category}: ${f.description} — ${f.suggestedAction}`,
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

      ...(result.firedRules.length > 0
        ? [
            sectionHeader('Fired rules'),
            {
              table: {
                headerRows: 1,
                widths: [90, 70, '*'],
                body: [
                  [
                    { text: 'Rule ID', bold: true, fontSize: 9 },
                    { text: 'Axis', bold: true, fontSize: 9 },
                    { text: 'Finding', bold: true, fontSize: 9 }
                  ],
                  ...result.firedRules.map((r) => [
                    { text: r.ruleId, fontSize: 8, color: '#6b7280' },
                    { text: r.axis, fontSize: 9 },
                    { text: r.description, fontSize: 9 }
                  ])
                ]
              },
              layout: 'lightHorizontalLines',
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
    text: [{ text: `${label}: `, bold: true, color: '#6b7280' }, { text: value }],
    margin: [0, 4, 0, 4] as [number, number, number, number]
  };
}
