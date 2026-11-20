import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { DeathCertificate, ValidationResult } from '#lib/engine/types.js';
import { validityClassLabel, priorityLabel, yesNoLabel } from '#lib/engine/utils.js';
import { optionLabel } from '#lib/engine/options.js';

export function buildPdfDocument(
  data: DeathCertificate,
  result: ValidationResult
): TDocumentDefinitions {
  return {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    header: {
      text: 'US STANDARD CERTIFICATE OF DEATH — VALIDITY REPORT',
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
        text: `Validity: ${validityClassLabel(result.validityClass)}`,
        fontSize: 18,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 4]
      },
      {
        text: `Underlying cause: ${result.underlyingCause || 'Not derived (Part I empty)'}  ·  Referral indicated: ${result.referralIndicated ? 'Yes' : 'No'}`,
        fontSize: 11,
        alignment: 'center' as const,
        color: '#4b5563',
        margin: [0, 0, 0, 20] as [number, number, number, number]
      },

      sectionHeader('Decedent and death'),
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              field('Decedent', data.decedent.decedentName || 'N/A'),
              field('Sex', optionLabel('sex', data.decedent.sex) || 'N/A')
            ],
            [
              field('State of registration', data.jurisdiction.state || 'N/A'),
              field(
                'Age at death',
                data.decedent.ageYears != null ? `${data.decedent.ageYears} years` : 'N/A'
              )
            ],
            [
              field('Date of death', data.death.dateOfDeath || 'N/A'),
              field(
                'Place of death',
                optionLabel('placeOfDeathType', data.death.placeOfDeathType) || 'N/A'
              )
            ],
            [
              field('Certifier', data.certifier.certifierName || 'N/A'),
              field('Attended the decedent', yesNoLabel(data.certifier.attendedDeceased) || 'N/A')
            ]
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 16] as [number, number, number, number]
      },

      sectionHeader('Part I: cause of death chain'),
      {
        table: {
          headerRows: 1,
          widths: ['auto', '*', 'auto'],
          body: [
            [
              { text: 'Line', bold: true, fontSize: 9 },
              { text: 'Condition', bold: true, fontSize: 9 },
              { text: 'Interval', bold: true, fontSize: 9 }
            ],
            [
              { text: 'Line (a)', fontSize: 9 },
              { text: data.partI.causeIaCondition || '—', fontSize: 9 },
              { text: data.partI.causeIaInterval || '—', fontSize: 9 }
            ],
            [
              { text: 'Line (b)', fontSize: 9 },
              { text: data.partI.causeIbCondition || '—', fontSize: 9 },
              { text: data.partI.causeIbInterval || '—', fontSize: 9 }
            ],
            [
              { text: 'Line (c)', fontSize: 9 },
              { text: data.partI.causeIcCondition || '—', fontSize: 9 },
              { text: data.partI.causeIcInterval || '—', fontSize: 9 }
            ],
            [
              { text: 'Line (d)', fontSize: 9 },
              { text: data.partI.causeIdCondition || '—', fontSize: 9 },
              { text: data.partI.causeIdInterval || '—', fontSize: 9 }
            ]
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 16] as [number, number, number, number]
      },

      sectionHeader('Part II and other certifier items'),
      {
        text: data.partII.partIiConditions || 'None recorded',
        fontSize: 10,
        margin: [0, 0, 0, 8] as [number, number, number, number]
      },
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              field('Manner of death', optionLabel('manner', data.manner.mannerOfDeath) || 'N/A'),
              field(
                'Tobacco use contributed',
                optionLabel('tobacco', data.manner.tobaccoUseContributed) || 'N/A'
              )
            ],
            [
              field('Pregnancy', optionLabel('pregnancy', data.manner.pregnancyStatus) || 'N/A'),
              field('Autopsy performed', yesNoLabel(data.partII.autopsyPerformed) || 'N/A')
            ],
            [
              field(
                'Referred to medical examiner or coroner',
                yesNoLabel(data.referral.referredToMedicalExaminer) || 'N/A'
              ),
              field(
                'Referral reason',
                optionLabel('referralReason', data.referral.referralReason) || 'N/A'
              )
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

      ...(data.referral.certifierNote
        ? [
            sectionHeader('Certifier note'),
            {
              text: data.referral.certifierNote,
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
