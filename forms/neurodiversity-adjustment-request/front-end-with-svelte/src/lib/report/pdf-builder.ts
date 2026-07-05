import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { NeurodiversityAdjustmentRequest, GradingResult } from '$lib/engine/types';
import {
	eligibilityLabel,
	impactLabel,
	priorityTierLabel,
	recommendationLabel,
	statusLabel,
	currentImpactLabel,
	conditionList,
	difficultyList,
	adjustmentList
} from '$lib/engine/utils';

type Margin = [number, number, number, number];

/** Builds the pdfmake document definition for the adjustment-request report. */
export function buildPdfDocument(
	data: NeurodiversityAdjustmentRequest,
	result: GradingResult
): TDocumentDefinitions {
	const priorityColour =
		result.priorityTier === 'routine'
			? '#16a34a'
			: result.priorityTier === 'urgent'
				? '#dc2626'
				: result.priorityTier === 'soon'
					? '#d97706'
					: '#4b5563';

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'NEURODIVERSITY ADJUSTMENT REQUEST — REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.gradedAt).toLocaleString()} | Equality Act 2010 / ACAS`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: 'NEURODIVERSITY ADJUSTMENT REQUEST',
				fontSize: 18,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4] as Margin
			},
			{
				text: `${data.workerName || 'Worker'} — ${data.workerJobTitle || 'Role not specified'}`,
				fontSize: 12,
				alignment: 'center',
				color: '#4b5563',
				margin: [0, 0, 0, 4] as Margin
			},
			{
				text: `Priority: ${priorityTierLabel(result.priorityTier)} (${result.targetTimeframe})`,
				fontSize: 14,
				bold: true,
				alignment: 'center',
				color: priorityColour,
				margin: [0, 0, 0, 16] as Margin
			},

			// Four-axis grade
			sectionHeader('Four-axis grade'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('A. Eligibility', eligibilityLabel(result.eligibilityBand)),
							field('B. Impact / wellbeing', impactLabel(result.impactBand))
						],
						[
							field('C. Request completeness', `${result.completenessPercent}%`),
							field('D. Handling priority', priorityTierLabel(result.priorityTier))
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

			// Worker and handler
			sectionHeader('Worker and handler'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Worker', data.workerName || 'N/A'),
							field('Job title', data.workerJobTitle || 'N/A')
						],
						[
							field('Manager / HR contact', data.managerName || 'N/A'),
							field('Status', statusLabel(data.status))
						],
						[
							field('Department', data.workerDepartment || 'N/A'),
							field('Request date', data.requestDate || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as Margin
			},

			// Neurodivergent profile
			sectionHeader('Neurodivergent profile'),
			{ ul: profileList(data), margin: [0, 0, 0, 4] as Margin },
			{
				text: `Diagnosis status: ${data.diagnosisStatus || 'N/A'} · Considers a disability: ${data.considersDisability || 'N/A'} · Substantial and long-term impact: ${data.substantialLongTermImpact ? 'Yes' : 'No'} · Disclosure consent: ${data.disclosureConsent ? 'Given' : 'Not given'}`,
				margin: [0, 0, 0, 16] as Margin
			},

			// Functional difficulties
			sectionHeader('Functional difficulties'),
			{ ul: difficultiesList(data), margin: [0, 0, 0, 4] as Margin },
			{ text: `Tasks and situations affected: ${data.tasksSituationsAffected || 'Not specified'}`, margin: [0, 0, 0, 4] as Margin },
			{ text: `Worker strengths: ${data.workerStrengths || 'Not specified'}`, margin: [0, 0, 0, 16] as Margin },

			// Requested adjustments
			sectionHeader('Requested adjustments'),
			{ ul: adjustmentsList(data), margin: [0, 0, 0, 4] as Margin },
			{ text: `Detail: ${data.adjustmentsRequestedDetail || 'Not specified'}`, margin: [0, 0, 0, 16] as Margin },

			// Evidence and impact
			sectionHeader('Evidence and impact'),
			{
				ul: [
					`Supporting evidence: ${data.supportingEvidenceType || 'N/A'}`,
					`Occupational health involved: ${data.occupationalHealthInvolved ? 'Yes' : 'No'}`,
					`Access to Work involved: ${data.accessToWorkInvolved ? 'Yes' : 'No'}`,
					`Current impact: ${currentImpactLabel(data.currentImpact)}`,
					`At risk of absence / burnout: ${data.atRiskOfAbsence ? 'Yes' : 'No'}`,
					`Requested urgency: ${data.urgency || 'N/A'}`
				],
				margin: [0, 0, 0, 16] as Margin
			},

			// Flags
			...(result.flags.length > 0
				? [
						sectionHeader('Compliance and wellbeing flags'),
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
			...(data.notes
				? [sectionHeader('Notes'), { text: data.notes, margin: [0, 0, 0, 8] as Margin }]
				: [])
		],
		defaultStyle: {
			fontSize: 10
		}
	};
}

function profileList(data: NeurodiversityAdjustmentRequest): string[] {
	const list = conditionList(data);
	if (list.length === 0) list.push('No neurodivergent conditions recorded');
	return list;
}

function difficultiesList(data: NeurodiversityAdjustmentRequest): string[] {
	const list = difficultyList(data);
	if (list.length === 0) list.push('No functional difficulties recorded');
	return list;
}

function adjustmentsList(data: NeurodiversityAdjustmentRequest): string[] {
	const list = adjustmentList(data);
	if (list.length === 0) list.push('No adjustment categories selected');
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
