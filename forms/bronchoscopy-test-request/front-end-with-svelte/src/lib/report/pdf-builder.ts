import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { BronchoscopyRequest, GradingResult } from '$lib/engine/types';
import {
	appropriatenessLabel,
	triageTierLabel,
	riskBandLabel,
	recommendationLabel,
	procedureLabel,
	indicationLabel
} from '$lib/engine/utils';

type Margin = [number, number, number, number];

/** Builds the pdfmake document definition for the bronchoscopy vetting report. */
export function buildPdfDocument(
	data: BronchoscopyRequest,
	result: GradingResult
): TDocumentDefinitions {
	const triageColor =
		result.triageTier === 'routine'
			? '#16a34a'
			: result.triageTier === 'emergency'
				? '#dc2626'
				: result.triageTier === 'two-week-wait'
					? '#2563eb'
					: result.triageTier === 'urgent'
						? '#d97706'
						: '#4b5563';

	const patientName = [data.patient.firstName, data.patient.lastName].filter(Boolean).join(' ');

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'BRONCHOSCOPY REQUEST — VETTING REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.gradedAt).toLocaleString()} | BTS bronchoscopy / NICE NG12`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: 'BRONCHOSCOPY TEST REQUEST',
				fontSize: 18,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4] as Margin
			},
			{
				text: `${procedureLabel(data.request.procedure)} — ${indicationLabel(data.request.primaryIndication)}`,
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
							field('B. Cancer-pathway urgency', triageTierLabel(result.triageTier))
						],
						[
							field('C. Request completeness', `${result.completenessPercent}%`),
							field('D. Pre-procedure risk', riskBandLabel(result.riskBand))
						],
						[
							field('Target timeframe', result.targetTimeframe || 'N/A'),
							field('Recommendation', recommendationLabel(result.recommendation))
						],
						[
							field('Two-week-wait eligible', result.twoWeekWaitEligible ? 'Yes' : 'No'),
							field('Anticoagulant action', result.anticoagulantAction)
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
							field('Referral date', data.clinician.referralDate || 'N/A')
						],
						[
							field('Site / clinic', data.clinician.siteName || 'N/A'),
							field('Setting', data.triage.setting || 'N/A')
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

			// Symptoms and imaging
			sectionHeader('Symptoms and imaging'),
			{ ul: symptomList(data), margin: [0, 0, 0, 4] as Margin },
			{
				text: `Imaging findings: ${data.symptoms.imagingFindings || 'None recorded'}`,
				margin: [0, 0, 0, 16] as Margin
			},

			// Bleeding and procedural risk
			sectionHeader('Bleeding and procedural risk'),
			{
				ul: [
					`Anticoagulant: ${data.bleeding.takingAnticoagulant ? `Yes${data.bleeding.anticoagulantAgent ? ` (${data.bleeding.anticoagulantAgent})` : ''}` : 'No'}`,
					`Antiplatelet: ${data.bleeding.takingAntiplatelet ? `Yes${data.bleeding.antiplateletAgent ? ` (${data.bleeding.antiplateletAgent})` : ''}` : 'No'}`,
					`Platelet count: ${data.bleeding.plateletCount ?? 'N/A'} x10^9/L`,
					`Oxygen-dependent (hypoxia): ${data.procedural.oxygenDependent ? 'Yes' : 'No'}`,
					`Haemodynamically unstable: ${data.procedural.haemodynamicallyUnstable ? 'Yes' : 'No'}`,
					`ASA grade: ${data.procedural.asaGrade || 'N/A'}`,
					`Planned sedation: ${data.procedural.sedation || 'N/A'}`
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

function symptomList(data: BronchoscopyRequest): string[] {
	const list: string[] = [];
	if (data.symptoms.symptomHaemoptysis)
		list.push(
			`Haemoptysis${data.symptoms.haemoptysisSeverity ? ` (${data.symptoms.haemoptysisSeverity})` : ''}`
		);
	if (data.symptoms.symptomCough) list.push('Cough');
	if (data.symptoms.symptomBreathlessness) list.push('Breathlessness');
	if (data.symptoms.symptomWeightLoss) list.push('Unexplained weight loss');
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
