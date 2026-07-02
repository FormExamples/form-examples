import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '$lib/engine/types';
import {
	bandLabel,
	priorityLabel,
	signed,
	careSettingLabel,
	clinicianRoleLabel,
	sexLabel,
	ageBandLabel,
	hypoglycaemiaCorrectedLabel
} from '$lib/engine/utils';

/** The seven scored criteria, in report order, with their answer and point. */
function criteriaRows(data: AssessmentData, result: GradingResult) {
	const yn = (v: string) => (v === 'yes' ? 'Yes' : v === 'no' ? 'No' : 'Not recorded');
	const rows: [string, string, number][] = [
		['Loss of consciousness / syncope', yn(data.mimics.lossOfConsciousness), result.lossOfConsciousnessPoint],
		['Seizure activity', yn(data.mimics.seizureActivity), result.seizureActivityPoint],
		['Asymmetric facial weakness', yn(data.signs.facialWeakness), result.facialWeaknessPoint],
		['Asymmetric arm weakness', yn(data.signs.armWeakness), result.armWeaknessPoint],
		['Asymmetric leg weakness', yn(data.signs.legWeakness), result.legWeaknessPoint],
		['Speech disturbance', yn(data.signs.speechDisturbance), result.speechDisturbancePoint],
		['Visual field defect', yn(data.signs.visualFieldDefect), result.visualFieldDefectPoint]
	];
	return rows.map(([label, answer, point]) => [
		{ text: label, fontSize: 9 },
		{ text: answer, fontSize: 9 },
		{ text: signed(point), fontSize: 9, bold: true }
	]);
}

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	const glucose = data.precondition.bloodGlucose;
	const glucoseValue = glucose === null ? 'Not recorded' : `${glucose} mmol/L`;

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'ROSIER ASSESSMENT REPORT',
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
				text: `ROSIER score: ${signed(result.rosierScore)} (range -2 to +5)`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: bandLabel(result.band),
				fontSize: 12,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 20] as [number, number, number, number]
			},

			sectionHeader('Assessment context'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Clinician', data.context.clinicianName || 'N/A'),
							field('Role', clinicianRoleLabel(data.context.clinicianRole) || 'N/A')
						],
						[
							field('Care setting', careSettingLabel(data.context.careSetting) || 'N/A'),
							field('Assessed at', data.context.assessedAt || 'N/A')
						],
						[
							field('Symptom onset', data.context.symptomOnsetAt || 'N/A'),
							field('Screen', result.band === 'stroke-likely' ? 'Positive (> 0)' : 'Negative (<= 0)')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Patient'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Identifier', data.identification.patientIdentifier || 'N/A'),
							field('Age band', ageBandLabel(data.identification.ageBand) || 'N/A')
						],
						[field('Sex', sexLabel(data.identification.sex) || 'N/A'), field('', '')]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Blood glucose precondition'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Blood glucose', glucoseValue),
							field(
								'Hypoglycaemia corrected',
								hypoglycaemiaCorrectedLabel(data.precondition.hypoglycaemiaCorrected) || 'N/A'
							)
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Criteria'),
			{
				table: {
					headerRows: 1,
					widths: ['*', 'auto', 'auto'],
					body: [
						[
							{ text: 'Criterion', bold: true, fontSize: 9 },
							{ text: 'Answer', bold: true, fontSize: 9 },
							{ text: 'Point', bold: true, fontSize: 9 }
						],
						...criteriaRows(data, result)
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

			...(data.note.clinicalNote
				? [
						sectionHeader('Clinical note'),
						{
							text: data.note.clinicalNote,
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
