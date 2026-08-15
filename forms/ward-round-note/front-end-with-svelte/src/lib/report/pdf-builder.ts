import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import {
	statusLabel,
	priorityLabel,
	clinicianGradeLabel,
	observationTrendLabel,
	vteStatusLabel,
	escalationStatusLabel
} from '#lib/engine/utils.js';

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	const documentedCount = result.componentStatuses.filter((c) => c.present).length;

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'WARD ROUND NOTE COMPLETENESS REPORT',
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
				text: `${statusLabel(result.status)} — ${result.completenessPercent}% (${result.documentedRequired} of ${result.totalRequired} required components documented)`,
				fontSize: 20,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 20]
			},

			sectionHeader('Review header'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Clinician', data.header.clinicianName || 'N/A'),
							field('Grade', clinicianGradeLabel(data.header.clinicianGrade) || 'N/A')
						],
						[
							field('Reviewed at', data.header.reviewedAt || 'N/A'),
							field('Ward / location', data.header.ward || 'N/A')
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
							field('Identifier', data.identification.patientIdentifier || 'N/A'),
							field('Admission date', data.identification.admissionDate || 'N/A')
						],
						[
							field('Primary diagnosis', data.identification.primaryDiagnosis || 'N/A'),
							field('', '')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Key review findings'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field(
								'Latest NEWS2',
								data.examination.news2Total === null ? 'N/A' : String(data.examination.news2Total)
							),
							field('Observation trend', observationTrendLabel(data.examination.observationTrend) || 'N/A')
						],
						[
							field('VTE assessment', vteStatusLabel(data.vte.vteStatus) || 'N/A'),
							field('Escalation status', escalationStatusLabel(data.escalation.escalationStatus) || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Review component presence'),
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

			...(data.summary.clinicalNote
				? [
						sectionHeader('Clinical note'),
						{
							text: data.summary.clinicalNote,
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
