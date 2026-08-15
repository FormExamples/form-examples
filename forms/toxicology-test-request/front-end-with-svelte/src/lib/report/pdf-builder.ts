import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { ToxicologyRequest, GradingResult } from '#lib/engine/types.js';
import {
	appropriatenessLabel,
	timingLabel,
	triageTierLabel,
	recommendationLabel,
	indicationLabel,
	selectedAssayLabels
} from '#lib/engine/utils.js';

type Margin = [number, number, number, number];

/** Builds the pdfmake document definition for the toxicology vetting report. */
export function buildPdfDocument(
	data: ToxicologyRequest,
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

	const assays = selectedAssayLabels(data);

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'TOXICOLOGY TEST REQUEST — VETTING REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.gradedAt).toLocaleString()} | TOXBASE / NPIS decision support`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: 'TOXICOLOGY TEST REQUEST',
				fontSize: 18,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4] as Margin
			},
			{
				text: indicationLabel(data.clinical.primaryIndication),
				fontSize: 12,
				alignment: 'center',
				color: '#4b5563',
				margin: [0, 0, 0, 4] as Margin
			},
			{
				text: `Triage: ${triageTierLabel(result.triageTier)} (${result.targetTimeframe || 'N/A'})`,
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
							field('B. Ingestion timing', timingLabel(result.timingBand))
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
							field(
								'Patient',
								`${data.patient.firstName} ${data.patient.lastName}`.trim() || 'N/A'
							),
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

			// Requested assays
			sectionHeader('Requested assays'),
			{
				ul: assays.length > 0 ? assays : ['No assays selected'],
				margin: [0, 0, 0, 16] as Margin
			},

			// Clinical context
			sectionHeader('Clinical context'),
			{
				ul: [
					`Indication: ${indicationLabel(data.clinical.primaryIndication)}`,
					`Suspected agent: ${data.clinical.suspectedAgent || 'Not specified'}`,
					`Time since ingestion: ${data.clinical.timeSinceIngestionHours != null ? `${data.clinical.timeSinceIngestionHours} h` : 'N/A'}`,
					`Deliberate overdose: ${data.clinical.deliberateOverdose ? 'Yes' : 'No'}`,
					`Symptomatic: ${data.clinical.symptomatic ? 'Yes' : 'No'}`
				],
				margin: [0, 0, 0, 8] as Margin
			},
			{
				text: `Clinical details: ${data.clinical.clinicalDetails || 'Not specified'}`,
				margin: [0, 0, 0, 16] as Margin
			},

			// Specimen
			sectionHeader('Specimen'),
			{
				ul: [
					`Specimen collected: ${data.specimen.specimenCollected === 'yes' ? 'Yes' : data.specimen.specimenCollected === 'no' ? 'No' : 'N/A'}`,
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
