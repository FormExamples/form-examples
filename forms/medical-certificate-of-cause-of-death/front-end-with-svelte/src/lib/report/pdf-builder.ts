import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { DeathCertificate, ValidationResult } from '$lib/engine/types';
import {
	validityClassLabel,
	priorityLabel,
	gradeLabel,
	sexLabel,
	seenAfterDeathByLabel,
	coronerReasonLabel,
	medicalExaminerStatusLabel,
	yesNoLabel
} from '$lib/engine/utils';

export function buildPdfDocument(
	data: DeathCertificate,
	result: ValidationResult
): TDocumentDefinitions {
	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'MEDICAL CERTIFICATE OF CAUSE OF DEATH — VALIDITY REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Documentation instrument — NOT the prescribed statutory certificate | Generated ${new Date(result.timestamp).toLocaleString()}`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: `Validity: ${validityClassLabel(result.validityClass)}`,
				fontSize: 18,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `Underlying cause: ${result.underlyingCause || 'Not derived (Part I empty)'}  ·  Coroner referral indicated: ${result.coronerReferralIndicated ? 'Yes' : 'No'}`,
				fontSize: 11,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 20] as [number, number, number, number]
			},

			sectionHeader('Certification'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Certifying doctor', data.certification.certifyingDoctorName || 'N/A'),
							field('Grade', gradeLabel(data.certification.certifyingDoctorGrade) || 'N/A')
						],
						[
							field('GMC reference', data.certification.gmcReference || 'N/A'),
							field('Attended the deceased', yesNoLabel(data.certification.attendedDeceased) || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Deceased'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Name', data.deceased.deceasedName || 'N/A'),
							field('Sex', sexLabel(data.deceased.sex) || 'N/A')
						],
						[
							field('Identifier', data.deceased.patientIdentifier || 'N/A'),
							field(
								'Age at death',
								data.deceased.ageYears != null ? `${data.deceased.ageYears} years` : 'N/A'
							)
						],
						[
							field('Date of death', data.death.dateOfDeath || 'N/A'),
							field('Place of death', data.death.placeOfDeath || 'N/A')
						],
						[
							field('Seen after death', seenAfterDeathByLabel(data.death.seenAfterDeathBy) || 'N/A'),
							field('Time of death', data.death.timeOfDeath || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Part I — direct causal sequence'),
			{
				table: {
					headerRows: 1,
					widths: ['auto', '*', 'auto'],
					body: [
						[
							{ text: 'Line', bold: true, fontSize: 9 },
							{ text: 'Condition', bold: true, fontSize: 9 },
							{ text: 'Interval', bold: true, fontSize: 9 }
						],
						[
							{ text: 'I(a)', fontSize: 9 },
							{ text: data.partI.causeIaCondition || '—', fontSize: 9 },
							{ text: data.partI.causeIaInterval || '—', fontSize: 9 }
						],
						[
							{ text: 'I(b)', fontSize: 9 },
							{ text: data.partI.causeIbCondition || '—', fontSize: 9 },
							{ text: data.partI.causeIbInterval || '—', fontSize: 9 }
						],
						[
							{ text: 'I(c)', fontSize: 9 },
							{ text: data.partI.causeIcCondition || '—', fontSize: 9 },
							{ text: data.partI.causeIcInterval || '—', fontSize: 9 }
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Part II — contributory conditions'),
			{
				text: data.partII.partIiConditions || 'None recorded',
				fontSize: 10,
				margin: [0, 0, 0, 4] as [number, number, number, number]
			},
			{
				text: data.partII.partIiInterval ? `Interval: ${data.partII.partIiInterval}` : '',
				fontSize: 9,
				color: '#6b7280',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Coroner and medical-examiner referral'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Referred to coroner', yesNoLabel(data.referral.referredToCoroner) || 'N/A'),
							field('Coroner reason', coronerReasonLabel(data.referral.coronerReason) || 'N/A')
						],
						[
							field(
								'Medical-examiner status',
								medicalExaminerStatusLabel(data.referral.medicalExaminerStatus) || 'N/A'
							),
							field('', '')
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

			...(data.referral.certifierNote
				? [
						sectionHeader('Certifier note'),
						{
							text: data.referral.certifierNote,
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
