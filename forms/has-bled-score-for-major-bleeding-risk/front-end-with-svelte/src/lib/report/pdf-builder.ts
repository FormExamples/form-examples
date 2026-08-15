import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import {
	riskBandLabel,
	priorityLabel,
	careSettingLabel,
	clinicianRoleLabel,
	anticoagulationStatusLabel,
	sexLabel
} from '#lib/engine/utils.js';

function yesNoValue(v: string): string {
	return v === 'yes' ? 'Yes' : v === 'no' ? 'No' : 'Not recorded';
}

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	const age = data.identification.ageYears;
	const alcohol = data.drugsAlcohol.alcoholUnitsPerWeek;

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'HAS-BLED BLEEDING-RISK REPORT',
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
				text: `HAS-BLED score: ${result.hasBledScore} of 9`,
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
								'Anticoagulation',
								anticoagulationStatusLabel(data.context.anticoagulationStatus) || 'N/A'
							),
							field(
								'CHA2DS2-VASc',
								data.context.chaDsVascScore === null ? 'N/A' : String(data.context.chaDsVascScore)
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
							field('Age', age === null ? 'N/A' : `${age} years`)
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
							{ text: 'Value', bold: true, fontSize: 9 },
							{ text: 'Point', bold: true, fontSize: 9 }
						],
						criterionRow(
							'H — Uncontrolled hypertension (SBP > 160)',
							yesNoValue(data.hypertension.hypertensionUncontrolled),
							result.hypertensionPoint
						),
						criterionRow(
							'A — Abnormal renal function',
							yesNoValue(data.organFunction.abnormalRenalFunction),
							result.renalPoint
						),
						criterionRow(
							'A — Abnormal liver function',
							yesNoValue(data.organFunction.abnormalLiverFunction),
							result.liverPoint
						),
						criterionRow(
							'S — Stroke history',
							yesNoValue(data.stroke.strokeHistory),
							result.strokePoint
						),
						criterionRow(
							'B — Bleeding history / predisposition',
							yesNoValue(data.bleeding.bleedingHistory),
							result.bleedingPoint
						),
						criterionRow('L — Labile INR', yesNoValue(data.labileInr.labileInr), result.labileInrPoint),
						criterionRow(
							'E — Elderly (age > 65)',
							age === null ? 'Not recorded' : `${age} years`,
							result.elderlyPoint
						),
						criterionRow(
							'D — Antiplatelets / NSAIDs',
							yesNoValue(data.drugsAlcohol.antiplateletOrNsaid),
							result.drugsPoint
						),
						criterionRow(
							'D — Alcohol (>= 8 units/week)',
							alcohol === null ? 'Not recorded' : `${alcohol} units/week`,
							result.alcoholPoint
						)
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

function criterionRow(criterion: string, value: string, point: 0 | 1) {
	return [
		{ text: criterion, fontSize: 9 },
		{ text: value, fontSize: 9 },
		{ text: String(point), fontSize: 9, bold: true }
	];
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
