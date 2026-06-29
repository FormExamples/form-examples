import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradedDomainKey, GradingResult } from '$lib/engine/types';
import {
	categoryLabel,
	domainLabel,
	optionLabel,
	DOMAIN_LABELS,
	DEPARTMENT_OPTIONS,
	TENURE_OPTIONS,
	HOURS_OPTIONS,
	ROLE_LEVEL_OPTIONS,
	WORK_LOCATION_OPTIONS,
	RECOMMEND_OPTIONS
} from '$lib/engine/utils';

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	const domainKeys = Object.keys(DOMAIN_LABELS) as GradedDomainKey[];

	const demoBits = [
		optionLabel(DEPARTMENT_OPTIONS, data.demographics.department) &&
			`Department: ${optionLabel(DEPARTMENT_OPTIONS, data.demographics.department)}`,
		optionLabel(TENURE_OPTIONS, data.demographics.tenureBand) &&
			`Tenure: ${optionLabel(TENURE_OPTIONS, data.demographics.tenureBand)}`,
		optionLabel(HOURS_OPTIONS, data.demographics.hoursBand) &&
			`Hours: ${optionLabel(HOURS_OPTIONS, data.demographics.hoursBand)}`,
		optionLabel(ROLE_LEVEL_OPTIONS, data.demographics.roleLevel) &&
			`Role level: ${optionLabel(ROLE_LEVEL_OPTIONS, data.demographics.roleLevel)}`,
		optionLabel(WORK_LOCATION_OPTIONS, data.demographics.workLocation) &&
			`Location: ${optionLabel(WORK_LOCATION_OPTIONS, data.demographics.workLocation)}`
	].filter(Boolean) as string[];

	const recommendLabel = optionLabel(RECOMMEND_OPTIONS, data.overall.recommendAsPlaceToWork);

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'WORKPLACE CLIMATE ASSESSMENT REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
			color: '#6b7280',
			bold: true
		},
		footer: (currentPage: number, pageCount: number) => ({
			text: `Page ${currentPage} of ${pageCount} | Generated ${new Date(result.timestamp).toLocaleString()} | Anonymous response`,
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 8,
			color: '#9ca3af'
		}),
		content: [
			{
				text:
					result.compositeScore !== null
						? `Workplace Climate Index: ${result.compositeScore} / 100`
						: 'Workplace Climate Index: not scored',
				fontSize: 22,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `${categoryLabel(result.category)} climate`,
				fontSize: 13,
				alignment: 'center',
				color: '#4b5563',
				margin: [0, 0, 0, 4]
			},
			{
				text: `${result.answeredCount} of ${result.totalCount} graded items answered`,
				fontSize: 10,
				alignment: 'center',
				color: '#6b7280',
				margin: [0, 0, 0, 20]
			},

			// Recommendation
			sectionHeader('Recommendation'),
			{
				text: recommendLabel
					? `Would recommend as a place to work: ${recommendLabel}`
					: 'Recommendation question not answered.',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Flagged issues
			...(result.additionalFlags.length > 0
				? [
						sectionHeader('Flagged Issues for HR / Leadership'),
						{
							ul: result.additionalFlags.map((f) => ({
								text: `[${f.priority.toUpperCase()}] ${f.category}: ${f.message}`,
								color:
									f.priority === 'high'
										? '#dc2626'
										: f.priority === 'medium'
											? '#d97706'
											: '#4b5563',
								margin: [0, 2, 0, 2] as [number, number, number, number]
							})),
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			// Per-domain breakdown
			sectionHeader('Per-domain Breakdown'),
			{
				table: {
					headerRows: 1,
					widths: ['*', 70, 60, 60, 70],
					body: [
						[
							{ text: 'Domain', bold: true, fontSize: 9 },
							{ text: 'Score', bold: true, fontSize: 9 },
							{ text: 'Mean', bold: true, fontSize: 9 },
							{ text: 'Answered', bold: true, fontSize: 9 },
							{ text: 'Category', bold: true, fontSize: 9 }
						],
						...domainKeys.map((key) => {
							const r = result.domainScores[key];
							return [
								{ text: domainLabel(key), fontSize: 9 },
								{ text: r.score === null ? '—' : `${r.score.toFixed(1)}`, fontSize: 9 },
								{ text: r.mean === null ? '—' : r.mean.toFixed(2), fontSize: 9 },
								{ text: `${r.answeredCount}/${r.totalCount}`, fontSize: 9 },
								{ text: r.category ? categoryLabel(r.category) : '—', fontSize: 9 }
							];
						})
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Anonymous response context
			sectionHeader('Anonymous Response Context'),
			{
				text: demoBits.length > 0 ? demoBits.join(' · ') : 'No demographic banding entered.',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Free-text feedback
			...(data.overall.biggestStrength ||
			data.overall.biggestImprovement ||
			data.overall.otherComments
				? [
						sectionHeader('Free-text Feedback'),
						{
							ul: [
								data.overall.biggestStrength && `Biggest strength: ${data.overall.biggestStrength}`,
								data.overall.biggestImprovement &&
									`Biggest improvement: ${data.overall.biggestImprovement}`,
								data.overall.otherComments && `Other comments: ${data.overall.otherComments}`
							].filter(Boolean) as string[],
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: [])
		],
		defaultStyle: { fontSize: 10 }
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
