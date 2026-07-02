import type { AssessmentData, FlaggedIssue, ReviewStatus, SeizureControl } from './types';
import { present } from './utils';

/**
 * Detect the clinician-facing safety flags raised by the review findings.
 * Computed INDEPENDENTLY of the seizure-control class and completeness status
 * (which the grader produces), each flag carries a priority (spec §5).
 * Categories mirror the `epilepsy_review_grade_flag` SQL CHECK constraint:
 * specialist-review, valproate-ppp, status-epilepticus-history, driving-safety,
 * mental-health, sudep-not-documented, poor-adherence, asm-side-effects,
 * folic-acid-missing, incomplete, other.
 *
 *   - Specialist review (high)          — uncontrolled or increasing seizures
 *   - Valproate PPP (high)              — valproate in a woman of childbearing
 *                                         potential without a documented PPP
 *   - Status epilepticus (high)         — statusEpilepticus == 'yes'
 *   - Driving safety (high)             — driving while not DVLA-eligible
 *   - Mental health (high/medium)       — suicidality high; other concern medium
 *   - SUDEP not documented (medium)     — sudepDiscussed != 'yes'
 *   - Poor adherence (medium)           — asmAdherence == 'poor'
 *   - ASM side effects (medium)         — asmSideEffects == 'significant'
 *   - Folic acid missing (medium)       — woman of childbearing potential, no folic acid
 *   - Review incomplete / overdue (low) — reviewStatus != 'complete' or > 12 months
 */
export function detectFlaggedIssues(
	data: AssessmentData,
	grade?: { seizureControl?: SeizureControl; reviewStatus?: ReviewStatus }
): FlaggedIssue[] {
	const flags: FlaggedIssue[] = [];

	const s = data.seizures;
	const m = data.medication;
	const cb = data.childbearing;
	const woman = cb.womanOfChildbearingPotential === 'yes';
	const seizureControl = grade ? grade.seizureControl : undefined;
	const reviewStatus = grade ? grade.reviewStatus : undefined;

	// ─── Specialist review (HIGH) ──────────────────────────────
	if (seizureControl === 'uncontrolled' || s.seizureTrend === 'increasing') {
		flags.push({
			id: 'F-SPECIALIST-REVIEW-001',
			category: 'specialist-review',
			priority: 'high',
			description:
				s.seizureTrend === 'increasing'
					? 'Seizures are increasing versus the previous review'
					: 'Seizure control is uncontrolled (frequent seizures or status epilepticus)',
			suggestedAction:
				'Refer or escalate to neurology / epilepsy specialist review for medication optimisation.'
		});
	}

	// ─── Valproate PPP (HIGH) ──────────────────────────────────
	if (woman && cb.onValproate === 'yes' && cb.pregnancyPreventionProgramme !== 'in-place') {
		flags.push({
			id: 'F-VALPROATE-PPP-001',
			category: 'valproate-ppp',
			priority: 'high',
			description:
				'Sodium valproate in a woman of childbearing potential without a documented pregnancy-prevention programme',
			suggestedAction:
				'Arrange urgent review and put a valproate Pregnancy Prevention Programme (PPP) in place per MHRA guidance.'
		});
	}

	// ─── Status epilepticus (HIGH) ─────────────────────────────
	if (data.injuries.statusEpilepticus === 'yes') {
		flags.push({
			id: 'F-STATUS-EPILEPTICUS-001',
			category: 'status-epilepticus-history',
			priority: 'high',
			description: 'Status epilepticus episode recorded since the last review',
			suggestedAction:
				'Confirm an individualised emergency / rescue-medication plan and specialist review.'
		});
	}

	// ─── Driving safety (HIGH) ─────────────────────────────────
	if (data.safety.currentlyDriving === 'yes' && data.safety.dvlaEligible === 'not-eligible') {
		flags.push({
			id: 'F-DRIVING-SAFETY-001',
			category: 'driving-safety',
			priority: 'high',
			description: 'Patient is driving while not DVLA-eligible',
			suggestedAction:
				'Advise the patient not to drive and that they must notify the DVLA; document the advice.'
		});
	}

	// ─── Mental health (HIGH / MEDIUM) ─────────────────────────
	const mh = data.mentalHealth.mentalHealthConcern;
	if (mh === 'suicidality') {
		flags.push({
			id: 'F-MENTAL-HEALTH-001',
			category: 'mental-health',
			priority: 'high',
			description: 'Suicidality concern recorded',
			suggestedAction:
				'Undertake an urgent risk assessment and arrange same-day mental-health support.'
		});
	} else if (mh === 'depression' || mh === 'anxiety' || mh === 'low-mood') {
		flags.push({
			id: 'F-MENTAL-HEALTH-002',
			category: 'mental-health',
			priority: 'medium',
			description: `Mental-health concern recorded: ${mh.replace('-', ' ')}`,
			suggestedAction:
				'Assess mood, offer support, and consider onward referral for mental-health input.'
		});
	}

	// ─── SUDEP not documented (MEDIUM) ─────────────────────────
	if (data.sudep.sudepDiscussed !== 'yes') {
		flags.push({
			id: 'F-SUDEP-NOT-DOCUMENTED-001',
			category: 'sudep-not-documented',
			priority: 'medium',
			description: 'SUDEP (Sudden Unexpected Death in Epilepsy) risk discussion not documented',
			suggestedAction:
				'Discuss SUDEP and modifiable risk factors (nocturnal / uncontrolled seizures, adherence) and record it.'
		});
	}

	// ─── Poor adherence (MEDIUM) ───────────────────────────────
	if (m.asmAdherence === 'poor') {
		flags.push({
			id: 'F-POOR-ADHERENCE-001',
			category: 'poor-adherence',
			priority: 'medium',
			description: 'Poor self-reported anti-seizure medication adherence',
			suggestedAction:
				'Explore barriers to adherence; consider simplifying the regimen and adherence support.'
		});
	}

	// ─── Significant ASM side effects (MEDIUM) ─────────────────
	if (m.asmSideEffects === 'significant') {
		flags.push({
			id: 'F-ASM-SIDE-EFFECTS-001',
			category: 'asm-side-effects',
			priority: 'medium',
			description: 'Significant anti-seizure medication side effects reported',
			suggestedAction:
				'Review tolerability; consider dose adjustment or switching agents with specialist input.'
		});
	}

	// ─── Folic acid missing (MEDIUM) ───────────────────────────
	if (woman && cb.folicAcid === 'no') {
		flags.push({
			id: 'F-FOLIC-ACID-MISSING-001',
			category: 'folic-acid-missing',
			priority: 'medium',
			description: 'No folic acid recorded for a woman of childbearing potential',
			suggestedAction: 'Offer high-dose folic acid (5 mg) and discuss pre-conception planning.'
		});
	}

	// ─── Review incomplete / overdue (LOW) ─────────────────────
	const overdue =
		present(data.context.monthsSinceLastReview) && data.context.monthsSinceLastReview > 12;
	if ((reviewStatus && reviewStatus !== 'complete') || overdue) {
		flags.push({
			id: 'F-INCOMPLETE-001',
			category: 'incomplete',
			priority: 'low',
			description: overdue
				? 'Review is overdue (more than 12 months since the last review)'
				: 'Required review domains are not fully documented',
			suggestedAction:
				'Complete the outstanding review domains and set the next review interval.'
		});
	}

	// Sort: high > medium > low.
	const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
	flags.sort((x, y) => priorityOrder[x.priority] - priorityOrder[y.priority]);

	return flags;
}
