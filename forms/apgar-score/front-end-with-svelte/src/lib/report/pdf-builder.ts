import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '$lib/engine/types';
import {
	bandLabel,
	trendLabel,
	priorityLabel,
	careSettingLabel,
	clinicianRoleLabel,
	modeOfDeliveryLabel,
	sexLabel
} from '$lib/engine/utils';

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	const scored = result.timepoints.filter((t) => t.scored);
	const worst = scored.length
		? scored.reduce((a, b) => (b.total < a.total ? b : a))
		: null;

	const timepointBody = [
		[
			{ text: 'Timepoint', bold: true, fontSize: 9 },
			{ text: 'Total', bold: true, fontSize: 9 },
			{ text: 'Band', bold: true, fontSize: 9 },
			{ text: 'Completeness', bold: true, fontSize: 9 }
		],
		...(scored.length === 0
			? [
					[
						{ text: 'No timepoints scored.', colSpan: 4, fontSize: 9, italics: true },
						{ text: '' },
						{ text: '' },
						{ text: '' }
					]
				]
			: scored.map((g) => [
					{ text: g.timepointMinutes == null ? '—' : `${g.timepointMinutes} min`, fontSize: 9 },
					{ text: `${g.total} of 10`, fontSize: 9, bold: true },
					{ text: bandLabel(g.band), fontSize: 9 },
					{ text: g.answeredCount === 5 ? 'All 5 signs' : `${g.answeredCount} of 5 signs`, fontSize: 9 }
				]))
	];

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'APGAR SCORE REPORT',
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
				text: worst ? `Lowest scored total: ${worst.total} of 10` : 'No timepoints scored',
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: worst ? bandLabel(worst.band) : '',
				fontSize: 12,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 4] as [number, number, number, number]
			},
			{
				text: `Trend across timepoints: ${trendLabel(result.trend)}`,
				fontSize: 11,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 20] as [number, number, number, number]
			},

			sectionHeader('Birth context'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Clinician', data.context.clinicianName || 'N/A'),
							field('Role', clinicianRoleLabel(data.context.clinicianRole) || 'N/A')
						],
						[
							field('Care setting', careSettingLabel(data.context.careSetting) || 'N/A'),
							field('Born at', data.context.bornAt || 'N/A')
						],
						[
							field(
								'Gestational age',
								data.context.gestationalAgeWeeks === null
									? 'N/A'
									: `${data.context.gestationalAgeWeeks} weeks`
							),
							field('Mode of delivery', modeOfDeliveryLabel(data.context.modeOfDelivery) || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Newborn'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Identifier', data.identification.newbornIdentifier || 'N/A'),
							field('Sex', sexLabel(data.identification.sex) || 'N/A')
						],
						[
							field(
								'Birth order',
								data.identification.birthOrder === null
									? 'N/A'
									: String(data.identification.birthOrder)
							),
							field('', '')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Per-timepoint scores'),
			{
				table: { headerRows: 1, widths: ['*', 'auto', '*', 'auto'], body: timepointBody },
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

			...(data.summary.resuscitationMeasures
				? [
						sectionHeader('Resuscitation measures'),
						{
							text: data.summary.resuscitationMeasures,
							fontSize: 10,
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			...(data.summary.clinicianNote
				? [
						sectionHeader('Clinical note'),
						{
							text: data.summary.clinicianNote,
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
