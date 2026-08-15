import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import { mustRiskLabel, severityLabel, bmiCategory, calculateAge } from '#lib/engine/utils.js';

export function buildPdfDocument(
	data: AssessmentData,
	result: GradingResult
): TDocumentDefinitions {
	const age = calculateAge(data.demographics.dateOfBirth);
	const bmi = data.anthropometricMeasurements.bmi;
	const weightLossPct = data.anthropometricMeasurements.weightLossPercent;

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'NUTRITION ASSESSMENT REPORT',
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
			// Title & severity
			{
				text: severityLabel(result.severity),
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `MUST score ${result.mustScore} / 6 — ${mustRiskLabel(result.mustRisk)}`,
				fontSize: 12,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 4] as [number, number, number, number]
			},
			{
				text: `Based on ${result.answeredCount} of 3 MUST screening steps answered.`,
				fontSize: 9,
				alignment: 'center' as const,
				color: '#6b7280',
				margin: [0, 0, 0, 20] as [number, number, number, number]
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
						],
						[
							field('Weight loss', weightLossPct !== null ? `${weightLossPct}% of usual weight` : 'N/A'),
							field('Severity', severityLabel(result.severity))
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Additional Flags
			...(result.additionalFlags.length > 0
				? [
						sectionHeader('Flagged Issues for the Dietitian'),
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

			// MUST per-step scores
			...(result.firedRules.length > 0
				? [
						sectionHeader('MUST Per-Step Scores'),
						{
							table: {
								headerRows: 1,
								widths: [60, 100, '*', 40],
								body: [
									[
										{ text: 'Step', bold: true, fontSize: 9 },
										{ text: 'Category', bold: true, fontSize: 9 },
										{ text: 'Finding', bold: true, fontSize: 9 },
										{ text: 'Score', bold: true, fontSize: 9 }
									],
									...result.firedRules.map((r) => [
										{ text: r.id, fontSize: 8, color: '#6b7280' },
										{ text: r.category, fontSize: 9 },
										{ text: r.description, fontSize: 9 },
										{ text: `${r.score} / 2`, fontSize: 9, bold: true }
									])
								]
							},
							layout: 'lightHorizontalLines',
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			// Food allergies
			...(data.foodAllergiesIntolerances.foodAllergies.length > 0
				? [
						sectionHeader('Food Allergies'),
						{
							ul: data.foodAllergiesIntolerances.foodAllergies.map(
								(a) => `${a.allergen} - ${a.reaction}${a.severity ? ` (${a.severity})` : ''}`
							),
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
