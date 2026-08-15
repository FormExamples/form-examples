import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { BloodTestRequest, GradingResult } from '#lib/engine/types.js';
import { selectedPanels } from '#lib/engine/panels.js';
import {
	appropriatenessLabel,
	preanalyticalLabel,
	triageTierLabel,
	recommendationLabel,
	indicationLabel
} from '#lib/engine/utils.js';

type Margin = [number, number, number, number];

/** Builds the pdfmake document definition for the blood-test vetting report. */
export function buildPdfDocument(
	data: BloodTestRequest,
	result: GradingResult
): TDocumentDefinitions {
	const triageColor =
		result.triageTier === 'routine'
			? '#16a34a'
			: result.triageTier === 'stat'
				? '#dc2626'
				: result.triageTier === 'urgent'
					? '#d97706'
					: '#4b5563';

	const panelNames = selectedPanels(data.panels).map((p) => p.label);

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'BLOOD TEST REQUEST — VETTING REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.gradedAt).toLocaleString()} | RCPath G147 minimum retesting intervals`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: 'BLOOD TEST REQUEST',
				fontSize: 18,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4] as Margin
			},
			{
				text: `${indicationLabel(data.clinical.primaryIndication)} — ${result.testsSelectedCount} panel${result.testsSelectedCount === 1 ? '' : 's'} selected`,
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
								`${result.appropriatenessScore} / 9 — ${appropriatenessLabel(result.appropriatenessBand)}`
							),
							field('B. Pre-analytical / specimen', preanalyticalLabel(result.preanalyticalBand))
						],
						[
							field('C. Request completeness', `${result.completenessPercent}%`),
							field('D. Triage priority', triageTierLabel(result.triageTier))
						],
						[
							field('Fasting violation', result.fastingViolation ? 'Yes' : 'No'),
							field('Recommendation', recommendationLabel(result.recommendation))
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as Margin
			},

			// Patient and clinician
			sectionHeader('Patient and requesting clinician'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Patient', `${data.patient.firstName} ${data.patient.lastName}`.trim() || 'N/A'),
							field('NHS number', data.patient.nhsNumber || 'N/A')
						],
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

			// Requested panels
			sectionHeader('Requested panels'),
			{
				ul: panelNames.length > 0 ? panelNames : ['No panel selected'],
				margin: [0, 0, 0, 16] as Margin
			},

			// Clinical context
			sectionHeader('Clinical context'),
			{ text: `Primary indication: ${indicationLabel(data.clinical.primaryIndication)}`, margin: [0, 0, 0, 4] as Margin },
			{ text: `Clinical details: ${data.clinical.clinicalDetails || 'Not specified'}`, margin: [0, 0, 0, 4] as Margin },
			{ text: `Relevant medications: ${data.clinical.relevantMedications || 'None recorded'}`, margin: [0, 0, 0, 16] as Margin },

			// Pre-analytical and safety
			sectionHeader('Pre-analytical and safety'),
			{
				ul: [
					`Fasting required: ${data.preanalytical.fastingRequired ? 'Yes' : 'No'}`,
					`Fasting status: ${data.preanalytical.fastingStatus || 'N/A'}`,
					`Specimen collected: ${data.preanalytical.specimenCollected || 'N/A'}${data.preanalytical.collectionDate ? ` on ${data.preanalytical.collectionDate} ${data.preanalytical.collectionTime}` : ''}`,
					`Known blood-borne virus: ${data.safety.knownBloodBorneVirus ? 'Yes' : 'No'}`,
					`Difficult venous access: ${data.safety.difficultVenousAccess ? 'Yes' : 'No'}`
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
