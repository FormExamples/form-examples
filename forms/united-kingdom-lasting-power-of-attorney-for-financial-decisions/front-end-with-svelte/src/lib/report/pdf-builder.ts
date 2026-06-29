import type { TDocumentDefinitions, Content } from 'pdfmake/interfaces';
import type { Lpa, ValidationResult } from '$lib/types.js';
import {
	decisionModeLabel,
	whenAttorneysCanActLabel,
	bandLabel,
	compositeRiskLabel
} from '$lib/validator/labels.js';

function fullName(p: { title: string; firstNames: string; lastName: string }): string {
	return [p.title, p.firstNames, p.lastName].filter((s) => s && s.length > 0).join(' ').trim();
}

function sectionHeader(text: string): Content {
	return {
		text,
		fontSize: 13,
		bold: true,
		margin: [0, 12, 0, 6],
		color: '#111827'
	};
}

/** Build the pdfmake document definition for an LPA validation report. */
export function buildPdfDocument(data: Lpa, result: ValidationResult): TDocumentDefinitions {
	const donor = fullName(data.donor) || '(unnamed donor)';

	const content: Content[] = [
		{
			text: `Composite risk: ${compositeRiskLabel(result.compositeRisk)}`,
			fontSize: 22,
			bold: true,
			alignment: 'center',
			margin: [0, 0, 0, 4]
		},
		{
			text: `Validity: ${bandLabel(result.validityBand)}  ·  OPG status: ${bandLabel(data.status)}`,
			fontSize: 11,
			alignment: 'center',
			color: '#4b5563',
			margin: [0, 0, 0, 16]
		},

		sectionHeader('LPA summary'),
		{
			table: {
				widths: ['*', '*'],
				body: [
					[
						{ text: `Donor: ${donor}`, fontSize: 10 },
						{ text: `Donor DOB: ${data.donor.dateOfBirth || '—'}`, fontSize: 10 }
					],
					[
						{ text: `Decision mode: ${decisionModeLabel(data.decisionMode)}`, fontSize: 10 },
						{ text: `When can act: ${whenAttorneysCanActLabel(data.whenAttorneysCanAct)}`, fontSize: 10 }
					],
					[
						{ text: `Attorneys: ${data.attorneys.length}`, fontSize: 10 },
						{ text: `Replacement attorneys: ${data.replacementAttorneys.length}`, fontSize: 10 }
					],
					[
						{ text: `People to notify: ${data.peopleToNotify.length}`, fontSize: 10 },
						{ text: `OPG reference: ${data.opgReferenceNumber || '—'}`, fontSize: 10 }
					]
				]
			},
			layout: 'lightHorizontalLines',
			margin: [0, 0, 0, 12]
		}
	];

	if (result.firedRules.length > 0) {
		content.push(sectionHeader('Statutory blockers'));
		content.push({
			ul: result.firedRules.map((r) => ({
				text: `[${r.priority.toUpperCase()}] ${r.message} — ${r.remediation} (${r.ruleId}; ${r.citation})`,
				color: '#dc2626',
				margin: [0, 0, 0, 4] as [number, number, number, number]
			})),
			margin: [0, 0, 0, 12]
		});
	} else {
		content.push({
			text: 'No statutory blockers fired against this deed.',
			fontSize: 10,
			color: '#16a34a',
			margin: [0, 0, 0, 12]
		});
	}

	if (result.additionalFlags.length > 0) {
		content.push(sectionHeader('Additional flags'));
		content.push({
			ul: result.additionalFlags.map((f) => ({
				text: `[${f.priority.toUpperCase()}] ${f.message} — ${f.remediation}`,
				color: f.priority === 'high' ? '#d97706' : '#4b5563',
				margin: [0, 0, 0, 4] as [number, number, number, number]
			})),
			margin: [0, 0, 0, 12]
		});
	}

	if (data.attorneys.length > 0) {
		content.push(sectionHeader('Attorneys'));
		content.push({
			ul: data.attorneys.map((a) => ({
				text:
					fullName(a.person) +
					(a.person.isTrustCorporation ? ' (trust corporation)' : '') +
					(a.person.dateOfBirth ? ` — born ${a.person.dateOfBirth}` : ''),
				fontSize: 10,
				margin: [0, 0, 0, 2] as [number, number, number, number]
			})),
			margin: [0, 0, 0, 12]
		});
	}

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'LASTING POWER OF ATTORNEY (LP1F) — VALIDATION REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 9,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date().toLocaleString()}`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content
	};
}
