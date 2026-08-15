import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, FlaggedIssue, ValidationResult } from '#lib/engine/types.js';
import { calculateAge, followUpTimeframeLabel, sectionLabel } from '#lib/engine/utils.js';

export function buildPdfDocument(
	data: AssessmentData,
	validation: ValidationResult,
	flags: FlaggedIssue[]
): TDocumentDefinitions {
	const age = calculateAge(data.patientIdentification.dateOfBirth);
	const statusLine = validation.complete
		? 'COMPLETE'
		: `${validation.missing.length} required field(s) missing`;

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'WHO COUNTER-REFERRAL FORM',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date().toLocaleString()}`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: `Form status: ${statusLine}`,
				fontSize: 20,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `${validation.totalSatisfied} of ${validation.totalRequired} required fields completed`,
				fontSize: 11,
				alignment: 'center',
				color: '#4b5563',
				margin: [0, 0, 0, 16]
			},

			// Patient details
			sectionHeader('Patient Details'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Name', data.patientIdentification.patientName || 'N/A'),
							field(
								'DOB',
								`${data.patientIdentification.dateOfBirth || 'N/A'}${age ? ` (Age ${age})` : ''}`
							)
						],
						[
							field('Sex', data.patientIdentification.sex || 'N/A'),
							field('Patient contact', data.patientIdentification.patientContact || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Facility & follow-up
			sectionHeader('Facilities & Follow-up'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Referral facility', data.facilityDetails.referralFacility.name || 'N/A'),
							field('Primary care facility', data.facilityDetails.primaryCareFacility.name || 'N/A')
						],
						[
							field('Referral date', data.facilityDetails.referralDate || 'N/A'),
							field(
								'Follow-up',
								followUpTimeframeLabel(data.facilityDetails.followUpTimeframe)
							)
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Final diagnoses
			sectionHeader('Assessment'),
			{
				text: [
					{ text: 'Final diagnoses: ', bold: true, color: '#6b7280' },
					{ text: data.assessment.finalDiagnoses || 'N/A' }
				],
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Flagged issues
			...(flags.length > 0
				? [
						sectionHeader('Flagged Issues for Primary Care'),
						{
							ul: flags.map((f) => ({
								text: `[${f.priority.toUpperCase()}] ${f.category}: ${f.message}`,
								color:
									f.priority === 'urgent' || f.priority === 'high'
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

			// Missing fields
			...(validation.missing.length > 0
				? [
						sectionHeader('Outstanding Required Fields'),
						{
							table: {
								headerRows: 1,
								widths: [60, 110, '*'],
								body: [
									[
										{ text: 'Rule ID', bold: true, fontSize: 9 },
										{ text: 'Section', bold: true, fontSize: 9 },
										{ text: 'Required field', bold: true, fontSize: 9 }
									],
									...validation.missing.map((m) => [
										{ text: m.id, fontSize: 8, color: '#6b7280' },
										{ text: sectionLabel(m.section), fontSize: 9 },
										{ text: m.description, fontSize: 9 }
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
