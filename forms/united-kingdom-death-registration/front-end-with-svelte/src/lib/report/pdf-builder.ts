import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { Registration, ValidationResult } from '#lib/engine/types.js';
import {
  registrationClassLabel,
  deadlineStatusLabel,
  priorityLabel,
  sexLabel,
  jurisdictionLabel,
  relationshipLabel,
  disposalMethodLabel,
  tellUsOnceStatusLabel,
  copyOrderChannelLabel,
  medicalExaminerStatusLabel,
  yesNoLabel
} from '#lib/engine/utils.js';

type Margin = [number, number, number, number];

export function buildPdfDocument(
  data: Registration,
  result: ValidationResult
): TDocumentDefinitions {
  return {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    header: {
      text: 'UNITED KINGDOM DEATH REGISTRATION — READINESS REPORT',
      alignment: 'center',
      margin: [0, 20, 0, 0],
      fontSize: 10,
      color: '#6b7280',
      bold: true
    },
    footer: (currentPage: number, pageCount: number) => ({
      text: `Page ${currentPage} of ${pageCount} | Readiness check — not legal advice | Generated ${new Date(result.timestamp).toLocaleString()}`,
      alignment: 'center',
      margin: [0, 20, 0, 0],
      fontSize: 8,
      color: '#9ca3af'
    }),
    content: [
      {
        text: `Registration: ${registrationClassLabel(result.registrationClass)}`,
        fontSize: 18,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 4]
      },
      {
        text: `5-day deadline: ${deadlineStatusLabel(result.deadlineStatus)}  ·  Days since confirmation: ${result.daysSinceConfirmation ?? 'N/A'}  ·  Qualified informant: ${result.informantQualified ? 'Yes' : 'No'}`,
        fontSize: 11,
        alignment: 'center' as const,
        color: '#4b5563',
        margin: [0, 0, 0, 20] as Margin
      },

      sectionHeader('The deceased and the death'),
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              field('Name', data.deceased.deceasedName || 'N/A'),
              field('Sex', sexLabel(data.deceased.sex) || 'N/A')
            ],
            [
              field('Date of death', data.deceased.dateOfDeath || 'N/A'),
              field('Place of death', data.deceased.placeOfDeath || 'N/A')
            ],
            [
              field('Jurisdiction', jurisdictionLabel(data.deceased.deathJurisdiction) || 'N/A'),
              field(
                'Particulars known',
                yesNoLabel(data.deceased.deceasedParticularsKnown) || 'N/A'
              )
            ]
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 16] as Margin
      },

      sectionHeader('Medical examiner, coroner and informant'),
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              field('MCCD received', yesNoLabel(data.medical.mccdReceived) || 'N/A'),
              field(
                'Medical examiner',
                medicalExaminerStatusLabel(data.medical.medicalExaminerStatus) || 'N/A'
              )
            ],
            [
              field('Confirmed on', data.medical.medicalExaminerConfirmationDate || 'N/A'),
              field('Referred to coroner', yesNoLabel(data.coroner.referredToCoroner) || 'N/A')
            ],
            [
              field('Informant', data.informant.informantName || 'N/A'),
              field('Basis', relationshipLabel(data.informant.informantRelationship) || 'N/A')
            ]
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 16] as Margin
      },

      sectionHeader('Registration and aftercare'),
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              field('Register office', data.registration.registerOffice || 'N/A'),
              field('Registered on', data.registration.registrationDate || 'N/A')
            ],
            [
              field('Disposal', disposalMethodLabel(data.aftercare.disposalMethod) || 'N/A'),
              field('Tell Us Once', tellUsOnceStatusLabel(data.aftercare.tellUsOnceStatus) || 'N/A')
            ],
            [
              field('Copies requested', String(data.aftercare.copiesRequested ?? 'N/A')),
              field('Copy channel', copyOrderChannelLabel(data.aftercare.copyOrderChannel) || 'N/A')
            ]
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 16] as Margin
      },

      ...(result.blockingRules.length > 0
        ? [
            sectionHeader('Blocking issues'),
            {
              ul: result.blockingRules.map((r) => ({
                text: r.description,
                margin: [0, 2, 0, 2] as Margin
              })),
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
