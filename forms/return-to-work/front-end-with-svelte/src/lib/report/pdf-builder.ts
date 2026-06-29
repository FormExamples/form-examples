import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '$lib/engine/types';
import {
	fitnessStatementLabel,
	restrictionPriorityLabel,
	clinicianRoleLabel,
	mechanismLabel,
	calculateAge
} from '$lib/engine/utils';

export function buildPdfDocument(
	data: AssessmentData,
	result: GradingResult
): TDocumentDefinitions {
	const age = calculateAge(data.patient.dateOfBirth);

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'STATEMENT OF FITNESS FOR WORK',
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
			// Fitness statement & restriction priority
			{
				text: fitnessStatementLabel(result.fitnessStatement),
				fontSize: 22,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `Restriction priority: ${restrictionPriorityLabel(result.restrictionPriority)}`,
				fontSize: 12,
				alignment: 'center',
				color: '#4b5563',
				margin: [0, 0, 0, result.overridden ? 4 : 20]
			},
			...(result.overridden
				? [
						{
							text: `Clinician override applied (computed: ${fitnessStatementLabel(result.computedFitness)})`,
							fontSize: 9,
							italics: true,
							alignment: 'center' as const,
							color: '#4b5563',
							margin: [0, 0, 0, 20] as [number, number, number, number]
						}
					]
				: []),

			// Patient & clinician
			sectionHeader('Patient & Clinician'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Patient', `${data.patient.firstName} ${data.patient.lastName}`),
							field('DOB', `${data.patient.dateOfBirth || 'N/A'}${age ? ` (Age ${age})` : ''}`)
						],
						[
							field('Employer', data.patient.employerName || 'N/A'),
							field('Job title', data.job.jobTitle || 'N/A')
						],
						[
							field('Reason', `${data.diagnosis.primaryDiagnosis || 'N/A'} (${mechanismLabel(data.diagnosis.mechanism)})`),
							field('Days absent', data.absence.totalDaysAbsent != null ? String(data.absence.totalDaysAbsent) : 'N/A')
						],
						[
							field('Clinician', `${data.clinician.name || 'N/A'} (${clinicianRoleLabel(data.clinician.role)})`),
							field('Registration', data.clinician.registrationNumber || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Validity
			sectionHeader('Period of Validity'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Valid from', data.fitness.validFrom || 'N/A'),
							field('Valid to', data.fitness.validTo || (data.fitness.validWeeks != null ? `${data.fitness.validWeeks} weeks` : 'N/A'))
						],
						[
							field('Reassessment required', data.fitness.reassessmentRequired || 'N/A'),
							field('Clinician confidence', data.fitness.clinicianConfidence || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Flagged issues
			...(result.additionalFlags.length > 0
				? [
						sectionHeader('Flagged Issues for Occupational Health'),
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

			// Restriction justification
			...(result.firedRules.length > 0
				? [
						sectionHeader('Restriction Justification'),
						{
							table: {
								headerRows: 1,
								widths: [60, 90, '*', 50],
								body: [
									[
										{ text: 'Rule', bold: true, fontSize: 9 },
										{ text: 'Area', bold: true, fontSize: 9 },
										{ text: 'Adjustment', bold: true, fontSize: 9 },
										{ text: 'Grade', bold: true, fontSize: 9 }
									],
									...result.firedRules.map((r) => [
										{ text: r.id, fontSize: 8, color: '#6b7280' },
										{ text: r.system, fontSize: 9 },
										{ text: r.description, fontSize: 9 },
										{ text: `Grade ${r.grade}`, fontSize: 9, bold: true }
									])
								]
							},
							layout: 'lightHorizontalLines',
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			// Phased return
			...(data.phasedReturn.applicable === 'yes'
				? [
						sectionHeader('Phased Return Plan'),
						{
							ul: [
								`Starting hours/week: ${data.phasedReturn.startHoursPerWeek ?? 'N/A'}`,
								`Days per week: ${data.phasedReturn.daysPerWeek ?? 'N/A'}`,
								`Target full-hours date: ${data.phasedReturn.targetFullHoursDate || 'N/A'}`,
								`Support contact: ${data.phasedReturn.supportContact || 'N/A'}`
							],
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			// Notes
			...(data.signOff.overrideReason || data.signOff.finalNotes
				? [
						sectionHeader('Clinician Notes'),
						{
							text: [
								data.signOff.overrideReason ? `Override reason: ${data.signOff.overrideReason}\n` : '',
								data.signOff.finalNotes || ''
							].join(''),
							fontSize: 9,
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
