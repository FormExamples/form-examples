import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { UltrasoundRequest, GradingResult } from '$lib/engine/types';
import {
	appropriatenessLabel,
	windowFitLabel,
	triageTierLabel,
	recommendationLabel,
	scanTypeLabel,
	indicationLabel,
	formatGestationalAge
} from '$lib/engine/utils';

type Margin = [number, number, number, number];

/** Builds the pdfmake document definition for the obstetric ultrasound vetting report. */
export function buildPdfDocument(
	data: UltrasoundRequest,
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

	const patientName =
		[data.patient.firstName, data.patient.lastName].filter(Boolean).join(' ').trim() || 'N/A';
	const gestationalAge = formatGestationalAge(
		data.dating.gestationalAgeWeeks,
		data.dating.gestationalAgeDays
	);

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'OBSTETRIC ULTRASOUND REQUEST — VETTING REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.gradedAt).toLocaleString()}`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: 'OBSTETRIC ULTRASOUND REQUEST',
				fontSize: 18,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4] as Margin
			},
			{
				text: `${scanTypeLabel(data.request.requestedScanType)} — ${indicationLabel(data.request.primaryIndication)}`,
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
							field('B. Gestational-age window', windowFitLabel(result.windowFit))
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
						[field('Patient', patientName), field('NHS number', data.patient.nhsNumber || 'N/A')],
						[
							field('Requesting clinician', data.clinician.clinicianName || 'N/A'),
							field('Site', data.clinician.siteName || 'N/A')
						],
						[
							field('Gestational age', gestationalAge ? `${gestationalAge} weeks` : 'N/A'),
							field('Setting', data.triage.setting || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as Margin
			},

			// Reason and question
			sectionHeader('Reason and clinical question'),
			{ text: `Clinical question: ${data.request.clinicalQuestion || 'Not specified'}`, margin: [0, 0, 0, 4] as Margin },
			{ text: `Relevant history: ${data.request.relevantHistory || 'Not specified'}`, margin: [0, 0, 0, 16] as Margin },

			// Symptoms and red flags
			sectionHeader('Symptoms and red flags'),
			{ ul: symptomList(data), margin: [0, 0, 0, 16] as Margin },

			// Risk factors
			sectionHeader('Maternal and obstetric risk factors'),
			{ ul: riskList(data), margin: [0, 0, 0, 16] as Margin },

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

function symptomList(data: UltrasoundRequest): string[] {
	const list: string[] = [];
	if (data.symptoms.vaginalBleeding && data.symptoms.vaginalBleeding !== 'none')
		list.push(`Vaginal bleeding (${data.symptoms.vaginalBleeding})`);
	if (data.symptoms.abdominalPain && data.symptoms.abdominalPain !== 'none')
		list.push(`Abdominal pain (${data.symptoms.abdominalPain})`);
	if (data.symptoms.reducedFetalMovements) list.push('Reduced fetal movements');
	if (data.symptoms.suspectedEctopic) list.push('Suspected ectopic pregnancy');
	if (data.symptoms.haemodynamicallyUnstable) list.push('Haemodynamically unstable');
	if (list.length === 0) list.push('No red-flag symptoms recorded');
	return list;
}

function riskList(data: UltrasoundRequest): string[] {
	const list: string[] = [];
	if (data.riskFactors.hypertension) list.push('Hypertension');
	if (data.riskFactors.diabetes) list.push('Diabetes');
	if (data.riskFactors.previousGrowthRestriction) list.push('Previous growth restriction');
	if (data.riskFactors.previousPretermBirth) list.push('Previous preterm birth');
	if (data.riskFactors.previousCaesarean) list.push('Previous caesarean');
	if (data.riskFactors.smoker) list.push('Smoker');
	if (list.length === 0) list.push('No risk factors recorded');
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
