import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import {
	riskBandLabel,
	priorityLabel,
	scoreVariantLabel,
	dispositionLabel,
	careSettingLabel,
	clinicianRoleLabel,
	sexLabel
} from '#lib/engine/utils.js';

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	const rr = data.respiratory.respiratoryRate;
	const sbp = data.bloodPressure.systolicBp;
	const dbp = data.bloodPressure.diastolicBp;
	const age = data.age.ageYears;

	const bpValue =
		sbp === null && dbp === null
			? 'Not recorded'
			: `${sbp === null ? '—' : sbp} / ${dbp === null ? '—' : dbp} mmHg`;
	const ureaValue =
		data.urea.ureaMeasured !== 'yes'
			? 'Not measured (CRB-65)'
			: data.urea.ureaMmolL === null
				? 'Not recorded'
				: `${data.urea.ureaMmolL} mmol/L`;

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'CURB-65 PNEUMONIA SEVERITY REPORT',
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
				text: `${scoreVariantLabel(result.scoreVariant)} score: ${result.totalScore} of ${
					result.scoreVariant === 'curb-65' ? 5 : 4
				}`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `${riskBandLabel(result.riskBand)} — ${dispositionLabel(result.recommendedDisposition)}`,
				fontSize: 12,
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
							field('Variant', scoreVariantLabel(result.scoreVariant)),
							field('Recommended', dispositionLabel(result.recommendedDisposition))
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
							field('Sex', sexLabel(data.identification.sex) || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Criteria'),
			{
				table: {
					headerRows: 1,
					widths: ['*', 'auto', 'auto'],
					body: [
						[
							{ text: 'Criterion', bold: true, fontSize: 9 },
							{ text: 'Value', bold: true, fontSize: 9 },
							{ text: 'Point', bold: true, fontSize: 9 }
						],
						[
							{ text: 'Confusion (new-onset)', fontSize: 9 },
							{ text: confusionValue(data), fontSize: 9 },
							{ text: String(result.confusionScore), fontSize: 9, bold: true }
						],
						[
							{ text: 'Urea > 7 mmol/L', fontSize: 9 },
							{ text: ureaValue, fontSize: 9 },
							{
								text: result.scoreVariant === 'crb-65' ? '—' : String(result.ureaScore),
								fontSize: 9,
								bold: true
							}
						],
						[
							{ text: 'Respiratory rate >= 30/min', fontSize: 9 },
							{ text: rr === null ? 'Not recorded' : `${rr} breaths/min`, fontSize: 9 },
							{ text: String(result.respiratoryRateScore), fontSize: 9, bold: true }
						],
						[
							{ text: 'Systolic < 90 or diastolic <= 60 mmHg', fontSize: 9 },
							{ text: bpValue, fontSize: 9 },
							{ text: String(result.bloodPressureScore), fontSize: 9, bold: true }
						],
						[
							{ text: 'Age >= 65 years', fontSize: 9 },
							{ text: age === null ? 'Not recorded' : `${age} years`, fontSize: 9 },
							{ text: String(result.ageScore), fontSize: 9, bold: true }
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

			...(data.disposition.clinicianOverrideBand
				? [
						sectionHeader('Clinician override'),
						{
							text: `Final risk band set to ${riskBandLabel(
								data.disposition.clinicianOverrideBand as never
							)} by the assessing clinician${
								data.disposition.overrideReason ? `: ${data.disposition.overrideReason}` : '.'
							}`,
							fontSize: 10,
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			...(data.disposition.clinicalNote
				? [
						sectionHeader('Clinical note'),
						{
							text: data.disposition.clinicalNote,
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

function confusionValue(data: AssessmentData): string {
	if (data.confusion.confusionPresent === 'yes') {
		return data.confusion.amtScore !== null
			? `Present (AMT ${data.confusion.amtScore})`
			: 'Present';
	}
	if (data.confusion.confusionPresent === 'no') return 'Absent';
	return 'Not recorded';
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
