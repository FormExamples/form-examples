import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { HipaaAuthorization, ValidationResult } from '#lib/engine/types.js';
import {
	validityStatusLabel,
	completenessStatusLabel,
	primaryPurposeLabel,
	signerRelationshipLabel,
	recordCategoryLabels,
	calculateAge
} from '#lib/engine/utils.js';

export function buildPdfDocument(
	data: HipaaAuthorization,
	result: ValidationResult
): TDocumentDefinitions {
	const age = calculateAge(data.patient.birthDate);
	const categories = recordCategoryLabels(data.recordsToDisclose);

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'HIPAA AUTHORIZATION REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.validatedAt).toLocaleString()} | engine v${result.validatorVersion}`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			// Validity & completeness
			{
				text: `Validity: ${validityStatusLabel(result.validityStatus)}`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `Completeness ${result.completenessScore}% (${completenessStatusLabel(result.completenessStatus)})`,
				fontSize: 12,
				alignment: 'center',
				color: '#4b5563',
				margin: [0, 0, 0, 20]
			},

			// Authorization details
			sectionHeader('Authorization Details'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Patient', data.patient.name || 'N/A'),
							field('DOB', `${data.patient.birthDate ?? 'N/A'}${age ? ` (Age ${age})` : ''}`)
						],
						[
							field('Signed by', signerRelationshipLabel(data.signer.relationship)),
							field('Purpose', primaryPurposeLabel(data.purposeOfDisclosure.primaryPurpose))
						],
						[
							field(
								'Recipient',
								data.authorizedRecipient.recipientOrganization ||
									data.authorizedRecipient.recipientName ||
									'N/A'
							),
							field('Signature date', data.signatureWitness.signatureDate ?? 'N/A')
						],
						[field('PHI categories', categories.join(', ') || 'None selected'), field('', '')]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Fired rules
			...(result.firedRules.length > 0
				? [
						sectionHeader('Fired Rules'),
						{
							table: {
								headerRows: 1,
								widths: [90, '*', 60],
								body: [
									[
										{ text: 'Rule', bold: true, fontSize: 9 },
										{ text: 'Finding', bold: true, fontSize: 9 },
										{ text: 'Priority', bold: true, fontSize: 9 }
									],
									...result.firedRules.map((r) => [
										{ text: r.ruleId, fontSize: 8, color: '#6b7280' },
										{ text: `${r.description} (${r.citation})`, fontSize: 9 },
										{ text: r.priority.toUpperCase(), fontSize: 9, bold: true }
									])
								]
							},
							layout: 'lightHorizontalLines',
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: [{ text: 'No HIPAA rules fired.', italics: true, margin: [0, 0, 0, 16] as [number, number, number, number] }]),

			// Additional flags
			...(result.additionalFlags.length > 0
				? [
						sectionHeader('Additional Flags'),
						{
							ul: result.additionalFlags.map((f) => ({
								text: `[${f.priority.toUpperCase()}] ${f.category}: ${f.message}`,
								color: f.priority === 'high' ? '#dc2626' : f.priority === 'medium' ? '#d97706' : '#4b5563',
								margin: [0, 2, 0, 2] as [number, number, number, number]
							})),
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
