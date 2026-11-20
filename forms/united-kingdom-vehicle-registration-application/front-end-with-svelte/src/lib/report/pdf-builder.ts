import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { VehicleApplication, ValidationResult } from '#lib/engine/types.js';
import {
  validityClassLabel,
  priorityLabel,
  applicationTypeLabel,
  identityDocumentTypeLabel,
  typeApprovalLabel,
  motStatusLabel,
  novaStatusLabel,
  yesNoLabel,
  poundsLabel
} from '#lib/engine/utils.js';

export function buildPdfDocument(
  data: VehicleApplication,
  result: ValidationResult
): TDocumentDefinitions {
  return {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    header: {
      text: 'UNITED KINGDOM VEHICLE REGISTRATION APPLICATION — VALIDITY REPORT',
      alignment: 'center',
      margin: [0, 20, 0, 0],
      fontSize: 10,
      color: '#6b7280',
      bold: true
    },
    footer: (currentPage: number, pageCount: number) => ({
      text: `Page ${currentPage} of ${pageCount} | Completeness check — NOT a DVLA decision | Generated ${new Date(result.timestamp).toLocaleString()}`,
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
        text: `Fee due: ${poundsLabel(result.feeDueAsPence)}  ·  Missing items: ${result.missingItemCount}`,
        fontSize: 11,
        alignment: 'center' as const,
        color: '#4b5563',
        margin: [0, 0, 0, 20] as [number, number, number, number]
      },

      sectionHeader('Application'),
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              field('Application', applicationTypeLabel(data.application.applicationType) || 'N/A'),
              field('Application date', data.application.applicationDate || 'N/A')
            ],
            [
              field('Applicant', data.applicant.name || 'N/A'),
              field(
                'Identity evidence',
                identityDocumentTypeLabel(data.applicant.identityDocumentType) || 'N/A'
              )
            ],
            [
              field('Keeper', data.keeper.keeperName || 'N/A'),
              field('Owner differs', yesNoLabel(data.keeper.ownerDiffersFromKeeper) || 'N/A')
            ]
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 16] as [number, number, number, number]
      },

      sectionHeader('Vehicle'),
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              field(
                'Make and model',
                [data.vehicle.make, data.vehicle.model].join(' ').trim() || 'N/A'
              ),
              field('Registration number', data.vehicle.registrationNumber || 'N/A')
            ],
            [
              field('VIN', data.vehicle.vehicleIdentificationNumber || 'N/A'),
              field('Engine number', data.vehicle.engineNumber || 'N/A')
            ],
            [
              field('Type approval', typeApprovalLabel(data.evidence.typeApproval) || 'N/A'),
              field('MOT', motStatusLabel(data.evidence.motStatus) || 'N/A')
            ],
            [
              field('NOVA', novaStatusLabel(data.importDetails.novaStatus) || 'N/A'),
              field(
                'Declaration signed',
                yesNoLabel(data.feeAndDeclaration.declarationSigned) || 'N/A'
              )
            ]
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 16] as [number, number, number, number]
      },

      sectionHeader('Findings'),
      result.rules.length > 0
        ? {
            ul: result.rules.map((r) => ({
              text: `${r.ruleId} (${r.dimension}): ${r.description}`,
              margin: [0, 2, 0, 2] as [number, number, number, number]
            })),
            margin: [0, 0, 0, 16] as [number, number, number, number]
          }
        : {
            text: 'No missing items.',
            fontSize: 10,
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

      ...(data.feeAndDeclaration.applicantNote
        ? [
            sectionHeader('Applicant note'),
            {
              text: data.feeAndDeclaration.applicantNote,
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
