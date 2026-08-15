import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import {
	interpretationBandLabel,
	priorityLabel,
	settingLabel,
	alertnessLabel,
	amt4Label,
	attentionLabel,
	acuteChangeLabel,
	acuteChangeSourceLabel
} from '#lib/engine/utils.js';

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: '4AT DELIRIUM SCREEN REPORT',
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
				text: `4AT score: ${result.totalScore} of 12`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: interpretationBandLabel(result.interpretationBand),
				fontSize: 12,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 20] as [number, number, number, number]
			},

			sectionHeader('Patient and assessment'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Patient identifier', data.identification.patientIdentifier || 'N/A'),
							field('Patient name', data.identification.patientName || 'N/A')
						],
						[
							field('Date of birth', data.identification.dateOfBirth || 'N/A'),
							field('Setting', settingLabel(data.identification.setting) || 'N/A')
						],
						[
							field('Assessment date', data.identification.assessmentDate || 'N/A'),
							field('Assessment time', data.identification.assessmentTime || 'N/A')
						],
						[
							field('Assessor', data.identification.assessorName || 'N/A'),
							field('Assessor role', data.identification.assessorRole || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Items'),
			{
				table: {
					headerRows: 1,
					widths: ['*', '*', 'auto'],
					body: [
						[
							{ text: 'Item', bold: true, fontSize: 9 },
							{ text: 'Response', bold: true, fontSize: 9 },
							{ text: 'Score', bold: true, fontSize: 9 }
						],
						[
							{ text: '1. Alertness', fontSize: 9 },
							{ text: alertnessLabel(data.item1.alertness) || 'Not recorded', fontSize: 9 },
							{ text: String(result.item1Score), fontSize: 9, bold: true }
						],
						[
							{ text: '2. AMT4', fontSize: 9 },
							{ text: amt4Label(data.item2.amt4) || 'Not recorded', fontSize: 9 },
							{ text: String(result.item2Score), fontSize: 9, bold: true }
						],
						[
							{ text: '3. Attention (months backwards)', fontSize: 9 },
							{ text: attentionLabel(data.item3.attentionMonths) || 'Not recorded', fontSize: 9 },
							{ text: String(result.item3Score), fontSize: 9, bold: true }
						],
						[
							{ text: '4. Acute change or fluctuating course', fontSize: 9 },
							{ text: acuteChangeLabel(data.item4.acuteChange) || 'Not recorded', fontSize: 9 },
							{ text: String(result.item4Score), fontSize: 9, bold: true }
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 8] as [number, number, number, number]
			},
			{
				text: `Item 4 information source: ${acuteChangeSourceLabel(data.item4.acuteChangeSource) || 'N/A'}`,
				fontSize: 9,
				color: '#6b7280',
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

			...(data.note.clinicalNotes
				? [
						sectionHeader('Clinical notes'),
						{
							text: data.note.clinicalNotes,
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
