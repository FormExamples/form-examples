import type { TDocumentDefinitions, TableCell } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import {
	progressLabel,
	priorityLabel,
	clinicianRoleLabel,
	careSettingLabel,
	ageBandLabel,
	parityLabel,
	membranesLabel,
	liquorStateLabel
} from '#lib/engine/utils.js';

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	const fmtNum = (v: number | null) => (v === null ? '—' : String(v));
	const fmtHours = (v: number | null) => (v === null ? '—' : `${v.toFixed(1)} h`);
	const fmtCm = (v: number | null) => (v === null ? '—' : `${v.toFixed(1)} cm`);

	const obsBody: TableCell[][] = [
		[
			{ text: 'Time', bold: true, fontSize: 9 },
			{ text: 'Dil.', bold: true, fontSize: 9 },
			{ text: 'Desc.', bold: true, fontSize: 9 },
			{ text: 'Ctx/10', bold: true, fontSize: 9 },
			{ text: 'FHR', bold: true, fontSize: 9 },
			{ text: 'Liquor', bold: true, fontSize: 9 },
			{ text: 'BP', bold: true, fontSize: 9 }
		],
		...(data.observations.length === 0
			? [
					[
						{ text: 'No observations recorded', colSpan: 7, fontSize: 9, italics: true },
						{},
						{},
						{},
						{},
						{},
						{}
					]
				]
			: data.observations.map((o, i) => [
					{ text: o.observedAt || `Set ${i + 1}`, fontSize: 9 },
					{ text: o.cervicalDilatationCm === null ? '—' : `${o.cervicalDilatationCm}`, fontSize: 9 },
					{ text: o.descentFifths === null ? '—' : `${o.descentFifths}/5`, fontSize: 9 },
					{ text: fmtNum(o.contractionsPer10Min), fontSize: 9 },
					{ text: fmtNum(o.fetalHeartRate), fontSize: 9 },
					{ text: liquorStateLabel(o.liquorState) || '—', fontSize: 9 },
					{
						text: `${o.systolicBloodPressure ?? '—'}/${o.diastolicBloodPressure ?? '—'}`,
						fontSize: 9
					}
				]))
	];

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'PARTOGRAM — LABOUR-PROGRESS REPORT',
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
				text: `Progress: ${progressLabel(result.progressClassification)}`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text:
					result.latestDilatationCm === null
						? 'No cervical dilatation recorded — labour progress cannot be plotted'
						: `Latest dilatation ${result.latestDilatationCm} cm at ${fmtHours(result.elapsedHours)} of active labour`,
				fontSize: 12,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 20] as [number, number, number, number]
			},

			sectionHeader('Reference lines'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Elapsed time (t)', fmtHours(result.elapsedHours)),
							field('Latest dilatation', fmtCm(result.latestDilatationCm))
						],
						[
							field('Alert line expects', fmtCm(result.alertLineExpectedCm)),
							field('Action line expects', fmtCm(result.actionLineExpectedCm))
						],
						[
							field('Classification', progressLabel(result.progressClassification)),
							field('Lines crossed', result.firedLines.map((l) => l.id).join(', ') || 'None')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Labour context'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Patient ID', data.patient.patientIdentifier || 'N/A'),
							field('Recorded by', data.context.clinicianName || 'N/A')
						],
						[
							field('Role', clinicianRoleLabel(data.context.clinicianRole) || 'N/A'),
							field('Care setting', careSettingLabel(data.context.careSetting) || 'N/A')
						],
						[
							field('Age band', ageBandLabel(data.patient.ageBand) || 'N/A'),
							field('Parity', parityLabel(data.patient.parity) || 'N/A')
						],
						[
							field(
								'Gestation',
								data.patient.gestationWeeks === null ? 'N/A' : `${data.patient.gestationWeeks} weeks`
							),
							field('Membranes', membranesLabel(data.admission.membranesOnAdmission) || 'N/A')
						],
						[
							field('Active phase started', result.activePhaseStartAt || 'N/A'),
							field('Risk factors', data.admission.riskFactors || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader(`Observation series (${data.observations.length})`),
			{
				table: {
					headerRows: 1,
					widths: ['*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
					body: obsBody
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			...(result.flaggedIssues.length > 0
				? [
						sectionHeader(`Flagged issues (${result.flaggedIssues.length})`),
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
