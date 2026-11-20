import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { SocialSecurityApplication, ValidationResult } from '#lib/engine/types.js';
import {
  applicationClassLabel,
  optionLabel,
  priorityLabel,
  yesNoLabel
} from '#lib/engine/utils.js';

export function buildPdfDocument(
  data: SocialSecurityApplication,
  result: ValidationResult
): TDocumentDefinitions {
  return {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    header: {
      text: 'SOCIAL SECURITY CARD APPLICATION (FORM SS-5) — READINESS REPORT',
      alignment: 'center',
      margin: [0, 20, 0, 0],
      fontSize: 10,
      color: '#6b7280',
      bold: true
    },
    footer: (currentPage: number, pageCount: number) => ({
      text: `Page ${currentPage} of ${pageCount} | Documentation support — NOT legal advice and NOT an SSA decision | Generated ${new Date(result.timestamp).toLocaleString()}`,
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
        text: `Evidence gaps: ${result.missingEvidenceCount}  ·  Replacement limit reached: ${result.replacementLimitReached ? 'Yes' : 'No'}`,
        fontSize: 11,
        alignment: 'center' as const,
        color: '#4b5563',
        margin: [0, 0, 0, 20] as [number, number, number, number]
      },

      sectionHeader('Request'),
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              field('Request', optionLabel('requestType', data.request.requestType) || 'N/A'),
              field('Application date', data.request.applicationDate || 'N/A')
            ],
            [
              field('Channel', optionLabel('channel', data.request.channel) || 'N/A'),
              field('Name change', yesNoLabel(data.request.nameChange) || 'N/A')
            ]
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 16] as [number, number, number, number]
      },

      sectionHeader('Applicant'),
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              field('Name on card', data.applicant.nameOnCard || 'N/A'),
              field('Date of birth', data.applicant.dateOfBirth || 'N/A')
            ],
            [
              field('Citizenship', optionLabel('citizenship', data.applicant.citizenship) || 'N/A'),
              field('State of residence', data.applicant.stateOfResidence || 'N/A')
            ]
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 16] as [number, number, number, number]
      },

      sectionHeader('Evidence'),
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              field(
                'Identity',
                optionLabel('identityDocument', data.evidence.identityDocument) || 'N/A'
              ),
              field('Age', optionLabel('ageDocument', data.evidence.ageDocument) || 'N/A')
            ],
            [
              field(
                'Citizenship or status',
                optionLabel('citizenshipDocument', data.evidence.citizenshipDocument) || 'N/A'
              ),
              field(
                'Originals or certified',
                yesNoLabel(data.evidence.documentsOriginalOrCertified) || 'N/A'
              )
            ]
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 16] as [number, number, number, number]
      },

      sectionHeader('Signer and Tell SSA'),
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              field(
                'Signer',
                optionLabel('signerRelationship', data.filer.signerRelationship) || 'N/A'
              ),
              field('Signed', yesNoLabel(data.filer.signaturePresent) || 'N/A')
            ],
            [
              field('Applicant deceased', yesNoLabel(data.tellSsa.applicantDeceased) || 'N/A'),
              field('Death reported', yesNoLabel(data.tellSsa.deathReportedToSsa) || 'N/A')
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

      ...(data.tellSsa.preparerNote
        ? [
            sectionHeader('Preparer note'),
            {
              text: data.tellSsa.preparerNote,
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
