import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { ScreeningData, GradingResult } from '#lib/engine/types.js';
import {
	clinicianRoleLabel,
	eligibilityLabel,
	episodeTypeLabel,
	imagingClassLabel,
	outcomeBandLabel,
	priorityLabel,
	readingOutcomeLabel,
	screeningOutcomeLabel
} from '#lib/engine/utils.js';

export function buildPdfDocument(
	data: ScreeningData,
	result: GradingResult
): TDocumentDefinitions {
	const classificationRows: [string, string][] = [
		['Eligibility', eligibilityLabel(result.eligibilityStatus) || 'Not determined'],
		['Reading outcome', readingOutcomeLabel(result.readingOutcome)],
		['Imaging classification', imagingClassLabel(result.imagingClassification)],
		['Screening outcome / next action', screeningOutcomeLabel(result.screeningOutcome)],
		['Record status', result.status === 'complete' ? 'Complete' : 'Incomplete']
	];

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'BREAST SCREENING RECORD — OUTCOME REPORT',
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
				text: screeningOutcomeLabel(result.screeningOutcome),
				fontSize: 22,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `Outcome band: ${outcomeBandLabel(result.outcomeBand)} · ${result.status === 'complete' ? 'Complete' : 'Incomplete'}`,
				fontSize: 12,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 20] as [number, number, number, number]
			},

			sectionHeader('Screening context'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Clinician', data.context.clinicianName || 'N/A'),
							field('Role', clinicianRoleLabel(data.context.clinicianRole) || 'N/A')
						],
						[
							field('Episode type', episodeTypeLabel(data.context.episodeType) || 'N/A'),
							field('Reported at', data.context.reportedAt || 'N/A')
						],
						[field('Screening unit', data.context.screeningUnit || 'N/A'), field('', '')]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Patient'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Identifier', data.identification.patientIdentifier || 'N/A'),
							field(
								'Age',
								data.identification.ageYears !== null
									? `${data.identification.ageYears} years`
									: 'N/A'
							)
						],
						[
							field('Last screened', data.identification.lastScreenedDate || 'N/A'),
							field(
								'Higher-risk surveillance',
								data.identification.higherRiskSurveillance || 'N/A'
							)
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Classification'),
			{
				table: {
					headerRows: 1,
					widths: ['*', 'auto'],
					body: [
						[
							{ text: 'Item', bold: true, fontSize: 9 },
							{ text: 'Value', bold: true, fontSize: 9 }
						],
						...classificationRows.map((row) => [
							{ text: row[0], fontSize: 9 },
							{ text: row[1], fontSize: 9, bold: true }
						])
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			...(result.flaggedIssues.length > 0
				? [
						sectionHeader(`Flagged issues (${result.flaggedIssues.length})`),
						{
							ul: result.flaggedIssues.map((f) => ({
								text: `[${priorityLabel(f.priority)}] ${f.category}: ${f.description} — ${f.suggestedAction}`,
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

			...(data.note.clinicalContext
				? [
						sectionHeader('Clinical context'),
						{
							text: data.note.clinicalContext,
							fontSize: 10,
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
			{ text: label ? `${label}: ` : '', bold: true, color: '#6b7280' },
			{ text: value }
		],
		margin: [0, 4, 0, 4] as [number, number, number, number]
	};
}
