import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import { severityBandLabel, ppsBand, ppsBandLabel, calculateAge } from '#lib/engine/utils.js';

export function buildPdfDocument(
	data: AssessmentData,
	result: GradingResult
): TDocumentDefinitions {
	const age = calculateAge(data.demographics.dateOfBirth);
	const pps = data.performanceStatus.ppsScore;

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'PALLIATIVE ASSESSMENT REPORT',
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
			// Title & severity band
			{
				text: `${severityBandLabel(result.severityBand)} symptom burden`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `ESAS-r total ${result.esasTotal} / 100  ·  ${result.answeredCount} / 10 symptoms scored`,
				fontSize: 12,
				alignment: 'center' as const,
				color: '#4b5563',
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
							field('Setting', data.demographics.assessmentSetting || 'N/A')
						],
						[
							field('Primary diagnosis', data.primaryDiagnosisPrognosis.primaryDiagnosis || 'N/A'),
							field(
								'Performance status',
								pps !== null ? `PPS ${pps} (${ppsBandLabel(ppsBand(pps))})` : 'N/A'
							)
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Severe individual symptoms
			...(result.individualFlags.length > 0
				? [
						sectionHeader('Severe Symptoms (ESAS-r >= 7)'),
						{
							ul: result.individualFlags.map((f) => `${f.symptomLabel} — ${f.score}/10`),
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			// Flagged issues
			...(result.additionalFlags.length > 0
				? [
						sectionHeader('Flagged Issues for the Palliative Team'),
						{
							ul: result.additionalFlags.map((f) => ({
								text: `[${f.priority.toUpperCase()}] ${f.category}: ${f.message}`,
								color:
									f.priority === 'high' ? '#dc2626' : f.priority === 'medium' ? '#d97706' : '#4b5563',
								margin: [0, 2, 0, 2] as [number, number, number, number]
							})),
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			// Fired rules
			...(result.firedRules.length > 0
				? [
						sectionHeader('Symptom Scores & Fired Rules'),
						{
							table: {
								headerRows: 1,
								widths: [80, 90, '*', 40],
								body: [
									[
										{ text: 'Rule ID', bold: true, fontSize: 9 },
										{ text: 'Category', bold: true, fontSize: 9 },
										{ text: 'Finding', bold: true, fontSize: 9 },
										{ text: 'Score', bold: true, fontSize: 9 }
									],
									...result.firedRules.map((r) => [
										{ text: r.id, fontSize: 8, color: '#6b7280' },
										{ text: r.category, fontSize: 9 },
										{ text: r.description, fontSize: 9 },
										{ text: String(r.score), fontSize: 9, bold: true }
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
