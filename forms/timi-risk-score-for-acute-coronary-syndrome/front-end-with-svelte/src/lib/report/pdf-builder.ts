import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult, YesNo } from '#lib/engine/types.js';
import {
	riskBandLabel,
	priorityLabel,
	careSettingLabel,
	clinicianRoleLabel,
	sexLabel,
	workingDiagnosisLabel
} from '#lib/engine/utils.js';

function yesNoLabel(v: YesNo): string {
	return v === 'yes' ? 'Yes' : v === 'no' ? 'No' : 'Not recorded';
}

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	const criterionRow = (label: string, value: YesNo, point: 0 | 1) => [
		{ text: label, fontSize: 9 },
		{ text: yesNoLabel(value), fontSize: 9 },
		{ text: String(point), fontSize: 9, bold: true }
	];

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'TIMI RISK SCORE (UA/NSTEMI) REPORT',
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
				text: `TIMI score: ${result.timiScore} of 7`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `${riskBandLabel(result.riskBand)} — ~${result.fourteenDayRiskPercent}% 14-day risk of death, MI, or urgent revascularisation`,
				fontSize: 11,
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
								'Working diagnosis',
								workingDiagnosisLabel(data.context.workingDiagnosis) || 'N/A'
							),
							field('Risk band', riskBandLabel(result.riskBand))
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
							field('Sex', sexLabel(data.identification.sex) || 'N/A')
						]
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
						criterionRow('Age >= 65 years', data.riskProfile.ageOver65, result.agePoint),
						criterionRow(
							'>= 3 coronary risk factors',
							data.riskProfile.threeOrMoreCadRiskFactors,
							result.riskFactorPoint
						),
						criterionRow(
							'Known CAD (stenosis >= 50%)',
							data.cardiacHistory.knownCadStenosis,
							result.knownCadPoint
						),
						criterionRow(
							'Aspirin use in prior 7 days',
							data.cardiacHistory.aspirinUsePrior7Days,
							result.aspirinPoint
						),
						criterionRow(
							'>= 2 anginal episodes in 24 h',
							data.presentation.twoOrMoreAnginaEpisodes24h,
							result.anginaPoint
						),
						criterionRow(
							'ST deviation >= 0.5 mm',
							data.investigations.stDeviation,
							result.stDeviationPoint
						),
						criterionRow(
							'Positive cardiac marker',
							data.investigations.positiveCardiacMarker,
							result.cardiacMarkerPoint
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
