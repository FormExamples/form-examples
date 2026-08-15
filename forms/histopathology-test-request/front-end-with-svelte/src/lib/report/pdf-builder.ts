import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { HistopathologyRequest, GradingResult } from '#lib/engine/types.js';
import {
	appropriatenessLabel,
	specimenQualityLabel,
	triageTierLabel,
	recommendationLabel,
	specimenTypeLabel,
	indicationLabel,
	fixativeLabel,
	settingLabel,
	clinicianRoleLabel
} from '#lib/engine/utils.js';

type Margin = [number, number, number, number];

/** Builds the pdfmake document definition for the histopathology vetting report. */
export function buildPdfDocument(
	data: HistopathologyRequest,
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

	const patientName = `${data.patient.firstName} ${data.patient.lastName}`.trim();

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'HISTOPATHOLOGY REQUEST — VETTING REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.gradedAt).toLocaleString()} | RCPath datasets / NICE NG12`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: 'HISTOPATHOLOGY TEST REQUEST',
				fontSize: 18,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4] as Margin
			},
			{
				text: `${specimenTypeLabel(data.specimen.specimenType)} — ${indicationLabel(data.indication.primaryIndication)}`,
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
							field('B. Specimen quality', specimenQualityLabel(result.specimenQualityBand))
						],
						[
							field('C. Request completeness', `${result.completenessPercent}%`),
							field('D. Urgency triage', triageTierLabel(result.triageTier))
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
							field('Patient', patientName || 'N/A'),
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

			// Specimen
			sectionHeader('Specimen'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Type', specimenTypeLabel(data.specimen.specimenType)),
							field('Anatomical site', data.specimen.specimenSite || 'N/A')
						],
						[
							field('Number of specimens', `${data.specimen.numberOfSpecimens ?? 'N/A'}`),
							field('Fixative', fixativeLabel(data.specimen.fixative))
						],
						[
							field('Labelled', data.specimen.specimenLabelled ? 'Yes' : 'No'),
							field('Requested urgency', triageTierLabel(data.urgency.urgency))
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as Margin
			},

			// Indication and clinical context
			sectionHeader('Indication and clinical context'),
			{ text: `Clinical question: ${data.indication.clinicalQuestion || 'Not specified'}`, margin: [0, 0, 0, 4] as Margin },
			{ text: `Clinical details: ${data.indication.clinicalDetails || 'Not specified'}`, margin: [0, 0, 0, 4] as Margin },
			{ text: `Provisional diagnosis: ${data.indication.provisionalDiagnosis || 'Not specified'}`, margin: [0, 0, 0, 4] as Margin },
			{ text: `Previous histology: ${data.indication.previousHistology || 'None'}`, margin: [0, 0, 0, 16] as Margin },

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
