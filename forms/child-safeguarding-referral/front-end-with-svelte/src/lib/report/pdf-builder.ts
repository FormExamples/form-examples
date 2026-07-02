import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { AssessmentData, GradingResult } from '$lib/engine/types';
import {
	statusLabel,
	urgencyLabel,
	urgencyPathway,
	priorityLabel,
	primaryCategoryLabel,
	consentStatusLabel,
	sharingBasisLabel,
	childSexLabel,
	yesNoLabel,
	yesNoUnknownLabel
} from '$lib/engine/utils';

export function buildPdfDocument(data: AssessmentData, result: GradingResult): TDocumentDefinitions {
	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'CHILD SAFEGUARDING REFERRAL',
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
				text: `Urgency: ${urgencyLabel(result.urgency)}`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 4]
			},
			{
				text: `${statusLabel(result.status)} · ${result.completenessPercent}% complete · ${result.satisfiedCount} of ${result.mandatoryCount} mandatory requirements met`,
				fontSize: 12,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 8] as [number, number, number, number]
			},
			{
				text: urgencyPathway(result.urgency),
				fontSize: 10,
				italics: true,
				alignment: 'center' as const,
				color: '#4b5563',
				margin: [0, 0, 0, 20] as [number, number, number, number]
			},

			sectionHeader('Referrer'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Name', data.referrer.referrerName || 'N/A'),
							field('Role', data.referrer.referrerRole || 'N/A')
						],
						[
							field('Organisation', data.referrer.referrerOrganisation || 'N/A'),
							field('Relationship to child', data.referrer.relationshipToChild || 'N/A')
						],
						[
							field('Phone', data.referrer.referrerPhone || 'N/A'),
							field('Email', data.referrer.referrerEmail || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Child'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Name', data.child.childName || 'N/A'),
							field('Date of birth', data.child.childDateOfBirth || 'N/A')
						],
						[
							field('Age', data.child.childAge != null ? String(data.child.childAge) : 'N/A'),
							field('Sex', childSexLabel(data.child.childSex) || 'N/A')
						],
						[
							field('School / setting', data.child.childSetting || 'N/A'),
							field('Reference', data.child.childReference || 'N/A')
						],
						[field('Home address', data.child.childAddress || 'N/A'), field('', '')]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('The concern'),
			{
				text: data.concern.concernDescription || 'Not recorded',
				fontSize: 10,
				margin: [0, 0, 0, 4] as [number, number, number, number]
			},
			{
				text: [
					{ text: 'Child made a disclosure: ', bold: true, color: '#6b7280' },
					{ text: yesNoLabel(data.concern.childDisclosed) || 'Not recorded' }
				],
				fontSize: 10,
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Category and immediate risk'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Primary category', primaryCategoryLabel(data.category.primaryCategory)),
							field('Additional categories', data.category.additionalCategories || 'N/A')
						],
						[
							field('Immediate danger', yesNoLabel(data.risk.immediateDanger) || 'Not recorded'),
							field(
								'Alleged person in contact',
								yesNoUnknownLabel(data.risk.allegedPersonInContact) || 'Not recorded'
							)
						],
						[
							field(
								'Other children at risk',
								yesNoUnknownLabel(data.risk.otherChildrenAtRisk) || 'Not recorded'
							),
							field('Child’s whereabouts', data.risk.childWhereabouts || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Consent and information sharing'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Consent status', consentStatusLabel(data.consent.consentStatus)),
							field('Lawful basis to share', sharingBasisLabel(data.consent.sharingBasisWithoutConsent))
						],
						[
							field('Family aware', yesNoLabel(data.consent.familyAware) || 'Not recorded'),
							field('Unsafe-to-inform reason', data.consent.unsafeToInformReason || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Requested action'),
			{
				text: data.action.requestedAction || 'Not recorded',
				fontSize: 10,
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			...(result.flaggedIssues.length > 0
				? [
						sectionHeader('Safeguarding flags'),
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
				: []),

			...(data.action.notes
				? [
						sectionHeader('Notes'),
						{
							text: data.action.notes,
							fontSize: 10,
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
