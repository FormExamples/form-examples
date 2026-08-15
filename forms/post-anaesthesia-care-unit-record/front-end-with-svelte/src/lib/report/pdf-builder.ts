import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import {
	readinessBandLabel,
	priorityLabel,
	anaestheticTechniqueLabel,
	nurseRoleLabel,
	sexLabel,
	ageBandLabel,
	asaStatusLabel
} from '#lib/engine/utils.js';
import { aldreteValueLabel } from '#lib/engine/pacu-rules.js';

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	const aldreteRows = [
		['activity', 'Activity', result.activityScore],
		['respiration', 'Respiration', result.respirationScore],
		['circulation', 'Circulation', result.circulationScore],
		['consciousness', 'Consciousness', result.consciousnessScore],
		['oxygenSaturation', 'Oxygen saturation', result.oxygenSaturationScore]
	] as const;

	const sectionKeyed: Record<string, string> = {
		activity: data.activity.activity,
		respiration: data.respiration.respiration,
		circulation: data.circulation.circulation,
		consciousness: data.consciousness.consciousness,
		oxygenSaturation: data.oxygenSaturation.oxygenSaturation
	};

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'POST-ANAESTHESIA CARE UNIT (PACU) RECORD',
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
				text: `Modified Aldrete score: ${result.aldreteTotal} of 10`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: readinessBandLabel(result.readinessBand),
				fontSize: 12,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 20] as [number, number, number, number]
			},

			sectionHeader('Recovery context'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Recording nurse', data.context.nurseName || 'N/A'),
							field('Role', nurseRoleLabel(data.context.nurseRole) || 'N/A')
						],
						[
							field('Anaesthetist', data.context.anaesthetistName || 'N/A'),
							field('Technique', anaestheticTechniqueLabel(data.context.anaestheticTechnique) || 'N/A')
						],
						[
							field('Admitted to PACU', data.context.admittedAt || 'N/A'),
							field('Procedure', data.context.procedure || 'N/A')
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
						[
							field('Sex', sexLabel(data.identification.sex) || 'N/A'),
							field('ASA status', asaStatusLabel(data.identification.asaStatus) || 'N/A')
						],
						[
							field(
								'Baseline systolic BP',
								data.identification.baselineSystolicBp === null
									? 'N/A'
									: `${data.identification.baselineSystolicBp} mmHg`
							),
							field('Day-surgery case', data.identification.ambulatoryCase === 'yes' ? 'Yes' : 'No')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Modified Aldrete parameters'),
			{
				table: {
					headerRows: 1,
					widths: ['*', '*', 'auto'],
					body: [
						[
							{ text: 'Parameter', bold: true, fontSize: 9 },
							{ text: 'Recorded', bold: true, fontSize: 9 },
							{ text: 'Score', bold: true, fontSize: 9 }
						],
						...aldreteRows.map(([key, label, score]) => [
							{ text: label, fontSize: 9 },
							{ text: aldreteValueLabel(key, sectionKeyed[key]), fontSize: 9 },
							{ text: String(score), fontSize: 9, bold: true }
						])
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			...(result.padssTotal !== null
				? [
						sectionHeader('PADSS (day-surgery discharge)'),
						{
							text: `PADSS ${result.padssTotal} of 10 — ${
								result.padssStreetFit ? 'street-fit for discharge home' : 'not yet street-fit'
							}`,
							fontSize: 10,
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

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

			...(data.note.recoveryNote
				? [
						sectionHeader('Recovery note'),
						{
							text: data.note.recoveryNote,
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
