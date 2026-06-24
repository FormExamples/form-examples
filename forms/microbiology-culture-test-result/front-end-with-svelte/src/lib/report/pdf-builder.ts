import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { MicrobiologyCultureResult, GradingResult } from '$lib/engine/types';
import {
	resultClassificationLabel,
	abnormalitySeverityLabel,
	followUpUrgencyLabel,
	specimenTypeLabel,
	cultureResultLabel,
	reportStatusLabel
} from '$lib/engine/utils';

type Margin = [number, number, number, number];

/** Builds the pdfmake document definition for the microbiology culture report. */
export function buildPdfDocument(
	data: MicrobiologyCultureResult,
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
			text: 'MICROBIOLOGY CULTURE REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.gradedAt).toLocaleString()} | UK SMI / RCPath`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: 'MICROBIOLOGY CULTURE TEST RESULT',
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
					`Site detail: ${data.specimenSiteDetail || 'N/A'}`,
					`Condition: ${data.specimenCondition || 'N/A'}`
				],
				margin: [0, 0, 0, 16] as Margin
			},

			// Clinical history
			sectionHeader('Clinical history'),
			{ text: data.clinicalHistory || 'Not specified', margin: [0, 0, 0, 16] as Margin },

			// Microscopy and culture
			sectionHeader('Microscopy & culture'),
			{
				ul: [
					`Gram stain: ${data.gramStainResult || 'N/A'}`,
					`Culture result: ${cultureResultLabel(data.cultureResult)}`,
					`Organism isolated: ${data.organismIsolated || 'N/A'}`,
					`Second organism: ${data.secondOrganismIsolated || 'N/A'}`,
					`Colony count: ${data.colonyCount || 'N/A'}`
				],
				margin: [0, 0, 0, 16] as Margin
			},

			// Sensitivities and resistance
			sectionHeader('Sensitivities & resistance'),
			{ text: data.antibioticSensitivities || 'Not specified', margin: [0, 0, 0, 8] as Margin },
			{
				ul: resistanceList(data),
				margin: [0, 0, 0, 16] as Margin
			},

			// Findings
			sectionHeader('Findings'),
			{ text: data.findingsNarrative || 'Not specified', margin: [0, 0, 0, 16] as Margin },

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

function resistanceList(data: MicrobiologyCultureResult): string[] {
	const list: string[] = [];
	if (data.resistanceMrsa) list.push('MRSA detected');
	if (data.resistanceEsbl) list.push('ESBL producer detected');
	if (data.resistanceCpe) list.push('CPE (carbapenemase-producing Enterobacterales) detected');
	if (data.cDifficileToxin && data.cDifficileToxin !== 'not-tested')
		list.push(`C. difficile toxin: ${data.cDifficileToxin}`);
	if (data.acidFastBacilli && data.acidFastBacilli !== 'not-tested')
		list.push(`Acid-fast bacilli: ${data.acidFastBacilli}`);
	if (data.pcrResult) list.push(`PCR: ${data.pcrResult}`);
	if (data.criticalOrganism) list.push('Critical / alert organism flagged');
	if (list.length === 0) list.push('No resistance markers or specialised-test positives');
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
