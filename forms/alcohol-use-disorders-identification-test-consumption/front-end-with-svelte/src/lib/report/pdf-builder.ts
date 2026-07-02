import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '$lib/engine/types';
import {
	riskBandLabel,
	priorityLabel,
	careSettingLabel,
	administrationModeLabel,
	clinicianRoleLabel,
	sexLabel,
	ageBandLabel,
	optionLabel,
	FREQUENCY_OPTIONS,
	QUANTITY_OPTIONS,
	HEAVY_EPISODE_OPTIONS
} from '$lib/engine/utils';

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	const { frequencyOfDrinking, typicalQuantity, heavyEpisodeFrequency } = data.items;

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'AUDIT-C ASSESSMENT REPORT',
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
				text: `AUDIT-C score: ${result.auditcScore} of 12`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: riskBandLabel(result.riskBand),
				fontSize: 12,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 20] as [number, number, number, number]
			},

			sectionHeader('Assessment context'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Clinician', data.context.clinicianName || 'N/A'),
							field('Role', clinicianRoleLabel(data.context.clinicianRole) || 'N/A')
						],
						[
							field('Care setting', careSettingLabel(data.context.careSetting) || 'N/A'),
							field('Assessed at', data.context.assessedAt || 'N/A')
						],
						[
							field(
								'Administration',
								administrationModeLabel(data.context.administrationMode) || 'N/A'
							),
							field('Screen', result.positiveScreen ? 'Positive (>= 5)' : 'Negative (< 5)')
						]
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
							field('Age band', ageBandLabel(data.identification.ageBand) || 'N/A')
						],
						[field('Sex', sexLabel(data.identification.sex) || 'N/A'), field('', '')]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('AUDIT-C items'),
			{
				table: {
					headerRows: 1,
					widths: ['*', 'auto', 'auto'],
					body: [
						[
							{ text: 'Item', bold: true, fontSize: 9 },
							{ text: 'Response', bold: true, fontSize: 9 },
							{ text: 'Point', bold: true, fontSize: 9 }
						],
						[
							{ text: 'Q1 — Frequency of drinking', fontSize: 9 },
							{ text: optionLabel(FREQUENCY_OPTIONS, frequencyOfDrinking), fontSize: 9 },
							{ text: String(result.frequencyOfDrinkingPoint), fontSize: 9, bold: true }
						],
						[
							{ text: 'Q2 — Typical quantity (UK units)', fontSize: 9 },
							{ text: optionLabel(QUANTITY_OPTIONS, typicalQuantity), fontSize: 9 },
							{ text: String(result.typicalQuantityPoint), fontSize: 9, bold: true }
						],
						[
							{ text: 'Q3 — Heavy episodic drinking', fontSize: 9 },
							{ text: optionLabel(HEAVY_EPISODE_OPTIONS, heavyEpisodeFrequency), fontSize: 9 },
							{ text: String(result.heavyEpisodeFrequencyPoint), fontSize: 9, bold: true }
						],
						[
							{ text: 'Total', fontSize: 9, bold: true },
							{ text: '', fontSize: 9 },
							{ text: `${result.auditcScore} of 12`, fontSize: 9, bold: true }
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			...(result.flaggedIssues.length > 0
				? [
						sectionHeader('Flagged issues'),
						{
							ul: result.flaggedIssues.map((f) => ({
								text: `[${priorityLabel(f.priority)}] ${f.category}: ${f.description} — ${f.suggestedAction}`,
								color:
									f.priority === 'high' ? '#dc2626' : f.priority === 'medium' ? '#d97706' : '#4b5563',
								margin: [0, 2, 0, 2] as [number, number, number, number]
							})),
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			...(data.note.clinicalNote
				? [
						sectionHeader('Clinical note'),
						{
							text: data.note.clinicalNote,
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
