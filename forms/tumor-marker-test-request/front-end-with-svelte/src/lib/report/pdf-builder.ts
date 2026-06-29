import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { TumorMarkerRequest, GradingResult } from '$lib/engine/types';
import {
	appropriatenessLabel,
	interpretationLabel,
	triageTierLabel,
	recommendationLabel,
	urgencyLabel
} from '$lib/engine/utils';
import { MARKERS, indicationLabel } from '$lib/engine/markers';

type Margin = [number, number, number, number];

/** Builds the pdfmake document definition for the tumour-marker vetting report. */
export function buildPdfDocument(
	data: TumorMarkerRequest,
	result: GradingResult
): TDocumentDefinitions {
	const triageColor =
		result.triageTier === 'routine'
			? '#16a34a'
			: result.triageTier === 'two-week-wait'
				? '#dc2626'
				: result.triageTier === 'urgent'
					? '#d97706'
					: '#4b5563';

	const selectedMarkers = MARKERS.filter((m) => data.markers[m.field] === true).map((m) => m.label);

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'TUMOUR-MARKER REQUEST — VETTING REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.gradedAt).toLocaleString()} | NICE CG122 / NG12 · ACB / RCPath`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: 'TUMOR MARKER TEST REQUEST',
				fontSize: 18,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4] as Margin
			},
			{
				text: `${selectedMarkers.join(', ') || 'No markers selected'} — ${indicationLabel(data.context.primaryIndication) || 'No indication'}`,
				fontSize: 12,
				alignment: 'center',
				color: '#4b5563',
				margin: [0, 0, 0, 4] as Margin
			},
			{
				text: `Triage: ${triageTierLabel(result.triageTier)}${result.targetTimeframe ? ` (${result.targetTimeframe})` : ''}`,
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
							field('B. Interpretation safety', interpretationLabel(result.interpretationBand))
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
						[
							field('Patient', `${data.patient.firstName} ${data.patient.lastName}`.trim() || 'N/A'),
							field('NHS number', data.patient.nhsNumber || 'N/A')
						],
						[
							field('Requesting clinician', data.clinician.clinicianName || 'N/A'),
							field('Referral date', data.clinician.referralDate || 'N/A')
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

			// Requested markers
			sectionHeader('Requested markers'),
			{ ul: selectedMarkers.length > 0 ? selectedMarkers : ['No markers selected'], margin: [0, 0, 0, 16] as Margin },

			// Clinical context
			sectionHeader('Clinical context'),
			{ text: `Primary indication: ${indicationLabel(data.context.primaryIndication) || 'Not specified'}`, margin: [0, 0, 0, 4] as Margin },
			{ text: `Clinical details: ${data.context.clinicalDetails || 'Not specified'}`, margin: [0, 0, 0, 4] as Margin },
			{ text: `Known / suspected cancer site: ${data.context.knownCancerSite || 'Not specified'}`, margin: [0, 0, 0, 4] as Margin },
			{ text: `On treatment: ${data.context.onTreatment ? 'Yes' : 'No'}`, margin: [0, 0, 0, 4] as Margin },
			{
				text: `Previous marker value: ${data.context.previousMarkerValue ?? 'N/A'}${data.context.previousMarkerDate ? ` (${data.context.previousMarkerDate})` : ''}`,
				margin: [0, 0, 0, 4] as Margin
			},
			{ text: `Requested urgency: ${urgencyLabel(data.triage.urgency)}`, margin: [0, 0, 0, 16] as Margin },

			// Flags
			...(result.flags.length > 0
				? [
						sectionHeader('Safety flags'),
						{
							ul: result.flags.map((f) => ({
								text: `[${f.priority.toUpperCase()}] ${f.category}: ${f.description} — ${f.suggestedAction}`,
								color:
									f.priority === 'high' ? '#dc2626' : f.priority === 'medium' ? '#d97706' : '#4b5563',
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
