import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { GradeResult, IssueTrackerAssessment } from '#lib/engine/types.js';
import { priorityLabel, bandLabel, instrumentLabel } from '#lib/engine/utils.js';

export function buildPdfDocument(
	data: IssueTrackerAssessment,
	result: GradeResult
): TDocumentDefinitions {
	const generated = new Date();

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'ISSUE TRACKER REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${generated.toLocaleString()}`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			// Composite priority
			{
				text: `Composite priority: ${priorityLabel(result.compositePriority)}`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: 'Worst single band across all seven scoring scales (max-grade).',
				fontSize: 11,
				alignment: 'center',
				color: '#4b5563',
				margin: [0, 0, 0, 20]
			},

			// Issue details
			sectionHeader('Issue Details'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[field('Summary', data.cc.ccSummary || 'N/A'), field('Reporter', data.reporter.reporterName || 'N/A')],
						[field('Category', data.reporter.issueCategory || 'N/A'), field('Environment', data.reporter.environment || 'N/A')],
						[field('System', data.reporter.systemName || 'N/A'), field('Component', data.reporter.component || 'N/A')]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Raw scores
			sectionHeader('Raw Scores'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[field('Priority rank', scoreText(result.scoreByPriorityRank)), field('Severity of impact', scoreText(result.scoreBySeverityOfImpact))],
						[field('Magnitude of damage', scoreText(result.scoreByMagnitudeOfDamage)), field('Harm grade', scoreText(result.scoreByHarmGrade))],
						[field('Failure condition', scoreText(result.scoreByFailureCondition)), field('MoSCoW requirement', scoreText(result.scoreByMoscowRequirement))],
						[
							field('Frequency of occurrence', result.scoreByFrequencyPercent === null ? 'N/A' : `${result.scoreByFrequencyPercent}%`),
							field('', '')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Flagged issues
			...(result.additionalFlags.length > 0
				? [
						sectionHeader('Flagged Issues for the Responder'),
						{
							ul: result.additionalFlags.map((f) => ({
								text: `[${f.priority.toUpperCase()}] ${f.category}: ${f.description} — ${f.suggestedAction}`,
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
						sectionHeader('Scoring Justification'),
						{
							table: {
								headerRows: 1,
								widths: [70, 90, '*', 50],
								body: [
									[
										{ text: 'Rule ID', bold: true, fontSize: 9 },
										{ text: 'Scale', bold: true, fontSize: 9 },
										{ text: 'Finding', bold: true, fontSize: 9 },
										{ text: 'Band', bold: true, fontSize: 9 }
									],
									...result.firedRules.map((r) => [
										{ text: r.ruleId, fontSize: 8, color: '#6b7280' },
										{ text: instrumentLabel(r.instrument), fontSize: 9 },
										{ text: r.description, fontSize: 9 },
										{ text: bandLabel(r.band), fontSize: 9, bold: true }
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

function scoreText(value: number | string | null): string {
	return value === null || value === '' ? 'N/A' : String(value);
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
			{ text: label ? `${label}: ` : '', bold: true, color: '#6b7280' },
			{ text: value }
		],
		margin: [0, 4, 0, 4] as [number, number, number, number]
	};
}
