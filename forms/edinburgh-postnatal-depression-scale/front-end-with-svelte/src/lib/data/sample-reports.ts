import type { AssessmentData, Band, CareSetting } from '$lib/engine/types';
import { calculateEpdsGrade } from '$lib/engine/epds-grader';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

/** A sample assessment: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	respondentName: string;
	assessedDate: string;
	data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	respondentIdentifier: string;
	respondentName: string;
	assessedDate: string;
	careSetting: CareSetting;
	totalScore: number;
	band: Band;
	selfHarmFlag: boolean;
	flagCount: number;
}

/**
 * Item values below are RAW printed-option indices 0..3 (top to bottom), which
 * the engine reverse-corrects for items 3, 5, 6, 7, 8, 9 and 10.
 */

/** Lower band (total 3) — mostly least-symptomatic answers, item 10 "Never". */
function lowerBand(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'HV J. Ahmed',
		clinicianRole: 'health-visitor',
		careSetting: 'community',
		assessedAt: '2026-06-10T10:15',
		perinatalStage: 'postnatal',
		perinatalWeek: 8
	};
	d.identification = {
		respondentIdentifier: 'HV-2041',
		ageBand: '30-39',
		preferredLanguage: 'English',
		assistanceNeeded: 'none'
	};
	d.items = {
		item1: 0,
		item2: 1, // normal → 1
		item3: 3, // reverse → 0
		item4: 1, // normal → 1
		item5: 3, // reverse → 0
		item6: 2, // reverse → 1
		item7: 3, // reverse → 0
		item8: 3, // reverse → 0
		item9: 3, // reverse → 0
		item10: 3 // reverse → 0 ("Never")
	};
	d.note.clinicalNote = 'Coping well at 8 weeks postnatal; routine follow-up.';
	return d;
}

/** Possible band (total 11) — sensitive threshold, item 10 "Never". */
function possibleBand(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Midwife P. Reyes',
		clinicianRole: 'midwife',
		careSetting: 'maternity',
		assessedAt: '2026-06-12T14:40',
		perinatalStage: 'antenatal',
		perinatalWeek: 28
	};
	d.identification = {
		respondentIdentifier: 'MAT-100482',
		ageBand: '20-29',
		preferredLanguage: 'English',
		assistanceNeeded: 'none'
	};
	d.items = {
		item1: 2, // normal → 2
		item2: 2, // normal → 2
		item3: 2, // reverse → 1
		item4: 2, // normal → 2
		item5: 2, // reverse → 1
		item6: 2, // reverse → 1
		item7: 2, // reverse → 1
		item8: 3, // reverse → 0
		item9: 2, // reverse → 1
		item10: 3 // reverse → 0 ("Never")
	};
	d.note.clinicalNote = 'Borderline score; repeat EPDS in 2-4 weeks.';
	return d;
}

/** Likely band (total 18) — specific threshold, item 10 "Never". */
function likelyBand(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr L. Osei',
		clinicianRole: 'gp',
		careSetting: 'general-practice',
		assessedAt: '2026-06-15T09:05',
		perinatalStage: 'postnatal',
		perinatalWeek: 12
	};
	d.identification = {
		respondentIdentifier: 'GP-100517',
		ageBand: '30-39',
		preferredLanguage: 'English',
		assistanceNeeded: 'none'
	};
	d.items = {
		item1: 3, // normal → 3
		item2: 2, // normal → 2
		item3: 1, // reverse → 2
		item4: 2, // normal → 2
		item5: 1, // reverse → 2
		item6: 1, // reverse → 2
		item7: 2, // reverse → 1
		item8: 1, // reverse → 2
		item9: 1, // reverse → 2
		item10: 3 // reverse → 0 ("Never")
	};
	d.note.clinicalNote = 'Likely depression; referred to perinatal mental-health team.';
	return d;
}

/** Self-harm case — item 10 positive; urgent flag regardless of total (total 22). */
function selfHarmCase(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'PMH-N S. Doyle',
		clinicianRole: 'perinatal-mh',
		careSetting: 'perinatal-mh',
		assessedAt: '2026-06-18T16:20',
		perinatalStage: 'postnatal',
		perinatalWeek: 6
	};
	d.identification = {
		respondentIdentifier: 'PMH-77-2211',
		ageBand: 'under-20',
		preferredLanguage: 'Polish',
		assistanceNeeded: 'interpreter'
	};
	d.items = {
		item1: 3, // normal → 3
		item2: 3, // normal → 3
		item3: 1, // reverse → 2
		item4: 3, // normal → 3
		item5: 1, // reverse → 2
		item6: 1, // reverse → 2
		item7: 2, // reverse → 1
		item8: 1, // reverse → 2
		item9: 2, // reverse → 1
		item10: 0 // reverse → 3 ("Yes, quite often") — self-harm flag
	};
	d.note.clinicalNote =
		'Positive item 10; immediate self-harm risk assessment and safeguarding actioned.';
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'EP-2026-0001', respondentName: 'Adeyemi, Grace', assessedDate: '2026-06-10', data: lowerBand() },
	{ id: 'EP-2026-0002', respondentName: 'Novak, Peter', assessedDate: '2026-06-12', data: possibleBand() },
	{ id: 'EP-2026-0003', respondentName: 'Ferreira, Ana', assessedDate: '2026-06-15', data: likelyBand() },
	{ id: 'EP-2026-0004', respondentName: 'Okonkwo, Chidi', assessedDate: '2026-06-18', data: selfHarmCase() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateEpdsGrade(s.data);
	return {
		id: s.id,
		respondentIdentifier: s.data.identification.respondentIdentifier,
		respondentName: s.respondentName,
		assessedDate: s.assessedDate,
		careSetting: s.data.context.careSetting,
		totalScore: g.totalScore,
		band: g.band,
		selfHarmFlag: g.selfHarmFlag,
		flagCount: g.flaggedIssues.length
	};
});
