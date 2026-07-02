import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { GradingResult, ReviewData } from '$lib/engine/types';
import {
	reviewStatusLabel,
	burdenBandLabel,
	polypharmacyBandLabel,
	anticholinergicBandLabel,
	priorityLabel,
	highRiskClassLabel,
	adherenceLabel,
	careSettingLabel,
	consultationModeLabel,
	clinicianRoleLabel,
	frailtyLabel,
	sexLabel,
	ageBandLabel
} from '$lib/engine/utils';

export function buildPdfDocument(data: ReviewData, result: GradingResult): TDocumentDefinitions {
	const medicineBody = [
		[
			{ text: 'Medicine', bold: true, fontSize: 9 },
			{ text: 'Indication', bold: true, fontSize: 9 },
			{ text: 'Adherence', bold: true, fontSize: 9 },
			{ text: 'ACB', bold: true, fontSize: 9 },
			{ text: 'High-risk', bold: true, fontSize: 9 }
		],
		...(data.medicines.length === 0
			? [
					[
						{ text: 'No medicines recorded.', fontSize: 9, colSpan: 5, italics: true },
						{ text: '' },
						{ text: '' },
						{ text: '' },
						{ text: '' }
					]
				]
			: data.medicines.map((m, i) => [
					{
						text: (m.drugName || `Medicine ${i + 1}`) + (m.formStrength ? ` — ${m.formStrength}` : ''),
						fontSize: 9
					},
					{ text: m.indication || '—', fontSize: 9 },
					{ text: adherenceLabel(m.adherence) || '—', fontSize: 9 },
					{
						text:
							m.anticholinergicBurdenPoints === null
								? '—'
								: String(m.anticholinergicBurdenPoints),
						fontSize: 9
					},
					{
						text: m.isHighRisk === 'yes' ? highRiskClassLabel(m.highRiskClass) || 'Yes' : '—',
						fontSize: 9
					}
				]))
	];

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'STRUCTURED MEDICATION REVIEW REPORT',
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
				text: `Review status: ${reviewStatusLabel(result.reviewStatus)}`,
				fontSize: 20,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4] as [number, number, number, number]
			},
			{
				text: `${burdenBandLabel(result.burdenBand)} · ACB ${result.anticholinergicBurdenScore} · ${result.regularMedicineCount} regular medicine(s)`,
				fontSize: 11,
				alignment: 'center',
				color: '#6b7280',
				margin: [0, 0, 0, 20] as [number, number, number, number]
			},

			sectionHeader('Review context'),
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
							field('Consultation', consultationModeLabel(data.context.consultationMode) || 'N/A')
						],
						[field('Reviewed at', data.context.reviewedAt || 'N/A'), field('', '')]
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
							field('Frailty', frailtyLabel(data.identification.frailtyStatus) || 'N/A')
						],
						[
							field('Long-term conditions', data.identification.longTermConditions || 'N/A'),
							field('', '')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Indicators'),
			{
				table: {
					widths: ['*', 'auto'],
					body: [
						[
							field('Medicines', ''),
							{
								text: `${result.medicineCount} total, ${result.regularMedicineCount} regular`,
								fontSize: 9
							}
						],
						[
							field('Polypharmacy', ''),
							{ text: polypharmacyBandLabel(result.polypharmacyBand), fontSize: 9 }
						],
						[
							field('Anticholinergic burden', ''),
							{
								text: `${result.anticholinergicBurdenScore} — ${anticholinergicBandLabel(result.anticholinergicBand)}`,
								fontSize: 9
							}
						],
						[
							field('STOPP / START', ''),
							{
								text: `${result.stopFlags.length} STOPP, ${result.startFlags.length} START`,
								fontSize: 9
							}
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader(`Medicines (${result.medicineCount})`),
			{
				table: { headerRows: 1, widths: ['*', '*', 'auto', 'auto', 'auto'], body: medicineBody },
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

			...(data.goals.sharedDecisions
				? [
						sectionHeader('Shared decisions'),
						{
							text: data.goals.sharedDecisions,
							fontSize: 10,
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
