import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import { riskLevelLabel, severityLabel, calculateAge } from '#lib/engine/utils.js';

export function buildPdfDocument(
	data: AssessmentData,
	result: GradingResult
): TDocumentDefinitions {
	const dem = data.probandDemographics;
	const age = calculateAge(dem.dateOfBirth);

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'GENETICS ASSESSMENT REPORT',
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
				text: `Overall Genetic Risk: ${riskLevelLabel(result.riskLevel)}`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 16]
			},

			// Computed scores
			sectionHeader('Computed Scores'),
			{
				table: {
					headerRows: 1,
					widths: ['*', 'auto', '*'],
					body: [
						[
							{ text: 'Instrument', bold: true, fontSize: 9 },
							{ text: 'Result', bold: true, fontSize: 9 },
							{ text: 'Threshold', bold: true, fontSize: 9 }
						],
						[
							{ text: 'Manchester Score', fontSize: 9 },
							{ text: String(result.manchesterScore), fontSize: 9 },
							{ text: '>=15 consider; >=20 moderate; >=30 high', fontSize: 9 }
						],
						[
							{ text: 'Bethesda criteria met', fontSize: 9 },
							{ text: `${result.bethesdaMet} / 5`, fontSize: 9 },
							{ text: '>=1 indicates MMR IHC / MSI testing', fontSize: 9 }
						],
						[
							{ text: 'PREMM5 (external)', fontSize: 9 },
							{ text: result.premm5Score === null ? '—' : `${result.premm5Score}%`, fontSize: 9 },
							{ text: '>=5% indicates Lynch testing', fontSize: 9 }
						],
						[
							{ text: 'Tyrer-Cuzick lifetime (external)', fontSize: 9 },
							{ text: result.tyrerCuzickLifetime ? `${result.tyrerCuzickLifetime}%` : '—', fontSize: 9 },
							{ text: '>=17% moderate; >=30% high (NICE FH)', fontSize: 9 }
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Patient Details
			sectionHeader('Proband Details'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Name', `${dem.firstName} ${dem.lastName}`),
							field('DOB', `${dem.dateOfBirth}${age ? ` (Age ${age})` : ''}`)
						],
						[field('Sex', dem.sex || 'N/A'), field('MRN', dem.mrn || 'N/A')]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Additional Flags
			...(result.additionalFlags.length > 0
				? [
						sectionHeader('Flagged Issues for Clinician'),
						{
							ul: result.additionalFlags.map((f) => ({
								text: `[${f.priority.toUpperCase()}] ${f.category}: ${f.message}`,
								color:
									f.priority === 'high'
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

			// Fired Rules
			...(result.firedRules.length > 0
				? [
						sectionHeader('Risk Assessment Justification'),
						{
							table: {
								headerRows: 1,
								widths: [70, 90, '*', 55],
								body: [
									[
										{ text: 'Rule ID', bold: true, fontSize: 9 },
										{ text: 'Category', bold: true, fontSize: 9 },
										{ text: 'Finding', bold: true, fontSize: 9 },
										{ text: 'Severity', bold: true, fontSize: 9 }
									],
									...result.firedRules.map((r) => [
										{ text: r.id, fontSize: 8, color: '#6b7280' },
										{ text: r.category, fontSize: 9 },
										{ text: r.description, fontSize: 9 },
										{ text: severityLabel(r.severity), fontSize: 9, bold: true }
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
