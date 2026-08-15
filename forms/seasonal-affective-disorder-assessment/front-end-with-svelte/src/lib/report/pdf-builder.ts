import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import { calculateAge } from '#lib/engine/utils.js';
import { combinedSeverityLabel, spaqBandLabel, phq9BandLabel } from '#lib/engine/sad-rules.js';

export function buildPdfDocument(
	data: AssessmentData,
	result: GradingResult
): TDocumentDefinitions {
	const age = calculateAge(data.demographics.dateOfBirth);

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'SEASONAL AFFECTIVE DISORDER ASSESSMENT REPORT',
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
				text: `Combined severity: ${combinedSeverityLabel(result.combinedSeverity)}`,
				fontSize: 22,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 6]
			},
			{
				text: `SPAQ GSS ${result.spaqScore}/24 — ${spaqBandLabel(result.spaqBand)}    •    PHQ-9 ${result.phq9Score}/27 — ${phq9BandLabel(result.phq9Band)}`,
				fontSize: 12,
				alignment: 'center',
				color: '#4b5563',
				margin: [0, 0, 0, 20]
			},

			sectionHeader('Patient Details'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Name', `${data.demographics.firstName} ${data.demographics.lastName}`),
							field('DOB', `${data.demographics.dateOfBirth}${age ? ` (Age ${age})` : ''}`)
						],
						[
							field('Sex', data.demographics.sex || 'N/A'),
							field('Latitude', data.demographics.latitude || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			...(result.additionalFlags.length > 0
				? [
						sectionHeader('Flagged Issues for Clinician'),
						{
							ul: result.additionalFlags.map((f) => ({
								text: `[${f.priority.toUpperCase()}] ${f.category}: ${f.message}`,
								color:
									f.priority === 'high'
										? '#dc2626'
										: f.priority === 'medium'
											? '#d97706'
											: '#4b5563',
								margin: [0, 2, 0, 2] as [number, number, number, number]
							})),
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			...(result.firedRules.length > 0
				? [
						sectionHeader('Item Scores'),
						{
							table: {
								headerRows: 1,
								widths: [70, 110, '*', 40],
								body: [
									[
										{ text: 'Item ID', bold: true, fontSize: 9 },
										{ text: 'Category', bold: true, fontSize: 9 },
										{ text: 'Question', bold: true, fontSize: 9 },
										{ text: 'Score', bold: true, fontSize: 9 }
									],
									...result.firedRules.map((r) => [
										{ text: r.id, fontSize: 8, color: '#6b7280' },
										{ text: r.category, fontSize: 9 },
										{ text: r.description, fontSize: 9 },
										{ text: String(r.score), fontSize: 9, bold: true }
									])
								]
							},
							layout: 'lightHorizontalLines',
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
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
		text: [
			{ text: `${label}: `, bold: true, color: '#6b7280' },
			{ text: value }
		],
		margin: [0, 4, 0, 4] as [number, number, number, number]
	};
}
