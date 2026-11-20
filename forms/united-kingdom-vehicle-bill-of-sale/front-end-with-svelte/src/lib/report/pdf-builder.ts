import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { BillOfSale, AssessmentResult } from '#lib/engine/types.js';
import {
  classificationLabel,
  priorityLabel,
  sellerCapacityLabel,
  motStatusLabel,
  financeStatusLabel,
  paymentMethodLabel,
  saleTermsLabel,
  dvlaNotificationLabel,
  yesNoLabel
} from '#lib/engine/utils.js';

type Margin = [number, number, number, number];

export function buildPdfDocument(data: BillOfSale, result: AssessmentResult): TDocumentDefinitions {
  return {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    header: {
      text: 'UNITED KINGDOM VEHICLE BILL OF SALE — REPORT',
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
        text: `Classification: ${classificationLabel(result.classification)}`,
        fontSize: 18,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 4]
      },
      {
        text: `${result.missingItemCount} item(s) missing  ·  ${result.riskFlagCount} risk condition(s)`,
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
              field('Date of sale', data.sale.saleDate || 'N/A'),
              field('Place of sale', data.sale.salePlace || 'N/A')
            ],
            [
              field('Seller', data.seller.name || 'N/A'),
              field('Seller is', sellerCapacityLabel(data.sale.sellerCapacity) || 'N/A')
            ],
            [
              field('Registered keeper', yesNoLabel(data.seller.isRegisteredKeeper) || 'N/A'),
              field('Buyer', data.buyer.name || 'N/A')
            ]
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 16] as Margin
      },

      sectionHeader('Vehicle'),
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              field('Registration', data.vehicle.registration || 'N/A'),
              field(
                'Make and model',
                [data.vehicle.make, data.vehicle.model].join(' ').trim() || 'N/A'
              )
            ],
            [
              field('VIN', data.vehicle.vin || 'N/A'),
              field(
                'Mileage',
                data.vehicle.mileage != null ? `${data.vehicle.mileage} miles` : 'N/A'
              )
            ],
            [
              field('V5C present', yesNoLabel(data.checks.v5cPresent) || 'N/A'),
              field('V5C details match', yesNoLabel(data.checks.v5cDetailsMatch) || 'N/A')
            ],
            [
              field('MOT', motStatusLabel(data.checks.motStatus) || 'N/A'),
              field('Finance', financeStatusLabel(data.checks.financeStatus) || 'N/A')
            ]
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 16] as Margin
      },

      sectionHeader('Price, payment, and terms'),
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              field(
                'Price',
                data.payment.priceAsGbp != null ? `£${data.payment.priceAsGbp}` : 'N/A'
              ),
              field('Payment method', paymentMethodLabel(data.payment.paymentMethod) || 'N/A')
            ],
            [
              field('Funds received', yesNoLabel(data.payment.paymentReceived) || 'N/A'),
              field('Terms', saleTermsLabel(data.condition.saleTerms) || 'N/A')
            ],
            [
              field('V5C/2 slip given', yesNoLabel(data.dvla.newKeeperSlipGiven) || 'N/A'),
              field('DVLA', dvlaNotificationLabel(data.dvla.dvlaNotification) || 'N/A')
            ],
            [
              field('Seller signed', yesNoLabel(data.signatures.sellerSigned) || 'N/A'),
              field('Buyer signed', yesNoLabel(data.signatures.buyerSigned) || 'N/A')
            ]
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 16] as Margin
      },

      ...(result.missingItems.length > 0
        ? [
            sectionHeader('Missing items'),
            {
              ul: result.missingItems,
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
        : []),

      ...(data.condition.knownFaults
        ? [
            sectionHeader('Known faults'),
            { text: data.condition.knownFaults, fontSize: 10, margin: [0, 0, 0, 16] as Margin }
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
