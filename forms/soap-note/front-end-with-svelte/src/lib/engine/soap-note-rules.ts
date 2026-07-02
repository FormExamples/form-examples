// Declarative SOAP-note completeness rules.
//
// The SOAP note is a documentation-and-completeness instrument, not a numeric
// score. "Present" means the corresponding field (or any field in an
// at-least-one group) is a non-empty string. This module exposes:
//
//   sectionPresence(data)     -> the four section-presence booleans
//   requiredComponents(data)  -> the required-component tally for THIS encounter,
//                                each { id, section, category, label, present },
//                                including any conditionally-required components
//                                (safety-netting when red-flag symptoms are
//                                recorded or the patient is managed at home;
//                                follow-up whenever a plan is recorded).
//
// The grader (`soap-note-grader.ts`) reads these to derive the completeness
// percentage and the complete / partial / incomplete status, and to build the
// fired-rule audit trail that mirrors `soap_note_grade_rule`.

import type { AssessmentData, RequiredComponent, SectionPresence } from './types';

/** A single field is present when it is a non-blank string. */
export function has(v: unknown): boolean {
	return v !== null && v !== undefined && String(v).trim() !== '';
}

/**
 * Per-SOAP-section presence (spec §4). Subjective needs both the presenting
 * complaint and its history; Objective, Assessment, and Plan are each satisfied
 * by any one field in their at-least-one group.
 */
export function sectionPresence(data: AssessmentData): SectionPresence {
	const s = data.subjective;
	const o = data.objective;
	const a = data.assessment;
	const p = data.plan;

	const subjectivePresent = has(s.presentingComplaint) && has(s.historyOfPresentingComplaint);
	const objectivePresent =
		has(o.examinationFindings) || has(o.vitalSigns) || has(o.investigationResults);
	const assessmentPresent = has(a.primaryDiagnosis) || has(a.problemList) || has(a.differential);
	const planPresent =
		has(p.investigationsPlan) || has(p.treatmentPlan) || has(p.referrals) || has(p.followUp);

	return { subjectivePresent, objectivePresent, assessmentPresent, planPresent };
}

/**
 * Whether safety-netting is a required component for THIS encounter: red-flag
 * symptoms recorded, or the patient is managed at home / discharged (spec §4).
 */
export function safetyNettingRequired(data: AssessmentData): boolean {
	return data.subjective.redFlagSymptoms === 'yes' || data.plan.managedAtHome === 'yes';
}

/**
 * The required-component tally for the completeness percentage (spec §4).
 * Subjective contributes two components (presenting complaint + its history);
 * Objective, Assessment, and Plan each contribute one. Safety-netting and
 * follow-up are appended when conditionally required for this encounter.
 */
export function requiredComponents(data: AssessmentData): RequiredComponent[] {
	const s = data.subjective;
	const p = data.plan;
	const presence = sectionPresence(data);

	const components: RequiredComponent[] = [
		{
			id: 'R-SUBJECTIVE-COMPLAINT-01',
			section: 'subjective',
			category: 'required-component',
			label: 'Presenting complaint',
			description: 'Subjective: presenting complaint recorded',
			present: has(s.presentingComplaint)
		},
		{
			id: 'R-SUBJECTIVE-HISTORY-01',
			section: 'subjective',
			category: 'required-component',
			label: 'History of presenting complaint',
			description: 'Subjective: history of the presenting complaint recorded',
			present: has(s.historyOfPresentingComplaint)
		},
		{
			id: 'R-OBJECTIVE-PRESENT-01',
			section: 'objective',
			category: 'required-component',
			label: 'Objective findings',
			description:
				'Objective: examination findings, vital signs, or investigation results recorded',
			present: presence.objectivePresent
		},
		{
			id: 'R-ASSESSMENT-PRESENT-01',
			section: 'assessment',
			category: 'required-component',
			label: 'Assessment',
			description: 'Assessment: a diagnosis, problem, or differential recorded',
			present: presence.assessmentPresent
		},
		{
			id: 'R-PLAN-PRESENT-01',
			section: 'plan',
			category: 'required-component',
			label: 'Plan',
			description:
				'Plan: at least one plan item (investigation, treatment, referral, or follow-up) recorded',
			present: presence.planPresent
		}
	];

	if (safetyNettingRequired(data)) {
		components.push({
			id: 'R-SAFETY-NETTING-01',
			section: 'plan',
			category: 'conditional-requirement',
			label: 'Safety-netting advice',
			description:
				'Plan: safety-netting advice recorded (required — red-flag symptoms present or patient managed at home)',
			present: has(p.safetyNetting)
		});
	}

	if (presence.planPresent) {
		components.push({
			id: 'R-FOLLOW-UP-01',
			section: 'plan',
			category: 'conditional-requirement',
			label: 'Follow-up / review',
			description:
				'Plan: a follow-up or review arrangement recorded (required whenever a plan is recorded)',
			present: has(p.followUp)
		});
	}

	return components;
}
