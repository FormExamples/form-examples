import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import {
	assessmentSettingLabel,
	diabetesTypeLabel,
	neuropathyStatusLabel,
	previousAmputationLabel,
	priorityLabel,
	pulsesStatusLabel,
	referralLabel,
	reviewIntervalLabel,
	reviewPathwayLabel,
	riskLabel,
	selfCareAbilityLabel,
	statusLabel,
	ulcerSeverityLabel,
	yesNoLabel
} from '#lib/engine/utils.js';

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	const outcomeRows: [string, string][] = [
		['Review pathway', reviewPathwayLabel(result.reviewPathway) || 'N/A'],
		['Review interval', reviewIntervalLabel(result.reviewIntervalMonths)],
		['Referral', referralLabel(result.referral) || 'N/A'],
		['Right foot risk', riskLabel(result.rightFootRisk) || result.rightFootRisk],
		['Left foot risk', riskLabel(result.leftFootRisk) || result.leftFootRisk],
		['Overall risk', riskLabel(result.overallRisk) || result.overallRisk]
	];

	const footRow = (foot: AssessmentData['rightFoot']): string[] => [
		neuropathyStatusLabel(foot.neuropathyStatus) || '—',
		pulsesStatusLabel(foot.pulsesStatus) || '—',
		yesNoLabel(foot.deformity) || '—',
		yesNoLabel(foot.callus) || '—',
		yesNoLabel(foot.skinBreakdown) || '—',
		foot.activeUlcer === 'yes' ? `Yes (${ulcerSeverityLabel(foot.ulcerSeverity) || 'severity unset'})` : 'No',
		yesNoLabel(foot.previousUlcer) || '—',
		previousAmputationLabel(foot.previousAmputation) || '—',
		yesNoLabel(foot.suspectedCharcot) || '—'
	];

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'DIABETES PODIATRY ASSESSMENT REPORT',
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
				text: riskLabel(result.overallRisk),
				fontSize: 22,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `${reviewPathwayLabel(result.reviewPathway)} · ${referralLabel(result.referral)} · ${statusLabel(result.status)}`,
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
						[field('Assessed', data.context.assessedAt || 'N/A'), field('Setting', assessmentSettingLabel(data.context.assessmentSetting) || 'N/A')]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Patient-wide risk factors'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Diabetes type', diabetesTypeLabel(data.riskFactors.diabetesType) || 'N/A'),
							field(
								'Years since diagnosis',
								data.riskFactors.yearsSinceDiagnosis !== null ? String(data.riskFactors.yearsSinceDiagnosis) : 'N/A'
							)
						],
						[
							field('Renal replacement therapy', yesNoLabel(data.riskFactors.onRenalReplacementTherapy) || 'N/A'),
							field('Visual acuity impairment', yesNoLabel(data.riskFactors.visualAcuityImpairment) || 'N/A')
						],
						[
							field('Self-care ability', selfCareAbilityLabel(data.riskFactors.selfCareAbility) || 'N/A'),
							field('Footwear appropriate', yesNoLabel(data.riskFactors.footwearAppropriate) || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Per-foot examination'),
			{
				table: {
					headerRows: 1,
					widths: ['auto', '*', '*', 'auto', 'auto', 'auto', '*', 'auto', 'auto', 'auto'],
					body: [
						[
							{ text: 'Foot', fontSize: 8, bold: true },
							{ text: 'Neuropathy', fontSize: 8, bold: true },
							{ text: 'Pulses', fontSize: 8, bold: true },
							{ text: 'Deformity', fontSize: 8, bold: true },
							{ text: 'Callus', fontSize: 8, bold: true },
							{ text: 'Skin breakdown', fontSize: 8, bold: true },
							{ text: 'Active ulcer', fontSize: 8, bold: true },
							{ text: 'Previous ulcer', fontSize: 8, bold: true },
							{ text: 'Previous amputation', fontSize: 8, bold: true },
							{ text: 'Suspected Charcot', fontSize: 8, bold: true }
						],
						[{ text: 'Right', fontSize: 8, bold: true }, ...footRow(data.rightFoot).map((t) => ({ text: t, fontSize: 8 }))],
						[{ text: 'Left', fontSize: 8, bold: true }, ...footRow(data.leftFoot).map((t) => ({ text: t, fontSize: 8 }))]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Outcome'),
			{
				table: {
					headerRows: 0,
					widths: ['*', 'auto'],
					body: outcomeRows.map((row) => [
						{ text: row[0], fontSize: 9 },
						{ text: row[1], fontSize: 9, bold: true }
					])
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			...(result.flaggedIssues.length > 0
				? [
						sectionHeader(`Flagged issues (${result.flaggedIssues.length})`),
						{
							ul: result.flaggedIssues.map((f) => ({
								text: `[${priorityLabel(f.priority)}] ${f.category}: ${f.description} — ${f.suggestedAction}`,
								color: f.priority === 'high' ? '#dc2626' : f.priority === 'medium' ? '#d97706' : '#4b5563',
								margin: [0, 2, 0, 2] as [number, number, number, number]
							})),
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			...(data.note.clinicalContext
				? [
						sectionHeader('Clinical note'),
						{
							text: data.note.clinicalContext,
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
