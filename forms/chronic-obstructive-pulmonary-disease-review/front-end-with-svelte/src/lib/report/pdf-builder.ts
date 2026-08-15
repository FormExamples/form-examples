import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import {
	goldGradeLabel,
	abeGroupLabel,
	reviewStatusLabel,
	axisLabel,
	priorityLabel,
	clinicianRoleLabel,
	reviewTypeLabel,
	sexLabel,
	ageBandLabel
} from '#lib/engine/utils.js';

export function buildPdfDocument(
	data: AssessmentData,
	result: GradingResult
): TDocumentDefinitions {
	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'CHRONIC OBSTRUCTIVE PULMONARY DISEASE REVIEW REPORT',
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
				text: `${goldGradeLabel(result.goldGrade)} · ${abeGroupLabel(result.abeGroup)}`,
				fontSize: 16,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `Review: ${reviewStatusLabel(result.reviewStatus)} · Symptom burden: ${axisLabel(result.symptomBurden)} · Exacerbation risk: ${axisLabel(result.exacerbationRisk)}`,
				fontSize: 12,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 20] as [number, number, number, number]
			},

			sectionHeader('Review context'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Clinician', data.context.clinicianName || 'N/A'),
							field('Role', clinicianRoleLabel(data.context.clinicianRole) || 'N/A')
						],
						[
							field('Review type', reviewTypeLabel(data.context.reviewType) || 'N/A'),
							field('Date of review', data.context.reviewedAt || 'N/A')
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
							field('Identifier', data.context.patientIdentifier || 'N/A'),
							field('Age band', ageBandLabel(data.context.ageBand) || 'N/A')
						],
						[field('Sex', sexLabel(data.context.sex) || 'N/A'), field('', '')]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Classification'),
			{
				table: {
					headerRows: 1,
					widths: ['*', 'auto'],
					body: [
						[
							{ text: 'Output', bold: true, fontSize: 9 },
							{ text: 'Value', bold: true, fontSize: 9 }
						],
						[
							{ text: 'GOLD airflow grade', fontSize: 9 },
							{ text: goldGradeLabel(result.goldGrade), fontSize: 9 }
						],
						[
							{ text: 'Symptom burden', fontSize: 9 },
							{ text: axisLabel(result.symptomBurden), fontSize: 9 }
						],
						[
							{ text: 'Exacerbation risk', fontSize: 9 },
							{ text: axisLabel(result.exacerbationRisk), fontSize: 9 }
						],
						[
							{ text: 'ABE assessment group', fontSize: 9 },
							{ text: abeGroupLabel(result.abeGroup), fontSize: 9 }
						],
						[
							{ text: 'Review completeness', fontSize: 9 },
							{ text: reviewStatusLabel(result.reviewStatus), fontSize: 9, bold: true }
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			...(result.flags.length > 0
				? [
						sectionHeader('Flagged issues'),
						{
							ul: result.flags.map((f) => ({
								text: `[${priorityLabel(f.priority)}] ${f.category}: ${f.description} — ${f.suggestedAction}`,
								color:
									f.priority === 'high'
										? '#dc2626'
										: f.priority === 'medium'
											? '#d97706'
											: '#4b5563',
								margin: [0, 2, 0, 2] as [number, number, number, number]
							})),
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			...(data.note.clinicianNote
				? [
						sectionHeader('Clinician note'),
						{
							text: data.note.clinicianNote,
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
