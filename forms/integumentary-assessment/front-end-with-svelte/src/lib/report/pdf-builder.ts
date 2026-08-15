import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import { riskLevelLabel, bmiCategory, calculateAge } from '#lib/engine/utils.js';

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
			text: 'INTEGUMENTARY ASSESSMENT REPORT',
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
			// Braden score & risk level
			{
				text: `Braden Score: ${result.bradenScore} / 23`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: riskLevelLabel(result.riskLevel),
				fontSize: 12,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 4] as [number, number, number, number]
			},
			{
				text: `Based on ${result.answeredCount} of 6 Braden subscales answered`,
				fontSize: 10,
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
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Flagged Issues
			...(result.additionalFlags.length > 0
				? [
						sectionHeader('Flagged Issues for the Tissue-Viability Team'),
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

			// Per-subscale Braden scores
			...(result.firedRules.length > 0
				? [
						sectionHeader('Per-subscale Braden Scores'),
						{
							table: {
								headerRows: 1,
								widths: [70, 100, '*', 50],
								body: [
									[
										{ text: 'Rule ID', bold: true, fontSize: 9 },
										{ text: 'Subscale', bold: true, fontSize: 9 },
										{ text: 'Description', bold: true, fontSize: 9 },
										{ text: 'Score', bold: true, fontSize: 9 }
									],
									...result.firedRules.map((r) => [
										{ text: r.id, fontSize: 8, color: '#6b7280' },
										{ text: r.category, fontSize: 9 },
										{ text: r.description, fontSize: 9 },
										{ text: `${r.score} / ${r.maxScore}`, fontSize: 9, bold: true }
									])
								]
							},
							layout: 'lightHorizontalLines',
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			// Wound assessment
			...(data.woundAssessment.woundPresent === 'yes'
				? [
						sectionHeader('Wound Assessment'),
						{
							ul: [
								`Location: ${data.woundAssessment.woundLocation || 'N/A'}`,
								`Stage: ${data.woundAssessment.woundStage || 'N/A'}`,
								`Tissue type: ${data.woundAssessment.tissueType || 'N/A'}`,
								`Infection signs: ${data.woundAssessment.infectionSigns || 'N/A'}`
							],
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			// Documented lesions
			...(data.skinInspection.lesions.length > 0
				? [
						sectionHeader('Documented Lesions'),
						{
							ul: data.skinInspection.lesions.map(
								(l) =>
									`${l.site || 'Unspecified site'} - ${l.type}${l.size ? ` (${l.size})` : ''}${l.description ? `: ${l.description}` : ''}`
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
