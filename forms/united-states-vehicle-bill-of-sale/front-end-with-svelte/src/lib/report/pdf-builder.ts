import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { BillOfSale, ValidationResult } from '#lib/engine/types.js';
import {
  completenessClassLabel,
  priorityLabel,
  partyTypeLabel,
  paymentMethodLabel,
  taxBasisLabel,
  titleBrandLabel,
  odometerStatusLabel,
  lienStatusLabel,
  asIsClauseLabel,
  notarizedLabel,
  yesNoLabel
} from '#lib/engine/utils.js';

type Margin = [number, number, number, number];

export function buildPdfDocument(data: BillOfSale, result: ValidationResult): TDocumentDefinitions {
  const party = (p: BillOfSale['seller']) =>
    [p.name, p.streetAddress, p.city, p.state, p.postalCode].filter((x) => x).join(', ') || 'N/A';
  const section: Margin = [0, 0, 0, 16];
  return {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    header: {
      text: 'UNITED STATES VEHICLE BILL OF SALE — COMPLETENESS REPORT',
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
        text: `Class: ${completenessClassLabel(result.completenessClass)}`,
        fontSize: 18,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 4]
      },
      {
        text: `Federal odometer disclosure: ${result.odometerExempt ? 'exempt' : 'required'}  ·  State rule: ${result.stateRuleKnown ? 'from the rule table' : 'uniform default (verify)'}`,
        fontSize: 11,
        alignment: 'center' as const,
        color: '#4b5563',
        margin: [0, 0, 0, 20] as Margin
      },

      sectionHeader('Sale'),
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              field('State', data.transaction.state || 'N/A'),
              field('Date of sale', data.transaction.saleDate || 'N/A')
            ],
            [
              field(
                'Price',
                data.transaction.salePriceAsUsd != null
                  ? `$${data.transaction.salePriceAsUsd.toLocaleString('en-US')}`
                  : 'N/A'
              ),
              field('Payment', paymentMethodLabel(data.transaction.paymentMethod) || 'N/A')
            ],
            [
              field('Sales-tax basis', taxBasisLabel(data.transaction.taxBasis) || 'N/A'),
              field('', '')
            ]
          ]
        },
        layout: 'lightHorizontalLines',
        margin: section
      },

      sectionHeader('Parties'),
      {
        table: {
          widths: ['*'],
          body: [
            [field('Seller', `${party(data.seller)} ${partyTypeLabel(data.seller.type)}`.trim())],
            [field('Buyer', `${party(data.buyer)} ${partyTypeLabel(data.buyer.type)}`.trim())],
            [
              field(
                'Signed',
                `Seller: ${yesNoLabel(data.seller.signed) || 'N/A'}; Buyer: ${yesNoLabel(data.buyer.signed) || 'N/A'}`
              )
            ]
          ]
        },
        layout: 'lightHorizontalLines',
        margin: section
      },

      sectionHeader('Vehicle and odometer'),
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              field(
                'Vehicle',
                [data.vehicle.year, data.vehicle.make, data.vehicle.model]
                  .filter((x) => x)
                  .join(' ') || 'N/A'
              ),
              field('VIN', data.vehicle.vin || 'N/A')
            ],
            [
              field('Body type', data.vehicle.bodyType || 'N/A'),
              field('Title brand', titleBrandLabel(data.vehicle.titleBrand) || 'N/A')
            ],
            [
              field(
                'Odometer',
                data.odometer.readingMiles != null
                  ? `${data.odometer.readingMiles.toLocaleString('en-US')} miles`
                  : 'N/A'
              ),
              field('Certification', odometerStatusLabel(data.odometer.status) || 'N/A')
            ]
          ]
        },
        layout: 'lightHorizontalLines',
        margin: section
      },

      sectionHeader('Terms, title, and lien'),
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              field('Warranty terms', asIsClauseLabel(data.terms.asIsClause) || 'N/A'),
              field('Lien', lienStatusLabel(data.terms.lienStatus) || 'N/A')
            ],
            [
              field('Seller holds title', yesNoLabel(data.terms.sellerHoldsTitle) || 'N/A'),
              field('Title signed over', yesNoLabel(data.terms.titleSigned) || 'N/A')
            ],
            [
              field('Notarized', notarizedLabel(data.terms.notarized) || 'N/A'),
              field(
                'Release of liability filed',
                yesNoLabel(data.afterSale.releaseOfLiabilityFiled) || 'N/A'
              )
            ]
          ]
        },
        layout: 'lightHorizontalLines',
        margin: section
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
              margin: section
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
