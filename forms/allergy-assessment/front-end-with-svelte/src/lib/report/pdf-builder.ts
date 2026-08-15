import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import { severityLabel, countAllergens, bmiCategory, calculateAge } from '#lib/engine/utils.js';

/** Build the pdfmake document definition for an allergy assessment report. */
export function buildPdfDocument(data: AssessmentData, result: GradingResult) {
	const age = calculateAge(data.demographics.dateOfBirth);
	const d = data.demographics;

	const content: unknown[] = [
		{ text: 'Allergy Assessment Report', style: 'title' },
		{
			text: `Overall severity: ${severityLabel(result.severityLevel)}  ·  Allergy burden score: ${result.allergyBurdenScore}`,
			style: 'subtitle'
		},
		{ text: `Allergens recorded: ${countAllergens(data)}`, margin: [0, 0, 0, 8] },
		{ text: 'Patient', style: 'h2' },
		{
			columns: [
				field('Name', `${d.firstName} ${d.lastName}`.trim() || 'N/A'),
				field('DOB', `${d.dateOfBirth || 'N/A'}${age ? ` (Age ${age})` : ''}`)
			]
		},
		{
			columns: [
				field('Sex', d.sex || 'N/A'),
				field('BMI', d.bmi ? `${d.bmi} (${bmiCategory(d.bmi)})` : 'N/A')
			]
		}
	];

	if (result.additionalFlags.length > 0) {
		content.push(
			{ text: 'Flagged issues', style: 'h2' },
			{ ul: result.additionalFlags.map((f) => `${f.category}: ${f.message}`) }
		);
	}

	if (result.firedRules.length > 0) {
		content.push(
			{ text: 'Severity rule justification', style: 'h2' },
			{
				table: {
					headerRows: 1,
					widths: ['auto', 'auto', '*'],
					body: [
						['Rule', 'Severity', 'Finding'],
						...result.firedRules.map((r) => [r.id, severityLabel(r.severityLevel), r.description])
					]
				}
			}
		);
	}

	return {
		content,
		styles: {
			title: { fontSize: 18, bold: true, margin: [0, 0, 0, 4] },
			subtitle: { fontSize: 12, margin: [0, 0, 0, 8] },
			h2: { fontSize: 13, bold: true, margin: [0, 10, 0, 4] }
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.timestamp).toLocaleString()}`,
			alignment: 'center',
			fontSize: 8,
			margin: [0, 8, 0, 0]
		}),
		defaultStyle: { fontSize: 10 }
	};
}

/** A small label/value cell for the patient columns. */
function field(label: string, value: string) {
	return { text: [{ text: `${label}: `, bold: true }, value], margin: [0, 1, 0, 1] };
}
