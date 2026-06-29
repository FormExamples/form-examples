import type { AssessmentData, Severity } from '$lib/engine/types';
import { gradeSundowner } from '$lib/engine/sundowner-grader';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';
import { CMAI_ITEM_IDS } from '$lib/engine/cmai-rules';

/** A sample assessment: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	assessedDate: string;
	data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientName: string;
	assessedDate: string;
	severity: Severity;
	cmaiScore: number;
	npiScore: number;
	highPriorityFlags: number;
	flagCount: number;
}

/** Set every CMAI item to `base`, then apply per-item overrides (id -> 1..7). */
function setCmai(d: AssessmentData, base: number, overrides: Record<string, number> = {}) {
	for (const id of CMAI_ITEM_IDS) d.behaviouralSymptoms.cmai[id] = base;
	for (const [id, v] of Object.entries(overrides)) d.behaviouralSymptoms.cmai[id] = v;
}

/** Mild: occasional restlessness, redirectable; minimal behavioural burden. */
function mild(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Edith', lastName: 'Brown', dateOfBirth: '1942-03-18', sex: 'female', ageYears: 84, primaryDiagnosis: "Alzheimer's disease", careSetting: 'Home' };
	d.cognitiveStatus = { ...d.cognitiveStatus, dementiaStage: 'mild', cognitiveImpairment: 'mild', mmseScore: 23, priorDeliriumHistory: 'no' };
	setCmai(d, 1, { cmai01: 2, cmai29: 2 }); // total 31 -> mild
	d.temporalPattern = { ...d.temporalPattern, episodeFrequency: 'occasional', worseAtDusk: 'yes', worseSeasonally: 'no' };
	d.environmentalAssessment = { ...d.environmentalAssessment, adequateDaylight: 'yes', consistentRoutine: 'yes', excessiveNoise: 'no' };
	d.carerImpact = { ...d.carerImpact, primaryCarer: 'Daughter', carerRelationship: 'Daughter', carerStrainLevel: 'minimal' };
	return d;
}

/** Moderate: daily episodes needing intervention; sleep disturbance, med burden. */
function moderate(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Frank', lastName: 'Davies', dateOfBirth: '1939-11-02', sex: 'male', ageYears: 86, primaryDiagnosis: 'Vascular dementia', careSetting: 'Residential care' };
	d.cognitiveStatus = { ...d.cognitiveStatus, dementiaStage: 'moderate', cognitiveImpairment: 'moderate', mmseScore: 17, priorDeliriumHistory: 'no' };
	setCmai(d, 2, { cmai06: 5, cmai18: 5 }); // total ~64 -> moderate
	d.behaviouralSymptoms.npi.sleep = { frequency: 4, severity: 2 };
	d.temporalPattern = { ...d.temporalPattern, episodeFrequency: 'frequent', worseAtDusk: 'yes', peakTime: '18:00' };
	d.sleepWakeCycle = { ...d.sleepWakeCycle, averageHoursOfSleep: 4, nighttimeWandering: 'yes' };
	d.medicationReview = { ...d.medicationReview, anticholinergicBurden: 'yes', medicationAdherence: 'partial', currentMedications: [{ name: 'Donepezil', dose: '10 mg', frequency: 'OD', indication: 'Dementia' }] };
	d.carerImpact = { ...d.carerImpact, primaryCarer: 'Care home staff', carerStrainLevel: 'moderate', carerSleepDisturbed: 'yes' };
	return d;
}

/** Severe: aggressive behaviour, safety risk; prior delirium. */
function severe(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Gladys', lastName: 'Evans', dateOfBirth: '1936-07-25', sex: 'female', ageYears: 89, primaryDiagnosis: 'Mixed dementia', careSetting: 'Nursing home' };
	d.cognitiveStatus = { ...d.cognitiveStatus, dementiaStage: 'severe', cognitiveImpairment: 'severe', mmseScore: 9, priorDeliriumHistory: 'yes' };
	setCmai(d, 2, { cmai04: 5, cmai07: 5, cmai13: 6 }); // aggression; total ~86 -> severe
	d.behaviouralSymptoms.npi.agitationAggression = { frequency: 4, severity: 3 };
	d.temporalPattern = { ...d.temporalPattern, episodeFrequency: 'frequent', worseAtDusk: 'yes' };
	d.triggerIdentification = { ...d.triggerIdentification, pain: 'yes', infection: 'yes' };
	d.medicationReview = { ...d.medicationReview, antipsychoticUse: 'yes', sedativeUse: 'yes', recentMedicationChange: 'yes' };
	d.carerImpact = { ...d.carerImpact, primaryCarer: 'Nursing staff', carerStrainLevel: 'severe', carerBurnoutSigns: 'yes' };
	return d;
}

/** Critical: self-harm risk, requires constant supervision. */
function critical(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Harold', lastName: 'Foster', dateOfBirth: '1933-01-09', sex: 'male', ageYears: 92, primaryDiagnosis: 'Late-stage Alzheimer’s disease', careSetting: 'Hospital ward' };
	d.cognitiveStatus = { ...d.cognitiveStatus, dementiaStage: 'severe', cognitiveImpairment: 'severe', mmseScore: 4, priorDeliriumHistory: 'yes' };
	setCmai(d, 5, { cmai07: 7, cmai17: 4, cmai21: 6 }); // total ~150 -> critical
	d.behaviouralSymptoms.npi.agitationAggression = { frequency: 4, severity: 3 };
	d.behaviouralSymptoms.npi.sleep = { frequency: 4, severity: 3 };
	d.temporalPattern = { ...d.temporalPattern, episodeFrequency: 'continuous', worseAtDusk: 'yes' };
	d.triggerIdentification = { ...d.triggerIdentification, infection: 'yes', dehydration: 'yes', pain: 'yes' };
	d.sleepWakeCycle = { ...d.sleepWakeCycle, averageHoursOfSleep: 3, nighttimeWandering: 'yes', reversedSleepCycle: 'yes' };
	d.medicationReview = { ...d.medicationReview, anticholinergicBurden: 'yes', antipsychoticUse: 'yes', sedativeUse: 'yes', medicationAdherence: 'poor' };
	d.environmentalAssessment = { ...d.environmentalAssessment, adequateDaylight: 'no', excessiveNoise: 'yes', consistentRoutine: 'no', mirrorsOrShadows: 'yes' };
	d.carerImpact = { ...d.carerImpact, primaryCarer: 'Ward team', carerStrainLevel: 'severe', carerBurnoutSigns: 'yes', carerSleepDisturbed: 'yes' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'SS-2026-0001', patientName: 'Brown, Edith', assessedDate: '2026-06-10', data: mild() },
	{ id: 'SS-2026-0002', patientName: 'Davies, Frank', assessedDate: '2026-06-12', data: moderate() },
	{ id: 'SS-2026-0003', patientName: 'Evans, Gladys', assessedDate: '2026-06-15', data: severe() },
	{ id: 'SS-2026-0004', patientName: 'Foster, Harold', assessedDate: '2026-06-18', data: critical() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeSundowner(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		severity: g.severity,
		cmaiScore: g.cmaiScore,
		npiScore: g.npiScore,
		highPriorityFlags: g.additionalFlags.filter((f) => f.priority === 'high').length,
		flagCount: g.additionalFlags.length
	};
});
