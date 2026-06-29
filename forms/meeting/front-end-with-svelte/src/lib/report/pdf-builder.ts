import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { MeetingData, ValidationResult } from '$lib/engine/types';
import {
	healthLabel,
	completionStatusLabel,
	statusLabel,
	categoryLabel,
	overallResultLabel,
	formatDateTime
} from '$lib/engine/utils';

export function buildPdfDocument(
	data: MeetingData,
	result: ValidationResult
): TDocumentDefinitions {
	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'MEETING RECORD REPORT',
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
				text: data.meta.title || '(untitled meeting)',
				fontSize: 22,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `Health: ${healthLabel(result.overallHealth)} | Completion: ${completionStatusLabel(result.completionStatus)}`,
				fontSize: 12,
				alignment: 'center',
				color: '#4b5563',
				margin: [0, 0, 0, 20]
			},

			sectionHeader('Meeting details'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[field('Organiser', data.organizer.name || 'N/A'), field('Category', categoryLabel(data.meta.category))],
						[field('Status', statusLabel(data.meta.status)), field('Result', overallResultLabel(data.signoff.overallResult))],
						[field('Scheduled', formatDateTime(data.invitation.scheduledStartAt)), field('Duration', result.durationMinutes == null ? 'N/A' : `${result.durationMinutes} min`)]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('At a glance'),
			{
				ul: [
					`Participants: ${result.participantCount} (accepted ${result.acceptedCount}, attended ${result.attendedCount})`,
					`Agenda items: ${result.agendaItemCount}`,
					`Action items: ${result.actionItemCount} (${result.openActionCount} open)`,
					`Outputs: ${result.outputCount}`,
					`Outcomes: ${result.outcomeCount}`
				],
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			...(data.summary.summary
				? [
						sectionHeader('Summary'),
						{
							text: data.summary.summary,
							fontSize: 10,
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			...(result.flags.length > 0
				? [
						sectionHeader('Flags for the organiser'),
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
						sectionHeader('Validation findings'),
						{
							table: {
								headerRows: 1,
								widths: [120, 80, '*', 40],
								body: [
									[
										{ text: 'Rule ID', bold: true, fontSize: 9 },
										{ text: 'Instrument', bold: true, fontSize: 9 },
										{ text: 'Finding', bold: true, fontSize: 9 },
										{ text: 'Grade', bold: true, fontSize: 9 }
									],
									...result.firedRules.map((r) => [
										{ text: r.ruleId, fontSize: 8, color: '#6b7280' },
										{ text: r.instrument, fontSize: 9 },
										{ text: r.description, fontSize: 9 },
										{ text: r.grade, fontSize: 9, bold: true }
									])
								]
							},
							layout: 'lightHorizontalLines',
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			...(data.results.actionItems.length > 0
				? [
						sectionHeader('Action items'),
						{
							ul: data.results.actionItems.map(
								(a) =>
									`${a.title || '(untitled)'}${a.ownerName ? ` — ${a.ownerName}` : ''}${a.dueDate ? ` (due ${a.dueDate})` : ''} [${a.status}]`
							),
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
