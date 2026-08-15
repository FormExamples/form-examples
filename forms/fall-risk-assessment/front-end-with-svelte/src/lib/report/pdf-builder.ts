import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import { severityLabel, careSettingLabel, calculateAge } from '#lib/engine/utils.js';

export function buildPdfDocument(
	data: AssessmentData,
	result: GradingResult
): TDocumentDefinitions {
	const age = calculateAge(data.demographics.dateOfBirth);

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'FALL RISK ASSESSMENT REPORT',
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
			// Title & severity
			{
				text: `Morse Fall Scale: ${result.mfsScore} / 125`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: severityLabel(result.severity),
				fontSize: 14,
				alignment: 'center',
				color: '#4b5563',
				margin: [0, 0, 0, 4] as [number, number, number, number]
			},
			{
				text: `Based on ${result.answeredCount} of 6 MFS items answered.`,
				fontSize: 9,
				alignment: 'center',
				color: '#6b7280',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Critical override
			...(result.criticalOverride
				? [
						{
							text: `Severity escalated to Critical because of: ${result.criticalReasons.join('; ')}.`,
							fontSize: 10,
							color: '#dc2626',
							bold: true,
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			// Patient details
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
							field('Care setting', careSettingLabel(data.demographics.careSetting))
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Flagged issues
			...(result.additionalFlags.length > 0
				? [
						sectionHeader('Flagged Issues'),
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

			// MFS breakdown
			...(result.firedRules.length > 0
				? [
						sectionHeader('Morse Fall Scale breakdown'),
						{
							table: {
								headerRows: 1,
								widths: [60, 110, '*', 40],
								body: [
									[
										{ text: 'Item ID', bold: true, fontSize: 9 },
										{ text: 'Item', bold: true, fontSize: 9 },
										{ text: 'Selected response', bold: true, fontSize: 9 },
										{ text: 'Score', bold: true, fontSize: 9 }
									],
									...result.firedRules.map((r) => [
										{ text: r.id, fontSize: 8, color: '#6b7280' },
										{ text: r.category, fontSize: 9 },
										{ text: r.description, fontSize: 9 },
										{ text: `+${r.score}`, fontSize: 9, bold: true }
									]),
									[
										{ text: '', fontSize: 9 },
										{ text: '', fontSize: 9 },
										{ text: 'Total MFS', fontSize: 9, bold: true },
										{ text: `${result.mfsScore} / 125`, fontSize: 9, bold: true }
									]
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
