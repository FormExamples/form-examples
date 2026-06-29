import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '$lib/engine/types';
import { gradeLabel, calculateAge } from '$lib/engine/utils';

export function buildPdfDocument(
	data: AssessmentData,
	result: GradingResult
): TDocumentDefinitions {
	const age = calculateAge(data.patientDetails.dateOfBirth);

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'OUTPATIENT OUTCOME REPORT',
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
			// Overall grade
			{
				text: `Overall OOCG Grade: ${result.overallGrade || 'N/A'}`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: gradeLabel(result.overallGrade),
				fontSize: 12,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Domain grades
			sectionHeader('Domain Grades'),
			{
				table: {
					widths: ['*', '*', '*', '*'],
					body: [
						[
							{ text: 'Clinical', bold: true, fontSize: 9 },
							{ text: 'PROM', bold: true, fontSize: 9 },
							{ text: 'PREM', bold: true, fontSize: 9 },
							{ text: 'Operational', bold: true, fontSize: 9 }
						],
						[
							{ text: result.clinicalGrade || '—', fontSize: 12, bold: true },
							{ text: result.promGrade || '—', fontSize: 12, bold: true },
							{ text: result.premGrade || '—', fontSize: 12, bold: true },
							{ text: result.operationalGrade || '—', fontSize: 12, bold: true }
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Patient details
			sectionHeader('Patient & Encounter Details'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Name', `${data.patientDetails.givenName} ${data.patientDetails.familyName}`),
							field('DOB', `${data.patientDetails.dateOfBirth || 'N/A'}${age ? ` (Age ${age})` : ''}`)
						],
						[
							field('NHS Number', data.patientDetails.nhsNumber || 'N/A'),
							field('Clinic Date', data.encounterDetails.clinicDate || 'N/A')
						],
						[
							field('Specialty', data.encounterDetails.specialty || 'N/A'),
							field('Clinician', data.encounterDetails.clinicianName || 'N/A')
						],
						[
							field('Modality', data.encounterDetails.modality || 'N/A'),
							field('Outcome', data.clinicalOutcome.outcomeClassification || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Flagged issues
			...(result.flaggedIssues.length > 0
				? [
						sectionHeader('Flagged Issues'),
						{
							ul: result.flaggedIssues.map((f) => ({
								text: `[${f.priority.toUpperCase()}] ${f.category}: ${f.message}`,
								color:
									f.priority === 'critical' || f.priority === 'high'
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

			// Fired rules
			...(result.firedRules.length > 0
				? [
						sectionHeader('Grading Justification'),
						{
							table: {
								headerRows: 1,
								widths: [60, 80, '*', 40],
								body: [
									[
										{ text: 'Rule ID', bold: true, fontSize: 9 },
										{ text: 'Domain', bold: true, fontSize: 9 },
										{ text: 'Finding', bold: true, fontSize: 9 },
										{ text: 'Grade', bold: true, fontSize: 9 }
									],
									...result.firedRules.map((r) => [
										{ text: r.id, fontSize: 8, color: '#6b7280' },
										{ text: r.domain, fontSize: 9 },
										{ text: r.description, fontSize: 9 },
										{ text: r.grade, fontSize: 9, bold: true }
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
