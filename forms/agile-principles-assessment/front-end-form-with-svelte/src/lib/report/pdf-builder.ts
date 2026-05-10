import pdfMake from 'pdfmake/build/pdfmake.js';
import pdfFonts from 'pdfmake/build/vfs_fonts.js';
import type { TDocumentDefinitions, Content } from 'pdfmake/interfaces';
import type { AgileAssessment, GradingResult } from '$lib/engine/types.js';
import { PRINCIPLES } from '$lib/config/principles.js';

// pdfmake's vfs is exposed under different shapes across versions; tolerate both.
type PdfFonts = { pdfMake?: { vfs: unknown }; vfs?: unknown };
const fonts = pdfFonts as unknown as PdfFonts;
const vfs = fonts.pdfMake?.vfs ?? fonts.vfs;
if (vfs) {
  (pdfMake as unknown as { vfs: unknown }).vfs = vfs;
}

export function buildPdf(data: AgileAssessment, result: GradingResult): void {
  const principleRows: Content = {
    table: {
      widths: ['auto', '*', 'auto', 'auto'],
      headerRows: 1,
      body: [
        [
          { text: '#', bold: true },
          { text: 'Principle', bold: true },
          { text: 'Score', bold: true },
          { text: 'Band', bold: true },
        ],
        ...PRINCIPLES.map((p) => [
          `P${p.number}`,
          p.shortTitle,
          (data.responses[p.number - 1].score ?? '—').toString(),
          (result.perPrincipleBands[p.number - 1] ?? '—').toUpperCase(),
        ]),
      ],
    },
    margin: [0, 4, 0, 8],
  };

  const flagsList: Content = result.additionalFlags.length
    ? {
        ul: result.additionalFlags.map(
          (f) => `[${f.priority.toUpperCase()}] ${f.description} — ${f.suggestedAction}`,
        ),
        margin: [0, 4, 0, 8],
      }
    : { text: 'No operational flags raised.', italics: true, margin: [0, 4, 0, 8] };

  const actions: string[] = [
    data.actionPlan.topAction1,
    data.actionPlan.topAction2,
    data.actionPlan.topAction3,
  ].filter((a) => a.trim().length > 0);

  const actionContent: Content = actions.length
    ? { ol: actions, margin: [0, 4, 0, 8] }
    : { text: 'No actions captured.', italics: true, margin: [0, 4, 0, 8] };

  const docDefinition: TDocumentDefinitions = {
    info: { title: 'Agile Principles Assessment Report' },
    content: [
      { text: 'Agile Principles Assessment', style: 'h1' },
      {
        text: data.respondent.isAnonymous
          ? 'Respondent: Anonymous'
          : `Respondent: ${data.respondent.fullName || '—'} (${data.respondent.role || '—'})`,
      },
      { text: `Team: ${data.respondent.teamName || '—'}` },
      { text: `Organisation: ${data.respondent.organisationName || '—'}` },
      { text: `Assessment date: ${data.respondent.assessmentDate || '—'}` },
      { text: ' ' },
      { text: 'Composite maturity', style: 'h2' },
      {
        text: `${result.maturity.toUpperCase()} — mean ${
          result.meanScore !== null ? result.meanScore.toFixed(2) : 'insufficient data'
        } (${result.answeredCount} of 12 answered)`,
      },
      { text: ' ' },
      { text: 'Per-principle scores', style: 'h2' },
      principleRows,
      { text: 'Operational flags', style: 'h2' },
      flagsList,
      { text: 'Top actions', style: 'h2' },
      actionContent,
      ...(data.actionPlan.coachNotes
        ? ([
            { text: 'Coach notes', style: 'h2' },
            { text: data.actionPlan.coachNotes },
          ] as Content[])
        : []),
    ],
    styles: {
      h1: { fontSize: 18, bold: true, margin: [0, 0, 0, 8] },
      h2: { fontSize: 13, bold: true, margin: [0, 8, 0, 4] },
    },
    defaultStyle: { fontSize: 10 },
  };

  pdfMake.createPdf(docDefinition).download('agile-principles-assessment.pdf');
}
