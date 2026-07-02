import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '$lib/engine/types';
import {
	resultClassLabel,
	managementActionLabel,
	priorityLabel,
	clinicianRoleLabel,
	sexLabel,
	sampleAdequacyLabel,
	withinAgeRangeLabel,
	formatHb
} from '$lib/engine/utils';

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	const threshold = data.result.thresholdApplied;

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'BOWEL CANCER SCREENING (FIT) REPORT',
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
				text: resultClassLabel(result.resultClass),
				fontSize: 22,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: managementActionLabel(result.managementAction),
				fontSize: 12,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 4] as [number, number, number, number]
			},
			...(result.symptomaticPathway
				? [
						{
							text: 'Red-flag symptoms reported — urgent suspected-cancer pathway',
							fontSize: 11,
							bold: true,
							alignment: 'center' as const,
							color: '#dc2626',
							margin: [0, 0, 0, 20] as [number, number, number, number]
						}
					]
				: [{ text: '', margin: [0, 0, 0, 16] as [number, number, number, number] }]),

			sectionHeader('Assessment context'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Clinician', data.context.clinicianName || 'N/A'),
							field('Role', clinicianRoleLabel(data.context.clinicianRole) || 'N/A')
						],
						[
							field('Screening hub', data.context.screeningHub || 'N/A'),
							field('Reviewed at', data.context.reviewedAt || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Participant'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Identifier', data.identification.participantIdentifier || 'N/A'),
							field('NHS number', data.identification.nhsNumber || 'N/A')
						],
						[
							field(
								'Age',
								data.identification.participantAge === null
									? 'N/A'
									: `${data.identification.participantAge} years`
							),
							field('Sex', sexLabel(data.identification.sex) || 'N/A')
						],
						[
							field('Eligibility', withinAgeRangeLabel(data.eligibility.withinAgeRange) || 'N/A'),
							field('Invitation date', data.eligibility.invitationDate || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Kit and result'),
			{
				table: {
					headerRows: 1,
					widths: ['*', 'auto'],
					body: [
						[
							{ text: 'Item', bold: true, fontSize: 9 },
							{ text: 'Value', bold: true, fontSize: 9 }
						],
						[
							{ text: 'Kit returned', fontSize: 9 },
							{ text: data.kit.kitReturned || 'Not recorded', fontSize: 9 }
						],
						[
							{ text: 'Sample adequacy', fontSize: 9 },
							{ text: sampleAdequacyLabel(data.kit.sampleAdequacy) || 'Not recorded', fontSize: 9 }
						],
						[
							{ text: 'Faecal haemoglobin', fontSize: 9, bold: true },
							{ text: formatHb(data.result.faecalHaemoglobinUgG), fontSize: 9, bold: true }
						],
						[
							{ text: 'Programme threshold', fontSize: 9 },
							{ text: threshold === null ? 'Not recorded' : `${threshold} µg Hb/g`, fontSize: 9 }
						],
						[
							{ text: 'Assay', fontSize: 9 },
							{ text: data.result.assay || 'Not recorded', fontSize: 9 }
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
