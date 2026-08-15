import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { StressTestRequest, GradingResult } from '#lib/engine/types.js';
import {
	appropriatenessLabel,
	contraindicationLabel,
	triageTierLabel,
	recommendationLabel,
	testTypeLabel,
	indicationLabel,
	clinicianRoleLabel,
	aorticStenosisLabel,
	settingLabel
} from '#lib/engine/utils.js';

type Margin = [number, number, number, number];

/** Builds the pdfmake document definition for the stress-test vetting report. */
export function buildPdfDocument(
	data: StressTestRequest,
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
			text: 'CARDIAC STRESS TEST REQUEST — VETTING REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.gradedAt).toLocaleString()} | ACC/AHA AUC · ESC CCS`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: 'CARDIAC STRESS TEST REQUEST',
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

			// Patient and requester
			sectionHeader('Patient and requesting clinician'),
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
							field('Role', clinicianRoleLabel(data.clinician.clinicianRole))
						],
						[
							field('Site', data.clinician.siteName || 'N/A'),
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

			// Symptoms and exercise capacity
			sectionHeader('Symptoms and exercise capacity'),
			{ ul: symptomList(data), margin: [0, 0, 0, 16] as Margin },

			// Cardiac safety screen
			sectionHeader('Cardiac safety screen'),
			{ ul: safetyList(data), margin: [0, 0, 0, 8] as Margin },
			{ text: `Resting ECG findings: ${data.symptoms.restingEcgFindings || 'Not specified'}`, margin: [0, 0, 0, 16] as Margin },

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

function symptomList(data: StressTestRequest): string[] {
	const list: string[] = [];
	if (data.symptoms.symptomChestPain) list.push('Chest pain');
	if (data.symptoms.symptomBreathlessness) list.push('Breathlessness');
	if (data.symptoms.symptomPalpitations) list.push('Palpitations');
	list.push(data.symptoms.ableToExercise ? 'Able to exercise' : 'Unable to exercise');
	return list;
}

function safetyList(data: StressTestRequest): string[] {
	const list: string[] = [];
	if (data.safety.knownCoronaryArteryDisease) list.push('Known coronary artery disease');
	if (data.safety.recentAcuteCoronarySyndrome) list.push('Recent acute coronary syndrome');
	if (data.safety.aorticStenosis && data.safety.aorticStenosis !== 'none')
		list.push(`Aortic stenosis: ${aorticStenosisLabel(data.safety.aorticStenosis)}`);
	if (data.safety.uncontrolledHypertension) list.push('Uncontrolled hypertension');
	if (data.safety.betaBlocker) list.push('Taking a beta-blocker');
	if (list.length === 0) list.push('No safety factors recorded');
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
