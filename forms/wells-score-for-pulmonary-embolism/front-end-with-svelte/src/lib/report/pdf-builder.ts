import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '$lib/engine/types';
import {
	twoLevelBandLabel,
	threeLevelBandLabel,
	recommendedPathwayLabel,
	priorityLabel,
	careSettingLabel,
	clinicianRoleLabel,
	sexLabel,
	ageBandLabel,
	haemodynamicStatusLabel,
	yesNoLabel
} from '$lib/engine/utils';

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	const heartRateText =
		data.observations.heartRate === null
			? 'Not recorded'
			: `${data.observations.heartRate} bpm`;
	const heartRatePresent =
		data.observations.heartRate !== null && data.observations.heartRate > 100 ? 'Yes' : 'No';

	const criteriaRows: [string, string, string][] = [
		['1. Clinical signs and symptoms of DVT', yesNoLabel(data.criteria.dvtSigns), '+3'],
		['2. PE is the #1 diagnosis or equally likely', yesNoLabel(data.criteria.peMostLikely), '+3'],
		[`3. Heart rate > 100 (${heartRateText})`, heartRatePresent, '+1.5'],
		[
			'4. Immobilisation >= 3 days or surgery <= 4 weeks',
			yesNoLabel(data.criteria.immobilisationSurgery),
			'+1.5'
		],
		['5. Previous, objectively diagnosed DVT or PE', yesNoLabel(data.criteria.previousDvtPe), '+1.5'],
		['6. Haemoptysis', yesNoLabel(data.criteria.haemoptysis), '+1'],
		['7. Malignancy (on treatment, <= 6 months, or palliative)', yesNoLabel(data.criteria.malignancy), '+1']
	];

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'WELLS SCORE FOR PE — ASSESSMENT REPORT',
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
				text: `Wells score: ${result.wellsScore}`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `${twoLevelBandLabel(result.twoLevelBand)}  •  ${threeLevelBandLabel(result.threeLevelBand)}`,
				fontSize: 12,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 4] as [number, number, number, number]
			},
			{
				text: `Recommended pathway: ${recommendedPathwayLabel(result.recommendedPathway)}`,
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
							field('Clinician', data.context.clinicianName || 'N/A'),
							field('Role', clinicianRoleLabel(data.context.clinicianRole) || 'N/A')
						],
						[
							field('Care setting', careSettingLabel(data.context.careSetting) || 'N/A'),
							field('Assessed at', data.context.assessedAt || 'N/A')
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
							field('Age band', ageBandLabel(data.identification.ageBand) || 'N/A')
						],
						[
							field('Sex', sexLabel(data.identification.sex) || 'N/A'),
							field(
								'Haemodynamic status',
								haemodynamicStatusLabel(data.haemodynamic.haemodynamicStatus) || 'N/A'
							)
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Criteria'),
			{
				table: {
					headerRows: 1,
					widths: ['*', 'auto', 'auto'],
					body: [
						[
							{ text: 'Criterion', bold: true, fontSize: 9 },
							{ text: 'Present', bold: true, fontSize: 9 },
							{ text: 'Points', bold: true, fontSize: 9 }
						],
						...criteriaRows.map((r) => [
							{ text: r[0], fontSize: 9 },
							{ text: r[1], fontSize: 9 },
							{ text: r[2], fontSize: 9, bold: true }
						])
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

			...(data.note.clinicalNotes
				? [
						sectionHeader('Clinical note'),
						{
							text: data.note.clinicalNotes,
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
