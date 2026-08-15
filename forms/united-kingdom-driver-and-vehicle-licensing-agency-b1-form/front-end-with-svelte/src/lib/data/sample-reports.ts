import type { AssessmentData } from '#lib/engine/types.js';
import { validateB1 } from '#lib/engine/b1-validator.js';
import { detectFlaggedIssues } from '#lib/engine/flagged-issues.js';
import { countConditionsDeclared } from '#lib/engine/utils.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

/** A sample B1 form: an identifier and the full data the engine evaluates. */
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
	conditionsDeclared: number;
	epilepsyDeclared: boolean;
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
	d.personalDetails.addressLine1 = '1 Example Street';
	d.personalDetails.postcode = 'SW1A 1AA';
	d.personalDetails.contactNumber = '07700 900000';
	d.healthcareProfessionals.gp.gpName = 'Dr Smith';
	d.healthcareProfessionals.gp.surgeryName = 'High Street Surgery';
	d.healthcareProfessionals.gp.postcode = 'SW1A 1AA';
	d.healthcareProfessionals.gp.dateLastSeen = '2025-11-01';
	d.treatmentProvider.lastSeen = 'gp';
	d.treatmentProvider.gpLastContactDate = '2025-11-01';
	d.authorisation.declarationAccepted = true;
	d.authorisation.name = fullName;
	d.authorisation.signatureDate = '2026-01-15';
	d.authorisation.electronicCorrespondenceConsent = 'no';
	return d;
}

/** A complete, benign declaration: no neurological events, no flags. */
function benignComplete(): AssessmentData {
	const d = withIdentity(createDefaultAssessment(), 'Mr', 'Daniel Ashworth', '1958-03-14');
	d.conditionHistory.brainSurgeryNotApplicable = true;
	d.blackouts.hadBlackouts = 'no';
	d.seizures.hadSeizures = 'no';
	d.medication.noMedicationTaken = true;
	d.vpShunt.hadVpShuntOrDrain = 'no';
	d.dailyLiving.needsHelp = 'no';
	d.doubleVision.hasDoubleVision = 'no';
	d.eyesight.hasEyesightProblems = 'no';
	d.vehicleAdaptations.needsAdaptations = 'no';
	return d;
}

/** Complete declaration with epilepsy declared and signed; high-priority flags. */
function epilepsyComplete(): AssessmentData {
	const d = withIdentity(createDefaultAssessment(), 'Ms', 'Catrin Bevan', '1972-11-02');
	d.conditionHistory.otherCondition = true;
	d.conditionHistory.otherConditionDate = '2024-08-10';
	d.conditionHistory.otherConditionDetails = 'Diagnosed epilepsy following encephalitis';
	d.blackouts.hadBlackouts = 'no';
	d.seizures.hadSeizures = 'yes';
	d.seizures.diagnosis = 'more-than-one-or-epilepsy';
	d.seizures.multiple.twoOrMoreWithinFiveYears = 'yes';
	d.seizures.multiple.affectedConsciousness = 'yes';
	d.seizures.multiple.wouldHaveAffectedDriving = 'yes';
	d.seizures.multiple.resultOfMedicationAdvice = 'no';
	d.seizures.epilepsyDeclaration.declarationAccepted = true;
	d.seizures.epilepsyDeclaration.signedName = 'Catrin Bevan';
	d.seizures.epilepsyDeclaration.signatureDate = '2026-01-10';
	d.medication.noMedicationTaken = false;
	d.medication.entries[0] = { name: 'Levetiracetam 500 mg', startDate: '2024-09-01', endDate: '' };
	d.medication.makesDrowsyOrConfused = 'no';
	d.vpShunt.hadVpShuntOrDrain = 'no';
	d.dailyLiving.needsHelp = 'no';
	d.doubleVision.hasDoubleVision = 'no';
	d.eyesight.hasEyesightProblems = 'no';
	d.vehicleAdaptations.needsAdaptations = 'no';
	return d;
}

