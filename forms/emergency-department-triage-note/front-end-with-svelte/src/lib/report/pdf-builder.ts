import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, TriageResult, Subscores } from '$lib/engine/types';
import {
	priorityLabel,
	targetLabel,
	careSettingLabel,
	arrivalModeLabel,
	ageBandLabel,
	acvpuLabel,
	airOrOxygenLabel,
	subscoreLabel
} from '$lib/engine/utils';

const PARAM_ROWS: { key: keyof Subscores; value: (d: AssessmentData) => string }[] = [
	{
		key: 'respiratoryRate',
		value: (d) =>
			d.vitals.respiratoryRate === null ? 'Not recorded' : `${d.vitals.respiratoryRate} breaths/min`
	},
	{ key: 'spo2', value: (d) => (d.vitals.spo2 === null ? 'Not recorded' : `${d.vitals.spo2}%`) },
	{ key: 'oxygen', value: (d) => airOrOxygenLabel(d.vitals.onOxygen) || 'Not recorded' },
	{
		key: 'systolicBp',
		value: (d) => (d.vitals.systolicBp === null ? 'Not recorded' : `${d.vitals.systolicBp} mmHg`)
	},
	{
		key: 'pulse',
		value: (d) => (d.vitals.pulse === null ? 'Not recorded' : `${d.vitals.pulse} beats/min`)
	},
	{
		key: 'consciousness',
		value: (d) => acvpuLabel(d.vitals.consciousnessAcvpu) || 'Not recorded'
	},
	{
		key: 'temperature',
		value: (d) => (d.vitals.temperature === null ? 'Not recorded' : `${d.vitals.temperature} °C`)
	}
];

export function buildPdfDocument(data: AssessmentData, result: TriageResult): TDocumentDefinitions {
	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'EMERGENCY DEPARTMENT TRIAGE NOTE',
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
				text: `Priority ${result.priorityLevel} — ${result.priorityName}`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `${result.priorityColour.toUpperCase()} · target: ${targetLabel(result.priorityLevel)} · supporting NEWS2 ${result.news2Total}`,
				fontSize: 12,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 20] as [number, number, number, number]
			},

			sectionHeader('Manchester Triage System classification'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Priority level', `${result.priorityLevel} (${result.priorityName})`),
							field('Colour', result.priorityColour.toUpperCase())
						],
						[
							field('Target to first assessment', targetLabel(result.priorityLevel)),
							field('Supporting NEWS2 aggregate', String(result.news2Total))
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			...(result.firedDiscriminators.length > 0
				? [
						sectionHeader('Fired discriminators'),
						{
							ul: result.firedDiscriminators.map((f) => ({
								text: `[Level ${f.level}] ${f.category}: ${f.description}`,
								margin: [0, 2, 0, 2] as [number, number, number, number]
							})),
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			sectionHeader('Triage context'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Triage nurse', data.context.nurseName || 'N/A'),
							field('Care setting', careSettingLabel(data.context.careSetting) || 'N/A')
						],
						[
							field('Patient identifier', data.identification.patientIdentifier || 'N/A'),
							field('Age band', ageBandLabel(data.identification.ageBand) || 'N/A')
						],
						[
							field('Arrival mode', arrivalModeLabel(data.arrival.arrivalMode) || 'N/A'),
							field('Triaged at', data.context.triagedAt || 'N/A')
						],
						[
							field('Presenting complaint', data.complaint.presentingComplaint || 'N/A'),
							field('Pain score', data.pain.painScore === null ? 'N/A' : `${data.pain.painScore}/10`)
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Triage vital signs (supporting NEWS2)'),
			{
				table: {
					headerRows: 1,
					widths: ['*', 'auto', 'auto'],
					body: [
						[
							{ text: 'Parameter', bold: true, fontSize: 9 },
							{ text: 'Value', bold: true, fontSize: 9 },
							{ text: 'NEWS2', bold: true, fontSize: 9 }
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
