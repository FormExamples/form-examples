import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '$lib/engine/types';
import {
	categoryLabel,
	surveillanceBandLabel,
	priorityLabel,
	technicianRoleLabel,
	eligibilityRouteLabel,
	scanTypeLabel,
	sexLabel,
	formatDiameter
} from '$lib/engine/utils';

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	const m = data.measurement;

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'ABDOMINAL AORTIC ANEURYSM SCREENING REPORT',
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
				text: categoryLabel(result.category),
				fontSize: 22,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: surveillanceBandLabel(result.surveillanceBand),
				fontSize: 12,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 12] as [number, number, number, number]
			},
			{
				text: result.recommendedAction,
				fontSize: 10,
				alignment: 'center' as const,
				italics: true,
				color: '#4b5563',
				margin: [0, 0, 0, 20] as [number, number, number, number]
			},

			sectionHeader('Scan context'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Technician', data.context.technicianName || 'N/A'),
							field('Role', technicianRoleLabel(data.context.technicianRole) || 'N/A')
						],
						[
							field('Clinic site', data.context.clinicSite || 'N/A'),
							field('Scanned at', data.context.scannedAt || 'N/A')
						],
						[
							field('Device', data.context.deviceIdentifier || 'N/A'),
							field('Symptomatic', data.observations.symptomatic || 'Not recorded')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Patient and eligibility'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Identifier', data.identification.patientIdentifier || 'N/A'),
							field('Age', data.identification.age === null ? 'N/A' : `${data.identification.age}`)
						],
						[
							field('Sex', sexLabel(data.identification.sex) || 'N/A'),
							field('Eligibility', eligibilityRouteLabel(data.identification.eligibilityRoute) || 'N/A')
						],
						[field('Scan type', scanTypeLabel(data.identification.scanType) || 'N/A'), field('', '')]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Ultrasound measurement'),
			{
				table: {
					headerRows: 1,
					widths: ['*', 'auto'],
					body: [
						[
							{ text: 'Measurement', bold: true, fontSize: 9 },
							{ text: 'Value', bold: true, fontSize: 9 }
						],
						[
							{ text: 'Aorta adequately visualised', fontSize: 9 },
							{ text: m.aortaVisualised || 'Not recorded', fontSize: 9 }
						],
						[
							{ text: 'Maximum aortic diameter', fontSize: 9, bold: true },
							{ text: formatDiameter(result.maxAorticDiameterCm), fontSize: 9, bold: true }
						],
						[
							{ text: 'Prior maximum diameter', fontSize: 9 },
							{ text: formatDiameter(m.priorMaxDiameterCm), fontSize: 9 }
						],
						[
							{ text: 'Growth since prior scan', fontSize: 9 },
							{ text: formatDiameter(result.growthCm), fontSize: 9 }
						]
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

			...(data.result.resultNote
				? [
						sectionHeader('Result note'),
						{
							text: data.result.resultNote,
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
