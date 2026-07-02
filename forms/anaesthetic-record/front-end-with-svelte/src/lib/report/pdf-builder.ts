import type { TDocumentDefinitions, TableCell } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '$lib/engine/types';
import {
	statusLabel,
	priorityLabel,
	urgencyLabel,
	sexLabel,
	asaLabel,
	anaestheticTechniqueLabel,
	airwayTechniqueLabel,
	recoveryDestinationLabel,
	doseUnitLabel,
	routeLabel,
	drugCategoryLabel,
	eventTypeLabel,
	monitoringModalityLabel
} from '$lib/engine/utils';

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	const satisfied = result.firedRules.filter((r) => r.satisfied).length;
	const total = result.firedRules.length;
	const missing = result.firedRules.filter((r) => !r.satisfied);

	const monitoringText =
		data.monitoring.monitoringModalities.length === 0
			? 'None recorded'
			: data.monitoring.monitoringModalities.map(monitoringModalityLabel).join(', ');

	const drugBody: TableCell[][] = [
		[
			{ text: 'Drug', bold: true, fontSize: 9 },
			{ text: 'Category', bold: true, fontSize: 9 },
			{ text: 'Dose', bold: true, fontSize: 9 },
			{ text: 'Route', bold: true, fontSize: 9 }
		],
		...(data.drugs.length === 0
			? [[{ text: 'No drugs recorded', colSpan: 4, fontSize: 9, italics: true }, {}, {}, {}]]
			: data.drugs.map((d, i) => [
					{ text: d.drugName || `Drug ${i + 1}`, fontSize: 9 },
					{ text: drugCategoryLabel(d.category) || '—', fontSize: 9 },
					{
						text: d.dose === null ? '—' : `${d.dose} ${doseUnitLabel(d.doseUnit)}`.trim(),
						fontSize: 9
					},
					{ text: routeLabel(d.route) || '—', fontSize: 9 }
				]))
	];

	const obsBody: TableCell[][] = [
		[
			{ text: 'Time', bold: true, fontSize: 9 },
			{ text: 'BP', bold: true, fontSize: 9 },
			{ text: 'HR', bold: true, fontSize: 9 },
			{ text: 'SpO2', bold: true, fontSize: 9 }
		],
		...(data.observations.length === 0
			? [[{ text: 'No observations recorded', colSpan: 4, fontSize: 9, italics: true }, {}, {}, {}]]
			: data.observations.map((o, i) => [
					{ text: o.observedAt || `Set ${i + 1}`, fontSize: 9 },
					{
						text: `${o.systolicBloodPressure ?? '—'}/${o.diastolicBloodPressure ?? '—'}`,
						fontSize: 9
					},
					{ text: o.heartRate === null ? '—' : String(o.heartRate), fontSize: 9 },
					{ text: o.spo2 === null ? '—' : String(o.spo2), fontSize: 9 }
				]))
	];

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'ANAESTHETIC RECORD — COMPLETENESS REPORT',
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
				text: `Completeness: ${statusLabel(result.status)}`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `${result.completenessPercent}% complete — ${satisfied} of ${total} mandatory items`,
				fontSize: 12,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 20] as [number, number, number, number]
			},

			sectionHeader('Case identification'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Patient ID', data.identification.patientIdentifier || 'N/A'),
							field('Patient', data.identification.patientName || 'N/A')
						],
						[
							field('Sex', sexLabel(data.identification.sex) || 'N/A'),
							field('Theatre', data.identification.theatre || 'N/A')
						],
						[
							field('Anaesthetist', data.identification.anaesthetistName || 'N/A'),
							field('Surgeon', data.identification.surgeonName || 'N/A')
						],
						[
							field('Procedure', data.identification.plannedProcedure || 'N/A'),
							field('Urgency', urgencyLabel(data.identification.urgency) || 'N/A')
						],
						[
							field('Technique', anaestheticTechniqueLabel(data.identification.anaestheticTechnique) || 'N/A'),
							field('ASA', asaLabel(data.asaAirway.asaStatus) || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Mandatory items'),
			{
				table: {
					widths: ['*', 'auto'],
					body: [
						[field('Completeness', `${result.completenessPercent}%`), field('Status', statusLabel(result.status))],
						[
							field('Critical items missing', String(result.criticalMissing)),
							field('Non-critical items missing', String(result.noncriticalMissing))
						],
						[field('Airway', airwayTechniqueLabel(data.airway.airwayTechnique) || 'N/A'), field('Monitoring', monitoringText)],
						[
							field('Recovery destination', recoveryDestinationLabel(data.handover.recoveryDestination) || 'N/A'),
							field('Signature', data.signoff.anaesthetistSignature || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			...(missing.length > 0
				? [
						sectionHeader(`Missing items (${missing.length})`),
						{
							ul: missing.map((r) => ({
								text: `[${r.category === 'critical' ? 'CRITICAL' : 'NON-CRITICAL'}] ${r.label}`,
								color: r.category === 'critical' ? '#dc2626' : '#4b5563',
								margin: [0, 2, 0, 2] as [number, number, number, number]
							})),
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			sectionHeader(`Drugs (${data.drugs.length})`),
			{
				table: { headerRows: 1, widths: ['*', 'auto', 'auto', 'auto'], body: drugBody },
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader(`Timed observations (${data.observations.length})`),
			{
				table: { headerRows: 1, widths: ['*', 'auto', 'auto', 'auto'], body: obsBody },
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			...(data.events.length > 0
				? [
						sectionHeader(`Events & complications (${data.events.length})`),
						{
							ul: data.events.map((e, i) => ({
								text: `${eventTypeLabel(e.eventType) || `Event ${i + 1}`}: ${e.management || '—'}`,
								margin: [0, 2, 0, 2] as [number, number, number, number]
							})),
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

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
