import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import { gradeLabel } from '#lib/engine/utils.js';

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	const c = data.candidate;

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'CYMRAEG CLINICAL SPEAKING ASSESSMENT REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.timestamp).toLocaleString()}`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: `Grade: ${gradeLabel(result.grade)}`,
				fontSize: 20,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `Scaled score ${result.scaledScore} / 500  ·  Linguistic ${result.linguisticTotal} / 24  ·  Clinical ${result.clinicalTotal} / 15`,
				fontSize: 12,
				alignment: 'center',
				color: '#4b5563',
				margin: [0, 0, 0, 20]
			},

			sectionHeader('Candidate Details'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[field('Candidate ID', c.candidateId || 'N/A'), field('Name', c.candidateName || 'N/A')],
						[field('Examiner', c.examinerName || 'N/A'), field('Test centre', c.testCentre || 'N/A')],
						[
							field('Test date', c.testDate || 'N/A'),
							field('Years of experience', c.yearsOfExperience || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			...(result.additionalFlags.length > 0
				? [
						sectionHeader('Flagged Issues'),
						{
							ul: result.additionalFlags.map((f) => ({
								text: `[${f.priority.toUpperCase()}] ${f.category}: ${f.message}`,
								color:
									f.priority === 'high' ? '#dc2626' : f.priority === 'medium' ? '#d97706' : '#4b5563',
								margin: [0, 2, 0, 2] as [number, number, number, number]
							})),
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			sectionHeader('Per-criterion Scores'),
			{
				table: {
					headerRows: 1,
					widths: ['*', 50, 60, 60, 60],
					body: [
						[
							{ text: 'Criterion', bold: true, fontSize: 9 },
							{ text: 'Max', bold: true, fontSize: 9 },
							{ text: 'Role-play 1', bold: true, fontSize: 9 },
							{ text: 'Role-play 2', bold: true, fontSize: 9 },
							{ text: 'Mean', bold: true, fontSize: 9 }
						],
						...result.perCriterionScores.map((s) => [
							{ text: s.label, fontSize: 9 },
							{ text: String(s.maxScore), fontSize: 9 },
							{ text: s.rolePlay1Score === null ? '—' : String(s.rolePlay1Score), fontSize: 9 },
							{ text: s.rolePlay2Score === null ? '—' : String(s.rolePlay2Score), fontSize: 9 },
							{ text: s.meanScore === null ? '—' : String(s.meanScore), fontSize: 9, bold: true }
						])
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			...(data.clinicalIndicators.examinerNotes.trim().length > 0
				? [
						sectionHeader('Examiner Feedback'),
						{
							text: data.clinicalIndicators.examinerNotes,
							fontSize: 10,
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: [])
		],
		defaultStyle: { fontSize: 10 }
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
		text: [
			{ text: `${label}: `, bold: true, color: '#6b7280' },
			{ text: value }
		],
		margin: [0, 4, 0, 4] as [number, number, number, number]
	};
}
