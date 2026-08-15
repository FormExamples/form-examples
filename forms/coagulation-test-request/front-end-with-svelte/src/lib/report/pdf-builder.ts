import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { CoagulationTestRequest, GradingResult } from '#lib/engine/types.js';
import { indicationLabel, selectedTestLabels } from '#lib/engine/defaults.js';
import {
	appropriatenessLabel,
	preanalyticalLabel,
	triageTierLabel,
	recommendationLabel
} from '#lib/engine/utils.js';

type Margin = [number, number, number, number];

/** Builds the pdfmake document definition for the coagulation vetting report. */
export function buildPdfDocument(
	data: CoagulationTestRequest,
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

	const tests = selectedTestLabels(data.tests);
	const patientName = [data.patient.firstName, data.patient.lastName].filter(Boolean).join(' ');

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'COAGULATION TEST REQUEST — VETTING REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.gradedAt).toLocaleString()} | BSH / NICE NG158`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: 'COAGULATION TEST REQUEST',
				fontSize: 18,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4] as Margin
			},
			{
				text: indicationLabel(data.clinical.primaryIndication) || 'Indication not specified',
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
							field('A. Appropriateness', `${result.appropriatenessScore}/9 — ${appropriatenessLabel(result.appropriatenessBand)}`),
							field('B. Pre-analytical', preanalyticalLabel(result.preanalyticalBand))
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
						[field('Requesting clinician', data.clinician.clinicianName || 'N/A'), field('Referral date', data.clinician.referralDate || 'N/A')],
						[field('Site', data.triage.siteName || data.clinician.siteName || 'N/A'), field('Setting', data.triage.setting || 'N/A')]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as Margin
			},

			// Requested tests
			sectionHeader('Requested tests'),
			{ ul: tests.length > 0 ? tests : ['No tests selected'], margin: [0, 0, 0, 16] as Margin },

			// Clinical context
			sectionHeader('Clinical context'),
			{ text: `Clinical details: ${data.clinical.clinicalDetails || 'Not specified'}`, margin: [0, 0, 0, 4] as Margin },
			{
				ul: [
					`On anticoagulant: ${data.clinical.onAnticoagulant ? `Yes${data.clinical.anticoagulantAgent ? ` (${data.clinical.anticoagulantAgent})` : ''}` : 'No'}`,
					`Bleeding history: ${data.clinical.bleedingHistory ? 'Yes' : 'No'}`,
					`Thrombosis history: ${data.clinical.thrombosisHistory ? 'Yes' : 'No'}`,
					`Active major bleeding: ${data.clinical.activeBleeding ? 'Yes' : 'No'}`,
					`Suspected DIC: ${data.clinical.suspectedDic ? 'Yes' : 'No'}`
				],
				margin: [0, 0, 0, 16] as Margin
			},

			// Specimen
			sectionHeader('Specimen / pre-analytical'),
			{
				ul: [
					`Specimen collected: ${data.specimen.specimenCollected || 'N/A'}`,
					`Collection date / time: ${data.specimen.collectionDatetime || 'N/A'}`,
					`Citrate tube fill: ${data.specimen.citrateTubeFill || 'N/A'}`,
					`9:1 ratio correct: ${data.specimen.citrateRatioCorrect || 'N/A'}`
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
