import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '$lib/engine/types';
import { riskLevelLabel, calculateBmi } from '$lib/engine/utils';

export function buildPdfDocument(
	data: AssessmentData,
	result: GradingResult
): TDocumentDefinitions {
	const bmi = data.lifestyleFactors.bmi ?? calculateBmi(data.demographics.heightCm, data.demographics.weightKg);
	const cholUnit = data.cholesterol.cholesterolUnit === 'mmolL' ? 'mmol/L' : 'mg/dL';

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'FRAMINGHAM RISK SCORE — HARD CORONARY HEART DISEASE',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 9,
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
			// Title & risk
			{
				text: `${result.tenYearRiskPercent.toFixed(1)} %`,
				fontSize: 28,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 2]
			},
			{
				text: riskLevelLabel(result.riskCategory),
				fontSize: 14,
				alignment: 'center',
				color: '#4b5563',
				margin: [0, 0, 0, 2] as [number, number, number, number]
			},
			{
				text: '10-year risk of hard coronary heart disease (myocardial infarction or coronary death)',
				fontSize: 9,
				alignment: 'center',
				color: '#6b7280',
				margin: [0, 0, 0, 20] as [number, number, number, number]
			},

			// Patient details
			sectionHeader('Patient Details'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Name', data.patientInformation.fullName || 'N/A'),
							field('DOB', data.patientInformation.dateOfBirth || 'N/A')
						],
						[field('Age', data.demographics.age != null ? String(data.demographics.age) : 'N/A'), field('Sex', data.demographics.sex || 'N/A')],
						[
							field(
								'Systolic BP',
								data.bloodPressure.systolicBp != null ? `${data.bloodPressure.systolicBp} mmHg` : 'N/A'
							),
							field('BMI', bmi != null ? String(bmi) : 'N/A')
						],
						[
							field(
								'Total cholesterol',
								data.cholesterol.totalCholesterol != null
									? `${data.cholesterol.totalCholesterol} ${cholUnit}`
									: 'N/A'
							),
							field(
								'HDL cholesterol',
								data.cholesterol.hdlCholesterol != null
									? `${data.cholesterol.hdlCholesterol} ${cholUnit}`
									: 'N/A'
							)
						],
						[
							field('Smoking', data.smokingHistory.smokingStatus || 'N/A'),
							field('On BP treatment', data.bloodPressure.onBpTreatment || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Additional flags
			...(result.additionalFlags.length > 0
				? [
						sectionHeader('Flagged Issues for the Clinician'),
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

			// Fired rules
			...(result.firedRules.length > 0
				? [
						sectionHeader('Risk Assessment Justification'),
						{
							table: {
								headerRows: 1,
								widths: [70, 90, '*', 70],
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
										{ text: riskLevelLabel(r.riskLevel), fontSize: 9, bold: true }
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
