import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '$lib/engine/types';
import {
	riskBandLabel,
	priorityLabel,
	careSettingLabel,
	clinicianRoleLabel,
	comorbidityLabel,
	diagnosisLabel,
	endoscopyPerformedLabel,
	sexLabel,
	shockLabel,
	stigmataLabel,
	formatScore
} from '$lib/engine/utils';

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	const sbp = data.shock.systolicBloodPressure;
	const hr = data.shock.heartRate;
	const shockValue =
		sbp === null && hr === null
			? 'Not recorded'
			: `SBP ${sbp === null ? '—' : `${sbp} mmHg`}, HR ${hr === null ? '—' : `${hr} bpm`}`;

	const endoscopicRows = result.endoscopyDone
		? [
				paramRow(
					'Diagnosis',
					diagnosisLabel(data.endoscopy.diagnosis) || 'Not recorded',
					`${result.diagnosisPoints} pt`
				),
				paramRow(
					'Stigmata of recent haemorrhage',
					stigmataLabel(data.endoscopy.stigmata) || 'Not recorded',
					`${result.stigmataPoints} pt`
				)
			]
		: [];

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'ROCKALL SCORE REPORT',
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
				text: `Rockall ${formatScore(result)} — ${riskBandLabel(result.riskBand)}`,
				fontSize: 22,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: result.endoscopyDone
					? `Full (post-endoscopy) Rockall score · clinical component ${result.clinicalRockallScore} of 7`
					: `Pre-endoscopy (clinical) Rockall score of 7 · full score pending endoscopy`,
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
							field('Presenting complaint', data.context.presentingComplaint || 'N/A'),
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
							field(
								'Age',
								data.identification.ageYears === null
									? 'N/A'
									: `${data.identification.ageYears} years`
							)
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
							'Age',
							data.identification.ageYears === null
								? 'Not recorded'
								: `${data.identification.ageYears} years`,
							`${result.agePoints} pt`
						),
						paramRow('Shock', `${shockValue} (${shockLabel(result.shockPoints)})`, `${result.shockPoints} pt`),
						paramRow(
							'Comorbidity',
							comorbidityLabel(data.comorbidityStep.comorbidity) || 'Not recorded',
							`${result.comorbidityPoints} pt`
						),
						[
							{ text: 'Clinical Rockall score', fontSize: 9, bold: true },
							{ text: '', fontSize: 9 },
							{ text: `${result.clinicalRockallScore} / 7`, fontSize: 9, bold: true }
						],
						...endoscopicRows,
						[
							{ text: result.endoscopyDone ? 'Full Rockall score' : 'Endoscopy', fontSize: 9, bold: true },
							{
								text: result.endoscopyDone
									? ''
									: endoscopyPerformedLabel(data.endoscopy.endoscopyPerformed) || 'Not yet performed',
								fontSize: 9
							},
							{
								text: result.endoscopyDone ? `${result.fullRockallScore} / 11` : '—',
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
									f.priority === 'high' ? '#dc2626' : f.priority === 'medium' ? '#d97706' : '#4b5563',
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
