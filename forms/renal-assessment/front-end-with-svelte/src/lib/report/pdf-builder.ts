import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import {
	gfrCategoryLabel,
	albuminuriaCategoryLabel,
	riskLevelLabel,
	bmiCategory,
	calculateAge
} from '#lib/engine/utils.js';

export function buildPdfDocument(
	data: AssessmentData,
	result: GradingResult
): TDocumentDefinitions {
	const age = calculateAge(data.demographics.dateOfBirth);
	const bmi = data.demographics.bmi;

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'RENAL ASSESSMENT REPORT',
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
			// Title & composite risk
			{
				text: `KDIGO Composite Risk: ${riskLevelLabel(result.riskLevel)}`,
				fontSize: 22,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			...(result.gfrCategory
				? [
						{
							text: gfrCategoryLabel(result.gfrCategory),
							fontSize: 12,
							alignment: 'center' as const,
							color: '#4b5563',
							margin: [0, 0, 0, 4] as [number, number, number, number]
						}
					]
				: []),
			...(result.albuminuriaCategory
				? [
						{
							text: albuminuriaCategoryLabel(result.albuminuriaCategory),
							fontSize: 12,
							alignment: 'center' as const,
							color: '#4b5563',
							margin: [0, 0, 0, 4] as [number, number, number, number]
						}
					]
				: []),
			{
				text: `${result.egfr != null ? `eGFR ${result.egfr} mL/min/1.73 m²` : 'eGFR unavailable'} — ${result.acr != null ? `ACR ${result.acr} mg/mmol` : 'ACR unavailable'}`,
				fontSize: 10,
				alignment: 'center',
				color: '#6b7280',
				margin: [0, 0, 0, 20]
			},

			// Patient Details
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

			// Flagged issues
			...(result.additionalFlags.length > 0
				? [
						sectionHeader('Flagged Issues for Nephrologist'),
						{
							ul: result.additionalFlags.map((f) => ({
								text: `[${f.priority.toUpperCase()}] ${f.category}: ${f.message}`,
								color:
									f.priority === 'urgent' || f.priority === 'high'
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

			// KDIGO classification audit trail
			...(result.firedRules.length > 0
				? [
						sectionHeader('KDIGO Classification'),
						{
							table: {
								headerRows: 1,
								widths: [70, 90, '*', 90],
								body: [
									[
										{ text: 'Rule ID', bold: true, fontSize: 9 },
										{ text: 'Category', bold: true, fontSize: 9 },
										{ text: 'Description', bold: true, fontSize: 9 },
										{ text: 'Value', bold: true, fontSize: 9 }
									],
									...result.firedRules.map((r) => [
										{ text: r.id, fontSize: 8, color: '#6b7280' },
										{ text: r.category, fontSize: 9 },
										{ text: r.description, fontSize: 9 },
										{ text: r.value, fontSize: 9, bold: true }
									])
								]
							},
							layout: 'lightHorizontalLines',
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
