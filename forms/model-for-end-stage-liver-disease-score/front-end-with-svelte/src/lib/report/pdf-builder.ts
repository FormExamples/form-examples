import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import {
	mortalityBandLabel,
	meldVariantLabel,
	priorityLabel,
	careSettingLabel,
	clinicianRoleLabel,
	sexLabel,
	ageBandLabel,
	formatScore
} from '#lib/engine/utils.js';

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	const biliUnit = data.bilirubin.bilirubinUnit || 'mg/dL';
	const creatUnit = data.renal.creatinineUnit || 'mg/dL';

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'MELD SCORE REPORT',
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
				text: formatScore(result.meldScore),
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `${meldVariantLabel(data.context.meldVariant) || 'MELD'} — ${mortalityBandLabel(result.mortalityBand)}`,
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
							field('Instrument', meldVariantLabel(data.context.meldVariant) || 'N/A'),
							field('Dialysis rule', result.dialysisRuleApplied ? 'Applied (creatinine 4.0)' : 'Not applied')
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

			sectionHeader('Calculation inputs'),
			{
				table: {
					headerRows: 1,
					widths: ['*', 'auto'],
					body: [
						[
							{ text: 'Input', bold: true, fontSize: 9 },
							{ text: 'Value', bold: true, fontSize: 9 }
						],
						[
							{ text: 'Total bilirubin', fontSize: 9 },
							{
								text: data.bilirubin.bilirubin === null ? 'Not recorded' : `${data.bilirubin.bilirubin} ${biliUnit}`,
								fontSize: 9
							}
						],
						[
							{ text: 'INR', fontSize: 9 },
							{ text: data.inr.inr === null ? 'Not recorded' : `${data.inr.inr}`, fontSize: 9 }
						],
						[
							{ text: 'Serum creatinine', fontSize: 9 },
							{
								text: data.renal.creatinine === null ? 'Not recorded' : `${data.renal.creatinine} ${creatUnit}`,
								fontSize: 9
							}
						],
						[
							{ text: 'Serum sodium', fontSize: 9 },
							{ text: data.sodium.sodium === null ? 'Not recorded' : `${data.sodium.sodium} mEq/L`, fontSize: 9 }
						],
						[
							{ text: 'Serum albumin', fontSize: 9 },
							{ text: data.albumin.albumin === null ? 'Not recorded' : `${data.albumin.albumin} g/dL`, fontSize: 9 }
						],
						[
							{ text: 'MELD score', fontSize: 9, bold: true },
							{ text: formatScore(result.meldScore), fontSize: 9, bold: true }
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
