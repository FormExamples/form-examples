import type { EligibilityResult, EligibleConditionCode, Fp92aApplication, Outcome } from '#lib/engine/types.js';
import { evaluateFp92a } from '#lib/engine/fp92a-validator.js';
import { createDefaultApplication } from '#lib/stores/application.svelte.js';

/** A sample FP92A application: an identifier and the full data the engine grades. */
export interface SampleApplication {
	id: string;
	patientName: string;
	completionDate: string;
	data: Fp92aApplication;
}

/** A row in the practitioner dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientName: string;
	practitionerName: string;
	completionDate: string;
	conditionCount: number;
	outcome: Outcome;
	validUntil: string;
	flagCount: number;
}

/** Set the per-code qualifying-condition row in place (mutates `data`). */
function selectCondition(
	data: Fp92aApplication,
	code: EligibleConditionCode,
	overrides: Partial<Fp92aApplication['qualifyingConditions'][number]>
) {
	const c = data.qualifyingConditions.find((q) => q.code === code);
	if (c) Object.assign(c, { selected: true }, overrides);
}

/** Eligible: myxoedema on thyroid-hormone replacement, fully attested. */
function eligibleMyxoedema(): Fp92aApplication {
	const d = createDefaultApplication();
	d.practitioner = {
		...d.practitioner,
		name: 'Dr A. Stevens',
		role: 'gp',
		registrationBody: 'GMC',
		registrationNumber: '1234567',
		practiceName: 'Riverside Surgery',
		completionDate: '2026-05-10'
	};
	d.patient = {
		...d.patient,
		title: 'Mrs',
		surname: 'Hughes',
		forenames: 'Margaret',
		birthDate: '1968-03-11',
		sex: 'female',
		postalAddressAsFullText: '12 Elm Road, Leeds',
		postcode: 'LS1 4AB',
		unitedKingdomNhsNumber: '9434765919'
	};
	selectCondition(d, 'myxoedema', {
		diagnosisDate: '2015-02-01',
		onSubstitutionTherapy: 'yes',
		treatmentDetail: 'Levothyroxine 100 mcg daily'
	});
	d.declaration = {
		...d.declaration,
		practitionerSignaturePresent: 'yes',
		practitionerHasAccessToMedicalRecords: 'yes',
		signatureDate: '2026-05-10'
	};
	return d;
}

/** Eligible: epilepsy on continuous anticonvulsant plus insulin-treated diabetes. */
function eligibleMultiCondition(): Fp92aApplication {
	const d = createDefaultApplication();
	d.practitioner = {
		...d.practitioner,
		name: 'Dr R. Okafor',
		role: 'hospital-doctor',
		registrationBody: 'GMC',
		registrationNumber: '7654321',
		practiceName: 'St Mary Hospital',
		completionDate: '2026-05-22'
	};
	d.patient = {
		...d.patient,
		title: 'Mr',
		surname: "O'Connor",
		forenames: 'Sean',
		birthDate: '1980-05-18',
		sex: 'male',
		postalAddressAsFullText: '5 Oak Lane, Manchester',
		postcode: 'M1 2CD',
		unitedKingdomNhsNumber: '6671130099'
	};
	selectCondition(d, 'epilepsy-on-anticonvulsant', {
		diagnosisDate: '2010-09-01',
		continuousAnticonvulsantTherapy: 'yes',
		anticonvulsant: 'Lamotrigine 200 mg'
	});
	selectCondition(d, 'diabetes-mellitus-not-diet-only', {
		diagnosisDate: '2018-01-01',
		diabetesTreatmentMode: 'insulin'
	});
	d.declaration = {
		...d.declaration,
		practitionerSignaturePresent: 'yes',
		practitionerHasAccessToMedicalRecords: 'yes',
		signatureDate: '2026-05-22'
	};
	return d;
}

/** Ineligible: diabetes treated by diet alone (excluded variant). */
function ineligibleDietOnly(): Fp92aApplication {
	const d = createDefaultApplication();
	d.practitioner = {
		...d.practitioner,
		name: 'Dr R. Okafor',
		role: 'gp',
		registrationBody: 'GMC',
		registrationNumber: '7654321',
		practiceName: 'Parkview Practice',
		completionDate: '2026-06-01'
	};
	d.patient = {
		...d.patient,
		title: 'Ms',
		surname: 'Khan',
		forenames: 'Aisha',
		birthDate: '1990-12-01',
		sex: 'female',
		postalAddressAsFullText: '9 Birch Street, Birmingham',
		postcode: 'B1 5EF',
		unitedKingdomNhsNumber: '5012347782'
	};
	selectCondition(d, 'diabetes-mellitus-not-diet-only', {
		diagnosisDate: '2024-03-01',
		diabetesTreatmentMode: 'diet-only'
	});
	d.declaration = {
		...d.declaration,
		practitionerSignaturePresent: 'yes',
		practitionerHasAccessToMedicalRecords: 'yes',
		signatureDate: '2026-06-01'
	};
	return d;
}

/** Requires clarification: cancer declared with histology still pending. */
function requiresClarificationCancer(): Fp92aApplication {
	const d = createDefaultApplication();
	d.practitioner = {
		...d.practitioner,
		name: 'Dr P. Lin',
		role: 'hospital-doctor',
		registrationBody: 'GMC',
		registrationNumber: '2468013',
		practiceName: 'City Oncology Centre',
		completionDate: '2026-06-12'
	};
	d.patient = {
		...d.patient,
		title: 'Mrs',
		surname: 'Davies',
		forenames: 'Eleanor',
		birthDate: '1972-08-30',
		sex: 'female',
		postalAddressAsFullText: '21 Maple Close, Cardiff',
		postcode: 'CF1 7GH',
		unitedKingdomNhsNumber: '2105584476'
	};
	selectCondition(d, 'cancer-or-effects', {
		diagnosisDate: '2026-05-20',
		cancerSite: 'Breast',
		cancerTreatmentPhase: 'active-treatment',
		histologyConfirmed: 'pending'
	});
	d.declaration = {
		...d.declaration,
		practitionerSignaturePresent: 'yes',
		practitionerHasAccessToMedicalRecords: 'yes',
		signatureDate: '2026-06-12'
	};
	return d;
}

/** The sample applications, keyed by stable id (used to seed the wizard). */
export const sampleApplications: SampleApplication[] = [
	{ id: 'UME-2026-0001', patientName: 'Hughes, Margaret', completionDate: '2026-05-10', data: eligibleMyxoedema() },
	{ id: 'UME-2026-0002', patientName: "O'Connor, Sean", completionDate: '2026-05-22', data: eligibleMultiCondition() },
	{ id: 'UME-2026-0003', patientName: 'Khan, Aisha', completionDate: '2026-06-01', data: ineligibleDietOnly() },
	{ id: 'UME-2026-0004', patientName: 'Davies, Eleanor', completionDate: '2026-06-12', data: requiresClarificationCancer() }
];

/** Eligibility result for each sample, keyed by id (used by the wizard / report). */
export const sampleResults: Record<string, EligibilityResult> = Object.fromEntries(
	sampleApplications.map((s) => [s.id, evaluateFp92a(s.data)])
);

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleApplicationRows: DashboardRow[] = sampleApplications.map((s) => {
	const r = evaluateFp92a(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		practitionerName: s.data.practitioner.name,
		completionDate: s.completionDate,
		conditionCount: r.eligibleConditions.length,
		outcome: r.outcome,
		validUntil: r.validUntil,
		flagCount: r.additionalFlags.length
	};
});
