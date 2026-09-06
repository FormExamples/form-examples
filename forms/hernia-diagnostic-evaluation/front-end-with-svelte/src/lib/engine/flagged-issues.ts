// Safety-flag detection.
//
// Flags fire independently of the urgency band and are never suppressed by a
// clinician override of the urgency band — see doc/safety-case-notes.md
// hazard H-01. Flag IDs are stable and identical across every front-end and
// the back-end.

import type { RedFlagResult, ReducibilityResult } from './classification-rules';
import type { AdditionalFlag, FlagCategory, FlagPriority, HerniaDiagnosticEvaluation } from './types';

export interface FlagContext {
	reducibility: ReducibilityResult;
	redFlag: RedFlagResult;
	age: number | null;
}

/** Detect safety flags for a hernia diagnostic evaluation, most severe first. */
export function detectFlags(data: HerniaDiagnosticEvaluation, context: FlagContext): AdditionalFlag[] {
	const flags: AdditionalFlag[] = [];
	const push = (
		flagId: string,
		category: FlagCategory,
		priority: FlagPriority,
		description: string,
		suggestedAction: string
	) => flags.push({ flagId, category, priority, description, suggestedAction });

	const { reducibility, redFlag, age } = context;

	// --- Strangulation / incarceration ---------------------------------------
	if (reducibility.status === 'irreducible' || reducibility.status === 'incarcerated') {
		if (redFlag.anyRedFlag) {
			push(
				'F-STRANGULATION-SUSPECTED-001',
				'strangulation-suspected',
				'high',
				`The hernia is ${reducibility.status} with ${redFlag.positiveFlags.join(', ')}.`,
				'Refer for emergency surgical assessment today; keep the patient nil by mouth and start intravenous fluids pending review.'
			);
		} else {
			push(
				'F-INCARCERATION-RISK-001',
				'incarceration-risk',
				'high',
				`The hernia is ${reducibility.status} with no red-flag symptoms currently present.`,
				'Attempt gentle reduction only per local protocol, and arrange urgent surgical review the same day; safety-net the patient to return immediately if pain, vomiting, or fever develop.'
			);
		}
	}

	// --- Emergency referral ----------------------------------------------------
	if (redFlag.anyRedFlag) {
		push(
			'F-EMERGENCY-SURGICAL-REFERRAL-001',
			'emergency-surgical-referral',
			'high',
			`Red-flag symptom screen positive: ${redFlag.positiveFlags.join(', ')}.`,
			'Refer immediately for emergency surgical assessment; do not delay for outpatient imaging.'
		);
	}

	// --- Atypical presentation / occult hernia ----------------------------------
	// An irreducible or incarcerated hernia legitimately has no elicitable
	// cough impulse (it does not currently reduce), even when the mass is
	// definitively palpable and the diagnosis is already confirmed — that is
	// not an inconclusive exam, so it must not be treated as one here.
	const examInconclusive =
		data.reducibility.reducibilityStatus !== 'irreducible' &&
		data.reducibility.reducibilityStatus !== 'incarcerated' &&
		(data.palpation.palpableMass !== 'yes' || data.palpation.coughImpulsePositive !== 'yes');
	const imagingRequested =
		data.imaging.ultrasoundPerformed === 'yes' ||
		data.imaging.ctPerformed === 'yes' ||
		data.imaging.mriPerformed === 'yes';
	const imagingInconclusive =
		(data.imaging.ultrasoundPerformed === 'yes' && data.imaging.ultrasoundFindings === 'inconclusive') ||
		(data.imaging.ctPerformed === 'yes' && data.imaging.ctFindings === 'inconclusive') ||
		(data.imaging.mriPerformed === 'yes' && data.imaging.mriFindings === 'inconclusive');

	if (imagingRequested && imagingInconclusive) {
		push(
			'F-ATYPICAL-PRESENTATION-001',
			'atypical-presentation',
			'medium',
			'Imaging remains inconclusive after an atypical or inconclusive examination.',
			'Consider a second imaging modality or a specialist surgical opinion; reassess if symptoms change.'
		);
	} else if (
		!imagingRequested &&
		examInconclusive &&
		(data.history.painScore0To10 !== null || data.inspection.bulgeVisibleAtRest === 'yes')
	) {
		push(
			'F-OCCULT-HERNIA-SUSPECTED-001',
			'occult-hernia-suspected',
			'medium',
			'Clinical suspicion of a hernia with a negative or inconclusive examination, and imaging not yet performed.',
			'Arrange dynamic ultrasound (or MRI/CT if ultrasound is unavailable or inconclusive) to confirm an occult hernia before discharge.'
		);
	}

	// --- Recurrence -------------------------------------------------------------
	if (data.history.priorHerniaRepair === 'yes' && data.history.priorHerniaRepairSite.trim() !== '') {
		push(
			'F-RECURRENT-HERNIA-001',
			'recurrent-hernia',
			'medium',
			`A prior hernia repair is recorded at ${data.history.priorHerniaRepairSite}.`,
			'Note the recurrence and the mesh status in the referral; recurrent repairs are technically more complex and may need a specialist hernia service.'
		);
	}

	// --- Life stage ---------------------------------------------------------------
	if (age !== null && age < 16) {
		push(
			'F-PAEDIATRIC-001',
			'paediatric',
			'high',
			`The patient is ${age} years old.`,
			'Refer to a paediatric surgical service; examination technique and the threshold for repair differ from adult practice.'
		);
	}
	if (data.riskFactors.riskPregnancy === 'yes') {
		push(
			'F-PREGNANCY-001',
			'pregnancy',
			'medium',
			'The patient is pregnant.',
			'Favour conservative management where safe, and involve obstetric and surgical teams jointly when repair or emergency assessment is needed.'
		);
	}

	const priorityOrder: Record<FlagPriority, number> = { high: 0, medium: 1, low: 2 };
	return flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}
