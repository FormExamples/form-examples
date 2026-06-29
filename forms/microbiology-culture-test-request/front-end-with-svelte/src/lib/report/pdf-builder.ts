import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { MicrobiologyRequest, GradingResult } from '$lib/engine/types';
import {
	appropriatenessLabel,
	preanalyticalLabel,
	triageTierLabel,
	recommendationLabel,
	specimenTypeLabel,
	indicationLabel,
	urgencyLabel,
	TEST_FIELDS
} from '$lib/engine/utils';

type Margin = [number, number, number, number];

/** Builds the pdfmake document definition for the microbiology vetting report. */
export function buildPdfDocument(
	data: MicrobiologyRequest,
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

	const patientName = [data.patient.firstName, data.patient.lastName].filter(Boolean).join(' ');

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'MICROBIOLOGY CULTURE REQUEST — VETTING REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.gradedAt).toLocaleString()} | UKHSA SMI / NICE NG51`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: 'MICROBIOLOGY CULTURE TEST REQUEST',
				fontSize: 18,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4] as Margin
			},
			{
				text: `${specimenTypeLabel(data.specimen.specimenType)} — ${indicationLabel(data.clinical.primaryIndication)}`,
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
							field('B. Pre-analytical safety', preanalyticalLabel(result.preanalyticalBand))
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
						[field('Patient', patientName || 'N/A'), field('NHS number', data.patient.nhsNumber || 'N/A')],
						[
							field('Requesting clinician', data.clinician.clinicianName || 'N/A'),
							field('Site', data.clinician.siteName || 'N/A')
						],
						[
							field('Requested urgency', urgencyLabel(data.triage.urgency)),
							field('Care setting', data.triage.setting || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as Margin
			},

			// Specimen
			sectionHeader('Specimen'),
			{
				ul: [
					`Specimen type: ${specimenTypeLabel(data.specimen.specimenType)}`,
					`Site detail: ${data.specimen.specimenSiteDetail || 'Not specified'}`,
					`Collected: ${data.specimen.specimenCollected || 'Not specified'}`,
					`Collection date/time: ${data.specimen.collectionDatetime || 'Not recorded'}`
				],
				margin: [0, 0, 0, 16] as Margin
			},

			// Requested tests
			sectionHeader('Requested tests'),
			{ ul: testList(data), margin: [0, 0, 0, 16] as Margin },

			// Clinical context
			sectionHeader('Clinical context'),
			{ text: `Indication: ${indicationLabel(data.clinical.primaryIndication)}`, margin: [0, 0, 0, 4] as Margin },
			{ text: `Clinical details: ${data.clinical.clinicalDetails || 'Not specified'}`, margin: [0, 0, 0, 4] as Margin },
			{
				ul: [
					`Fever: ${data.clinical.fever ? 'Yes' : 'No'}`,
					`Current antibiotics: ${data.clinical.currentAntibiotics ? `Yes${data.clinical.antibioticName ? ` (${data.clinical.antibioticName})` : ''}` : 'No'}`,
					`Recent travel: ${data.clinical.recentTravel ? 'Yes' : 'No'}`,
					`Immunocompromised: ${data.clinical.immunocompromised ? 'Yes' : 'No'}`
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

function testList(data: MicrobiologyRequest): string[] {
	const list = TEST_FIELDS.filter((t) => data.tests[t.field] === true).map((t) => t.label);
	if (list.length === 0) list.push('No test selected');
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
