import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '$lib/engine/types';
import {
	statusLabel,
	priorityLabel,
	priorityBalanceLabel,
	cprRecommendationLabel,
	ceilingLabel,
	involvementLabel,
	clinicianRoleLabel,
	yesNoLabel
} from '$lib/engine/utils';

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'ReSPECT — EMERGENCY CARE AND TREATMENT PLAN',
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
				text: `Plan status: ${statusLabel(result.status)}`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `${result.completenessPercent}% complete · ${result.satisfiedCount} of ${result.mandatoryCount} mandatory rules satisfied`,
				fontSize: 12,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 20] as [number, number, number, number]
			},

			sectionHeader('Personal details'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Name', data.personal.personName || 'N/A'),
							field('Date of birth', data.personal.dateOfBirth || 'N/A')
						],
						[
							field('Identifier', data.personal.identifier || 'N/A'),
							field('Key contact', data.personal.keyContact || 'N/A')
						],
						[field('Usual address', data.personal.address || 'N/A'), field('', '')]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('CPR recommendation'),
			{
				text: cprRecommendationLabel(data.cpr.cprRecommendation),
				fontSize: 12,
				bold: true,
				color: data.cpr.cprRecommendation === '' ? '#dc2626' : '#1f2937',
				margin: [0, 0, 0, 4] as [number, number, number, number]
			},
			{
				text: [
					{ text: 'Rationale: ', bold: true, color: '#6b7280' },
					{ text: data.cpr.cprRationale || 'Not recorded' }
				],
				fontSize: 10,
				margin: [0, 0, 0, 2] as [number, number, number, number]
			},
			{
				text: [
					{ text: 'Discussed with person / proxy: ', bold: true, color: '#6b7280' },
					{ text: yesNoLabel(data.cpr.cprDiscussed) || 'Not recorded' }
				],
				fontSize: 10,
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Clinical recommendations'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Balance of priorities', priorityBalanceLabel(data.recommendations.priorityBalance) || 'N/A'),
							field('Hospital transfer', ceilingLabel(data.ceilings.hospitalTransfer))
						],
						[
							field('Recommended', data.recommendations.recommendedInterventions || 'N/A'),
							field('Critical-care admission', ceilingLabel(data.ceilings.criticalCareAdmission))
						],
						[
							field('Not recommended', data.recommendations.notRecommendedInterventions || 'N/A'),
							field('Other ceilings', data.ceilings.treatmentCeilings || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Capacity and involvement'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Has capacity', yesNoLabel(data.capacity.hasCapacity) || 'Not recorded'),
							field('Who was involved', involvementLabel(data.capacity.involvement) || 'N/A')
						],
						[
							field('Capacity assessment', data.capacity.capacityAssessment || 'N/A'),
							field('Proxy / consultee', data.capacity.proxyDetails || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Clinician sign-off'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Clinician', data.signOff.clinicianName || 'N/A'),
							field('Role', clinicianRoleLabel(data.signOff.clinicianRole) || 'N/A')
						],
						[
							field('Registration', data.signOff.clinicianRegistration || 'N/A'),
							field('Signature', data.signOff.signature || 'N/A')
						],
						[
							field('Signed at', data.signOff.signedAt || 'N/A'),
							field('Review date', data.signOff.reviewDate || 'N/A')
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

			...(data.note
				? [
						sectionHeader('Clinician note'),
						{
							text: data.note,
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
