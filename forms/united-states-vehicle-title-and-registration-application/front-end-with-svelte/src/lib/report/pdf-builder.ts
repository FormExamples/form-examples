import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { TitleApplication, ValidationResult } from '#lib/engine/types.js';
import { outstandingItems, stateRule } from '#lib/engine/title-rules.js';
import {
  applicationClassLabel,
  lienStatusLabel,
  odometerStatusLabel,
  priorityLabel,
  titleBrandLabel,
  vinStatusLabel,
  yesNoLabel
} from '#lib/engine/utils.js';

type Margin = [number, number, number, number];

export function buildPdfDocument(
  data: TitleApplication,
  result: ValidationResult
): TDocumentDefinitions {
  const rule = stateRule(data.application.state);
  const items = outstandingItems(data);
  const vehicle =
    [data.vehicle.modelYear, data.vehicle.make, data.vehicle.model]
      .filter((p) => p !== null && p !== '')
      .join(' ') || 'N/A';
  return {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    header: {
      text: 'UNITED STATES VEHICLE TITLE AND REGISTRATION APPLICATION — REPORT',
      alignment: 'center',
      margin: [0, 20, 0, 0],
      fontSize: 10,
      color: '#6b7280',
      bold: true
    },
    footer: (currentPage: number, pageCount: number) => ({
      text: `Page ${currentPage} of ${pageCount} | Documentation support, not legal advice; the issuing state agency decides | Generated ${new Date(result.timestamp).toLocaleString()}`,
      alignment: 'center',
      margin: [0, 20, 0, 0],
      fontSize: 8,
      color: '#9ca3af'
    }),
    content: [
      {
        text: `Class: ${applicationClassLabel(result.applicationClass)}`,
        fontSize: 18,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 4]
      },
      {
        text: `VIN check: ${vinStatusLabel(result.vinStatus)}  ·  Outstanding items: ${result.outstandingItemCount}  ·  Brand or lien issue: ${result.brandOrLienIssue ? 'Yes' : 'No'}`,
        fontSize: 11,
        alignment: 'center' as const,
        color: '#4b5563',
        margin: [0, 0, 0, 20] as Margin
      },

      sectionHeader('Application'),
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              field('State', data.application.state || 'N/A'),
              field(
                'State rule',
                data.application.state
                  ? result.stateRuleKnown
                    ? `${rule.rule.name} applied`
                    : 'Not encoded: uniform default, verify'
                  : 'N/A'
              )
            ],
            [
              field('Owner', data.owner.ownerName || 'N/A'),
              field(
                'Out-of-state transfer',
                yesNoLabel(data.application.outOfStateTransfer) || 'N/A'
              )
            ],
            [field('Vehicle', vehicle), field('VIN', data.vehicle.vin || 'N/A')],
            [
              field(
                'Odometer',
                result.odometerDisclosureRequired
                  ? data.odometer.odometerReading !== null
                    ? `${data.odometer.odometerReading} miles, ${odometerStatusLabel(data.odometer.odometerStatus)}`
                    : 'Required, not recorded'
                  : 'Not required (exempt)'
              ),
              field('Title brand', titleBrandLabel(data.titleHistory.titleBrand) || 'N/A')
            ],
            [
              field('Lien', lienStatusLabel(data.lien.lienStatus) || 'N/A'),
              field(
                'State-level tax estimate',
                result.estimatedStateTaxUsd === null
                  ? 'N/A'
                  : `$${result.estimatedStateTaxUsd.toFixed(2)} (excludes local tax)`
              )
            ]
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 16] as Margin
      },

      sectionHeader(`Outstanding items (${items.length})`),
      items.length > 0
        ? {
            ul: items.map((i) => ({ text: i.label, fontSize: 10 })),
            margin: [0, 0, 0, 16] as Margin
          }
        : { text: 'None', fontSize: 10, margin: [0, 0, 0, 16] as Margin },

      ...(result.flaggedIssues.length > 0
        ? [
            sectionHeader('Flagged issues'),
            {
              ul: result.flaggedIssues.map((f) => ({
                text: `[${priorityLabel(f.priority)}] ${f.id} (${f.category}): ${f.description} — ${f.suggestedAction}`,
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

      ...(data.feesTax.applicantNote
        ? [
            sectionHeader('Applicant note'),
            { text: data.feesTax.applicantNote, fontSize: 10, margin: [0, 0, 0, 16] as Margin }
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
