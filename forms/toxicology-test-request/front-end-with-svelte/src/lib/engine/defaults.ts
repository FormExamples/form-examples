import type { ToxicologyRequest, AssayDef, AssayField } from './types';

/**
 * Canonical list of the orderable toxicology assays. `field` is the camelCase
 * property on the `assays` section (matches the SQL boolean column names);
 * `label` is the human-readable name; `note` is an optional clinical hint;
 * `critical` marks assays whose timing or context drives safety flags.
 */
export const ASSAYS: AssayDef[] = [
	{ field: 'paracetamolLevel', label: 'Paracetamol level', note: 'Nomogram ≥ 4 h', critical: true },
	{ field: 'salicylateLevel', label: 'Salicylate level', note: 'Aspirin; serial levels' },
	{ field: 'alcoholLevel', label: 'Alcohol level', note: 'Blood ethanol' },
	{
		field: 'drugsOfAbuseScreen',
		label: 'Drugs-of-abuse screen',
		note: 'Opiates, benzodiazepines, cocaine, amphetamines'
	},
	{ field: 'lithiumLevel', label: 'Lithium level', note: 'TDM and toxicity' },
	{ field: 'digoxinLevel', label: 'Digoxin level', note: 'TDM and toxicity' },
	{
		field: 'antiepilepticDrugLevel',
		label: 'Antiepileptic drug level',
		note: 'Phenytoin, carbamazepine, valproate'
	},
	{ field: 'carboxyhaemoglobin', label: 'Carboxyhaemoglobin', note: 'Carbon-monoxide exposure' },
	{ field: 'heavyMetals', label: 'Heavy metals', note: 'Lead, mercury, arsenic' },
	{ field: 'specificDrugLevel', label: 'Specific drug level', note: 'Named agent in suspected agent' }
];

/** The assay field keys, in catalogue order. */
export const ASSAY_FIELDS: AssayField[] = ASSAYS.map((a) => a.field);

/**
 * Build a fresh, fully-blank toxicology request. Strings default to ''; numeric
 * / date / time fields default to null; boolean assay / context fields default
 * to false.
 */
export function createDefaultRequest(): ToxicologyRequest {
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
		assays: {
			paracetamolLevel: false,
			salicylateLevel: false,
			alcoholLevel: false,
			drugsOfAbuseScreen: false,
			lithiumLevel: false,
			digoxinLevel: false,
			antiepilepticDrugLevel: false,
			carboxyhaemoglobin: false,
			heavyMetals: false,
			specificDrugLevel: false
		},
		clinical: {
			primaryIndication: '',
			clinicalDetails: '',
			suspectedAgent: '',
			timeSinceIngestionHours: null,
			deliberateOverdose: false,
			symptomatic: false
		},
		specimen: {
			specimenCollected: '',
			collectionDatetime: ''
		},
		triage: {
			urgency: '',
			requestedByDate: '',
			setting: '',
			notes: ''
		}
	};
}
