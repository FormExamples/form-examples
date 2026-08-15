import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import {
	COMPOSITE_RISK_LABELS,
	GLIM_DIAGNOSIS_LABELS,
	MUST_RISK_LABELS,
	RECOMMENDATION_LABELS
} from '#lib/engine/grader.js';
import type { DieticAssessment, GradingResult } from '#lib/engine/types.js';
import { titleCase } from '#lib/engine/utils.js';

type Margin = [number, number, number, number];

const RISK_COLOURS: Record<string, string> = {
	low: '#16a34a',
	moderate: '#d97706',
	high: '#ea580c',
	critical: '#dc2626'
};

/** Builds the pdfmake document definition for the dietetic assessment report. */
export function buildPdfDocument(
	data: DieticAssessment,
	result: GradingResult,
	generatedAt: string
): TDocumentDefinitions {
	const riskColour = RISK_COLOURS[result.finalCompositeRisk] ?? '#4b5563';
	const patientName = `${data.patient.firstName} ${data.patient.lastName}`.trim() || 'Patient not named';

	const content: TDocumentDefinitions['content'] = [
		{
			text: 'DIETETIC ASSESSMENT',
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
				data.patient.birthDate ? `DOB ${data.patient.birthDate}` : '',
				data.dietitian.assessmentDate ? `Assessed ${data.dietitian.assessmentDate}` : ''
			]
				.filter(Boolean)
				.join('  ·  '),
			fontSize: 9,
			alignment: 'center',
			color: '#6b7280',
			margin: [0, 0, 0, 16] as Margin
		}
	];

	if (result.mustIsEstimated) {
		content.push({
			text:
				'This MUST score is an estimate. One or more components was derived from ' +
				'mid-upper-arm circumference, the subjective weight-loss criterion, or an ' +
				'adjusted weight. Treat the risk category as indicative and repeat the screen ' +
				'when a measured height and weight are available.',
			fontSize: 9,
			italics: true,
			color: '#b45309',
			margin: [0, 0, 0, 10] as Margin
		});
	}

	if (result.finalCompositeRisk !== result.computedCompositeRisk) {
		content.push({
			text:
				`Dietitian override. Computed risk was ${titleCase(result.computedCompositeRisk)}; ` +
				`the dietitian recorded ${titleCase(result.finalCompositeRisk)}. ` +
				`Reason: ${result.overrideReason || 'not stated'}. ` +
				'Safety flags below are unaffected by the override.',
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
							text: `${COMPOSITE_RISK_LABELS[result.finalCompositeRisk]} — ${RECOMMENDATION_LABELS[result.recommendation] ?? result.recommendation}`,
							alignment: 'center',
							bold: true,
							fontSize: 13,
							color: '#ffffff',
							fillColor: riskColour,
							margin: [0, 8, 0, 8] as Margin
						}
					]
				]
			},
			layout: 'noBorders',
			margin: [0, 0, 0, 16] as Margin
		},
		{ text: 'MUST — Malnutrition Universal Screening Tool', fontSize: 12, bold: true, margin: [0, 0, 0, 6] as Margin },
		{
			table: {
				widths: ['*', 'auto'],
				body: [
					[
						{ text: 'Component', bold: true },
						{ text: 'Score', bold: true, alignment: 'right' }
					],
					[
						`Step 1 · Body mass index${result.bmi === null ? ' (estimated)' : ` (${result.bmi} kg/m²)`}`,
						{ text: String(result.mustBmiScore), alignment: 'right' }
					],
					[
						`Step 2 · Unplanned weight loss${result.weightLossPercent === null ? '' : ` (${result.weightLossPercent}%)`}`,
						{ text: String(result.mustWeightLossScore), alignment: 'right' }
					],
					['Step 3 · Acute disease effect', { text: String(result.mustAcuteDiseaseScore), alignment: 'right' }],
					[
						{ text: `MUST total — ${MUST_RISK_LABELS[result.mustRisk]}`, bold: true },
						{ text: `${result.mustScore} / 6`, bold: true, alignment: 'right' }
					]
				]
			},
			layout: 'lightHorizontalLines',
			margin: [0, 0, 0, 16] as Margin
		},
		{ text: 'Secondary instruments', fontSize: 12, bold: true, margin: [0, 0, 0, 6] as Margin },
		{
			table: {
				widths: ['*', '*'],
				body: [
					['GLIM', GLIM_DIAGNOSIS_LABELS[result.glimDiagnosis] ?? result.glimDiagnosis],
					['GLIM phenotypic criteria', result.glimPhenotypicCriteria.join(', ') || 'none'],
					['GLIM etiologic criteria', result.glimEtiologicCriteria.join(', ') || 'none'],
					['Refeeding-syndrome risk', titleCase(result.refeedingRisk)],
					['NRS-2002', result.nrs2002Score === null ? '—' : `${result.nrs2002Score} / 7`],
					['SARC-F', result.sarcfScore === null ? '—' : `${result.sarcfScore} / 10`],
					['SCOFF', result.scoffScore === null ? '—' : `${result.scoffScore} / 5`],
					[
						'Estimated requirements',
						[
							result.energyRequirementKcal === null ? null : `${result.energyRequirementKcal} kcal/day`,
							result.proteinRequirementG === null ? null : `${result.proteinRequirementG} g protein/day`
						]
							.filter(Boolean)
							.join(' · ') || '—'
					]
				]
			},
			layout: 'lightHorizontalLines',
			margin: [0, 0, 0, 16] as Margin
		}
	);

	const pesParts = [data.screening.pesProblem, data.screening.pesEtiology, data.screening.pesSignsSymptoms];
	if (pesParts.some((p) => p.trim())) {
		content.push(
			{ text: 'Nutrition and dietetic diagnosis', fontSize: 12, bold: true, margin: [0, 0, 0, 6] as Margin },
			{
				text:
					`${data.screening.pesProblem || '—'} related to ${data.screening.pesEtiology || '—'} ` +
					`as evidenced by ${data.screening.pesSignsSymptoms || '—'}.`,
				fontSize: 10,
				margin: [0, 0, 0, 16] as Margin
			}
		);
	}

	content.push(
		{ text: 'Safety flags', fontSize: 12, bold: true, margin: [0, 0, 0, 6] as Margin },
		result.flags.length === 0
			? { text: 'No safety flags raised.', fontSize: 10, italics: true, margin: [0, 0, 0, 16] as Margin }
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
								{ text: f.priority.toUpperCase(), color: f.priority === 'high' ? '#dc2626' : '#d97706' },
								f.description,
								f.suggestedAction
							])
						]
					},
					layout: 'lightHorizontalLines',
					fontSize: 9,
					margin: [0, 0, 0, 16] as Margin
				}
	);

	content.push(
		{ text: 'Nutrition care plan', fontSize: 12, bold: true, margin: [0, 0, 0, 6] as Margin },
		{
			table: {
				widths: ['*', '*'],
				body: [
					['Intervention', titleCase(data.plan.interventionType) || '—'],
					['Prescribed supplement', data.plan.prescribedSupplement || '—'],
					['Goal 1', data.plan.goal1 || '—'],
					['Goal 2', data.plan.goal2 || '—'],
					['Goal 3', data.plan.goal3 || '—'],
					['Monitoring', data.plan.monitoringIndicators || '—'],
					['Review date', data.plan.reviewDate || '—'],
					['Onward referral', data.plan.onwardReferral || '—']
				]
			},
			layout: 'lightHorizontalLines',
			fontSize: 9,
			margin: [0, 0, 0, 16] as Margin
		},
		{
			text: `Signed by ${data.plan.signedByName || '— not yet signed —'}, ${data.dietitian.role || 'dietitian'}${
				data.dietitian.registrationNumber
					? ` (${data.dietitian.registrationBody} ${data.dietitian.registrationNumber})`
					: ''
			}`,
			fontSize: 10,
			bold: true,
			margin: [0, 8, 0, 4] as Margin
		},
		{
			text:
				'This report is clinical decision support. It does not make a diagnosis and does not ' +
				'replace the clinical judgement of a registered dietitian. MUST is reproduced with ' +
				'attribution to BAPEN.',
			fontSize: 8,
			italics: true,
			color: '#6b7280'
		}
	);

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'DIETETIC ASSESSMENT — REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(generatedAt).toLocaleString()} | BAPEN MUST · GLIM · NICE CG32`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content
	};
}
