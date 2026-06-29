import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { HolterRequest, GradingResult } from '$lib/engine/types';
import {
	appropriatenessLabel,
	triageTierLabel,
	priorityLabel,
	recommendationLabel,
	monitorTypeLabel,
	indicationLabel,
	frequencyLabel,
	arrhythmiaLabel,
	settingLabel
} from '$lib/engine/utils';

type Margin = [number, number, number, number];

/** Builds the pdfmake document definition for the Holter monitor vetting report. */
export function buildPdfDocument(
	data: HolterRequest,
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

	const patientName = `${data.patient.firstName} ${data.patient.lastName}`.trim();

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'HOLTER MONITOR TEST REQUEST — VETTING REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.gradedAt).toLocaleString()} | ACC/AHA · ISHNE-HRS · NICE NG196 · ESC syncope`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: 'HOLTER MONITOR TEST REQUEST',
				fontSize: 18,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4] as Margin
			},
			{
				text: `${monitorTypeLabel(data.request.monitorType)} — ${indicationLabel(data.request.primaryIndication)}`,
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
							field('D. Clinical priority', priorityLabel(result.priorityBand))
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
						[field('Patient', patientName || 'N/A'), field('NHS number', data.patient.nhsNumber || 'N/A')],
						[
							field('Requesting clinician', data.clinician.clinicianName || 'N/A'),
							field('Site', data.clinician.siteName || 'N/A')
						],
						[
							field('Setting', settingLabel(data.triage.setting)),
							field('Requested urgency', data.triage.urgency || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as Margin
			},

			// Indication and question
			sectionHeader('Indication and clinical question'),
			{ text: `Symptom frequency: ${frequencyLabel(data.symptoms.symptomFrequency)}`, margin: [0, 0, 0, 4] as Margin },
			{ text: `Clinical question: ${data.request.clinicalQuestion || 'Not specified'}`, margin: [0, 0, 0, 4] as Margin },
			{ text: `Relevant history: ${data.request.relevantHistory || 'Not specified'}`, margin: [0, 0, 0, 16] as Margin },

			// Symptoms
			sectionHeader('Symptoms'),
			{ ul: symptomList(data), margin: [0, 0, 0, 16] as Margin },

			// Cardiac context and red flags
			sectionHeader('Cardiac context and red flags'),
			{
				ul: [
					`Known arrhythmia: ${arrhythmiaLabel(data.cardiac.knownArrhythmia)}`,
					`Recent stroke / TIA: ${data.cardiac.recentStrokeTia ? 'Yes' : 'No'}`,
					`Relevant medications: ${data.cardiac.relevantMedications || 'None recorded'}`
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

function symptomList(data: HolterRequest): string[] {
	const list: string[] = [];
	if (data.symptoms.palpitations) list.push('Palpitations');
	if (data.symptoms.syncope) list.push('Syncope / blackout');
	if (data.symptoms.presyncope) list.push('Presyncope / near-syncope');
	if (data.symptoms.breathlessness) list.push('Breathlessness');
	if (list.length === 0) list.push('No symptoms recorded');
	return list;
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
