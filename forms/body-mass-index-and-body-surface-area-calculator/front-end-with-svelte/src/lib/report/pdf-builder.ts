import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '$lib/engine/types';
import {
	bmiCategoryLabel,
	priorityLabel,
	careSettingLabel,
	purposeLabel,
	clinicianRoleLabel,
	sexLabel,
	ageBandLabel,
	ancestryLabel,
	bsaFormulaLabel,
	formatBmi,
	formatBsa
} from '$lib/engine/utils';

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	const heightCm = data.height.heightCm;
	const weightKg = data.weight.weightKg;

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'BMI AND BSA REPORT',
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
				text: `BMI: ${formatBmi(result.bmi)}`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: bmiCategoryLabel(result.bmiCategory),
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
							field('Purpose', purposeLabel(data.context.purpose) || 'N/A')
						],
						[field('Assessed at', data.context.assessedAt || 'N/A'), field('', '')]
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
							field('Sex', sexLabel(data.identification.sex) || 'N/A'),
							field('Ancestry', ancestryLabel(data.identification.ancestry) || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Calculation'),
			{
				table: {
					headerRows: 1,
					widths: ['*', 'auto'],
					body: [
						[
							{ text: 'Measure', bold: true, fontSize: 9 },
							{ text: 'Value', bold: true, fontSize: 9 }
						],
						[
							{ text: 'Measured height', fontSize: 9 },
							{ text: heightCm === null ? 'Not recorded' : `${heightCm} cm`, fontSize: 9 }
						],
						[
							{ text: 'Measured weight', fontSize: 9 },
							{ text: weightKg === null ? 'Not recorded' : `${weightKg} kg`, fontSize: 9 }
						],
						[
							{ text: 'Body Mass Index (BMI)', fontSize: 9, bold: true },
							{ text: formatBmi(result.bmi), fontSize: 9, bold: true }
						],
						[
							{ text: 'WHO weight-status category', fontSize: 9 },
							{ text: bmiCategoryLabel(result.bmiCategory), fontSize: 9 }
						],
						[
							{ text: 'BSA (Mosteller)', fontSize: 9 },
							{ text: formatBsa(result.bsaMosteller), fontSize: 9 }
						],
						[
							{ text: 'BSA (Du Bois)', fontSize: 9 },
							{ text: formatBsa(result.bsaDuBois), fontSize: 9 }
						],
						[
							{ text: 'Preferred BSA formula', fontSize: 9 },
							{ text: bsaFormulaLabel(data.results.bsaFormula) || 'N/A', fontSize: 9 }
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

			...(data.results.clinicalNote
				? [
						sectionHeader('Clinical note'),
						{
							text: data.results.clinicalNote,
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
