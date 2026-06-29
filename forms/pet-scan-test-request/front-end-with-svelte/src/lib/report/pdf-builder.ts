import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { PetScanRequest, GradingResult } from '$lib/engine/types';
import {
	scanTypeLabel,
	indicationLabel,
	urgencyLabel,
	appropriatenessLabel,
	prepSafetyLabel,
	radiationDoseLabel,
	triageTierLabel,
	recommendationLabel
} from '$lib/engine/utils';

type Margin = [number, number, number, number];

/** Builds the pdfmake document definition for the PET-CT vetting report. */
export function buildPdfDocument(
	data: PetScanRequest,
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

	const patientName = [data.patient.firstName, data.patient.lastName].filter(Boolean).join(' ');

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'PET-CT SCAN REQUEST — VETTING REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.gradedAt).toLocaleString()} | ACR / RCR iRefer / EANM / SNMMI / IR(ME)R`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: 'PET SCAN TEST REQUEST',
				fontSize: 18,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4] as Margin
			},
			{
				text: `${scanTypeLabel(data.request.scanType)} — ${indicationLabel(data.request.primaryIndication)}`,
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
							field('A. Appropriateness', `${appropriatenessLabel(result.appropriatenessBand)} (${result.appropriatenessScore}/9)`),
							field('B. Preparation safety', prepSafetyLabel(result.prepSafetyBand))
						],
						[
							field('B. Radiation dose', radiationDoseLabel(result.radiationDoseBand)),
							field('C. Request completeness', `${result.completenessPercent}%`)
						],
						[
							field('D. Triage priority', `${triageTierLabel(result.triageTier)} (${result.targetTimeframe || 'N/A'})`),
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
							field('Patient', patientName || 'N/A'),
							field('NHS number', data.patient.nhsNumber || 'N/A')
						],
						[
							field('Date of birth', data.patient.dateOfBirth || 'N/A'),
							field('Setting', data.patient.setting || 'N/A')
						],
						[
							field('Requesting clinician', data.clinician.clinicianName || 'N/A'),
							field('Site', data.clinician.siteName || 'N/A')
						],
						[
							field('Requested urgency', urgencyLabel(data.justification.urgency)),
							field('Referral date', data.clinician.referralDate || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as Margin
			},

			// Examination and question
			sectionHeader('Examination and clinical question'),
			{ text: `Scan type: ${scanTypeLabel(data.request.scanType)}`, margin: [0, 0, 0, 4] as Margin },
			{ text: `Indication: ${indicationLabel(data.request.primaryIndication)}`, margin: [0, 0, 0, 4] as Margin },
			{ text: `Clinical question: ${data.request.clinicalQuestion || 'Not specified'}`, margin: [0, 0, 0, 16] as Margin },

			// Clinical context
			sectionHeader('Clinical context'),
			{
				ul: [
					`Primary tumour site: ${data.context.primaryTumourSite || 'Not specified'}`,
					`Relevant history: ${data.context.relevantHistory || 'Not specified'}`,
					`Recent chemo / radiotherapy: ${data.context.recentChemoRadiotherapy || 'Not specified'}`
				],
				margin: [0, 0, 0, 16] as Margin
			},

			// Preparation and safety
			sectionHeader('Preparation and safety'),
			{
				ul: [
					`Diabetes: ${data.preparation.diabetes ? 'Yes' : 'No'}`,
					`Blood glucose: ${data.preparation.bloodGlucoseMmolL ?? 'Not recorded'} mmol/L`,
					`Pregnancy status: ${data.preparation.pregnancyStatus || 'N/A'}`,
					`Breastfeeding: ${data.preparation.breastfeeding ? 'Yes' : 'No'}`,
					`eGFR: ${data.preparation.egfr ?? 'Not recorded'}`,
					`Claustrophobia: ${data.preparation.claustrophobia ? 'Yes' : 'No'}`
				],
				margin: [0, 0, 0, 16] as Margin
			},

			// IR(ME)R justification
			sectionHeader('IR(ME)R justification'),
			{ text: data.justification.irMeRJustification || 'Not specified', margin: [0, 0, 0, 16] as Margin },

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
