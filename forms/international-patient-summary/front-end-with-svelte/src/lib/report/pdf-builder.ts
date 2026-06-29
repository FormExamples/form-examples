import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '$lib/engine/types';
import { completenessLevelLabel, ruleStatusLabel, calculateAge } from '$lib/engine/utils';

export function buildPdfDocument(
	data: AssessmentData,
	result: GradingResult
): TDocumentDefinitions {
	const p = data.patientDemographics;
	const age = calculateAge(p.dateOfBirth);

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'INTERNATIONAL PATIENT SUMMARY',
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
			// Completeness summary
			{
				text: `Completeness: ${completenessLevelLabel(result.completenessLevel)}`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `${result.mandatoryPopulated} / ${result.mandatoryTotal} mandatory sections, ${result.optionalPopulated} / ${result.optionalTotal} optional sections populated`,
				fontSize: 11,
				alignment: 'center',
				color: '#4b5563',
				margin: [0, 0, 0, 20]
			},

			// Patient Details
			sectionHeader('Patient Details'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Name', `${p.givenName} ${p.familyName}`.trim() || 'N/A'),
							field('DOB', `${p.dateOfBirth || 'N/A'}${age ? ` (Age ${age})` : ''}`)
						],
						[field('Sex', p.sex || 'N/A'), field('National ID', p.nationalIdentifier || 'N/A')],
						[field('Country', p.country || 'N/A'), field('Language', p.preferredLanguage || 'N/A')]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Flagged Issues
			...(result.additionalFlags.length > 0
				? [
						sectionHeader('Flagged Issues for Receiving Clinician'),
						{
							ul: result.additionalFlags.map((f) => ({
								text: `[${f.priority.toUpperCase()}] ${f.category}: ${f.message}`,
								color:
									f.priority === 'urgent' || f.priority === 'high'
										? '#dc2626'
										: f.priority === 'medium'
											? '#2563eb'
											: '#4b5563',
								margin: [0, 2, 0, 2] as [number, number, number, number]
							})),
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			// Per-section validation
			sectionHeader('Per-section Validation'),
			{
				table: {
					headerRows: 1,
					widths: [60, '*', '*', 70],
					body: [
						[
							{ text: 'ID', bold: true, fontSize: 9 },
							{ text: 'Section', bold: true, fontSize: 9 },
							{ text: 'Requirement', bold: true, fontSize: 9 },
							{ text: 'Status', bold: true, fontSize: 9 }
						],
						...result.firedRules.map((r) => [
							{ text: r.id, fontSize: 8, color: '#6b7280' },
							{ text: r.category + (r.mandatory ? '' : ' (optional)'), fontSize: 9 },
							{ text: r.description, fontSize: 9 },
							{ text: ruleStatusLabel(r.status), fontSize: 9, bold: true }
						])
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Allergies
			...(data.allergiesIntolerances.length > 0
				? [
						sectionHeader('Allergies & Intolerances'),
						{
							ul: data.allergiesIntolerances.map(
								(a) =>
									`${a.substance || '(substance not specified)'}${a.reaction ? ` - ${a.reaction}` : ''}${a.severity ? ` (${a.severity})` : ''}`
							),
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
