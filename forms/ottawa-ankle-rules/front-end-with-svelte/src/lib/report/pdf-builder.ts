import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '$lib/engine/types';
import {
	decisionLabel,
	decisionSummaryLabel,
	priorityLabel,
	careSettingLabel,
	clinicianRoleLabel,
	injuredSideLabel,
	sexLabel,
	yesNoLabel
} from '$lib/engine/utils';

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	// [criterion, region, answer]
	const criteriaRows: [string, string, string][] = [
		[
			'Malleolar-zone pain (ankle precondition)',
			'Ankle',
			yesNoLabel(data.painZones.malleolarZonePain)
		],
		[
			'A1 - Lateral malleolus tenderness',
			'Ankle',
			yesNoLabel(data.ankleTenderness.lateralMalleolusTenderness)
		],
		[
			'A2 - Medial malleolus tenderness',
			'Ankle',
			yesNoLabel(data.ankleTenderness.medialMalleolusTenderness)
		],
		[
			'Midfoot-zone pain (foot precondition)',
			'Foot',
			yesNoLabel(data.painZones.midfootZonePain)
		],
		[
			'F1 - Fifth-metatarsal-base tenderness',
			'Foot',
			yesNoLabel(data.footTenderness.fifthMetatarsalBaseTenderness)
		],
		['F2 - Navicular tenderness', 'Foot', yesNoLabel(data.footTenderness.navicularTenderness)],
		[
			'Able to bear weight immediately after injury',
			'Both',
			yesNoLabel(data.weightBearing.ableToBearWeightImmediately)
		],
		[
			'Able to bear weight now, at assessment',
			'Both',
			yesNoLabel(data.weightBearing.ableToBearWeightNow)
		]
	];

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'OTTAWA ANKLE / FOOT RULES - ASSESSMENT REPORT',
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
				text: decisionSummaryLabel(result.ankleXrayIndicated, result.footXrayIndicated),
				fontSize: 22,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `Ankle: ${decisionLabel(result.ankleXrayIndicated)}  •  Foot: ${decisionLabel(result.footXrayIndicated)}`,
				fontSize: 12,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 4] as [number, number, number, number]
			},
			{
				text: `Unable to bear weight: ${result.unableToBearWeight ? 'Yes' : 'No'}`,
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
							field('Injured side', injuredSideLabel(data.context.injuredSide) || 'N/A')
						],
						[
							field('Assessed at', data.context.assessedAt || 'N/A'),
							field(
								'Hours since injury',
								data.context.hoursSinceInjury === null
									? 'N/A'
									: String(data.context.hoursSinceInjury)
							)
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
							field(
								'Age (years)',
								data.identification.ageYears === null
									? 'N/A'
									: String(data.identification.ageYears)
							)
						],
						[
							field('Sex', sexLabel(data.identification.sex) || 'N/A'),
							field('Assessment reliable', yesNoLabel(data.applicability.assessmentReliable))
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
							{ text: 'Region', bold: true, fontSize: 9 },
							{ text: 'Answer', bold: true, fontSize: 9 }
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
								text: `[${priorityLabel(f.priority)}] ${f.category}: ${f.description} - ${f.suggestedAction}`,
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
