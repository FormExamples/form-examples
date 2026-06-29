import type { EndoscopyRequest, Flag, FlagPriority } from './types';

const LOWER_GI_INDICATIONS = [
	'rectal-bleeding',
	'change-in-bowel-habit',
	'positive-fit',
	'ibd-surveillance',
	'polyp-surveillance'
];

const HIGH_RISK_PROCEDURES = ['ercp', 'eus'];

/** Optional engine context passed through from the grader. */
export interface FlagContext {
	twoWeekWaitEligible?: boolean;
	twoWeekWaitRationale?: string;
	riskBand?: string;
}

/**
 * Detect safety-critical flags for a GI endoscopy request, independent of the
 * four axes. Flag categories mirror the grade_flag CHECK constraint. Flag IDs
 * are stable and identical across every front-end and the back-end. Flags are
 * returned sorted high → medium → low priority.
 */
export function detectFlags(d: EndoscopyRequest, context?: FlagContext): Flag[] {
	const flags: Flag[] = [];
	const ctx = context ?? {};

	// --- Acute red flags -----------------------------------------------
	if (d.redFlags.redFlagGiBleeding === true) {
		flags.push({
			flagId: 'F-ACUTE-GI-BLEED-001',
			category: 'acute-gi-bleed',
			priority: 'high',
			description: 'Active gastrointestinal bleeding reported.',
			suggestedAction:
				'Assess haemodynamics and resuscitate; arrange urgent inpatient endoscopy (OGD within 24 hours for upper-GI bleeding).'
		});
	}

	// --- Suspected-cancer two-week-wait --------------------------------
	if (ctx.twoWeekWaitEligible === true) {
		flags.push({
			flagId: 'F-SUSPECTED-CANCER-2WW-001',
			category: 'suspected-cancer-2ww',
			priority: 'high',
			description:
				ctx.twoWeekWaitRationale && ctx.twoWeekWaitRationale.trim() !== ''
					? ctx.twoWeekWaitRationale.trim()
					: 'Suspected-cancer two-week-wait criteria met (NICE NG12 / DG56).',
			suggestedAction:
				'Book on the suspected-cancer two-week-wait pathway; perform the endoscopy within 14 days.'
		});
	}

	// --- High bleeding risk on anticoagulant / antiplatelet ------------
	const highProcedure = HIGH_RISK_PROCEDURES.includes(d.request.requestedProcedure);
	if (
		(d.medication.takingAnticoagulant === true && (highProcedure || ctx.riskBand === 'high')) ||
		(d.medication.takingAntiplatelet === true &&
			highProcedure &&
			d.medication.antiplateletAgent !== '' &&
			d.medication.antiplateletAgent !== 'none' &&
			d.medication.antiplateletAgent !== 'aspirin')
	) {
		flags.push({
			flagId: 'F-HIGH-BLEEDING-RISK-ANTICOAG-001',
			category: 'high-bleeding-risk-anticoag',
			priority: 'high',
			description: 'Anticoagulant / antiplatelet therapy with a high-bleeding-risk procedure.',
			suggestedAction:
				'Plan peri-procedure anticoagulation per BSG/ESGE; confirm thrombotic risk and bridging need before booking.'
		});
	}

	// --- ASA IV / V ----------------------------------------------------
	if (d.comorbidities.asaGrade === 'IV' || d.comorbidities.asaGrade === 'V') {
		flags.push({
			flagId: 'F-ASA-IV-001',
			category: 'asa-iv',
			priority: 'high',
			description: `ASA physical-status grade ${d.comorbidities.asaGrade}.`,
			suggestedAction:
				'Consultant anaesthetic / sedation review; consider procedure in a setting with full resuscitation support.'
		});
	}

	// --- Unfit for bowel prep (lower-GI procedures) --------------------
	const lowerGiProcedure = ['colonoscopy', 'flexible-sigmoidoscopy'].includes(
		d.request.requestedProcedure
	);
	if (lowerGiProcedure && d.infectionPrep.fitForBowelPrep === false) {
		flags.push({
			flagId: 'F-UNFIT-FOR-PREP-001',
			category: 'unfit-for-prep',
			priority: 'medium',
			description: 'Patient not assessed as fit for bowel preparation for a lower-GI procedure.',
			suggestedAction:
				'Review renal function, cardiac status, and frailty; consider modified prep or inpatient preparation.'
		});
	}

	// --- Infection precautions -----------------------------------------
	if (
		d.infectionPrep.vcjdRisk === true ||
		d.infectionPrep.cpeCarriage === true ||
		d.infectionPrep.mrsa === true ||
		d.infectionPrep.bloodBorneVirus === true
	) {
		const precautions: string[] = [];
		if (d.infectionPrep.vcjdRisk) precautions.push('vCJD');
		if (d.infectionPrep.cpeCarriage) precautions.push('CPE');
		if (d.infectionPrep.mrsa) precautions.push('MRSA');
		if (d.infectionPrep.bloodBorneVirus) precautions.push('blood-borne virus');
		flags.push({
			flagId: 'F-INFECTION-PRECAUTION-001',
			category: 'infection-precaution',
			priority: 'medium',
			description: `Infection-control flag(s): ${precautions.join(', ')}.`,
			suggestedAction:
				'Schedule at the end of the list; apply enhanced decontamination / single-use or quarantined instruments per local policy.'
		});
	}

	// --- Completeness / data-quality flags -----------------------------
	if (!d.request.primaryIndication) {
		flags.push({
			flagId: 'F-MISSING-INDICATION-001',
			category: 'missing-indication',
			priority: 'medium',
			description: 'No primary clinical indication recorded.',
			suggestedAction: 'Query the referrer for the clinical indication before vetting.'
		});
	}
	if (!d.request.clinicalQuestion || d.request.clinicalQuestion.trim() === '') {
		flags.push({
			flagId: 'F-MISSING-CLINICAL-QUESTION-001',
			category: 'missing-clinical-question',
			priority: 'medium',
			description: 'No specific clinical question recorded.',
			suggestedAction:
				'Query the referrer for the specific question the procedure should answer.'
		});
	}
	if (
		LOWER_GI_INDICATIONS.includes(d.request.primaryIndication) &&
		(d.redFlags.fitResultUgG === null || d.redFlags.fitResultUgG === undefined)
	) {
		flags.push({
			flagId: 'F-MISSING-FIT-001',
			category: 'missing-fit',
			priority: 'low',
			description: 'Lower-GI indication without a FIT result.',
			suggestedAction:
				'Request a FIT result (NICE DG56); FIT >= 10 ug/g triggers the colorectal-cancer pathway.'
		});
	}

	// Sort: high > medium > low
	const priorityOrder: Record<FlagPriority, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
