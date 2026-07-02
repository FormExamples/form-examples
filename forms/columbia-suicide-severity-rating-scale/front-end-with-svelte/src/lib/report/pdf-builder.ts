import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '$lib/engine/types';
import {
	riskTierLabel,
	ideationLevelLabel,
	priorityLabel,
	clinicianRoleLabel,
	careSettingLabel,
	scaleVersionLabel,
	sexLabel,
	ageBandLabel,
	behaviourRecencyLabel,
	accessToMeansLabel,
	yesNoLabel
} from '$lib/engine/utils';

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'COLUMBIA SUICIDE SEVERITY RATING SCALE (C-SSRS) REPORT',
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
				text: riskTierLabel(result.riskTier),
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: ideationLevelLabel(result.ideationLevel),
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
							field('Version', scaleVersionLabel(data.context.scaleVersion) || 'N/A')
						],
						[field('Assessed at', data.context.assessedAt || 'N/A'), field('', '')]
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
						[field('Sex', sexLabel(data.identification.sex) || 'N/A'), field('', '')]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Suicidal ideation (Q1-Q5)'),
			{
				table: {
					headerRows: 1,
					widths: ['*', 'auto'],
					body: [
						[
							{ text: 'Item', bold: true, fontSize: 9 },
							{ text: 'Response', bold: true, fontSize: 9 }
						],
						ideationRow('Q1 — wish to be dead (level 1)', data.ideation.wishToBeDead),
						ideationRow(
							'Q2 — non-specific active thoughts (level 2)',
							data.ideation.nonSpecificActiveThoughts
						),
						ideationRow('Q3 — active with methods (level 3)', data.ideation.activeIdeationMethods),
						ideationRow('Q4 — active with intent (level 4)', data.ideation.activeIdeationIntent),
						ideationRow('Q5 — active with plan and intent (level 5)', data.ideation.activeIdeationPlan)
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Suicidal behaviour and lethality'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Actual attempt', yesNoLabel(data.behaviour.actualAttempt)),
							field('Interrupted attempt', yesNoLabel(data.behaviour.interruptedAttempt))
						],
						[
							field('Aborted attempt', yesNoLabel(data.behaviour.abortedAttempt)),
							field('Preparatory acts', yesNoLabel(data.behaviour.preparatoryActs))
						],
						[
							field('Non-suicidal self-injury', yesNoLabel(data.behaviour.nonSuicidalSelfInjury)),
							field('Recency', behaviourRecencyLabel(data.behaviour.behaviourRecency) || 'N/A')
						],
						[
							field(
								'Lifetime attempts',
								data.behaviour.lifetimeAttemptCount === null
									? 'N/A'
									: String(data.behaviour.lifetimeAttemptCount)
							),
							field('Access to lethal means', accessToMeansLabel(data.means.accessToLethalMeans) || 'N/A')
						],
						[
							field(
								'Actual lethality',
								data.lethality.actualLethality === null
									? 'N/A'
									: String(data.lethality.actualLethality)
							),
							field(
								'Potential lethality',
								data.lethality.potentialLethality === null
									? 'N/A'
									: String(data.lethality.potentialLethality)
							)
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Management recommendation'),
			{
				text: result.managementRecommendation,
				fontSize: 10,
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

			...(data.means.protectiveFactors
				? [
						sectionHeader('Protective factors'),
						{
							text: data.means.protectiveFactors,
							fontSize: 10,
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

function ideationRow(label: string, value: string) {
	return [
		{ text: label, fontSize: 9 },
		{ text: yesNoLabel(value as never), fontSize: 9, bold: value === 'yes' }
	];
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
