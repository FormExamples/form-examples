import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { UrinalysisRequest, GradingResult } from '#lib/engine/types.js';
import {
	appropriatenessLabel,
	preanalyticalLabel,
	triageTierLabel,
	recommendationLabel,
	indicationLabel,
	specimenTypeLabel,
	selectedTestsLabel
} from '#lib/engine/utils.js';

type Margin = [number, number, number, number];

/** Builds the pdfmake document definition for the urinalysis vetting report. */
export function buildPdfDocument(
	data: UrinalysisRequest,
	result: GradingResult
): TDocumentDefinitions {
	const triageColor =
		result.triageTier === 'routine'
			? '#16a34a'
			: result.triageTier === 'stat'
				? '#dc2626'
				: result.triageTier === 'urgent'
					? '#d97706'
					: '#4b5563';

	const patientName = `${data.patient.firstName} ${data.patient.lastName}`.trim();

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'URINALYSIS TEST REQUEST — VETTING REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.gradedAt).toLocaleString()} | NICE NG109 / NG12 / NG203 / UK SMI B41`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: 'URINALYSIS TEST REQUEST',
				fontSize: 18,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4] as Margin
			},
			{
				text: `${indicationLabel(data.context.primaryIndication)} — ${selectedTestsLabel(data.tests)}`,
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
							field('B. Preanalytical', preanalyticalLabel(result.preanalyticalBand))
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
				margin: [0, 0, 0, 8] as Margin
			},
			{
				text: `Specimen note: ${result.specimenNote || 'None'}`,
				fontSize: 9,
				color: '#6b7280',
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
							field('Date of birth', data.patient.dateOfBirth || 'N/A'),
							field('Referral date', data.clinician.referralDate || 'N/A')
						],
						[
							field('Requesting clinician', data.clinician.clinicianName || 'N/A'),
							field('Role', data.clinician.clinicianRole || 'N/A')
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

			// Requested tests
			sectionHeader('Requested tests'),
			{ text: selectedTestsLabel(data.tests), margin: [0, 0, 0, 16] as Margin },

			// Clinical context
			sectionHeader('Clinical context'),
			{
				ul: [
					`Primary indication: ${indicationLabel(data.context.primaryIndication)}`,
					`Pregnant: ${data.context.pregnant ? 'Yes' : 'No'}`,
					`Catheterised: ${data.context.catheterised ? 'Yes' : 'No'}`,
					`Currently on antibiotics: ${data.context.currentAntibiotics ? 'Yes' : 'No'}`
				],
				margin: [0, 0, 0, 8] as Margin
			},
			{
				text: `Clinical details: ${data.context.clinicalDetails || 'Not specified'}`,
				margin: [0, 0, 0, 16] as Margin
			},

			// Symptoms and red flags
			sectionHeader('Symptoms and red flags'),
			{ ul: symptomList(data), margin: [0, 0, 0, 16] as Margin },

			// Specimen
			sectionHeader('Specimen'),
			{
				ul: [
					`Specimen type: ${specimenTypeLabel(data.specimen.specimenType)}`,
					`Collected: ${data.specimen.specimenCollected || 'N/A'}`,
					`Collection date/time: ${data.specimen.collectionDatetime || 'N/A'}`
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

function symptomList(data: UrinalysisRequest): string[] {
	const list: string[] = [];
	const s = data.symptoms;
	if (s.symptomDysuria) list.push('Dysuria');
	if (s.symptomFrequency) list.push('Urinary frequency');
	if (s.symptomVisibleHaematuria) list.push('Visible haematuria');
	if (s.symptomLoinPain) list.push('Loin pain');
	if (s.symptomFever) list.push('Fever');
	if (list.length === 0) list.push('No symptoms or red flags recorded');
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
