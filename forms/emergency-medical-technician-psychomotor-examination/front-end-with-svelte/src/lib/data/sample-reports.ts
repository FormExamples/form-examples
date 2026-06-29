import type { AssessmentData, ExamAttempt, Outcome } from '$lib/engine/types';
import { gradePsychomotor } from '$lib/engine/psychomotor-grader';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

/** A sample examination: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	candidateName: string;
	sessionDate: string;
	attempt: ExamAttempt;
	data: AssessmentData;
}

/** A row in the training-coordinator dashboard, derived by running the engine. */
export interface DashboardRow {
	id: string;
	candidateName: string;
	sessionDate: string;
	attempt: ExamAttempt;
	outcome: Outcome;
	score: string;
	percent: number;
	criticalCount: number;
	flagCount: number;
}

/** Mark every blank tri-state field in a section as performed ('yes'). */
function allPerformed(section: Record<string, unknown>): void {
	for (const k of Object.keys(section)) {
		if (section[k] === '') section[k] = 'yes';
	}
}

/** Base: a complete, fully-performed checklist (perfect Pass). */
function basePerformed(): AssessmentData {
	const d = createDefaultAssessment();
	allPerformed(d.sceneSizeUp as unknown as Record<string, unknown>);
	allPerformed(d.primarySurvey as unknown as Record<string, unknown>);
	allPerformed(d.historySecondaryAssessment as unknown as Record<string, unknown>);
	allPerformed(d.reassessment as unknown as Record<string, unknown>);
	d.criticalCriteriaReview.dangerousIntervention = 'yes';
	d.criticalCriteriaReview.spinalProtection = 'yes';
	return d;
}

/** A clean Pass: every item performed correctly. */
function cleanPass(): AssessmentData {
	const d = basePerformed();
	d.candidateExaminerScenario = {
		...d.candidateExaminerScenario,
		candidateFirstName: 'Yusuf',
		candidateLastName: 'Ahmed',
		candidateId: 'EMT-2026-0042',
		attempt: 'first-attempt',
		examinerName: 'Bennett, Claire',
		sessionDate: '2026-04-12',
		stationLocation: 'Pittsburgh Paramedic Institute',
		scenarioSummary: '58-year-old with chest tightness and shortness of breath.',
		chiefComplaintGiven: 'Chest pain'
	};
	return d;
}

/** A Pass with a few non-critical gaps, still above the 80% threshold. */
function passWithMinorGaps(): AssessmentData {
	const d = basePerformed();
	d.candidateExaminerScenario = {
		...d.candidateExaminerScenario,
		candidateFirstName: 'Chiamaka',
		candidateLastName: 'Okafor',
		candidateId: 'EMT-2026-0061',
		attempt: 'first-attempt',
		examinerName: 'Williams, Mark',
		sessionDate: '2026-04-22',
		stationLocation: 'Houston Community College EMS Academy',
		scenarioSummary: '24-year-old with severe allergic reaction.',
		chiefComplaintGiven: 'Difficulty breathing'
	};
	// A couple of non-critical misses; one item not applicable to scenario.
	d.sceneSizeUp.additionalResources = 'na';
	d.historySecondaryAssessment.sampleLastIntake = 'no';
	d.criticalCriteriaReview.examinerNotes = 'Strong primary survey; tighten SAMPLE history.';
	return d;
}

/** A Fail by critical criterion: failed to take PPE precautions. */
function failCritical(): AssessmentData {
	const d = basePerformed();
	d.candidateExaminerScenario = {
		...d.candidateExaminerScenario,
		candidateFirstName: 'Rohan',
		candidateLastName: 'Patel',
		candidateId: 'EMT-2026-0008',
		attempt: 'retest',
		examinerName: 'Bennett, Claire',
		sessionDate: '2026-02-17',
		stationLocation: 'Pittsburgh Paramedic Institute',
		scenarioSummary: '70-year-old with altered mental status.',
		chiefComplaintGiven: 'Confusion'
	};
	d.sceneSizeUp.ppePrecautions = 'no'; // critical → automatic Fail
	d.criticalCriteriaReview.debriefNotes = 'Reinforce body-substance isolation before patient contact.';
	return d;
}

/** A Fail by points: several non-critical deficiencies, no critical fail. */
function failOnPoints(): AssessmentData {
	const d = basePerformed();
	d.candidateExaminerScenario = {
		...d.candidateExaminerScenario,
		candidateFirstName: 'Marcus',
		candidateLastName: 'Brown',
		candidateId: 'EMT-2026-0014',
		attempt: 'retest',
		examinerName: 'O’Connor, Niamh',
		sessionDate: '2026-01-31',
		stationLocation: 'Boston EMT Bridge Program',
		scenarioSummary: '46-year-old with abdominal pain.',
		chiefComplaintGiven: 'Abdominal pain'
	};
	// Knock out enough non-critical items to drop below 80% (no critical fails).
	d.historySecondaryAssessment.sampleSignsSymptoms = 'no';
	d.historySecondaryAssessment.sampleAllergies = 'no';
	d.historySecondaryAssessment.sampleMedications = 'no';
	d.historySecondaryAssessment.samplePastHistory = 'no';
	d.historySecondaryAssessment.sampleLastIntake = 'no';
	d.historySecondaryAssessment.sampleEvents = 'no';
	d.historySecondaryAssessment.focusedExam = 'no';
	d.reassessment.repeatsVitals = 'no';
	d.reassessment.repeatsFocusedExam = 'no';
	d.reassessment.evaluatesInterventions = 'no';
	return d;
}

/** The sample examinations, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'EMT-2026-0001', candidateName: 'Ahmed, Yusuf', sessionDate: '2026-04-12', attempt: 'first-attempt', data: cleanPass() },
	{ id: 'EMT-2026-0002', candidateName: 'Okafor, Chiamaka', sessionDate: '2026-04-22', attempt: 'first-attempt', data: passWithMinorGaps() },
	{ id: 'EMT-2026-0003', candidateName: 'Patel, Rohan', sessionDate: '2026-02-17', attempt: 'retest', data: failCritical() },
	{ id: 'EMT-2026-0004', candidateName: 'Brown, Marcus', sessionDate: '2026-01-31', attempt: 'retest', data: failOnPoints() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradePsychomotor(s.data);
	return {
		id: s.id,
		candidateName: s.candidateName,
		sessionDate: s.sessionDate,
		attempt: s.attempt,
		outcome: g.outcome,
		score: `${g.points} / ${g.maxPoints}`,
		percent: Math.round(g.percent),
		criticalCount: g.criticalFailures.length,
		flagCount: g.additionalFlags.length
	};
});
