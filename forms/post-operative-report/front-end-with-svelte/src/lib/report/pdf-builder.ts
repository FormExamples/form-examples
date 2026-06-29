import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '$lib/engine/types';
import { gradeLabel, gradeDescription, dispositionLabel, formatDuration, calculateAge } from '$lib/engine/utils';

export function buildPdfDocument(
	data: AssessmentData,
	result: GradingResult
): TDocumentDefinitions {
	const age = calculateAge(data.patientDetails.dateOfBirth);
	const proc = data.procedureDetails;

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'POST-OPERATIVE REPORT',
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
			// Overall Clavien-Dindo grade
			{
				text: `Overall Clavien-Dindo: ${gradeLabel(result.overallGrade)}`,
				fontSize: 22,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: gradeDescription(result.overallGrade),
				fontSize: 10,
				alignment: 'center',
				color: '#4b5563',
				margin: [0, 0, 0, 6]
			},
			{
				text: `${result.complicationCount} graded complication${result.complicationCount === 1 ? '' : 's'} recorded.`,
				fontSize: 10,
				alignment: 'center',
				color: '#4b5563',
				margin: [0, 0, 0, 18]
			},

			// Patient & procedure details
			sectionHeader('Patient & Procedure'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Name', `${data.patientDetails.firstName} ${data.patientDetails.lastName}`),
							field('DOB', `${data.patientDetails.dateOfBirth}${age ? ` (Age ${age})` : ''}`)
						],
						[
							field('MRN', data.patientDetails.mrn || 'N/A'),
							field('ASA', data.patientDetails.asaGrade || 'N/A')
						],
						[
							field('Procedure', proc.procedureName || 'N/A'),
							field('Priority', proc.priority || 'N/A')
						],
						[
							field('Date of surgery', proc.dateOfSurgery || 'N/A'),
							field('Duration', formatDuration(proc.durationMinutes))
						],
						[
							field('Surgeon', data.surgicalTeam.primarySurgeon || 'N/A'),
							field('Disposition', dispositionLabel(data.immediatePostopStatus.disposition))
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Flagged issues
			...(result.additionalFlags.length > 0
				? [
						sectionHeader('Flagged Issues'),
						{
							ul: result.additionalFlags.map((f) => ({
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

			// Per-complication grades
			...(result.firedRules.length > 0
				? [
						sectionHeader('Per-complication Grades'),
						{
							table: {
								headerRows: 1,
								widths: [50, '*', 60, '*'],
								body: [
									[
										{ text: 'ID', bold: true, fontSize: 9 },
										{ text: 'Complication', bold: true, fontSize: 9 },
										{ text: 'Grade', bold: true, fontSize: 9 },
										{ text: 'Description', bold: true, fontSize: 9 }
									],
									...result.firedRules.map((r) => [
										{ text: r.id, fontSize: 8, color: '#6b7280' },
										{ text: r.category, fontSize: 9 },
										{ text: gradeLabel(r.grade), fontSize: 9, bold: true },
										{ text: r.description, fontSize: 8 }
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
