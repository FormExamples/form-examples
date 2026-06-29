import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '$lib/engine/types';
import { outcomeLabel, triStateLabel, calculateAge, venueTypeLabel } from '$lib/engine/utils';

export function buildPdfDocument(
	data: AssessmentData,
	result: GradingResult
): TDocumentDefinitions {
	const age = calculateAge(data.candidateDetails.dateOfBirth);

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'LIFEGUARD CERTIFICATION CHECKLIST REPORT',
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
			// Title & Outcome
			{
				text: `Outcome: ${outcomeLabel(result.outcome)}`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `${result.criticalFailures.length} critical failure(s) · ${result.deficiencies.length} deficiency(ies) · ${result.answeredCount}/${result.totalRules} competencies assessed`,
				fontSize: 11,
				alignment: 'center',
				color: '#4b5563',
				margin: [0, 0, 0, 20]
			},

			// Candidate Details
			sectionHeader('Candidate Details'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Name', `${data.candidateDetails.firstName} ${data.candidateDetails.lastName}`),
							field('Candidate ID', data.candidateDetails.candidateId || 'N/A')
						],
						[
							field('DOB', `${data.candidateDetails.dateOfBirth || 'N/A'}${age ? ` (Age ${age})` : ''}`),
							field('Session date', data.candidateDetails.sessionDate || 'N/A')
						],
						[
							field(
								'Venue',
								`${venueTypeLabel(data.candidateDetails.venueType)}${data.candidateDetails.venueName ? ` — ${data.candidateDetails.venueName}` : ''}`
							),
							field('Examiner', data.candidateDetails.examinerName || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Flagged Issues
			...(result.additionalFlags.length > 0
				? [
						sectionHeader('Flagged Issues for Examiner'),
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

			// Competency Results
			sectionHeader('Competency Results'),
			{
				table: {
					headerRows: 1,
					widths: [70, 70, '*', 40, 60],
					body: [
						[
							{ text: 'Rule ID', bold: true, fontSize: 9 },
							{ text: 'Category', bold: true, fontSize: 9 },
							{ text: 'Competency', bold: true, fontSize: 9 },
							{ text: 'Critical', bold: true, fontSize: 9 },
							{ text: 'Result', bold: true, fontSize: 9 }
						],
						...result.firedRules.map((r) => [
							{ text: r.id, fontSize: 7, color: '#6b7280' },
							{ text: r.category, fontSize: 8 },
							{ text: r.description, fontSize: 8 },
							{ text: r.critical ? 'Yes' : '—', fontSize: 8 },
							{ text: triStateLabel(r.status), fontSize: 8, bold: true }
						])
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Debrief
			...(data.overallResultSignoff.strengths ||
			data.overallResultSignoff.developmentAreas ||
			data.overallResultSignoff.examinerNotes ||
			data.overallResultSignoff.candidateFeedback
				? [
						sectionHeader('Debrief & Feedback'),
						{
							ul: [
								...(data.overallResultSignoff.strengths
									? [`Strengths: ${data.overallResultSignoff.strengths}`]
									: []),
								...(data.overallResultSignoff.developmentAreas
									? [`Development areas: ${data.overallResultSignoff.developmentAreas}`]
									: []),
								...(data.overallResultSignoff.examinerNotes
									? [`Examiner notes: ${data.overallResultSignoff.examinerNotes}`]
									: []),
								...(data.overallResultSignoff.candidateFeedback
									? [`Candidate feedback: ${data.overallResultSignoff.candidateFeedback}`]
									: [])
							],
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
