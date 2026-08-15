import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult, YesNo } from '#lib/engine/types.js';
import {
	resultBandLabel,
	priorityLabel,
	careSettingLabel,
	clinicianRoleLabel,
	sexLabel,
	ageBandLabel
} from '#lib/engine/utils.js';

function answer(v: YesNo): string {
	return v === 'yes' ? 'Yes' : v === 'no' ? 'No' : 'Not recorded';
}

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	const c = data.criteria;

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'CAGE ALCOHOL QUESTIONNAIRE REPORT',
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
				text: `CAGE score: ${result.cageScore} of 4`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: resultBandLabel(result.resultBand),
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
							field('Screen', result.thresholdMet === 'yes' ? 'Positive (>= 2)' : 'Negative (< 2)'),
							field('', '')
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

			sectionHeader('Criteria'),
			{
				table: {
					headerRows: 1,
					widths: ['*', 'auto', 'auto'],
					body: [
						[
							{ text: 'Criterion', bold: true, fontSize: 9 },
							{ text: 'Answer', bold: true, fontSize: 9 },
							{ text: 'Point', bold: true, fontSize: 9 }
						],
						[
							{ text: 'C — Felt you should cut down', fontSize: 9 },
							{ text: answer(c.cutDown), fontSize: 9 },
							{ text: String(result.cutDownPoint), fontSize: 9, bold: true }
						],
						[
							{ text: 'A — Annoyed by criticism of drinking', fontSize: 9 },
							{ text: answer(c.annoyed), fontSize: 9 },
							{ text: String(result.annoyedPoint), fontSize: 9, bold: true }
						],
						[
							{ text: 'G — Felt bad or guilty about drinking', fontSize: 9 },
							{ text: answer(c.guilty), fontSize: 9 },
							{ text: String(result.guiltyPoint), fontSize: 9, bold: true }
						],
						[
							{ text: 'E — Morning eye-opener drink', fontSize: 9 },
							{ text: answer(c.eyeOpener), fontSize: 9 },
							{ text: String(result.eyeOpenerPoint), fontSize: 9, bold: true }
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
