import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { HearingRequest, GradingResult } from '#lib/engine/types.js';
import {
	appropriatenessLabel,
	triageTierLabel,
	priorityLabel,
	recommendationLabel,
	testTypeLabel,
	indicationLabel
} from '#lib/engine/utils.js';

type Margin = [number, number, number, number];

/** Builds the pdfmake document definition for the hearing test vetting report. */
export function buildPdfDocument(
	data: HearingRequest,
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
			text: 'HEARING TEST REQUEST — VETTING REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.gradedAt).toLocaleString()} | BSA / NICE NG98 / QS185 / ENT-UK`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: 'HEARING TEST REQUEST',
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
								`${appropriatenessLabel(result.appropriatenessBand)} (${result.appropriatenessScore} / 9)`
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
			{
				text: 'Appropriateness is anchored on the British Society of Audiology recommended procedures and NICE NG98 indication match (no single published 1–9 audiology score exists).',
				fontSize: 8,
				color: '#9ca3af',
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
							field('Site', data.clinician.siteName || 'N/A'),
							field('Care setting', data.triage.setting || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as Margin
			},

			// Examination and question
			sectionHeader('Examination and clinical question'),
			{ text: `Laterality: ${data.request.laterality || 'N/A'}`, margin: [0, 0, 0, 4] as Margin },
			{ text: `Clinical question: ${data.request.clinicalQuestion || 'Not specified'}`, margin: [0, 0, 0, 4] as Margin },
			{ text: `Relevant history: ${data.request.relevantHistory || 'Not specified'}`, margin: [0, 0, 0, 16] as Margin },

			// Symptoms and red flags
			sectionHeader('Symptoms and red flags'),
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

function symptomList(data: HearingRequest): string[] {
	const list: string[] = [];
	if (data.symptoms.hearingLoss) list.push('Hearing loss');
	if (data.symptoms.tinnitus) list.push('Tinnitus');
	if (data.symptoms.vertigo) list.push('Vertigo');
	if (data.symptoms.otalgia) list.push('Otalgia (ear pain)');
	if (data.symptoms.earDischarge) list.push('Ear discharge (otorrhoea)');
	if (data.symptoms.ototoxicMedication) list.push('On ototoxic medication');
	if (data.symptoms.suddenOnset) {
		list.push(
			`Sudden onset of hearing loss${data.symptoms.onsetWithinDays === 'within-30-days' ? ' (within 30 days)' : data.symptoms.onsetWithinDays === 'more-than-30-days' ? ' (more than 30 days ago)' : ''}`
		);
	}
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
