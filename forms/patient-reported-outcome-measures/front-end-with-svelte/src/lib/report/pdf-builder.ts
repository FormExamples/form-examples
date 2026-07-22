import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AllScoresResult, PatientReportedOutcomeMeasures } from '$lib/engine/types';

function fmt(v: number | null | undefined, digits = 1): string {
	return v === null || v === undefined ? 'N/A' : v.toFixed(digits);
}

export function buildPdfDocument(
	data: PatientReportedOutcomeMeasures,
	result: AllScoresResult
): TDocumentDefinitions {
	const v = data.visitDetails;

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'PATIENT-REPORTED OUTCOME MEASURES REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date().toLocaleString()}`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: `${v.subjectId || 'N/A'} — ${v.visit || 'N/A'}`,
				fontSize: 20,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `Assessment date: ${v.assessmentDate || 'N/A'}`,
				fontSize: 11,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 20] as [number, number, number, number]
			},

			sectionHeader('SF-36v2 domain scores (0-100, higher = better)'),
			{
				table: {
					headerRows: 1,
					widths: ['*', 'auto'],
					body: [
						[
							{ text: 'Domain', bold: true, fontSize: 9 },
							{ text: 'Score', bold: true, fontSize: 9 }
						],
						['Physical Functioning (PF)', fmt(result.sf36.pf)],
						['Role-Physical (RP)', fmt(result.sf36.rp)],
						['Bodily Pain (BP)', fmt(result.sf36.bp)],
						['General Health (GH)', fmt(result.sf36.gh)],
						['Vitality (VT)', fmt(result.sf36.vt)],
						['Social Functioning (SF)', fmt(result.sf36.sf)],
						['Role-Emotional (RE)', fmt(result.sf36.re)],
						['Mental Health (MH)', fmt(result.sf36.mh)]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 8] as [number, number, number, number]
			},
			{
				text: `PCS (approx.): ${fmt(result.sf36.pcsApprox)}   MCS (approx.): ${fmt(result.sf36.mcsApprox)}`,
				fontSize: 9,
				bold: true,
				margin: [0, 0, 0, 4] as [number, number, number, number]
			},
			{
				text: 'Simplified, non-licensed unweighted-average approximations — not the licensed QualityMetric norm-based SF-36v2 PCS/MCS.',
				fontSize: 8,
				italics: true,
				color: '#6b7280',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Neck Disability Index (NDI)'),
			{
				text: `${result.ndi.percentageScore === null ? 'N/A' : fmt(result.ndi.percentageScore) + '%'}  (${result.ndi.band || 'not scored'})  — raw ${result.ndi.rawScore} / ${result.ndi.answeredSections} sections answered`,
				fontSize: 10,
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('modified JOA (mJOA)'),
			{
				text:
					result.mjoa.totalScore === null
						? 'N/A'
						: `${result.mjoa.totalScore} of 17 (${result.mjoa.band})`,
				fontSize: 10,
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('EQ-5D-3L'),
			{
				text: `Health state: ${result.eq5d.healthStateDescriptor || 'N/A'}   UK index: ${result.eq5d.ukIndexValue === null ? 'N/A' : result.eq5d.ukIndexValue.toFixed(3)}   VAS: ${result.eq5d.vasScore ?? 'N/A'}`,
				fontSize: 10,
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			{
				text: 'There is no single composite score across the four instruments — each is scored independently.',
				fontSize: 8,
				italics: true,
				color: '#6b7280'
			}
		],
		defaultStyle: {
			fontSize: 10
		}
	};
}

function sectionHeader(text: string) {
	return {
		text,
		fontSize: 14,
		bold: true,
		color: '#1f2937',
		margin: [0, 8, 0, 8] as [number, number, number, number]
	};
}
