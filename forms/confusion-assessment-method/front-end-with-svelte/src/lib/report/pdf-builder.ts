import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '$lib/engine/types';
import {
	classificationLabel,
	priorityLabel,
	featureStateLabel,
	assessorRoleLabel,
	camVariantLabel,
	sexLabel,
	ageBandLabel,
	consciousnessLevelLabel,
	motoricSubtypeLabel
} from '$lib/engine/utils';

function featureStatus(positive: boolean | null): string {
	if (positive === null) return 'Not assessed';
	return positive ? 'Positive' : 'Negative';
}

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	const positives =
		result.positiveFeatures.length > 0 ? result.positiveFeatures.join(', ') : 'none';

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'CONFUSION ASSESSMENT METHOD (CAM) REPORT',
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
				text: classificationLabel(result.classification),
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `Positive features: ${positives}`,
				fontSize: 12,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 20] as [number, number, number, number]
			},

			sectionHeader('Assessor and encounter'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Assessor', data.context.assessorName || 'N/A'),
							field('Role', assessorRoleLabel(data.context.assessorRole) || 'N/A')
						],
						[
							field('Variant', camVariantLabel(data.context.camVariant) || 'N/A'),
							field('Assessed at', data.context.assessedAt || 'N/A')
						],
						[field('Ward / unit', data.context.wardUnit || 'N/A'), field('', '')]
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
							field('Motoric subtype', motoricSubtypeLabel(result.motoricSubtype) || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Features'),
			{
				table: {
					headerRows: 1,
					widths: ['*', 'auto', 'auto'],
					body: [
						[
							{ text: 'Feature', bold: true, fontSize: 9 },
							{ text: 'Recorded', bold: true, fontSize: 9 },
							{ text: 'Result', bold: true, fontSize: 9 }
						],
						[
							{ text: 'Feature 1 — acute onset and fluctuating course', fontSize: 9 },
							{ text: featureStateLabel(data.feature1.acuteOnsetFluctuating), fontSize: 9 },
							{ text: featureStatus(result.feature1Positive), fontSize: 9, bold: true }
						],
						[
							{ text: 'Feature 2 — inattention', fontSize: 9 },
							{ text: featureStateLabel(data.feature2.inattention), fontSize: 9 },
							{ text: featureStatus(result.feature2Positive), fontSize: 9, bold: true }
						],
						[
							{ text: 'Feature 3 — disorganised thinking', fontSize: 9 },
							{ text: featureStateLabel(data.feature3.disorganisedThinking), fontSize: 9 },
							{ text: featureStatus(result.feature3Positive), fontSize: 9, bold: true }
						],
						[
							{
								text: `Feature 4 — altered consciousness (${consciousnessLevelLabel(data.feature4.consciousnessLevel) || 'not recorded'})`,
								fontSize: 9
							},
							{ text: featureStateLabel(data.feature4.alteredConsciousness), fontSize: 9 },
							{ text: featureStatus(result.feature4Positive), fontSize: 9, bold: true }
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

			...(data.result.recommendedActions
				? [
						sectionHeader('Recommended actions'),
						{
							text: data.result.recommendedActions,
							fontSize: 10,
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			...(data.result.clinicalNote
				? [
						sectionHeader('Clinical note'),
						{
							text: data.result.clinicalNote,
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
