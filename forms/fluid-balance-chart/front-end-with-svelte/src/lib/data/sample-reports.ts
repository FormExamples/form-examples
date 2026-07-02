import type { ChartData, FluidStatus } from '$lib/engine/types';
import { calculateGrade } from '$lib/engine/fluid-balance-grader';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

/** A sample chart: an identifier, a display name, and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	data: ChartData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientIdentifier: string;
	patientName: string;
	wardOrUnit: string;
	totalIntakeMl: number;
	totalOutputMl: number;
	netBalanceMl: number;
	urineOutputRateMlPerKgPerHour: number | null;
	fluidStatus: FluidStatus;
	chartStartAt: string;
}

/** Sample 1 — a balanced 24-hour chart: net +150 mL, urine rate ~1.0 mL/kg/h. */
function balanced(): ChartData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Sam Okonkwo',
		clinicianRole: 'nurse',
		patientIdentifier: 'AMU-4B-12',
		wardOrUnit: 'Acute Medical Unit',
		chartStartAt: '2026-06-22T08:00',
		chartPeriodHours: 24
	};
	d.patient = { weightKg: 70 };
	d.intake = [
		{ entryAt: '2026-06-22T08:00', category: 'oral', description: 'Water and tea', volumeMl: 1200 },
		{ entryAt: '2026-06-22T10:00', category: 'iv', description: '0.9% saline, peripheral cannula', volumeMl: 1000 },
		{ entryAt: '2026-06-22T14:00', category: 'enteral', description: 'NG feed', volumeMl: 200 }
	];
	d.output = [
		{ entryAt: '2026-06-22T12:00', category: 'urine', description: 'Urinary catheter', volumeMl: 1680 },
		{ entryAt: '2026-06-22T16:00', category: 'drains', description: 'Abdominal drain', volumeMl: 300 },
		{ entryAt: '2026-06-22T20:00', category: 'insensible-other', description: 'Estimated insensible losses', volumeMl: 270 }
	];
	d.note = { clinicalNote: 'Stable, balanced over the charting period. Continue current regimen.' };
	return d;
}

/** Sample 2 — a positive balance: net +1500 mL over 24 h → fluid-overload flag. */
function positive(): ChartData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr Harriet Vane',
		clinicianRole: 'doctor',
		patientIdentifier: 'HDU-201',
		wardOrUnit: 'High Dependency Unit',
		chartStartAt: '2026-06-23T08:00',
		chartPeriodHours: 24
	};
	d.patient = { weightKg: 82 };
	d.intake = [
		{ entryAt: '2026-06-23T09:00', category: 'iv', description: "Hartmann's, resuscitation", volumeMl: 2600 },
		{ entryAt: '2026-06-23T12:00', category: 'oral', description: 'Oral fluids', volumeMl: 700 },
		{ entryAt: '2026-06-23T15:00', category: 'blood-products', description: '1 unit packed red cells', volumeMl: 300 }
	];
	d.output = [
		{ entryAt: '2026-06-23T11:00', category: 'urine', description: 'Urinary catheter', volumeMl: 1535 },
		{ entryAt: '2026-06-23T17:00', category: 'drains', description: 'Chest drain', volumeMl: 300 },
		{ entryAt: '2026-06-23T19:00', category: 'vomit-ng', description: 'NG aspirate', volumeMl: 265 }
	];
	d.note = { clinicalNote: 'Cumulatively positive; review for oedema and reassess prescription.' };
	return d;
}

/** Sample 3 — oliguria: urine 500 mL / 62 kg / 24 h ≈ 0.34 mL/kg/h (< 0.5). */
function oliguria(): ChartData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Irena Nowak',
		clinicianRole: 'nurse',
		patientIdentifier: 'ICU-07',
		wardOrUnit: 'Intensive Care Unit',
		chartStartAt: '2026-06-24T08:00',
		chartPeriodHours: 24
	};
	d.patient = { weightKg: 62 };
	d.intake = [
		{ entryAt: '2026-06-24T08:00', category: 'iv', description: 'Maintenance fluids', volumeMl: 1200 },
		{ entryAt: '2026-06-24T13:00', category: 'oral', description: 'Sips of water', volumeMl: 600 }
	];
	d.output = [
		{ entryAt: '2026-06-24T12:00', category: 'urine', description: 'Urinary catheter', volumeMl: 500 },
		{ entryAt: '2026-06-24T16:00', category: 'drains', description: 'Wound drain', volumeMl: 400 },
		{ entryAt: '2026-06-24T18:00', category: 'stool', description: 'Loose stool (estimated)', volumeMl: 240 }
	];
	d.note = { clinicalNote: 'Low urine output — assess for AKI; review catheter patency and perfusion.' };
	return d;
}

/** Sample 4 — a negative balance: net −1400 mL over 24 h → dehydration flag. */
function negative(): ChartData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Yusuf Ahmed',
		clinicianRole: 'healthcare-assistant',
		patientIdentifier: 'SURG-3-08',
		wardOrUnit: 'Surgical Ward 3',
		chartStartAt: '2026-06-25T08:00',
		chartPeriodHours: 24
	};
	d.patient = { weightKg: 76 };
	d.intake = [
		{ entryAt: '2026-06-25T09:00', category: 'oral', description: 'Oral fluids', volumeMl: 900 },
		{ entryAt: '2026-06-25T14:00', category: 'iv', description: 'Maintenance fluids', volumeMl: 600 }
	];
	d.output = [
		{ entryAt: '2026-06-25T11:00', category: 'urine', description: 'Urinary catheter', volumeMl: 1730 },
		{ entryAt: '2026-06-25T15:00', category: 'drains', description: 'Stoma output', volumeMl: 600 },
		{ entryAt: '2026-06-25T19:00', category: 'vomit-ng', description: 'Vomiting', volumeMl: 570 }
	];
	d.note = { clinicalNote: 'Net negative with ongoing losses — consider replacement and investigate.' };
	return d;
}

/** The sample charts, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'FBC-2026-0001', patientName: 'Okafor, Beatrice', data: balanced() },
	{ id: 'FBC-2026-0002', patientName: 'Whitfield, Harold', data: positive() },
	{ id: 'FBC-2026-0003', patientName: 'Nowak, Irena', data: oliguria() },
	{ id: 'FBC-2026-0004', patientName: 'Ahmed, Yusuf', data: negative() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateGrade(s.data);
	return {
		id: s.id,
		patientIdentifier: s.data.context.patientIdentifier,
		patientName: s.patientName,
		wardOrUnit: s.data.context.wardOrUnit,
		totalIntakeMl: g.totalIntakeMl,
		totalOutputMl: g.totalOutputMl,
		netBalanceMl: g.netBalanceMl,
		urineOutputRateMlPerKgPerHour: g.urineOutputRateMlPerKgPerHour,
		fluidStatus: g.fluidStatus,
		chartStartAt: s.data.context.chartStartAt
	};
});
