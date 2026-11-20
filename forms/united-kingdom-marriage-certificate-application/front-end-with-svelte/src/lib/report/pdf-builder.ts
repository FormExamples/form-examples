import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { Application, Party, ValidationResult } from '#lib/engine/types.js';
import {
  validityClassLabel,
  priorityLabel,
  noticeTypeLabel,
  ceremonyTypeLabel,
  nationalityStatusLabel,
  maritalStatusLabel,
  certificateServiceLabel,
  yesNoLabel
} from '#lib/engine/utils.js';

export function buildPdfDocument(
  data: Application,
  result: ValidationResult
): TDocumentDefinitions {
  const pad = [0, 0, 0, 16] as [number, number, number, number];
  const partyTable = (label: string, p: Party) => [
    [field(`${label} — name`, p.name || 'N/A'), field('Date of birth', p.dateOfBirth || 'N/A')],
    [
      field(
        'Days in district',
        p.daysResidentInDistrict != null ? String(p.daysResidentInDistrict) : 'N/A'
      ),
      field('Route', nationalityStatusLabel(p.nationalityStatus) || 'N/A')
    ],
    [
      field('Status', maritalStatusLabel(p.maritalStatus) || 'N/A'),
      field(
        'Identity / address proof',
        `${yesNoLabel(p.identityProvided) || 'N/A'} / ${yesNoLabel(p.addressProofProvided) || 'N/A'}`
      )
    ],
    [
      field('Previous relationship ended', yesNoLabel(p.priorEndEvidenceProvided) || 'N/A'),
      field('Immigration evidence', yesNoLabel(p.immigrationEvidenceProvided) || 'N/A')
    ]
  ];
  return {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    header: {
      text: 'UNITED KINGDOM MARRIAGE CERTIFICATE APPLICATION — VALIDITY REPORT',
      alignment: 'center',
      margin: [0, 20, 0, 0],
      fontSize: 10,
      color: '#6b7280',
      bold: true
    },
    footer: (currentPage: number, pageCount: number) => ({
      text: `Page ${currentPage} of ${pageCount} | Completeness check — NOT legal advice; the register office decides each notice | Generated ${new Date(result.timestamp).toLocaleString()}`,
      alignment: 'center',
      margin: [0, 20, 0, 0],
      fontSize: 8,
      color: '#9ca3af'
    }),
    content: [
      {
        text: `Application: ${validityClassLabel(result.validityClass)}`,
        fontSize: 18,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 4]
      },
      {
        text: `Ceremony window: ${result.earliestCeremonyDate ? `${result.earliestCeremonyDate} to ${result.latestCeremonyDate}` : 'not determinable'}  ·  Immigration referral indicated: ${result.immigrationReferralIndicated ? 'Yes' : 'No'}`,
        fontSize: 11,
        alignment: 'center' as const,
        color: '#4b5563',
        margin: [0, 0, 0, 20] as [number, number, number, number]
      },

      sectionHeader('Notice and ceremony'),
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              field('Notice', noticeTypeLabel(data.notice.noticeType) || 'N/A'),
              field('Notice date', data.notice.noticeDate || 'N/A')
            ],
            [
              field('Registration district', data.notice.registrationDistrict || 'N/A'),
              field('Notice given together', yesNoLabel(data.notice.noticeGivenTogether) || 'N/A')
            ],
            [
              field('Ceremony', ceremonyTypeLabel(data.ceremony.ceremonyType) || 'N/A'),
              field('Ceremony date', data.ceremony.ceremonyDate || 'N/A')
            ],
            [
              field('Venue', data.ceremony.venueName || 'N/A'),
              field(
                'Witnesses',
                data.ceremony.witnessCount != null ? String(data.ceremony.witnessCount) : 'N/A'
              )
            ]
          ]
        },
        layout: 'lightHorizontalLines',
        margin: pad
      },

      sectionHeader('First party'),
      {
        table: { widths: ['*', '*'], body: partyTable('First party', data.partyOne) },
        layout: 'lightHorizontalLines',
        margin: pad
      },

      sectionHeader('Second party'),
      {
        table: { widths: ['*', '*'], body: partyTable('Second party', data.partyTwo) },
        layout: 'lightHorizontalLines',
        margin: pad
      },

      sectionHeader('Certificate order'),
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              field(
                'Copies',
                data.certificate.certificateCopies != null
                  ? String(data.certificate.certificateCopies)
                  : 'N/A'
              ),
              field(
                'Service',
                certificateServiceLabel(data.certificate.certificateService) || 'N/A'
              )
            ],
            [
              field('GRO index reference', data.certificate.groIndexReference || 'N/A'),
              field('Closely related', yesNoLabel(data.relationship.closelyRelated) || 'N/A')
            ]
          ]
        },
        layout: 'lightHorizontalLines',
        margin: pad
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
              margin: pad
            }
          ]
        : []),

      ...(data.certificate.applicantNote
        ? [
            sectionHeader('Applicant note'),
            { text: data.certificate.applicantNote, fontSize: 10, margin: pad }
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
