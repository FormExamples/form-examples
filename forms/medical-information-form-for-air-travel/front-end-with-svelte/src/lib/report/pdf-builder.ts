import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { MedifAssessment, GradingResult } from '$lib/engine/types';
import { fitnessBandLabel } from '$lib/engine/utils';

export function buildPdfDocument(
	data: MedifAssessment,
	result: GradingResult
): TDocumentDefinitions {
	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'MEDICAL INFORMATION FORM FOR AIR TRAVEL (MEDIF)',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Valid until ${result.validUntil || 'N/A'}`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: `Fitness to fly: ${fitnessBandLabel(result.fitnessBand)}`,
				fontSize: 22,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: result.deskRecommendation,
				fontSize: 11,
				alignment: 'center',
				color: '#4b5563',
				margin: [0, 0, 0, 16]
			},

			sectionHeader('Passenger and trip'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Passenger', `${data.passenger.firstName} ${data.passenger.lastName}`),
							field('Date of birth', data.passenger.dateOfBirth || 'N/A')
						],
						[
							field('Airline', data.trip.airlineName || 'N/A'),
							field(
								'Flight',
								`${data.trip.outboundFlightNumber || 'N/A'} (${data.trip.outboundOriginIata || '?'} → ${data.trip.outboundDestinationIata || '?'})`
							)
						],
						[
							field('Departure', data.trip.outboundDate || 'N/A'),
							field('Physician', data.physician.physicianName || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			...(result.safetyFlags.length > 0
				? [
						sectionHeader('Safety flags for the medical desk'),
						{
							ul: result.safetyFlags.map((f) => ({
								text: `[${f.priority.toUpperCase()}] ${f.category}: ${f.description} — ${f.suggestedAction}`,
								color:
									f.priority === 'high' ? '#dc2626' : f.priority === 'medium' ? '#d97706' : '#4b5563',
								margin: [0, 2, 0, 2] as [number, number, number, number]
							})),
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			...(result.firedRules.length > 0
				? [
						sectionHeader('Fitness band justification'),
						{
							table: {
								headerRows: 1,
								widths: [90, 90, '*', 90],
								body: [
									[
										{ text: 'Rule ID', bold: true, fontSize: 9 },
										{ text: 'Category', bold: true, fontSize: 9 },
										{ text: 'Finding', bold: true, fontSize: 9 },
										{ text: 'Band', bold: true, fontSize: 9 }
									],
									...result.firedRules.map((r) => [
										{ text: r.ruleId, fontSize: 8, color: '#6b7280' },
										{ text: r.category, fontSize: 9 },
										{ text: r.description, fontSize: 9 },
										{ text: fitnessBandLabel(r.band), fontSize: 9, bold: true }
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
