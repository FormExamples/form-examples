import type { PanelField, PanelsSection, PrimaryIndication } from './types';

/**
 * A single orderable blood-test panel. `field` is the camelCase boolean
 * property on the `panels` section (matches the SQL boolean columns); `label`
 * is the human-readable name; `critical` marks panels that escalate triage to
 * stat; `fasting` marks panels best collected fasting.
 */
export interface PanelDescriptor {
	field: PanelField;
	label: string;
	critical?: boolean;
	fasting?: boolean;
}

/** Canonical catalogue of the orderable blood-test panels. */
export const PANELS: PanelDescriptor[] = [
	{ field: 'fullBloodCount', label: 'Full blood count (FBC)' },
	{ field: 'ureaElectrolytes', label: 'Urea & electrolytes (U&E)' },
	{ field: 'liverFunction', label: 'Liver function (LFT)' },
	{ field: 'thyroidFunction', label: 'Thyroid function (TFT)' },
	{ field: 'hba1c', label: 'HbA1c (diagnostic)' },
	{ field: 'lipidProfile', label: 'Lipid profile', fasting: true },
	{ field: 'cReactiveProtein', label: 'C-reactive protein (CRP)' },
	{ field: 'coagulationScreen', label: 'Coagulation screen (PT / APTT)' },
	{ field: 'boneProfile', label: 'Bone profile' },
	{ field: 'ferritinIron', label: 'Ferritin / iron studies' },
	{ field: 'vitaminB12Folate', label: 'Vitamin B12 & folate' },
	{ field: 'vitaminD', label: 'Vitamin D (25-OH)' },
	{ field: 'hba1cMonitoring', label: 'HbA1c monitoring' },
	{ field: 'glucose', label: 'Glucose', fasting: true },
	{ field: 'inr', label: 'INR' },
	{ field: 'bloodCulture', label: 'Blood culture', critical: true },
	{ field: 'groupAndSave', label: 'Group & save' },
	{ field: 'crossmatch', label: 'Crossmatch', critical: true },
	{ field: 'troponin', label: 'Troponin', critical: true },
	{ field: 'dDimer', label: 'D-dimer', critical: true },
	{ field: 'amylaseLipase', label: 'Amylase / lipase' }
];

/** The panel fields that escalate triage to stat when selected. */
export const CRITICAL_PANELS: PanelField[] = PANELS.filter((p) => p.critical).map((p) => p.field);

/** Count the number of selected (true) panels. */
export function countSelectedPanels(panels: PanelsSection): number {
	let n = 0;
	for (const p of PANELS) if (panels[p.field]) n++;
	return n;
}

/** Return the panel descriptors that are currently selected. */
export function selectedPanels(panels: PanelsSection): PanelDescriptor[] {
	return PANELS.filter((p) => panels[p.field]);
}

/**
 * Map of indication → recommended (`ideal`) and plausible (`plausible`) panels.
 * Anchors the appropriateness axis on RCPath retesting-interval / indication
 * match.
 */
export const INDICATION_PANEL_MAP: Partial<
	Record<PrimaryIndication, { ideal: PanelField[]; plausible: PanelField[] }>
> = {
	'routine-monitoring': {
		ideal: ['fullBloodCount', 'ureaElectrolytes', 'liverFunction'],
		plausible: ['thyroidFunction', 'boneProfile', 'lipidProfile']
	},
	anaemia: {
		ideal: ['fullBloodCount', 'ferritinIron'],
		plausible: ['vitaminB12Folate', 'ureaElectrolytes', 'liverFunction']
	},
	fatigue: {
		ideal: ['fullBloodCount', 'thyroidFunction', 'ferritinIron'],
		plausible: ['ureaElectrolytes', 'liverFunction', 'vitaminB12Folate', 'vitaminD', 'hba1c']
	},
	infection: {
		ideal: ['fullBloodCount', 'cReactiveProtein'],
		plausible: ['bloodCulture', 'ureaElectrolytes', 'liverFunction']
	},
	'diabetes-monitoring': {
		ideal: ['hba1cMonitoring', 'hba1c'],
		plausible: ['glucose', 'ureaElectrolytes', 'lipidProfile']
	},
	'thyroid-symptoms': {
		ideal: ['thyroidFunction'],
		plausible: ['fullBloodCount', 'ferritinIron']
	},
	'cardiovascular-risk': {
		ideal: ['lipidProfile'],
		plausible: ['hba1c', 'ureaElectrolytes', 'glucose']
	},
	'liver-disease': {
		ideal: ['liverFunction'],
		plausible: ['fullBloodCount', 'coagulationScreen', 'ureaElectrolytes']
	},
	'renal-monitoring': {
		ideal: ['ureaElectrolytes'],
		plausible: ['fullBloodCount', 'boneProfile', 'cReactiveProtein']
	},
	'anticoagulation-monitoring': {
		ideal: ['inr', 'coagulationScreen'],
		plausible: ['fullBloodCount', 'liverFunction']
	},
	'pre-operative': {
		ideal: ['fullBloodCount', 'ureaElectrolytes', 'coagulationScreen', 'groupAndSave'],
		plausible: ['liverFunction', 'crossmatch', 'hba1c']
	},
	'suspected-malignancy': {
		ideal: ['fullBloodCount', 'liverFunction', 'ureaElectrolytes'],
		plausible: ['boneProfile', 'cReactiveProtein', 'ferritinIron']
	},
	other: { ideal: [], plausible: [] }
};
