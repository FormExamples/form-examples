import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { EcgRequest, GradingResult } from '$lib/engine/types';
import {
	appropriatenessLabel,
	triageTierLabel,
	priorityLabel,
	recommendationLabel,
	ecgTypeLabel,
	indicationLabel,
	knownArrhythmiaLabel,
	settingLabel,
	urgencyLabel
} from '$lib/engine/utils';

type Margin = [number, number, number, number];

/** Builds the pdfmake document definition for the ECG vetting report. */
export function buildPdfDocument(
	data: EcgRequest,
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
			text: 'ELECTROCARDIOGRAM TEST REQUEST — VETTING REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.gradedAt).toLocaleString()} | NICE CG95 / NG185 — AHA/ACC ECG-use guidance`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: 'ELECTROCARDIOGRAM TEST REQUEST',
				fontSize: 18,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4] as Margin
			},
			{
				text: `${ecgTypeLabel(data.request.ecgType)} — ${indicationLabel(data.request.primaryIndication)}`,
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
							field('B. Urgency / triage', triageTierLabel(result.triageTier))
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

			// Patient and clinician
			sectionHeader('Patient and requesting clinician'),
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
							field('Role', data.clinician.clinicianRole || 'N/A')
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
			sectionHeader('Requested examination and clinical question'),
			{ text: `ECG type: ${ecgTypeLabel(data.request.ecgType)}`, margin: [0, 0, 0, 4] as Margin },
			{ text: `Clinical question: ${data.request.clinicalQuestion || 'Not specified'}`, margin: [0, 0, 0, 4] as Margin },
			{ text: `Relevant history: ${data.request.relevantHistory || 'Not specified'}`, margin: [0, 0, 0, 16] as Margin },

			// Symptoms and red flags
			sectionHeader('Symptoms and red flags'),
			{ ul: symptomList(data), margin: [0, 0, 0, 16] as Margin },

			// Medications
			sectionHeader('Medications'),
			{ text: `Relevant medications: ${data.medications.relevantMedications || 'None recorded'}`, margin: [0, 0, 0, 16] as Margin },

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

function symptomList(data: EcgRequest): string[] {
	const list: string[] = [];
	if (data.symptoms.symptomChestPain) list.push('Chest pain');
	if (data.symptoms.symptomPalpitations) list.push('Palpitations');
	if (data.symptoms.symptomSyncope) list.push('Syncope / blackout');
	if (data.symptoms.symptomBreathlessness) list.push('Breathlessness');
	if (data.symptoms.symptomDizziness) list.push('Dizziness');
	if (data.symptoms.currentlySymptomatic) list.push('Currently symptomatic');
	if (data.symptoms.suspectedAcs) list.push('Suspected acute coronary syndrome');
	if (data.symptoms.knownArrhythmia && data.symptoms.knownArrhythmia !== 'none')
		list.push(`Known / suspected arrhythmia: ${knownArrhythmiaLabel(data.symptoms.knownArrhythmia)}`);
	if (list.length === 0) list.push('No symptoms or red flags recorded');
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
