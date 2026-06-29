import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, ValidationResult } from '$lib/engine/types';
import { calculateAge, priorityLabel } from '$lib/engine/utils';

const conditionLabels: Record<string, string> = {
	anxietyDepressionWithoutImpairment: 'Anxiety or depression (without impairment)',
	anxietyDepressionWithImpairment: 'Anxiety or depression (with suicidal thoughts or impairment)',
	bipolarAffectiveDisorder: 'Bipolar affective disorder',
	eatingDisorder: 'Eating disorder',
	ocdOrPtsd: 'OCD or PTSD',
	personalityDisorder: 'Personality disorder',
	schizophreniaOrPsychosis: 'Schizophrenia, psychosis, delusional or schizoaffective disorder',
	other: 'Other'
};

export function buildPdfDocument(
	data: AssessmentData,
	result: ValidationResult
): TDocumentDefinitions {
	const age = calculateAge(data.personalDetails.dateOfBirth);

	const selectedConditions = Object.entries(conditionLabels)
		.filter(([key]) => (data.mentalHealthConditions as unknown as Record<string, string>)[key] === 'yes')
		.map(([, label]) => label);

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'DVLA M1 — CONFIDENTIAL MEDICAL INFORMATION (MENTAL HEALTH)',
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
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: result.stoppedAtQ1 ? 'Q1 = No (form stopped)' : 'Q1 = Yes (full form)',
				fontSize: 12,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 4] as [number, number, number, number]
			},
			{
				text: `${result.conditionCount} condition(s) reported`,
				fontSize: 12,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 20] as [number, number, number, number]
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
							field('Postcode', data.personalDetails.postcode || 'N/A'),
							field('Contact', data.personalDetails.contactNumber || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			...(result.additionalFlags.length > 0
				? [
						sectionHeader('Flagged Issues for DVLA Medical Assessor'),
						{
							ul: result.additionalFlags.map((f) => ({
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

			...(result.firedRules.length > 0
				? [
						sectionHeader('Validation Issues'),
						{
							table: {
								headerRows: 1,
								widths: [60, 80, '*', 50],
								body: [
									[
										{ text: 'Rule ID', bold: true, fontSize: 9 },
										{ text: 'Category', bold: true, fontSize: 9 },
										{ text: 'Finding', bold: true, fontSize: 9 },
										{ text: 'Priority', bold: true, fontSize: 9 }
									],
									...result.firedRules.map((r) => [
										{ text: r.id, fontSize: 8, color: '#6b7280' },
										{ text: r.category, fontSize: 9 },
										{ text: r.message, fontSize: 9 },
										{ text: priorityLabel(r.priority), fontSize: 9, bold: true }
									])
								]
							},
							layout: 'lightHorizontalLines',
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			...(selectedConditions.length > 0
				? [
						sectionHeader('Reported Mental Health Conditions'),
						{
							ul: [
								...selectedConditions,
								...(data.mentalHealthConditions.other === 'yes' &&
								data.mentalHealthConditions.otherDetails
									? [`Other details: ${data.mentalHealthConditions.otherDetails}`]
									: [])
							],
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
