import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { EligibilityResult, Fp92aApplication } from '#lib/engine/types.js';
import { conditionLabel } from '#lib/engine/utils.js';

const OUTCOME_LABEL: Record<string, string> = {
	eligible: 'Eligible',
	ineligible: 'Ineligible',
	'requires-clarification': 'Requires clarification',
	'': 'Not yet determined'
};

export function buildPdfDocument(
	data: Fp92aApplication,
	result: EligibilityResult
): TDocumentDefinitions {
	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'FP92A MEDICAL EXEMPTION — ELIGIBILITY REPORT',
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
				text: `Outcome: ${OUTCOME_LABEL[result.outcome]}`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			...(result.validFrom || result.validUntil
				? [
						{
							text: `Valid from ${result.validFrom || '—'} to ${result.validUntil || '—'}`,
							fontSize: 12,
							alignment: 'center' as const,
							color: '#4b5563',
							margin: [0, 0, 0, 20] as [number, number, number, number]
						}
					]
				: [{ text: '', margin: [0, 0, 0, 16] as [number, number, number, number] }]),

			// Patient details
			sectionHeader('Patient Details'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Name', `${data.patient.forenames} ${data.patient.surname}`),
							field('DOB', `${data.patient.birthDate}${result.ageYears !== null ? ` (Age ${result.ageYears})` : ''}`)
						],
						[
							field('NHS number', data.patient.unitedKingdomNhsNumber || 'N/A'),
							field('Practitioner', data.practitioner.name || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Eligible conditions
			...(result.eligibleConditions.length > 0
				? [
						sectionHeader('Eligible Conditions'),
						{
							ul: result.eligibleConditions.map((c) => conditionLabel(c)),
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			// Advisory flags
			...(result.additionalFlags.length > 0
				? [
						sectionHeader('Advisory Flags for Practitioner'),
						{
							ul: result.additionalFlags.map((f) => ({
								text: `[${f.priority.toUpperCase()}] ${f.category}: ${f.message}`,
								color: f.priority === 'urgent' || f.priority === 'high' ? '#dc2626' : f.priority === 'medium' ? '#d97706' : '#4b5563',
								margin: [0, 2, 0, 2] as [number, number, number, number]
							})),
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			// Fired rules
			...(result.firedRules.length > 0
				? [
						sectionHeader('Eligibility Justification'),
						{
							table: {
								headerRows: 1,
								widths: [110, 80, '*'],
								body: [
									[
										{ text: 'Rule ID', bold: true, fontSize: 9 },
										{ text: 'Category', bold: true, fontSize: 9 },
										{ text: 'Finding', bold: true, fontSize: 9 }
									],
									...result.firedRules.map((r) => [
										{ text: r.id, fontSize: 8, color: '#6b7280' },
										{ text: r.category, fontSize: 9 },
										{ text: r.message, fontSize: 9 }
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
