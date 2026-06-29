// Defaults, the orderable-test catalogue, and small data helpers for the
// Coagulation Test Request engine. `createDefaultRequest()` is the single
// source of truth for a blank request; it is re-exported from the store so
// consumers can import it from either place.

import type {
	CoagulationTestRequest,
	TestsSection,
	TestField,
	PrimaryIndication
} from './types';

/**
 * Canonical list of the orderable coagulation tests. The `field` is the
 * camelCase property on the `tests` section (matches the SQL boolean column
 * names); `label` is the human-readable name; `hint` is a short typical-use
 * note shown beside the checkbox.
 */
export const TESTS: { field: TestField; label: string; hint: string }[] = [
	{ field: 'prothrombinTimeInr', label: 'Prothrombin time / INR', hint: 'Warfarin monitoring; liver disease; DIC; pre-op screen' },
	{ field: 'activatedPartialThromboplastinTime', label: 'Activated partial thromboplastin time (APTT)', hint: 'Heparin monitoring; unexplained bleeding; lupus anticoagulant' },
	{ field: 'fibrinogen', label: 'Fibrinogen (Clauss)', hint: 'DIC; major haemorrhage; liver disease' },
	{ field: 'dDimer', label: 'D-dimer', hint: 'Suspected DVT / PE with unlikely Wells; DIC' },
	{ field: 'thrombophiliaScreen', label: 'Thrombophilia screen', hint: 'Selected unprovoked VTE where result changes management' },
	{ field: 'factorAssays', label: 'Factor assays', hint: 'Investigation of a confirmed bleeding disorder' },
	{ field: 'antiXaAssay', label: 'Anti-Xa assay', hint: 'LMWH / DOAC level (renal impairment, weight extremes, pregnancy)' },
	{ field: 'mixingStudies', label: 'Mixing studies', hint: 'Work-up of an unexplained prolonged PT / APTT' },
	{ field: 'vonWillebrandScreen', label: 'Von Willebrand screen', hint: 'Suspected vWD; mucocutaneous bleeding' }
];

/**
 * Build a fresh, fully-blank coagulation test request. Strings default to '',
 * boolean test / history fields default to false; there are no numeric fields.
 */
export function createDefaultRequest(): CoagulationTestRequest {
	const tests = {} as TestsSection;
	for (const t of TESTS) tests[t.field] = false;
	return {
		clinician: {
			clinicianName: '',
			clinicianRole: '',
			registrationBody: '',
			registrationNumber: '',
			requesterContact: '',
			supervisingConsultant: '',
			siteName: '',
			referralDate: ''
		},
		patient: {
			firstName: '',
			lastName: '',
			dateOfBirth: '',
			nhsNumber: ''
		},
		tests,
		clinical: {
			primaryIndication: '',
			clinicalDetails: '',
			onAnticoagulant: false,
			anticoagulantAgent: '',
			bleedingHistory: false,
			thrombosisHistory: false,
			activeBleeding: false,
			suspectedDic: false,
			wellsUnlikely: false
		},
		specimen: {
			specimenCollected: '',
			collectionDatetime: '',
			citrateTubeFill: '',
			citrateRatioCorrect: ''
		},
		triage: {
			urgency: '',
			requestedByDate: '',
			siteName: '',
			setting: '',
			notes: ''
		}
	};
}

/** Count how many coagulation tests are selected. */
export function countSelectedTests(tests: TestsSection): number {
	let n = 0;
	for (const t of TESTS) if (tests[t.field] === true) n++;
	return n;
}

/** List the human-readable labels of the selected tests. */
export function selectedTestLabels(tests: TestsSection): string[] {
	return TESTS.filter((t) => tests[t.field] === true).map((t) => t.label);
}

/** Pretty label for a primary indication. */
const INDICATION_LABELS: Record<string, string> = {
	'anticoagulation-monitoring': 'Anticoagulation monitoring',
	'bleeding-disorder': 'Bleeding disorder',
	'suspected-dvt-pe': 'Suspected DVT / PE',
	'pre-operative': 'Pre-operative',
	'thrombophilia-investigation': 'Thrombophilia investigation',
	'liver-disease': 'Liver disease',
	'disseminated-intravascular-coagulation': 'Disseminated intravascular coagulation',
	'abnormal-bleeding': 'Abnormal bleeding',
	other: 'Other'
};

/** Human-readable label for an indication, falling back to the raw value. */
export function indicationLabel(value: PrimaryIndication | string): string {
	return INDICATION_LABELS[value] || value || '';
}
