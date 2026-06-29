import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '$lib/engine/types';
import { calculateAgeYears, eligibilityLabel, eligibilityShortLabel, donorTypeLabel } from '$lib/engine/utils';
import { TRACKED_FIELD_COUNT } from '$lib/engine/utils';

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	const age = calculateAgeYears(data.donorDemographics.dateOfBirth);

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'BLOOD DONATION ELIGIBILITY REPORT',
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
				text: `Eligibility: ${eligibilityLabel(result.eligibilityStatus)}`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			...(result.eligibilityStatus === 'temporarily-deferred' && result.deferralWindow
				? [
						{
							text: `Deferral window: ${result.deferralWindow}`,
							fontSize: 12,
							alignment: 'center' as const,
							color: '#4b5563',
							margin: [0, 0, 0, 20] as [number, number, number, number]
						}
					]
				: [{ text: '', margin: [0, 0, 0, 16] as [number, number, number, number] }]),

			// Donor details
			sectionHeader('Donor Details'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Name', `${data.donorDemographics.firstName} ${data.donorDemographics.lastName}`),
							field('DOB', `${data.donorDemographics.dateOfBirth}${age != null ? ` (Age ${age})` : ''}`)
						],
						[
							field('Sex', data.donorDemographics.sex || 'N/A'),
							field('Donor type', donorTypeLabel(data.donorDemographics.donorType))
						],
						[
							field('Weight', data.donorDemographics.weight != null ? `${data.donorDemographics.weight} kg` : 'N/A'),
							field('Answered', `${result.answeredCount} of ${TRACKED_FIELD_COUNT} fields`)
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Flagged issues
			...(result.additionalFlags.length > 0
				? [
						sectionHeader('Flagged Issues for Clinician'),
						{
							ul: result.additionalFlags.map((f) => ({
								text: `[${f.priority.toUpperCase()}] ${f.category}: ${f.message}`,
								color: f.priority === 'urgent' ? '#dc2626' : f.priority === 'high' ? '#d97706' : '#4b5563',
								margin: [0, 2, 0, 2] as [number, number, number, number]
							})),
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			// Fired rules
			...(result.firedRules.length > 0
				? [
						sectionHeader('Triggered Deferral Rules'),
						{
							table: {
								headerRows: 1,
								widths: [70, 80, '*', 70],
								body: [
									[
										{ text: 'Rule ID', bold: true, fontSize: 9 },
										{ text: 'Category', bold: true, fontSize: 9 },
										{ text: 'Reason', bold: true, fontSize: 9 },
										{ text: 'Status', bold: true, fontSize: 9 }
									],
									...result.firedRules.map((r) => [
										{ text: r.id, fontSize: 8, color: '#6b7280' },
										{ text: r.category, fontSize: 9 },
										{ text: r.description, fontSize: 9 },
										{ text: eligibilityShortLabel(r.status), fontSize: 9, bold: true }
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
