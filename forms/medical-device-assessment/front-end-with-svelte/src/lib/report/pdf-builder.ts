import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import { classLabel, readinessLabel, routeLabel } from '#lib/engine/utils.js';

/** Build a pdfmake document definition for a medical device assessment. */
export function buildPdfDoc(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
  const overridden = result.finalDeviceClass !== result.computedDeviceClass;
  const section = (title: string, lines: string[]) => [
    {
      text: title,
      style: 'sectionHeader' as const,
      margin: [0, 8, 0, 4] as [number, number, number, number]
    },
    ...lines.map((l) => ({ text: l, margin: [0, 0, 0, 2] as [number, number, number, number] }))
  ];

  return {
    content: [
      { text: 'Medical Device Assessment Report', style: 'title' },
      { text: `Device: ${data.deviceName || 'Unnamed device'}`, bold: true },
      ...(data.intendedPurpose ? [`Intended purpose: ${data.intendedPurpose}`] : []),
      ...section('Manufacturer and assessor', [
        `Manufacturer: ${data.manufacturer.name || '—'} (${data.manufacturer.countryAsIso31661Alpha2 || '—'})`,
        `Assessor: ${data.assessor.name || '—'}${data.assessor.organization ? `, ${data.assessor.organization}` : ''}`,
        `Assessment date: ${data.assessmentDate ?? '—'}`
      ]),
      ...section('Classification', [
        `Computed class: ${classLabel(result.computedDeviceClass)}`,
        `Final class: ${classLabel(result.finalDeviceClass, result.classSuffix)}${overridden ? ' (assessor override)' : ''}`,
        ...(overridden && result.overrideReason
          ? [`Override reason: ${result.overrideReason}`]
          : []),
        `Conformity route: ${routeLabel(result.conformityRoute)}`,
        `Determining rule: ${result.determiningRule || 'None'}`,
        `Regulatory readiness: ${readinessLabel(result.regulatoryReadiness)}`
      ]),
      ...section(
        `Fired rules (${result.firedRules.length})`,
        result.firedRules.length === 0
          ? ['No classification rules fired.']
          : result.firedRules.map(
              (r) =>
                `Rule ${r.annexViiiRule} (${r.category}) - Class ${r.deviceClass}: ${r.description}`
            )
      ),
      ...section(
        `Flags (${result.additionalFlags.length})`,
        result.additionalFlags.length === 0
          ? ['No flags raised.']
          : result.additionalFlags.map(
              (f) => `[${f.priority.toUpperCase()}] ${f.description} ${f.suggestedAction}`
            )
      ),
      ...(data.assessorNotes ? section('Assessor notes', [data.assessorNotes]) : []),
      {
        text: '\n\nSigned: ____________________________   Date: _______________',
        margin: [0, 30, 0, 0]
      }
    ],
    styles: {
      title: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
      sectionHeader: { fontSize: 13, bold: true }
    },
    defaultStyle: { fontSize: 10, font: 'Roboto' }
  };
}
