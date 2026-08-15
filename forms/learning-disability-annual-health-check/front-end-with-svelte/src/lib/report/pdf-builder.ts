import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import {
	statusLabel,
	priorityLabel,
	clinicianRoleLabel,
	sexLabel,
	ageBandLabel,
	ldRegisterStatusLabel
} from '#lib/engine/utils.js';

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	const completedCount = result.componentStatuses.filter((c) => c.completed).length;

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'LEARNING DISABILITY ANNUAL HEALTH CHECK REPORT',
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
				text: `${statusLabel(result.status)} — ${result.completenessPercent}% (${completedCount} of ${result.componentStatuses.length} required components)`,
				fontSize: 20,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `Health Action Plan: ${result.healthActionPlanComplete ? 'produced and shared' : 'not produced and shared'}`,
				fontSize: 12,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 20] as [number, number, number, number]
			},

			sectionHeader('Check context'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Clinician', data.context.clinicianName || 'N/A'),
							field('Role', clinicianRoleLabel(data.context.clinicianRole) || 'N/A')
						],
						[
							field('GP practice', data.context.practiceName || 'N/A'),
							field('Date of check', data.context.checkedOn || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Person'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Identifier', data.identification.personIdentifier || 'N/A'),
							field('Age band', ageBandLabel(data.identification.ageBand) || 'N/A')
						],
						[
							field('Sex', sexLabel(data.identification.sex) || 'N/A'),
							field(
								'LD register',
								ldRegisterStatusLabel(data.identification.ldRegisterStatus) || 'N/A'
							)
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Required components'),
			{
				table: {
					headerRows: 1,
					widths: ['*', 'auto'],
					body: [
						[
							{ text: 'Component', bold: true, fontSize: 9 },
							{ text: 'Status', bold: true, fontSize: 9 }
						],
						...result.componentStatuses.map((c) => [
							{ text: c.label, fontSize: 9 },
							{ text: c.completed ? 'Completed' : 'Missing', fontSize: 9, bold: true }
						])
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			...(result.flags.length > 0
				? [
						sectionHeader('Flagged issues'),
						{
							ul: result.flags.map((f) => ({
								text: `[${priorityLabel(f.priority)}] ${f.category}: ${f.description} — ${f.suggestedAction}`,
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

			...(data.plan.healthActionPlanActions
				? [
						sectionHeader('Health Action Plan actions'),
						{
							text: data.plan.healthActionPlanActions,
							fontSize: 10,
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			...(data.plan.clinicianNote
				? [
						sectionHeader('Clinician note'),
						{
							text: data.plan.clinicianNote,
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
