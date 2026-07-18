import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { NuclearMedicineRequest, GradingResult } from '$lib/engine/types';
import {
	scanTypeLabel,
	indicationLabel,
	appropriatenessLabel,
	prepSafetyLabel,
	radiationDoseLabel,
	triageTierLabel,
	recommendationLabel,
	calculateAge
} from '$lib/engine/utils';

/** Builds the pdfmake document definition for the nuclear medicine request vetting report. */
export function buildPdfDocument(data: NuclearMedicineRequest, result: GradingResult): TDocumentDefinitions {
	const age = calculateAge(data.patient.dateOfBirth);

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'NUCLEAR MEDICINE REQUEST — VETTING REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.gradedAt).toLocaleString()}`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: recommendationLabel(result.recommendation),
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `${triageTierLabel(result.triageTier)}${result.targetTimeframe ? ` · ${result.targetTimeframe}` : ''}`,
				fontSize: 12,
				alignment: 'center',
				color: '#4b5563',
				margin: [0, 0, 0, 16]
			},

			sectionHeader('Requested examination'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[field('Scan type', scanTypeLabel(data.request.scanType) || 'N/A'), field('Indication', indicationLabel(data.request.primaryIndication) || 'N/A')],
						[field('Clinical question', data.request.clinicalQuestion || 'N/A'), field('IR(ME)R justification', data.justification.irMeRJustification || 'N/A')]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Four-axis grade'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[field('A · Appropriateness', `${result.appropriatenessScore}/9 — ${appropriatenessLabel(result.appropriatenessBand)}`), field('B · Preparation & radiation safety', prepSafetyLabel(result.prepSafetyBand))],
						[field('B · Radiation dose', radiationDoseLabel(result.radiationDoseBand)), field('C · Completeness', `${result.completenessPercent}%`)],
						[field('D · Triage', triageTierLabel(result.triageTier)), field('Recommendation', recommendationLabel(result.recommendation))]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Patient details'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[field('Name', `${data.patient.firstName} ${data.patient.lastName}`), field('DOB', `${data.patient.dateOfBirth}${age ? ` (Age ${age})` : ''}`)],
						[field('NHS number', data.patient.nhsNumber || 'N/A'), field('Requesting clinician', data.clinician.clinicianName || 'N/A')]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			...(result.flags.length > 0
				? [
						sectionHeader('Safety flags'),
						{
							ul: result.flags.map((f) => ({
								text: `[${f.priority.toUpperCase()}] ${f.category}: ${f.description} — ${f.suggestedAction}`,
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
								widths: [110, 80, '*'],
								body: [
									[
										{ text: 'Rule ID', bold: true, fontSize: 9 },
										{ text: 'Axis', bold: true, fontSize: 9 },
										{ text: 'Description', bold: true, fontSize: 9 }
									],
									...result.firedRules.map((r) => [
										{ text: r.ruleId, fontSize: 8, color: '#6b7280' },
										{ text: r.axis, fontSize: 9 },
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
