import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { GradingResult, WaitingListCard } from '#lib/engine/types.js';
import { waitingTimeStatusLabel, clinicalPriorityLabel } from '#lib/engine/utils.js';

export function buildPdfDocument(
	data: WaitingListCard,
	result: GradingResult
): TDocumentDefinitions {
	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'MEDICAL WAITING LIST CARD',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date().toLocaleString()}`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: `Waiting Time Status: ${waitingTimeStatusLabel(result.waitingTimeStatus)}`,
				fontSize: 22,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: result.clinicalPriority ? clinicalPriorityLabel(result.clinicalPriority) : 'Priority not set',
				fontSize: 12,
				alignment: 'center',
				color: '#4b5563',
				margin: [0, 0, 0, 20] as [number, number, number, number]
			},

			sectionHeader('Waiting time'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[field('Target wait (wk)', valueOf(result.targetWaitWeeks)), field('Weeks waited', valueOf(result.weeksWaited))],
						[field('Days waited', valueOf(result.daysWaited)), field('Days to target', valueOf(result.daysToTarget))],
						[field('Days to breach', valueOf(result.daysToBreach)), field('Days to appointment', valueOf(result.daysToAppointment))]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Card details'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[field('Patient', data.patient.name || 'N/A'), field('NHS number', data.patient.unitedKingdomNhsNumber || 'N/A')],
						[field('Specialty', data.waitingList.specialty || 'N/A'), field('Procedure', data.waitingList.procedureDescription || 'N/A')],
						[field('Practitioner', data.practitioner.name || 'N/A'), field('Organisation', data.practitioner.organisationName || 'N/A')],
						[field('RTT clock-start', data.waitingList.rttClockStartDate ?? 'N/A'), field('Next appointment', data.appointment.appointmentDate ?? 'N/A')]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			...(result.additionalFlags.length > 0
				? [
						sectionHeader('Flagged issues for the booking team'),
						{
							ul: result.additionalFlags.map((f) => ({
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
						sectionHeader('Status justification'),
						{
							table: {
								headerRows: 1,
								widths: [70, 90, '*'],
								body: [
									[
										{ text: 'Rule ID', bold: true, fontSize: 9 },
										{ text: 'Instrument', bold: true, fontSize: 9 },
										{ text: 'Finding', bold: true, fontSize: 9 }
									],
									...result.firedRules.map((r) => [
										{ text: r.ruleId, fontSize: 8, color: '#6b7280' },
										{ text: r.instrument, fontSize: 9 },
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

function valueOf(v: number | null): string {
	return v === null ? 'N/A' : String(v);
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
