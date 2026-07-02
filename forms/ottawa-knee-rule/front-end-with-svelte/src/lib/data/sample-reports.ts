import type { AssessmentData, CareSetting, Decision, InjuredSide } from '$lib/engine/types';
import { gradeOttawaKnee } from '$lib/engine/ottawa-knee-grader';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

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
	patientIdentifier: string;
	patientName: string;
	assessedDate: string;
	careSetting: CareSetting;
	injuredSide: InjuredSide;
	decision: Decision;
	xrayIndicated: boolean;
	firedCount: number;
	flagCount: number;
}

/** All five criteria absent in a young patient — X-ray NOT indicated. */
function decisionNotIndicated(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Khan',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-24T08:15',
		careSetting: 'emergency-department',
		injuryMechanism: 'twisting',
		hoursSinceInjury: 2
	};
	d.identification = { patientIdentifier: 'ED-204817', sex: 'female', injuredSide: 'left' };
	d.age = { ageYears: 28 };
	d.tenderness = {
		patellarTenderness: 'no',
		otherBonyTenderness: 'no',
		fibularHeadTenderness: 'no'
	};
	d.flexion = { unableToFlex90: 'no' };
	d.weightBearing = { unableToBearWeight: 'no' };
	d.note.clinicalNotes = 'All Ottawa criteria absent; no radiograph required. Symptomatic advice given.';
	return d;
}

/** Single criterion (age >= 55) — X-ray indicated. */
function decisionIndicatedAge(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'NP P. Reyes',
		clinicianRole: 'nurse-practitioner',
		assessedAt: '2026-06-25T14:40',
		careSetting: 'minor-injuries-unit',
		injuryMechanism: 'fall',
		hoursSinceInjury: 5
	};
	d.identification = { patientIdentifier: 'MIU-118032', sex: 'male', injuredSide: 'right' };
	d.age = { ageYears: 63 };
	d.tenderness = {
		patellarTenderness: 'no',
		otherBonyTenderness: 'no',
		fibularHeadTenderness: 'no'
	};
	d.flexion = { unableToFlex90: 'no' };
	d.weightBearing = { unableToBearWeight: 'no' };
	d.note.clinicalNotes = 'Age >= 55 fires the rule; knee radiograph requested.';
	return d;
}

/** Isolated patellar tenderness only — X-ray indicated (isolation matters). */
function decisionIndicatedIsolatedPatellar(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Physio L. Osei',
		clinicianRole: 'physiotherapist',
		assessedAt: '2026-06-26T10:05',
		careSetting: 'urgent-care',
		injuryMechanism: 'blunt-trauma',
		hoursSinceInjury: 12
	};
	d.identification = { patientIdentifier: 'UCC-550204', sex: 'female', injuredSide: 'left' };
	d.age = { ageYears: 34 };
	d.tenderness = {
		patellarTenderness: 'yes',
		otherBonyTenderness: 'no',
		fibularHeadTenderness: 'no'
	};
	d.flexion = { unableToFlex90: 'no' };
	d.weightBearing = { unableToBearWeight: 'no' };
	d.note.clinicalNotes = 'Isolated patellar tenderness (no other bony tenderness); radiograph indicated.';
	return d;
}

/** Multiple criteria including unable to bear weight — X-ray indicated. */
function decisionIndicatedMulti(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr S. Doyle',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-27T22:20',
		careSetting: 'emergency-department',
		injuryMechanism: 'fall',
		hoursSinceInjury: 1
	};
	d.identification = { patientIdentifier: 'ED-204902', sex: 'male', injuredSide: 'right' };
	d.age = { ageYears: 58 };
	d.tenderness = {
		patellarTenderness: 'yes',
		otherBonyTenderness: 'yes',
		fibularHeadTenderness: 'yes'
	};
	d.flexion = { unableToFlex90: 'yes' };
	d.weightBearing = { unableToBearWeight: 'yes' };
	d.note.clinicalNotes = 'Multiple criteria positive and unable to bear weight; urgent imaging and analgesia.';
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{
		id: 'OKR-2026-0001',
		patientName: 'Okafor, Grace',
		assessedDate: '2026-06-24',
		data: decisionNotIndicated()
	},
	{
		id: 'OKR-2026-0002',
		patientName: 'Mackenzie, Ian',
		assessedDate: '2026-06-25',
		data: decisionIndicatedAge()
	},
	{
		id: 'OKR-2026-0003',
		patientName: 'Byrne, Aoife',
		assessedDate: '2026-06-26',
		data: decisionIndicatedIsolatedPatellar()
	},
	{
		id: 'OKR-2026-0004',
		patientName: 'Nowak, Zofia',
		assessedDate: '2026-06-27',
		data: decisionIndicatedMulti()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeOttawaKnee(s.data);
	// firedCriteria includes the composite R-DECISION-01 audit row; exclude it.
	const firedCount = g.firedCriteria.filter((r) => r.criterion !== 'decision').length;
	return {
		id: s.id,
		patientIdentifier: s.data.identification.patientIdentifier,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		careSetting: s.data.context.careSetting,
		injuredSide: s.data.identification.injuredSide,
		decision: g.decision,
		xrayIndicated: g.xrayIndicated,
		firedCount,
		flagCount: g.flaggedIssues.length
	};
});
