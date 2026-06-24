import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { HolterMonitorResult, GradingResult } from '$lib/engine/types';
import {
	resultClassificationLabel,
	abnormalitySeverityLabel,
	followUpUrgencyLabel,
	monitorTypeLabel,
	reportStatusLabel
} from '$lib/engine/utils';

type Margin = [number, number, number, number];

/** Builds the pdfmake document definition for the Holter monitor ambulatory ECG report. */
export function buildPdfDocument(
	data: HolterMonitorResult,
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
			text: 'AMBULATORY ECG (HOLTER) REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.gradedAt).toLocaleString()} | ISHNE-HRS / NICE NG196`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: 'HOLTER MONITOR TEST RESULT',
				fontSize: 18,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4] as Margin
			},
			{
				text: `${monitorTypeLabel(data.monitorType)} — ${reportStatusLabel(data.reportStatus)}`,
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

			// Recording
			sectionHeader('Recording'),
			{
				ul: [
					`Monitor type: ${monitorTypeLabel(data.monitorType)}`,
					`Recording duration: ${data.recordingDurationHours !== null ? `${data.recordingDurationHours} hours` : 'N/A'}`,
					`Analysed: ${data.analysedPercent !== null ? `${data.analysedPercent}%` : 'N/A'}`
				],
				margin: [0, 0, 0, 16] as Margin
			},

			// Clinical history
			sectionHeader('Clinical history'),
			{ text: data.clinicalHistory || 'Not specified', margin: [0, 0, 0, 4] as Margin },
			{
				text: `Comparison: ${data.comparisonWithPrevious || 'None'}`,
				margin: [0, 0, 0, 16] as Margin
			},

			// Rhythm and rate summary
			sectionHeader('Rhythm & rate summary'),
			{
				ul: [
					`Predominant rhythm: ${data.predominantRhythm || 'N/A'}`,
					`Mean heart rate: ${data.meanHeartRateBpm !== null ? `${data.meanHeartRateBpm} bpm` : 'N/A'}`,
					`Minimum heart rate: ${data.minimumHeartRateBpm !== null ? `${data.minimumHeartRateBpm} bpm` : 'N/A'}`,
					`Maximum heart rate: ${data.maximumHeartRateBpm !== null ? `${data.maximumHeartRateBpm} bpm` : 'N/A'}`,
					`Longest pause: ${data.longestPauseSeconds !== null ? `${data.longestPauseSeconds} s` : 'N/A'}`,
					`Ventricular ectopic burden: ${data.ventricularEctopicPercent !== null ? `${data.ventricularEctopicPercent}%` : 'N/A'}`,
					`Supraventricular ectopic burden: ${data.supraventricularEctopicPercent !== null ? `${data.supraventricularEctopicPercent}%` : 'N/A'}`
				],
				margin: [0, 0, 0, 16] as Margin
			},

			// Findings
			sectionHeader('Findings'),
			{ text: data.findingsNarrative || 'Not specified', margin: [0, 0, 0, 8] as Margin },
			{
				ul: structuredFindingList(data),
				margin: [0, 0, 0, 16] as Margin
			},

			// Impression
			sectionHeader('Impression'),
			{ text: data.impression || 'Not specified', margin: [0, 0, 0, 4] as Margin },
			{
				text: `Reporting category: ${data.reportingCategory || 'None'}`,
				margin: [0, 0, 0, 2] as Margin
			},
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

function structuredFindingList(data: HolterMonitorResult): string[] {
	const list: string[] = [];
	if (data.atrialFibrillationDetected) list.push('Atrial fibrillation detected');
	if (data.significantPauses) list.push('Significant pauses (> 3 s)');
	if (data.ventricularTachycardia) list.push('Ventricular tachycardia');
	if (data.supraventricularTachycardia) list.push('Supraventricular tachycardia');
	if (data.highGradeAvBlock) list.push('High-grade AV block');
	if (data.symptomRhythmCorrelation) list.push('Symptom-rhythm correlation');
	if (data.normalStudy) list.push('Normal study');
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
