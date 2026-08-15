import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import {
	completenessStatusLabel,
	sectionClassLabel,
	urgencyLabel,
	priorityLabel,
	criterionLabel,
	locationLabel,
	ageBandLabel,
	sexLabel,
	imminenceLabel,
	outcomeLabel,
	conveyanceLabel
} from '#lib/engine/utils.js';

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	const present = result.requiredSignatories.filter((s) => s.present).length;
	const total = result.requiredSignatories.length;

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'MENTAL HEALTH ACT ASSESSMENT REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Documentation instrument — NOT an automated decision to detain | Generated ${new Date(result.timestamp).toLocaleString()}`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: sectionClassLabel(result.recommendedSectionClass),
				fontSize: 18,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `Documentation: ${completenessStatusLabel(result.completenessStatus)}  ·  Urgency: ${urgencyLabel(result.urgencyClass)}  ·  Signatories present: ${present} of ${total}`,
				fontSize: 11,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 20] as [number, number, number, number]
			},

			sectionHeader('Assessment context'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Assessed at', data.context.assessedAt || 'N/A'),
							field('Location', locationLabel(data.context.location) || 'N/A')
						],
						[
							field('Referral source', data.context.referralSource || 'N/A'),
							field('AMHP', data.professionals.amhpName || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Person'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Identifier', data.identification.personIdentifier || 'N/A'),
							field('Age band', ageBandLabel(data.identification.ageBand) || 'N/A')
						],
						[
							field('Sex', sexLabel(data.identification.sex) || 'N/A'),
							field('First language', data.identification.firstLanguage || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Required signatories'),
			{
				table: {
					headerRows: 1,
					widths: ['*', 'auto'],
					body: [
						[
							{ text: 'Signatory', bold: true, fontSize: 9 },
							{ text: 'Present', bold: true, fontSize: 9 }
						],
						...(result.requiredSignatories.length > 0
							? result.requiredSignatories.map((s) => [
									{ text: s.label, fontSize: 9 },
									{ text: s.present ? 'Yes' : 'No', fontSize: 9, bold: true }
								])
							: [[{ text: 'No statutory signatories required', fontSize: 9 }, { text: '—', fontSize: 9 }]])
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Statutory criteria'),
			{
				table: {
					headerRows: 1,
					widths: ['*', 'auto', 'auto'],
					body: [
						[
							{ text: 'Criterion', bold: true, fontSize: 9 },
							{ text: 'Status', bold: true, fontSize: 9 },
							{ text: 'Evidence', bold: true, fontSize: 9 }
						],
						...(result.criteriaSummary.length > 0
							? result.criteriaSummary.map((c) => [
									{ text: c.label, fontSize: 9 },
									{ text: criterionLabel(c.status), fontSize: 9, bold: true },
									{ text: c.evidencePresent ? 'Recorded' : 'Missing', fontSize: 9 }
								])
							: [
									[
										{ text: 'No statutory criteria required', fontSize: 9 },
										{ text: '—', fontSize: 9 },
										{ text: '—', fontSize: 9 }
									]
								])
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Recommendation and outcome'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Outcome', outcomeLabel(data.recommendation.outcome) || 'N/A'),
							field('Bed identified', data.recommendation.bedIdentified || 'N/A')
						],
						[
							field('Conveyance', conveyanceLabel(data.recommendation.conveyance) || 'N/A'),
							field('Risk imminence', imminenceLabel(data.risk.riskImminence) || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			...(result.flaggedIssues.length > 0
				? [
						sectionHeader('Flagged issues'),
						{
							ul: result.flaggedIssues.map((f) => ({
								text: `[${priorityLabel(f.priority)}] ${f.category}: ${f.description} — ${f.suggestedAction}`,
								color:
									f.priority === 'high' ? '#dc2626' : f.priority === 'medium' ? '#d97706' : '#4b5563',
								margin: [0, 2, 0, 2] as [number, number, number, number]
							})),
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			...(data.recommendation.clinicalLegalNote
				? [
						sectionHeader('Clinical and legal note'),
						{
							text: data.recommendation.clinicalLegalNote,
							fontSize: 10,
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
			{ text: label ? `${label}: ` : '', bold: true, color: '#6b7280' },
			{ text: value }
		],
		margin: [0, 4, 0, 4] as [number, number, number, number]
	};
}
