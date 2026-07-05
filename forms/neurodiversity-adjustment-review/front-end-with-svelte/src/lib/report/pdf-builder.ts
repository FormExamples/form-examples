import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { NeurodiversityAdjustmentReview, GradingResult } from '$lib/engine/types';
import {
	effectivenessBandLabel,
	wellbeingRiskBandLabel,
	nextStepUrgencyLabel,
	effectivenessRatingLabel,
	workerSatisfiedLabel,
	wellbeingChangeLabel,
	reviewStatusLabel,
	reviewMethodLabel,
	managerRoleLabel
} from '$lib/engine/utils';

type Margin = [number, number, number, number];

/**
 * Builds the pdfmake document definition for the neurodiversity
 * reasonable-adjustments review record.
 */
export function buildPdfDocument(
	data: NeurodiversityAdjustmentReview,
	result: GradingResult
): TDocumentDefinitions {
	const effectivenessColor =
		result.effectivenessBand === 'effective'
			? '#16a34a'
			: result.effectivenessBand === 'ineffective'
				? '#dc2626'
				: result.effectivenessBand === 'not-yet-assessed'
					? '#2563eb'
					: result.effectivenessBand === ''
						? '#4b5563'
						: '#d97706';

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'REASONABLE-ADJUSTMENTS REVIEW',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.gradedAt).toLocaleString()} | Equality Act 2010 · ACAS`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: 'NEURODIVERSITY ADJUSTMENT REVIEW',
				fontSize: 18,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4] as Margin
			},
			{
				text: `${reviewStatusLabel(data.reviewStatus)} — ${reviewMethodLabel(data.reviewMethod)}`,
				fontSize: 12,
				alignment: 'center',
				color: '#4b5563',
				margin: [0, 0, 0, 4] as Margin
			},
			{
				text: `Effectiveness: ${effectivenessBandLabel(result.effectivenessBand)}`,
				fontSize: 14,
				bold: true,
				alignment: 'center',
				color: effectivenessColor,
				margin: [0, 0, 0, 16] as Margin
			},

			// Four-axis grade
			sectionHeader('Interpretation grade (four axes)'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('A. Effectiveness', effectivenessBandLabel(result.effectivenessBand)),
							field('B. Wellbeing risk', wellbeingRiskBandLabel(result.wellbeingRiskBand))
						],
						[
							field('C. Review completeness', `${result.completenessPercent}%`),
							field('D. Next-step urgency', nextStepUrgencyLabel(result.nextStepUrgency))
						],
						[
							field('Target timeframe', result.targetTimeframe || 'N/A'),
							field('Recommendation', result.recommendationLabel || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as Margin
			},

			// Review identification
			sectionHeader('Review identification'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Reviewer (manager / HR)', data.managerName || 'N/A'),
							field('Role', managerRoleLabel(data.managerRole))
						],
						[
							field('Originating response', data.responseReference || 'N/A'),
							field('Review date', data.reviewDate || 'N/A')
						],
						[
							field('Next review date', data.nextReviewDate || 'Not set'),
							field('Review status', reviewStatusLabel(data.reviewStatus))
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as Margin
			},

			// Worker identification
			sectionHeader('Worker'),
			{
				ul: [
					`Name: ${data.workerName || 'N/A'}`,
					`Employee reference: ${data.employeeReference || 'N/A'}`,
					`Job title: ${data.workerJobTitle || 'N/A'}`,
					`Department: ${data.workerDepartment || 'N/A'}`
				],
				margin: [0, 0, 0, 16] as Margin
			},

			// Effectiveness
			sectionHeader('Effectiveness of adjustments'),
			{
				ul: effectivenessList(data),
				margin: [0, 0, 0, 16] as Margin
			},

			// Worker experience
			sectionHeader('Worker experience'),
			{
				ul: [
					`Satisfied: ${workerSatisfiedLabel(data.workerSatisfied)}`,
					`Wellbeing change: ${wellbeingChangeLabel(data.wellbeingChange)}`
				],
				margin: [0, 0, 0, 4] as Margin
			},
			{
				text: `Worker feedback: ${data.workerFeedback || 'None recorded'}`,
				margin: [0, 0, 0, 4] as Margin
			},
			{
				text: `Remaining barriers: ${data.barriersDetail || 'None recorded'}`,
				margin: [0, 0, 0, 16] as Margin
			},

			// Changes and next steps
			sectionHeader('Changes & next steps'),
			{
				ul: [
					`Changes needed: ${data.changesNeeded ? 'Yes' : 'No'}`,
					`Changes detail: ${data.changesDetail || 'None recorded'}`,
					`Updated adjustments: ${data.updatedAdjustmentsDetail || 'None recorded'}`,
					`Occupational-health re-referral: ${data.occupationalHealthRereferral ? 'Yes' : 'No'}`,
					`Escalated: ${data.escalated ? `Yes${data.escalationDetail ? ` — ${data.escalationDetail}` : ''}` : 'No'}`,
					`Signed: ${data.signed ? 'Yes' : 'No'}`
				],
				margin: [0, 0, 0, 16] as Margin
			},

			// Flags
			...(result.flags.length > 0
				? [
						sectionHeader('Review flags'),
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

function effectivenessList(data: NeurodiversityAdjustmentReview): string[] {
	const categories: { label: string; value: string }[] = [
		{ label: 'Working environment', value: data.effectivenessWorkingEnvironment },
		{ label: 'Equipment or assistive technology', value: data.effectivenessEquipmentTechnology },
		{ label: 'Working arrangements', value: data.effectivenessWorkingArrangements },
		{ label: 'Communication', value: data.effectivenessCommunication },
		{ label: 'Support or mentoring', value: data.effectivenessSupportMentoring },
		{ label: 'Recruitment / assessment process', value: data.effectivenessRecruitmentProcess },
		{ label: 'Policy (dress code / uniform, absence)', value: data.effectivenessPolicyDress },
		{ label: 'Other', value: data.effectivenessOther }
	];
	const list = categories
		.filter((c) => c.value !== '')
		.map((c) => `${c.label}: ${effectivenessRatingLabel(c.value)}`);
	if (list.length === 0) list.push('No adjustments rated');
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
