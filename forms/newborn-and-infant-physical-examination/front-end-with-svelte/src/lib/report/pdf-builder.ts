import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import {
	careSettingLabel,
	componentLabel,
	componentResultLabel,
	examinationContextLabel,
	outcomeLabel,
	practitionerRoleLabel,
	priorityLabel,
	sexLabel,
	urgencyLabel
} from '#lib/engine/utils.js';

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	const componentRows: [string, string][] = [
		['Eyes', componentResultLabel(result.eyesResult)],
		['Heart', componentResultLabel(result.heartResult)],
		['Hips', componentResultLabel(result.hipsResult)],
		['Testes', componentResultLabel(result.testesResult)]
	];

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'NEWBORN AND INFANT PHYSICAL EXAMINATION (NIPE) REPORT',
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
				text: outcomeLabel(result.overallOutcome),
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `Overall screening outcome · completeness ${result.completenessPercent}% (${result.completeness})`,
				fontSize: 12,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 20] as [number, number, number, number]
			},

			sectionHeader('Examination context'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Practitioner', data.context.practitionerName || 'N/A'),
							field('Role', practitionerRoleLabel(data.context.practitionerRole) || 'N/A')
						],
						[
							field('Context', examinationContextLabel(data.context.examinationContext) || 'N/A'),
							field('Examined at', data.context.examinedAt || 'N/A')
						],
						[field('Care setting', careSettingLabel(data.context.careSetting) || 'N/A'), field('', '')]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Baby'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Identifier', data.identification.babyIdentifier || 'N/A'),
							field('Name', data.identification.babyName || 'N/A')
						],
						[
							field('Sex', sexLabel(data.identification.sex) || 'N/A'),
							field('Date of birth', data.identification.dateOfBirth || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Key components'),
			{
				table: {
					headerRows: 1,
					widths: ['*', 'auto'],
					body: [
						[
							{ text: 'Component', bold: true, fontSize: 9 },
							{ text: 'Result', bold: true, fontSize: 9 }
						],
						...componentRows.map((row) => [
							{ text: row[0], fontSize: 9 },
							{ text: row[1], fontSize: 9, bold: true }
						])
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			...(result.referrals.length > 0
				? [
						sectionHeader(`Referral pathways (${result.referrals.length})`),
						{
							ul: result.referrals.map((r) => ({
								text: `[${urgencyLabel(r.urgency)}] ${componentLabel(r.component)}: ${r.pathway}`,
								color: r.urgency === 'same-day' ? '#dc2626' : '#4b5563',
								margin: [0, 2, 0, 2] as [number, number, number, number]
							})),
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

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

			...(data.summary.clinicalNote
				? [
						sectionHeader('Clinical note'),
						{
							text: data.summary.clinicalNote,
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
