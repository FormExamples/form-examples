import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import {
	gfrCategoryLabel,
	albuminuriaCategoryLabel,
	kdigoRiskZoneLabel,
	reviewStatusLabel,
	priorityLabel,
	clinicianRoleLabel,
	careSettingLabel,
	sexLabel,
	ageBandLabel,
	diabetesStatusLabel,
	primaryCauseLabel,
	referralDecisionLabel
} from '#lib/engine/utils.js';

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	const documentedCount = result.componentStatuses.filter((c) => c.documented).length;
	const zone = result.kdigoRiskZone;
	const bpt = result.bloodPressureTarget;
	const bpNote =
		result.bloodPressureAtTarget === null
			? 'blood pressure not recorded'
			: result.bloodPressureAtTarget
				? 'recorded blood pressure at target'
				: 'recorded blood pressure above target';

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'CHRONIC KIDNEY DISEASE ANNUAL REVIEW REPORT',
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
				text: `KDIGO risk zone: ${kdigoRiskZoneLabel(zone)}`,
				fontSize: 20,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `G-stage ${gfrCategoryLabel(result.gfrCategory)} · A-stage ${albuminuriaCategoryLabel(result.albuminuriaCategory)} · Review: ${reviewStatusLabel(result.reviewStatus)} — ${documentedCount} of ${result.componentStatuses.length} bundle items documented`,
				fontSize: 12,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 20] as [number, number, number, number]
			},

			sectionHeader('Blood-pressure target'),
			{
				text: bpt
					? `Target ${bpt.systolic}/${bpt.diastolic} mmHg — ${bpNote}.`
					: 'No blood-pressure target derived.',
				fontSize: 10,
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Review context'),
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
							field('Date of review', data.context.reviewedAt || 'N/A')
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
							field('Identifier', data.patient.patientIdentifier || 'N/A'),
							field('Age band', ageBandLabel(data.patient.ageBand) || 'N/A')
						],
						[
							field('Sex', sexLabel(data.patient.sex) || 'N/A'),
							field('Diabetes', diabetesStatusLabel(data.patient.diabetesStatus) || 'N/A')
						],
						[
							field('Primary cause', primaryCauseLabel(data.patient.primaryCause) || 'N/A'),
							field('Referral decision', referralDecisionLabel(data.summary.referralDecision) || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Review completeness'),
			{
				table: {
					headerRows: 1,
					widths: ['*', 'auto'],
					body: [
						[
							{ text: 'Component', bold: true, fontSize: 9 },
							{ text: 'Status', bold: true, fontSize: 9 }
						],
						...result.componentStatuses.map((c) => [
							{ text: c.label, fontSize: 9 },
							{ text: c.documented ? 'Recorded' : 'Outstanding', fontSize: 9, bold: true }
						])
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

			...(data.summary.clinicalNote
				? [
						sectionHeader('Clinician note and plan'),
						{
							text: data.summary.clinicalNote,
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
