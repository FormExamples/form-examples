import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '$lib/engine/types';
import {
	classificationLabel,
	criterionStatusLabel,
	priorityLabel,
	clinicianRoleLabel,
	careSettingLabel,
	sexLabel,
	pretestProbabilityLabel
} from '$lib/engine/utils';

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	const failed =
		result.failedCriteria.length > 0 ? result.failedCriteria.join(', ') : 'none';

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'PULMONARY EMBOLISM RULE-OUT CRITERIA (PERC) REPORT',
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
				text: classificationLabel(result.classification),
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text:
					result.classification === 'perc-negative'
						? 'Pre-test probability low and all eight criteria satisfied'
						: `Failed criteria: ${failed}${result.applicable ? '' : ' (pre-test probability not low)'}`,
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
								'Pre-test probability',
								pretestProbabilityLabel(data.pretest.pretestProbability) || 'N/A'
							),
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
							field(
								'Age',
								data.identification.age !== null ? `${data.identification.age} years` : 'N/A'
							)
						],
						[
							field('Sex', sexLabel(data.identification.sex) || 'N/A'),
							field(
								'Heart rate',
								data.vitals.heartRate !== null ? `${data.vitals.heartRate} beats/min` : 'N/A'
							)
						],
						[
							field(
								'Oxygen saturation',
								data.vitals.oxygenSaturation !== null ? `${data.vitals.oxygenSaturation}%` : 'N/A'
							),
							field('', '')
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
					widths: ['auto', '*', 'auto'],
					body: [
						[
							{ text: '#', bold: true, fontSize: 9 },
							{ text: 'Criterion', bold: true, fontSize: 9 },
							{ text: 'Result', bold: true, fontSize: 9 }
						],
						...result.criterionResults.map((c) => [
							{ text: String(c.number), fontSize: 9 },
							{ text: c.label, fontSize: 9 },
							{ text: criterionStatusLabel(c.satisfied), fontSize: 9, bold: true }
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
									f.priority === 'high' ? '#dc2626' : f.priority === 'medium' ? '#d97706' : '#4b5563',
								margin: [0, 2, 0, 2] as [number, number, number, number]
							})),
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			...(data.context.presentingComplaint
				? [
						sectionHeader('Presenting complaint'),
						{
							text: data.context.presentingComplaint,
							fontSize: 10,
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			...(data.result.clinicalNote
				? [
						sectionHeader('Clinical note'),
						{
							text: data.result.clinicalNote,
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
