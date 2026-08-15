import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import { outcomeLabel, triStateLabel, roleLabel } from '#lib/engine/utils.js';

export function buildPdfDocument(
	data: AssessmentData,
	result: GradingResult
): TDocumentDefinitions {
	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'BLS SKILLS VERIFICATION REPORT',
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
				text: `${result.criticalFailures.length} critical-action failure(s) · ${result.nonCriticalDeficiencies.length} non-critical deficiency(ies) · ${result.answeredCount}/${result.totalRules} items assessed`,
				fontSize: 11,
				alignment: 'center',
				color: '#4b5563',
				margin: [0, 0, 0, 20]
			},

			// Trainee details
			sectionHeader('Trainee Details'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Name', `${data.traineeDetails.firstName} ${data.traineeDetails.lastName}`),
							field('Trainee ID', data.traineeDetails.traineeId || 'N/A')
						],
						[
							field('Role', roleLabel(data.traineeDetails.role) || 'N/A'),
							field('Session date', data.traineeDetails.sessionDate || 'N/A')
						],
						[
							field('Examiner', data.traineeDetails.examinerName || 'N/A'),
							field('Prior cert. expiry', data.traineeDetails.priorCertificationExpiry || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Critical-action failures
			...(result.criticalFailures.length > 0
				? [
						sectionHeader('Critical-Action Failures'),
						{
							ul: result.criticalFailures.map((r) => `${r.category}: ${r.description}`),
							color: '#dc2626',
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			// Flagged issues
			...(result.additionalFlags.length > 0
				? [
						sectionHeader('Flagged Issues for Examiner'),
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

			// Skills checklist
			sectionHeader('Skills Checklist'),
			{
				table: {
					headerRows: 1,
					widths: [70, 30, '*', 55],
					body: [
						[
							{ text: 'Rule ID', bold: true, fontSize: 9 },
							{ text: 'Step', bold: true, fontSize: 9 },
							{ text: 'Skill', bold: true, fontSize: 9 },
							{ text: 'Status', bold: true, fontSize: 9 }
						],
						...result.firedRules.map((r) => [
							{ text: `${r.id}${r.critical ? ' *' : ''}`, fontSize: 8, color: '#6b7280' },
							{ text: String(r.step), fontSize: 9 },
							{ text: r.description, fontSize: 9 },
							{ text: triStateLabel(r.status), fontSize: 9, bold: true }
						])
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 8] as [number, number, number, number]
			},
			{
				text: '* critical action — any failure forces an overall Fail.',
				fontSize: 8,
				color: '#9ca3af',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Measurements
			sectionHeader('Measurements'),
			{
				ul: [
					`Compression rate: ${data.chestCompressions.compressionRate ?? 'N/A'} /min`,
					`Compression depth: ${data.chestCompressions.compressionDepth ?? 'N/A'} cm`,
					`Time to first shock: ${data.aedShockDelivery.timeToFirstShockSeconds ?? 'N/A'} s`
				],
				margin: [0, 0, 0, 16] as [number, number, number, number]
			}
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
