import type { TDocumentDefinitions, Content } from 'pdfmake/interfaces';
import type { HospitalPerformanceIndicators, IndicatorsSummaryResult } from '$lib/engine/types.js';
import { CATEGORIES, PERFORMANCE_INDICATORS } from '$lib/config/indicators.js';

/**
 * Build the pdfmake document definition for a hospital performance
 * indicators (Balanced Scorecard) report. Pure — no pdfmake runtime import —
 * so it can run on the server in the PDF endpoint.
 */
export function buildPdfDocument(
  data: HospitalPerformanceIndicators,
  result: IndicatorsSummaryResult,
): TDocumentDefinitions {
  const categoryTallyContent: Content = {
    table: {
      widths: ['auto', '*', 'auto'],
      headerRows: 1,
      body: [
        [
          { text: 'Perspective', bold: true, colSpan: 2 },
          {},
          { text: 'Recorded', bold: true },
        ],
        ...result.categoryCounts.map((c) => [
          c.category,
          c.categoryTitle,
          `${c.reported} / ${c.total}`,
        ]),
      ],
    },
    margin: [0, 4, 0, 8],
  };

  const perIndicatorSections: Content[] = CATEGORIES.flatMap((category) => {
    const indicators = PERFORMANCE_INDICATORS.filter((i) => i.category === category.number);
    const table: Content = {
      table: {
        widths: ['auto', '*', 'auto', '*'],
        headerRows: 1,
        body: [
          [
            { text: 'ID', bold: true },
            { text: 'Indicator', bold: true },
            { text: 'Value', bold: true },
            { text: 'Notes', bold: true },
          ],
          ...indicators.map((indicator) => {
            const response = data.items[indicator.id];
            return [
              indicator.id,
              indicator.text,
              response?.value != null ? String(response.value) : '—',
              response?.notes || '—',
            ];
          }),
        ],
      },
      margin: [0, 2, 0, 8],
    };
    return [
      { text: `${category.number}. ${category.title}`, style: 'h3' },
      table,
    ];
  });

  return {
    info: { title: 'Hospital Performance Indicators Report' },
    content: [
      { text: 'Hospital Performance Indicators — Balanced Scorecard', style: 'h1' },
      { text: `Hospital / site: ${data.reportingPeriod.hospitalName || '—'}` },
      { text: `Prepared by: ${data.reportingPeriod.preparedByName || '—'}` },
      {
        text: `Period: ${data.reportingPeriod.periodMonth ?? '—'} / ${
          data.reportingPeriod.periodYear ?? '—'
        }`,
      },
      { text: ' ' },
      { text: 'Summary', style: 'h2' },
      {
        text: `${result.reportedCount} of ${result.totalCount} indicators recorded. This is a completeness tally, not a scored grading engine.`,
      },
      { text: ' ' },
      { text: 'Recorded by perspective', style: 'h2' },
      categoryTallyContent,
      ...(data.summary.overallNotes
        ? ([{ text: 'Overall notes', style: 'h2' }, { text: data.summary.overallNotes }] as Content[])
        : []),
      ...(data.summary.signedAt
        ? ([{ text: `Signed at: ${data.summary.signedAt}` }] as Content[])
        : []),
      { text: ' ' },
      { text: 'Per-indicator values', style: 'h2' },
      ...perIndicatorSections,
    ],
    styles: {
      h1: { fontSize: 18, bold: true, margin: [0, 0, 0, 8] },
      h2: { fontSize: 13, bold: true, margin: [0, 8, 0, 4] },
      h3: { fontSize: 11, bold: true, margin: [0, 6, 0, 2] },
    },
    defaultStyle: { fontSize: 8 },
  };
}
