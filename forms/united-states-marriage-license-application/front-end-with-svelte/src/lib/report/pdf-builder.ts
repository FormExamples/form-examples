import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { MarriageApplication, ValidationResult } from '#lib/engine/types.js';
import {
  applicationClassLabel,
  priorityLabel,
  sexLabel,
  maritalStatusLabel,
  officiantTypeLabel,
  yesNoLabel
} from '#lib/engine/utils.js';

type Margin = [number, number, number, number];
const GAP: Margin = [0, 0, 0, 16];

export function buildPdfDocument(
  data: MarriageApplication,
  result: ValidationResult
): TDocumentDefinitions {
  return {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    header: {
      text: 'UNITED STATES MARRIAGE LICENSE APPLICATION — ELIGIBILITY REPORT',
      alignment: 'center',
      margin: [0, 20, 0, 0],
      fontSize: 10,
      color: '#6b7280',
      bold: true
    },
    footer: (currentPage: number, pageCount: number) => ({
      text: `Page ${currentPage} of ${pageCount} | Documentation support — NOT legal advice; the county clerk decides | Generated ${new Date(result.timestamp).toLocaleString()}`,
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
        text: `Earliest ceremony: ${result.earliestCeremonyDate || 'not determinable'}  ·  License valid through: ${result.licenseExpiryDate || 'not determinable'}${result.stateRuleKnown ? '' : '  ·  Verify the state rule'}`,
        fontSize: 11,
        alignment: 'center' as const,
        color: '#4b5563',
        margin: [0, 0, 0, 20] as Margin
      },

      sectionHeader('Jurisdiction'),
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              field('State', data.jurisdiction.state || 'N/A'),
              field('County', data.jurisdiction.county || 'N/A')
            ],
            [
              field('Applied', data.jurisdiction.applicationDate || 'N/A'),
              field('License issued', data.issuance.licenseIssuedDate || 'N/A')
            ]
          ]
        },
        layout: 'lightHorizontalLines',
        margin: GAP
      },

      sectionHeader('Applicants'),
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              field('First applicant', data.applicantOne.name || 'N/A'),
              field('Second applicant', data.applicantTwo.name || 'N/A')
            ],
            [
              field('Date of birth', data.applicantOne.dateOfBirth || 'N/A'),
              field('Date of birth', data.applicantTwo.dateOfBirth || 'N/A')
            ],
            [
              field('Sex or gender', sexLabel(data.applicantOne.sex) || 'N/A'),
              field('Sex or gender', sexLabel(data.applicantTwo.sex) || 'N/A')
            ],
            [
              field('Marital status', maritalStatusLabel(data.applicantOne.maritalStatus) || 'N/A'),
              field('Marital status', maritalStatusLabel(data.applicantTwo.maritalStatus) || 'N/A')
            ]
          ]
        },
        layout: 'lightHorizontalLines',
        margin: GAP
      },

      sectionHeader('Ceremony and certificate'),
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              field('Ceremony', data.ceremony.ceremonyDate || 'N/A'),
              field(
                'Officiant',
                `${officiantTypeLabel(data.ceremony.officiantType) || 'N/A'} ${data.ceremony.officiantName}`.trim()
              )
            ],
            [
              field('Officiant authorized', yesNoLabel(data.ceremony.officiantAuthorized) || 'N/A'),
              field('Witnesses', String(data.ceremony.witnessCount ?? 'N/A'))
            ],
            [
              field('License returned', data.ceremony.licenseReturnedDate || 'N/A'),
              field('Certified copies', String(data.ceremony.certifiedCopiesRequested ?? 'N/A'))
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
        : []),

      ...(data.issuance.clerkNote
        ? [sectionHeader('Note'), { text: data.issuance.clerkNote, fontSize: 10, margin: GAP }]
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
