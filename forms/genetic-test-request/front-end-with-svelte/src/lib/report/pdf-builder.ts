import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { GeneticTestRequest, GradingResult } from '#lib/engine/types.js';
import {
	appropriatenessLabel,
	consentLabel,
	triageTierLabel,
	recommendationLabel,
	testTypeLabel,
	indicationLabel,
	patientName
} from '#lib/engine/utils.js';

type Margin = [number, number, number, number];

/** Builds the pdfmake document definition for the genetic test request report. */
export function buildPdfDocument(
	data: GeneticTestRequest,
	result: GradingResult
): TDocumentDefinitions {
	const triageColor =
		result.triageTier === 'routine'
			? '#16a34a'
			: result.triageTier === 'urgent'
				? '#d97706'
				: '#4b5563';

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'GENETIC TEST REQUEST — VETTING REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.gradedAt).toLocaleString()} | NHS National Genomic Test Directory`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: 'GENETIC TEST REQUEST',
				fontSize: 18,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4] as Margin
			},
			{
				text: `${testTypeLabel(data.request.testType)} — ${indicationLabel(data.request.primaryIndication)}`,
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
								`${appropriatenessLabel(result.appropriatenessBand)} (${result.appropriatenessScore}/9)`
							),
							field('B. Consent & counselling', consentLabel(result.consentCounsellingBand))
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
							field('Patient', patientName(data) || 'N/A'),
							field('NHS number', data.patient.nhsNumber || 'N/A')
						],
						[
							field('Requesting clinician', data.clinician.clinicianName || 'N/A'),
							field('Referral date', data.clinician.referralDate || 'N/A')
						],
						[
							field('Requesting site', data.clinician.siteName || 'N/A'),
							field('Care setting', data.triage.setting || 'N/A')
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
				text: `Clinical details / phenotype: ${data.clinical.clinicalDetails || 'Not specified'}`,
				margin: [0, 0, 0, 4] as Margin
			},
			{
				text: `Suspected condition: ${data.clinical.suspectedCondition || 'Not specified'}`,
				margin: [0, 0, 0, 4] as Margin
			},
			{
				text: `Family history: ${data.clinical.familyHistory || 'Not specified'}`,
				margin: [0, 0, 0, 16] as Margin
			},

			// Consent
			sectionHeader('Consent and counselling'),
			{
				ul: [
					`Informed consent obtained: ${data.consent.consentObtained ? 'Yes' : 'No'}`,
					`Pre-test genetic counselling offered: ${data.consent.geneticCounsellingOffered ? 'Yes' : 'No'}`,
					`Affected relative already tested: ${data.clinical.affectedRelativeTested ? 'Yes' : 'No'}`
				],
				margin: [0, 0, 0, 16] as Margin
			},

			// Specimen
			sectionHeader('Specimen and triage'),
			{
				ul: [
					`Specimen type: ${data.triage.specimenType || 'N/A'}`,
					`Requested urgency: ${data.triage.urgency || 'N/A'}`
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
