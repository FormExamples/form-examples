import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { CarePlan, GradingResult } from '$lib/engine/types';
import { classifyProblem } from '$lib/engine/nursing-care-plan-rules';
import {
	completenessLabel,
	priorityLabel,
	adlCategoryLabel,
	actualOrPotentialLabel,
	linkedRiskLabel,
	metStatusLabel,
	carriedOutLabel,
	nurseRoleLabel,
	planTypeLabel,
	careSettingLabel,
	sexLabel
} from '$lib/engine/utils';

export function buildPdfDocument(data: CarePlan, result: GradingResult): TDocumentDefinitions {
	const problemBody = [
		[
			{ text: 'Problem', bold: true, fontSize: 9 },
			{ text: 'Activity of living', bold: true, fontSize: 9 },
			{ text: 'Goals / interventions', bold: true, fontSize: 9 },
			{ text: 'Completeness', bold: true, fontSize: 9 }
		],
		...(data.problems.length === 0
			? [
					[
						{ text: 'No problems recorded.', fontSize: 9, colSpan: 4, italics: true },
						{ text: '' },
						{ text: '' },
						{ text: '' }
					]
				]
			: data.problems.map((p, i) => [
					{
						text:
							(p.problemStatement || `Problem ${i + 1}`) +
							(p.actualOrPotential ? ` (${actualOrPotentialLabel(p.actualOrPotential)})` : ''),
						fontSize: 9
					},
					{ text: adlCategoryLabel(p.adlCategory) || '—', fontSize: 9 },
					{
						text: `${p.goals.length} goal(s), ${p.interventions.length} intervention(s)`,
						fontSize: 9
					},
					{ text: completenessLabel(classifyProblem(p)), fontSize: 9 }
				]))
	];

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'NURSING CARE PLAN REPORT',
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
				text: `Care-plan status: ${completenessLabel(result.status)} (${result.completenessPercent}% complete)`,
				fontSize: 18,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 20] as [number, number, number, number]
			},

			sectionHeader('Plan context'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Nurse', data.planContext.nurseName || 'N/A'),
							field('Role', nurseRoleLabel(data.planContext.nurseRole) || 'N/A')
						],
						[
							field('Plan type', planTypeLabel(data.planContext.planType) || 'N/A'),
							field('Care setting', careSettingLabel(data.planContext.careSetting) || 'N/A')
						],
						[field('Authored at', data.planContext.authoredAt || 'N/A'), field('', '')]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Patient'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Identifier', data.patient.patientIdentifier || 'N/A'),
							field('Name', data.patient.patientName || 'N/A')
						],
						[
							field('Sex', sexLabel(data.patient.sex) || 'N/A'),
							field('Ward / location', data.patient.wardLocation || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader(`Problems (${data.problems.length})`),
			{
				table: { headerRows: 1, widths: ['*', 'auto', 'auto', 'auto'], body: problemBody },
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Per-problem detail: goals, interventions, evaluation.
			...data.problems.flatMap((p, i) => [
				sectionHeader(`Problem ${i + 1}: ${p.problemStatement || '(no statement)'}`),
				{
					text: `Linked risk: ${linkedRiskLabel(p.linkedRisk) || '—'} · Goal-met: ${
						metStatusLabel(p.goalMet) || '—'
					} · Next review: ${p.nextReviewDate || '—'}`,
					fontSize: 9,
					color: '#4b5563',
					margin: [0, 0, 0, 4] as [number, number, number, number]
				},
				{
					ul: [
						...p.goals.map((g) => ({
							text: `Goal: ${g.goalText || '(blank)'}${g.targetDate ? ` (target ${g.targetDate})` : ''} — ${metStatusLabel(g.met) || 'not evaluated'}`,
							fontSize: 9
						})),
						...p.interventions.map((iv) => ({
							text: `Intervention: ${iv.interventionText || '(blank)'} — ${carriedOutLabel(iv.carriedOut) || 'not recorded'}`,
							fontSize: 9
						})),
						{ text: `Evaluation: ${p.evaluationNote || '(none recorded)'}`, fontSize: 9 }
					],
					margin: [0, 0, 0, 12] as [number, number, number, number]
				}
			]),

			...(result.flags.length > 0
				? [
						sectionHeader('Flagged issues'),
						{
							ul: result.flags.map((f) => ({
								text: `[${priorityLabel(f.priority)}] ${f.category}: ${f.message}`,
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

			...(data.summary.handoverNote
				? [
						sectionHeader('Handover note'),
						{
							text: data.summary.handoverNote,
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
