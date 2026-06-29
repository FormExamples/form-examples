import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '$lib/engine/types';
import { outcomeLabel, actionTimeframe, gradeLabel } from '$lib/engine/utils';

export function buildPdfDocument(
	data: AssessmentData,
	result: GradingResult
): TDocumentDefinitions {
	const findings = result.firedRules.filter((r) => r.grade >= 2);
	const categories = Object.values(result.findingsByCategory);

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'WORKPLACE SAFETY AUDIT REPORT',
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
			// Title & outcome
			{
				text: `Outcome: ${outcomeLabel(result.outcome)}`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: actionTimeframe(result.outcome),
				fontSize: 12,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 4] as [number, number, number, number]
			},
			{
				text: `${result.answeredCount} checklist items assessed`,
				fontSize: 10,
				alignment: 'center' as const,
				color: '#6b7280',
				margin: [0, 0, 0, 20] as [number, number, number, number]
			},

			// Audit details
			sectionHeader('Audit Details'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Site', data.siteDetails.siteName || 'N/A'),
							field('Department / Area', data.siteDetails.departmentArea || 'N/A')
						],
						[
							field(
								'Auditor',
								`${data.siteDetails.auditorName}${data.siteDetails.auditorRole ? ` (${data.siteDetails.auditorRole})` : ''}`
							),
							field('Audit Date', data.siteDetails.auditDate || 'N/A')
						],
						[
							field('Site Manager', data.siteDetails.siteManager || 'N/A'),
							field('Previous Audit', data.siteDetails.previousAuditDate || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Flagged issues
			...(result.additionalFlags.length > 0
				? [
						sectionHeader('Flagged Issues for the Auditor'),
						{
							ul: result.additionalFlags.map((f) => ({
								text: `[${f.priority.toUpperCase()}] ${f.category}: ${f.message}`,
								color:
									f.priority === 'high' || f.priority === 'urgent'
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

			// Findings by category
			...(categories.length > 0
				? [
						sectionHeader('Findings by Category'),
						{
							table: {
								headerRows: 1,
								widths: ['*', 'auto', 'auto', 'auto', 'auto', 'auto'],
								body: [
									[
										{ text: 'Category', bold: true, fontSize: 9 },
										{ text: 'Compliant', bold: true, fontSize: 9 },
										{ text: 'Minor', bold: true, fontSize: 9 },
										{ text: 'Major', bold: true, fontSize: 9 },
										{ text: 'Critical', bold: true, fontSize: 9 },
										{ text: 'Total', bold: true, fontSize: 9 }
									],
									...categories.map((c) => [
										{ text: c.category, fontSize: 9 },
										{ text: String(c.compliant), fontSize: 9 },
										{ text: String(c.minor), fontSize: 9 },
										{ text: String(c.major), fontSize: 9 },
										{ text: String(c.critical), fontSize: 9 },
										{ text: String(c.total), fontSize: 9, bold: true }
									])
								]
							},
							layout: 'lightHorizontalLines',
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			// Non-compliant findings
			...(findings.length > 0
				? [
						sectionHeader('Non-compliant Findings'),
						{
							table: {
								headerRows: 1,
								widths: [60, 90, '*', 50],
								body: [
									[
										{ text: 'Rule ID', bold: true, fontSize: 9 },
										{ text: 'Category', bold: true, fontSize: 9 },
										{ text: 'Finding', bold: true, fontSize: 9 },
										{ text: 'Severity', bold: true, fontSize: 9 }
									],
									...findings.map((r) => [
										{ text: r.id, fontSize: 8, color: '#6b7280' },
										{ text: r.category, fontSize: 9 },
										{ text: r.description, fontSize: 9 },
										{ text: gradeLabel(r.grade), fontSize: 9, bold: true }
									])
								]
							},
							layout: 'lightHorizontalLines',
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			// Action plan
			...(data.signoffActionPlan.actionItems.length > 0
				? [
						sectionHeader('Action Plan'),
						{
							ul: data.signoffActionPlan.actionItems.map(
								(a) =>
									`${a.description || 'Action'}${a.owner ? ` — ${a.owner}` : ''}${a.dueDate ? ` (due ${a.dueDate})` : ''}${a.priority ? ` [${a.priority}]` : ''}`
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
