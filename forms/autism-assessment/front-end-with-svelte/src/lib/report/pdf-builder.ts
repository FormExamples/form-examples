import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import { aq10ScoreLabel, calculateAge } from '#lib/engine/utils.js';

/** Build the pdfmake document definition for an autism assessment report. */
export function buildPdfDocument(data: AssessmentData, result: GradingResult) {
	const age = calculateAge(data.demographics.dateOfBirth);
	const d = data.demographics;

	const content: unknown[] = [
		{ text: 'Autism Assessment Report', style: 'title' },
		{
			text: `AQ-10 score: ${result.aq10Score} / 10 — ${aq10ScoreLabel(result.aq10Score)}  ·  ${result.aq10Category}`,
			style: 'subtitle'
		},
		{ text: 'Patient', style: 'h2' },
		{
			columns: [
				field('Name', `${d.firstName} ${d.lastName}`.trim() || 'N/A'),
				field('DOB', `${d.dateOfBirth || 'N/A'}${age ? ` (Age ${age})` : ''}`)
			]
		}
	];

	if (result.additionalFlags.length > 0) {
		content.push(
			{ text: 'Flagged issues', style: 'h2' },
			{ ul: result.additionalFlags.map((f) => `${f.category}: ${f.message}`) }
		);
	}

	if (result.firedRules.length > 0) {
		content.push(
			{ text: 'AQ-10 scoring detail', style: 'h2' },
			{
				table: {
					headerRows: 1,
					widths: ['auto', '*'],
					body: [
						['Rule', 'Finding'],
						...result.firedRules.map((r) => [r.id, r.description])
					]
				}
			}
		);
	}

	return {
		content,
		styles: {
			title: { fontSize: 18, bold: true, margin: [0, 0, 0, 4] },
			subtitle: { fontSize: 12, margin: [0, 0, 0, 8] },
			h2: { fontSize: 13, bold: true, margin: [0, 10, 0, 4] }
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.timestamp).toLocaleString()}`,
			alignment: 'center',
			fontSize: 8,
			margin: [0, 8, 0, 0]
		}),
		defaultStyle: { fontSize: 10 }
	};
}

function field(label: string, value: string) {
	return { text: [{ text: `${label}: `, bold: true }, value], margin: [0, 1, 0, 1] };
}
