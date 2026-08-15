import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { FitNote, GradingResult } from '#lib/engine/types.js';
import {
	fitnessCategoryLabel,
	periodComplianceLabel,
	recommendationLabel,
	adaptationIntensityLabel,
	calculateAge
} from '#lib/engine/utils.js';

export function buildPdfDocument(data: FitNote, result: GradingResult): TDocumentDefinitions {
	const age = calculateAge(data.patient.birthDate);

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'UK STATEMENT OF FITNESS FOR WORK (MED 3 / FIT NOTE)',
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
				text: fitnessCategoryLabel(result.fitnessCategory),
				fontSize: 22,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `Validity: ${result.isValid === 'yes' ? 'Valid' : 'INVALID'} | Recommendation: ${recommendationLabel(result.recommendation)}`,
				fontSize: 11,
				alignment: 'center',
				color: '#4b5563',
				margin: [0, 0, 0, 16]
			},

			sectionHeader('Patient details'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[field('Name', data.patient.name || 'N/A'), field('NHS number', data.patient.unitedKingdomNhsNumber || 'N/A')],
						[
							field('DOB', `${data.patient.birthDate || 'N/A'}${age ? ` (Age ${age})` : ''}`),
							field('Occupation', data.patient.occupation || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Issuer'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[field('Clinician', data.clinician.name || 'N/A'), field('Profession', data.clinician.profession || 'N/A')],
						[
							field('Practice', data.medicalPractice.name || 'N/A'),
							field('Address', data.medicalPractice.postalAddressAsFullText || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Grade'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Diagnosis', data.diagnosisText || 'N/A'),
							field('Period', result.periodDays !== null ? `${result.periodDays} days` : 'N/A')
						],
						[
							field('Period compliance', periodComplianceLabel(result.periodCompliance)),
							field('Adaptation intensity', `${adaptationIntensityLabel(result.adaptationIntensity)} (${result.adaptationCount} ticked)`)
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			...(data.comments
				? [
						sectionHeader('Comments / functional advice'),
						{ text: data.comments, fontSize: 10, margin: [0, 0, 0, 16] as [number, number, number, number] }
					]
				: []),

			...(result.safetyFlags.length > 0
				? [
						sectionHeader('Safety flags'),
						{
							ul: result.safetyFlags.map((f) => ({
								text: `[${f.priority.toUpperCase()}] ${f.description} — ${f.suggestedAction}`,
								color: f.priority === 'high' ? '#dc2626' : f.priority === 'medium' ? '#d97706' : '#4b5563',
								margin: [0, 2, 0, 2] as [number, number, number, number]
							})),
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			...(result.firedRules.length > 0
				? [
						sectionHeader('Fired rules'),
						{
							table: {
								headerRows: 1,
								widths: [90, 70, '*'],
								body: [
									[
										{ text: 'Rule ID', bold: true, fontSize: 9 },
										{ text: 'Severity', bold: true, fontSize: 9 },
										{ text: 'Finding', bold: true, fontSize: 9 }
									],
									...result.firedRules.map((r) => [
										{ text: r.ruleId, fontSize: 8, color: '#6b7280' },
										{ text: `${r.ruleSet} / ${r.severity}`, fontSize: 9 },
										{ text: r.description, fontSize: 9 }
									])
								]
							},
							layout: 'lightHorizontalLines',
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
