import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import { riskCategoryLabel } from '#lib/engine/utils.js';

export function buildPdfDocument(
	data: AssessmentData,
	result: GradingResult
): TDocumentDefinitions {
	const age = data.demographicsEthnicity.age;
	const bmi = data.bodyMeasurements.bmi;

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'HEART HEALTH CHECK REPORT',
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
			// Title & Risk Category
			{
				text: `${riskCategoryLabel(result.riskCategory)} — ${result.tenYearRiskPercent}% 10-year CVD risk`,
				fontSize: 22,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			...(result.heartAge != null
				? [
						{
							text: `Heart age: ${result.heartAge} years${age != null ? ` (chronological age ${age})` : ''}`,
							fontSize: 12,
							alignment: 'center' as const,
							color: '#4b5563',
							margin: [0, 0, 0, 20] as [number, number, number, number]
						}
					]
				: [{ text: '', margin: [0, 0, 0, 16] as [number, number, number, number] }]),

			// Patient Details
			sectionHeader('Patient Details'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Name', data.patientInformation.fullName || 'N/A'),
							field('DOB', data.patientInformation.dateOfBirth || 'N/A')
						],
						[
							field('Sex', data.demographicsEthnicity.sex || 'N/A'),
							field('Age', age != null ? String(age) : 'N/A')
						],
						[
							field('NHS number', data.patientInformation.nhsNumber || 'N/A'),
							field('BMI', bmi != null ? String(bmi) : 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Additional Flags
			...(result.additionalFlags.length > 0
				? [
						sectionHeader('Flagged Issues for Clinician'),
						{
							ul: result.additionalFlags.map((f) => ({
								text: `[${f.priority.toUpperCase()}] ${f.category}: ${f.message}`,
								color: f.priority === 'high' ? '#dc2626' : f.priority === 'medium' ? '#d97706' : '#4b5563',
								margin: [0, 2, 0, 2] as [number, number, number, number]
							})),
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			// Fired Rules
			...(result.firedRules.length > 0
				? [
						sectionHeader('Risk Assessment Justification'),
						{
							table: {
								headerRows: 1,
								widths: [60, 90, '*', 50],
								body: [
									[
										{ text: 'Rule ID', bold: true, fontSize: 9 },
										{ text: 'Category', bold: true, fontSize: 9 },
										{ text: 'Finding', bold: true, fontSize: 9 },
										{ text: 'Level', bold: true, fontSize: 9 }
									],
									...result.firedRules.map((r) => [
										{ text: r.id, fontSize: 8, color: '#6b7280' },
										{ text: r.category, fontSize: 9 },
										{ text: r.description, fontSize: 9 },
										{ text: r.riskLevel, fontSize: 9, bold: true }
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
