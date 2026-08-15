import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import {
	severityLabel,
	severityDescription,
	severityIqBand,
	supportLevelLabel,
	bmiCategory,
	calculateAge
} from '#lib/engine/utils.js';

export function buildPdfDocument(
	data: AssessmentData,
	result: GradingResult
): TDocumentDefinitions {
	const age = calculateAge(data.demographics.dateOfBirth);
	const bmi = data.physicalExamination.bmi;

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'LEARNING DISABILITY ASSESSMENT REPORT',
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
				text: severityLabel(result.severityCategory),
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `Mean adaptive support ${result.adaptiveScore.toFixed(2)} / 3 · IQ band ${severityIqBand(result.severityCategory)}`,
				fontSize: 12,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 4] as [number, number, number, number]
			},
			{
				text: severityDescription(result.severityCategory),
				fontSize: 10,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 16] as [number, number, number, number]
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
							field('NHS number', data.demographics.nhsNumber || 'N/A')
						],
						[
							field('BMI', bmi ? `${bmi} (${bmiCategory(bmi)})` : 'N/A'),
							field('Communication', data.communicationNeeds.verbalAbility || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Flagged issues
			...(result.additionalFlags.length > 0
				? [
						sectionHeader('Flagged Issues for the Clinician'),
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

			// Adaptive functioning detail
			...(result.firedRules.length > 0
				? [
						sectionHeader('Adaptive Functioning Detail'),
						{
							table: {
								headerRows: 1,
								widths: [70, 70, '*', 90],
								body: [
									[
										{ text: 'ID', bold: true, fontSize: 9 },
										{ text: 'Domain', bold: true, fontSize: 9 },
										{ text: 'Item', bold: true, fontSize: 9 },
										{ text: 'Support', bold: true, fontSize: 9 }
									],
									...result.firedRules.map((r) => [
										{ text: r.id, fontSize: 8, color: '#6b7280' },
										{ text: r.category, fontSize: 9 },
										{ text: r.description, fontSize: 9 },
										{ text: `${r.score} — ${supportLevelLabel(r.score)}`, fontSize: 9, bold: true }
									])
								]
							},
							layout: 'lightHorizontalLines',
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			// Health action plan
			...(data.healthActionPlan.actions.length > 0
				? [
						sectionHeader('Health Action Plan'),
						{
							ul: data.healthActionPlan.actions.map(
								(a) =>
									`${a.action || 'Action'}${a.owner ? ` — ${a.owner}` : ''}${a.dueDate ? ` (due ${a.dueDate})` : ''}`
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
