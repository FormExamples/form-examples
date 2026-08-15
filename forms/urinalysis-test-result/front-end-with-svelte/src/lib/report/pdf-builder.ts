import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { UrinalysisResult, GradingResult } from '#lib/engine/types.js';
import {
	resultClassificationLabel,
	abnormalitySeverityLabel,
	followUpUrgencyLabel,
	specimenTypeLabel,
	cultureResultLabel,
	dipstickGradeLabel,
	reportStatusLabel
} from '#lib/engine/utils.js';

type Margin = [number, number, number, number];

/** Builds the pdfmake document definition for the urinalysis pathology report. */
export function buildPdfDocument(
	data: UrinalysisResult,
	result: GradingResult
): TDocumentDefinitions {
	const classColor =
		result.resultClassification === 'normal'
			? '#16a34a'
			: result.resultClassification === 'critical'
				? '#dc2626'
				: result.resultClassification === 'abnormal'
					? '#d97706'
					: '#4b5563';

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'URINALYSIS PATHOLOGY REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.gradedAt).toLocaleString()} | UK SMI B41 / RCPath`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: 'URINALYSIS TEST RESULT',
				fontSize: 18,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4] as Margin
			},
			{
				text: `${specimenTypeLabel(data.specimenType)} — ${reportStatusLabel(data.reportStatus)}`,
				fontSize: 12,
				alignment: 'center',
				color: '#4b5563',
				margin: [0, 0, 0, 4] as Margin
			},
			{
				text: `Result classification: ${resultClassificationLabel(result.resultClassification)}`,
				fontSize: 14,
				bold: true,
				alignment: 'center',
				color: classColor,
				margin: [0, 0, 0, 16] as Margin
			},

			// Four-axis interpretation grade
			sectionHeader('Interpretation grade (four axes)'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('A. Result classification', resultClassificationLabel(result.resultClassification)),
							field(
								'B. Abnormality severity',
								`${abnormalitySeverityLabel(result.abnormalitySeverity)}${result.reportingCategory ? ` (${result.reportingCategory})` : ''}`
							)
						],
						[
							field('C. Report completeness', `${result.reportCompletenessPercent}%`),
							field('D. Follow-up urgency', followUpUrgencyLabel(result.followUpUrgency))
						],
						[
							field('Target timeframe', result.targetTimeframe || 'N/A'),
							field('Recommendation', result.recommendation || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 8] as Margin
			},
			{
				text: `Recommended action: ${result.recommendedAction || 'N/A'}`,
				margin: [0, 0, 0, 16] as Margin
			},

			// Report identification
			sectionHeader('Report identification'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Reporting clinician', data.reportingClinician || 'N/A'),
							field('Originating request', data.originatingRequestReference || 'N/A')
						],
						[
							field('Performed date', data.performedDate || 'N/A'),
							field('Reported date', data.reportedDate || 'N/A')
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
					`Specimen type: ${specimenTypeLabel(data.specimenType)}`,
					`Specimen condition: ${data.specimenCondition || 'N/A'}`,
					`Pregnant: ${data.pregnant ? 'Yes' : 'No'}`
				],
				margin: [0, 0, 0, 16] as Margin
			},

			// Clinical history
			sectionHeader('Clinical history'),
			{ text: data.clinicalHistory || 'Not specified', margin: [0, 0, 0, 16] as Margin },

			// Dipstick
			sectionHeader('Dipstick (reagent strip)'),
			{
				ul: [
					`Leucocytes: ${dipstickGradeLabel(data.leucocytes)}`,
					`Nitrites: ${dipstickGradeLabel(data.nitrites)}`,
					`Protein: ${dipstickGradeLabel(data.protein)}`,
					`Blood: ${dipstickGradeLabel(data.blood)}`,
					`Glucose: ${dipstickGradeLabel(data.glucose)}`,
					`Ketones: ${dipstickGradeLabel(data.ketones)}`,
					`Bilirubin: ${dipstickGradeLabel(data.bilirubin)}`,
					`pH: ${data.ph !== null ? data.ph : 'N/A'}`,
					`Specific gravity: ${data.specificGravity !== null ? data.specificGravity : 'N/A'}`
				],
				margin: [0, 0, 0, 16] as Margin
			},

			// Microscopy
			sectionHeader('Microscopy'),
			{
				ul: [
					`Red cell count: ${data.redCellCount || 'N/A'}`,
					`White cell count: ${data.whiteCellCount || 'N/A'}`,
					`Epithelial cells: ${data.epithelialCells || 'N/A'}`,
					`Casts: ${data.casts || 'N/A'}`,
					`Organisms seen: ${data.organismsSeen ? 'Yes' : 'No'}`,
					`Crystals: ${data.crystals || 'N/A'}`
				],
				margin: [0, 0, 0, 16] as Margin
			},

			// Culture
			sectionHeader('Culture & sensitivities'),
			{
				ul: [
					`Culture result: ${cultureResultLabel(data.cultureResult)}`,
					`Organism isolated: ${data.organismIsolated || 'N/A'}`,
					`Colony count: ${data.colonyCountCfuMl || 'N/A'}`,
					`Antibiotic sensitivities: ${data.antibioticSensitivities || 'N/A'}`
				],
				margin: [0, 0, 0, 16] as Margin
			},

			// Findings & impression
			sectionHeader('Findings & impression'),
			{ text: data.findingsNarrative || 'Not specified', margin: [0, 0, 0, 4] as Margin },
			{ text: `Impression: ${data.impression || 'Not specified'}`, margin: [0, 0, 0, 4] as Margin },
			{
				text: `Recommended follow-up: ${data.recommendedFollowUp || 'None'}`,
				margin: [0, 0, 0, 16] as Margin
			},

			// Critical-result communication
			sectionHeader('Critical-result communication'),
			{
				ul: [
					`Communicated: ${data.criticalResultCommunicated ? 'Yes' : 'No'}`,
					`Reported to: ${data.reportedTo || 'N/A'}`,
					`Signed: ${data.signed ? 'Yes' : 'No'}`
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
