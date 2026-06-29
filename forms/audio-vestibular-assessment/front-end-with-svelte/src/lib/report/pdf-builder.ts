import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '$lib/engine/types';
import { calculateAge, hearingLossGradeLabel, dhiHandicapLabel } from '$lib/engine/utils';

export function buildPdfDocument(
	data: AssessmentData,
	result: GradingResult
): TDocumentDefinitions {
	const age = calculateAge(data.demographics.dateOfBirth);

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'AUDIO-VESTIBULAR ASSESSMENT REPORT',
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
			// Headline grades
			{
				text: hearingLossGradeLabel(result.hearingLossGrade),
				fontSize: 22,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text:
					result.betterEarPta == null
						? 'Better-ear PTA: not assessed'
						: `Better-ear PTA: ${result.betterEarPta} dB HL${result.asymmetry == null ? '' : `  ·  asymmetry ${result.asymmetry} dB`}`,
				fontSize: 11,
				alignment: 'center',
				color: '#4b5563',
				margin: [0, 0, 0, 4]
			},
			{
				text: `DHI ${result.dhiTotal}/100 — ${dhiHandicapLabel(result.dhiHandicapLevel)} (${result.dhiAnsweredCount} of 25 items answered)`,
				fontSize: 11,
				alignment: 'center',
				color: '#4b5563',
				margin: [0, 0, 0, 20]
			},

			// Patient details
			sectionHeader('Patient Details'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Name', `${data.demographics.firstName} ${data.demographics.lastName}`),
							field('DOB', `${data.demographics.dateOfBirth}${age ? ` (Age ${age})` : ''}`)
						],
						[
							field('Sex', data.demographics.sex || 'N/A'),
							field('Assessed', data.demographics.assessmentDate || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Pure-tone audiometry
			sectionHeader('Pure-Tone Audiometry'),
			{
				table: {
					headerRows: 1,
					widths: ['*', 'auto', '*'],
					body: [
						[
							{ text: 'Ear', bold: true, fontSize: 9 },
							{ text: 'PTA (dB HL)', bold: true, fontSize: 9 },
							{ text: 'WHO grade', bold: true, fontSize: 9 }
						],
						[
							{ text: 'Right', fontSize: 9 },
							{ text: result.rightPta == null ? '—' : String(result.rightPta), fontSize: 9 },
							{ text: hearingLossGradeLabel(result.rightHearingLossGrade), fontSize: 9 }
						],
						[
							{ text: 'Left', fontSize: 9 },
							{ text: result.leftPta == null ? '—' : String(result.leftPta), fontSize: 9 },
							{ text: hearingLossGradeLabel(result.leftHearingLossGrade), fontSize: 9 }
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// DHI subscales
			sectionHeader('Dizziness Handicap Inventory — Subscales'),
			{
				table: {
					widths: ['*', '*', '*'],
					body: [
						[
							field('Functional (max 36)', String(result.dhiFunctional)),
							field('Emotional (max 36)', String(result.dhiEmotional)),
							field('Physical (max 28)', String(result.dhiPhysical))
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Flagged issues
			...(result.additionalFlags.length > 0
				? [
						sectionHeader('Flagged Issues'),
						{
							ul: result.additionalFlags.map((f) => ({
								text: `[${f.priority.toUpperCase()}] ${f.category}: ${f.message}`,
								color:
									f.priority === 'urgent' || f.priority === 'high'
										? '#dc2626'
										: f.priority === 'medium'
											? '#d97706'
											: '#4b5563',
								margin: [0, 2, 0, 2] as [number, number, number, number]
							})),
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			// Clinical impression
			...(data.clinicalImpressionReferral.provisionalDiagnosis
				? [
						sectionHeader('Clinical Impression'),
						{
							text: data.clinicalImpressionReferral.provisionalDiagnosis,
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
			{ text: `${label}: `, bold: true, color: '#6b7280' },
			{ text: value }
		],
		margin: [0, 4, 0, 4] as [number, number, number, number]
	};
}
