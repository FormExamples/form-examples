import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import {
	riskBandLabel,
	priorityLabel,
	careSettingLabel,
	clinicianRoleLabel,
	sexLabel,
	ageModifierLabel
} from '#lib/engine/utils.js';

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	const temp = data.fever.measuredTemperatureCelsius;
	const feverValue =
		data.fever.feverOver38 === 'yes'
			? 'History of fever / > 38 °C'
			: temp !== null
				? `Measured ${temp} °C`
				: data.fever.feverOver38 === 'no'
					? 'No fever'
					: 'Not recorded';

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'CENTOR / McISAAC ASSESSMENT REPORT',
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
				text: `Modified McIsaac score: ${result.mcIsaacScore}`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `Centor total ${result.centorScore} of 4 · ${riskBandLabel(result.riskBand)}`,
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
							field(
								'Age',
								data.identification.ageYears === null
									? 'N/A'
									: `${data.identification.ageYears} years`
							)
						],
						[
							field('Sex', sexLabel(data.identification.sex) || 'N/A'),
							field('Age modifier', ageModifierLabel(result.ageModifier))
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Centor criteria'),
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
						[
							{ text: 'Tonsillar exudate or swelling', fontSize: 9 },
							{ text: yesNo(data.exudate.tonsillarExudate), fontSize: 9 },
							{ text: String(result.tonsillarExudatePoint), fontSize: 9, bold: true }
						],
						[
							{ text: 'Tender anterior cervical nodes', fontSize: 9 },
							{ text: yesNo(data.nodes.tenderAnteriorCervicalNodes), fontSize: 9 },
							{ text: String(result.tenderNodesPoint), fontSize: 9, bold: true }
						],
						[
							{ text: 'Fever (> 38 °C or history)', fontSize: 9 },
							{ text: feverValue, fontSize: 9 },
							{ text: String(result.feverPoint), fontSize: 9, bold: true }
						],
						[
							{ text: 'Cough absent', fontSize: 9 },
							{ text: yesNo(data.cough.absenceOfCough), fontSize: 9 },
							{ text: String(result.coughAbsentPoint), fontSize: 9, bold: true }
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

function yesNo(value: string): string {
	if (value === 'yes') return 'Yes';
	if (value === 'no') return 'No';
	return 'Not recorded';
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
