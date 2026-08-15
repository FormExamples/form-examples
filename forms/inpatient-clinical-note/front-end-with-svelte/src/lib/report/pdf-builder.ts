import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import {
	acuityLabel,
	escalationStatusLabel,
	noteTypeLabel,
	priorityLabel,
	statusLabel,
	vteStatusLabel
} from '#lib/engine/utils.js';

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	const documentedCount = result.componentStatuses.filter((c) => c.present).length;

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'INPATIENT CLINICAL NOTE REPORT',
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
				text: `Completeness: ${statusLabel(result.status)} — ${result.completenessPercent}% (${result.documentedRequired} of ${result.totalRequired} required components documented)`,
				fontSize: 16,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 6]
			},
			{
				text: `Clinical acuity: ${acuityLabel(result.acuityBand)}${result.news2Total === null ? ' (NEWS2 not recorded)' : ` (NEWS2 ${result.news2Total})`}`,
				fontSize: 16,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 6]
			},
			...(result.acuityOverridden
				? [
						{
							text: `Author overrode the computed band of ${acuityLabel(result.computedAcuityBand)}. Both are recorded.`,
							fontSize: 9,
							italics: true,
							alignment: 'center' as const,
							margin: [0, 0, 0, 14] as [number, number, number, number]
						}
					]
				: [
						{
							text: '',
							margin: [0, 0, 0, 14] as [number, number, number, number]
						}
					]),

			sectionHeader('Note header'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Author', data.header.authorName || 'N/A'),
							field('Grade', data.header.authorGrade || 'N/A')
						],
						[
							field('Note at', data.header.noteAt || 'N/A'),
							field('Ward', data.header.wardName || 'N/A')
						]
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
							field('Patient', data.admission.patientName || 'N/A'),
							field('Patient ID', data.admission.hospitalMrn || data.admission.nhsNumber || 'N/A')
						],
						[
							field('Note type', noteTypeLabel(data.header.noteType) || 'N/A'),
							field('', '')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Key findings'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field(
								'Latest NEWS2',
								result.news2Total === null ? 'N/A' : String(result.news2Total)
							),
							field('NEWS2 trend', data.observations.news2Trend || 'N/A')
						],
						[
							field('VTE assessment', vteStatusLabel(data.risks.vteStatus) || 'N/A'),
							field('Escalation status', escalationStatusLabel(data.planning.escalationStatus) || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Note component presence'),
			{
				text: `${documentedCount} of ${result.componentStatuses.length} components documented.`,
				fontSize: 9,
				margin: [0, 0, 0, 6] as [number, number, number, number]
			},
			{
				table: {
					headerRows: 1,
					widths: ['*', 'auto', 'auto'],
					body: [
						[
							{ text: 'Component', bold: true, fontSize: 9 },
							{ text: 'Class', bold: true, fontSize: 9 },
							{ text: 'Presence', bold: true, fontSize: 9 }
						],
						...result.componentStatuses.map((c) => [
							{ text: c.label, fontSize: 9 },
							{ text: c.required ? 'Required' : 'Recommended', fontSize: 9 },
							{ text: c.present ? 'Documented' : 'Absent', fontSize: 9, bold: true }
						])
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			...(result.flags.length > 0
				? [
						sectionHeader('Safety flags'),
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

			...(data.assessment.clinicalImpression
				? [
						sectionHeader('Clinical impression'),
						{
							text: data.assessment.clinicalImpression,
							fontSize: 10,
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			...(data.planning.plan
				? [
						sectionHeader('Plan'),
						{
							text: data.planning.plan,
							fontSize: 10,
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			{
				text:
					'This report grades the completeness of the written record and transcribes the published ' +
					'RCP NEWS2 escalation thresholds into a band. It is not a diagnosis, not a deterioration ' +
					'prediction, and not a substitute for clinical judgement.',
				fontSize: 8,
				italics: true,
				color: '#6b7280',
				margin: [0, 8, 0, 0] as [number, number, number, number]
			}
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
