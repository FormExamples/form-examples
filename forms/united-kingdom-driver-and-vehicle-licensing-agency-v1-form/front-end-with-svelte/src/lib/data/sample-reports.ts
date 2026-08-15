import type { AssessmentData } from '#lib/engine/types.js';
import { validateV1 } from '#lib/engine/v1-validator.js';
import { detectFlaggedIssues } from '#lib/engine/flagged-issues.js';
import { countVisionConditionsDeclared, meetsEyesightStandard } from '#lib/engine/utils.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

/** A sample V1 form: an identifier and the full data the engine evaluates. */
export interface SampleAssessment {
	id: string;
	applicantName: string;
	submittedAt: string;
	data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	applicantName: string;
	dateOfBirth: string;
	submittedAt: string;
	meetsStandard: boolean;
	conditionsDeclared: number;
	completeness: number;
	complete: boolean;
	highPriorityFlagCount: number;
	flagCount: number;
}

/** Base personal/healthcare details that every sample shares. */
function withIdentity(
	d: AssessmentData,
	title: string,
	fullName: string,
	dob: string
): AssessmentData {
	d.personalDetails.title = title;
	d.personalDetails.fullName = fullName;
	d.personalDetails.dateOfBirth = dob;
	d.personalDetails.address = '1 Example Street\nSomewhere';
	d.personalDetails.postcode = 'SW1A 1AA';
	d.personalDetails.contactNumber = '07700 900000';
	d.healthcareProfessionals.gp.name = 'Dr Smith';
	d.healthcareProfessionals.gp.surgeryName = 'High Street Surgery';
	d.healthcareProfessionals.gp.postcode = 'SW1A 1AA';
	d.healthcareProfessionals.gp.dateLastSeen = '2025-11-01';
	d.authorisation.declarationConfirmed = true;
	d.authorisation.name = fullName;
	d.authorisation.signature = fullName;
	d.authorisation.date = '2026-01-15';
	d.authorisation.authoriseElectronicCorrespondence = 'no';
	return d;
}

/** Answer every top-level vision question "No" (the minimal complete path). */
function allNo(d: AssessmentData): AssessmentData {
	d.eyesightStandards.meetsStandard = 'yes-with-correction';
	d.visionInBothEyes.hasVisionInBothEyes = 'yes';
	d.fieldOfVision.hasProblem = 'no';
	d.glaucoma.hasCondition = 'no';
	d.retinitisPigmentosa.hasCondition = 'no';
	d.laserTreatment.hasHadTreatment = 'no';
	d.blepharospasm.hasCondition = 'no';
	d.nightBlindness.hasCondition = 'no';
	d.doubleVision.hasCondition = 'no';
	d.otherVisionConditions.hasOther = 'no';
	d.recentContact.hadContact = 'no';
	return d;
}

/** A complete, benign declaration with recent contact: no flags. */
function benignComplete(): AssessmentData {
	const d = allNo(withIdentity(createDefaultAssessment(), 'Mr', 'Daniel Ashworth', '1958-03-14'));
	d.recentContact.hadContact = 'yes';
	d.recentContact.dateOfContact = '2025-12-01';
	return d;
}

/** Complete monocular declaration, adapted with advice: a low-priority flag. */
function monocularComplete(): AssessmentData {
	const d = allNo(withIdentity(createDefaultAssessment(), 'Ms', 'Catrin Bevan', '1972-11-02'));
	d.visionInBothEyes.hasVisionInBothEyes = 'no';
	d.visionInBothEyes.whichEye = 'right';
	d.visionInBothEyes.duration = 'health-or-injury';
	d.visionInBothEyes.adaptation = 'adapted-advised';
	d.visionInBothEyes.monocularDeclarationConfirmed = true;
	d.recentContact.hadContact = 'yes';
	d.recentContact.dateOfContact = '2025-10-12';
	return d;
}

/** Complete declaration that fails the eyesight standard with bilateral glaucoma. */
function failsStandardComplete(): AssessmentData {
	const d = allNo(withIdentity(createDefaultAssessment(), 'Mr', 'Hugh Carmichael', '1965-07-19'));
	d.eyesightStandards.meetsStandard = 'no';
	d.glaucoma.hasCondition = 'yes';
	d.glaucoma.whichEyes = 'both';
	d.fieldOfVision.hasProblem = 'yes';
	d.fieldOfVision.causedSolelyByEyeCondition = 'yes';
	d.recentContact.hadContact = 'yes';
	d.recentContact.dateOfContact = '2025-12-20';
	return d;
}

/** Incomplete declaration: uncontrolled diplopia, declaration unsigned. */
function diplopiaIncomplete(): AssessmentData {
	const d = allNo(withIdentity(createDefaultAssessment(), 'Mrs', 'Eira Davies', '1981-02-25'));
	d.doubleVision.hasCondition = 'yes';
	d.doubleVision.controlled = 'no';
	d.doubleVision.sameForSixMonthsOrMore = 'no';
	// double-vision declaration intentionally left unconfirmed/unsigned → incomplete + urgent flag
	return d;
}

/** The sample forms, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'V1-2026-0001', applicantName: 'Ashworth, Daniel', submittedAt: '2026-04-22', data: benignComplete() },
	{ id: 'V1-2026-0002', applicantName: 'Bevan, Catrin', submittedAt: '2026-04-21', data: monocularComplete() },
	{ id: 'V1-2026-0003', applicantName: 'Carmichael, Hugh', submittedAt: '2026-04-20', data: failsStandardComplete() },
	{ id: 'V1-2026-0004', applicantName: 'Davies, Eira', submittedAt: '2026-04-19', data: diplopiaIncomplete() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const v = validateV1(s.data);
	const flags = detectFlaggedIssues(s.data);
	return {
		id: s.id,
		applicantName: s.applicantName,
		dateOfBirth: s.data.personalDetails.dateOfBirth,
		submittedAt: s.submittedAt,
		meetsStandard: meetsEyesightStandard(s.data),
		conditionsDeclared: countVisionConditionsDeclared(s.data),
		completeness: Math.round(v.completionRatio * 100),
		complete: v.isComplete,
		highPriorityFlagCount: flags.filter((f) => f.priority === 'urgent' || f.priority === 'high')
			.length,
		flagCount: flags.length
	};
});
