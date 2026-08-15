import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import { OHS_ITEMS } from '#lib/config/ohs-items.js';
import { CANDIDACY_LABELS, OHS_CATEGORY_LABELS } from '#lib/engine/grader.js';
import type { GradingResult, HipReplacementSurgeryEvaluation } from '#lib/engine/types.js';
import { titleCase } from '#lib/engine/utils.js';

type Margin = [number, number, number, number];

const CANDIDACY_COLOURS: Record<string, string> = {
	'strong-candidate': '#16a34a',
	candidate: '#65a30d',
	'continue-conservative': '#d97706',
	'not-indicated': '#6b7280',
	'mdt-review': '#2563eb'
};

/** Builds the pdfmake document definition for the hip-replacement surgery evaluation report. */
export function buildPdfDocument(
	data: HipReplacementSurgeryEvaluation,
	result: GradingResult,
	generatedAt: string
): TDocumentDefinitions {
	const candidacyColour = CANDIDACY_COLOURS[result.finalCandidacy] ?? '#4b5563';
	const patientName = data.patient.name.trim() || 'Patient not named';

	const content: TDocumentDefinitions['content'] = [
		{
			text: 'HIP REPLACEMENT SURGERY EVALUATION',
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

	if (result.finalCandidacy !== result.computedCandidacy) {
		content.push({
			text:
				`Clinician override. Computed candidacy was ${CANDIDACY_LABELS[result.computedCandidacy] ?? result.computedCandidacy}; ` +
				`the clinician recorded ${CANDIDACY_LABELS[result.finalCandidacy] ?? result.finalCandidacy}. ` +
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
							text: `${CANDIDACY_LABELS[result.finalCandidacy] ?? result.finalCandidacy} — ${OHS_CATEGORY_LABELS[result.ohsCategory] ?? result.ohsCategory}`,
							alignment: 'center',
							bold: true,
							fontSize: 13,
							color: '#ffffff',
							fillColor: candidacyColour,
							margin: [0, 8, 0, 8] as Margin
						}
					]
				]
			},
			layout: 'noBorders',
			margin: [0, 0, 0, 16] as Margin
		},
		{ text: 'Oxford Hip Score (OHS)', fontSize: 12, bold: true, margin: [0, 0, 0, 6] as Margin },
		{
			table: {
				widths: ['*', 'auto'],
				body: [
					[
						{ text: 'Item', bold: true },
						{ text: 'Score', bold: true, alignment: 'right' }
					],
					...OHS_ITEMS.map((item) => [
						`${item.number}. ${item.question}`,
						{
							text: data.ohs[item.key] === null ? '—' : `${data.ohs[item.key]} / 4`,
							alignment: 'right' as const
						}
					]),
					[
						{ text: 'OHS total', bold: true },
						{ text: `${result.ohsTotal} / 48`, bold: true, alignment: 'right' }
					]
				]
			},
			layout: 'lightHorizontalLines',
			fontSize: 9,
			margin: [0, 0, 0, 16] as Margin
		},
		{ text: 'Imaging and candidacy factors', fontSize: 12, bold: true, margin: [0, 0, 0, 6] as Margin },
		{
			table: {
				widths: ['*', '*'],
				body: [
					[
						'Kellgren and Lawrence grade',
						result.kellgrenLawrenceGrade === null ? '—' : String(result.kellgrenLawrenceGrade)
					],
					['Body mass index', result.bmi === null ? '—' : `${result.bmi} kg/m²`],
					[
						'Conservative measures exhausted',
						titleCase(data.conservative.conservativeMeasuresExhausted) || '—'
					],
					['Computed candidacy', CANDIDACY_LABELS[result.computedCandidacy] ?? result.computedCandidacy],
					['Final candidacy', CANDIDACY_LABELS[result.finalCandidacy] ?? result.finalCandidacy]
				]
			},
			layout: 'lightHorizontalLines',
			fontSize: 9,
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
		{ text: 'Management plan', fontSize: 12, bold: true, margin: [0, 0, 0, 6] as Margin },
		{
			table: {
				widths: ['*', '*'],
				body: [
					['Recommendation', titleCase(data.plan.recommendation) || '—'],
					['Target list date', data.plan.targetListDate || '—'],
					['Responsible surgeon', data.plan.responsibleSurgeon || '—'],
					['Clinician notes', data.summary.clinicianNotes || '—'],
					['Additional notes', data.summary.additionalNotes || '—']
				]
			},
			layout: 'lightHorizontalLines',
			fontSize: 9,
			margin: [0, 0, 0, 16] as Margin
		},
		{
			text: `Signed by ${data.summary.signedByName || '— not yet signed —'}, ${data.clinician.role ? titleCase(data.clinician.role) : 'clinician'}${
				data.clinician.gmcNumber ? ` (${data.clinician.gmcNumber})` : ''
			}`,
			fontSize: 10,
			bold: true,
			margin: [0, 8, 0, 4] as Margin
		},
		{
			text:
				'This report is clinical decision support. It computes a validated outcome score and ' +
				'surfaces flags, but does not diagnose and does not replace the clinical judgement of the ' +
				'orthopaedic surgeon or extended-scope physiotherapist. Oxford Hip Score reproduced with ' +
				'attribution to Dawson et al. 1996 / Oxford University Innovation.',
			fontSize: 8,
			italics: true,
			color: '#6b7280'
		}
	);

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'HIP REPLACEMENT SURGERY EVALUATION — REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(generatedAt).toLocaleString()} | Oxford Hip Score · Kellgren and Lawrence`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content
	};
}
