import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import {
	childPughClassLabel,
	surgicalRiskLabel,
	priorityLabel,
	careSettingLabel,
	clinicianRoleLabel,
	aetiologyLabel,
	sexLabel,
	ageBandLabel,
	ascitesLabel,
	encephalopathyLabel,
	formatPoint,
	formatScore
} from '#lib/engine/utils.js';

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	const inr = data.coagulation.inr;
	const pt = data.coagulation.prothrombinTimeProlongation;
	const coagValue =
		inr !== null ? `INR ${inr}` : pt !== null ? `PT +${pt} s` : 'Not recorded';

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'CHILD-PUGH SCORE REPORT',
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
				text: `Child-Pugh ${formatScore(result.childPughScore, result.complete)} — ${childPughClassLabel(result.childPughClass)}`,
				fontSize: 22,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `~1-year survival ${result.oneYearSurvival} · ~2-year survival ${result.twoYearSurvival} · peri-operative risk ${surgicalRiskLabel(result.surgicalRisk)}`,
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
							field('Aetiology', aetiologyLabel(data.context.aetiology) || 'N/A'),
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

			sectionHeader('Parameter scoring'),
			{
				table: {
					headerRows: 1,
					widths: ['*', 'auto', 'auto'],
					body: [
						[
							{ text: 'Parameter', bold: true, fontSize: 9 },
							{ text: 'Value', bold: true, fontSize: 9 },
							{ text: 'Points', bold: true, fontSize: 9 }
						],
						paramRow(
							'Total bilirubin',
							data.bilirubin.totalBilirubin === null
								? 'Not recorded'
								: `${data.bilirubin.totalBilirubin} µmol/L`,
							formatPoint(result.bilirubinPoint)
						),
						paramRow(
							'Serum albumin',
							data.albumin.serumAlbumin === null
								? 'Not recorded'
								: `${data.albumin.serumAlbumin} g/L`,
							formatPoint(result.albuminPoint)
						),
						paramRow('Coagulation', coagValue, formatPoint(result.coagulationPoint)),
						paramRow(
							'Ascites',
							ascitesLabel(data.ascitesStep.ascites) || 'Not graded',
							formatPoint(result.ascitesPoint)
						),
						paramRow(
							'Hepatic encephalopathy',
							encephalopathyLabel(data.encephalopathyStep.encephalopathy) || 'Not graded',
							formatPoint(result.encephalopathyPoint)
						),
						[
							{ text: 'Child-Pugh total', fontSize: 9, bold: true },
							{ text: '', fontSize: 9 },
							{
								text: formatScore(result.childPughScore, result.complete),
								fontSize: 9,
								bold: true
							}
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

function paramRow(label: string, value: string, points: string) {
	return [
		{ text: label, fontSize: 9 },
		{ text: value, fontSize: 9 },
		{ text: points, fontSize: 9 }
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
