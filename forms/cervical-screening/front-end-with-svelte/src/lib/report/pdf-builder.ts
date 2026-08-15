import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import {
	careSettingLabel,
	cytologyGradeLabel,
	hpvResultLabel,
	managementActionLabel,
	priorityLabel,
	resultClassLabel,
	sampleAdequacyLabel,
	sampleTakerRoleLabel,
	statusLabel
} from '#lib/engine/utils.js';

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	const resultRows: [string, string][] = [
		['Result classification', resultClassLabel(result.resultClass) || 'N/A'],
		['Management action', managementActionLabel(result.managementAction) || 'N/A'],
		['Sample adequacy', sampleAdequacyLabel(data.adequacy.sampleAdequacy) || 'N/A'],
		['Primary hrHPV', hpvResultLabel(data.hpv.hpvResult) || 'N/A'],
		['Reflex cytology', cytologyGradeLabel(data.cytology.cytologyGrade) || 'N/A']
	];

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'CERVICAL SCREENING RESULT REPORT',
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
				text: resultClassLabel(result.resultClass),
				fontSize: 22,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `${managementActionLabel(result.managementAction)} · ${statusLabel(result.status)}`,
				fontSize: 12,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 20] as [number, number, number, number]
			},

			sectionHeader('Encounter context'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Sample-taker', data.context.sampleTakerName || 'N/A'),
							field('Role', sampleTakerRoleLabel(data.context.sampleTakerRole) || 'N/A')
						],
						[
							field('Care setting', careSettingLabel(data.context.careSetting) || 'N/A'),
							field('Sample taken', data.context.sampleTakenAt || 'N/A')
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
							field('NHS number', data.identification.nhsNumber || 'N/A')
						],
						[
							field('Age', data.identification.age !== null ? String(data.identification.age) : 'N/A'),
							field('Date of birth', data.identification.dateOfBirth || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Result'),
			{
				table: {
					headerRows: 0,
					widths: ['*', 'auto'],
					body: resultRows.map((row) => [
						{ text: row[0], fontSize: 9 },
						{ text: row[1], fontSize: 9, bold: true }
					])
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			...(result.flaggedIssues.length > 0
				? [
						sectionHeader(`Flagged issues (${result.flaggedIssues.length})`),
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

			...(data.note.clinicalContext
				? [
						sectionHeader('Clinical note'),
						{
							text: data.note.clinicalContext,
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
