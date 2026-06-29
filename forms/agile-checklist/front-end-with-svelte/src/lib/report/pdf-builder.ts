import type { TDocumentDefinitions, Content } from 'pdfmake/interfaces';
import type { AgileChecklist, GradingResult } from '$lib/engine/types.js';
import { ALL_ITEMS, SECTION_LABEL } from '$lib/config/items.js';
import { maturityLabel, pctOrDash } from '$lib/engine/utils.js';

/**
 * Build the pdfmake document definition for an agile checklist report. Pure —
 * no pdfmake runtime import — so it can run on the server in the PDF endpoint.
 */
export function buildPdfDocument(data: AgileChecklist, result: GradingResult): TDocumentDefinitions {
  const itemRows: Content = {
    table: {
      widths: ['auto', 'auto', '*', 'auto'],
      headerRows: 1,
      body: [
        [
          { text: 'ID', bold: true },
          { text: 'Section', bold: true },
          { text: 'Item', bold: true },
          { text: 'Answer', bold: true },
        ],
        ...ALL_ITEMS.map((item) => [
          item.id,
          SECTION_LABEL[item.section],
          item.text,
          (data.answers[item.id] || '—').toString().toUpperCase(),
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

  return {
    info: { title: 'Agile Checklist Report' },
    content: [
      { text: 'Agile Checklist', style: 'h1' },
      {
        text: `Respondent: ${data.respondent.fullName || '—'} (${data.respondent.role || '—'})`,
      },
      { text: `Team: ${data.respondent.teamName || '—'}` },
      { text: `Organisation: ${data.respondent.organisationName || '—'}` },
      { text: `Assessment date: ${data.respondent.assessmentDate || '—'}` },
      { text: ' ' },
      { text: 'Composite maturity', style: 'h2' },
      {
        text: `${maturityLabel(result.maturity).toUpperCase()} — overall ${pctOrDash(
          result.overallPercent,
        )} (${result.answeredCount} of 57 answered)`,
      },
      {
        text: `Teams: ${pctOrDash(result.teams.percent)} (${result.teams.band})  ·  Stakeholders: ${pctOrDash(
          result.stakeholders.percent,
        )} (${result.stakeholders.band})  ·  Practices: ${pctOrDash(result.practices.percent)} (${result.practices.band})`,
      },
      { text: ' ' },
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
      { text: 'Per-item answers', style: 'h2' },
      itemRows,
    ],
    styles: {
      h1: { fontSize: 18, bold: true, margin: [0, 0, 0, 8] },
      h2: { fontSize: 13, bold: true, margin: [0, 8, 0, 4] },
    },
    defaultStyle: { fontSize: 9 },
  };
}
