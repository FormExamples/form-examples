import type { TDocumentDefinitions, Content } from 'pdfmake/interfaces';
import type { AssessmentData, EuTraumaResult } from '$lib/engine/types';
import { calculateAge, priorityLabel, sectionLabel, triageLabel } from '$lib/engine/utils';

/**
 * Build the pdfmake document definition for a WHO Emergency Unit (Trauma)
 * report.
 *
 * This is a status / classification form, so the document leads with the triage
 * category and the completeness status rather than a numeric grade, followed by
 * the flagged issues, any outstanding fields, and the patient summary.
 */
export function buildPdfDocument(
	data: AssessmentData,
	result: EuTraumaResult
): TDocumentDefinitions {
	const p = data.patientRegistration;
	const age = calculateAge(p.dateOfBirth);
	const fullName = [p.surname, p.firstName].filter(Boolean).join(', ') || 'N/A';

	const statusHeadline =
		result.urgentCount > 0
			? 'URGENT ISSUES — ESCALATE IMMEDIATELY'
			: result.complete
				? result.flags.length > 0
					? 'COMPLETE — REVIEW FLAGGED ISSUES'
					: 'COMPLETE — NO ISSUES FLAGGED'
				: 'INCOMPLETE RECORD';

	const content: Content[] = [
		{
			text: statusHeadline,
			fontSize: 18,
			bold: true,
			alignment: 'center',
			margin: [0, 0, 0, 4]
		},
		{
			text: `Triage: ${triageLabel(result.triage)} · ${result.complete ? 'All required fields complete' : `${result.validation.missing.length} field(s) outstanding`} · ${result.flags.length} flag(s) · ${result.urgentCount} urgent`,
			fontSize: 11,
			alignment: 'center',
			color: '#4b5563',
			margin: [0, 0, 0, 16]
		},
		sectionHeader('Patient Details'),
		{
			table: {
				widths: ['*', '*'],
				body: [
					[
						field('Name', fullName),
						field('DOB', `${p.dateOfBirth || 'N/A'}${age ? ` (Age ${age})` : ''}`)
					],
					[
						field('Sex', p.sex || 'N/A'),
						field('Arrival', `${p.dateOfArrival || 'N/A'} ${p.timeOfArrival || ''}`.trim())
					],
					[
						field('Chief complaint', data.chiefComplaintAndVitals.chiefComplaint || 'N/A'),
						field('Provider', data.disposition.emergencyUnitProvider || 'N/A')
					]
				]
			},
			layout: 'lightHorizontalLines',
			margin: [0, 0, 0, 16]
		}
	];

	if (data.assessmentAndPlan.narrative) {
		content.push(sectionHeader('Assessment & Plan'));
		content.push({ text: data.assessmentAndPlan.narrative, fontSize: 10, margin: [0, 0, 0, 16] });
	}

	if (result.flags.length > 0) {
		content.push(sectionHeader('Flagged Issues'));
		content.push({
			table: {
				widths: ['auto', 'auto', '*'],
				body: [
					[headerCell('Priority'), headerCell('Category'), headerCell('Message')],
					...result.flags.map((f) => [
						{ text: priorityLabel(f.priority), fontSize: 9 },
						{ text: f.category, fontSize: 9 },
						{ text: f.message, fontSize: 9 }
					])
				]
			},
			layout: 'lightHorizontalLines',
			margin: [0, 0, 0, 16]
		});
	}

	if (result.validation.missing.length > 0) {
		content.push(sectionHeader('Outstanding Fields'));
		content.push({
			table: {
				widths: ['auto', '*'],
				body: [
					[headerCell('Section'), headerCell('Required field')],
					...result.validation.missing.map((m) => [
						{ text: sectionLabel(m.section), fontSize: 9 },
						{ text: m.description, fontSize: 9 }
					])
				]
			},
			layout: 'lightHorizontalLines',
			margin: [0, 0, 0, 16]
		});
	}

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'WHO EMERGENCY UNIT TRAUMA FORM',
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
		content
	};
}

function sectionHeader(text: string): Content {
	return {
		text,
		fontSize: 13,
		bold: true,
		color: '#1f2937',
		margin: [0, 8, 0, 6]
	};
}

function field(label: string, value: string): Content {
	return {
		stack: [
			{ text: label, fontSize: 8, color: '#6b7280' },
			{ text: value, fontSize: 10 }
		]
	};
}

function headerCell(text: string): Content {
	return { text, fontSize: 9, bold: true, color: '#374151' };
}
