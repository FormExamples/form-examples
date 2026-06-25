import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { LumbarPunctureResult, GradingResult } from '$lib/engine/types';
import {
	resultClassificationLabel,
	abnormalitySeverityLabel,
	followUpUrgencyLabel,
	csfAppearanceLabel,
	testResultLabel,
	reportingCategoryLabel,
	reportStatusLabel
} from '$lib/engine/utils';

type Margin = [number, number, number, number];

/** Builds the pdfmake document definition for the CSF analysis report. */
export function buildPdfDocument(
	data: LumbarPunctureResult,
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
			text: 'LUMBAR PUNCTURE / CSF ANALYSIS REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.gradedAt).toLocaleString()} | NICE NG240 / UK NEQAS`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: 'LUMBAR PUNCTURE TEST RESULT',
				fontSize: 18,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4] as Margin
			},
			{
				text: `${reportingCategoryLabel(result.reportingCategory)} — ${reportStatusLabel(data.reportStatus)}`,
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
								`${abnormalitySeverityLabel(result.abnormalitySeverity)}${result.reportingCategory ? ` (${reportingCategoryLabel(result.reportingCategory)})` : ''}`
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

			// Clinical history
			sectionHeader('Clinical history'),
			{ text: data.clinicalHistory || 'Not specified', margin: [0, 0, 0, 16] as Margin },

			// Manometry & appearance
			sectionHeader('Manometry & appearance'),
			{
				ul: [
					`Opening pressure: ${data.openingPressureCmh2o !== null ? `${data.openingPressureCmh2o} cmH2O` : 'N/A'}`,
					`CSF appearance: ${csfAppearanceLabel(data.csfAppearance)}`
				],
				margin: [0, 0, 0, 16] as Margin
			},

			// Cell counts & biochemistry
			sectionHeader('Cell counts & biochemistry'),
			{
				ul: [
					`White cell count: ${data.csfWhiteCellCount !== null ? `${data.csfWhiteCellCount} /uL` : 'N/A'}`,
					`Red cell count: ${data.csfRedCellCount !== null ? `${data.csfRedCellCount} /uL` : 'N/A'}`,
					`Protein: ${data.csfProteinGL !== null ? `${data.csfProteinGL} g/L` : 'N/A'}`,
					`Glucose: ${data.csfGlucoseMmolL !== null ? `${data.csfGlucoseMmolL} mmol/L` : 'N/A'}`,
					`CSF:serum glucose ratio: ${data.csfSerumGlucoseRatio !== null ? data.csfSerumGlucoseRatio : 'N/A'}`,
					`Lactate: ${data.csfLactateMmolL !== null ? `${data.csfLactateMmolL} mmol/L` : 'N/A'}`
				],
				margin: [0, 0, 0, 16] as Margin
			},

			// Microbiology & specialist tests
			sectionHeader('Microbiology & specialist tests'),
			{
				ul: [
					`Gram stain: ${data.gramStainResult || 'N/A'}`,
					`Culture: ${data.cultureResult || 'N/A'}`,
					`PCR: ${data.pcrResult || 'N/A'}`,
					`Oligoclonal bands: ${testResultLabel(data.oligoclonalBands)}`,
					`Xanthochromia: ${testResultLabel(data.xanthochromia)}`
				],
				margin: [0, 0, 0, 16] as Margin
			},

			// Findings & interpretation
			sectionHeader('Findings & interpretation'),
			{ text: data.findingsNarrative || 'Not specified', margin: [0, 0, 0, 8] as Margin },
			{
				ul: structuredFindingList(data),
				margin: [0, 0, 0, 16] as Margin
			},

			// Impression
			sectionHeader('Impression'),
			{ text: data.impression || 'Not specified', margin: [0, 0, 0, 4] as Margin },
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

function structuredFindingList(data: LumbarPunctureResult): string[] {
	const list: string[] = [];
	if (data.raisedProtein) list.push('Raised protein');
	if (data.pleocytosis) list.push('Pleocytosis');
	if (data.lowGlucose) list.push('Low glucose');
	if (data.bacterialMeningitisPattern) list.push('Bacterial meningitis pattern');
	if (data.viralPattern) list.push('Viral / aseptic pattern');
	if (data.subarachnoidHaemorrhageSuggested) list.push('Subarachnoid haemorrhage suggested');
	if (data.normalCsf) list.push('Normal CSF');
	if (list.length === 0) list.push('No structured findings');
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
