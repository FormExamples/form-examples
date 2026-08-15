import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { CoagulationResult, GradingResult } from '#lib/engine/types.js';
import {
	resultClassificationLabel,
	abnormalitySeverityLabel,
	followUpUrgencyLabel,
	overallResultStatusLabel,
	reportStatusLabel
} from '#lib/engine/utils.js';

type Margin = [number, number, number, number];

/** Builds the pdfmake document definition for the coagulation haematology report. */
export function buildPdfDocument(
	data: CoagulationResult,
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
			text: 'COAGULATION HAEMATOLOGY REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.gradedAt).toLocaleString()} | RCPath / BSH haemostasis guidance`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: 'COAGULATION TEST RESULT',
				fontSize: 18,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4] as Margin
			},
			{
				text: `${overallResultStatusLabel(data.overallResultStatus)} — ${reportStatusLabel(data.reportStatus)}`,
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

			// Specimen and context
			sectionHeader('Specimen & context'),
			{
				ul: [
					`Specimen condition: ${data.specimenCondition || 'N/A'}`,
					`On anticoagulant: ${data.onAnticoagulant ? 'Yes' : 'No'}`,
					`Anticoagulant agent: ${data.anticoagulantAgent || 'N/A'}`
				],
				margin: [0, 0, 0, 16] as Margin
			},

			// Result values
			sectionHeader('Result values'),
			{
				ul: resultValueList(data),
				margin: [0, 0, 0, 16] as Margin
			},

			// Clinical history
			sectionHeader('Clinical history'),
			{ text: data.clinicalHistory || 'Not specified', margin: [0, 0, 0, 4] as Margin },
			{
				text: `Comparison: ${data.comparisonWithPrevious || 'None'}`,
				margin: [0, 0, 0, 16] as Margin
			},

			// Findings
			sectionHeader('Findings'),
			{ text: data.findingsNarrative || 'Not specified', margin: [0, 0, 0, 4] as Margin },
			...(data.criticalValuePresent
				? [
						{
							text: `Critical value: ${data.criticalValueDetail || 'present'}`,
							color: '#dc2626',
							bold: true,
							margin: [0, 0, 0, 16] as Margin
						}
					]
				: [{ text: '', margin: [0, 0, 0, 8] as Margin }]),

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

function resultValueList(data: CoagulationResult): string[] {
	const list: string[] = [];
	if (data.prothrombinTimeSeconds !== null)
		list.push(`Prothrombin time (PT): ${data.prothrombinTimeSeconds} s`);
	if (data.inr !== null) list.push(`INR: ${data.inr}`);
	if (data.activatedPartialThromboplastinTimeSeconds !== null)
		list.push(`APTT: ${data.activatedPartialThromboplastinTimeSeconds} s`);
	if (data.apttRatio !== null) list.push(`APTT ratio: ${data.apttRatio}`);
	if (data.fibrinogenGL !== null) list.push(`Fibrinogen: ${data.fibrinogenGL} g/L`);
	if (data.dDimer !== null) list.push(`D-dimer: ${data.dDimer}`);
	if (data.thrombinTimeSeconds !== null)
		list.push(`Thrombin time (TT): ${data.thrombinTimeSeconds} s`);
	if (data.factorAssays.trim() !== '') list.push(`Factor assays: ${data.factorAssays}`);
	if (list.length === 0) list.push('No result values recorded');
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
