import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import {
	classificationLabel,
	priorityLabel,
	careSettingLabel,
	clinicianRoleLabel,
	sexLabel,
	ageBandLabel,
	formatGap
} from '#lib/engine/utils.js';

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	const { sodium, potassium, chloride, bicarbonate } = data.electrolytes;
	const albumin = data.albumin.albumin;

	const val = (n: number | null, unit: string) =>
		n === null ? 'Not recorded' : `${n} ${unit}`;

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'ANION GAP REPORT',
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
				text: `Anion gap: ${formatGap(result.anionGap)}`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: classificationLabel(result.classification),
				fontSize: 12,
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
							field('Clinician', data.context.clinicianName || 'N/A'),
							field('Role', clinicianRoleLabel(data.context.clinicianRole) || 'N/A')
						],
						[
							field('Care setting', careSettingLabel(data.context.careSetting) || 'N/A'),
							field('Calculated at', data.context.calculatedAt || 'N/A')
						],
						[field('Clinical context', data.context.clinicalContext || 'N/A'), field('', '')]
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
						[field('Sex', sexLabel(data.identification.sex) || 'N/A'), field('', '')]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Calculation'),
			{
				table: {
					headerRows: 1,
					widths: ['*', 'auto'],
					body: [
						[
							{ text: 'Input', bold: true, fontSize: 9 },
							{ text: 'Value', bold: true, fontSize: 9 }
						],
						[
							{ text: 'Serum sodium', fontSize: 9 },
							{ text: val(sodium, 'mmol/L'), fontSize: 9 }
						],
						[
							{ text: 'Serum potassium (optional)', fontSize: 9 },
							{ text: val(potassium, 'mmol/L'), fontSize: 9 }
						],
						[
							{ text: 'Serum chloride', fontSize: 9 },
							{ text: val(chloride, 'mmol/L'), fontSize: 9 }
						],
						[
							{ text: 'Serum bicarbonate', fontSize: 9 },
							{ text: val(bicarbonate, 'mmol/L'), fontSize: 9 }
						],
						[
							{ text: 'Serum albumin (optional)', fontSize: 9 },
							{ text: val(albumin, 'g/L'), fontSize: 9 }
						],
						[
							{
								text: `Anion gap (${result.includesPotassium ? 'with potassium; 8–16' : 'without potassium; 8–12'})`,
								fontSize: 9,
								bold: true
							},
							{ text: formatGap(result.anionGap), fontSize: 9, bold: true }
						],
						[
							{ text: 'Albumin-corrected anion gap', fontSize: 9, bold: true },
							{ text: formatGap(result.correctedAnionGap), fontSize: 9, bold: true }
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
