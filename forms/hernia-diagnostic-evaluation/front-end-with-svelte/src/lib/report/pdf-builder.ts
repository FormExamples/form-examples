import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import { RECOMMENDATION_LABELS, URGENCY_LABELS } from '#lib/engine/grader.js';
import type { GradingResult, HerniaDiagnosticEvaluation } from '#lib/engine/types.js';
import { titleCase } from '#lib/engine/utils.js';

type Margin = [number, number, number, number];

const URGENCY_COLOURS: Record<string, string> = {
	routine: '#16a34a',
	soon: '#0284c7',
	urgent: '#d97706',
	emergency: '#dc2626'
};

/** Builds the pdfmake document definition for the hernia diagnostic evaluation report. */
export function buildPdfDocument(
	data: HerniaDiagnosticEvaluation,
	result: GradingResult,
	generatedAt: string
): TDocumentDefinitions {
	const urgencyColour = URGENCY_COLOURS[result.finalUrgency] ?? '#4b5563';
	const patientName = `${data.patient.firstName} ${data.patient.lastName}`.trim() || 'Patient not named';

	const content: TDocumentDefinitions['content'] = [
		{
			text: 'HERNIA DIAGNOSTIC EVALUATION',
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
				data.clinician.assessmentDate ? `Assessed ${data.clinician.assessmentDate}` : ''
			]
				.filter(Boolean)
				.join('  ·  '),
			fontSize: 9,
			alignment: 'center',
			color: '#6b7280',
			margin: [0, 0, 0, 16] as Margin
		}
	];

	if (result.anyRedFlag) {
		content.push({
			text:
				'At least one red-flag symptom was positive. Any positive red flag requires same-day ' +
				'clinical escalation regardless of what this report displays.',
			fontSize: 9,
			italics: true,
			color: '#dc2626',
			margin: [0, 0, 0, 10] as Margin
		});
	}

	if (result.finalUrgency !== result.computedUrgency) {
		content.push({
			text:
				`Clinician override. Computed urgency was ${URGENCY_LABELS[result.computedUrgency]}; ` +
				`the clinician recorded ${URGENCY_LABELS[result.finalUrgency]}. ` +
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
							text: `${URGENCY_LABELS[result.finalUrgency]} — ${RECOMMENDATION_LABELS[result.recommendation] ?? result.recommendation}`,
							alignment: 'center',
							bold: true,
							fontSize: 13,
							color: '#ffffff',
							fillColor: urgencyColour,
							margin: [0, 8, 0, 8] as Margin
						}
					]
				]
			},
			layout: 'noBorders',
			margin: [0, 0, 0, 16] as Margin
		},
		{ text: 'Classification', fontSize: 12, bold: true, margin: [0, 0, 0, 6] as Margin },
		{
			table: {
				widths: ['*', '*'],
				body: [
					['Hernia type', titleCase(result.herniaType) || '—'],
					['EHS subtype', titleCase(result.herniaSubtype) || '—'],
					['EHS classification', result.ehsClassification || '—'],
					['EHS size grade', result.ehsSizeGrade || '—'],
					['Reducibility status', titleCase(result.reducibilityStatus) || '—']
				]
			},
			layout: 'lightHorizontalLines',
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
		{ text: 'Fired rules', fontSize: 12, bold: true, margin: [0, 0, 0, 6] as Margin },
		result.firedRules.length === 0
			? { text: 'No rules fired.', fontSize: 10, italics: true, margin: [0, 0, 0, 16] as Margin }
			: {
					table: {
						widths: ['auto', '*'],
						body: [
							[
								{ text: 'Rule', bold: true },
								{ text: 'Why it fired', bold: true }
							],
							...result.firedRules.map((r) => [r.ruleId, r.description])
						]
					},
					layout: 'lightHorizontalLines',
					fontSize: 9,
					margin: [0, 0, 0, 16] as Margin
				}
	);

	content.push(
		{ text: 'Management plan', fontSize: 12, bold: true, margin: [0, 0, 0, 6] as Margin },
		{
			table: {
				widths: ['*', '*'],
				body: [
					['Management plan', titleCase(data.management.managementPlan) || '—'],
					['Conservative detail', data.management.conservativeDetail || '—'],
					['Referral made', titleCase(data.management.referralMade) || '—'],
					['Referral target timeframe', titleCase(data.management.referralTargetTimeframe) || '—'],
					['Management notes', data.management.managementNotes || '—']
				]
			},
			layout: 'lightHorizontalLines',
			fontSize: 9,
			margin: [0, 0, 0, 16] as Margin
		},
		{
			text: `Signed by ${data.summary.signedByName || '— not yet signed —'}, ${data.clinician.role || 'clinician'}${
				data.clinician.registrationNumber
					? ` (${data.clinician.registrationBody} ${data.clinician.registrationNumber})`
					: ''
			}`,
			fontSize: 10,
			bold: true,
			margin: [0, 8, 0, 4] as Margin
		},
		{
			text:
				'This report is clinical decision support. It does not make a diagnosis and does not ' +
				'replace the clinical judgement of the examining clinician.',
			fontSize: 8,
			italics: true,
			color: '#6b7280'
		}
	);

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'HERNIA DIAGNOSTIC EVALUATION — REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(generatedAt).toLocaleString()} | European Hernia Society classification`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content
	};
}
