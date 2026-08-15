import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import { riskLevelLabel, carePathwayLabel, bmiCategory, calculateAge } from '#lib/engine/utils.js';

export function buildPdfDocument(
	data: AssessmentData,
	result: GradingResult
): TDocumentDefinitions {
	const dem = data.maternalDemographics;
	const age = calculateAge(dem.dateOfBirth);
	const bmi = dem.bmi;
	const w = data.currentPregnancy.gestationWeeks;
	const gestation = w != null ? `${w}+${data.currentPregnancy.gestationDays ?? 0} weeks` : 'N/A';

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'OBSTETRICS ASSESSMENT REPORT',
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
			// Title & Risk Level
			{
				text: `Overall Risk: ${riskLevelLabel(result.riskLevel)}`,
				fontSize: 22,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `Recommended care pathway: ${carePathwayLabel(result.riskLevel)}`,
				fontSize: 12,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Patient Details
			sectionHeader('Patient Details'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Name', `${dem.firstName} ${dem.lastName}`),
							field('DOB', `${dem.dateOfBirth}${age ? ` (Age ${age})` : ''}`)
						],
						[
							field('BMI', bmi ? `${bmi} (${bmiCategory(bmi)})` : 'N/A'),
							field('Gestation', gestation)
						],
						[
							field(
								'Gravidity / Parity',
								`G${data.obstetricHistory.gravidity ?? '?'} P${data.obstetricHistory.parity ?? '?'}`
							),
							field('EDD', data.currentPregnancy.estimatedDueDate || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Additional Flags
			...(result.additionalFlags.length > 0
				? [
						sectionHeader('Flagged Issues for the Maternity Team'),
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

			// Fired Rules
			...(result.firedRules.length > 0
				? [
						sectionHeader('Risk Stratification Justification'),
						{
							table: {
								headerRows: 1,
								widths: [80, 90, '*', 50],
								body: [
									[
										{ text: 'Rule ID', bold: true, fontSize: 9 },
										{ text: 'Category', bold: true, fontSize: 9 },
										{ text: 'Finding', bold: true, fontSize: 9 },
										{ text: 'Risk', bold: true, fontSize: 9 }
									],
									...result.firedRules.map((r) => [
										{ text: r.id, fontSize: 8, color: '#6b7280' },
										{ text: r.category, fontSize: 9 },
										{ text: r.description, fontSize: 9 },
										{ text: r.risk.toUpperCase(), fontSize: 9, bold: true }
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
