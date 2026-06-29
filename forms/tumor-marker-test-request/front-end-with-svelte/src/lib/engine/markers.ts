// ──────────────────────────────────────────────
// Tumor Marker Test Request — marker catalogue and label helpers
//
// The ten serum tumour markers (modelled as BOOLEAN fields, mirroring the
// BOOLEAN columns in SQL migration 04) plus the indication labels. Ported
// verbatim from the HTML front-end's js/types.js so rule / flag IDs and
// marker-to-indication semantics stay identical across every front-end and the
// back-end.
// ──────────────────────────────────────────────

import type { Markers, MarkerField, Indication } from './types';

/** A single serum tumour marker: state field, label, and established use. */
export interface MarkerInfo {
	field: MarkerField;
	label: string;
	use: string;
}

/**
 * The ten serum tumour markers, in display order. Each entry carries the
 * camelCase state field name, a short label, and the established appropriate
 * use (per the index.md marker-to-indication table).
 */
export const MARKERS: MarkerInfo[] = [
	{ field: 'psa', label: 'PSA', use: 'Prostate cancer (informed-choice; not screening)' },
	{ field: 'ca125', label: 'CA125', use: 'Suspected ovarian cancer (NICE CG122 / NG12)' },
	{ field: 'ca19_9', label: 'CA19-9', use: 'Pancreatic / hepatobiliary cancer' },
	{ field: 'carcinoembryonicAntigenCea', label: 'CEA', use: 'Colorectal cancer monitoring / recurrence' },
	{ field: 'alphaFetoproteinAfp', label: 'AFP', use: 'Hepatocellular carcinoma; germ-cell tumours' },
	{ field: 'betaHcg', label: 'beta-hCG', use: 'Germ-cell / trophoblastic tumours' },
	{ field: 'ca15_3', label: 'CA15-3', use: 'Breast cancer monitoring' },
	{ field: 'lactateDehydrogenaseLdh', label: 'LDH', use: 'Germ-cell staging; lymphoma prognosis' },
	{ field: 'calcitonin', label: 'Calcitonin', use: 'Medullary thyroid carcinoma' },
	{ field: 'chromograninA', label: 'Chromogranin A', use: 'Neuroendocrine tumours' }
];

/** Pretty label keyed by tumour-marker state field. */
const MARKER_LABELS: Record<string, string> = MARKERS.reduce(
	(acc, m) => {
		acc[m.field] = m.label;
		return acc;
	},
	{} as Record<string, string>
);

/** Human-readable label for a marker field, falling back to the raw value. */
export function markerLabel(field: string): string {
	return MARKER_LABELS[field] || field || '';
}

/** Count how many markers are currently selected (true). */
export function countSelectedMarkers(markers: Markers | undefined): number {
	if (!markers) return 0;
	return MARKERS.reduce((n, m) => n + (markers[m.field] === true ? 1 : 0), 0);
}

/** Return the list of selected marker field names, in display order. */
export function selectedMarkerFields(markers: Markers | undefined): MarkerField[] {
	if (!markers) return [];
	return MARKERS.filter((m) => markers[m.field] === true).map((m) => m.field);
}

/** Pretty label for an indication value. */
const INDICATION_LABELS: Record<string, string> = {
	'suspected-malignancy': 'Suspected malignancy',
	'cancer-monitoring': 'Cancer monitoring',
	'treatment-response': 'Treatment response',
	'recurrence-surveillance': 'Recurrence surveillance',
	'screening-high-risk': 'Screening (high-risk)',
	'characterise-mass': 'Characterise mass',
	other: 'Other'
};

/** Human-readable label for an indication, falling back to the raw value. */
export function indicationLabel(value: Indication | string): string {
	return INDICATION_LABELS[value] || value || '';
}
