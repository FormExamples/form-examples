import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import {
	statusLabel,
	urgencyLabel,
	urgencyPathway,
	priorityLabel,
	referrerRoleLabel,
	patientSexLabel,
	consentToShareLabel
} from '#lib/engine/utils.js';

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'GENERAL PRACTITIONER REFERRAL LETTER',
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
				text: `Urgency: ${urgencyLabel(result.urgency)}`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `${statusLabel(result.status)} · ${result.completenessPercent}% complete · ${result.presentCount} of ${result.mandatoryCount} mandatory fields present`,
				fontSize: 12,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 8] as [number, number, number, number]
			},
			{
				text: urgencyPathway(result.urgency),
				fontSize: 10,
				italics: true,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 20] as [number, number, number, number]
			},

			sectionHeader('Referrer'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Name', data.referrer.referrerName || 'N/A'),
							field('Role', referrerRoleLabel(data.referrer.referrerRole))
						],
						[
							field('Registration number', data.referrer.referrerRegistrationNumber || 'N/A'),
							field('Practice', data.referrer.referringPractice || 'N/A')
						],
						[
							field('Contact', data.referrer.referrerContact || 'N/A'),
							field('Referral date', data.referrer.referralDate || 'N/A')
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
							field('Name', data.patient.patientName || 'N/A'),
							field('Identifier', data.patient.patientIdentifier || 'N/A')
						],
						[
							field('Date of birth', data.patient.patientDateOfBirth || 'N/A'),
							field('Sex', patientSexLabel(data.patient.patientSex) || 'N/A')
						],
						[
							field('Contact', data.patient.patientContact || 'N/A'),
							field('Access needs', data.patient.accessNeeds || 'N/A')
						],
						[field('Home address', data.patient.patientAddress || 'N/A'), field('', '')]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Destination and urgency'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Specialty / service', data.destination.referralSpecialty || 'N/A'),
							field('Named clinician / team', data.destination.namedClinician || 'N/A')
						],
						[
							field('Receiving organisation', data.destination.receivingOrganisation || 'N/A'),
							field('Urgency', urgencyLabel(result.urgency))
						],
						[
							field('Urgency reason', data.urgencyInfo.urgencyReason || 'N/A'),
							field('Suspected-cancer criterion', data.urgencyInfo.suspectedCancerCriterion || 'N/A')
						],
						[
							field('Suspected-cancer pathway', data.urgencyInfo.suspectedCancerPathway || 'N/A'),
							field('', '')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Reason and history'),
			{
				text: data.clinical.reasonForReferral || 'Not recorded',
				fontSize: 10,
				margin: [0, 0, 0, 4] as [number, number, number, number]
			},
			{
				text: [
					{ text: 'Relevant history: ', bold: true, color: '#6b7280' },
					{ text: data.clinical.relevantHistory || 'Not recorded' }
				],
				fontSize: 10,
				margin: [0, 0, 0, 4] as [number, number, number, number]
			},
			{
				text: [
					{ text: 'Symptom duration: ', bold: true, color: '#6b7280' },
					{ text: data.clinical.symptomDuration || 'N/A' }
				],
				fontSize: 10,
				margin: [0, 0, 0, 4] as [number, number, number, number]
			},
			{
				text: [
					{ text: 'Red-flag symptoms: ', bold: true, color: '#6b7280' },
					{ text: data.clinical.redFlagSymptoms || 'None documented' }
				],
				fontSize: 10,
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Examination, investigations, medications'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Examination findings', data.examination.examinationFindings || 'N/A'),
							field('Investigation results', data.examination.investigationResults || 'N/A')
						],
						[
							field('Current medications', data.medications.currentMedications || 'N/A'),
							field('Allergies', data.medications.allergies || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Expectations, consent, and safety-netting'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Patient expectations', data.expectations.patientExpectations || 'N/A'),
							field('Consent to share', consentToShareLabel(data.expectations.consentToShare))
						],
						[field('Safety-netting', data.expectations.safetyNetting || 'N/A'), field('', '')]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			...(result.flaggedIssues.length > 0
				? [
						sectionHeader('Referral flags'),
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

			...(data.review.clinicalNote
				? [
						sectionHeader('Note'),
						{
							text: data.review.clinicalNote,
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
