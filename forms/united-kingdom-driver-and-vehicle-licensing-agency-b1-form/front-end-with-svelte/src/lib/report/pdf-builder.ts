import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, FlaggedIssue, ValidationResult } from '$lib/engine/types';
import {
	calculateAge,
	countConditionsDeclared,
	sectionLabel,
	statusLabel
} from '$lib/engine/utils';

/**
 * Build the printable DVLA B1 report definition: a completeness summary, the
 * outstanding (missing) fields grouped by section, and the flagged issues for
 * clinician review.
 */
export function buildPdfDocument(
	data: AssessmentData,
	validation: ValidationResult,
	flags: FlaggedIssue[]
): TDocumentDefinitions {
	const age = calculateAge(data.personalDetails.dateOfBirth);
	const completeness =
		validation.totalRequired === 0
			? 100
			: Math.round((validation.totalSatisfied / validation.totalRequired) * 100);

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'DVLA B1 — CONFIDENTIAL MEDICAL INFORMATION (NEUROLOGICAL)',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 9,
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
				text: `Status: ${statusLabel(validation.complete)} (${completeness}% complete)`,
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

			sectionHeader('Applicant Details'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Name', data.personalDetails.fullName || 'N/A'),
							field('DOB', `${data.personalDetails.dateOfBirth || 'N/A'}${age ? ` (Age ${age})` : ''}`)
						],
						[
							field('Conditions declared', String(countConditionsDeclared(data))),
							field(
								'Epilepsy declared',
								data.seizures.diagnosis === 'more-than-one-or-epilepsy' ? 'Yes' : 'No'
							)
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			...(flags.length > 0
				? [
						sectionHeader('Flagged Issues for Clinician Review'),
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

			...(validation.missing.length > 0
				? [
						sectionHeader('Outstanding Items'),
						{
							table: {
								headerRows: 1,
								widths: [60, 120, '*'],
								body: [
									[
										{ text: 'Rule', bold: true, fontSize: 9 },
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
				: [
						{
							text: 'All required fields are complete. Send to DVLA Drivers Medical Group, Swansea, SA99 1DF.',
							fontSize: 10,
							color: '#15803d',
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					])
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
