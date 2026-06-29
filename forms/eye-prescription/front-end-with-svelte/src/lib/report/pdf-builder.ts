import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { EyePrescription, ClassificationResult } from '$lib/engine/types';
import { complexityLabel, classLabel, lensTypeLabel, fmtDioptres, ageInYears } from '$lib/engine/utils';

export function buildPdfDocument(
	data: EyePrescription,
	result: ClassificationResult
): TDocumentDefinitions {
	const effective = (data.grade.overrideComplexity || result.complexity) as
		| 'simple'
		| 'moderate'
		| 'complex';
	const age = ageInYears(data.patient.birthDate, data.examination.issueDate);

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		header: {
			text: 'EYE PRESCRIPTION REPORT',
			alignment: 'center',
			margin: [0, 20, 0, 0],
			fontSize: 10,
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
		content: [
			{
				text: `${complexityLabel(effective)} prescription`,
				fontSize: 24,
				bold: true,
				alignment: 'center',
				margin: [0, 0, 0, 16]
			},

			sectionHeader('Patient & Prescriber'),
			{
				table: {
					widths: ['*', '*'],
					body: [
						[
							field('Patient', data.patient.name || 'N/A'),
							field('DOB', `${data.patient.birthDate || 'N/A'}${age !== null ? ` (Age ${age})` : ''}`)
						],
						[
							field('Prescriber', data.prescriber.name || 'N/A'),
							field('GOC', data.prescriber.gocRegistrationNumber || 'N/A')
						],
						[
							field('Issued', data.examination.issueDate || 'N/A'),
							field('Expires', data.examination.expiryDate || 'N/A')
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			sectionHeader('Refraction'),
			{
				table: {
					headerRows: 1,
					widths: ['*', '*', '*', '*', '*', '*'],
					body: [
						[
							{ text: 'Eye', bold: true, fontSize: 9 },
							{ text: 'Sphere', bold: true, fontSize: 9 },
							{ text: 'Cylinder', bold: true, fontSize: 9 },
							{ text: 'Axis', bold: true, fontSize: 9 },
							{ text: 'Add', bold: true, fontSize: 9 },
							{ text: 'Prism', bold: true, fontSize: 9 }
						],
						[
							{ text: 'Right (OD)', fontSize: 9 },
							{ text: fmtDioptres(data.rightEye.sphereDiopters), fontSize: 9 },
							{ text: fmtDioptres(data.rightEye.cylinderDiopters), fontSize: 9 },
							{ text: `${data.rightEye.axisDegrees ?? '—'}`, fontSize: 9 },
							{ text: fmtDioptres(data.rightEye.additionDiopters), fontSize: 9 },
							{ text: result.prismPresent ? 'Yes' : '—', fontSize: 9 }
						],
						[
							{ text: 'Left (OS)', fontSize: 9 },
							{ text: fmtDioptres(data.leftEye.sphereDiopters), fontSize: 9 },
							{ text: fmtDioptres(data.leftEye.cylinderDiopters), fontSize: 9 },
							{ text: `${data.leftEye.axisDegrees ?? '—'}`, fontSize: 9 },
							{ text: fmtDioptres(data.leftEye.additionDiopters), fontSize: 9 },
							{ text: result.prismPresent ? 'Yes' : '—', fontSize: 9 }
						]
					]
				},
				layout: 'lightHorizontalLines',
				margin: [0, 0, 0, 8] as [number, number, number, number]
			},
			{
				text: `Right: ${classLabel(result.rightEyeSphereClass)} / ${classLabel(result.rightEyeCylinderClass)}  ·  Left: ${classLabel(result.leftEyeSphereClass)} / ${classLabel(result.leftEyeCylinderClass)}  ·  Presbyopia: ${classLabel(result.presbyopiaClass)}  ·  Lens: ${lensTypeLabel(data.lensRecommendation.lensType)}`,
				fontSize: 9,
				color: '#4b5563',
				margin: [0, 0, 0, 16] as [number, number, number, number]
			},

			...(result.additionalFlags.length > 0
				? [
						sectionHeader('Safety Flags for the Prescriber'),
						{
							ul: result.additionalFlags.map((f) => ({
								text: `[${f.priority.toUpperCase()}] ${f.category} (${f.eye}): ${f.description} — ${f.suggestedAction}`,
								color:
									f.priority === 'high' ? '#dc2626' : f.priority === 'medium' ? '#d97706' : '#4b5563',
								margin: [0, 2, 0, 2] as [number, number, number, number]
							})),
							margin: [0, 0, 0, 16] as [number, number, number, number]
						}
					]
				: []),

			...(result.firedRules.length > 0
				? [
						sectionHeader('Classification Justification'),
						{
							table: {
								headerRows: 1,
								widths: [80, 80, '*'],
								body: [
									[
										{ text: 'Rule', bold: true, fontSize: 9 },
										{ text: 'Instrument', bold: true, fontSize: 9 },
										{ text: 'Finding', bold: true, fontSize: 9 }
									],
									...result.firedRules.map((r) => [
										{ text: r.ruleId, fontSize: 8, color: '#6b7280' },
										{ text: r.instrument, fontSize: 9 },
										{ text: r.description, fontSize: 9 }
									])
								]
							},
							layout: 'lightHorizontalLines',
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
