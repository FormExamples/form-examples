import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { SleepStudyRequest, GradingResult } from '#lib/engine/types.js';
import {
	studyTypeLabel,
	indicationLabel,
	appropriatenessLabel,
	priorityLabel,
	triageTierLabel,
	recommendationLabel
} from '#lib/engine/utils.js';

type Margin = [number, number, number, number];

/** Builds the pdfmake document definition for the sleep-study vetting report. */
export function buildPdfDocument(
	data: SleepStudyRequest,
	result: GradingResult
): TDocumentDefinitions {
	const triageColor =
		result.triageTier === 'routine'
			? '#16a34a'
			: result.triageTier === 'urgent'
				? '#d97706'
				: '#4b5563';

	const patientName = [data.patient.firstName, data.patient.lastName].filter(Boolean).join(' ');

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'SLEEP-STUDY REQUEST — VETTING REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.gradedAt).toLocaleString()} | NICE NG202 / SIGN / DVLA`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: 'SLEEP-STUDY REQUEST',
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
							field(
								'A. Appropriateness',
								`${appropriatenessLabel(result.appropriatenessBand)} (${result.appropriatenessScore}/9)`
							),
							field('B. Clinical priority', priorityLabel(result.priorityBand))
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
							field('Patient', patientName || 'N/A'),
							field('NHS number', data.patient.nhsNumber || 'N/A')
						],
						[
							field('Requesting clinician', data.clinician.clinicianName || 'N/A'),
							field('Site', data.clinician.siteName || 'N/A')
						],
						[
							field('Requested urgency', data.triage.urgency || 'N/A'),
							field('Setting', data.triage.setting || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as Margin
			},

			// Scores
			sectionHeader('Sleep scores and anthropometry'),
			{
				ul: [
					`Epworth Sleepiness Scale: ${data.scores.epworthScore ?? 'Not recorded'}`,
					`STOP-BANG: ${data.scores.stopBangScore ?? 'Not recorded'}`,
					`Neck circumference: ${data.scores.neckCircumferenceCm != null ? `${data.scores.neckCircumferenceCm} cm` : 'Not recorded'}`,
					`Body mass index: ${data.patient.bodyMassIndex ?? 'Not recorded'}`
				],
				margin: [0, 0, 0, 16] as Margin
			},

			// Indication and question
			sectionHeader('Indication and clinical question'),
			{ text: `Clinical question: ${data.request.clinicalQuestion || 'Not specified'}`, margin: [0, 0, 0, 4] as Margin },
			{ text: `Relevant history: ${data.request.relevantHistory || 'Not specified'}`, margin: [0, 0, 0, 16] as Margin },

			// Symptoms and risk
			sectionHeader('Symptoms and risk factors'),
			{ ul: symptomList(data), margin: [0, 0, 0, 16] as Margin },

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

function symptomList(data: SleepStudyRequest): string[] {
	const list: string[] = [];
	if (data.symptoms.witnessedApnoeas) list.push('Witnessed apnoeas');
	if (data.symptoms.occupationalDriver) list.push('Occupational / vocational driver');
	if (data.symptoms.cardiovascularDisease) list.push('Cardiovascular disease');
	if (list.length === 0) list.push('No symptoms or risk factors recorded');
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
