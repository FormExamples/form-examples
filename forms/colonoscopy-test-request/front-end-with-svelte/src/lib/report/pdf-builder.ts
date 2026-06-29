import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { ColonoscopyRequest, GradingResult } from '$lib/engine/types';
import {
	appropriatenessLabel,
	triageTierLabel,
	riskLabel,
	recommendationLabel,
	procedureLabel,
	indicationLabel,
	settingLabel,
	asaLabel
} from '$lib/engine/utils';

type Margin = [number, number, number, number];

/** Builds the pdfmake document definition for the colonoscopy vetting report. */
export function buildPdfDocument(
	data: ColonoscopyRequest,
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

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'COLONOSCOPY TEST REQUEST — VETTING REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.gradedAt).toLocaleString()} | NICE NG12 / DG56 · BSG / ESGE · ASA · ASGE / EPAGE`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: 'COLONOSCOPY TEST REQUEST',
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
							field('A. Appropriateness', `${appropriatenessLabel(result.appropriatenessBand)} (${result.appropriatenessScore}/9)`),
							field('B. Cancer-pathway urgency', triageTierLabel(result.triageTier))
						],
						[
							field('C. Request completeness', `${result.completenessPercent}%`),
							field('D. Pre-procedure risk', riskLabel(result.riskBand))
						],
						[
							field('Target timeframe', result.targetTimeframe || 'N/A'),
							field('Recommendation', recommendationLabel(result.recommendation))
						],
						[
							field('Two-week-wait eligible', result.twoWeekWaitEligible ? 'Yes' : 'No'),
							field('2WW rationale', result.twoWeekWaitRationale || 'N/A')
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
							field('Patient', `${data.patient.firstName} ${data.patient.lastName}`.trim() || 'N/A'),
							field('NHS number', data.patient.nhsNumber || 'N/A')
						],
						[
							field('Requesting clinician', data.clinician.clinicianName || 'N/A'),
							field('Care setting', settingLabel(data.patient.setting))
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

			// Indication and question
			sectionHeader('Indication and clinical question'),
			{ text: `Clinical question: ${data.request.clinicalQuestion || 'Not specified'}`, margin: [0, 0, 0, 4] as Margin },
			{ text: `Relevant history: ${data.request.relevantHistory || 'Not specified'}`, margin: [0, 0, 0, 16] as Margin },

			// Red flags and labs
			sectionHeader('Red flags and triage labs'),
			{ ul: redFlagList(data), margin: [0, 0, 0, 16] as Margin },

			// Medication
			sectionHeader('Medication'),
			{
				ul: [
					`Anticoagulant: ${data.medication.takingAnticoagulant ? `Yes${data.medication.anticoagulantAgent ? ` (${data.medication.anticoagulantAgent})` : ''}` : 'No'}`,
					`Antiplatelet: ${data.medication.takingAntiplatelet ? `Yes${data.medication.antiplateletAgent ? ` (${data.medication.antiplateletAgent})` : ''}` : 'No'}`,
					`Diabetes medication: ${data.medication.diabetesMedication || 'Not recorded'}`
				],
				margin: [0, 0, 0, 16] as Margin
			},

			// Bowel prep and fitness
			sectionHeader('Bowel prep and fitness'),
			{
				ul: [
					`Fit for bowel preparation: ${data.fitness.fitForBowelPrep ? 'Yes' : 'No'}`,
					`Planned bowel-prep agent: ${data.fitness.bowelPrepAgent || 'Not recorded'}`,
					`Chronic kidney disease: ${data.fitness.chronicKidneyDisease ? 'Yes' : 'No'}`,
					`eGFR: ${data.fitness.egfrMlMin != null ? `${data.fitness.egfrMlMin} mL/min` : 'Not recorded'}`,
					`ASA grade: ${asaLabel(data.fitness.asaGrade)}`
				],
				margin: [0, 0, 0, 16] as Margin
			},

			// Anticoagulant action
			...(result.anticoagulantAction
				? [sectionHeader('Anticoagulant management'), { text: result.anticoagulantAction, margin: [0, 0, 0, 16] as Margin }]
				: []),

			// Flags
			...(result.flags.length > 0
				? [
						sectionHeader('Safety flags'),
						{
							ul: result.flags.map((f) => ({
								text: `[${f.priority.toUpperCase()}] ${f.category}: ${f.description} — ${f.suggestedAction}`,
								color: f.priority === 'high' ? '#dc2626' : f.priority === 'medium' ? '#d97706' : '#4b5563',
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

function redFlagList(data: ColonoscopyRequest): string[] {
	const list: string[] = [];
	if (data.redFlags.weightLoss) list.push('Unexplained weight loss');
	if (data.redFlags.anaemia) list.push('Iron-deficiency anaemia');
	if (data.redFlags.abdominalMass) list.push('Palpable abdominal / rectal mass');
	if (data.redFlags.rectalBleeding) list.push('Unexplained rectal bleeding');
	list.push(`FIT result: ${data.redFlags.fitResultUgG != null ? `${data.redFlags.fitResultUgG} µg Hb/g` : 'Not recorded'}`);
	list.push(`Haemoglobin: ${data.redFlags.haemoglobinGL != null ? `${data.redFlags.haemoglobinGL} g/L` : 'Not recorded'}`);
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
