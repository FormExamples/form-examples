import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AbpmRequest, GradingResult } from '$lib/engine/types';
import {
	appropriatenessBandLabel,
	suitabilityBandLabel,
	triageTierLabel,
	testTypeLabel,
	indicationLabel,
	formatBloodPressure,
	calculateAge
} from '$lib/engine/utils';

export function buildPdfDocument(data: AbpmRequest, result: GradingResult): TDocumentDefinitions {
	const age = calculateAge(data.patient.dateOfBirth);
	const bp = formatBloodPressure(data.bloodPressure.clinicBpSystolic, data.bloodPressure.clinicBpDiastolic);

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'ABPM REQUEST VETTING REPORT',
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
				text: result.recommendationLabel,
				fontSize: 22,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `Triage: ${triageTierLabel(result.triageTier)}${result.targetTimeframe ? ` — ${result.targetTimeframe}` : ''}`,
				fontSize: 12,
				alignment: 'center',
				color: '#4b5563',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Four-axis grade'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('A · Appropriateness', `${result.appropriatenessScore}/9 — ${appropriatenessBandLabel(result.appropriatenessBand)}`),
							field('B · Suitability', suitabilityBandLabel(result.suitabilityBand))
						],
						[
							field('C · Completeness', `${result.completenessPercent}%`),
							field('D · Triage priority', triageTierLabel(result.triageTier))
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Request details'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Patient', `${data.patient.firstName} ${data.patient.lastName}`),
							field('DOB', `${data.patient.dateOfBirth}${age ? ` (Age ${age})` : ''}`)
						],
						[
							field('NHS number', data.patient.nhsNumber || 'N/A'),
							field('Clinic BP', bp || 'Not recorded')
						],
						[
							field('Test type', testTypeLabel(data.request.testType) || 'N/A'),
							field('Indication', indicationLabel(data.request.primaryIndication) || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			...(result.flags.length > 0
				? [
						sectionHeader('Safety flags'),
						{
							ul: result.flags.map((f) => ({
								text: `[${f.priority.toUpperCase()}] ${f.category}: ${f.description} — ${f.suggestedAction}`,
								color: f.priority === 'high' ? '#dc2626' : f.priority === 'medium' ? '#d97706' : '#4b5563',
								margin: [0, 2, 0, 2] as [number, number, number, number]
							})),
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			...(result.firedRules.length > 0
				? [
						sectionHeader('Fired rules'),
						{
							table: {
								headerRows: 1,
								widths: [90, 70, '*'],
								body: [
									[
										{ text: 'Rule ID', bold: true, fontSize: 9 },
										{ text: 'Axis', bold: true, fontSize: 9 },
										{ text: 'Description', bold: true, fontSize: 9 }
									],
									...result.firedRules.map((r) => [
										{ text: r.ruleId, fontSize: 8, color: '#6b7280' },
										{ text: r.axis, fontSize: 9 },
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
