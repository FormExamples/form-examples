import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { GradingResult, ReconciliationData } from '#lib/engine/types.js';
import { isIntentional } from '#lib/engine/medication-reconciliation-rules.js';
import {
	statusLabel,
	priorityLabel,
	listSourceLabel,
	highRiskClassLabel,
	discrepancyTypeLabel,
	intendedActionLabel,
	reconciliationTypeLabel,
	careSettingLabel,
	clinicianRoleLabel,
	sexLabel,
	ageBandLabel,
	allergyStatusLabel
} from '#lib/engine/utils.js';

export function buildPdfDocument(
	data: ReconciliationData,
	result: GradingResult
): TDocumentDefinitions {
	const lineItemBody = [
		[
			{ text: 'Medicine', bold: true, fontSize: 9 },
			{ text: 'List', bold: true, fontSize: 9 },
			{ text: 'Dose / frequency', bold: true, fontSize: 9 },
			{ text: 'Indication', bold: true, fontSize: 9 },
			{ text: 'High-risk', bold: true, fontSize: 9 }
		],
		...(data.lineItems.length === 0
			? [
					[
						{ text: 'No medicines recorded.', fontSize: 9, colSpan: 5, italics: true },
						{ text: '' },
						{ text: '' },
						{ text: '' },
						{ text: '' }
					]
				]
			: data.lineItems.map((m, i) => [
					{ text: m.drugName || `Medicine ${i + 1}`, fontSize: 9 },
					{ text: listSourceLabel(m.listSource) || '—', fontSize: 9 },
					{ text: [m.dose, m.frequency].filter(Boolean).join(' · ') || '—', fontSize: 9 },
					{ text: m.indication || '—', fontSize: 9 },
					{
						text:
							m.highRiskClass && m.highRiskClass !== 'none'
								? highRiskClassLabel(m.highRiskClass)
								: '—',
						fontSize: 9
					}
				]))
	];

	const discrepancyBody = [
		[
			{ text: 'Type', bold: true, fontSize: 9 },
			{ text: 'Matched items', bold: true, fontSize: 9 },
			{ text: 'Action / rationale', bold: true, fontSize: 9 },
			{ text: 'Intent', bold: true, fontSize: 9 }
		],
		...(data.discrepancies.length === 0
			? [
					[
						{ text: 'No discrepancies recorded.', fontSize: 9, colSpan: 4, italics: true },
						{ text: '' },
						{ text: '' },
						{ text: '' }
					]
				]
			: data.discrepancies.map((d, i) => [
					{ text: discrepancyTypeLabel(d.discrepancyType) || `Discrepancy ${i + 1}`, fontSize: 9 },
					{
						text: [d.bpmhItemRef, d.inpatientItemRef].filter(Boolean).join(' -> ') || '—',
						fontSize: 9
					},
					{
						text:
							(intendedActionLabel(d.intendedAction) || '—') +
							(d.rationale ? ` — ${d.rationale}` : ''),
						fontSize: 9
					},
					{
						text: isIntentional(d) ? 'Intentional' : 'Unintentional',
						fontSize: 9,
						bold: !isIntentional(d)
					}
				]))
	];

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'MEDICATION RECONCILIATION REPORT',
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
				text: `Reconciliation status: ${statusLabel(result.status)}`,
				fontSize: 20,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 20] as [number, number, number, number]
			},

			sectionHeader('Encounter'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Type', reconciliationTypeLabel(data.encounter.reconciliationType) || 'N/A'),
							field('Care setting', careSettingLabel(data.encounter.careSetting) || 'N/A')
						],
						[
							field('Clinician', data.encounter.clinicianName || 'N/A'),
							field('Role', clinicianRoleLabel(data.encounter.clinicianRole) || 'N/A')
						],
						[field('Reconciled at', data.encounter.reconciledAt || 'N/A'), field('', '')]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Patient'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Identifier', data.identification.patientIdentifier || 'N/A'),
							field('Age band', ageBandLabel(data.identification.ageBand) || 'N/A')
						],
						[
							field('Sex', sexLabel(data.identification.sex) || 'N/A'),
							field('Allergy status', allergyStatusLabel(data.allergyReview.allergyStatus) || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Counts'),
			{
				table: {
					widths: ['*', 'auto'],
					body: [
						[
							field('Information sources', ''),
							{
								text: `${result.sourceCount} (${result.verifiedSourceCount} verified) — minimum 2`,
								fontSize: 9
							}
						],
						[field('Allergies recorded', ''), { text: String(result.allergyCount), fontSize: 9 }],
						[
							field('Line items', ''),
							{
								text: `${result.lineItemCount} — ${result.bpmhCount} BPMH, ${result.inpatientCount} inpatient`,
								fontSize: 9
							}
						],
						[
							field('Discrepancies', ''),
							{
								text: `${result.discrepancyCount} — ${result.intentionalCount} intentional, ${result.unintentionalCount} unintentional`,
								fontSize: 9
							}
						],
						[
							field('High-risk unintentional', ''),
							{ text: String(result.highRiskUnintentionalCount), fontSize: 9 }
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader(`Medication line items (${result.lineItemCount})`),
			{
				table: { headerRows: 1, widths: ['*', 'auto', 'auto', '*', 'auto'], body: lineItemBody },
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader(`Discrepancies (${result.discrepancyCount})`),
			{
				table: { headerRows: 1, widths: ['auto', '*', '*', 'auto'], body: discrepancyBody },
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
