import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import {
	decisionLabel,
	priorityLabel,
	careSettingLabel,
	clinicianRoleLabel,
	injuryMechanismLabel,
	sexLabel,
	injuredSideLabel,
	yesNoLabel
} from '#lib/engine/utils.js';

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	const ageAtLeast55 = data.age.ageYears != null && data.age.ageYears >= 55;
	const criteriaRows: [string, string, string][] = [
		[
			'1. Age 55 years or older',
			data.age.ageYears != null ? String(data.age.ageYears) : 'Not recorded',
			ageAtLeast55 ? 'Present' : 'Absent'
		],
		[
			'2. Isolated patellar tenderness',
			`Patellar ${yesNoLabel(data.tenderness.patellarTenderness)} / other bony ${yesNoLabel(data.tenderness.otherBonyTenderness)}`,
			result.isolatedPatellarCriterion ? 'Present' : 'Absent'
		],
		[
			'3. Fibular head tenderness',
			yesNoLabel(data.tenderness.fibularHeadTenderness),
			result.fibularHeadCriterion ? 'Present' : 'Absent'
		],
		[
			'4. Unable to flex the knee to 90 degrees',
			yesNoLabel(data.flexion.unableToFlex90),
			result.flexionCriterion ? 'Present' : 'Absent'
		],
		[
			'5. Unable to bear weight (four steps)',
			yesNoLabel(data.weightBearing.unableToBearWeight),
			result.weightBearingCriterion ? 'Present' : 'Absent'
		]
	];

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'OTTAWA KNEE RULE — ASSESSMENT REPORT',
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
				text: decisionLabel(result.decision),
				fontSize: 22,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: result.xrayIndicated
					? 'One or more Ottawa Knee Rule criteria are present (ANY-of).'
					: 'All five Ottawa Knee Rule criteria are absent.',
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
						],
						[
							field('Injury mechanism', injuryMechanismLabel(data.context.injuryMechanism) || 'N/A'),
							field(
								'Hours since injury',
								data.context.hoursSinceInjury != null
									? String(data.context.hoursSinceInjury)
									: 'N/A'
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
							field('Sex', sexLabel(data.identification.sex) || 'N/A')
						],
						[
							field('Injured side', injuredSideLabel(data.identification.injuredSide) || 'N/A'),
							field('Age (years)', data.age.ageYears != null ? String(data.age.ageYears) : 'N/A')
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
							{ text: 'Finding', bold: true, fontSize: 9 },
							{ text: 'State', bold: true, fontSize: 9 }
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
