import type { TDocumentDefinitions, Content } from 'pdfmake/interfaces';
import type { AssessmentData, ValidationResult } from '#lib/engine/types.js';
import { priorityLabel } from '#lib/engine/utils.js';

const partLabel = (t: string) =>
	t === 'pre' ? 'Part A — pre-confinement' : t === 'post' ? 'Part B — post-confinement' : 'Not selected';
const issuerLabel = (t: string) =>
	t === 'doctor' ? 'Doctor' : t === 'midwife' ? 'Registered midwife' : 'Not selected';

function sectionHeader(text: string): Content {
	return {
		text,
		fontSize: 13,
		bold: true,
		color: '#111827',
		margin: [0, 12, 0, 6]
	};
}

function field(label: string, value: string): Content {
	return {
		stack: [
			{ text: label, fontSize: 8, color: '#6b7280' },
			{ text: value || 'N/A', fontSize: 10 }
		]
	};
}

/** Build the printable MAT B1 validation report PDF document definition. */
export function buildPdfDocument(
	data: AssessmentData,
	result: ValidationResult
): TDocumentDefinitions {
	const detailRows: Content[][] =
		result.certificateType === 'pre'
			? [
					[
						field('Expected date of confinement', data.preConfinement.expectedDateOfConfinement),
						field('Examination date', data.preConfinement.examinationDate)
					]
				]
			: result.certificateType === 'post'
				? [
						[
							field("Baby's date of birth", data.postConfinement.actualDateOfBirth),
							field('Expected date of confinement', data.postConfinement.expectedDateOfConfinement)
						]
					]
				: [];

	const issuerRows: Content[][] =
		result.issuerType === 'doctor'
			? [
					[field('Doctor', data.issuer.doctor.doctorName), field('Practice', data.issuer.doctor.practiceName)],
					[
						field('Practice address', data.issuer.doctor.practiceAddress),
						field('Stamp applied', data.issuer.doctor.stampApplied === 'yes' ? 'Yes' : 'No')
					]
				]
			: result.issuerType === 'midwife'
				? [
						[field('Midwife', data.issuer.midwife.midwifeName), field('NMC PIN', data.issuer.midwife.nmcPin)],
						[field('NMC expiry', data.issuer.midwife.nmcExpiryDate), field('', '')]
					]
				: [];

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'UK MAT B1 — MATERNITY CERTIFICATE VALIDATION REPORT',
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
				text: `Status: ${result.complete ? 'Complete' : 'Incomplete'}`,
				fontSize: 22,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `${partLabel(result.certificateType)} · ${issuerLabel(result.issuerType)}`,
				fontSize: 11,
				alignment: 'center',
				color: '#4b5563',
				margin: [0, 0, 0, 16]
			},

			sectionHeader('Patient'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Name', data.patientIdentification.patientName),
							field('Date of birth', data.patientIdentification.dateOfBirth)
						],
						[field('NHS number', data.patientIdentification.nhsNumber), field('', '')]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 8]
			},

			sectionHeader('Certificate'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Certificate number', data.issuer.certificateNumber),
							field('Issue date', data.issuer.issueDate)
						],
						...detailRows,
						[
							field('Duplicate', data.issuer.isDuplicate === 'yes' ? 'Yes' : data.issuer.isDuplicate === 'no' ? 'No' : 'N/A'),
							field('Completed in ink', data.issuer.completedInInk === 'yes' ? 'Yes' : data.issuer.completedInInk === 'no' ? 'No' : 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 8]
			},

			...(issuerRows.length > 0
				? [
						sectionHeader('Issuer'),
						{
							table: { widths: ['*', '*'], body: issuerRows },
							layout: 'lightHorizontalLines' as const,
							margin: [0, 0, 0, 8] as [number, number, number, number]
						}
					]
				: []),

			...(result.firedRules.length > 0
				? [
						sectionHeader('Validation findings'),
						{
							ul: result.firedRules.map(
								(r) => `[${priorityLabel(r.priority)}] ${r.id} — ${r.message}`
							),
							fontSize: 9,
							margin: [0, 0, 0, 8] as [number, number, number, number]
						}
					]
				: []),

			...(result.additionalFlags.length > 0
				? [
						sectionHeader('Flagged issues'),
						{
							ul: result.additionalFlags.map(
								(f) => `[${priorityLabel(f.priority)}] ${f.category} — ${f.message}`
							),
							fontSize: 9,
							margin: [0, 0, 0, 8] as [number, number, number, number]
						}
					]
				: [])
		]
	};
}
