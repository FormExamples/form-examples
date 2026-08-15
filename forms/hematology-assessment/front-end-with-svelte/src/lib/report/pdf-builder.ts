import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import { abnormalityLevelLabel } from '#lib/engine/utils.js';

export function buildPdfDocument(
	data: AssessmentData,
	result: GradingResult
): TDocumentDefinitions {
	const p = data.patientInformation;

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'HEMATOLOGY ASSESSMENT REPORT',
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
			// Title & classification
			{
				text: `Composite Abnormality Score: ${result.abnormalityScore}%`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: abnormalityLevelLabel(result.abnormalityLevel),
				fontSize: 12,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 20] as [number, number, number, number]
			},

			// Patient details
			sectionHeader('Patient Details'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[field('Patient', p.patientName || 'N/A'), field('DOB', p.dateOfBirth || 'N/A')],
						[field('MRN', p.medicalRecordNumber || 'N/A'), field('Specimen date', p.specimenDate || 'N/A')],
						[
							field('Referring physician', p.referringPhysician || 'N/A'),
							field('Clinical indication', p.clinicalIndication || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Flagged issues
			...(result.additionalFlags.length > 0
				? [
						sectionHeader('Flagged Issues for Haematologist'),
						{
							ul: result.additionalFlags.map((f) => ({
								text: `[${f.priority.toUpperCase()}] ${f.category}: ${f.message}`,
								color: f.priority === 'high' ? '#dc2626' : f.priority === 'medium' ? '#d97706' : '#4b5563',
								margin: [0, 2, 0, 2] as [number, number, number, number]
							})),
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			// Fired rules
			...(result.firedRules.length > 0
				? [
						sectionHeader('Hematology Analysis'),
						{
							table: {
								headerRows: 1,
								widths: [60, 80, '*', 50],
								body: [
									[
										{ text: 'Rule ID', bold: true, fontSize: 9 },
										{ text: 'Category', bold: true, fontSize: 9 },
										{ text: 'Description', bold: true, fontSize: 9 },
										{ text: 'Concern', bold: true, fontSize: 9 }
									],
									...result.firedRules.map((r) => [
										{ text: r.id, fontSize: 8, color: '#6b7280' },
										{ text: r.category, fontSize: 9 },
										{ text: r.description, fontSize: 9 },
										{ text: r.concernLevel, fontSize: 9, bold: true }
									])
								]
							},
							layout: 'lightHorizontalLines',
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			// Clinical review
			...(data.clinicalReview.diagnosis || data.clinicalReview.clinicalSummary || data.clinicalReview.followUpPlan
				? [
						sectionHeader('Clinical Review'),
						{
							stack: [
								...(data.clinicalReview.diagnosis ? [field('Diagnosis', data.clinicalReview.diagnosis)] : []),
								...(data.clinicalReview.clinicalSummary ? [field('Clinical summary', data.clinicalReview.clinicalSummary)] : []),
								...(data.clinicalReview.followUpPlan ? [field('Follow-up plan', data.clinicalReview.followUpPlan)] : []),
								...(data.clinicalReview.additionalNotes ? [field('Additional notes', data.clinicalReview.additionalNotes)] : [])
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
