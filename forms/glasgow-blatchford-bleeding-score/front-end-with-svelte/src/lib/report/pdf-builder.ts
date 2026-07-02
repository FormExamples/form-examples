import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '$lib/engine/types';
import {
	riskBandLabel,
	priorityLabel,
	careSettingLabel,
	clinicianRoleLabel,
	presentingComplaintLabel,
	sexLabel,
	ageBandLabel,
	yesNoLabel,
	formatPoint,
	formatScore
} from '$lib/engine/utils';

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	const urea = data.labs.bloodUrea;
	const hb = data.labs.haemoglobin;
	const sbp = data.haemodynamics.systolicBloodPressure;
	const pulse = data.haemodynamics.pulse;

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'GLASGOW-BLATCHFORD BLEEDING SCORE REPORT',
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
				text: `Glasgow-Blatchford ${formatScore(result.gbsScore, result.complete)} — ${riskBandLabel(result.riskBand)}`,
				fontSize: 22,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: result.recommendedManagement,
				fontSize: 11,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 20] as [number, number, number, number]
			},

			sectionHeader('Assessment context'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Clinician', data.context.clinicianName || 'N/A'),
							field('Role', clinicianRoleLabel(data.context.clinicianRole) || 'N/A')
						],
						[
							field('Care setting', careSettingLabel(data.context.careSetting) || 'N/A'),
							field('Assessed at', data.context.assessedAt || 'N/A')
						],
						[
							field(
								'Presenting complaint',
								presentingComplaintLabel(data.context.presentingComplaint) || 'N/A'
							),
							field('', '')
						]
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
						[field('Sex', sexLabel(data.identification.sex) || 'N/A'), field('', '')]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Parameter scoring'),
			{
				table: {
					headerRows: 1,
					widths: ['*', 'auto', 'auto'],
					body: [
						[
							{ text: 'Parameter', bold: true, fontSize: 9 },
							{ text: 'Value', bold: true, fontSize: 9 },
							{ text: 'Points', bold: true, fontSize: 9 }
						],
						paramRow(
							'Blood urea',
							urea === null ? 'Not recorded' : `${urea} mmol/L`,
							formatPoint(result.bloodUreaPoints)
						),
						paramRow(
							'Haemoglobin',
							hb === null ? 'Not recorded' : `${hb} g/L`,
							formatPoint(result.haemoglobinPoints)
						),
						paramRow(
							'Systolic blood pressure',
							sbp === null ? 'Not recorded' : `${sbp} mmHg`,
							formatPoint(result.systolicBloodPressurePoints)
						),
						paramRow(
							'Pulse',
							pulse === null ? 'Not recorded' : `${pulse} beats/min`,
							formatPoint(result.pulsePoint)
						),
						paramRow(
							'Melaena',
							yesNoLabel(data.clinicalMarkers.melaenaPresent) || 'Not recorded',
							formatPoint(result.melaenaPoint)
						),
						paramRow(
							'Syncope',
							yesNoLabel(data.clinicalMarkers.syncope) || 'Not recorded',
							formatPoint(result.syncopePoint)
						),
						paramRow(
							'Hepatic disease',
							yesNoLabel(data.clinicalMarkers.hepaticDisease) || 'Not recorded',
							formatPoint(result.hepaticDiseasePoint)
						),
						paramRow(
							'Cardiac failure',
							yesNoLabel(data.clinicalMarkers.cardiacFailure) || 'Not recorded',
							formatPoint(result.cardiacFailurePoint)
						),
						[
							{ text: 'Glasgow-Blatchford total', fontSize: 9, bold: true },
							{ text: '', fontSize: 9 },
							{
								text: formatScore(result.gbsScore, result.complete),
								fontSize: 9,
								bold: true
							}
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			...(result.flaggedIssues.length > 0
				? [
						sectionHeader('Flagged issues'),
						{
							ul: result.flaggedIssues.map((f) => ({
								text: `[${priorityLabel(f.priority)}] ${f.category}: ${f.description} — ${f.suggestedAction}`,
								color:
									f.priority === 'high'
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

			...(data.note.clinicalNote
				? [
						sectionHeader('Clinical note'),
						{
							text: data.note.clinicalNote,
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

function paramRow(label: string, value: string, points: string) {
	return [
		{ text: label, fontSize: 9 },
		{ text: value, fontSize: 9 },
		{ text: points, fontSize: 9 }
	];
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
