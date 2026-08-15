import type { AssessmentData, Outcome, TriState } from '#lib/engine/types.js';
import { gradeFirstAid } from '#lib/engine/first-aid-grader.js';
import { certificationCurrency, type CertificationCurrency } from '#lib/engine/utils.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

/** A sample checklist: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	traineeName: string;
	assessedDate: string;
	data: AssessmentData;
}

/** A row in the training-coordinator dashboard, derived by running the engine. */
export interface DashboardRow {
	id: string;
	traineeName: string;
	role: string;
	assessedDate: string;
	outcome: Outcome;
	skillsDemonstrated: number;
	skillsTotal: number;
	criticalCount: number;
	currency: CertificationCurrency;
	flagCount: number;
}

/** Mark every unanswered tri-state field in a section block as demonstrated. */
function markAllYes(section: Record<string, TriState>) {
	for (const k of Object.keys(section)) {
		if (section[k] === '') section[k] = 'yes';
	}
}

/** Base record with every gradeable skill demonstrated (a clean Pass). */
function competentBase(): AssessmentData {
	const d = createDefaultAssessment();
	markAllYes(d.sceneAssessmentSafety as unknown as Record<string, TriState>);
	markAllYes(d.primarySurveyDRABC as unknown as Record<string, TriState>);
	markAllYes(d.cprAed as unknown as Record<string, TriState>);
	markAllYes(d.chokingManagement as unknown as Record<string, TriState>);
	markAllYes(d.bleedingWoundCare as unknown as Record<string, TriState>);
	markAllYes(d.burnsScalds as unknown as Record<string, TriState>);
	markAllYes(d.fracturesSprainsSpinal as unknown as Record<string, TriState>);
	markAllYes(d.medicalEmergencies as unknown as Record<string, TriState>);
	return d;
}

/** A clear Pass: all skills demonstrated, certification current. */
function passRecord(): AssessmentData {
	const d = competentBase();
	d.traineeDetails = {
		...d.traineeDetails,
		firstName: 'Yusuf',
		lastName: 'Ahmed',
		traineeId: 'FAW-2025-0042',
		role: 'workplace-first-aider',
		sessionDate: '2026-06-02',
		priorCertificationExpiry: '2028-08-12',
		examinerName: 'Bennett, Claire',
		venue: 'St John Ambulance — London Regional Centre'
	};
	return d;
}

/** Needs Development: two non-critical deficiencies, certification expiring soon. */
function needsDevelopmentRecord(): AssessmentData {
	const d = competentBase();
	d.traineeDetails = {
		...d.traineeDetails,
		firstName: 'Marcus',
		lastName: 'Brown',
		traineeId: 'FAW-2026-0014',
		role: 'first-aider',
		sessionDate: '2026-06-05',
		priorCertificationExpiry: '2026-07-20',
		examinerName: 'O’Connor, Niamh',
		venue: 'Highfield Awarding Body — Doncaster'
	};
	d.burnsScalds.cooledForTwentyMinutes = 'no';
	d.fracturesSprainsSpinal.appliedRiceForSprains = 'no';
	d.recordingReportingHandover.debriefNotes = 'Coach burn-cooling duration and RICE sequence.';
	return d;
}

/** Fail (critical): ineffective CPR compressions — a life-saving skill failure. */
function failCriticalRecord(): AssessmentData {
	const d = competentBase();
	d.traineeDetails = {
		...d.traineeDetails,
		firstName: 'Rohan',
		lastName: 'Patel',
		traineeId: 'FAW-2026-0008',
		role: 'security-officer',
		sessionDate: '2026-06-08',
		priorCertificationExpiry: '',
		examinerName: 'Bennett, Claire',
		venue: 'St John Ambulance — London Regional Centre'
	};
	d.cprAed.effectiveCompressions = 'no';
	d.medicalEmergencies.recognisedAnaphylaxis = 'no';
	d.recordingReportingHandover.examinerNotes = 'Compression depth and rate well below standard; full reassessment.';
	return d;
}

/** Fail (deficiencies): three+ non-critical deficiencies, prior cert expired. */
function failDeficienciesRecord(): AssessmentData {
	const d = competentBase();
	d.traineeDetails = {
		...d.traineeDetails,
		firstName: 'Aleksander',
		lastName: 'Kowalski',
		traineeId: 'FAW-2026-0035',
		role: 'volunteer',
		sessionDate: '2026-06-11',
		priorCertificationExpiry: '2026-04-09',
		examinerName: 'O’Connor, Niamh',
		venue: 'Highfield Awarding Body — Doncaster'
	};
	d.bleedingWoundCare.appliedDressingCorrectly = 'no';
	d.bleedingWoundCare.treatedForShock = 'no';
	d.burnsScalds.referredAppropriately = 'no';
	return d;
}

/** The sample checklists, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'FA-2026-0001', traineeName: 'Ahmed, Yusuf', assessedDate: '2026-06-02', data: passRecord() },
	{ id: 'FA-2026-0002', traineeName: 'Brown, Marcus', assessedDate: '2026-06-05', data: needsDevelopmentRecord() },
	{ id: 'FA-2026-0003', traineeName: 'Patel, Rohan', assessedDate: '2026-06-08', data: failCriticalRecord() },
	{ id: 'FA-2026-0004', traineeName: 'Kowalski, Aleksander', assessedDate: '2026-06-11', data: failDeficienciesRecord() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeFirstAid(s.data);
	return {
		id: s.id,
		traineeName: s.traineeName,
		role: s.data.traineeDetails.role,
		assessedDate: s.assessedDate,
		outcome: g.outcome,
		skillsDemonstrated: g.passedCount,
		skillsTotal: g.totalRules,
		criticalCount: g.criticalFailures.length,
		currency: certificationCurrency(s.data.traineeDetails.priorCertificationExpiry),
		flagCount: g.additionalFlags.length
	};
});
