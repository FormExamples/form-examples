import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '$lib/engine/types';
import {
	riskBandLabel,
	priorityLabel,
	prophylaxisLabel,
	careSettingLabel,
	clinicianRoleLabel,
	sexLabel
} from '$lib/engine/utils';

/** Report factor rows: [factor key, label, value getter]. */
function factorRows(
	data: AssessmentData
): Array<[key: string, label: string, value: () => string]> {
	const yn = (v: string) => (v === 'yes' ? 'Yes' : v === 'no' ? 'No' : 'Not recorded');
	return [
		['activeCancer', 'Active cancer (3)', () => yn(data.history.activeCancer)],
		['previousVte', 'Previous VTE (3)', () => yn(data.history.previousVte)],
		['reducedMobility', 'Reduced mobility >= 3 days (3)', () => yn(data.mobility.reducedMobility)],
		['knownThrombophilia', 'Known thrombophilia (3)', () => yn(data.history.knownThrombophilia)],
		[
			'recentTraumaOrSurgery',
			'Recent trauma or surgery <= 1 month (2)',
			() => yn(data.mobility.recentTraumaOrSurgery)
		],
		[
			'elderlyAge',
			'Age >= 70 (1)',
			() =>
				data.identification.ageYears === null
					? 'Not recorded'
					: `${data.identification.ageYears} years`
		],
		[
			'heartOrRespiratoryFailure',
			'Heart/respiratory failure (1)',
			() => yn(data.cardiorespiratory.heartOrRespiratoryFailure)
		],
		[
			'acuteMiOrIschaemicStroke',
			'Acute MI or ischaemic stroke (1)',
			() => yn(data.cardiorespiratory.acuteMiOrIschaemicStroke)
		],
		[
			'acuteInfectionOrRheumatological',
			'Acute infection/rheumatological (1)',
			() => yn(data.cardiorespiratory.acuteInfectionOrRheumatological)
		],
		[
			'obesity',
			'Obesity BMI >= 30 (1)',
			() =>
				data.metabolic.bodyMassIndex === null
					? 'Not recorded'
					: `BMI ${data.metabolic.bodyMassIndex}`
		],
		[
			'ongoingHormonalTreatment',
			'Ongoing hormonal treatment (1)',
			() => yn(data.metabolic.ongoingHormonalTreatment)
		]
	];
}

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'PADUA VTE RISK ASSESSMENT REPORT',
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
				text: `Padua score: ${result.paduaScore} of 20`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: riskBandLabel(result.riskBand),
				fontSize: 12,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 4] as [number, number, number, number]
			},
			{
				text: prophylaxisLabel(result.prophylaxisRecommendation),
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
						[field('Reason for admission', data.context.admissionReason || 'N/A'), field('', '')]
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

			sectionHeader('Risk factors'),
			{
				table: {
					headerRows: 1,
					widths: ['*', 'auto', 'auto'],
					body: [
						[
							{ text: 'Risk factor (points)', bold: true, fontSize: 9 },
							{ text: 'Value', bold: true, fontSize: 9 },
							{ text: 'Points', bold: true, fontSize: 9 }
						],
						...factorRows(data).map(([key, label, getValue]) => {
							const points = result.factorPoints[key] || 0;
							return [
								{ text: label, fontSize: 9 },
								{ text: getValue(), fontSize: 9 },
								{ text: String(points), fontSize: 9, bold: true }
							];
						})
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
