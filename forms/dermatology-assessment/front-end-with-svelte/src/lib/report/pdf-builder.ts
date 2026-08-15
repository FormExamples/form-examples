import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import { dlqiScoreLabel, calculateAge } from '#lib/engine/utils.js';

/** Build the pdfmake document definition for a dermatology assessment report. */
export function buildPdfDocument(data: AssessmentData, result: GradingResult) {
	const d = data.demographics;
	const age = calculateAge(d.dateOfBirth);

	const content: unknown[] = [
		{ text: 'Dermatology Assessment Report', style: 'title' },
		{
			text: `DLQI score: ${result.dlqiScore} / 30 — ${dlqiScoreLabel(result.dlqiScore)}  ·  ${result.dlqiCategory}`,
			style: 'subtitle'
		},
		{ text: 'Patient', style: 'h2' },
		{
			columns: [
				field('Name', `${d.firstName} ${d.lastName}`.trim() || 'N/A'),
				field('DOB', `${d.dateOfBirth || 'N/A'}${age ? ` (Age ${age})` : ''}`)
			]
		},
		{
			columns: [
				field('Sex', d.sex || 'N/A'),
				field('Chief complaint', data.chiefComplaint.primaryConcern || 'N/A')
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
			{ text: 'DLQI scoring detail', style: 'h2' },
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
