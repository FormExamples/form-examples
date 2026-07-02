import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '$lib/engine/types';
import { zaritItems, activeItemNumbers, normalizeInstrumentForm } from '$lib/engine/zarit-rules';
import {
	bandLabel,
	priorityLabel,
	careSettingLabel,
	practitionerRoleLabel,
	instrumentFormLabel,
	carerRelationshipLabel,
	carerCoResidentLabel,
	recipientConditionLabel
} from '$lib/engine/utils';

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	const instrumentForm = normalizeInstrumentForm(data);
	const active = new Set(activeItemNumbers(instrumentForm));

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'ZARIT BURDEN INTERVIEW (ZBI) REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.timestamp).toLocaleString()} | Screen, not a diagnosis`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: `ZBI total: ${result.totalScore} of ${result.maxScore}`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `${instrumentFormLabel(instrumentForm)} — ${bandLabel(result.burdenBand)}`,
				fontSize: 12,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Assessment context'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Practitioner', data.context.practitionerName || 'N/A'),
							field('Role', practitionerRoleLabel(data.context.practitionerRole) || 'N/A')
						],
						[
							field('Care setting', careSettingLabel(data.context.careSetting) || 'N/A'),
							field('Assessed at', data.context.assessedAt || 'N/A')
						],
						[
							field('Instrument form', instrumentFormLabel(instrumentForm)),
							field('', '')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Carer and care recipient'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Carer identifier', data.carer.carerIdentifier || 'N/A'),
							field('Relationship', carerRelationshipLabel(data.carer.carerRelationship) || 'N/A')
						],
						[
							field('Co-resident', carerCoResidentLabel(data.carer.carerCoResident) || 'N/A'),
							field(
								'Care hours / week',
								data.carer.careHoursPerWeek === null ? 'N/A' : String(data.carer.careHoursPerWeek)
							)
						],
						[
							field('Recipient identifier', data.recipient.recipientIdentifier || 'N/A'),
							field('Condition', recipientConditionLabel(data.recipient.recipientCondition) || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Item ratings'),
			{
				table: {
					headerRows: 1,
					widths: ['auto', '*', 'auto'],
					body: [
						[
							{ text: 'Item', bold: true, fontSize: 9 },
							{ text: 'Statement', bold: true, fontSize: 9 },
							{ text: 'Rating', bold: true, fontSize: 9 }
						],
						...zaritItems.map((item, i) => {
							const scored = active.has(item.number);
							const r = result.itemRatings[i];
							return [
								{
									text: `${item.number}${scored ? '' : ' (n/s)'}`,
									fontSize: 9
								},
								{ text: item.statement, fontSize: 9 },
								{
									text: r === null ? '—' : `${r} / 4`,
									fontSize: 9,
									bold: true
								}
							];
						})
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 8] as [number, number, number, number]
			},
			{
				text:
					instrumentForm === 'zbi12'
						? '(n/s) items are not scored on the ZBI-12 short form.'
						: '',
				fontSize: 8,
				color: '#9ca3af',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			...(result.flaggedIssues.length > 0
				? [
						sectionHeader('Flagged issues'),
						{
							ul: result.flaggedIssues.map((f) => ({
								text: `[${priorityLabel(f.priority)}] ${f.category}: ${f.description} — ${f.suggestedAction}`,
								color:
									f.priority === 'urgent' || f.priority === 'high'
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

			...(data.note.clinicalNote
				? [
						sectionHeader('Clinical note'),
						{
							text: data.note.clinicalNote,
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
