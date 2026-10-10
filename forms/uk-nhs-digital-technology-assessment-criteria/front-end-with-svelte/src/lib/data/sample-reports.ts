import type { DtacAssessment, Outcome } from '#lib/engine/types.js';
import { createDefaultAssessment } from '#lib/engine/defaults.js';
import { calculateGrade } from '#lib/engine/grader.js';
import { CRITERIA } from '#lib/engine/criteria.js';

export interface SampleAssessment {
	id: string;
	data: DtacAssessment;
}

export interface DashboardRow {
	id: string;
	supplier: string;
	product: string;
	assessedDate: string;
	outcome: Outcome;
	outcomeLabel: string;
	mandatoryMet: string;
	flagCount: number;
}

function base(supplier: string, product: string, date: string, deviceClass: string): DtacAssessment {
	const d = createDefaultAssessment();
	d.supplier.name = supplier;
	d.product.name = product;
	d.product.medicalDeviceClass = deviceClass;
	d.product.handlesPatientData = 'yes';
	d.assessor.name = 'Alex Assessor';
	d.assessment.assessmentDate = date;
	d.assessment.dtacVersion = 'DTAC (example)';
	return d;
}

function allMet(d: DtacAssessment): DtacAssessment {
	for (const c of CRITERIA) d.criteria[c.id] = 'met';
	return d;
}

function passing(): DtacAssessment {
	const d = allMet(base('Example Health Ltd', 'Example Care App', '2026-09-01', 'class-i'));
	d.assessment.reviewDueDate = '2027-09-01';
	return d;
}

function conditional(): DtacAssessment {
	const d = allMet(base('Northern Digital Ltd', 'Triage Assistant', '2026-08-12', 'class-iia'));
	d.criteria.d2 = 'partially-met';
	d.assessment.reviewDueDate = '2027-02-12';
	return d;
}

function failing(): DtacAssessment {
	const d = allMet(base('Quickbuild Apps Ltd', 'Symptom Checker', '2026-07-20', 'class-i'));
	d.criteria.e2 = 'not-met';
	d.criteria.e5 = 'not-met';
	d.criteria.g2 = 'not-met';
	return d;
}

function incomplete(): DtacAssessment {
	const d = base('Newco Health Ltd', 'Pathway Tracker', '2026-09-30', 'unknown');
	for (const c of CRITERIA.slice(0, 20)) d.criteria[c.id] = 'met';
	return d;
}

export const sampleAssessments: SampleAssessment[] = [
	{ id: 'dtac-001', data: passing() },
	{ id: 'dtac-002', data: conditional() },
	{ id: 'dtac-003', data: failing() },
	{ id: 'dtac-004', data: incomplete() }
];

export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map(({ id, data }) => {
	const r = calculateGrade(data);
	return {
		id,
		supplier: data.supplier.name,
		product: data.product.name,
		assessedDate: data.assessment.assessmentDate ?? '',
		outcome: r.outcome,
		outcomeLabel: r.outcomeLabel,
		mandatoryMet: `${r.mandatoryMet}/${r.mandatoryTotal}`,
		flagCount: r.flags.length
	};
});
