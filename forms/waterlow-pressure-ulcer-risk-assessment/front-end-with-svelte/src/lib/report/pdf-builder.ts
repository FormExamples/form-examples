import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '$lib/engine/types';
import {
	riskBandLabel,
	preventionActionLabel,
	priorityLabel,
	careSettingLabel,
	assessmentReasonLabel,
	nurseRoleLabel,
	sexLabel,
	ageBandLabel
} from '$lib/engine/utils';

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'WATERLOW PRESSURE ULCER RISK ASSESSMENT REPORT',
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
				text: `Waterlow score: ${result.waterlowScore}`,
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
				margin: [0, 0, 0, 4] as [number, number, number, number]
			},
			{
				text: preventionActionLabel(result.riskBand),
				fontSize: 10,
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
							field('Nurse', data.context.nurseName || 'N/A'),
							field('Role', nurseRoleLabel(data.context.nurseRole) || 'N/A')
						],
						[
							field('Care setting', careSettingLabel(data.context.careSetting) || 'N/A'),
							field('Reason', assessmentReasonLabel(data.context.assessmentReason) || 'N/A')
						],
						[
							field('Assessed at', data.context.assessedAt || 'N/A'),
							field(
								'Existing damage',
								data.special.existingPressureDamage === 'yes'
									? 'Yes'
									: data.special.existingPressureDamage === 'no'
										? 'No'
										: 'Not recorded'
							)
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

			sectionHeader('Contributing categories'),
			result.contributingCategories.length > 0
				? {
						table: {
							headerRows: 1,
							widths: ['*', '*', 'auto'],
							body: [
								[
									{ text: 'Category', bold: true, fontSize: 9 },
									{ text: 'Selection', bold: true, fontSize: 9 },
									{ text: 'Points', bold: true, fontSize: 9 }
								],
								...result.contributingCategories.map((c) => [
									{ text: c.label, fontSize: 9 },
									{ text: c.optionLabel, fontSize: 9 },
									{ text: String(c.points), fontSize: 9, bold: true }
								])
							]
						},
						layout: 'lightHorizontalLines',
						margin: [0, 0, 0, 16] as [number, number, number, number]
					}
				: {
						text: 'No contributing categories recorded.',
						fontSize: 10,
						italics: true,
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
