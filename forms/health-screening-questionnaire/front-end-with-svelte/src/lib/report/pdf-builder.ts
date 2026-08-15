import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import {
	AUDIT_C_BAND_LABELS,
	PARQ_CLEARANCE_LABELS,
	RECOMMENDATION_LABELS,
	RISK_BAND_LABELS
} from '$lib/engine/grader';
import type { HealthScreeningQuestionnaire, GradingResult } from '$lib/engine/types';
import { titleCase } from '$lib/engine/utils';

type Margin = [number, number, number, number];

const RISK_COLOURS: Record<string, string> = {
	low: '#16a34a',
	moderate: '#d97706',
	high: '#ea580c',
	'refer-urgently': '#dc2626'
};

/** Builds the pdfmake document definition for the health screening questionnaire report. */
export function buildPdfDocument(
	data: HealthScreeningQuestionnaire,
	result: GradingResult,
	generatedAt: string
): TDocumentDefinitions {
	const riskColour = RISK_COLOURS[result.finalRiskBand] ?? '#4b5563';
	const patientName = data.patient.name.trim() || 'Not named';

	const content: TDocumentDefinitions['content'] = [
		{
			text: 'HEALTH SCREENING QUESTIONNAIRE',
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
				data.patient.identifierValue ? `${titleCase(data.patient.identifierType)} ${data.patient.identifierValue}` : '',
				data.patient.birthDate ? `DOB ${data.patient.birthDate}` : '',
				data.context.assessmentDate ? `Assessed ${data.context.assessmentDate}` : ''
			]
				.filter(Boolean)
				.join('  ·  '),
			fontSize: 9,
			alignment: 'center',
			color: '#6b7280',
			margin: [0, 0, 0, 16] as Margin
		}
	];

	if (result.isPaediatric) {
		content.push({
			text:
				'Paediatric respondent. PAR-Q+ and AUDIT-C are not validated below 16 years. This screen ' +
				'has not been scored; redirect to a paediatric-specific health-screening pathway.',
			fontSize: 9,
			italics: true,
			color: '#b45309',
			margin: [0, 0, 0, 10] as Margin
		});
	} else if (result.finalRiskBand !== result.computedRiskBand) {
		content.push({
			text:
				`Assessor override. Computed risk band was ${titleCase(result.computedRiskBand)}; ` +
				`the assessor recorded ${titleCase(result.finalRiskBand)}. ` +
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
							text: `${result.isPaediatric ? 'Not scored — paediatric' : RISK_BAND_LABELS[result.finalRiskBand || 'low']} — ${RECOMMENDATION_LABELS[result.finalRecommendation || 'clear-to-proceed']}`,
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
		{ text: 'PAR-Q+ — Physical Activity Readiness Questionnaire', fontSize: 12, bold: true, margin: [0, 0, 0, 6] as Margin },
		{
			text: result.parqPlusClearance ? PARQ_CLEARANCE_LABELS[result.parqPlusClearance] : 'Not completed',
			fontSize: 10,
			margin: [0, 0, 0, 16] as Margin
		},
		{ text: 'AUDIT-C — Alcohol Use Screen', fontSize: 12, bold: true, margin: [0, 0, 0, 6] as Margin },
		{
			text:
				(result.auditCScore === null ? 'Not completed' : `${result.auditCScore} / 12`) +
				(result.auditCBand ? ` — ${AUDIT_C_BAND_LABELS[result.auditCBand]}` : ''),
			fontSize: 10,
			margin: [0, 0, 0, 16] as Margin
		}
	);

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
		{ text: 'Notes', fontSize: 12, bold: true, margin: [0, 0, 0, 6] as Margin },
		{ text: data.summary.notes || '—', fontSize: 10, margin: [0, 0, 0, 16] as Margin },
		{
			text: `Signed by ${data.summary.signedByName || '— not yet signed —'}, ${data.assessor.role || 'assessor'}${
				data.assessor.registrationNumber
					? ` (${data.assessor.registrationBody} ${data.assessor.registrationNumber})`
					: ''
			}`,
			fontSize: 10,
			bold: true,
			margin: [0, 8, 0, 4] as Margin
		},
		{
			text:
				'This report is clinical decision support. It does not make a diagnosis and does not ' +
				'replace the clinical judgement of a qualified professional. PAR-Q+ is reproduced with ' +
				'attribution to the PAR-Q+ Collaboration; AUDIT-C is reproduced with attribution to Bush ' +
				'et al. 1998.',
			fontSize: 8,
			italics: true,
			color: '#6b7280'
		}
	);

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'HEALTH SCREENING QUESTIONNAIRE — REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(generatedAt).toLocaleString()} | PAR-Q+ · AUDIT-C`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content
	};
}
