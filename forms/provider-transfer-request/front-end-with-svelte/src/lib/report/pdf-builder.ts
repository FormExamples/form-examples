import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import {
	completenessLabel,
	priorityLabel,
	sectionLabel,
	calculateAge,
	urgencyLabel
} from '#lib/engine/utils.js';

export function buildPdfDocument(
	data: AssessmentData,
	result: GradingResult
): TDocumentDefinitions {
	const { validation, flags, timestamp } = result;
	const p = data.patientDemographics;
	const age = calculateAge(p.dateOfBirth);

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'PROVIDER TRANSFER REQUEST',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(timestamp).toLocaleString()}`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: `Completeness: ${completenessLabel(validation.completeness)}`,
				fontSize: 22,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `${validation.totalSatisfied} of ${validation.totalRequired} fields answered · ${validation.mandatorySatisfied} of ${validation.mandatoryRequired} mandatory · Urgency: ${urgencyLabel(data.situation.urgency)}`,
				fontSize: 11,
				alignment: 'center',
				color: '#4b5563',
				margin: [0, 0, 0, 16]
			},

			sectionHeader('Patient & Transfer'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Patient', `${p.firstName} ${p.lastName}`),
							field('DOB', `${p.dateOfBirth}${age ? ` (Age ${age})` : ''}`)
						],
						[
							field('NHS / Hospital no.', `${p.nhsNumber || '—'} / ${p.hospitalNumber || '—'}`),
							field('Primary diagnosis', data.situation.primaryDiagnosis || '—')
						],
						[
							field('From', data.requestingProvider.organisation || '—'),
							field('To', data.receivingProvider.organisation || '—')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16]
			},

			...(flags.length > 0
				? [
						sectionHeader('Flagged Issues'),
						{
							ul: flags.map((f) => ({
								text: `[${priorityLabel(f.priority).toUpperCase()}] ${f.category}: ${f.message}`,
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

			sectionHeader('Section Completeness'),
			{
				table: {
					headerRows: 1,
					widths: ['*', 70, '*'],
					body: [
						[
							{ text: 'Section', bold: true, fontSize: 9 },
							{ text: 'Answered', bold: true, fontSize: 9 },
							{ text: 'Missing items', bold: true, fontSize: 9 }
						],
						...validation.sections.map((s) => [
							{ text: sectionLabel(s.section), fontSize: 9 },
							{ text: `${s.satisfied}/${s.required}`, fontSize: 9 },
							{
								text:
									s.missing.length === 0
										? 'All required fields completed.'
										: s.missing
												.map((m) => `${m.id} — ${m.description}${m.mandatory ? ' (mandatory)' : ''}`)
												.join('\n'),
								fontSize: 8,
								color: '#4b5563'
							}
						])
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16]
			}
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
