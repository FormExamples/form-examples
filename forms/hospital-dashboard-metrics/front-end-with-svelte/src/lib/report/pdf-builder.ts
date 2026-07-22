import type { TDocumentDefinitions, Content } from 'pdfmake/interfaces';
import type { HospitalDashboardMetrics, MetricsSummaryResult } from '$lib/engine/types.js';
import { CATEGORIES, DASHBOARD_METRICS } from '$lib/config/metrics.js';

/**
 * Build the pdfmake document definition for a hospital dashboard metrics
 * report. Pure — no pdfmake runtime import — so it can run on the server in
 * the PDF endpoint.
 */
export function buildPdfDocument(
  data: HospitalDashboardMetrics,
  result: MetricsSummaryResult,
): TDocumentDefinitions {
  const categoryTallyContent: Content = {
    table: {
      widths: ['auto', '*', 'auto'],
      headerRows: 1,
      body: [
        [
          { text: 'Category', bold: true, colSpan: 2 },
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

  const perMetricSections: Content[] = CATEGORIES.flatMap((category) => {
    const metrics = DASHBOARD_METRICS.filter((m) => m.category === category.number);
    const table: Content = {
      table: {
        widths: ['auto', '*', 'auto', '*'],
        headerRows: 1,
        body: [
          [
            { text: 'ID', bold: true },
            { text: 'Metric', bold: true },
            { text: 'Value', bold: true },
            { text: 'Notes', bold: true },
          ],
          ...metrics.map((metric) => {
            const response = data.items[metric.id];
            return [
              metric.id,
              metric.text,
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
    info: { title: 'Hospital Dashboard Metrics Report' },
    content: [
      { text: 'Hospital Dashboard Metrics', style: 'h1' },
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
        text: `${result.reportedCount} of ${result.totalCount} metrics recorded. This is a completeness tally, not a scored grading engine.`,
      },
      { text: ' ' },
      { text: 'Recorded by category', style: 'h2' },
      categoryTallyContent,
      ...(data.summary.overallNotes
        ? ([{ text: 'Overall notes', style: 'h2' }, { text: data.summary.overallNotes }] as Content[])
        : []),
      ...(data.summary.signedAt
        ? ([{ text: `Signed at: ${data.summary.signedAt}` }] as Content[])
        : []),
      { text: ' ' },
      { text: 'Per-metric values', style: 'h2' },
      ...perMetricSections,
    ],
    styles: {
      h1: { fontSize: 18, bold: true, margin: [0, 0, 0, 8] },
      h2: { fontSize: 13, bold: true, margin: [0, 8, 0, 4] },
      h3: { fontSize: 11, bold: true, margin: [0, 6, 0, 2] },
    },
    defaultStyle: { fontSize: 8 },
  };
}
