import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { BirthRegistration, ValidationResult } from '#lib/engine/types.js';
import {
  readinessClassLabel,
  priorityLabel,
  sexLabel,
  birthCountryLabel,
  parentsRelationshipLabel,
  paternityBasisLabel,
  informantRelationshipLabel,
  registrationRouteLabel,
  identityDocumentLabel,
  yesNoLabel
} from '#lib/engine/utils.js';

const MARGIN: [number, number, number, number] = [0, 0, 0, 16];

export function buildPdfDocument(
  data: BirthRegistration,
  result: ValidationResult
): TDocumentDefinitions {
  const identity = data.informant.identityPrimaryDocument
    ? identityDocumentLabel(data.informant.identityPrimaryDocument)
    : data.informant.identitySecondaryCount !== null
      ? `${data.informant.identitySecondaryCount} secondary document(s)`
      : 'N/A';
  return {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    header: {
      text: 'UNITED KINGDOM BIRTH REGISTRATION — READINESS REPORT',
      alignment: 'center',
      margin: [0, 20, 0, 0],
      fontSize: 10,
      color: '#6b7280',
      bold: true
    },
    footer: (currentPage: number, pageCount: number) => ({
      text: `Page ${currentPage} of ${pageCount} | Completeness check — NOT the register entry | Generated ${new Date(result.timestamp).toLocaleString()}`,
      alignment: 'center',
      margin: [0, 20, 0, 0],
      fontSize: 8,
      color: '#9ca3af'
    }),
    content: [
      {
        text: `Readiness: ${readinessClassLabel(result.readinessClass)}`,
        fontSize: 18,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 4]
      },
      {
        text: `Days since birth: ${result.daysSinceBirth ?? 'not yet known'}  ·  Late registration: ${yesNoLabel(result.lateRegistration) || 'N/A'}  ·  Missing items: ${result.missingItemCount}`,
        fontSize: 11,
        alignment: 'center' as const,
        color: '#4b5563',
        margin: [0, 0, 0, 20] as [number, number, number, number]
      },

      sectionHeader('The child'),
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              field(
                'Name',
                [data.child.childForenames, data.child.childSurname].filter(Boolean).join(' ') ||
                  'N/A'
              ),
              field('Sex', sexLabel(data.child.sex) || 'N/A')
            ],
            [
              field('Date of birth', data.child.dateOfBirth || 'N/A'),
              field('Country of birth', birthCountryLabel(data.child.birthCountry) || 'N/A')
            ],
            [field('Place of birth', data.child.placeOfBirth || 'N/A'), field('', '')]
          ]
        },
        layout: 'lightHorizontalLines',
        margin: MARGIN
      },

      sectionHeader('Parents'),
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              field('Mother', data.mother.motherName || 'N/A'),
              field(
                "Parents' relationship",
                parentsRelationshipLabel(data.parentage.parentsRelationship) || 'N/A'
              )
            ],
            [
              field(
                'Second parent',
                data.parentage.secondParentIncluded === 'yes'
                  ? data.parentage.secondParentName || 'N/A'
                  : yesNoLabel(data.parentage.secondParentIncluded) || 'N/A'
              ),
              field('Basis', paternityBasisLabel(data.parentage.paternityBasis) || 'N/A')
            ]
          ]
        },
        layout: 'lightHorizontalLines',
        margin: MARGIN
      },

      sectionHeader('Informant and registration'),
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              field(
                'Informant',
                informantRelationshipLabel(data.informant.informantRelationship) || 'N/A'
              ),
              field('Name', data.informant.informantName || 'N/A')
            ],
            [
              field(
                'Registered at',
                registrationRouteLabel(data.informant.registrationRoute) || 'N/A'
              ),
              field('Registration date', data.informant.registrationDate || 'N/A')
            ],
            [field('Identity', identity), field('', '')]
          ]
        },
        layout: 'lightHorizontalLines',
        margin: MARGIN
      },

      sectionHeader('Certificate order'),
      {
        text: `Certificates: ${data.certificate.certificatesRequested ?? 'N/A'}  ·  Service: ${data.certificate.serviceLevel || 'N/A'}  ·  Payment confirmed: ${yesNoLabel(data.certificate.paymentConfirmed) || 'N/A'}`,
        fontSize: 10,
        margin: MARGIN
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
              margin: MARGIN
            }
          ]
        : []),

      ...(data.certificate.applicantNote
        ? [
            sectionHeader('Note to the registrar'),
            { text: data.certificate.applicantNote, fontSize: 10, margin: MARGIN }
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
