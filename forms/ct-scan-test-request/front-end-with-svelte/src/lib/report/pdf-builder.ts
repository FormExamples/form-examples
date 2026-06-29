import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { CtScanRequest, GradingResult } from '$lib/engine/types';
import {
	appropriatenessLabel,
	contrastSafetyLabel,
	doseLabel,
	triageTierLabel,
	recommendationLabel,
	bodyRegionLabel,
	indicationLabel,
	contrastLabel
} from '$lib/engine/utils';

type Margin = [number, number, number, number];

/** Builds the pdfmake document definition for the CT scan vetting report. */
export function buildPdfDocument(data: CtScanRequest, result: GradingResult): TDocumentDefinitions {
	const triageColor =
		result.triageTier === 'routine'
			? '#16a34a'
			: result.triageTier === 'emergency'
				? '#dc2626'
				: result.triageTier === 'urgent'
					? '#d97706'
					: '#4b5563';

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'CT SCAN REQUEST — VETTING REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.gradedAt).toLocaleString()} | ACR / RCR iRefer / ESUR / IR(ME)R 2017`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: 'CT SCAN TEST REQUEST',
				fontSize: 18,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4] as Margin
			},
			{
				text: `${bodyRegionLabel(data.request.bodyRegion)} — ${indicationLabel(data.request.primaryIndication)}`,
				fontSize: 12,
				alignment: 'center',
				color: '#4b5563',
				margin: [0, 0, 0, 4] as Margin
			},
			{
				text: `Triage: ${triageTierLabel(result.triageTier)} (${result.targetTimeframe})`,
				fontSize: 14,
				bold: true,
				alignment: 'center',
				color: triageColor,
				margin: [0, 0, 0, 16] as Margin
			},

			// Four-axis vetting grade
			sectionHeader('Vetting grade (four axes)'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field(
								'A. Appropriateness',
								`${result.appropriatenessScore}/9 — ${appropriatenessLabel(result.appropriatenessBand)}`
							),
							field('B. Contrast safety', contrastSafetyLabel(result.contrastSafetyBand))
						],
						[
							field('B. Estimated dose', doseLabel(result.estimatedDoseBand)),
							field('B. Renal risk', result.renalRisk ? 'Yes' : 'No')
						],
						[
							field('C. Request completeness', `${result.completenessPercent}%`),
							field('D. Triage priority', triageTierLabel(result.triageTier))
						],
						[
							field('Target timeframe', result.targetTimeframe || 'N/A'),
							field('Recommendation', recommendationLabel(result.recommendation))
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as Margin
			},

			// Patient and requester
			sectionHeader('Patient and requester'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Patient', `${data.patient.firstName} ${data.patient.lastName}`.trim() || 'N/A'),
							field('NHS number', data.patient.nhsNumber || 'N/A')
						],
						[
							field('Requesting clinician', data.clinician.clinicianName || 'N/A'),
							field('Referral date', data.clinician.referralDate || 'N/A')
						],
						[
							field('Site', data.clinician.siteName || 'N/A'),
							field('Setting', data.triage.setting || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as Margin
			},

			// Examination and question
			sectionHeader('Examination and clinical question'),
			{ text: `Body region: ${bodyRegionLabel(data.request.bodyRegion)}`, margin: [0, 0, 0, 4] as Margin },
			{ text: `Indication: ${indicationLabel(data.request.primaryIndication)}`, margin: [0, 0, 0, 4] as Margin },
			{ text: `Clinical question: ${data.request.clinicalQuestion || 'Not specified'}`, margin: [0, 0, 0, 4] as Margin },
			{ text: `Relevant history: ${data.context.relevantHistory || 'Not specified'}`, margin: [0, 0, 0, 4] as Margin },
			{ text: `Relevant previous imaging: ${data.context.relevantPreviousImaging || 'Not specified'}`, margin: [0, 0, 0, 16] as Margin },

			// Contrast & renal safety
			sectionHeader('Contrast and renal safety'),
			{
				ul: [
					`Contrast required: ${contrastLabel(data.contrast.contrastRequired)}`,
					`eGFR: ${data.contrast.egfr ?? 'Not recorded'} mL/min/1.73m2`,
					`Iodinated-contrast allergy: ${data.contrast.iodineContrastAllergy ? 'Yes' : 'No'}`,
					`Previous contrast reaction: ${data.contrast.previousContrastReaction || 'None recorded'}`,
					`Metformin: ${data.contrast.metformin ? 'Yes' : 'No'}`,
					`Diabetes: ${data.contrast.diabetes ? 'Yes' : 'No'}`,
					`Known renal impairment: ${data.contrast.renalImpairment ? 'Yes' : 'No'}`
				],
				margin: [0, 0, 0, 16] as Margin
			},

			// Radiation safety
			sectionHeader('Radiation safety (IR(ME)R)'),
			{ text: `Pregnancy status: ${data.radiation.pregnancyStatus || 'Not recorded'}`, margin: [0, 0, 0, 4] as Margin },
			{ text: `IR(ME)R justification: ${data.radiation.irMeRJustification || 'Not recorded'}`, margin: [0, 0, 0, 16] as Margin },

			// Flags
			...(result.flags.length > 0
				? [
						sectionHeader('Safety flags'),
						{
							ul: result.flags.map((f) => ({
								text: `[${f.priority.toUpperCase()}] ${f.category}: ${f.description} — ${f.suggestedAction}`,
								color:
									f.priority === 'high' ? '#dc2626' : f.priority === 'medium' ? '#d97706' : '#4b5563',
								margin: [0, 2, 0, 2] as Margin
							})),
							margin: [0, 0, 0, 16] as Margin
						}
					]
				: []),

			// Fired rules
			...(result.firedRules.length > 0
				? [
						sectionHeader('Fired rules (audit trail)'),
						{
							ul: result.firedRules.map((r) => ({
								text: `[${r.axis}] ${r.ruleId}: ${r.description}`,
								margin: [0, 2, 0, 2] as Margin
							})),
							margin: [0, 0, 0, 16] as Margin
						}
					]
				: []),

			// Notes
			...(data.triage.notes
				? [sectionHeader('Notes'), { text: data.triage.notes, margin: [0, 0, 0, 8] as Margin }]
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
		margin: [0, 8, 0, 8] as Margin
	};
}

function field(label: string, value: string) {
	return {
		text: [
			{ text: `${label}: `, bold: true, color: '#6b7280' },
			{ text: value }
		],
		margin: [0, 4, 0, 4] as Margin
	};
}
