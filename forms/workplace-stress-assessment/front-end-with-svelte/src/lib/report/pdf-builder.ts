import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import { DOMAIN_KEYS } from '#lib/engine/stress-grader.js';
import {
	riskLevelLabel,
	riskLevelShortLabel,
	domainTitle,
	formatMean,
	departmentLabel,
	tenureBandLabel,
	hoursBandLabel
} from '#lib/engine/utils.js';

export function buildPdfDocument(
	data: AssessmentData,
	result: GradingResult
): TDocumentDefinitions {
	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'WORKPLACE STRESS ASSESSMENT REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.timestamp).toLocaleString()} | Anonymous response`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			// Title & overall concern
			{
				text: `Overall concern: ${riskLevelLabel(result.overallRisk)}`,
				fontSize: 22,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `${result.answeredCount} of 35 items answered across seven HSE domains`,
				fontSize: 11,
				alignment: 'center',
				color: '#4b5563',
				margin: [0, 0, 0, 16]
			},

			// Response context
			sectionHeader('Response Context'),
			{
				table: {
					widths: ['*', '*', '*'],
					body: [
						[
							field('Department', departmentLabel(data.demographics.department)),
							field('Tenure', tenureBandLabel(data.demographics.tenureBand)),
							field('Hours', hoursBandLabel(data.demographics.hoursBand))
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Domain scores
			sectionHeader('Domain Scores'),
			{
				table: {
					headerRows: 1,
					widths: ['*', 70, 70, 90],
					body: [
						[
							{ text: 'Domain', bold: true, fontSize: 9 },
							{ text: 'Mean (1-5)', bold: true, fontSize: 9 },
							{ text: 'Answered', bold: true, fontSize: 9 },
							{ text: 'Concern', bold: true, fontSize: 9 }
						],
						...DOMAIN_KEYS.map((key) => {
							const r = result.domains[key];
							return [
								{ text: domainTitle(key), fontSize: 9 },
								{ text: formatMean(r.mean), fontSize: 9 },
								{ text: `${r.answeredCount}/${r.totalCount}`, fontSize: 9, color: '#6b7280' },
								{ text: riskLevelShortLabel(r.category), fontSize: 9, bold: true }
							];
						})
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Flagged issues
			...(result.additionalFlags.length > 0
				? [
						sectionHeader('Flagged Issues for Review'),
						{
							ul: result.additionalFlags.map((f) => ({
								text: `[${f.priority.toUpperCase()}] ${f.category}: ${f.message}`,
								color:
									f.priority === 'high'
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

			// Comments
			...buildComments(data)
		],
		defaultStyle: {
			fontSize: 10
		}
	};
}

function buildComments(data: AssessmentData) {
	const c = data.additionalComments;
	const parts: { label: string; value: string }[] = [];
	if (c.mostStressfulAspect) parts.push({ label: 'Most stressful aspect', value: c.mostStressfulAspect });
	if (c.suggestionsForImprovement)
		parts.push({ label: 'Suggestions for improvement', value: c.suggestionsForImprovement });
	if (c.otherComments) parts.push({ label: 'Other comments', value: c.otherComments });
	if (parts.length === 0) return [];

	return [
		sectionHeader('Comments'),
		{
			stack: parts.map((p) => ({
				text: [
					{ text: `${p.label}: `, bold: true, color: '#6b7280' },
					{ text: p.value }
				],
				margin: [0, 2, 0, 2] as [number, number, number, number]
			})),
			margin: [0, 0, 0, 16] as [number, number, number, number]
		}
	];
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
