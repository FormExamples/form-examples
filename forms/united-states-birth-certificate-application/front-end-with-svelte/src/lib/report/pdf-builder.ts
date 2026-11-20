import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { BirthCertificateApplication, ValidationResult } from '#lib/engine/types.js';
import {
  applicationClassLabel,
  priorityLabel,
  sexLabel,
  relationshipLabel,
  purposeLabel,
  certificateTypeLabel,
  deliveryMethodLabel,
  idTypeLabel,
  yesNoLabel
} from '#lib/engine/utils.js';

type Margin = [number, number, number, number];

export function buildPdfDocument(
  data: BirthCertificateApplication,
  result: ValidationResult
): TDocumentDefinitions {
  return {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    header: {
      text: 'UNITED STATES BIRTH CERTIFICATE APPLICATION — READINESS REPORT',
      alignment: 'center',
      margin: [0, 20, 0, 0],
      fontSize: 10,
      color: '#6b7280',
      bold: true
    },
    footer: (currentPage: number, pageCount: number) => ({
      text: `Page ${currentPage} of ${pageCount} | Documentation support — not legal advice; the issuing agency decides | Generated ${new Date(result.timestamp).toLocaleString()}`,
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
        text: `Expected fee: ${result.expectedFeeUsd === null ? 'unknown' : `$${result.expectedFeeUsd.toFixed(2)}`}  ·  Rule applied: ${result.stateRuleApplied === 'state' ? 'state rule' : 'uniform default'}`,
        fontSize: 11,
        alignment: 'center' as const,
        color: '#4b5563',
        margin: [0, 0, 0, 20] as Margin
      },

      sectionHeader('Applicant'),
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              field('Name', data.applicant.applicantName || 'N/A'),
              field('Relationship', relationshipLabel(data.purpose.relationship) || 'N/A')
            ],
            [
              field('Purpose', purposeLabel(data.purpose.purpose) || 'N/A'),
              field('Apostille needed', yesNoLabel(data.purpose.needsApostille) || 'N/A')
            ]
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 16] as Margin
      },

      sectionHeader('Person named on the certificate'),
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              field('Name', data.registrant.registrantName || 'N/A'),
              field('Sex', sexLabel(data.registrant.sex) || 'N/A')
            ],
            [
              field('Date of birth', data.registrant.dateOfBirth || 'N/A'),
              field(
                'Born',
                [data.registrant.placeOfBirth, data.registrant.state].filter(Boolean).join(', ') ||
                  'N/A'
              )
            ]
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 16] as Margin
      },

      sectionHeader('Order and documents'),
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              field('Copy type', certificateTypeLabel(data.order.certificateType) || 'N/A'),
              field('Copies', data.order.copies != null ? String(data.order.copies) : 'N/A')
            ],
            [
              field('Delivery', deliveryMethodLabel(data.order.deliveryMethod) || 'N/A'),
              field('Photo ID', idTypeLabel(data.evidence.idType) || 'N/A')
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

      ...(data.declaration.applicationNote
        ? [
            sectionHeader('Note'),
            {
              text: data.declaration.applicationNote,
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
