import type { AgileConsultingScorecardAssessment, Band } from '$lib/engine/types';
import { gradeScorecard } from '$lib/engine/score-grader';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

/** A sample scorecard: an identifier plus the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	organizationName: string;
	respondentName: string;
	assessmentDate: string;
	data: AgileConsultingScorecardAssessment;
}

/** A row in the reviewer dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	organizationName: string;
	sector: string;
	respondentName: string;
	assessmentDate: string;
	scoreTotal: number;
	manifestoSubtotal: number;
	principlesSubtotal: number;
	computedBand: Band;
	flagCount: number;
}

type Yes = true;
type No = false;

/** Set the sixteen checklist answers from compact yes/no strings. */
function answers(
	d: AgileConsultingScorecardAssessment,
	manifesto: (Yes | No)[],
	principles: (Yes | No)[],
) {
	const mKeys = ['m1', 'm2', 'm3', 'm4'] as const;
	mKeys.forEach((k, i) => (d.manifesto[k].done = manifesto[i] ?? null));
	const pKeys = [
		'p1', 'p2', 'p3', 'p4', 'p5', 'p6',
		'p7', 'p8', 'p9', 'p10', 'p11', 'p12',
	] as const;
	pKeys.forEach((k, i) => (d.principles[k].done = principles[i] ?? null));
}

/** High readiness — almost everything ticked. */
function highReadiness(): AgileConsultingScorecardAssessment {
	const d = createDefaultAssessment();
	d.organization = { ...d.organization, organizationName: 'NHS Acute Trust', legalName: 'NHS Acute Trust', sector: 'healthcare', sizeBand: 'enterprise', country: 'United Kingdom', region: 'London' };
	d.respondent = { ...d.respondent, respondentName: 'Asha Patel', respondentEmail: 'asha.patel@example.org', role: 'head-of-delivery', seniority: 'senior-leader' };
	d.assessment = { assessmentDate: '2026-04-12', status: 'submitted' };
	answers(
		d,
		[true, true, true, true],
		[true, true, true, true, true, true, true, false, true, true, true, true],
	);
	d.principles.p8.evidence = 'Budget secured for 9 months only.';
	return d;
}

/** Medium readiness — a solid base with several gaps. */
function mediumReadiness(): AgileConsultingScorecardAssessment {
	const d = createDefaultAssessment();
	d.organization = { ...d.organization, organizationName: 'Pharos Pharma', legalName: 'Pharos Pharmaceuticals Ltd', sector: 'pharmaceuticals', sizeBand: 'enterprise', country: 'Ireland', region: 'Dublin' };
	d.respondent = { ...d.respondent, respondentName: 'Chiara Rossi', respondentEmail: 'chiara.rossi@example.org', role: 'transformation-lead', seniority: 'senior-leader' };
	d.assessment = { assessmentDate: '2026-04-18', status: 'submitted' };
	answers(
		d,
		[true, false, true, true],
		[false, true, true, false, true, false, true, true, false, true, false, false],
	);
	d.principles.p1.evidence = 'No NPS instrument in place yet.';
	return d;
}

/** Borderline readiness — exactly on the band boundary (total 5). */
function borderlineReadiness(): AgileConsultingScorecardAssessment {
	const d = createDefaultAssessment();
	d.organization = { ...d.organization, organizationName: 'Mainline Retail', legalName: 'Mainline Retail PLC', sector: 'retail', sizeBand: 'enterprise', country: 'United Kingdom', region: 'Manchester' };
	d.respondent = { ...d.respondent, respondentName: 'Grace Hofstadter', respondentEmail: 'grace.h@example.org', role: 'programme-manager', seniority: 'middle-manager' };
	d.assessment = { assessmentDate: '2026-04-24', status: 'in-progress' };
	answers(
		d,
		[true, true, false, false],
		[false, true, false, false, true, false, false, false, false, false, false, false],
	);
	return d;
}

/** Low readiness — almost nothing in place; several high-priority flags. */
function lowReadiness(): AgileConsultingScorecardAssessment {
	const d = createDefaultAssessment();
	d.organization = { ...d.organization, organizationName: 'Lyceum School', legalName: 'Lyceum School Trust', sector: 'education', sizeBand: 'small', country: 'United Kingdom', region: 'Cardiff' };
	d.respondent = { ...d.respondent, respondentName: 'Joon Park', respondentEmail: 'joon.park@example.org', role: 'director', seniority: 'senior-leader' };
	d.assessment = { assessmentDate: '2026-04-27', status: 'draft' };
	answers(
		d,
		[false, false, false, false],
		[false, true, false, false, false, false, false, false, false, false, false, false],
	);
	d.manifesto.m4.evidence = 'No senior leader has read an agile change-management book.';
	return d;
}

/** The sample scorecards, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'ACS-2026-0001', organizationName: 'NHS Acute Trust', respondentName: 'Asha Patel', assessmentDate: '2026-04-12', data: highReadiness() },
	{ id: 'ACS-2026-0002', organizationName: 'Pharos Pharma', respondentName: 'Chiara Rossi', assessmentDate: '2026-04-18', data: mediumReadiness() },
	{ id: 'ACS-2026-0003', organizationName: 'Mainline Retail', respondentName: 'Grace Hofstadter', assessmentDate: '2026-04-24', data: borderlineReadiness() },
	{ id: 'ACS-2026-0004', organizationName: 'Lyceum School', respondentName: 'Joon Park', assessmentDate: '2026-04-27', data: lowReadiness() },
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeScorecard(s.data);
	return {
		id: s.id,
		organizationName: s.organizationName,
		sector: s.data.organization.sector || '—',
		respondentName: s.respondentName,
		assessmentDate: s.assessmentDate,
		scoreTotal: g.scoreTotal,
		manifestoSubtotal: g.manifestoSubtotal,
		principlesSubtotal: g.principlesSubtotal,
		computedBand: g.computedBand,
		flagCount: g.additionalFlags.length,
	};
});
