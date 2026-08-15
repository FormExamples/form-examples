import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import {
	riskBandLabel,
	priorityLabel,
	anticoagulationLabel,
	careSettingLabel,
	clinicianRoleLabel,
	atrialFibrillationTypeLabel,
	sexLabel,
	ageBandLabel
} from '#lib/engine/utils.js';

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	const age = data.identification.ageYears;

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'CHA2DS2-VASc ASSESSMENT REPORT',
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
				text: `CHA2DS2-VASc score: ${result.cha2ds2VascScore} of 9`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `${riskBandLabel(result.riskBand)} — estimated annual stroke rate ${result.annualStrokeRatePercent}%`,
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
							field('AF type', atrialFibrillationTypeLabel(data.context.atrialFibrillationType) || 'N/A'),
							field('Recommendation', anticoagulationLabel(result.anticoagulationRecommendation))
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
							field('Age', age === null ? 'N/A' : `${age} years (${ageBandLabel(age)})`)
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
							{ text: 'Points', bold: true, fontSize: 9 }
						],
						criterionRow(
							'C — Congestive heart failure',
							yesNoValue(data.cardiac.congestiveHeartFailure),
							result.congestiveHeartFailurePoint
						),
						criterionRow(
							'H — Hypertension',
							yesNoValue(data.cardiac.hypertension),
							result.hypertensionPoint
						),
						criterionRow(
							'A — Age (>= 75 = 2, 65-74 = 1)',
							age === null ? 'Not recorded' : `${age} years`,
							result.agePoint
						),
						criterionRow('D — Diabetes mellitus', yesNoValue(data.metabolic.diabetes), result.diabetesPoint),
						criterionRow(
							'S2 — Prior stroke / TIA / TE',
							yesNoValue(data.metabolic.priorStrokeTiaThromboembolism),
							result.strokePoint
						),
						criterionRow(
							'V — Vascular disease',
							yesNoValue(data.cardiac.vascularDisease),
							result.vascularDiseasePoint
						),
						criterionRow(
							'Sc — Female sex category',
							sexLabel(data.identification.sex) || 'Not recorded',
							result.sexPoint
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

function yesNoValue(v: string): string {
	return v === 'yes' ? 'Yes' : v === 'no' ? 'No' : 'Not recorded';
}

function criterionRow(label: string, value: string, points: number) {
	return [
		{ text: label, fontSize: 9 },
		{ text: value, fontSize: 9 },
		{ text: String(points), fontSize: 9, bold: true }
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
