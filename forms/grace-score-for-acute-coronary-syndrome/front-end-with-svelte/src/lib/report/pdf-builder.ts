import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import {
	riskCategoryLabel,
	bandLabel,
	priorityLabel,
	careSettingLabel,
	clinicianRoleLabel,
	presentationTypeLabel,
	sexLabel,
	killipClassLabel,
	normaliseCreatinine
} from '#lib/engine/utils.js';

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	const hr = data.haemodynamics.heartRate;
	const sbp = data.haemodynamics.systolicBloodPressure;
	const creatMgdl = normaliseCreatinine(data.renal.serumCreatinine, data.renal.serumCreatinineUnit);
	const creatValue =
		data.renal.serumCreatinine === null
			? 'Not recorded'
			: `${data.renal.serumCreatinine} ${data.renal.serumCreatinineUnit || ''}`.trim() +
				(creatMgdl !== null && data.renal.serumCreatinineUnit === 'umol/L'
					? ` (${creatMgdl.toFixed(2)} mg/dL)`
					: '');

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'GRACE ACUTE CORONARY SYNDROME REPORT',
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
				text: `GRACE score: ${result.gracePoints}`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: riskCategoryLabel(result.riskCategory),
				fontSize: 12,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 20] as [number, number, number, number]
			},

			sectionHeader('Mortality risk bands'),
			{
				table: {
					widths: ['*', '*', '*'],
					body: [
						[
							field('In-hospital', bandLabel(result.inHospitalMortalityBand)),
							field('6-month', bandLabel(result.sixMonthMortalityBand)),
							field('Overall', riskCategoryLabel(result.riskCategory))
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Recommended strategy'),
			{
				text: result.invasiveStrategy || 'N/A',
				fontSize: 10,
				margin: [0, 0, 0, 16] as [number, number, number, number]
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
							field('Presentation', presentationTypeLabel(data.context.presentationType) || 'N/A'),
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

			sectionHeader('GRACE variables'),
			{
				table: {
					headerRows: 1,
					widths: ['*', 'auto', 'auto'],
					body: [
						[
							{ text: 'Variable', bold: true, fontSize: 9 },
							{ text: 'Value', bold: true, fontSize: 9 },
							{ text: 'Points', bold: true, fontSize: 9 }
						],
						[
							{ text: 'Age', fontSize: 9 },
							{
								text:
									data.identification.ageYears === null
										? 'Not recorded'
										: `${data.identification.ageYears} years`,
								fontSize: 9
							},
							{ text: String(result.agePoints), fontSize: 9, bold: true }
						],
						[
							{ text: 'Heart rate', fontSize: 9 },
							{ text: hr === null ? 'Not recorded' : `${hr} beats/min`, fontSize: 9 },
							{ text: String(result.heartRatePoints), fontSize: 9, bold: true }
						],
						[
							{ text: 'Systolic BP', fontSize: 9 },
							{ text: sbp === null ? 'Not recorded' : `${sbp} mmHg`, fontSize: 9 },
							{ text: String(result.sbpPoints), fontSize: 9, bold: true }
						],
						[
							{ text: 'Serum creatinine', fontSize: 9 },
							{ text: creatValue, fontSize: 9 },
							{ text: String(result.creatininePoints), fontSize: 9, bold: true }
						],
						[
							{ text: 'Killip class', fontSize: 9 },
							{ text: killipClassLabel(data.heartFailure.killipClass) || 'Not recorded', fontSize: 9 },
							{ text: String(result.killipPoints), fontSize: 9, bold: true }
						],
						[
							{ text: 'Cardiac arrest at admission', fontSize: 9 },
							{ text: yesNo(data.highRiskFeatures.cardiacArrestAtAdmission), fontSize: 9 },
							{ text: String(result.arrestPoints), fontSize: 9, bold: true }
						],
						[
							{ text: 'ST-segment deviation', fontSize: 9 },
							{ text: yesNo(data.highRiskFeatures.stSegmentDeviation), fontSize: 9 },
							{ text: String(result.stPoints), fontSize: 9, bold: true }
						],
						[
							{ text: 'Elevated cardiac enzymes', fontSize: 9 },
							{ text: yesNo(data.highRiskFeatures.elevatedCardiacEnzymes), fontSize: 9 },
							{ text: String(result.enzymePoints), fontSize: 9, bold: true }
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

function yesNo(v: string): string {
	return v === 'yes' ? 'Yes' : v === 'no' ? 'No' : 'Not recorded';
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
