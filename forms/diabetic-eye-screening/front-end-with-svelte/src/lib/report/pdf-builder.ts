import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import {
	ageBandLabel,
	diabetesTypeLabel,
	graderRoleLabel,
	imagingMediaLabel,
	maculopathyLabel,
	outcomeLabel,
	photocoagulationLabel,
	priorityLabel,
	recallIntervalLabel,
	referralLabel,
	retinopathyLabel,
	statusLabel,
	ungradableLabel
} from '#lib/engine/utils.js';

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	const outcomeRows: [string, string][] = [
		['Outcome / recall pathway', outcomeLabel(result.recallPathway) || 'N/A'],
		['Recall interval', recallIntervalLabel(result.recallIntervalMonths)],
		['Referral', referralLabel(result.referral) || 'N/A'],
		['Worst-eye retinopathy', retinopathyLabel(result.worstRetinopathy) || result.worstRetinopathy],
		['Worst-eye maculopathy', maculopathyLabel(result.worstMaculopathy) || result.worstMaculopathy],
		['Any eye ungradable', result.anyUngradable ? 'Yes' : 'No']
	];

	const eyeRow = (eye: AssessmentData['rightEye']): [string, string, string, string] => [
		retinopathyLabel(eye.retinopathy) || '—',
		maculopathyLabel(eye.maculopathy) || '—',
		photocoagulationLabel(eye.photocoagulation) || '—',
		ungradableLabel(eye.ungradable) || '—'
	];

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'DIABETIC EYE SCREENING RESULT REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.timestamp).toLocaleString()}`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: outcomeLabel(result.recallPathway),
				fontSize: 22,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `${referralLabel(result.referral)} · ${statusLabel(result.status)}`,
				fontSize: 12,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 20] as [number, number, number, number]
			},

			sectionHeader('Grading context'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Grader', data.context.graderName || 'N/A'),
							field('Role', graderRoleLabel(data.context.graderRole) || 'N/A')
						],
						[
							field('Graded', data.context.gradedAt || 'N/A'),
							field('Images captured', data.context.imageCapturedAt || 'N/A')
						],
						[field('Imaging media', imagingMediaLabel(data.context.imagingMedia) || 'N/A'), field('', '')]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Patient'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Identifier', data.identification.patientIdentifier || 'N/A'),
							field('Age band', ageBandLabel(data.identification.ageBand) || 'N/A')
						],
						[
							field('Diabetes type', diabetesTypeLabel(data.identification.diabetesType) || 'N/A'),
							field(
								'Years since diagnosis',
								data.identification.yearsSinceDiagnosis !== null
									? String(data.identification.yearsSinceDiagnosis)
									: 'N/A'
							)
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Per-eye grading'),
			{
				table: {
					headerRows: 1,
					widths: ['auto', '*', '*', '*', '*'],
					body: [
						[
							{ text: 'Eye', fontSize: 9, bold: true },
							{ text: 'Retinopathy (R)', fontSize: 9, bold: true },
							{ text: 'Maculopathy (M)', fontSize: 9, bold: true },
							{ text: 'Photocoagulation (P)', fontSize: 9, bold: true },
							{ text: 'Ungradable (U)', fontSize: 9, bold: true }
						],
						[{ text: 'Right', fontSize: 9, bold: true }, ...eyeRow(data.rightEye).map((t) => ({ text: t, fontSize: 9 }))],
						[{ text: 'Left', fontSize: 9, bold: true }, ...eyeRow(data.leftEye).map((t) => ({ text: t, fontSize: 9 }))]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Outcome'),
			{
				table: {
					headerRows: 0,
					widths: ['*', 'auto'],
					body: outcomeRows.map((row) => [
						{ text: row[0], fontSize: 9 },
						{ text: row[1], fontSize: 9, bold: true }
					])
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			...(result.flaggedIssues.length > 0
				? [
						sectionHeader(`Flagged issues (${result.flaggedIssues.length})`),
						{
							ul: result.flaggedIssues.map((f) => ({
								text: `[${priorityLabel(f.priority)}] ${f.category}: ${f.description} — ${f.suggestedAction}`,
								color:
									f.priority === 'high' ? '#dc2626' : f.priority === 'medium' ? '#d97706' : '#4b5563',
								margin: [0, 2, 0, 2] as [number, number, number, number]
							})),
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			...(data.note.clinicalContext
				? [
						sectionHeader('Clinical note'),
						{
							text: data.note.clinicalContext,
							fontSize: 10,
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: [])
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

function field(label: string, value: string) {
	return {
		text: [
			{ text: label ? `${label}: ` : '', bold: true, color: '#6b7280' },
			{ text: value }
		],
		margin: [0, 4, 0, 4] as [number, number, number, number]
	};
}
