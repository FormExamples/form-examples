import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '$lib/engine/types';
import { satisfactionCategoryLabel, severityLabel, calculateAge } from '$lib/engine/utils';

export function buildPdfDocument(
	data: AssessmentData,
	result: GradingResult
): TDocumentDefinitions {
	const age = calculateAge(data.demographics.dateOfBirth);

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'PATIENT SATISFACTION SURVEY REPORT',
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
			// Title & overall score
			{
				text: `Overall satisfaction: ${result.normalizedScore} / 100`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: satisfactionCategoryLabel(result.satisfactionCategory),
				fontSize: 12,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 20] as [number, number, number, number]
			},

			// Respondent details
			sectionHeader('Respondent Details'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Name', `${data.demographics.firstName} ${data.demographics.lastName}`.trim() || 'Anonymous'),
							field('DOB', `${data.demographics.dateOfBirth || 'N/A'}${age ? ` (Age ${age})` : ''}`)
						],
						[
							field('Visit date', data.visitDetails.visitDate || 'N/A'),
							field('Visit type', data.visitDetails.visitType || 'N/A')
						],
						[
							field('Department', data.visitDetails.department || 'N/A'),
							field('Site', data.visitDetails.hospitalSite || 'N/A')
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
					widths: ['*', 80],
					body: [
						[
							{ text: 'Domain', bold: true, fontSize: 9 },
							{ text: 'Score', bold: true, fontSize: 9 }
						],
						...domainRows(result)
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Additional flags
			...(result.additionalFlags.length > 0
				? [
						sectionHeader('Flagged Issues for Service Quality'),
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

			// Fired rules
			...(result.firedRules.length > 0
				? [
						sectionHeader('Improvement Areas Identified'),
						{
							table: {
								headerRows: 1,
								widths: [60, 80, '*', 60],
								body: [
									[
										{ text: 'Rule ID', bold: true, fontSize: 9 },
										{ text: 'Domain', bold: true, fontSize: 9 },
										{ text: 'Finding', bold: true, fontSize: 9 },
										{ text: 'Severity', bold: true, fontSize: 9 }
									],
									...result.firedRules.map((r) => [
										{ text: r.id, fontSize: 8, color: '#6b7280' },
										{ text: r.domain, fontSize: 9 },
										{ text: r.description, fontSize: 9 },
										{ text: severityLabel(r.severity), fontSize: 9, bold: true }
									])
								]
							},
							layout: 'lightHorizontalLines',
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			// Free-text comments
			...(data.commentsSuggestions.whatWentWell || data.commentsSuggestions.whatCouldImprove
				? [
						sectionHeader('Patient Comments'),
						{
							stack: [
								...(data.commentsSuggestions.whatWentWell
									? [field('What went well', data.commentsSuggestions.whatWentWell)]
									: []),
								...(data.commentsSuggestions.whatCouldImprove
									? [field('What could improve', data.commentsSuggestions.whatCouldImprove)]
									: [])
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

function domainRows(result: GradingResult) {
	const labels: [keyof GradingResult['domainScores'], string][] = [
		['access', 'Access & Waiting Times'],
		['communication', 'Communication & Information'],
		['clinicalCare', 'Clinical Care Quality'],
		['staff', 'Staff Attitude'],
		['environment', 'Environment & Facilities'],
		['discharge', 'Discharge & Follow-up'],
		['overall', 'Overall Experience']
	];
	return labels.map(([key, label]) => [
		{ text: label, fontSize: 9 },
		{
			text: result.domainScores[key] === null ? 'N/A' : `${result.domainScores[key]}`,
			fontSize: 9,
			bold: true
		}
	]);
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
