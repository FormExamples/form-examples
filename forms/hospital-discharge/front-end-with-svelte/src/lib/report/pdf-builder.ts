import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '$lib/engine/types';
import {
	completenessLabel,
	calculateLengthOfStay,
	calculateAge,
	destinationLabel,
	careResponsibilityLabel
} from '$lib/engine/utils';

export function buildPdfDocument(
	data: AssessmentData,
	result: GradingResult
): TDocumentDefinitions {
	const age = calculateAge(data.patientDetails.dateOfBirth);
	const los = calculateLengthOfStay(
		data.admissionSummary.admissionDate,
		data.admissionSummary.dischargeDate
	);

	const primaryDx = data.diagnoses.diagnoses.filter((x) => x.type === 'primary');
	const secondaryDx = data.diagnoses.diagnoses.filter((x) => x.type === 'secondary');

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'HOSPITAL DISCHARGE SUMMARY',
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
				text: `Completeness: ${completenessLabel(result.completenessLevel)}`,
				fontSize: 20,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `Mandatory ${result.mandatorySatisfied}/${result.mandatoryTotal} · Optional ${result.optionalSatisfied}/${result.optionalTotal}`,
				fontSize: 11,
				alignment: 'center',
				color: '#4b5563',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Patient Details
			sectionHeader('Patient Details'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Name', `${data.patientDetails.firstName} ${data.patientDetails.lastName}`),
							field(
								'DOB',
								`${data.patientDetails.dateOfBirth}${age != null ? ` (Age ${age})` : ''}`
							)
						],
						[
							field('NHS number', data.patientDetails.nhsNumber || 'N/A'),
							field('GP', `${data.patientDetails.gpName} (${data.patientDetails.gpPractice})`)
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Admission Summary
			sectionHeader('Admission Summary'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Admitted', data.admissionSummary.admissionDate || 'N/A'),
							field('Discharged', data.admissionSummary.dischargeDate || 'N/A')
						],
						[
							field('Length of stay', los != null ? `${los} day${los === 1 ? '' : 's'}` : 'N/A'),
							field('Consultant', data.admissionSummary.consultant || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 8] as [number, number, number, number]
			},
			{
				text: `Reason for admission: ${data.admissionSummary.reasonForAdmission || 'N/A'}`,
				fontSize: 9,
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Diagnoses
			sectionHeader('Diagnoses'),
			{
				ul: [
					...primaryDx.map(
						(x) => `Primary: ${x.description}${x.icd10 ? ` (${x.icd10})` : ''}`
					),
					...secondaryDx.map(
						(x) => `Secondary: ${x.description}${x.icd10 ? ` (${x.icd10})` : ''}`
					)
				].length
					? [
							...primaryDx.map((x) => `Primary: ${x.description}${x.icd10 ? ` (${x.icd10})` : ''}`),
							...secondaryDx.map(
								(x) => `Secondary: ${x.description}${x.icd10 ? ` (${x.icd10})` : ''}`
							)
						]
					: ['None recorded'],
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Discharge Medications
			...(data.dischargeMedications.medications.length > 0
				? [
						sectionHeader('Discharge Medications'),
						{
							ul: data.dischargeMedications.medications.map(
								(m) =>
									`${m.name} ${m.dose} ${m.route} ${m.frequency}${m.duration ? ` for ${m.duration}` : ''}${m.status ? ` [${m.status}]` : ''}`
							),
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			// Community Care
			sectionHeader('Community Care'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field(
								'Destination',
								destinationLabel(data.communityCareInstructions.dischargeDestination)
							),
							field(
								'Care responsibility',
								careResponsibilityLabel(data.communityCareInstructions.careResponsibility)
							)
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Flagged Issues
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

			// Per-rule audit (missing only)
			...(() => {
				const missing = result.firedRules.filter((r) => !r.satisfied);
				return missing.length > 0
					? [
							sectionHeader('Outstanding NICE NG27 Fields'),
							{
								table: {
									headerRows: 1,
									widths: [70, 90, '*', 60],
									body: [
										[
											{ text: 'Rule', bold: true, fontSize: 9 },
											{ text: 'Category', bold: true, fontSize: 9 },
											{ text: 'Field', bold: true, fontSize: 9 },
											{ text: 'Type', bold: true, fontSize: 9 }
										],
										...missing.map((r) => [
											{ text: r.id, fontSize: 8, color: '#6b7280' },
											{ text: r.category, fontSize: 9 },
											{ text: r.description, fontSize: 9 },
											{ text: r.mandatory ? 'Mandatory' : 'Optional', fontSize: 9 }
										])
									]
								},
								layout: 'lightHorizontalLines',
								margin: [0, 0, 0, 16] as [number, number, number, number]
							}
						]
					: [];
			})()
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
