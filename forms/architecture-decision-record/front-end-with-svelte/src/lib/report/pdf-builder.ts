import type { TDocumentDefinitions, Content } from 'pdfmake/interfaces';
import type { AdrFormData } from '$lib/types';
import type { AdrEvaluation } from '$lib/engine/types';
import { statusLabel, groupLabel, pad4 } from '$lib/engine/utils';

function bullets(text: string): string[] {
	return String(text || '')
		.split('\n')
		.map((s) => s.trim())
		.filter(Boolean);
}

export function buildPdfDocument(data: AdrFormData, result: AdrEvaluation): TDocumentDefinitions {
	const a = data.adr;
	const heading = `${pad4(a.number)}${a.title ? ` — ${a.title}` : ''}`;

	const content: Content[] = [
		{ text: heading, fontSize: 22, bold: true, margin: [0, 0, 0, 4] },
		{
			text: `${statusLabel(a.status)}  ·  ${groupLabel(a.decisionGroup)}  ·  ${result.completeness}% complete`,
			fontSize: 11,
			color: '#4b5563',
			margin: [0, 0, 0, 16]
		},
		sectionHeader('Metadata'),
		{
			table: {
				widths: ['*', '*'],
				body: [
					[field('Author', data.author.name || 'N/A'), field('Date', a.decisionDate || 'N/A')],
					[field('Organization', data.organization.name || 'N/A'), field('Chosen position', result.chosenPosition || 'N/A')]
				]
			},
			layout: 'lightHorizontalLines',
			margin: [0, 0, 0, 16] as [number, number, number, number]
		}
	];

	if (result.flags.length > 0) {
		content.push(sectionHeader('Flags'));
		content.push({
			ul: result.flags.map((f) => ({
				text: `[${f.priority.toUpperCase()}] ${f.category}: ${f.message}`,
				color: f.priority === 'high' ? '#dc2626' : f.priority === 'medium' ? '#d97706' : '#4b5563',
				margin: [0, 2, 0, 2] as [number, number, number, number]
			})),
			margin: [0, 0, 0, 16] as [number, number, number, number]
		});
	}

	const textSection = (label: string, value: string) => {
		content.push(sectionHeader(label));
		content.push({ text: value.trim() || 'TBD', margin: [0, 0, 0, 12] as [number, number, number, number] });
	};
	const bulletSection = (label: string, value: string) => {
		content.push(sectionHeader(label));
		const items = bullets(value);
		content.push(
			items.length
				? { ul: items, margin: [0, 0, 0, 12] as [number, number, number, number] }
				: { text: 'None.', italics: true, margin: [0, 0, 0, 12] as [number, number, number, number] }
		);
	};

	textSection('Issue', a.issue);
	textSection('Decision', a.decision);
	textSection('Assumptions', a.assumptions);
	textSection('Constraints', a.constraints);

	content.push(sectionHeader('Positions'));
	if (data.positions.length === 0) {
		content.push({ text: 'None.', italics: true, margin: [0, 0, 0, 12] });
	} else {
		data.positions.forEach((p, i) => {
			content.push({
				text: `${i + 1}. ${p.name || '(unnamed)'}${p.isChosen ? '  ✓ chosen' : ''}`,
				bold: true,
				margin: [0, 4, 0, 2] as [number, number, number, number]
			});
			if (p.description) content.push({ text: p.description, margin: [0, 0, 0, 2] });
			if (p.pros) content.push({ text: `Pros: ${bullets(p.pros).join('; ')}`, fontSize: 9, color: '#059669' });
			if (p.cons) content.push({ text: `Cons: ${bullets(p.cons).join('; ')}`, fontSize: 9, color: '#dc2626' });
		});
	}

	textSection('Argument', a.argument);
	textSection('Implications', a.implications);
	bulletSection('Related decisions', a.relatedDecisions);
	bulletSection('Related requirements', a.relatedRequirements);
	bulletSection('Related artifacts', a.relatedArtifacts);
	bulletSection('Related principles', a.relatedPrinciples);

	if (a.signedOffBy) {
		content.push({
			text: `Signed off by ${a.signedOffBy}${a.signedOffAt ? ` on ${a.signedOffAt}` : ''}.`,
			margin: [0, 12, 0, 0],
			italics: true
		});
	}

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'ARCHITECTURE DECISION RECORD',
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
		content,
		defaultStyle: { fontSize: 10 }
	};
}

function sectionHeader(text: string): Content {
	return { text, fontSize: 14, bold: true, color: '#1f2937', margin: [0, 8, 0, 6] as [number, number, number, number] };
}

function field(label: string, value: string): Content {
	return {
		text: [
			{ text: `${label}: `, bold: true, color: '#6b7280' },
			{ text: value }
		],
		margin: [0, 4, 0, 4] as [number, number, number, number]
	};
}
