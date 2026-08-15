import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import {
	gradeLabel,
	outcomeLabel,
	linguisticBandLabel,
	communicationBandLabel
} from '#lib/engine/utils.js';

export function buildPdfDocument(
	data: AssessmentData,
	result: GradingResult
): TDocumentDefinitions {
	const c = data.candidateDetails;
	const lc = data.linguisticCriteria;
	const cc = data.clinicalCommunication;

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'OET SPEAKING ASSESSMENT REPORT (MEDICINE)',
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
			// Score & grade
			{
				text: `${result.score} / 500`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 2]
			},
			{
				text: gradeLabel(result.grade),
				fontSize: 13,
				bold: true,
				alignment: 'center',
				color: '#4b5563',
				margin: [0, 0, 0, 2]
			},
			{
				text: `Outcome: ${outcomeLabel(result.outcome)}  •  Linguistic ${result.linguisticTotal}/${result.linguisticMax}  •  Communication ${result.communicationTotal}/${result.communicationMax}`,
				fontSize: 10,
				alignment: 'center',
				color: '#4b5563',
				margin: [0, 0, 0, 20]
			},

			// Candidate details
			sectionHeader('Candidate Details'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[field('Name', `${c.firstName} ${c.lastName}`), field('Candidate no.', c.candidateNumber || 'N/A')],
						[field('Profession', c.profession || 'N/A'), field('First language', c.firstLanguage || 'N/A')],
						[field('Date of test', c.dateOfTest || 'N/A'), field('Assessor', c.assessorName || 'N/A')]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Linguistic criteria
			sectionHeader('Linguistic Criteria (0-6)'),
			{
				ul: [
					`Intelligibility: ${linguisticBandLabel(lc.intelligibility)}`,
					`Fluency: ${linguisticBandLabel(lc.fluency)}`,
					`Appropriateness of language: ${linguisticBandLabel(lc.appropriatenessOfLanguage)}`,
					`Resources of grammar & expression: ${linguisticBandLabel(lc.resourcesOfGrammarAndExpression)}`
				],
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Clinical communication
			sectionHeader('Clinical Communication (0-3)'),
			{
				ul: [
					`Relationship-building: ${communicationBandLabel(cc.relationshipBuilding)}`,
					`Understanding patient's perspective: ${communicationBandLabel(cc.understandingPatientPerspective)}`,
					`Providing structure: ${communicationBandLabel(cc.providingStructure)}`,
					`Information-gathering: ${communicationBandLabel(cc.informationGathering)}`,
					`Information-giving: ${communicationBandLabel(cc.informationGiving)}`
				],
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			// Flagged issues
			...(result.additionalFlags.length > 0
				? [
						sectionHeader('Flagged Issues for the Assessment Lead'),
						{
							ul: result.additionalFlags.map((f) => ({
								text: `[${f.priority.toUpperCase()}] ${f.category}: ${f.message}`,
								color: f.priority === 'high' ? '#dc2626' : f.priority === 'medium' ? '#d97706' : '#4b5563',
								margin: [0, 2, 0, 2] as [number, number, number, number]
							})),
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			// Criterion weaknesses
			...(result.firedRules.length > 0
				? [
						sectionHeader('Criterion Weaknesses'),
						{
							table: {
								headerRows: 1,
								widths: [60, 110, '*'],
								body: [
									[
										{ text: 'Rule ID', bold: true, fontSize: 9 },
										{ text: 'Criterion', bold: true, fontSize: 9 },
										{ text: 'Finding', bold: true, fontSize: 9 }
									],
									...result.firedRules.map((r) => [
										{ text: r.id, fontSize: 8, color: '#6b7280' },
										{ text: r.criterion, fontSize: 9 },
										{ text: r.description, fontSize: 9 }
									])
								]
							},
							layout: 'lightHorizontalLines',
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			// Examiner comments
			...(cc.examinerComments
				? [
						sectionHeader('Examiner Comments'),
						{ text: cc.examinerComments, fontSize: 10, margin: [0, 0, 0, 16] as [number, number, number, number] }
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
