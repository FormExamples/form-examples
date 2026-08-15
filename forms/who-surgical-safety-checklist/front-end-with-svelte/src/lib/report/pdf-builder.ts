import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import type { WhoSurgicalSafetyChecklist } from '#lib/checklist/types.js';
import type { ChecklistResult } from '#lib/stores/checklist.svelte.js';
import { statusLabel } from '#lib/checklist/labels.js';

/**
 * Build a pdfmake document definition for a WHO Surgical Safety Checklist. The
 * caller hands this to a `pdfmake` printer on the server.
 */
export function buildPdfDocument(
	data: WhoSurgicalSafetyChecklist,
	result: ChecklistResult
): TDocumentDefinitions {
	const { flags, status } = result;
	const rows = (title: string, lines: string[]) => [
		{ text: title, style: 'sectionHeader', margin: [0, 10, 0, 4] as [number, number, number, number] },
		...lines
			.filter((l) => l && l.length > 0)
			.map((l) => ({ text: l, margin: [0, 0, 0, 2] as [number, number, number, number] }))
	];

	const yesNo = (v: string) => (v === '' ? '—' : v);

	return {
		pageSize: 'A4',
		pageMargins: [40, 60, 40, 60],
		content: [
			{ text: 'WHO Surgical Safety Checklist', style: 'title' },
			{
				columns: [
					[
						{ text: `Status: ${statusLabel(status)}`, bold: true },
						`Procedure: ${data.plannedProcedure || '—'}`,
						`Specialty: ${data.surgicalSpecialty || '—'}`,
						`Urgency: ${data.urgency || '—'} · Laterality: ${data.laterality || '—'}`
					],
					[
						{ text: `Site: ${data.siteName || '—'}`, bold: true },
						`Operating room: ${data.operatingRoom || '—'}`,
						`Date: ${data.caseDate || '—'}`,
						`Wheels-in: ${data.caseStartAt || '—'}`,
						`Wheels-out: ${data.caseEndAt || '—'}`
					]
				],
				columnGap: 20,
				margin: [0, 0, 0, 12]
			},

			...rows('Phase 1 — Sign In (before induction)', [
				`1. Identity / site / procedure / consent confirmed: ${yesNo(data.signInIdentitySiteProcedureConsent)}`,
				`2. Site marked: ${yesNo(data.signInSiteMarked)}`,
				`3. Anaesthesia check complete: ${yesNo(data.signInAnaesthesiaCheckComplete)}`,
				`4. Pulse oximeter on patient: ${yesNo(data.signInPulseOximeterOnPatient)}`,
				`5. Known allergy: ${yesNo(data.signInKnownAllergy)}${data.signInKnownAllergyDetail ? ` — ${data.signInKnownAllergyDetail}` : ''}`,
				`6. Difficult airway / aspiration risk: ${yesNo(data.signInDifficultAirwayAspirationRisk)}`,
				`7. Blood-loss risk > 500 ml: ${yesNo(data.signInBloodLossRisk)}`,
				data.signInCompletedAt
					? `Signed by ${data.signInCoordinatorName} (${data.signInCoordinatorRole}) at ${data.signInCompletedAt}`
					: 'Sign In coordinator: not signed'
			]),

			...rows('Phase 2 — Time Out (before incision)', [
				`1. Team introductions confirmed: ${yesNo(data.timeOutTeamIntroductionsConfirmed)}`,
				`2. Patient / procedure / incision confirmed: ${yesNo(data.timeOutPatientProcedureIncisionConfirmed)}`,
				`3. Antibiotic prophylaxis < 60 min: ${yesNo(data.timeOutAntibioticProphylaxisWithin60Min)}`,
				`4. Surgeon critical steps: ${data.timeOutSurgeonCriticalSteps || '—'}`,
				`5. Anticipated duration: ${data.timeOutSurgeonCaseDurationMinutes ?? '—'} min`,
				`6. Anticipated blood loss: ${data.timeOutSurgeonAnticipatedBloodLossMl ?? '—'} ml`,
				`7. Anaesthetist concerns: ${data.timeOutAnaesthetistPatientConcerns || '—'}`,
				`8. Nursing sterility confirmed: ${yesNo(data.timeOutNursingSterilityConfirmed)}`,
				`9. Nursing equipment concerns: ${data.timeOutNursingEquipmentConcerns || '—'}`,
				`10. Essential imaging displayed: ${yesNo(data.timeOutEssentialImagingDisplayed)}`,
				data.timeOutCompletedAt
					? `Signed by ${data.timeOutCoordinatorName} (${data.timeOutCoordinatorRole}) at ${data.timeOutCompletedAt}`
					: 'Time Out coordinator: not signed'
			]),

			...rows('Phase 3 — Sign Out (before leaving OR)', [
				`1. Procedure name recorded: ${yesNo(data.signOutProcedureNameConfirmed)}`,
				`2. Counts confirmed: ${yesNo(data.signOutCountsConfirmed)}`,
				`3. Specimens labelled: ${yesNo(data.signOutSpecimensLabelled)}`,
				`4. Equipment problems: ${data.signOutEquipmentProblems || '—'}`,
				`5. Recovery concerns: ${data.signOutRecoveryConcerns || '—'}`,
				data.signOutCompletedAt
					? `Signed by ${data.signOutCoordinatorName} (${data.signOutCoordinatorRole}) at ${data.signOutCompletedAt}`
					: 'Sign Out coordinator: not signed'
			]),

			...rows(
				'Operating-team roster',
				data.teamMembers.length === 0
					? ['No team members recorded.']
					: data.teamMembers.map(
							(m) => `${m.name || '—'} (${m.role || '—'}) — introduced: ${m.introducedDuringTimeOut || '—'}`
						)
			),

			...rows(
				'Safety flags',
				flags.length === 0
					? ['None raised.']
					: flags.map((f) => `[${f.priority.toUpperCase()}] ${f.message}`)
			),

			data.abandonedReason
				? {
						text: `\nAbandoned: ${data.abandonedReason}`,
						color: '#b91c1c',
						margin: [0, 12, 0, 0] as [number, number, number, number]
					}
				: { text: '' }
		],
		styles: {
			title: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
			sectionHeader: { fontSize: 13, bold: true, color: '#1d4ed8' }
		},
		defaultStyle: { fontSize: 10 }
	};
}
