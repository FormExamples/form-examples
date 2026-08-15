import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { DexaRequest, GradingResult } from '#lib/engine/types.js';
import {
	appropriatenessLabel,
	radiationDoseLabel,
	triageTierLabel,
	recommendationLabel,
	scanRegionLabel,
	indicationLabel,
	clinicianRoleLabel,
	pregnancyStatusLabel,
	menopauseStatusLabel,
	previousDexaLabel,
	settingLabel,
	urgencyLabel
} from '#lib/engine/utils.js';

type Margin = [number, number, number, number];

/** Builds the pdfmake document definition for the DEXA bone-density vetting report. */
export function buildPdfDocument(
	data: DexaRequest,
	result: GradingResult
): TDocumentDefinitions {
	const triageColor =
		result.triageTier === 'routine'
			? '#16a34a'
			: result.triageTier === 'urgent'
				? '#d97706'
				: '#4b5563';

	const patientName =
		[data.patient.firstName, data.patient.lastName].filter(Boolean).join(' ') || 'N/A';

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'DEXA BONE-DENSITY REQUEST — VETTING REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.gradedAt).toLocaleString()} | NICE CG146 / NOGG / FRAX / ISCD`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text: 'DEXA BONE-DENSITY REQUEST',
				fontSize: 18,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4] as Margin
			},
			{
				text: `${scanRegionLabel(data.request.scanRegion)} — ${indicationLabel(data.request.primaryIndication)}`,
				fontSize: 12,
				alignment: 'center',
				color: '#4b5563',
				margin: [0, 0, 0, 4] as Margin
			},
			{
				text: `Triage: ${triageTierLabel(result.triageTier)} (${result.targetTimeframe})`,
				fontSize: 14,
				bold: true,
				alignment: 'center',
				color: triageColor,
				margin: [0, 0, 0, 16] as Margin
			},

			// Four-axis vetting grade
			sectionHeader('Vetting grade (four axes)'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('A. Appropriateness', `${appropriatenessLabel(result.appropriatenessBand)} (${result.appropriatenessScore}/9)`),
							field('B. Radiation dose', radiationDoseLabel(result.radiationDoseBand))
						],
						[
							field('C. Request completeness', `${result.completenessPercent}%`),
							field('D. Triage priority', triageTierLabel(result.triageTier))
						],
						[
							field('Target timeframe', result.targetTimeframe || 'N/A'),
							field('Recommendation', recommendationLabel(result.recommendation))
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 8] as Margin
			},
			...(result.safetyNote
				? [{ text: result.safetyNote, fontSize: 9, color: '#4b5563', margin: [0, 0, 0, 16] as Margin }]
				: []),

			// Patient and requester
			sectionHeader('Patient and requester'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Patient', patientName),
							field('NHS number', data.patient.nhsNumber || 'N/A')
						],
						[
							field('Date of birth', data.patient.dateOfBirth || 'N/A'),
							field('Pregnancy status', pregnancyStatusLabel(data.patient.pregnancyStatus))
						],
						[
							field('Requesting clinician', data.clinician.clinicianName || 'N/A'),
							field('Clinician role', clinicianRoleLabel(data.clinician.clinicianRole))
						],
						[
							field('Site', data.clinician.siteName || 'N/A'),
							field('Referral date', data.clinician.referralDate || 'N/A')
						],
						[
							field('Setting', settingLabel(data.triage.setting)),
							field('Requested urgency', urgencyLabel(data.triage.urgency))
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as Margin
			},

			// Indication and question
			sectionHeader('Indication and clinical question'),
			{ text: `Clinical question: ${data.request.clinicalQuestion || 'Not specified'}`, margin: [0, 0, 0, 4] as Margin },
			{ text: `Relevant history: ${data.request.relevantHistory || 'Not specified'}`, margin: [0, 0, 0, 16] as Margin },

			// Fracture-risk factors
			sectionHeader('Fracture-risk factors'),
			{ ul: riskFactorList(data), margin: [0, 0, 0, 8] as Margin },
			{
				text: `Previous DEXA: ${previousDexaLabel(data.previousDexa.previousDexa)}${data.previousDexa.previousDexaDate ? ` (${data.previousDexa.previousDexaDate})` : ''}`,
				margin: [0, 0, 0, 16] as Margin
			},

			// Flags
			...(result.flags.length > 0
				? [
						sectionHeader('Safety flags'),
						{
							ul: result.flags.map((f) => ({
								text: `[${f.priority.toUpperCase()}] ${f.category}: ${f.description} — ${f.suggestedAction}`,
								color:
									f.priority === 'high'
										? '#dc2626'
										: f.priority === 'medium'
											? '#d97706'
											: '#4b5563',
								margin: [0, 2, 0, 2] as Margin
							})),
							margin: [0, 0, 0, 16] as Margin
						}
					]
				: []),

			// Fired rules
			...(result.firedRules.length > 0
				? [
						sectionHeader('Fired rules (audit trail)'),
						{
							ul: result.firedRules.map((r) => ({
								text: `[${r.axis}] ${r.ruleId}: ${r.description}`,
								margin: [0, 2, 0, 2] as Margin
							})),
							margin: [0, 0, 0, 16] as Margin
						}
					]
				: []),

			// Notes
			...(data.triage.notes
				? [sectionHeader('Notes'), { text: data.triage.notes, margin: [0, 0, 0, 8] as Margin }]
				: [])
		],
		defaultStyle: {
			fontSize: 10
		}
	};
}

function riskFactorList(data: DexaRequest): string[] {
	const list: string[] = [];
	if (data.riskFactors.previousFragilityFracture) list.push('Previous fragility fracture');
	if (data.riskFactors.longTermSteroids) list.push('Long-term glucocorticoids');
	if (data.riskFactors.parentalHipFracture) list.push('Parental hip fracture');
	list.push(`Menopause status: ${menopauseStatusLabel(data.riskFactors.menopauseStatus)}`);
	if (data.riskFactors.fraxMajorFracturePercent !== null)
		list.push(`FRAX major-fracture probability: ${data.riskFactors.fraxMajorFracturePercent}%`);
	if (data.riskFactors.weightKg !== null) list.push(`Weight: ${data.riskFactors.weightKg} kg`);
	if (list.length === 0) list.push('No risk factors recorded');
	return list;
}

function sectionHeader(text: string) {
	return {
		text,
		fontSize: 14,
		bold: true,
		color: '#1f2937',
		margin: [0, 8, 0, 8] as Margin
	};
}

function field(label: string, value: string) {
	return {
		text: [
			{ text: `${label}: `, bold: true, color: '#6b7280' },
			{ text: value }
		],
		margin: [0, 4, 0, 4] as Margin
	};
}
