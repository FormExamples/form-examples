import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { PulmonaryFunctionTestRequest, GradingResult } from '$lib/engine/types';
import {
	testTypeLabel,
	indicationLabel,
	smokingStatusLabel,
	settingLabel,
	appropriatenessLabel,
	contraindicationLabel,
	triageTierLabel,
	recommendationLabel
} from '$lib/engine/utils';

type Margin = [number, number, number, number];

/** Builds the pdfmake document definition for the lung-function vetting report. */
export function buildPdfDocument(
	data: PulmonaryFunctionTestRequest,
	result: GradingResult
): TDocumentDefinitions {
	const triageColor =
		result.triageTier === 'routine'
			? '#16a34a'
			: result.triageTier === 'urgent'
				? '#d97706'
				: '#4b5563';

	const patientName = `${data.patient.firstName} ${data.patient.lastName}`.trim();

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'PULMONARY FUNCTION TEST REQUEST — VETTING REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.gradedAt).toLocaleString()} | NICE NG80 / NG115 · ARTP / ERS-ATS`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: 'PULMONARY FUNCTION TEST REQUEST',
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
							field('B. Safety / contraindication', contraindicationLabel(result.contraindicationBand))
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
							field('Patient', patientName || 'N/A'),
							field('NHS number', data.patient.nhsNumber || 'N/A')
						],
						[
							field('Date of birth', data.patient.dateOfBirth || 'N/A'),
							field(
								'Height / weight',
								`${data.patient.heightCm ?? 'N/A'} cm / ${data.patient.weightKg ?? 'N/A'} kg`
							)
						],
						[
							field('Requesting clinician', data.clinician.clinicianName || 'N/A'),
							field('Site', data.clinician.siteName || 'N/A')
						],
						[
							field('Referral date', data.clinician.referralDate || 'N/A'),
							field('Setting', settingLabel(data.triage.setting))
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as Margin
			},

			// Indication and question
			sectionHeader('Indication and clinical question'),
			{ text: `Clinical question: ${data.request.clinicalQuestion || 'Not specified'}`, margin: [0, 0, 0, 4] as Margin },
			{ text: `Relevant history: ${data.request.relevantHistory || 'Not specified'}`, margin: [0, 0, 0, 16] as Margin },

			// Symptoms and background
			sectionHeader('Symptoms and background'),
			{ ul: symptomList(data), margin: [0, 0, 0, 4] as Margin },
			{ text: `Smoking status: ${smokingStatusLabel(data.background.smokingStatus)}`, margin: [0, 0, 0, 2] as Margin },
			{ text: `Current inhalers: ${data.background.currentInhalers || 'None recorded'}`, margin: [0, 0, 0, 16] as Margin },

			// Safety screen
			sectionHeader('Safety screen'),
			{
				ul: [
					`Recent MI / eye / thoracic / abdominal surgery: ${data.safety.recentMiOrEyeAbdominalSurgery ? 'Yes' : 'No'}`,
					`Haemoptysis of unknown origin: ${data.safety.haemoptysis ? 'Yes' : 'No'}`,
					`Suspected active tuberculosis: ${data.safety.suspectedActiveTuberculosis ? 'Yes' : 'No'}`,
					`Recent / active respiratory infection: ${data.safety.recentRespiratoryInfection ? 'Yes' : 'No'}`
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

function symptomList(data: PulmonaryFunctionTestRequest): string[] {
	const list: string[] = [];
	if (data.symptoms.breathlessness) list.push('Breathlessness');
	if (data.symptoms.cough) list.push('Cough');
	if (data.symptoms.wheeze) list.push('Wheeze');
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
