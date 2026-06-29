import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult, SubscaleScore } from '$lib/engine/types';
import { severityLabel, subscaleLabel, calculateAge } from '$lib/engine/utils';

/** Build the printable PDF document definition for a psychology assessment. */
export function buildPdfDocument(
	data: AssessmentData,
	result: GradingResult
): TDocumentDefinitions {
	const age = calculateAge(data.demographics.dateOfBirth);

	const subscaleRow = (
		name: 'depression' | 'anxiety' | 'stress',
		score: SubscaleScore
	): string[] => [
		subscaleLabel(name),
		String(score.raw),
		String(score.scaled),
		severityLabel(score.severity),
		`${score.answered}/7`
	];

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'PSYCHOLOGY ASSESSMENT REPORT (DASS-21)',
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
				text: 'DASS-21 Psychological Screen',
				fontSize: 20,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 16]
			},
			// Patient summary
			{ text: 'Patient summary', fontSize: 14, bold: true, margin: [0, 0, 0, 6] },
			{
				columns: [
					{
						width: '50%',
						text: [
							{ text: 'Name: ', bold: true },
							`${data.demographics.firstName} ${data.demographics.lastName}`.trim() || 'N/A'
						]
					},
					{
						width: '50%',
						text: [
							{ text: 'DOB: ', bold: true },
							`${data.demographics.dateOfBirth || 'N/A'}${age != null ? ` (Age ${age})` : ''}`
						]
					}
				],
				margin: [0, 0, 0, 4]
			},
			{
				columns: [
					{ width: '50%', text: [{ text: 'Sex: ', bold: true }, data.demographics.sex || 'N/A'] },
					{
						width: '50%',
						text: [{ text: 'Occupation: ', bold: true }, data.demographics.occupation || 'N/A']
					}
				],
				margin: [0, 0, 0, 16]
			},
			// DASS-21 subscale scores
			{ text: 'DASS-21 subscale scores', fontSize: 14, bold: true, margin: [0, 0, 0, 6] },
			{
				table: {
					headerRows: 1,
					widths: ['*', 'auto', 'auto', 'auto', 'auto'],
					body: [
						[
							{ text: 'Subscale', bold: true },
							{ text: 'Raw', bold: true },
							{ text: 'Scaled', bold: true },
							{ text: 'Severity', bold: true },
							{ text: 'Answered', bold: true }
						],
						subscaleRow('depression', result.depression),
						subscaleRow('anxiety', result.anxiety),
						subscaleRow('stress', result.stress)
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 8]
			},
			{
				text: 'Raw scores are doubled to align with the published DASS-42 normative cutoffs (Lovibond & Lovibond, 1995).',
				fontSize: 8,
				color: '#6b7280',
				margin: [0, 0, 0, 16]
			},
			// Flagged issues
			...(result.additionalFlags.length > 0
				? [
						{ text: 'Flagged issues for clinician', fontSize: 14, bold: true, margin: [0, 0, 0, 6] as [number, number, number, number] },
						{
							ul: result.additionalFlags.map(
								(f) => `[${f.priority.toUpperCase()}] ${f.category}: ${f.message}`
							),
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),
			// Functional impact
			{ text: 'Functional impact', fontSize: 14, bold: true, margin: [0, 0, 0, 6] },
			{
				ul: [
					`Work: ${data.functionalImpact.workImpact || 'N/A'}`,
					`Relationships: ${data.functionalImpact.relationshipImpact || 'N/A'}`,
					`Daily activities: ${data.functionalImpact.dailyActivitiesImpact || 'N/A'}`,
					`Sleep: ${data.functionalImpact.sleepImpact || 'N/A'}`
				],
				margin: [0, 0, 0, 16]
			},
			// Safety screen
			{ text: 'Safety screen', fontSize: 14, bold: true, margin: [0, 0, 0, 6] },
			{
				ul: [
					`Suicidal ideation: ${data.riskScreen.suicidalIdeation || 'N/A'}`,
					`Self-harm: ${data.riskScreen.selfHarm || 'N/A'}`,
					`Harm to others: ${data.riskScreen.harmToOthers || 'N/A'}`,
					`Previous psychiatric emergency: ${data.riskScreen.psychiatricEmergencyHistory || 'N/A'}`,
					`Safety plan in place: ${data.riskScreen.hasSafetyPlan || 'N/A'}`
				]
			}
		]
	};
}
