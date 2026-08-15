import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { BloodspotScreening, GradingResult } from '#lib/engine/types.js';
import {
	careSettingLabel,
	outcomeLabel,
	priorityLabel,
	referralStatusLabel,
	resultClassLabel,
	sampleTakerRoleLabel,
	sexLabel
} from '#lib/engine/utils.js';

export function buildPdfDocument(
	data: BloodspotScreening,
	result: GradingResult
): TDocumentDefinitions {
	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'NEWBORN BLOOD SPOT SCREENING REPORT',
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
				text: outcomeLabel(result.overallOutcome),
				fontSize: 22,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `Referral status: ${referralStatusLabel(result.referralStatus)}${
					result.ageAtSampleDays !== null ? ` · age at sample: day ${result.ageAtSampleDays}` : ''
				}`,
				fontSize: 12,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 20] as [number, number, number, number]
			},

			sectionHeader('Sample-taker and setting'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Sample-taker', data.sampleTaker.sampleTakerName || 'N/A'),
							field('Role', sampleTakerRoleLabel(data.sampleTaker.sampleTakerRole) || 'N/A')
						],
						[
							field('Care setting', careSettingLabel(data.sampleTaker.careSetting) || 'N/A'),
							field('Record date', data.sampleTaker.recordDate || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Baby'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('NHS number', data.babyId.nhsNumber || 'N/A'),
							field('Name', data.babyId.babyName || 'N/A')
						],
						[
							field('Sex', sexLabel(data.babyId.sex) || 'N/A'),
							field('Date of birth', data.babyId.dateOfBirth || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Condition results'),
			{
				table: {
					headerRows: 1,
					widths: ['*', 'auto'],
					body: [
						[
							{ text: 'Condition', bold: true, fontSize: 9 },
							{ text: 'Result', bold: true, fontSize: 9 }
						],
						...result.conditionResults.map((c) => [
							{ text: `${c.label} (${c.short})`, fontSize: 9 },
							{ text: resultClassLabel(c.result), fontSize: 9, bold: true }
						])
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			...(result.referrals.length > 0
				? [
						sectionHeader(`Urgent referrals (${result.referrals.length})`),
						{
							ul: result.referrals.map((r) => ({
								text: `[URGENT] ${r.service}`,
								color: '#dc2626',
								margin: [0, 2, 0, 2] as [number, number, number, number]
							})),
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			...(result.flaggedIssues.length > 0
				? [
						sectionHeader('Flagged issues'),
						{
							ul: result.flaggedIssues.map((f) => ({
								text: `[${priorityLabel(f.priority)}] ${f.category}: ${f.message}`,
								color:
									f.priority === 'high' || f.priority === 'urgent'
										? '#dc2626'
										: f.priority === 'medium'
											? '#d97706'
											: '#4b5563',
								margin: [0, 2, 0, 2] as [number, number, number, number]
							})),
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			...(data.summary.clinicalContext
				? [
						sectionHeader('Clinical context'),
						{
							text: data.summary.clinicalContext,
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
