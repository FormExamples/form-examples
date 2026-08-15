import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { EndoscopyRequest, GradingResult } from '#lib/engine/types.js';
import {
	appropriatenessLabel,
	triageTierLabel,
	riskBandLabel,
	recommendationLabel,
	procedureLabel,
	indicationLabel
} from '#lib/engine/utils.js';

type Margin = [number, number, number, number];

/** Builds the pdfmake document definition for the endoscopy vetting report. */
export function buildPdfDocument(
	data: EndoscopyRequest,
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

	const patientName = `${data.patient.firstName} ${data.patient.lastName}`.trim();

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'GI ENDOSCOPY REQUEST — VETTING REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.gradedAt).toLocaleString()} | NICE NG12 / DG56 · BSG/ESGE · ASGE-AUC`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: 'ENDOSCOPY TEST REQUEST',
				fontSize: 18,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4] as Margin
			},
			{
				text: `${procedureLabel(data.request.requestedProcedure)} — ${indicationLabel(data.request.primaryIndication)}`,
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
							field(
								'D. Pre-procedure risk',
								`${riskBandLabel(result.riskBand)} (GBS ${result.glasgowBlatchfordScore} / Rockall ${result.rockallScore})`
							)
						],
						[
							field('Target timeframe', result.targetTimeframe || 'N/A'),
							field('Two-week-wait', result.twoWeekWaitEligible ? 'Eligible' : 'No')
						],
						[
							field('Recommendation', recommendationLabel(result.recommendation)),
							field('Anticoagulant action', result.anticoagulantAction || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as Margin
			},

			// Patient and requester
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
							field('Requesting clinician', data.clinician.clinicianName || 'N/A')
						],
						[
							field('Site', data.clinician.siteName || 'N/A'),
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

			// Red flags and labs
			sectionHeader('Red flags and triage labs'),
			{ ul: redFlagList(data), margin: [0, 0, 0, 16] as Margin },

			// Medication
			sectionHeader('Medication'),
			{
				ul: [
					`Anticoagulant: ${data.medication.takingAnticoagulant ? data.medication.anticoagulantAgent || 'Yes' : 'No'}`,
					`Antiplatelet: ${data.medication.takingAntiplatelet ? data.medication.antiplateletAgent || 'Yes' : 'No'}`,
					`Allergies: ${data.medication.allergies || 'None recorded'}${data.medication.latexAllergy ? ' (latex allergy)' : ''}`
				],
				margin: [0, 0, 0, 16] as Margin
			},

			// Comorbidities and infection / prep
			sectionHeader('Comorbidities and preparation'),
			{
				ul: [
					`ASA grade: ${data.comorbidities.asaGrade || 'N/A'}`,
					`NYHA class: ${data.comorbidities.cardiacNyhaClass || 'N/A'}`,
					`CKD: ${data.comorbidities.chronicKidneyDisease ? `Yes (eGFR ${data.comorbidities.egfrMlMin ?? 'N/A'})` : 'No'}`,
					`Fit for bowel prep: ${data.infectionPrep.fitForBowelPrep ? 'Yes' : 'No'}`,
					`Sedation: ${data.infectionPrep.sedation || 'N/A'}`,
					`Escort available: ${data.infectionPrep.escortAvailable ? 'Yes' : 'No'}`
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

function redFlagList(data: EndoscopyRequest): string[] {
	const list: string[] = [];
	if (data.redFlags.redFlagDysphagia) list.push('Dysphagia');
	if (data.redFlags.redFlagWeightLoss) list.push('Unexplained weight loss');
	if (data.redFlags.redFlagAnaemia) list.push('Anaemia');
	if (data.redFlags.redFlagGiBleeding) list.push('GI bleeding');
	if (data.redFlags.redFlagAbdominalMass) list.push('Abdominal / epigastric mass');
	if (data.redFlags.redFlagAgeOver55) list.push('Age >= 55');
	if (data.redFlags.fitResultUgG !== null)
		list.push(`FIT: ${data.redFlags.fitResultUgG} ug Hb/g`);
	if (data.redFlags.haemoglobinGL !== null)
		list.push(`Haemoglobin: ${data.redFlags.haemoglobinGL} g/L`);
	if (data.redFlags.ferritinUgL !== null) list.push(`Ferritin: ${data.redFlags.ferritinUgL} ug/L`);
	if (list.length === 0) list.push('No red flags or triage labs recorded');
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
