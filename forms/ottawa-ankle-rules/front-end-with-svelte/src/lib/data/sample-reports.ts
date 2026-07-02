import type { AssessmentData, CareSetting } from '$lib/engine/types';
import { gradeOttawaAnkleRules } from '$lib/engine/ottawa-ankle-grader';
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
	ankleXray: boolean;
	footXray: boolean;
	/** Stable key for the decision filter: 'ankle' | 'foot' | 'both' | 'neither'. */
	decisionKey: 'ankle' | 'foot' | 'both' | 'neither';
	flagCount: number;
}

/** Ankle only — malleolar-zone pain with lateral malleolus tenderness. */
function ankleOnly(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Khan',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-10T08:15',
		careSetting: 'emergency-department',
		injuredSide: 'left',
		hoursSinceInjury: 3
	};
	d.identification = { patientIdentifier: 'ED-2041', ageYears: 27, sex: 'female' };
	d.applicability = { assessmentReliable: 'yes' };
	d.painZones = { malleolarZonePain: 'yes', midfootZonePain: 'no' };
	d.ankleTenderness = { lateralMalleolusTenderness: 'yes', medialMalleolusTenderness: 'no' };
	d.footTenderness = { fifthMetatarsalBaseTenderness: 'no', navicularTenderness: 'no' };
	d.weightBearing = { ableToBearWeightImmediately: 'yes', ableToBearWeightNow: 'yes' };
	d.note.clinicalNotes = 'Lateral malleolus tenderness with malleolar-zone pain; ankle series requested.';
	return d;
}

/** Foot only — midfoot-zone pain with fifth-metatarsal-base tenderness. */
function footOnly(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'NP P. Reyes',
		clinicianRole: 'nurse-practitioner',
		assessedAt: '2026-06-12T14:40',
		careSetting: 'minor-injury-unit',
		injuredSide: 'right',
		hoursSinceInjury: 1.5
	};
	d.identification = { patientIdentifier: 'MIU-100482', ageYears: 41, sex: 'male' };
	d.applicability = { assessmentReliable: 'yes' };
	d.painZones = { malleolarZonePain: 'no', midfootZonePain: 'yes' };
	d.ankleTenderness = { lateralMalleolusTenderness: 'no', medialMalleolusTenderness: 'no' };
	d.footTenderness = { fifthMetatarsalBaseTenderness: 'yes', navicularTenderness: 'no' };
	d.weightBearing = { ableToBearWeightImmediately: 'yes', ableToBearWeightNow: 'yes' };
	d.note.clinicalNotes = 'Base-of-fifth-metatarsal tenderness with midfoot-zone pain; foot series requested.';
	return d;
}

/** Both — pain in both zones and inability to bear weight (feeds both decisions). */
function bothRegions(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr L. Osei',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-15T22:05',
		careSetting: 'emergency-department',
		injuredSide: 'left',
		hoursSinceInjury: 4
	};
	d.identification = { patientIdentifier: 'ED-100517', ageYears: 63, sex: 'female' };
	d.applicability = { assessmentReliable: 'yes' };
	d.painZones = { malleolarZonePain: 'yes', midfootZonePain: 'yes' };
	d.ankleTenderness = { lateralMalleolusTenderness: 'yes', medialMalleolusTenderness: 'no' };
	d.footTenderness = { fifthMetatarsalBaseTenderness: 'no', navicularTenderness: 'yes' };
	d.weightBearing = { ableToBearWeightImmediately: 'no', ableToBearWeightNow: 'no' };
	d.note.clinicalNotes = 'Unable to bear weight; both ankle and foot series requested.';
	return d;
}

/** Neither — reliable adult with pain but no positive criteria. */
function neither(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'PT S. Doyle',
		clinicianRole: 'physiotherapist',
		assessedAt: '2026-06-18T10:20',
		careSetting: 'urgent-care',
		injuredSide: 'right',
		hoursSinceInjury: 6
	};
	d.identification = { patientIdentifier: 'UC-77-2211', ageYears: 35, sex: 'male' };
	d.applicability = { assessmentReliable: 'yes' };
	d.painZones = { malleolarZonePain: 'yes', midfootZonePain: 'yes' };
	d.ankleTenderness = { lateralMalleolusTenderness: 'no', medialMalleolusTenderness: 'no' };
	d.footTenderness = { fifthMetatarsalBaseTenderness: 'no', navicularTenderness: 'no' };
	d.weightBearing = { ableToBearWeightImmediately: 'yes', ableToBearWeightNow: 'yes' };
	d.note.clinicalNotes = 'No bone tenderness and weight-bearing intact; soft-tissue injury, safety-netted.';
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'OAR-2026-0001', patientName: 'Adeyemi, Grace', assessedDate: '2026-06-10', data: ankleOnly() },
	{ id: 'OAR-2026-0002', patientName: 'Novak, Peter', assessedDate: '2026-06-12', data: footOnly() },
	{ id: 'OAR-2026-0003', patientName: 'Ferreira, Ana', assessedDate: '2026-06-15', data: bothRegions() },
	{ id: 'OAR-2026-0004', patientName: 'Okonkwo, Daniel', assessedDate: '2026-06-18', data: neither() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeOttawaAnkleRules(s.data);
	const decisionKey: DashboardRow['decisionKey'] =
		g.ankleXrayIndicated && g.footXrayIndicated
			? 'both'
			: g.ankleXrayIndicated
				? 'ankle'
				: g.footXrayIndicated
					? 'foot'
					: 'neither';
	return {
		id: s.id,
		patientIdentifier: s.data.identification.patientIdentifier,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		careSetting: s.data.context.careSetting,
		ankleXray: g.ankleXrayIndicated,
		footXray: g.footXrayIndicated,
		decisionKey,
		flagCount: g.flaggedIssues.length
	};
});
