import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { NeurodiversityAdjustmentResponse, GradingResult } from '#lib/engine/types.js';
import {
	outcomeClassificationLabel,
	legalRiskBandLabel,
	followUpUrgencyLabel,
	overallDecisionLabel,
	declineReasonCategoryLabel,
	responseStatusLabel,
	handlingMethodLabel,
	managerRoleLabel
} from '#lib/engine/utils.js';

type Margin = [number, number, number, number];

/**
 * Builds the pdfmake document definition for the neurodiversity
 * reasonable-adjustments response confirmation-and-review letter.
 */
export function buildPdfDocument(
	data: NeurodiversityAdjustmentResponse,
	result: GradingResult
): TDocumentDefinitions {
	const outcomeColor =
		result.outcomeClassification === 'fully-agreed'
			? '#16a34a'
			: result.outcomeClassification === 'declined'
				? '#dc2626'
				: result.outcomeClassification === 'deferred'
					? '#2563eb'
					: result.outcomeClassification === ''
						? '#4b5563'
						: '#d97706';

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'REASONABLE-ADJUSTMENTS RESPONSE',
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
				text: 'NEURODIVERSITY ADJUSTMENT RESPONSE',
				fontSize: 18,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4] as Margin
			},
			{
				text: `${responseStatusLabel(data.responseStatus)} — ${handlingMethodLabel(data.handlingMethod)}`,
				fontSize: 12,
				alignment: 'center',
				color: '#4b5563',
				margin: [0, 0, 0, 4] as Margin
			},
			{
				text: `Outcome: ${outcomeClassificationLabel(result.outcomeClassification)}`,
				fontSize: 14,
				bold: true,
				alignment: 'center',
				color: outcomeColor,
				margin: [0, 0, 0, 16] as Margin
			},

			// Four-axis grade
			sectionHeader('Interpretation grade (four axes)'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('A. Outcome', outcomeClassificationLabel(result.outcomeClassification)),
							field('B. Legal / discrimination risk', legalRiskBandLabel(result.legalRiskBand))
						],
						[
							field('C. Response completeness', `${result.completenessPercent}%`),
							field('D. Follow-up urgency', followUpUrgencyLabel(result.followUpUrgency))
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

			// Response identification
			sectionHeader('Response identification'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Responding manager / HR', data.managerName || 'N/A'),
							field('Role', managerRoleLabel(data.managerRole))
						],
						[
							field('Originating request', data.requestReference || 'N/A'),
							field('Effective date', data.effectiveDate || 'N/A')
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

			// Decision
			sectionHeader('Decision'),
			{
				ul: [
					`Overall decision: ${overallDecisionLabel(data.overallDecision)}`,
					`Decline-reason category: ${declineReasonCategoryLabel(data.declineReasonCategory)}`
				],
				margin: [0, 0, 0, 4] as Margin
			},
			{ text: data.decisionRationale || 'No rationale recorded', margin: [0, 0, 0, 16] as Margin },

			// Adjustments agreed
			sectionHeader('Adjustments agreed'),
			{
				ul: agreedCategoryList(data),
				margin: [0, 0, 0, 4] as Margin
			},
			{
				text: `Detail: ${data.agreedAdjustmentsDetail || 'None recorded'}`,
				margin: [0, 0, 0, 4] as Margin
			},
			{
				text: `Alternatives offered: ${data.alternativeAdjustmentsDetail || 'None'}`,
				margin: [0, 0, 0, 16] as Margin
			},

			// Trial and review
			sectionHeader('Trial & review'),
			{
				ul: [
					`Trial period: ${data.trialPeriod ? `Yes${data.trialPeriodWeeks ? ` (${data.trialPeriodWeeks} weeks)` : ''}` : 'No'}`,
					`Review scheduled: ${data.reviewScheduled ? `Yes${data.reviewDate ? ` — ${data.reviewDate}` : ''}` : 'No'}`
				],
				margin: [0, 0, 0, 16] as Margin
			},

			// Support and responsibilities
			sectionHeader('Support & responsibilities'),
			{
				ul: [
					`Occupational health referred: ${data.occupationalHealthReferred ? 'Yes' : 'No'}`,
					`Access to Work referred: ${data.accessToWorkReferred ? 'Yes' : 'No'}`,
					`Support resources: ${data.supportResourcesDetail || 'None recorded'}`,
					`Responsibilities: ${data.responsibilitiesDetail || 'None recorded'}`,
					`Point of contact: ${data.pointOfContact || 'N/A'}`,
					`Escalated: ${data.escalated ? `Yes${data.escalationDetail ? ` — ${data.escalationDetail}` : ''}` : 'No'}`,
					`Signed: ${data.signed ? 'Yes' : 'No'}`
				],
				margin: [0, 0, 0, 16] as Margin
			},

			// Flags
			...(result.flags.length > 0
				? [
						sectionHeader('Compliance and risk flags'),
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

function agreedCategoryList(data: NeurodiversityAdjustmentResponse): string[] {
	const list: string[] = [];
	if (data.agreedWorkingEnvironment) list.push('Working environment');
	if (data.agreedEquipmentTechnology) list.push('Equipment or assistive technology');
	if (data.agreedWorkingArrangements) list.push('Working arrangements');
	if (data.agreedCommunication) list.push('Communication');
	if (data.agreedSupportMentoring) list.push('Support or mentoring');
	if (data.agreedRecruitmentProcess) list.push('Recruitment / assessment process');
	if (data.agreedPolicyDress) list.push('Policy (dress code / uniform, absence)');
	if (data.agreedOther) list.push('Other');
	if (list.length === 0) list.push('No adjustment categories agreed');
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
