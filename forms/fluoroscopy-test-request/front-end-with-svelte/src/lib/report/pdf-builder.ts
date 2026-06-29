import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { FluoroscopyRequest, GradingResult } from '$lib/engine/types';
import {
	appropriatenessLabel,
	safetyLabel,
	radiationDoseLabel,
	triageTierLabel,
	recommendationLabel,
	studyTypeLabel,
	indicationLabel
} from '$lib/engine/utils';

type Margin = [number, number, number, number];

/** Builds the pdfmake document definition for the fluoroscopy vetting report. */
export function buildPdfDocument(
	data: FluoroscopyRequest,
	result: GradingResult
): TDocumentDefinitions {
	const triageColor =
		result.triageTier === 'routine'
			? '#16a34a'
			: result.triageTier === 'emergency'
				? '#dc2626'
				: result.triageTier === 'urgent'
					? '#d97706'
					: '#4b5563';

	const patientName =
		[data.patient.firstName, data.patient.lastName].filter(Boolean).join(' ') || 'N/A';

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'FLUOROSCOPY REQUEST — VETTING REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.gradedAt).toLocaleString()} | ACR / RCR iRefer / IR(ME)R`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: 'FLUOROSCOPY TEST REQUEST',
				fontSize: 18,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4] as Margin
			},
			{
				text: `${studyTypeLabel(data.request.studyType)} — ${indicationLabel(data.request.primaryIndication)}`,
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
							field('A. Appropriateness', appropriatenessLabel(result.appropriatenessBand)),
							field('B. Safety', safetyLabel(result.safetyBand))
						],
						[
							field('B. Radiation dose', radiationDoseLabel(result.radiationDoseBand)),
							field('C. Request completeness', `${result.completenessPercent}%`)
						],
						[
							field('D. Triage priority', triageTierLabel(result.triageTier)),
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
						[field('Patient', patientName), field('NHS number', data.patient.nhsNumber || 'N/A')],
						[
							field('Date of birth', data.patient.dateOfBirth || 'N/A'),
							field('Requesting clinician', data.clinician.clinicianName || 'N/A')
						],
						[
							field('Site', data.clinician.siteName || 'N/A'),
							field('Referral date', data.clinician.referralDate || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as Margin
			},

			// Indication and question
			sectionHeader('Indication and clinical question'),
			{
				text: `Clinical question: ${data.request.clinicalQuestion || 'Not specified'}`,
				margin: [0, 0, 0, 4] as Margin
			},
			{
				text: `Relevant history: ${data.request.relevantHistory || 'Not specified'}`,
				margin: [0, 0, 0, 16] as Margin
			},

			// Safety and radiation
			sectionHeader('Safety and radiation'),
			{
				ul: [
					`Pregnancy status: ${data.safety.pregnancyStatus || 'N/A'}`,
					`Contrast allergy: ${data.safety.contrastAllergy ? 'Yes' : 'No'}`,
					`Aspiration risk: ${data.safety.aspirationRisk ? 'Yes' : 'No'}`,
					`Diabetes: ${data.safety.diabetes ? 'Yes' : 'No'}`,
					`IR(ME)R justification: ${data.safety.irMeRJustification || 'Not specified'}`
				],
				margin: [0, 0, 0, 16] as Margin
			},

			// Flags
			...(result.flags.length > 0
				? [
						sectionHeader('Safety flags'),
						{
							ul: result.flags.map((f) => ({
								text: `[${f.priority.toUpperCase()}] ${f.category}: ${f.description} — ${f.suggestedAction}`,
								color:
									f.priority === 'high'
										? '#dc2626'
										: f.priority === 'medium'
											? '#d97706'
											: '#4b5563',
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
