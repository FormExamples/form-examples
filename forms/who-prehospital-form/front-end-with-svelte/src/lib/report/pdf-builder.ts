import type { TDocumentDefinitions, Content } from 'pdfmake/interfaces';
import type { AssessmentData, PrehospitalResult } from '$lib/engine/types';
import { gcsTotal, priorityLabel, sectionLabel } from '$lib/engine/utils';

const triageLabel = (v: string): string =>
	v === 'red'
		? 'RED — Immediate'
		: v === 'yellow'
			? 'YELLOW — Urgent'
			: v === 'green'
				? 'GREEN — Non-urgent'
				: 'N/A';

/**
 * Build the pdfmake document definition for a WHO Prehospital Form report.
 *
 * This is a status / classification form (the run sheet carries a triage
 * category), so the document leads with the completeness status and flag
 * summary rather than a numeric grade, followed by the flagged issues, any
 * outstanding fields, and the patient summary.
 */
export function buildPdfDocument(
	data: AssessmentData,
	result: PrehospitalResult
): TDocumentDefinitions {
	const c = data.callerAndScene;
	const gcs = gcsTotal(data);

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
			text: `Triage: ${triageLabel(result.triageCategory)} · ${result.complete ? 'All required fields complete' : `${result.validation.missing.length} field(s) outstanding`} · ${result.flags.length} flag(s) · ${result.urgentCount} urgent`,
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
					[field('Name', c.patientName || 'N/A'), field('DOB / age', c.dateOfBirthOrAge || 'N/A')],
					[field('Sex', c.sex || 'N/A'), field('Triage', triageLabel(data.triage.category))],
					[
						field('GCS', gcs === null ? 'N/A' : String(gcs)),
						field('AVPU', data.disability.avpu || 'N/A')
					],
					[
						field('Pregnant', data.chiefComplaintAndVitals.pregnant || 'N/A'),
						field('Recorded by', data.disposition.providerName || 'N/A')
					]
				]
			},
			layout: 'lightHorizontalLines',
			margin: [0, 0, 0, 16]
		}
	];

	if (data.chiefComplaintAndVitals.chiefComplaint) {
		content.push(sectionHeader('Chief Complaint'));
		content.push({
			text: data.chiefComplaintAndVitals.chiefComplaint,
			fontSize: 10,
			margin: [0, 0, 0, 16]
		});
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

	if (data.assessmentAndPlan.summary || data.assessmentAndPlan.presumptiveDiagnoses) {
		content.push(sectionHeader('Assessment & Plan'));
		if (data.assessmentAndPlan.summary) {
			content.push({ text: data.assessmentAndPlan.summary, fontSize: 10, margin: [0, 0, 0, 4] });
		}
		if (data.assessmentAndPlan.presumptiveDiagnoses) {
			content.push({
				text: `Presumptive: ${data.assessmentAndPlan.presumptiveDiagnoses}`,
				fontSize: 10,
				margin: [0, 0, 0, 16]
			});
		}
	}

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'WHO PREHOSPITAL FORM',
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
