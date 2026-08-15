import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import {
	riskBandLabel,
	priorityLabel,
	careSettingLabel,
	clinicianRoleLabel,
	sexLabel,
	ethnicityLabel,
	smokingLabel,
	diabetesLabel,
	ckdStageLabel
} from '#lib/engine/utils.js';

const YES_NO: Record<string, string> = { yes: 'Yes', no: 'No', '': 'Not recorded' };

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	const id = data.identification;
	const cm = data.cardiometabolic;
	const riskText =
		result.tenYearRiskPercent === null ? 'Not computable' : `${result.tenYearRiskPercent}%`;

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'QRISK3 CARDIOVASCULAR DISEASE RISK REPORT (REPRESENTATIVE MODEL)',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 9,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.timestamp).toLocaleString()} | Representative model — not for clinical use`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: `10-year CVD risk: ${riskText}`,
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
				text:
					result.heartAge !== null ? `Estimated heart age: ${result.heartAge} years` : ' ',
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
							field('Identifier', id.patientIdentifier || 'N/A'),
							field('Age', id.age !== null ? `${id.age} years` : 'N/A')
						],
						[
							field('Sex', sexLabel(id.sex) || 'N/A'),
							field('Ethnicity', ethnicityLabel(id.ethnicity) || 'N/A')
						],
						[
							field(
								'Townsend score',
								id.townsendScore !== null ? `${id.townsendScore}` : 'Not recorded (cohort mean)'
							),
							field('Postcode', id.postcode || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Risk factors'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Smoking', smokingLabel(data.lifestyle.smokingStatus) || 'N/A'),
							field(
								'Body mass index',
								data.lifestyle.bodyMassIndex !== null
									? `${data.lifestyle.bodyMassIndex} kg/m2`
									: 'N/A'
							)
						],
						[
							field('Diabetes', diabetesLabel(cm.diabetesStatus) || 'N/A'),
							field(
								'Cholesterol : HDL ratio',
								cm.cholesterolHdlRatio !== null ? `${cm.cholesterolHdlRatio}` : 'N/A'
							)
						],
						[
							field(
								'Systolic blood pressure',
								cm.systolicBloodPressure !== null ? `${cm.systolicBloodPressure} mmHg` : 'N/A'
							),
							field('On BP treatment', YES_NO[cm.onBloodPressureTreatment])
						],
						[
							field('Chronic kidney disease', ckdStageLabel(data.comorbidities.chronicKidneyDiseaseStage) || 'N/A'),
							field('Atrial fibrillation', YES_NO[data.comorbidities.atrialFibrillation])
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			...(result.contributions.length > 0
				? [
						sectionHeader('Weighted contributions'),
						{
							table: {
								headerRows: 1,
								widths: ['*', 'auto', 'auto'],
								body: [
									[
										{ text: 'Factor', bold: true, fontSize: 9 },
										{ text: 'Value', bold: true, fontSize: 9 },
										{ text: 'Weight', bold: true, fontSize: 9 }
									],
									...result.contributions.map((c) => [
										{ text: c.factor, fontSize: 9 },
										{ text: c.value, fontSize: 9 },
										{ text: c.weight.toFixed(3), fontSize: 9 }
									]),
									[
										{ text: 'Linear predictor', bold: true, fontSize: 9 },
										{ text: '', fontSize: 9 },
										{ text: result.linearPredictor.toFixed(3), bold: true, fontSize: 9 }
									]
								]
							},
							layout: 'lightHorizontalLines',
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

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
