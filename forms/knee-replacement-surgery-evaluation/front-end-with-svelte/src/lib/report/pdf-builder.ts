import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import { CANDIDACY_LABELS, OKS_CATEGORY_LABELS } from '$lib/engine/grader';
import type { GradingResult, KneeReplacementSurgeryEvaluation } from '$lib/engine/types';
import { titleCase } from '$lib/engine/utils';

type Margin = [number, number, number, number];

const CANDIDACY_COLOURS: Record<string, string> = {
	'strong-candidate': '#dc2626',
	candidate: '#ea580c',
	'continue-conservative': '#d97706',
	'not-indicated': '#16a34a',
	'mdt-review': '#4b5563'
};

/** Builds the pdfmake document definition for the knee-replacement surgery evaluation report. */
export function buildPdfDocument(
	data: KneeReplacementSurgeryEvaluation,
	result: GradingResult,
	generatedAt: string
): TDocumentDefinitions {
	const candidacyColour = CANDIDACY_COLOURS[result.finalCandidacy] ?? '#4b5563';
	const patientName = data.patient.name.trim() || 'Patient not named';

	const content: TDocumentDefinitions['content'] = [
		{
			text: 'KNEE REPLACEMENT SURGERY EVALUATION',
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
				data.history.kneeSide ? `Knee ${titleCase(data.history.kneeSide)}` : '',
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
				`Clinician override. Computed candidacy was ${titleCase(result.computedCandidacy)}; ` +
				`the clinician recorded ${titleCase(result.finalCandidacy)}. ` +
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
							text: `${OKS_CATEGORY_LABELS[result.finalOksCategory]} — ${CANDIDACY_LABELS[result.finalCandidacy] ?? result.finalCandidacy}`,
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
		{ text: 'Oxford Knee Score', fontSize: 12, bold: true, margin: [0, 0, 0, 6] as Margin },
		{
			table: {
				widths: ['*', 'auto'],
				body: [
					[
						{ text: 'Item', bold: true },
						{ text: 'Score (0 worst – 4 best)', bold: true, alignment: 'right' }
					],
					['1. Usual knee pain severity', { text: String(result.oksItemScores.oksPainSeverity ?? '—'), alignment: 'right' }],
					['2. Washing and drying difficulty', { text: String(result.oksItemScores.oksWashingAndDrying ?? '—'), alignment: 'right' }],
					['3. Transport (car / public transport)', { text: String(result.oksItemScores.oksTransport ?? '—'), alignment: 'right' }],
					['4. Walking distance before severe pain', { text: String(result.oksItemScores.oksWalkingDistance ?? '—'), alignment: 'right' }],
					['5. Pain sitting or lying', { text: String(result.oksItemScores.oksPainSittingOrLying ?? '—'), alignment: 'right' }],
					['6. Limping when walking', { text: String(result.oksItemScores.oksLimping ?? '—'), alignment: 'right' }],
					['7. Kneeling difficulty', { text: String(result.oksItemScores.oksKneeling ?? '—'), alignment: 'right' }],
					['8. Night pain frequency', { text: String(result.oksItemScores.oksNightPainFrequency ?? '—'), alignment: 'right' }],
					['9. Pain interfering with work', { text: String(result.oksItemScores.oksPainInterferingWithWork ?? '—'), alignment: 'right' }],
					['10. Knee giving way', { text: String(result.oksItemScores.oksGivingWay ?? '—'), alignment: 'right' }],
					['11. Household shopping', { text: String(result.oksItemScores.oksShopping ?? '—'), alignment: 'right' }],
					['12. Walking down stairs', { text: String(result.oksItemScores.oksStairs ?? '—'), alignment: 'right' }],
					[
						{ text: `OKS total — ${OKS_CATEGORY_LABELS[result.finalOksCategory]}`, bold: true },
						{ text: `${result.oksTotal} / 48`, bold: true, alignment: 'right' }
					]
				]
			},
			layout: 'lightHorizontalLines',
			margin: [0, 0, 0, 16] as Margin
		},
		{ text: 'Secondary instrument', fontSize: 12, bold: true, margin: [0, 0, 0, 6] as Margin },
		{
			table: {
				widths: ['*', '*'],
				body: [
					['Kellgren-Lawrence grade (medial)', String(data.imaging.kellgrenLawrenceGradeMedial ?? '—')],
					['Kellgren-Lawrence grade (lateral)', String(data.imaging.kellgrenLawrenceGradeLateral ?? '—')],
					['Kellgren-Lawrence grade (patellofemoral)', String(data.imaging.kellgrenLawrenceGradePatellofemoral ?? '—')],
					['Highest Kellgren-Lawrence grade', String(result.maxKellgrenLawrenceGrade ?? '—')],
					['Conservative measures exhausted', titleCase(data.conservative.conservativeMeasuresExhausted) || '—']
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
		{ text: 'Management plan', fontSize: 12, bold: true, margin: [0, 0, 0, 6] as Margin },
		{
			table: {
				widths: ['*', '*'],
				body: [
					['Recommendation', data.plan.planRecommendation ? titleCase(data.plan.planRecommendation) : '—'],
					['Target list date', data.plan.targetListDate || '—'],
					['Responsible surgeon', data.plan.responsibleSurgeon || '—']
				]
			},
			layout: 'lightHorizontalLines',
			fontSize: 9,
			margin: [0, 0, 0, 16] as Margin
		},
		{
			text: `Signed by ${data.summary.signedByName || '— not yet signed —'}, ${data.clinician.role ? titleCase(data.clinician.role) : 'clinician'}${
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
				'replace the clinical judgement of the orthopaedic surgeon or extended-scope ' +
				'physiotherapist. The Oxford Knee Score is reproduced with attribution to Dawson, ' +
				'Fitzpatrick, Murray & Carr (1998).',
			fontSize: 8,
			italics: true,
			color: '#6b7280'
		}
	);

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'KNEE REPLACEMENT SURGERY EVALUATION — REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(generatedAt).toLocaleString()} | Oxford Knee Score · Kellgren-Lawrence`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content
	};
}
