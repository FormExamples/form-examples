import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult, SubScore } from '#lib/engine/types.js';
import {
	mortalityBandLabel,
	priorityLabel,
	careLocationLabel,
	roleLabel,
	sexLabel,
	suspectedInfectionLabel,
	respiratorySupportLabel,
	vasopressorLabel
} from '#lib/engine/utils.js';

function subScoreText(s: SubScore): string {
	return s === null ? '—' : String(s);
}

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	const s = result.subScores;
	const r = data.respiration;
	const ratio =
		r.pao2Fio2Ratio !== null
			? `${r.pao2Fio2Ratio} mmHg`
			: r.pao2 !== null && r.fio2 !== null && r.fio2 > 0
				? `${Math.round(r.pao2 / r.fio2)} mmHg (derived)`
				: 'Not recorded';

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'SOFA ASSESSMENT REPORT',
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
				text: `Total SOFA: ${result.totalSofa} of 24`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `${mortalityBandLabel(result.mortalityBand)} mortality-risk band${result.sepsis3 ? ' · Meets Sepsis-3' : ''}`,
				fontSize: 12,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 20] as [number, number, number, number]
			},

			sectionHeader('Clinician and context'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Assessor', data.context.assessorName || 'N/A'),
							field('Role', roleLabel(data.context.assessorRole) || 'N/A')
						],
						[
							field('Care location', careLocationLabel(data.context.careLocation) || 'N/A'),
							field('Assessed at', data.context.assessedAt || 'N/A')
						],
						[
							field(
								'Hours since admission',
								data.context.hoursSinceAdmission === null
									? 'N/A'
									: String(data.context.hoursSinceAdmission)
							),
							field(
								'Baseline SOFA',
								data.baseline.baselineSofaTotal === null
									? 'N/A'
									: String(data.baseline.baselineSofaTotal)
							)
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
							field('Identifier', data.baseline.patientIdentifier || 'N/A'),
							field('Age', data.baseline.ageYears === null ? 'N/A' : `${data.baseline.ageYears} y`)
						],
						[
							field('Sex', sexLabel(data.baseline.sex) || 'N/A'),
							field(
								'Suspected infection',
								suspectedInfectionLabel(data.baseline.suspectedInfection) || 'N/A'
							)
						],
						[field('Admission diagnosis', data.baseline.admissionDiagnosis || 'N/A'), field('', '')]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Organ-system sub-scores'),
			{
				table: {
					headerRows: 1,
					widths: ['*', '*', 'auto'],
					body: [
						[
							{ text: 'System', bold: true, fontSize: 9 },
							{ text: 'Value', bold: true, fontSize: 9 },
							{ text: 'Sub-score', bold: true, fontSize: 9 }
						],
						[
							{ text: 'Respiration (PaO2/FiO2)', fontSize: 9 },
							{
								text: `${ratio}, ${respiratorySupportLabel(r.respiratorySupport) || 'support N/R'}`,
								fontSize: 9
							},
							{ text: subScoreText(s.respiration), fontSize: 9, bold: true }
						],
						[
							{ text: 'Coagulation (platelets)', fontSize: 9 },
							{
								text:
									data.coagulation.platelets === null
										? 'Not recorded'
										: `${data.coagulation.platelets} x10^9/L`,
								fontSize: 9
							},
							{ text: subScoreText(s.coagulation), fontSize: 9, bold: true }
						],
						[
							{ text: 'Liver (bilirubin)', fontSize: 9 },
							{
								text:
									data.liver.bilirubin === null
										? 'Not recorded'
										: `${data.liver.bilirubin} umol/L`,
								fontSize: 9
							},
							{ text: subScoreText(s.liver), fontSize: 9, bold: true }
						],
						[
							{ text: 'Cardiovascular (MAP / vasopressor)', fontSize: 9 },
							{
								text: `${data.cardiovascular.map === null ? 'MAP N/R' : `MAP ${data.cardiovascular.map} mmHg`}, ${vasopressorLabel(data.cardiovascular.vasopressor) || 'vasopressor N/R'}`,
								fontSize: 9
							},
							{ text: subScoreText(s.cardiovascular), fontSize: 9, bold: true }
						],
						[
							{ text: 'CNS (Glasgow Coma Scale)', fontSize: 9 },
							{
								text:
									data.cns.glasgowComaScale === null
										? 'Not recorded'
										: `GCS ${data.cns.glasgowComaScale}`,
								fontSize: 9
							},
							{ text: subScoreText(s.cns), fontSize: 9, bold: true }
						],
						[
							{ text: 'Renal (creatinine / urine)', fontSize: 9 },
							{
								text: `${data.renal.creatinine === null ? 'Cr N/R' : `Cr ${data.renal.creatinine} umol/L`}, ${data.renal.urineOutput === null ? 'UO N/R' : `UO ${data.renal.urineOutput} mL/day`}`,
								fontSize: 9
							},
							{ text: subScoreText(s.renal), fontSize: 9, bold: true }
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 12] as [number, number, number, number]
			},
			{
				text: [
					{ text: 'Total SOFA: ', bold: true },
					{ text: `${result.totalSofa} of 24` },
					{ text: '   Delta-SOFA: ', bold: true },
					{
						text:
							result.deltaSofa === null
								? 'N/A'
								: `${result.deltaSofa >= 0 ? '+' : ''}${result.deltaSofa}`
					},
					{ text: '   Mortality band: ', bold: true },
					{ text: mortalityBandLabel(result.mortalityBand) }
				],
				fontSize: 10,
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
