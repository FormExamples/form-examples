import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { GradeResult } from '$engine/types';
import type { FormData } from '$stores/formState.svelte';
import { ragLabel } from '$engine/utils';

export function buildPdfDocument(data: FormData, result: GradeResult): TDocumentDefinitions {
	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'OKR TRACKER REPORT',
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
				text: `Composite RAG: ${ragLabel(result.computedCompositeRag)}`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `Progress ${data.scores.progressPercent ?? '—'}%  ·  Confidence ${data.scores.confidenceDecile ?? '—'}/10`,
				fontSize: 12,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 20] as [number, number, number, number]
			},

			// Objective details
			sectionHeader('Objective'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[field('Title', data.objective.obj_title || 'N/A'), field('Level', data.cycle.level || 'N/A')],
						[field('Reporter', data.reporter.name || 'N/A'), field('DRI', data.participants.dri || 'N/A')],
						[field('Cycle', data.cycle.cycle || 'N/A'), field('Theme', data.objective.strategic_theme || 'N/A')]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Key results
			...(data.keyResults.length > 0
				? [
						sectionHeader('Key Results'),
						{
							ul: data.keyResults.map(
								(k) =>
									`${k.position}. ${k.title || '(untitled)'}${k.krType ? ` [${k.krType}]` : ''} — ${k.currentValue ?? '—'} / ${k.targetValue ?? '—'}`
							),
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			// Flags
			...(result.flags.length > 0
				? [
						sectionHeader('Flagged Issues'),
						{
							ul: result.flags.map((f) => ({
								text: `[${f.priority.toUpperCase()}] ${f.flagCode}: ${f.description}`,
								color: f.priority === 'high' ? '#dc2626' : f.priority === 'medium' ? '#d97706' : '#4b5563',
								margin: [0, 2, 0, 2] as [number, number, number, number]
							})),
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			// Fired rules
			...(result.rulesFired.length > 0
				? [
						sectionHeader('Scoring Justification'),
						{
							table: {
								headerRows: 1,
								widths: [90, 70, '*', 50],
								body: [
									[
										{ text: 'Rule ID', bold: true, fontSize: 9 },
										{ text: 'Instrument', bold: true, fontSize: 9 },
										{ text: 'Finding', bold: true, fontSize: 9 },
										{ text: 'Band', bold: true, fontSize: 9 }
									],
									...result.rulesFired.map((r) => [
										{ text: r.ruleId, fontSize: 8, color: '#6b7280' },
										{ text: r.instrument, fontSize: 9 },
										{ text: r.description, fontSize: 9 },
										{ text: String(r.grade), fontSize: 9, bold: true }
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