/** Incomplete declaration: multiple conditions, epilepsy declaration unsigned. */
function multiConditionIncomplete(): AssessmentData {
	const d = withIdentity(createDefaultAssessment(), 'Mr', 'Hugh Carmichael', '1965-07-19');
	d.conditionHistory.brainHaemorrhage = true;
	d.conditionHistory.brainHaemorrhageDate = '2022-02-01';
	d.conditionHistory.severeHeadInjury = true;
	d.conditionHistory.severeHeadInjuryDate = '2019-05-12';
	d.conditionHistory.otherCondition = true;
	d.conditionHistory.otherConditionDetails = 'VP shunt for hydrocephalus';
	d.blackouts.hadBlackouts = 'yes';
	d.blackouts.blackoutDate = '2025-12-20';
	d.seizures.hadSeizures = 'yes';
	d.seizures.diagnosis = 'more-than-one-or-epilepsy';
	d.seizures.multiple.twoOrMoreWithinFiveYears = 'yes';
	d.seizures.multiple.affectedConsciousness = 'yes';
	// wouldHaveAffectedDriving left blank (Q6h) and resultOfMedicationAdvice blank → incomplete
	// epilepsy declaration intentionally left unsigned → urgent flag + incomplete
	d.medication.noMedicationTaken = false;
	d.medication.entries[0] = { name: 'Sodium valproate 600 mg', startDate: '2021-01-01', endDate: '' };
	d.medication.makesDrowsyOrConfused = 'yes';
	d.vpShunt.hadVpShuntOrDrain = 'yes';
	d.vpShunt.procedureDate = '2020-03-15';
	d.dailyLiving.needsHelp = 'yes';
	d.dailyLiving.helpDetails = 'Family assistance with daily routine';
	d.doubleVision.hasDoubleVision = 'no';
	d.eyesight.hasEyesightProblems = 'no';
	d.vehicleAdaptations.needsAdaptations = 'no';
	return d;
}

/** Complete declaration with uncontrolled diplopia and adaptations. */
function visionAdaptationsComplete(): AssessmentData {
	const d = withIdentity(createDefaultAssessment(), 'Mrs', 'Eira Davies', '1981-02-25');
	d.conditionHistory.severeHeadInjury = true;
	d.conditionHistory.severeHeadInjuryDate = '2023-09-09';
	d.blackouts.hadBlackouts = 'no';
	d.seizures.hadSeizures = 'no';
	d.medication.noMedicationTaken = false;
	d.medication.entries[0] = { name: 'Paracetamol 1 g', startDate: '2023-09-10', endDate: '' };
	d.medication.makesDrowsyOrConfused = 'no';
	d.vpShunt.hadVpShuntOrDrain = 'no';
	d.dailyLiving.needsHelp = 'no';
	d.doubleVision.hasDoubleVision = 'yes';
	d.doubleVision.suppressedOrControlled = 'no';
	d.eyesight.hasEyesightProblems = 'yes';
	d.eyesight.details = 'Reduced peripheral vision on the left';
	d.vehicleAdaptations.needsAdaptations = 'yes';
	d.vehicleAdaptations.previouslyDeclared = 'no';
	return d;
}

/** The sample forms, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'B1-2026-0001', applicantName: 'Ashworth, Daniel', submittedAt: '2026-04-22', data: benignComplete() },
	{ id: 'B1-2026-0002', applicantName: 'Bevan, Catrin', submittedAt: '2026-04-21', data: epilepsyComplete() },
	{ id: 'B1-2026-0003', applicantName: 'Carmichael, Hugh', submittedAt: '2026-04-20', data: multiConditionIncomplete() },
	{ id: 'B1-2026-0004', applicantName: 'Davies, Eira', submittedAt: '2026-04-19', data: visionAdaptationsComplete() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const v = validateB1(s.data);
	const flags = detectFlaggedIssues(s.data);
	return {
		id: s.id,
		applicantName: s.applicantName,
		dateOfBirth: s.data.personalDetails.dateOfBirth,
		submittedAt: s.submittedAt,
		conditionsDeclared: countConditionsDeclared(s.data),
		epilepsyDeclared: s.data.seizures.diagnosis === 'more-than-one-or-epilepsy',
		completeness:
			v.totalRequired === 0 ? 100 : Math.round((v.totalSatisfied / v.totalRequired) * 100),
		complete: v.complete,
		highPriorityFlagCount: flags.filter((f) => f.priority === 'urgent' || f.priority === 'high')
			.length,
		flagCount: flags.length
	};
});
