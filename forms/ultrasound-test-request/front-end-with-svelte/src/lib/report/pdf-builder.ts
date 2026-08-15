import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { GradingResult, UltrasoundRequest } from '#lib/engine/types.js';
import {
	appropriatenessLabel,
	suitabilityLabel,
	triageTierLabel,
	recommendationLabel,
	bodyRegionLabel,
	indicationLabel,
	lateralityLabel,
	settingLabel,
	urgencyLabel
} from '#lib/engine/utils.js';

type Margin = [number, number, number, number];

/** Builds the pdfmake document definition for the ultrasound vetting report. */
export function buildPdfDocument(
	data: UltrasoundRequest,
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

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'ULTRASOUND REQUEST — VETTING REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.gradedAt).toLocaleString()} | ACR Appropriateness Criteria / iRefer`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: 'ULTRASOUND TEST REQUEST',
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
							field('A. Appropriateness', `${appropriatenessLabel(result.appropriatenessBand)} (${result.appropriatenessScore}/9)`),
							field('B. Preparation / suitability', suitabilityLabel(result.suitabilityBand))
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
							field('Requesting clinician', data.clinician.clinicianName || 'N/A'),
							field('Site', data.clinician.siteName || 'N/A')
						],
						[
							field('Setting', settingLabel(data.triage.setting)),
							field('Requested urgency', urgencyLabel(data.triage.urgency))
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as Margin
			},

			// Examination and question
			sectionHeader('Requested examination'),
			{ text: `Body region: ${bodyRegionLabel(data.request.bodyRegion)} (${lateralityLabel(data.request.laterality)})`, margin: [0, 0, 0, 4] as Margin },
			{ text: `Indication: ${indicationLabel(data.request.primaryIndication)}`, margin: [0, 0, 0, 4] as Margin },
			{ text: `Clinical question: ${data.request.clinicalQuestion || 'Not specified'}`, margin: [0, 0, 0, 4] as Margin },
			{ text: `Relevant history: ${data.request.relevantHistory || 'Not specified'}`, margin: [0, 0, 0, 16] as Margin },

			// Preparation and red flags
			sectionHeader('Preparation and red flags'),
			{
				ul: [
					`Fasting required: ${data.prep.fastingRequired ? 'Yes' : 'No'}`,
					`Full bladder required: ${data.prep.fullBladderRequired ? 'Yes' : 'No'}`,
					`Suspected DVT: ${data.redFlags.suspectedDvt ? 'Yes' : 'No'}`,
					`Suspected testicular torsion: ${data.redFlags.suspectedTesticularTorsion ? 'Yes' : 'No'}`,
					`Suspected AAA: ${data.redFlags.suspectedAaa ? 'Yes' : 'No'}`
				],
				margin: [0, 0, 0, 8] as Margin
			},
			{ text: `Preparation requirements: ${result.prepRequirements || 'None'}`, margin: [0, 0, 0, 16] as Margin },

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
