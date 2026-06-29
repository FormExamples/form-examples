import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '$lib/engine/types';
import { outcomeLabel, outcomeDescription, reasonLabel, formatDate } from '$lib/engine/utils';

export function buildPdfDocument(
	data: AssessmentData,
	result: GradingResult
): TDocumentDefinitions {
	const emp = data.employeeDetails;

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'EMPLOYEE OFFBOARDING CHECKLIST REPORT',
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
			// Title & outcome
			{
				text: `Outcome: ${outcomeLabel(result.outcome)}`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: outcomeDescription(result.outcome),
				fontSize: 11,
				alignment: 'center',
				color: '#4b5563',
				margin: [0, 0, 0, 4]
			},
			{
				text: `Mandatory items satisfied: ${result.mandatorySatisfied} / ${result.mandatoryTotal} (${result.completionPercent}%)`,
				fontSize: 11,
				alignment: 'center',
				color: '#4b5563',
				margin: [0, 0, 0, 20]
			},

			// Employee details
			sectionHeader('Employee Details'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[field('Name', `${emp.firstName} ${emp.lastName}`), field('Employee ID', emp.employeeId || 'N/A')],
						[field('Job title', emp.jobTitle || 'N/A'), field('Department', emp.department || 'N/A')],
						[field('Line manager', emp.lineManager || 'N/A'), field('Last working day', formatDate(emp.lastWorkingDay))],
						[field('Reason for leaving', reasonLabel(emp.reasonForLeaving)), field('', '')]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Blockers
			...(result.blockers.length > 0
				? [
						sectionHeader('Blocking items (exit must not proceed)'),
						{
							ul: result.blockers.map((b) => `[${b.id}] ${b.category}: ${b.description}`),
							color: '#dc2626',
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			// Flagged issues
			...(result.additionalFlags.length > 0
				? [
						sectionHeader('Flagged Issues for HR / Line Manager'),
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

			// Outstanding items
			...(result.firedRules.length > 0
				? [
						sectionHeader('Outstanding Checklist Items'),
						{
							table: {
								headerRows: 1,
								widths: [60, '*', 60, 50],
								body: [
									[
										{ text: 'Item ID', bold: true, fontSize: 9 },
										{ text: 'Description', bold: true, fontSize: 9 },
										{ text: 'Mandatory', bold: true, fontSize: 9 },
										{ text: 'Blocker', bold: true, fontSize: 9 }
									],
									...result.firedRules.map((r) => [
										{ text: r.id, fontSize: 8, color: '#6b7280' },
										{ text: `${r.category}: ${r.description}`, fontSize: 9 },
										{ text: r.mandatory ? 'Yes' : 'No', fontSize: 9 },
										{ text: r.blocker ? 'Yes' : 'No', fontSize: 9, bold: r.blocker }
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
	if (!label) return { text: '', margin: [0, 4, 0, 4] as [number, number, number, number] };
	return {
		text: [
			{ text: `${label}: `, bold: true, color: '#6b7280' },
			{ text: value }
		],
		margin: [0, 4, 0, 4] as [number, number, number, number]
	};
}
