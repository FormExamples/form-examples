import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import {
	riskZoneLabel,
	percentileBandLabel,
	gestationBandLabel,
	priorityLabel,
	careSettingLabel,
	clinicianRoleLabel,
	sexLabel,
	measurementMethodLabel,
	formatTsb
} from '#lib/engine/utils.js';

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	const ageHours = data.measurement.ageHours;
	const tsb = data.measurement.totalSerumBilirubinUmolL;

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'BHUTANI BILIRUBIN NOMOGRAM REPORT',
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
				text: riskZoneLabel(result.riskZone),
				fontSize: 22,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `${percentileBandLabel(result.percentileBand)} · gestation band ${gestationBandLabel(result.gestationBand)}`,
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

			sectionHeader('Infant'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Identifier', data.identification.infantIdentifier || 'N/A'),
							field('Sex', sexLabel(data.identification.sex) || 'N/A')
						],
						[
							field(
								'Gestational age',
								data.identification.gestationalAgeWeeks === null
									? 'N/A'
									: `${data.identification.gestationalAgeWeeks} weeks`
							),
							field('Born at', data.identification.bornAt || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Measurement and classification'),
			{
				table: {
					headerRows: 1,
					widths: ['*', 'auto'],
					body: [
						[
							{ text: 'Item', bold: true, fontSize: 9 },
							{ text: 'Value', bold: true, fontSize: 9 }
						],
						[
							{ text: 'Age at measurement', fontSize: 9 },
							{ text: ageHours === null ? 'Not recorded' : `${ageHours} h`, fontSize: 9 }
						],
						[
							{ text: 'Total serum bilirubin (TSB)', fontSize: 9 },
							{ text: formatTsb(tsb), fontSize: 9 }
						],
						[
							{ text: 'Measurement method', fontSize: 9 },
							{ text: measurementMethodLabel(data.measurement.measurementMethod) || 'N/A', fontSize: 9 }
						],
						[
							{ text: 'Percentile tracks (p40 / p75 / p95)', fontSize: 9 },
							{
								text:
									result.p40 === null
										? 'N/A'
										: `${result.p40} / ${result.p75} / ${result.p95} µmol/L`,
								fontSize: 9
							}
						],
						[
							{ text: 'Phototherapy threshold', fontSize: 9 },
							{
								text:
									result.phototherapyThreshold === null
										? 'N/A'
										: `${result.phototherapyThreshold} µmol/L — TSB ${result.abovePhototherapy ? 'at/above' : 'below'}`,
								fontSize: 9
							}
						],
						[
							{ text: 'Exchange-transfusion threshold', fontSize: 9, bold: true },
							{
								text:
									result.exchangeThreshold === null
										? 'N/A'
										: `${result.exchangeThreshold} µmol/L — TSB ${result.aboveExchange ? 'at/above' : 'below'}`,
								fontSize: 9,
								bold: true
							}
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			...(result.firedRiskFactors.length > 0
				? [
						sectionHeader('Risk factors present'),
						{
							ul: result.firedRiskFactors.map((f) => ({
								text: f.label,
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
