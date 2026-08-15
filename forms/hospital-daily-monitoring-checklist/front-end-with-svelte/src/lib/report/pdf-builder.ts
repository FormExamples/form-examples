import type { TDocumentDefinitions, Content } from 'pdfmake/interfaces';
import type { ChecklistSummaryResult, HospitalDailyMonitoringChecklist } from '#lib/engine/types.js';
import { CHECKLIST_ITEMS, SECTIONS } from '#lib/config/items.js';
import { statusLabel } from '#lib/engine/utils.js';

/**
 * Build the pdfmake document definition for a hospital daily monitoring
 * checklist report. Pure — no pdfmake runtime import — so it can run on the
 * server in the PDF endpoint.
 */
export function buildPdfDocument(
  data: HospitalDailyMonitoringChecklist,
  result: ChecklistSummaryResult,
): TDocumentDefinitions {
  const needsAttentionContent: Content = result.needsAttentionItems.length
    ? {
        table: {
          widths: ['auto', 'auto', '*', '*'],
          headerRows: 1,
          body: [
            [
              { text: 'ID', bold: true },
              { text: 'Area', bold: true },
              { text: 'Checkpoint', bold: true },
              { text: 'Remarks', bold: true },
            ],
            ...result.needsAttentionItems.map((item) => [
              item.id,
              item.sectionTitle,
              item.text,
              item.remarks || '—',
            ]),
          ],
        },
        margin: [0, 4, 0, 8],
      }
    : { text: 'No checkpoints marked needs-attention.', italics: true, margin: [0, 4, 0, 8] };

  const perCheckpointSections: Content[] = SECTIONS.flatMap((section) => {
    const items = CHECKLIST_ITEMS.filter((i) => i.section === section.number);
    const table: Content = {
      table: {
        widths: ['auto', '*', 'auto', '*'],
        headerRows: 1,
        body: [
          [
            { text: 'ID', bold: true },
            { text: 'Checkpoint', bold: true },
            { text: 'Status', bold: true },
            { text: 'Remarks', bold: true },
          ],
          ...items.map((item) => {
            const response = data.items[item.id];
            return [
              item.id,
              item.text,
              statusLabel(response?.status ?? ''),
              response?.remarks || '—',
            ];
          }),
        ],
      },
      margin: [0, 2, 0, 8],
    };
    return [
      { text: `${section.number}. ${section.title}`, style: 'h3' },
      table,
    ];
  });

  return {
    info: { title: 'Hospital Daily Monitoring Checklist Report' },
    content: [
      { text: 'Hospital Daily Monitoring Checklist', style: 'h1' },
      { text: `Hospital: ${data.inspectionDetails.hospitalName || '—'}` },
      { text: `Department / site: ${data.inspectionDetails.departmentOrSite || '—'}` },
      { text: `Inspection date: ${data.inspectionDetails.inspectionDate || '—'}` },
      {
        text: `Inspecting officer: ${data.inspectionDetails.inspectingOfficerName || '—'} (${
          data.inspectionDetails.inspectingOfficerDesignation || '—'
        })`,
      },
      { text: ' ' },
      { text: 'Summary', style: 'h2' },
      {
        text: `${result.answeredCount} of 97 checkpoints answered · ${result.needsAttentionCount} needing attention across ${result.sectionsWithNeedsAttention.length} area(s).`,
      },
      { text: ' ' },
      { text: 'Needs-attention checkpoints', style: 'h2' },
      needsAttentionContent,
      ...(data.summary.overallNotes
        ? ([{ text: 'Overall notes', style: 'h2' }, { text: data.summary.overallNotes }] as Content[])
        : []),
      ...(data.summary.actionPlan
        ? ([{ text: 'Action plan', style: 'h2' }, { text: data.summary.actionPlan }] as Content[])
        : []),
      ...(data.summary.signedAt
        ? ([{ text: `Signed at: ${data.summary.signedAt}` }] as Content[])
        : []),
      { text: ' ' },
      { text: 'Per-checkpoint answers', style: 'h2' },
      ...perCheckpointSections,
    ],
    styles: {
      h1: { fontSize: 18, bold: true, margin: [0, 0, 0, 8] },
      h2: { fontSize: 13, bold: true, margin: [0, 8, 0, 4] },
      h3: { fontSize: 11, bold: true, margin: [0, 6, 0, 2] },
    },
    defaultStyle: { fontSize: 8 },
  };
}
