import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '$lib/engine/types';
import { outcomeLabel, triStateLabel, candidateName } from '$lib/engine/utils';

export function buildPdfDocument(
	data: AssessmentData,
	result: GradingResult
): TDocumentDefinitions {
	const c = data.candidateExaminerScenario;
	const attempt =
		c.attempt === 'retest' ? 'Retest' : c.attempt === 'first-attempt' ? 'First attempt' : 'N/A';

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'EMT PSYCHOMOTOR EXAMINATION REPORT',
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
				text: `${result.points} of ${result.maxPoints} points (${Math.round(result.percent)}%) — ${result.answeredCount} of ${result.totalRules} items scored`,
				fontSize: 12,
				alignment: 'center',
				color: '#4b5563',
				margin: [0, 0, 0, 20]
			},

			// Candidate & scenario
			sectionHeader('Candidate & Scenario'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Candidate', candidateName(c.candidateFirstName, c.candidateLastName) || 'N/A'),
							field('Candidate ID', c.candidateId || 'N/A')
						],
						[field('Attempt', attempt), field('Examiner', c.examinerName || 'N/A')],
						[
							field('Session date', c.sessionDate || 'N/A'),
							field('Station / location', c.stationLocation || 'N/A')
						],
						[field('Chief complaint', c.chiefComplaintGiven || 'N/A'), field('', '')]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Critical-criteria failures
			...(result.criticalFailures.length > 0
				? [
						sectionHeader('Critical-Criteria Failures'),
						{
							ul: result.criticalFailures.map((r) => `${r.category}: ${r.description}`),
							color: '#dc2626',
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			// Flagged issues
			...(result.additionalFlags.length > 0
				? [
						sectionHeader('Flagged Issues for the Debrief'),
						{
							ul: result.additionalFlags.map((f) => ({
								text: `[${f.priority.toUpperCase()}] ${f.category}: ${f.message}`,
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

			// Checklist scoring
			...(result.firedRules.length > 0
				? [
						sectionHeader('Checklist Scoring'),
						{
							table: {
								headerRows: 1,
								widths: [70, '*', 40, 55],
								body: [
									[
										{ text: 'Item', bold: true, fontSize: 9 },
										{ text: 'Skill', bold: true, fontSize: 9 },
										{ text: 'Points', bold: true, fontSize: 9 },
										{ text: 'Result', bold: true, fontSize: 9 }
									],
									...result.firedRules.map((r) => [
										{
											text: r.critical ? `${r.id} *` : r.id,
											fontSize: 8,
											color: '#6b7280'
										},
										{ text: r.description, fontSize: 9 },
										{ text: `${r.pointsAwarded}/${r.points}`, fontSize: 9 },
										{ text: triStateLabel(r.status), fontSize: 9, bold: true }
									])
								]
							},
							layout: 'lightHorizontalLines',
							margin: [0, 0, 0, 8] as [number, number, number, number]
						},
						{
							text: '* critical criterion — any failure forces an automatic Fail.',
							fontSize: 8,
							color: '#9ca3af',
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			// Examiner / debrief notes
			...(c.scenarioSummary ||
			data.criticalCriteriaReview.examinerNotes ||
			data.criticalCriteriaReview.debriefNotes
				? [
						sectionHeader('Notes'),
						...(c.scenarioSummary ? [field('Scenario', c.scenarioSummary)] : []),
						...(data.criticalCriteriaReview.examinerNotes
							? [field('Examiner notes', data.criticalCriteriaReview.examinerNotes)]
							: []),
						...(data.criticalCriteriaReview.debriefNotes
							? [field('Debrief notes', data.criticalCriteriaReview.debriefNotes)]
							: [])
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
