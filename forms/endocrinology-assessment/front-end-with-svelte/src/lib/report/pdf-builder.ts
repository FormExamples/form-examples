import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import { axisStatusLabel, bmiCategory, calculateAge } from '#lib/engine/utils.js';

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	const age = calculateAge(data.demographics.dateOfBirth);
	const bmi = data.demographics.bmi;

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'ENDOCRINOLOGY ASSESSMENT REPORT',
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
				text: `Overall endocrine status: ${axisStatusLabel(result.overallStatus)}`,
				fontSize: 22,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 16]
			},

			// Patient details
			sectionHeader('Patient Details'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Name', `${data.demographics.firstName} ${data.demographics.lastName}`),
							field('DOB', `${data.demographics.dateOfBirth}${age ? ` (Age ${age})` : ''}`)
						],
						[
							field('Sex', data.demographics.sex || 'N/A'),
							field('BMI', bmi ? `${bmi} (${bmiCategory(bmi)})` : 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Per-axis grades
			sectionHeader('Axis Grades'),
			{
				table: {
					headerRows: 1,
					widths: [110, 80, '*'],
					body: [
						[
							{ text: 'Axis', bold: true, fontSize: 9 },
							{ text: 'Status', bold: true, fontSize: 9 },
							{ text: 'Rationale', bold: true, fontSize: 9 }
						],
						...result.axisGrades.map((g) => [
							{ text: g.axis, fontSize: 9 },
							{ text: axisStatusLabel(g.status), fontSize: 9, bold: true },
							{ text: g.rationale, fontSize: 9 }
						])
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Flagged issues
			...(result.additionalFlags.length > 0
				? [
						sectionHeader('Flagged Issues for Endocrinologist'),
						{
							ul: result.additionalFlags.map((f) => ({
								text: `[${f.priority.toUpperCase()}] ${f.category}: ${f.message}`,
								color:
									f.priority === 'urgent'
										? '#dc2626'
										: f.priority === 'high'
											? '#d97706'
											: f.priority === 'medium'
												? '#2563eb'
												: '#4b5563',
								margin: [0, 2, 0, 2] as [number, number, number, number]
							})),
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			// Clinical impression
			...(data.clinicalImpression.workingDiagnosis
				? [
						sectionHeader('Clinical Impression'),
						{
							text: data.clinicalImpression.workingDiagnosis,
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
			{ text: `${label}: `, bold: true, color: '#6b7280' },
			{ text: value }
		],
		margin: [0, 4, 0, 4] as [number, number, number, number]
	};
}
