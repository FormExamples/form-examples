import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult, Subscores } from '#lib/engine/types.js';
import {
	escalationBandLabel,
	priorityLabel,
	clinicianRoleLabel,
	careSettingLabel,
	ageBandLabel,
	respiratoryEffortLabel,
	supplementalOxygenLabel,
	capillaryRefillLabel,
	consciousnessLabel,
	subscoreLabel
} from '#lib/engine/utils.js';

const PARAM_ROWS: { key: keyof Subscores; value: (d: AssessmentData) => string }[] = [
	{
		key: 'respiratoryRate',
		value: (d) =>
			d.respiratory.respiratoryRate === null
				? 'Not recorded'
				: `${d.respiratory.respiratoryRate} breaths/min`
	},
	{
		key: 'respiratoryEffort',
		value: (d) => respiratoryEffortLabel(d.respiratory.respiratoryEffort) || 'Not recorded'
	},
	{
		key: 'oxygenSaturation',
		value: (d) =>
			d.respiratory.oxygenSaturation === null ? 'Not recorded' : `${d.respiratory.oxygenSaturation}%`
	},
	{
		key: 'supplementalOxygen',
		value: (d) => supplementalOxygenLabel(d.respiratory.supplementalOxygen) || 'Not recorded'
	},
	{
		key: 'heartRate',
		value: (d) =>
			d.cardiovascular.heartRate === null
				? 'Not recorded'
				: `${d.cardiovascular.heartRate} beats/min`
	},
	{
		key: 'capillaryRefill',
		value: (d) => capillaryRefillLabel(d.cardiovascular.capillaryRefill) || 'Not recorded'
	},
	{
		key: 'consciousness',
		value: (d) => consciousnessLabel(d.behaviour.consciousness) || 'Not recorded'
	}
];

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'PAEDIATRIC EARLY WARNING SCORE (PEWS) REPORT',
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
				text: `Aggregate PEWS: ${result.aggregateScore}`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `${escalationBandLabel(result.escalationBand)}${result.singleParameterTrigger ? ' (single-parameter = 3)' : ''}`,
				fontSize: 12,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 20] as [number, number, number, number]
			},

			sectionHeader('Recommended response'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[field('Monitoring frequency', result.monitoringFrequency), field('', '')],
						[
							{
								text: result.recommendation,
								colSpan: 2,
								margin: [0, 4, 0, 4] as [number, number, number, number]
							},
							{}
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
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
							field('Observed at', data.context.observationAt || 'N/A')
						],
						[
							field('Patient identifier', data.identification.patientIdentifier || 'N/A'),
							field('Age band', ageBandLabel(data.identification.ageBand) || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Parameters'),
			{
				table: {
					headerRows: 1,
					widths: ['*', 'auto', 'auto'],
					body: [
						[
							{ text: 'Parameter', bold: true, fontSize: 9 },
							{ text: 'Value', bold: true, fontSize: 9 },
							{ text: 'Score', bold: true, fontSize: 9 }
						],
						...PARAM_ROWS.map((row) => {
							const points = result.subscores[row.key];
							return [
								{ text: subscoreLabel(row.key), fontSize: 9 },
								{ text: row.value(data), fontSize: 9 },
								{ text: points === null ? '-' : String(points), fontSize: 9, bold: true }
							];
						})
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

			...(data.note.clinicalNotes
				? [
						sectionHeader('Clinical note'),
						{
							text: data.note.clinicalNotes,
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
