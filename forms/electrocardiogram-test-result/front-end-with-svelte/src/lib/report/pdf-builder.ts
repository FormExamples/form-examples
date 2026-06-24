import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { ElectrocardiogramResult, GradingResult } from '$lib/engine/types';
import {
	resultClassificationLabel,
	abnormalitySeverityLabel,
	followUpUrgencyLabel,
	ecgTypeLabel,
	rhythmLabel,
	cardiacAxisLabel,
	reportStatusLabel
} from '$lib/engine/utils';

type Margin = [number, number, number, number];

/** Builds the pdfmake document definition for the ECG cardiology report. */
export function buildPdfDocument(
	data: ElectrocardiogramResult,
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
			text: 'ECG CARDIOLOGY REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.gradedAt).toLocaleString()} | AHA/ACCF/HRS`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: 'ELECTROCARDIOGRAM TEST RESULT',
				fontSize: 18,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4] as Margin
			},
			{
				text: `${ecgTypeLabel(data.ecgType)} — ${reportStatusLabel(data.reportStatus)}`,
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

			// Examination
			sectionHeader('Examination'),
			{
				ul: [
					`ECG type: ${ecgTypeLabel(data.ecgType)}`,
					`Recording quality: ${data.recordingQuality || 'N/A'}`,
					`Cardiac axis: ${cardiacAxisLabel(data.cardiacAxis)}`
				],
				margin: [0, 0, 0, 16] as Margin
			},

			// Rate, rhythm and intervals
			sectionHeader('Rate, rhythm and intervals'),
			{
				ul: [
					`Ventricular rate: ${data.ventricularRateBpm !== null ? `${data.ventricularRateBpm} bpm` : 'N/A'}`,
					`Rhythm: ${rhythmLabel(data.rhythm)}`,
					`PR interval: ${data.prIntervalMs !== null ? `${data.prIntervalMs} ms` : 'N/A'}`,
					`QRS duration: ${data.qrsDurationMs !== null ? `${data.qrsDurationMs} ms` : 'N/A'}`,
					`QT interval: ${data.qtIntervalMs !== null ? `${data.qtIntervalMs} ms` : 'N/A'}`,
					`QTc: ${data.qtcMs !== null ? `${data.qtcMs} ms` : 'N/A'}`
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

			// Findings
			sectionHeader('Findings'),
			{
				ul: structuredFindingList(data),
				margin: [0, 0, 0, 16] as Margin
			},

			// Interpretation
			sectionHeader('Interpretation'),
			{ text: data.interpretation || 'Not specified', margin: [0, 0, 0, 4] as Margin },
			{
				text: `Reporting category: ${data.reportingCategory || 'N/A'}`,
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

function structuredFindingList(data: ElectrocardiogramResult): string[] {
	const list: string[] = [];
	if (data.stElevation) list.push('ST-segment elevation (STEMI / acute injury pattern)');
	if (data.stDepression) list.push('ST-segment depression');
	if (data.tWaveInversion) list.push('T-wave inversion');
	if (data.pathologicalQWaves) list.push('Pathological Q waves');
	if (data.leftVentricularHypertrophy) list.push('Left ventricular hypertrophy');
	if (data.bundleBranchBlock) list.push('Bundle branch block');
	if (data.ischaemia) list.push('Ischaemia');
	if (data.normalEcg) list.push('Normal ECG');
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
