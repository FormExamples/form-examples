import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';

export function buildPdfDocument(
	data: AssessmentData,
	result: GradingResult
): TDocumentDefinitions {
	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'CODE OF CONDUCT NOTICE REPORT',
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
			// Title & status
			{
				text: `Status: ${result.status}`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `${result.completenessPercent}% Complete`,
				fontSize: 12,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 20] as [number, number, number, number]
			},

			// Recipient details
			sectionHeader('Recipient Details'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Organisation', data.recipientDetails.organisationName || 'N/A'),
							field('Recipient', data.recipientDetails.recipientName || 'N/A')
						],
						[
							field('Role', data.recipientDetails.recipientRole || 'N/A'),
							field('Employee / Contractor ID', data.recipientDetails.recipientEmployeeId || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Acknowledgement
			sectionHeader('Acknowledgement & Signature'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Acknowledged', data.acknowledgementSignature.agreed ? 'Yes' : 'No'),
							field('Signed name', data.acknowledgementSignature.recipientTypedFullName || 'N/A')
						],
						[
							field('Date', data.acknowledgementSignature.recipientTypedDate || 'N/A'),
							{ text: '' }
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Flagged issues
			...(result.additionalFlags.length > 0
				? [
						sectionHeader('Flagged Issues for Compliance Officer'),
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

			// Outstanding required fields
			...(result.firedRules.length > 0
				? [
						sectionHeader('Outstanding Required Fields'),
						{
							table: {
								headerRows: 1,
								widths: [70, 110, '*'],
								body: [
									[
										{ text: 'Rule ID', bold: true, fontSize: 9 },
										{ text: 'Section', bold: true, fontSize: 9 },
										{ text: 'Requirement', bold: true, fontSize: 9 }
									],
									...result.firedRules.map((r) => [
										{ text: r.id, fontSize: 8, color: '#6b7280' },
										{ text: r.section, fontSize: 9 },
										{ text: r.description, fontSize: 9 }
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
