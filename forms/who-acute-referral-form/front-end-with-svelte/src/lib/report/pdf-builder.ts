import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, FlaggedIssue, ValidationResult } from '$lib/engine/types';
import { calculateAge, sectionLabel, modeOfTransferLabel } from '$lib/engine/utils';

export function buildPdfDocument(
	data: AssessmentData,
	validation: ValidationResult,
	flags: FlaggedIssue[]
): TDocumentDefinitions {
	const age = calculateAge(data.patientIdentification.dateOfBirth);

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'WHO ACUTE REFERRAL FORM',
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
			// Completeness status
			{
				text: validation.complete ? 'Referral complete' : 'Referral incomplete',
				fontSize: 22,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `${validation.totalSatisfied} of ${validation.totalRequired} required fields completed`,
				fontSize: 11,
				alignment: 'center',
				color: '#4b5563',
				margin: [0, 0, 0, 20]
			},

			// Patient & referral details
			sectionHeader('Patient & Referral Details'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field(
								'Patient',
								`${data.patientIdentification.patientLastName}, ${data.patientIdentification.patientFirstName}`
							),
							field(
								'DOB',
								`${data.patientIdentification.dateOfBirth || 'N/A'}${age != null ? ` (Age ${age})` : ''}`
							)
						],
						[
							field('Sex', data.patientIdentification.sex || 'N/A'),
							field('Primary diagnosis', data.situation.primaryDiagnosis || 'N/A')
						],
						[
							field('From (initiating)', data.facilityAndTransport.initiatingFacility.name || 'N/A'),
							field('To (referral)', data.facilityAndTransport.referralFacility.name || 'N/A')
						],
						[
							field('Mode of transfer', modeOfTransferLabel(data.facilityAndTransport.modeOfTransfer)),
							field('Departure', data.facilityAndTransport.departureDateTime || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Flagged issues
			...(flags.length > 0
				? [
						sectionHeader('Flagged Issues for Receiving Facility'),
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

			// Outstanding required fields
			...(validation.missing.length > 0
				? [
						sectionHeader('Outstanding Required Fields'),
						{
							table: {
								headerRows: 1,
								widths: [60, 110, '*'],
								body: [
									[
										{ text: 'Rule', bold: true, fontSize: 9 },
										{ text: 'Section', bold: true, fontSize: 9 },
										{ text: 'Field required', bold: true, fontSize: 9 }
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
				: []),

			// Clinical assessment
			...(data.assessment.clinicalAssessment
				? [
						sectionHeader('Clinical Assessment'),
						{
							text: data.assessment.clinicalAssessment,
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
			{ text: `${label}: `, bold: true, color: '#6b7280' },
			{ text: value }
		],
		margin: [0, 4, 0, 4] as [number, number, number, number]
	};
}
