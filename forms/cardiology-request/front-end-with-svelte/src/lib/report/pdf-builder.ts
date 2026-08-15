import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { CardiologyRequest, GradingResult } from '#lib/engine/types.js';
import {
	appropriatenessLabel,
	safetyLabel,
	triageTierLabel,
	recommendationLabel,
	requestedServiceLabel,
	referralReasonLabel,
	statusLabel
} from '#lib/engine/utils.js';

type Margin = [number, number, number, number];

/** Builds the pdfmake document definition for the cardiology vetting report. */
export function buildPdfDocument(
	data: CardiologyRequest,
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

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'CARDIOLOGY REFERRAL — VETTING REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.gradedAt).toLocaleString()} | NICE CG95 / NG106 / CG109`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: 'CARDIOLOGY REQUEST',
				fontSize: 18,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4] as Margin
			},
			{
				text: `${requestedServiceLabel(data.requestedService)} — ${referralReasonLabel(data.referralReason)}`,
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
							field('A. Appropriateness', appropriatenessLabel(result.appropriatenessBand)),
							field('B. Safety / red-flag', safetyLabel(result.safetyBand))
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

			// Patient and referrer
			sectionHeader('Patient and referrer'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Patient', data.patientName || 'N/A'),
							field('NHS number', data.nhsNumber || 'N/A')
						],
						[
							field('Referring clinician', data.referringClinician || 'N/A'),
							field('Status', statusLabel(data.status))
						],
						[
							field('Site', data.siteName || 'N/A'),
							field('Setting', data.setting || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as Margin
			},

			// Reason and question
			sectionHeader('Reason and clinical question'),
			{ text: `Clinical question: ${data.clinicalQuestion || 'Not specified'}`, margin: [0, 0, 0, 4] as Margin },
			{ text: `Relevant history: ${data.relevantHistory || 'Not specified'}`, margin: [0, 0, 0, 16] as Margin },

			// Symptoms
			sectionHeader('Symptoms'),
			{ ul: symptomList(data), margin: [0, 0, 0, 16] as Margin },

			// Red flags and investigations
			sectionHeader('Red flags and investigations'),
			{
				ul: [
					`Suspected ACS: ${data.suspectedAcs ? 'Yes' : 'No'}`,
					`Exertional syncope: ${data.exertionalSyncope ? 'Yes' : 'No'}`,
					`New-onset heart failure: ${data.newOnsetHeartFailure ? 'Yes' : 'No'}`,
					`Resting ECG: ${data.ecgDone ? `Done — ${data.ecgFindings || 'no findings recorded'}` : 'Not done'}`,
					`Troponin: ${data.troponinStatus || 'N/A'}`,
					`BNP / NT-proBNP: ${data.bnpStatus || 'N/A'}`
				],
				margin: [0, 0, 0, 16] as Margin
			},

			// Cardiac history
			sectionHeader('Cardiac history and risk factors'),
			{ ul: historyList(data), margin: [0, 0, 0, 8] as Margin },
			{ text: `Current medications: ${data.currentMedications || 'None recorded'}`, margin: [0, 0, 0, 16] as Margin },

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
			...(data.notes
				? [sectionHeader('Notes'), { text: data.notes, margin: [0, 0, 0, 8] as Margin }]
				: [])
		],
		defaultStyle: {
			fontSize: 10
		}
	};
}

function symptomList(data: CardiologyRequest): string[] {
	const list: string[] = [];
	if (data.symptomChestPain)
		list.push(`Chest pain${data.chestPainCharacter ? ` (${data.chestPainCharacter})` : ''}`);
	if (data.symptomBreathlessness)
		list.push(`Breathlessness${data.nyhaClass ? ` (NYHA ${data.nyhaClass.toUpperCase()})` : ''}`);
	if (data.symptomPalpitations) list.push('Palpitations');
	if (data.symptomSyncope) list.push('Syncope / blackout');
	if (data.symptomOedema) list.push('Peripheral oedema');
	if (list.length === 0) list.push('No symptoms recorded');
	return list;
}

function historyList(data: CardiologyRequest): string[] {
	const list: string[] = [];
	if (data.knownCoronaryArteryDisease) list.push('Known coronary artery disease');
	if (data.previousMi) list.push('Previous myocardial infarction');
	if (data.heartFailure) list.push('Established heart failure');
	if (data.valveDisease) list.push('Valve disease');
	if (data.arrhythmia) list.push('Arrhythmia');
	if (data.hypertension) list.push('Hypertension');
	if (data.diabetes) list.push('Diabetes');
	if (list.length === 0) list.push('No cardiac history recorded');
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
