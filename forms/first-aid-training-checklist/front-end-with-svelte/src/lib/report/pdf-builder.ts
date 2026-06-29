import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '$lib/engine/types';
import { outcomeLabel, triStateLabel, traineeRoleLabel, formatTraineeName } from '$lib/engine/utils';

export function buildPdfDocument(
	data: AssessmentData,
	result: GradingResult
): TDocumentDefinitions {
	const t = data.traineeDetails;
	const name = formatTraineeName(t.firstName, t.lastName) || 'Unnamed trainee';

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'FIRST AID AT WORK — COMPETENCY ASSESSMENT',
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
			// Outcome
			{
				text: `Outcome: ${outcomeLabel(result.outcome)}`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `${result.passedCount} of ${result.totalRules} competencies demonstrated · ${result.criticalFailures.length} critical failure(s) · ${result.deficiencies.length} deficiency(ies)`,
				fontSize: 11,
				alignment: 'center',
				color: '#4b5563',
				margin: [0, 0, 0, 20] as [number, number, number, number]
			},

			// Trainee Details
			sectionHeader('Trainee Details'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[field('Trainee', name), field('Trainee ID', t.traineeId || 'N/A')],
						[
							field('Role', traineeRoleLabel(t.role) || 'N/A'),
							field('Session date', t.sessionDate || 'N/A')
						],
						[
							field('Examiner', t.examinerName || 'N/A'),
							field('Venue', t.venue || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Flagged issues
			...(result.additionalFlags.length > 0
				? [
						sectionHeader('Flagged Issues for the Examiner'),
						{
							ul: result.additionalFlags.map((f) => ({
								text: `[${f.priority.toUpperCase()}] ${f.category}: ${f.message}`,
								color: f.priority === 'high' ? '#dc2626' : f.priority === 'medium' ? '#d97706' : '#4b5563',
								margin: [0, 2, 0, 2] as [number, number, number, number]
							})),
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			// Competency checklist
			sectionHeader('Competency Checklist'),
			{
				table: {
					headerRows: 1,
					widths: [70, '*', 60, 70],
					body: [
						[
							{ text: 'Rule ID', bold: true, fontSize: 9 },
							{ text: 'Competency', bold: true, fontSize: 9 },
							{ text: 'Critical', bold: true, fontSize: 9 },
							{ text: 'Result', bold: true, fontSize: 9 }
						],
						...result.firedRules.map((r) => [
							{ text: r.id, fontSize: 8, color: '#6b7280' },
							{ text: r.description, fontSize: 9 },
							{ text: r.critical ? 'Yes' : '—', fontSize: 9 },
							{ text: triStateLabel(r.status), fontSize: 9, bold: true }
						])
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Notes
			...(data.recordingReportingHandover.examinerNotes ||
			data.recordingReportingHandover.debriefNotes ||
			data.recordingReportingHandover.traineeFeedback
				? [
						sectionHeader('Notes & Debrief'),
						{
							ul: [
								data.recordingReportingHandover.examinerNotes
									? `Examiner: ${data.recordingReportingHandover.examinerNotes}`
									: null,
								data.recordingReportingHandover.traineeFeedback
									? `Trainee: ${data.recordingReportingHandover.traineeFeedback}`
									: null,
								data.recordingReportingHandover.debriefNotes
									? `Debrief: ${data.recordingReportingHandover.debriefNotes}`
									: null
							].filter((x): x is string => x !== null),
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
