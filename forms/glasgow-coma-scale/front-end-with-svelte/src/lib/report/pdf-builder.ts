import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '$lib/engine/types';
import {
	severityBandLabel,
	priorityLabel,
	settingLabel,
	assessorRoleLabel,
	reactivityLabel
} from '$lib/engine/utils';

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	const totalText = result.totalDisplay || 'Not scored';
	const gcsPText = result.gcsP !== null ? String(result.gcsP) : 'Not scored';
	const prsText = result.pupilReactivityScore !== null ? String(result.pupilReactivityScore) : 'N/A';

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'GLASGOW COMA SCALE REPORT',
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
				text: `GCS: ${totalText}`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `${result.breakdown || 'Incomplete'} · ${severityBandLabel(result.severityBand)}`,
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
							field('Assessor', data.context.assessorName || 'N/A'),
							field('Role', assessorRoleLabel(data.context.assessorRole) || 'N/A')
						],
						[
							field('Setting', settingLabel(data.context.setting) || 'N/A'),
							field('Assessed at', data.context.assessedAt || 'N/A')
						],
						[field('Reason', data.context.reason || 'N/A'), field('', '')]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Components'),
			{
				table: {
					headerRows: 1,
					widths: ['*', 'auto', 'auto'],
					body: [
						[
							{ text: 'Component', bold: true, fontSize: 9 },
							{ text: 'Response', bold: true, fontSize: 9 },
							{ text: 'Score', bold: true, fontSize: 9 }
						],
						[
							{ text: 'Eye opening (E)', fontSize: 9 },
							{ text: data.eye.eyeResponse || 'Not recorded', fontSize: 9 },
							{ text: componentScore(result.eyeScore, data.eye.eyeResponse), fontSize: 9, bold: true }
						],
						[
							{ text: 'Verbal response (V)', fontSize: 9 },
							{ text: data.verbal.verbalResponse || 'Not recorded', fontSize: 9 },
							{
								text: componentScore(result.verbalScore, data.verbal.verbalResponse),
								fontSize: 9,
								bold: true
							}
						],
						[
							{ text: 'Motor response (M)', fontSize: 9 },
							{ text: data.motor.motorResponse || 'Not recorded', fontSize: 9 },
							{
								text: componentScore(result.motorScore, data.motor.motorResponse),
								fontSize: 9,
								bold: true
							}
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Pupils and GCS-Pupils'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Left pupil', reactivityLabel(data.pupils.leftPupilReactivity) || 'N/A'),
							field('Right pupil', reactivityLabel(data.pupils.rightPupilReactivity) || 'N/A')
						],
						[field('Pupil reactivity score', prsText), field('GCS-Pupils (GCS-P)', gcsPText)]
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
				: [])
		],
		defaultStyle: {
			fontSize: 10
		}
	};
}

function componentScore(score: number | null, response: string): string {
	if (response === 'NT') return 'NT';
	if (score === null) return 'N/A';
	return String(score);
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
