import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import {
	categoryLabel,
	domainLabel,
	enpsClassificationLabel,
	retentionIntentLabel
} from '#lib/engine/utils.js';
import { GRADED_DOMAIN_KEYS, DEPARTMENT_OPTIONS, TENURE_OPTIONS, HOURS_OPTIONS } from '#lib/engine/rules.js';

function labelFor(options: { value: string; label: string }[], value: string): string {
	return options.find((o) => o.value === value)?.label ?? 'N/A';
}

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'EMPLOYEE SATISFACTION SURVEY REPORT',
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
				text: `Composite score: ${result.compositeScore ?? 'N/A'}/100`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: categoryLabel(result.category),
				fontSize: 14,
				alignment: 'center',
				color: '#4b5563',
				margin: [0, 0, 0, 4] as [number, number, number, number]
			},
			{
				text: `${result.answeredCount} of ${result.totalCount} items answered`,
				fontSize: 10,
				alignment: 'center',
				color: '#6b7280',
				margin: [0, 0, 0, 20] as [number, number, number, number]
			},

			// eNPS & retention
			sectionHeader('eNPS & Retention'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field(
								'Recommend score',
								`${result.eNPS.score ?? 'N/A'}/10 (${enpsClassificationLabel(result.eNPS.classification)})`
							),
							field('Retention intent', retentionIntentLabel(data.overall.retentionIntent))
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
					widths: ['*', 60, 60, 90],
					body: [
						[
							{ text: 'Domain', bold: true, fontSize: 9 },
							{ text: 'Answered', bold: true, fontSize: 9 },
							{ text: 'Score', bold: true, fontSize: 9 },
							{ text: 'Category', bold: true, fontSize: 9 }
						],
						...GRADED_DOMAIN_KEYS.map((key) => {
							const ds = result.domainScores[key];
							return [
								{ text: domainLabel(key), fontSize: 9 },
								{ text: `${ds.answeredCount}/${ds.totalCount}`, fontSize: 9 },
								{ text: ds.score === null ? 'N/A' : `${ds.score}`, fontSize: 9 },
								{ text: ds.category ? categoryLabel(ds.category) : 'N/A', fontSize: 9 }
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
						sectionHeader('Flagged Issues for HR Review'),
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

			// Respondent context
			sectionHeader('Respondent Context (anonymised)'),
			{
				table: {
					widths: ['*', '*', '*'],
					body: [
						[
							field('Department', labelFor(DEPARTMENT_OPTIONS, data.demographics.department)),
							field('Tenure', labelFor(TENURE_OPTIONS, data.demographics.tenureBand)),
							field('Hours', labelFor(HOURS_OPTIONS, data.demographics.hoursBand))
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Open-text comments
			...(data.overall.suggestionsForImprovement || data.overall.otherComments
				? [
						sectionHeader('Open-text Comments'),
						{
							ul: [
								...(data.overall.suggestionsForImprovement
									? [`Most important improvement: ${data.overall.suggestionsForImprovement}`]
									: []),
								...(data.overall.otherComments ? [`Other comments: ${data.overall.otherComments}`] : [])
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
