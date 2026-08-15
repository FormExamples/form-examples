import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { EegRequest, GradingResult } from '#lib/engine/types.js';
import {
	eegTypeLabel,
	indicationLabel,
	settingLabel,
	appropriatenessLabel,
	triageTierLabel,
	priorityBandLabel,
	recommendationLabel
} from '#lib/engine/utils.js';

type Margin = [number, number, number, number];

/** Builds the pdfmake document definition for the EEG vetting report. */
export function buildPdfDocument(data: EegRequest, result: GradingResult): TDocumentDefinitions {
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
			text: 'ELECTROENCEPHALOGRAM (EEG) TEST REQUEST — VETTING REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.gradedAt).toLocaleString()} | NICE NG217 / ILAE`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: 'EEG TEST REQUEST',
				fontSize: 18,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4] as Margin
			},
			{
				text: `${eegTypeLabel(data.request.eegType)} — ${indicationLabel(data.request.primaryIndication)}`,
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
							field('B. Triage priority', triageTierLabel(result.triageTier))
						],
						[
							field('C. Request completeness', `${result.completenessPercent}%`),
							field('D. Clinical priority', priorityBandLabel(result.priorityBand))
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
							field('Patient', patientName || 'N/A'),
							field('NHS number', data.patient.nhsNumber || 'N/A')
						],
						[
							field('Requesting clinician', data.clinician.clinicianName || 'N/A'),
							field('Site', data.clinician.siteName || 'N/A')
						],
						[
							field('Setting', settingLabel(data.triage.setting)),
							field('Requested urgency', triageTierLabel(data.triage.urgency))
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

			// Seizure context
			sectionHeader('Seizure / epilepsy context'),
			{
				ul: [
					`First seizure: ${data.context.firstSeizure ? 'Yes' : 'No'}`,
					`Known epilepsy: ${data.context.knownEpilepsy ? 'Yes' : 'No'}`,
					`Seizure frequency: ${data.context.seizureFrequency || 'Not recorded'}`,
					`Current antiepileptics: ${data.context.currentAntiepileptics || 'None recorded'}`
				],
				margin: [0, 0, 0, 16] as Margin
			},

			// Red flags
			sectionHeader('Red flags'),
			{
				ul: [
					`Suspected status epilepticus: ${data.redFlags.suspectedStatusEpilepticus ? 'Yes' : 'No'}`,
					`Recent seizure: ${data.redFlags.recentSeizure ? 'Yes' : 'No'}`
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
