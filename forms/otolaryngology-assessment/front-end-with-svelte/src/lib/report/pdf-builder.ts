import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import { severityLabel, calculateAge } from '#lib/engine/utils.js';

export function buildPdfDocument(
	data: AssessmentData,
	result: GradingResult
): TDocumentDefinitions {
	const age = calculateAge(data.demographics.dateOfBirth);

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'OTOLARYNGOLOGY ASSESSMENT REPORT',
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
			// Title & SNOT-22 result
			{
				text: `SNOT-22 Total: ${result.totalScore} / 110`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: severityLabel(result.severityLevel),
				fontSize: 12,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 4] as [number, number, number, number]
			},
			{
				text: `${result.answeredCount} of 22 SNOT-22 items answered`,
				fontSize: 9,
				alignment: 'center' as const,
				color: '#6b7280',
				margin: [0, 0, 0, 16] as [number, number, number, number]
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
							field('Occupation', data.demographics.occupation || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Presenting complaint
			...(data.presentingComplaint.chiefComplaint
				? [
						sectionHeader('Presenting Complaint'),
						{
							text: data.presentingComplaint.chiefComplaint,
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			// Flagged issues
			...(result.additionalFlags.length > 0
				? [
						sectionHeader('Flagged Issues for ENT Clinician'),
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

			// SNOT-22 itemised scores
			...(result.firedRules.length > 0
				? [
						sectionHeader('SNOT-22 Itemised Scores'),
						{
							table: {
								headerRows: 1,
								widths: [70, '*', 40],
								body: [
									[
										{ text: 'Item ID', bold: true, fontSize: 9 },
										{ text: 'Symptom', bold: true, fontSize: 9 },
										{ text: 'Score', bold: true, fontSize: 9 }
									],
									...result.firedRules.map((r) => [
										{ text: r.id, fontSize: 8, color: '#6b7280' },
										{ text: r.description, fontSize: 9 },
										{ text: `${r.score}`, fontSize: 9, bold: true }
									])
								]
							},
							layout: 'lightHorizontalLines',
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			// Management plan
			...(data.clinicalImpressionPlan.workingDiagnosis
				? [
						sectionHeader('Clinical Impression & Plan'),
						{
							text: [
								{ text: 'Working diagnosis: ', bold: true, color: '#6b7280' },
								{ text: data.clinicalImpressionPlan.workingDiagnosis }
							],
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
