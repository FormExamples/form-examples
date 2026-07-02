import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '$lib/engine/types';
import {
	statusLabel,
	priorityLabel,
	careSettingLabel,
	clinicianRoleLabel,
	sexLabel,
	ageBandLabel,
	tbsaMethodLabel,
	mechanismLabel,
	yesNoLabel,
	formatVolume,
	formatRate,
	formatHours
} from '$lib/engine/utils';

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	const weightKg = data.weight.weightKg;
	const tbsaPercent = data.burn.tbsaPercent;

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'PARKLAND FORMULA FOR BURNS REPORT',
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
				text: `Total 24 h volume: ${formatVolume(result.total24hVolumeMl)}`,
				fontSize: 22,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: statusLabel(result.status),
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
							field('Assessed at', data.context.assessedAt || 'N/A')
						]
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

			sectionHeader('Calculation inputs'),
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
							{ text: 'Body weight', fontSize: 9 },
							{ text: weightKg === null ? 'Not recorded' : `${weightKg} kg`, fontSize: 9 }
						],
						[
							{ text: '%TBSA (partial-thickness or deeper)', fontSize: 9 },
							{ text: tbsaPercent === null ? 'Not recorded' : `${tbsaPercent}%`, fontSize: 9 }
						],
						[
							{ text: 'TBSA method', fontSize: 9 },
							{ text: tbsaMethodLabel(data.burn.tbsaMethod) || 'N/A', fontSize: 9 }
						],
						[
							{ text: 'Time of injury', fontSize: 9 },
							{ text: data.injury.injuryAt || 'N/A', fontSize: 9 }
						],
						[
							{ text: 'Mechanism', fontSize: 9 },
							{ text: mechanismLabel(data.features.mechanism) || 'N/A', fontSize: 9 }
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Resuscitation plan'),
			{
				table: {
					headerRows: 1,
					widths: ['*', 'auto'],
					body: [
						[
							{ text: 'Derived output', bold: true, fontSize: 9 },
							{ text: 'Value', bold: true, fontSize: 9 }
						],
						[
							{ text: 'Total 24 h volume (4 × weight × %TBSA)', fontSize: 9, bold: true },
							{ text: formatVolume(result.total24hVolumeMl), fontSize: 9, bold: true }
						],
						[
							{ text: 'First 8 h volume (half)', fontSize: 9 },
							{ text: formatVolume(result.first8hVolumeMl), fontSize: 9 }
						],
						[
							{ text: 'Next 16 h volume (half)', fontSize: 9 },
							{ text: formatVolume(result.next16hVolumeMl), fontSize: 9 }
						],
						[
							{ text: 'Hours since injury', fontSize: 9 },
							{ text: formatHours(result.hoursSinceInjury), fontSize: 9 }
						],
						[
							{ text: 'First-phase rate (remaining window)', fontSize: 9 },
							{
								text:
									result.first8hRateMlPerHour === null
										? 'Overdue — give outstanding volume now'
										: formatRate(result.first8hRateMlPerHour),
								fontSize: 9
							}
						],
						[
							{ text: 'Second-phase rate (over 16 h)', fontSize: 9 },
							{ text: formatRate(result.next16hRateMlPerHour), fontSize: 9 }
						],
						[
							{ text: 'Urine-output target', fontSize: 9 },
							{
								text:
									result.targetUrineOutputLowMlPerHour === null
										? 'N/A'
										: `${formatRate(result.targetUrineOutputLowMlPerHour)} - ${formatRate(result.targetUrineOutputHighMlPerHour)} (0.5-1.0 mL/kg/h)`,
								fontSize: 9
							}
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

			...(data.note.clinicalNote
				? [
						sectionHeader('Clinical note'),
						{
							text: data.note.clinicalNote,
							fontSize: 10,
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			{
				text: 'The Parkland volume is a starting estimate only. Titrate fluids to urine output and physiological endpoints; this tool does not replace clinical judgement or specialist burns advice.',
				fontSize: 8,
				italics: true,
				color: '#6b7280',
				margin: [0, 8, 0, 0] as [number, number, number, number]
			}
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
