import type { TDocumentDefinitions, TableCell } from 'pdfmake/interfaces';
import type { ChartData, Entry, GradingResult } from '#lib/engine/types.js';
import {
	fluidStatusLabel,
	priorityLabel,
	clinicianRoleLabel,
	categoryLabel,
	formatSignedMl
} from '#lib/engine/utils.js';

function entryBody(entries: Entry[], emptyText: string): TableCell[][] {
	return [
		[
			{ text: 'Time', bold: true, fontSize: 9 },
			{ text: 'Category', bold: true, fontSize: 9 },
			{ text: 'Description', bold: true, fontSize: 9 },
			{ text: 'Volume', bold: true, fontSize: 9 }
		],
		...(entries.length === 0
			? [[{ text: emptyText, colSpan: 4, fontSize: 9, italics: true }, {}, {}, {}]]
			: entries.map((e, i) => [
					{ text: e.entryAt || `Row ${i + 1}`, fontSize: 9 },
					{ text: categoryLabel(e.category) || '—', fontSize: 9 },
					{ text: e.description || '—', fontSize: 9 },
					{ text: e.volumeMl === null ? '—' : `${e.volumeMl} mL`, fontSize: 9 }
				]))
	];
}

export function buildPdfDocument(data: ChartData, result: GradingResult): TDocumentDefinitions {
	const rateText =
		result.urineOutputRateMlPerKgPerHour === null
			? 'Not computable (weight or hours missing)'
			: `${result.urineOutputRateMlPerKgPerHour.toFixed(2)} mL/kg/h`;

	const intakeBody = entryBody(data.intake, 'No intake entries recorded');
	const outputBody = entryBody(data.output, 'No output entries recorded');

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'FLUID BALANCE CHART — RECONCILIATION REPORT',
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
				text: `Fluid status: ${fluidStatusLabel(result.fluidStatus)}`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `Net balance ${formatSignedMl(result.netBalanceMl)} over ${result.hoursObserved} h`,
				fontSize: 12,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 20] as [number, number, number, number]
			},

			sectionHeader('Chart context'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Patient ID', data.context.patientIdentifier || 'N/A'),
							field('Ward / unit', data.context.wardOrUnit || 'N/A')
						],
						[
							field('Charting clinician', data.context.clinicianName || 'N/A'),
							field('Role', clinicianRoleLabel(data.context.clinicianRole) || 'N/A')
						],
						[
							field('Chart start', data.context.chartStartAt || 'N/A'),
							field(
								'Charting period',
								data.context.chartPeriodHours === null ? 'N/A' : `${data.context.chartPeriodHours} h`
							)
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Balance'),
			{
				table: {
					widths: ['*', 'auto'],
					body: [
						[field('Total intake', `${result.totalIntakeMl} mL`), field('Total output', `${result.totalOutputMl} mL`)],
						[field('Net balance', formatSignedMl(result.netBalanceMl)), field('Weight', result.weightKg === null ? 'N/A' : `${result.weightKg} kg`)],
						[field('Urine output', `${result.urineOutputMl} mL`), field('Urine output rate', rateText)]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader(`Intake entries (${data.intake.length})`),
			{
				table: { headerRows: 1, widths: ['auto', 'auto', '*', 'auto'], body: intakeBody },
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader(`Output entries (${data.output.length})`),
			{
				table: { headerRows: 1, widths: ['auto', 'auto', '*', 'auto'], body: outputBody },
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			...(result.flaggedIssues.length > 0
				? [
						sectionHeader(`Safety flags (${result.flaggedIssues.length})`),
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

			...(data.note.clinicalNote.trim() !== ''
				? [
						sectionHeader('Clinical note'),
						{
							text: data.note.clinicalNote,
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
