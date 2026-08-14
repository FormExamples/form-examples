import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import { DOMAIN_LABELS } from '$lib/engine/domain-rules';
import {
	GATE_DECISION_LABELS,
	READINESS_LABELS,
	STATUS_LABELS
} from '$lib/engine/labels';
import type { GradingResult, PerioperativeOptimization } from '$lib/engine/types';
import { titleCase } from '$lib/engine/utils';

type Margin = [number, number, number, number];

const READINESS_COLOURS: Record<string, string> = {
	'ready': '#16a34a',
	'optimisation-in-progress': '#0891b2',
	'optimisation-required': '#d97706',
	'defer-surgery': '#dc2626'
};

const STATUS_COLOURS: Record<string, string> = {
	'optimised': '#16a34a',
	'in-progress': '#0891b2',
	'action-required': '#d97706',
	'insufficient-time': '#dc2626',
	'not-applicable': '#9ca3af'
};

/** Builds the pdfmake document definition for the optimisation report. */
export function buildPdfDocument(
	data: PerioperativeOptimization,
	result: GradingResult,
	generatedAt: string
): TDocumentDefinitions {
	const colour = READINESS_COLOURS[result.finalReadiness] ?? '#4b5563';
	const patientName =
		`${data.patient.firstName} ${data.patient.lastName}`.trim() || 'Patient not named';

	const content: TDocumentDefinitions['content'] = [
		{
			text: 'PERIOPERATIVE OPTIMISATION',
			fontSize: 18,
			bold: true,
			alignment: 'center',
			margin: [0, 0, 0, 4] as Margin
		},
		{
			text: patientName,
			fontSize: 12,
			alignment: 'center',
			color: '#4b5563',
			margin: [0, 0, 0, 2] as Margin
		},
		{
			text: [
				data.patient.nhsNumber ? `NHS ${data.patient.nhsNumber}` : '',
				data.procedure.plannedProcedure,
				data.procedure.plannedSurgeryDate
					? `Listed for ${data.procedure.plannedSurgeryDate}`
					: 'No date listed'
			]
				.filter(Boolean)
				.join('  ·  '),
			fontSize: 9,
			alignment: 'center',
			color: '#6b7280',
			margin: [0, 0, 0, 12] as Margin
		}
	];

	// The weeks-to-surgery line is the number the whole report turns on.
	content.push({
		text: result.gatingApplied
			? `${result.weeksToSurgery} week${result.weeksToSurgery === 1 ? '' : 's'} between the assessment on ${data.assessment.assessmentDate} and the planned surgery on ${data.procedure.plannedSurgeryDate}.`
			: 'No planned surgery date is recorded, so time-to-surgery gating was not applied. Every triggered domain is reported as action required rather than being tested against its lead time.',
		fontSize: 9,
		italics: true,
		color: '#4b5563',
		margin: [0, 0, 0, 10] as Margin
	});

	if (result.recommendedEarliestSurgeryDate) {
		content.push({
			text:
				`Earliest date at which every domain would have its full lead time: ${result.recommendedEarliestSurgeryDate}. ` +
				'Either move the list to that date or later, or record an explicit accept-unoptimised-risk decision.',
			fontSize: 9,
			bold: true,
			color: '#b45309',
			margin: [0, 0, 0, 10] as Margin
		});
	}

	if (result.finalReadiness !== result.computedReadiness) {
		content.push({
			text:
				`Clinician override. Computed band was ${READINESS_LABELS[result.computedReadiness]}; ` +
				`the clinician recorded ${READINESS_LABELS[result.finalReadiness]}. ` +
				`Reason: ${result.overrideReason || 'not stated'}. ` +
				'The safety flags below are unaffected by the override.',
			fontSize: 9,
			italics: true,
			color: '#b45309',
			margin: [0, 0, 0, 10] as Margin
		});
	}

	content.push(
		{
			table: {
				widths: ['*'],
				body: [
					[
						{
							text: `${READINESS_LABELS[result.finalReadiness]}${result.gateDecision ? ` — ${GATE_DECISION_LABELS[result.gateDecision]}` : ''}`,
							alignment: 'center',
							bold: true,
							fontSize: 13,
							color: '#ffffff',
							fillColor: colour,
							margin: [0, 8, 0, 8] as Margin
						}
					]
				]
			},
			layout: 'noBorders',
			margin: [0, 0, 0, 16] as Margin
		},
		{
			text: 'Optimisation domains',
			fontSize: 12,
			bold: true,
			margin: [0, 0, 0, 6] as Margin
		},
		{
			table: {
				widths: ['auto', 'auto', 'auto', 'auto', '*'],
				body: [
					[
						{ text: 'Domain', bold: true },
						{ text: 'Status', bold: true },
						{ text: 'Lead', bold: true },
						{ text: 'Short by', bold: true },
						{ text: 'Finding', bold: true }
					],
					...result.domains.map((d) => [
						DOMAIN_LABELS[d.domain],
						{
							text: STATUS_LABELS[d.status],
							color: STATUS_COLOURS[d.status] ?? '#4b5563',
							bold: d.status === 'insufficient-time'
						},
						`${d.leadTimeWeeks} w`,
						d.weeksShortfall === null ? '—' : `${d.weeksShortfall} w`,
						d.finding || '—'
					])
				]
			},
			layout: 'lightHorizontalLines',
			fontSize: 8,
			margin: [0, 0, 0, 16] as Margin
		},
		{
			text: 'Screening scores',
			fontSize: 12,
			bold: true,
			margin: [0, 0, 0, 6] as Margin
		},
		{
			table: {
				widths: ['*', '*'],
				body: [
					['MUST', result.mustScore === null ? '—' : `${result.mustScore} / 6 (${titleCase(result.mustRisk)})`],
					['AUDIT-C', result.auditCScore === null ? '—' : `${result.auditCScore} / 12`],
					['STOP-BANG', result.stopBangScore === null ? '—' : `${result.stopBangScore} / 8`],
					[
						'Duke Activity Status Index',
						result.dukeActivityStatusIndex === null ? '—' : String(result.dukeActivityStatusIndex)
					],
					[
						'Clinical Frailty Scale',
						result.clinicalFrailtyScale === null ? '—' : `${result.clinicalFrailtyScale} / 9`
					],
					['Body mass index', result.bmi === null ? '—' : `${result.bmi} kg/m²`]
				]
			},
			layout: 'lightHorizontalLines',
			fontSize: 9,
			margin: [0, 0, 0, 16] as Margin
		},
		{ text: 'Safety flags', fontSize: 12, bold: true, margin: [0, 0, 0, 6] as Margin },
		result.flags.length === 0
			? {
					text: 'No safety flags raised.',
					fontSize: 9,
					italics: true,
					margin: [0, 0, 0, 16] as Margin
				}
			: {
					table: {
						widths: ['auto', '*', '*'],
						body: [
							[
								{ text: 'Priority', bold: true },
								{ text: 'Finding', bold: true },
								{ text: 'Suggested action', bold: true }
							],
							...result.flags.map((f) => [
								{
									text: f.priority.toUpperCase(),
									color: f.priority === 'high' ? '#dc2626' : '#d97706'
								},
								f.description,
								f.suggestedAction
							])
						]
					},
					layout: 'lightHorizontalLines',
					fontSize: 8,
					margin: [0, 0, 0, 16] as Margin
				},
		{
			text: 'Prehabilitation plan',
			fontSize: 12,
			bold: true,
			margin: [0, 0, 0, 6] as Margin
		},
		{
			table: {
				widths: ['auto', '*'],
				body: [
					['Anaemia', data.plan.planAnaemia || '—'],
					['Glycaemic control', data.plan.planGlycaemicControl || '—'],
					['Smoking', data.plan.planSmoking || '—'],
					['Alcohol', data.plan.planAlcohol || '—'],
					['Nutrition', data.plan.planNutrition || '—'],
					['Physical fitness', data.plan.planPhysicalFitness || '—'],
					['Medication', data.plan.planMedication || '—'],
					['Cardiorespiratory', data.plan.planCardiorespiratory || '—'],
					['Responsible clinician', data.plan.responsibleClinician || '—'],
					['Next review', data.plan.nextReviewDate || '—']
				]
			},
			layout: 'lightHorizontalLines',
			fontSize: 8,
			margin: [0, 0, 0, 16] as Margin
		},
		{
			text: `Gate decision: ${data.signoff.gateDecision ? GATE_DECISION_LABELS[data.signoff.gateDecision] : 'not recorded'}`,
			fontSize: 10,
			bold: true,
			margin: [0, 4, 0, 2] as Margin
		},
		{
			text: `Signed by ${data.signoff.signedByName || '— not yet signed —'}, ${titleCase(data.assessment.role) || 'assessor'}`,
			fontSize: 10,
			margin: [0, 0, 0, 6] as Margin
		},
		{
			text:
				'This report is clinical decision support. It does not diagnose and does not decide ' +
				'whether surgery goes ahead; that decision belongs to the responsible surgical and ' +
				'anaesthetic team. Thresholds follow NHS England, CPOC, and NICE guidance.',
			fontSize: 8,
			italics: true,
			color: '#6b7280'
		}
	);

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'PERIOPERATIVE OPTIMISATION — REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(generatedAt).toLocaleString()} | NHS England · CPOC · NICE NG45/NG180`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content
	};
}
