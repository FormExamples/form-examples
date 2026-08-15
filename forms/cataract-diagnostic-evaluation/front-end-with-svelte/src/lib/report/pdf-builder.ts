import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import { LOCS_III_SEVERITY_LABELS, SURGICAL_CANDIDACY_LABELS } from '$lib/engine/grader';
import type { CataractDiagnosticEvaluation, GradingResult } from '$lib/engine/types';
import { titleCase } from '$lib/engine/utils';

type Margin = [number, number, number, number];

const CANDIDACY_COLOURS: Record<string, string> = {
	'not-indicated': '#16a34a',
	consider: '#d97706',
	indicated: '#ea580c',
	'urgent-referral': '#dc2626'
};

/** Builds the pdfmake document definition for the cataract diagnostic evaluation report. */
export function buildPdfDocument(
	data: CataractDiagnosticEvaluation,
	result: GradingResult,
	generatedAt: string
): TDocumentDefinitions {
	const candidacyColour = CANDIDACY_COLOURS[result.finalSurgicalCandidacy] ?? '#4b5563';
	const patientName = `${data.patient.firstName} ${data.patient.lastName}`.trim() || 'Patient not named';

	const content: TDocumentDefinitions['content'] = [
		{
			text: 'CATARACT DIAGNOSTIC EVALUATION',
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

	if (result.finalSurgicalCandidacy !== result.computedSurgicalCandidacy) {
		content.push({
			text:
				`Clinician override. Computed candidacy was ${SURGICAL_CANDIDACY_LABELS[result.computedSurgicalCandidacy]}; ` +
				`the clinician recorded ${SURGICAL_CANDIDACY_LABELS[result.finalSurgicalCandidacy]}. ` +
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
							text: SURGICAL_CANDIDACY_LABELS[result.finalSurgicalCandidacy] ?? result.finalSurgicalCandidacy,
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
		{ text: 'LOCS III — Lens Opacities Classification System III', fontSize: 12, bold: true, margin: [0, 0, 0, 6] as Margin },
		{
			table: {
				widths: ['auto', '*', '*', '*', '*', '*'],
				body: [
					[
						{ text: 'Eye', bold: true },
						{ text: 'NO', bold: true },
						{ text: 'NC', bold: true },
						{ text: 'C', bold: true },
						{ text: 'P', bold: true },
						{ text: 'Severity', bold: true }
					],
					[
						'Right',
						String(data.slitLamp.locsIiiNoRight ?? '—'),
						String(data.slitLamp.locsIiiNcRight ?? '—'),
						String(data.slitLamp.locsIiiCRight ?? '—'),
						String(data.slitLamp.locsIiiPRight ?? '—'),
						LOCS_III_SEVERITY_LABELS[result.locsIIISeverityRight] ?? '—'
					],
					[
						'Left',
						String(data.slitLamp.locsIiiNoLeft ?? '—'),
						String(data.slitLamp.locsIiiNcLeft ?? '—'),
						String(data.slitLamp.locsIiiCLeft ?? '—'),
						String(data.slitLamp.locsIiiPLeft ?? '—'),
						LOCS_III_SEVERITY_LABELS[result.locsIIISeverityLeft] ?? '—'
					]
				]
			},
			layout: 'lightHorizontalLines',
			margin: [0, 0, 0, 16] as Margin
		},
		{ text: 'Visual acuity & glare', fontSize: 12, bold: true, margin: [0, 0, 0, 6] as Margin },
		{
			table: {
				widths: ['*', '*'],
				body: [
					[
						'Best-corrected VA — right',
						`${data.acuity.bestCorrectedVaLogmarRight ?? '—'} LogMAR${data.acuity.bestCorrectedVaSnellenRight ? ` (${data.acuity.bestCorrectedVaSnellenRight})` : ''}`
					],
					[
						'Best-corrected VA — left',
						`${data.acuity.bestCorrectedVaLogmarLeft ?? '—'} LogMAR${data.acuity.bestCorrectedVaSnellenLeft ? ` (${data.acuity.bestCorrectedVaSnellenLeft})` : ''}`
					],
					['Glare functional impact', titleCase(data.glare.glareFunctionalImpact) || '—'],
					[
						'Functional impact score',
						result.functionalImpactScore === null ? '—' : `${result.functionalImpactScore} / 12`
					]
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
					['Recommendation', titleCase(data.management.managementRecommendation) || '—'],
					['Eye(s) for surgery', titleCase(data.management.eyeForSurgery) || '—'],
					['Risks and benefits counselled', titleCase(data.management.risksBenefitsCounselled) || '—'],
					['Consent discussed', titleCase(data.management.consentDiscussed) || '—'],
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
				'replace the clinical judgement of an optometrist or ophthalmologist. LOCS III is ' +
				'reproduced with attribution to Chylack et al., Arch Ophthalmol 1993.',
			fontSize: 8,
			italics: true,
			color: '#6b7280'
		}
	);

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'CATARACT DIAGNOSTIC EVALUATION — REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(generatedAt).toLocaleString()} | LOCS III (Chylack et al. 1993)`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content
	};
}
