import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import { epdsItems } from '#lib/engine/epds-rules.js';
import {
	bandLabel,
	priorityLabel,
	careSettingLabel,
	clinicianRoleLabel,
	perinatalStageLabel,
	ageBandLabel,
	assistanceNeededLabel
} from '#lib/engine/utils.js';

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'EDINBURGH POSTNATAL DEPRESSION SCALE (EPDS) REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.timestamp).toLocaleString()} | Screen, not a diagnosis`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: `EPDS total: ${result.totalScore} of 30`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: bandLabel(result.band),
				fontSize: 12,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 8] as [number, number, number, number]
			},
			...(result.selfHarmFlag
				? [
						{
							text: 'SELF-HARM FLAG RAISED — item 10 positive; immediate risk assessment required, regardless of the total.',
							fontSize: 10,
							bold: true,
							alignment: 'center' as const,
							color: '#dc2626',
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: [{ text: '', margin: [0, 0, 0, 8] as [number, number, number, number] }]),

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
							field('Perinatal stage', perinatalStageLabel(data.context.perinatalStage) || 'N/A'),
							field(
								'Perinatal week',
								data.context.perinatalWeek === null ? 'N/A' : String(data.context.perinatalWeek)
							)
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Respondent'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Identifier', data.identification.respondentIdentifier || 'N/A'),
							field('Age band', ageBandLabel(data.identification.ageBand) || 'N/A')
						],
						[
							field('Preferred language', data.identification.preferredLanguage || 'N/A'),
							field('Assistance', assistanceNeededLabel(data.identification.assistanceNeeded) || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Item scores'),
			{
				table: {
					headerRows: 1,
					widths: ['auto', '*', 'auto'],
					body: [
						[
							{ text: 'Item', bold: true, fontSize: 9 },
							{ text: 'Statement', bold: true, fontSize: 9 },
							{ text: 'Score', bold: true, fontSize: 9 }
						],
						...epdsItems.map((item, i) => [
							{
								text: `${item.number}${item.direction === 'reverse' ? ' (rev)' : ''}`,
								fontSize: 9
							},
							{ text: item.statement, fontSize: 9 },
							{ text: `${result.itemScores[i]} / 3`, fontSize: 9, bold: true }
						])
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
									f.priority === 'urgent' || f.priority === 'high'
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
