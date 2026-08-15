import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { Certificate, ValidationReport } from '#lib/engine/types.js';
import { diseaseLabel, validityStatusLabel, overallValidityStatus, calculateAge } from '#lib/engine/utils.js';

export function buildPdfDocument(
	data: Certificate,
	result: ValidationReport
): TDocumentDefinitions {
	const age = calculateAge(data.patient.birthDate);
	const status = overallValidityStatus(result.overallValid);

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'INTERNATIONAL CERTIFICATE OF VACCINATION OR PROPHYLAXIS',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 9,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Validated ${new Date(result.validityComputedAt).toLocaleString()}`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: `Overall validity: ${validityStatusLabel(status)}`,
				fontSize: 22,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 16]
			},

			sectionHeader('Vaccinee'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Name', `${data.patient.givenNames} ${data.patient.surname}`),
							field('DOB', `${data.patient.birthDate}${age ? ` (Age ${age})` : ''}`)
						],
						[
							field('Sex', data.patient.sex || 'N/A'),
							field('Nationality', data.patient.nationalityAsIso31661Alpha3 || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Centre & clinician'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Centre', `${data.center.name} (${data.center.countryAsIso31661Alpha3})`),
							field('Clinician', data.clinician.name || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Vaccination entries'),
			{
				ul: data.entries.map((e) => {
					const validUntil =
						e.validityIsLifetime === 'yes' || !e.validityEndsOn ? 'lifetime' : e.validityEndsOn;
					return `${diseaseLabel(e.disease)} — ${e.vaccineOrProphylaxisName || '—'} | vaccinated ${e.vaccinationDate || '—'} | ${e.manufacturer || '—'} / batch ${e.batchNumber || '—'} | valid ${e.validityStartsOn || '—'} → ${validUntil}`;
				}),
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			...(result.firedRules.length > 0
				? [
						sectionHeader('Fired rules'),
						{
							ul: result.firedRules.map((r) => ({
								text: `[${r.severity.toUpperCase()}] ${r.code}: ${r.message}`,
								color: r.severity === 'error' ? '#dc2626' : r.severity === 'warning' ? '#d97706' : '#2563eb',
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
			{ text: `${label}: `, bold: true, color: '#6b7280' },
			{ text: value }
		],
		margin: [0, 4, 0, 4] as [number, number, number, number]
	};
}
