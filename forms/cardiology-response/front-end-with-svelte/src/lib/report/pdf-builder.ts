import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { CardiologyResponse, GradingResult } from '$lib/engine/types';
import {
	responseClassificationLabel,
	severityLabel,
	followUpUrgencyLabel,
	consultationTypeLabel,
	responseStatusLabel,
	primaryDiagnosisCategoryLabel
} from '$lib/engine/utils';

type Margin = [number, number, number, number];

/** Builds the pdfmake document definition for the cardiology response letter. */
export function buildPdfDocument(
	data: CardiologyResponse,
	result: GradingResult
): TDocumentDefinitions {
	const classColor =
		result.responseClassification === 'no-abnormality'
			? '#16a34a'
			: result.responseClassification === 'critical'
				? '#dc2626'
				: result.responseClassification === 'cardiac-condition'
					? '#d97706'
					: '#4b5563';

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'CARDIOLOGY RESPONSE LETTER',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.gradedAt).toLocaleString()} | NICE CG95 / NG106 · ESC`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: 'CARDIOLOGY RESPONSE',
				fontSize: 18,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4] as Margin
			},
			{
				text: `${consultationTypeLabel(data.consultationType)} — ${responseStatusLabel(data.responseStatus)}`,
				fontSize: 12,
				alignment: 'center',
				color: '#4b5563',
				margin: [0, 0, 0, 4] as Margin
			},
			{
				text: `Response classification: ${responseClassificationLabel(result.responseClassification)}`,
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
							field('A. Response classification', responseClassificationLabel(result.responseClassification)),
							field(
								'B. Condition severity',
								`${severityLabel(result.severity)}${result.severityCategory ? ` (${result.severityCategory})` : ''}`
							)
						],
						[
							field('C. Response completeness', `${result.completenessPercent}%`),
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

			// Response identification
			sectionHeader('Response identification'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Responding clinician', data.respondingClinician || 'N/A'),
							field('Originating request', data.originatingRequestReference || 'N/A')
						],
						[
							field('Assessed date', data.assessedDate || 'N/A'),
							field('Responded date', data.respondedDate || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as Margin
			},

			// Patient identification
			sectionHeader('Patient'),
			{
				ul: [
					`Name: ${data.patientName || 'N/A'}`,
					`NHS number: ${data.patientNhsNumber || 'N/A'}`,
					`Date of birth: ${data.patientBirthDate || 'N/A'}`
				],
				margin: [0, 0, 0, 16] as Margin
			},

			// Clinical assessment
			sectionHeader('Clinical assessment'),
			{ text: data.clinicalSummary || 'Not specified', margin: [0, 0, 0, 4] as Margin },
			{ text: `Examination: ${data.examinationFindings || 'None recorded'}`, margin: [0, 0, 0, 4] as Margin },
			{
				text: `Investigations: ${data.investigationsPerformed || 'None recorded'}`,
				margin: [0, 0, 0, 16] as Margin
			},

			// Structured findings
			sectionHeader('Structured findings'),
			{
				ul: structuredFindingList(data),
				margin: [0, 0, 0, 16] as Margin
			},

			// Diagnosis and measurement
			sectionHeader('Diagnosis & measurement'),
			{
				ul: [
					`Primary diagnosis category: ${primaryDiagnosisCategoryLabel(data.primaryDiagnosisCategory)}`,
					`LV ejection fraction: ${data.lvEjectionFractionPercent !== null ? `${data.lvEjectionFractionPercent}%` : 'N/A'}`
				],
				margin: [0, 0, 0, 4] as Margin
			},
			{ text: data.diagnosisNarrative || 'Not specified', margin: [0, 0, 0, 16] as Margin },

			// Management and follow-up
			sectionHeader('Management & follow-up'),
			{ text: `Management plan: ${data.managementPlan || 'Not specified'}`, margin: [0, 0, 0, 4] as Margin },
			{ text: `Medication changes: ${data.medicationChanges || 'None'}`, margin: [0, 0, 0, 4] as Margin },
			{
				text: `Recommended follow-up: ${data.recommendedFollowUp || 'None'}`,
				margin: [0, 0, 0, 16] as Margin
			},

			// Critical-result communication
			sectionHeader('Critical-result communication'),
			{
				ul: [
					`Critical result: ${data.criticalResult ? 'Yes' : 'No'}`,
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

function structuredFindingList(data: CardiologyResponse): string[] {
	const list: string[] = [];
	if (data.ischaemiaOrCad) list.push('Ischaemia or coronary artery disease');
	if (data.significantArrhythmia) list.push('Significant arrhythmia');
	if (data.reducedEjectionFraction) list.push('Reduced ejection fraction');
	if (data.significantValveDisease) list.push('Significant valve disease');
	if (data.structuralAbnormality) list.push('Structural abnormality');
	if (data.uncontrolledHypertension) list.push('Uncontrolled hypertension');
	if (data.nonCardiacCause) list.push('Non-cardiac cause');
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
