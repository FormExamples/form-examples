import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { Application, ValidationResult } from '#lib/engine/types.js';
import {
  eligibilityClassLabel,
  priorityLabel,
  claimTypeLabel,
  occupantStatusLabel,
  indicativeOutcomeLabel,
  yesNoLabel
} from '#lib/engine/utils.js';

export function buildPdfDocument(
  data: Application,
  result: ValidationResult
): TDocumentDefinitions {
  const roster = data.household.othersLive === 'no' ? [] : data.household.occupants;
  return {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    header: {
      text: 'COUNCIL TAX DISCOUNT APPLICATION — ELIGIBILITY REPORT',
      alignment: 'center',
      margin: [0, 20, 0, 0],
      fontSize: 10,
      color: '#6b7280',
      bold: true
    },
    footer: (currentPage: number, pageCount: number) => ({
      text: `Page ${currentPage} of ${pageCount} | Pre-check only — eligibility is decided by the billing authority | Generated ${new Date(result.timestamp).toLocaleString()}`,
      alignment: 'center',
      margin: [0, 20, 0, 0],
      fontSize: 8,
      color: '#9ca3af'
    }),
    content: [
      {
        text: `Eligibility: ${eligibilityClassLabel(result.eligibilityClass)}`,
        fontSize: 18,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 4]
      },
      {
        text: `Counted adults: ${result.countedAdults}  ·  Indicative outcome: ${indicativeOutcomeLabel(result.indicativeOutcome)}`,
        fontSize: 11,
        alignment: 'center' as const,
        color: '#4b5563',
        margin: [0, 0, 0, 20] as [number, number, number, number]
      },

      sectionHeader('Claim'),
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              field('Claim', claimTypeLabel(data.claim.claimType) || 'N/A'),
              field('Billing authority', data.claim.billingAuthority || 'N/A')
            ],
            [
              field('Account reference', data.claim.accountReference || 'N/A'),
              field('Effective from', data.claim.effectiveDate || 'N/A')
            ],
            [
              field('Applicant', data.applicant.name || 'N/A'),
              field('Property postcode', data.property.postcode || 'N/A')
            ],
            [
              field('Band', data.property.band || 'N/A'),
              field('Main home', yesNoLabel(data.property.mainResidence) || 'N/A')
            ]
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 16] as [number, number, number, number]
      },

      sectionHeader('Household roster'),
      {
        table: {
          headerRows: 1,
          widths: ['auto', '*', '*', 'auto'],
          body: [
            [
              { text: 'Person', bold: true, fontSize: 9 },
              { text: 'Name', bold: true, fontSize: 9 },
              { text: 'Status', bold: true, fontSize: 9 },
              { text: 'Evidence', bold: true, fontSize: 9 }
            ],
            [
              { text: 'Applicant', fontSize: 9 },
              { text: data.applicant.name || '—', fontSize: 9 },
              { text: occupantStatusLabel(data.applicant.status || 'counted-adult'), fontSize: 9 },
              { text: '—', fontSize: 9 }
            ],
            ...roster.map((o, i) => [
              { text: `Occupant ${i + 1}`, fontSize: 9 },
              { text: o.name || '—', fontSize: 9 },
              { text: occupantStatusLabel(o.status || 'counted-adult'), fontSize: 9 },
              { text: yesNoLabel(o.evidenceHeld) || '—', fontSize: 9 }
            ])
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 16] as [number, number, number, number]
      },

      ...(result.reasons.length > 0
        ? [
            sectionHeader('Reasons'),
            {
              ul: result.reasons,
              margin: [0, 0, 0, 16] as [number, number, number, number]
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
                margin: [0, 2, 0, 2] as [number, number, number, number]
              })),
              margin: [0, 0, 0, 16] as [number, number, number, number]
            }
          ]
        : []),

      {
        text: 'Eligibility is decided by the billing authority, not by this form. Tell the council within 21 days of any change in your circumstances.',
        fontSize: 9,
        color: '#6b7280'
      }
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
