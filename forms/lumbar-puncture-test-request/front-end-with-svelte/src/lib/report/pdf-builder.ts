import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { LumbarPunctureRequest, GradingResult } from '#lib/engine/types.js';
import {
	appropriatenessLabel,
	contraindicationLabel,
	triageTierLabel,
	recommendationLabel,
	indicationLabel,
	procedureIntentLabel,
	ctHeadStatusLabel,
	settingLabel
} from '#lib/engine/utils.js';

type Margin = [number, number, number, number];

/** Builds the pdfmake document definition for the lumbar puncture vetting report. */
export function buildPdfDocument(
	data: LumbarPunctureRequest,
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
			text: 'LUMBAR PUNCTURE REQUEST — VETTING REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.gradedAt).toLocaleString()} | NICE NG240 / QS19`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: 'LUMBAR PUNCTURE TEST REQUEST',
				fontSize: 18,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4] as Margin
			},
			{
				text: `${procedureIntentLabel(data.procedure.procedureIntent)} — ${indicationLabel(data.procedure.primaryIndication)}`,
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
							field('Requested urgency', data.triage.urgency || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as Margin
			},

			// Indication and question
			sectionHeader('Indication and clinical question'),
			{ text: `Clinical question: ${data.procedure.clinicalQuestion || 'Not specified'}`, margin: [0, 0, 0, 4] as Margin },
			{ text: `Relevant history: ${data.procedure.relevantHistory || 'Not specified'}`, margin: [0, 0, 0, 16] as Margin },

			// Raised-ICP / neuro safety
			sectionHeader('Raised-ICP and neuro safety'),
			{
				ul: [
					`Suspected raised ICP: ${data.neuroSafety.suspectedRaisedIntracranialPressure ? 'Yes' : 'No'}`,
					`Focal neurological signs: ${data.neuroSafety.focalNeurologicalSigns ? 'Yes' : 'No'}`,
					`Reduced consciousness (GCS ≤ 9): ${data.neuroSafety.reducedConsciousness ? 'Yes' : 'No'}`,
					`CT head status: ${ctHeadStatusLabel(data.neuroSafety.ctHeadStatus)}`
				],
				margin: [0, 0, 0, 16] as Margin
			},

			// Bleeding / coagulation
			sectionHeader('Bleeding and coagulation safety'),
			{ ul: bleedingList(data), margin: [0, 0, 0, 16] as Margin },

			// Procedure detail
			sectionHeader('Procedure detail'),
			{
				ul: [
					`Opening-pressure measurement required: ${data.triage.openingPressureRequired ? 'Yes' : 'No'}`,
					`Requested-by date: ${data.triage.requestedByDate || 'N/A'}`
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

function bleedingList(data: LumbarPunctureRequest): string[] {
	const list: string[] = [];
	if (data.bleeding.takingAnticoagulant)
		list.push(`Anticoagulant${data.bleeding.anticoagulantAgent ? ` (${data.bleeding.anticoagulantAgent})` : ''}`);
	if (data.bleeding.takingAntiplatelet)
		list.push(`Antiplatelet${data.bleeding.antiplateletAgent ? ` (${data.bleeding.antiplateletAgent})` : ''}`);
	if (data.bleeding.bleedingDisorder) list.push('Known bleeding disorder / coagulopathy');
	if (data.bleeding.localSkinInfection) list.push('Local skin / soft-tissue infection at the puncture site');
	if (data.bleeding.inr !== null) list.push(`INR ${data.bleeding.inr}`);
	if (data.bleeding.plateletCount !== null) list.push(`Platelets ${data.bleeding.plateletCount} ×10⁹/L`);
	if (list.length === 0) list.push('No bleeding risk recorded');
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
