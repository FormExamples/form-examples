import type {
	EligibleConditionCode,
	Fp92aApplication,
	QualifyingConditionDetail,
	ValidationRule
} from './types';
import { ageInYears, isFilled, looksLikeNhsNumber } from './utils';

/** Find the selected qualifying-condition row for a given code, if any. */
function selectedCondition(
	data: Fp92aApplication,
	code: EligibleConditionCode
): QualifyingConditionDetail | undefined {
	return data.qualifyingConditions.find((c) => c.code === code && c.selected);
}

/** Any qualifying condition selected? */
function anySelected(data: Fp92aApplication): boolean {
	return data.qualifyingConditions.some((c) => c.selected);
}

/**
 * FP92A grading rules.
 *
 * Each rule's `evaluate(data)` returns true when the rule *fires*. Rules are
 * grouped by category:
 *
 *  - `eligible-condition` — at least one qualifying condition is fully attested.
 *  - `disqualifying`      — condition selected but variant is excluded
 *                           (e.g. diet-only diabetes; temporary disability).
 *  - `redirect`           — applicant should use a different exemption route
 *                           (pregnancy → FW8; age → age exemption).
 *  - `completeness`       — required FP92A fields missing.
 *  - `renewal`            — renewal applied for outside the renewal window.
 */
export const fp92aRules: ValidationRule[] = [
	// ── Completeness ────────────────────────────────────────────
	{
		id: 'FP92A-COMP-PRACTITIONER-NAME',
		category: 'completeness',
		priority: 'high',
		description: "Practitioner's name must be provided.",
		evaluate: (d) => !isFilled(d.practitioner.name),
		message: "Practitioner's name is missing on the FP92A."
	},
	{
		id: 'FP92A-COMP-PRACTITIONER-REG',
		category: 'completeness',
		priority: 'high',
		description: 'Practitioner registration body and number must be provided.',
		evaluate: (d) =>
			d.practitioner.registrationBody === '' ||
			!isFilled(d.practitioner.registrationNumber),
		message: 'Practitioner registration body (GMC / NMC / HCPC / GPhC) and number are required.'
	},
	{
		id: 'FP92A-COMP-PRACTICE-NAME',
		category: 'completeness',
		priority: 'medium',
		description: 'Practice / surgery name must be provided.',
		evaluate: (d) => !isFilled(d.practitioner.practiceName),
		message: 'Practice / surgery name is missing.'
	},
	{
		id: 'FP92A-COMP-PRACTITIONER-COMPLETION-DATE',
		category: 'completeness',
		priority: 'medium',
		description: 'Date of completion must be provided.',
		evaluate: (d) => !isFilled(d.practitioner.completionDate),
		message: 'Date of completion is missing on the practitioner section.'
	},
	{
		id: 'FP92A-COMP-PATIENT-NAME',
		category: 'completeness',
		priority: 'high',
		description: 'Patient surname and forenames must be provided.',
		evaluate: (d) => !isFilled(d.patient.surname) || !isFilled(d.patient.forenames),
		message: 'Patient surname and forenames are required as printed on the FP92A.'
	},
	{
		id: 'FP92A-COMP-PATIENT-DOB',
		category: 'completeness',
		priority: 'high',
		description: 'Patient date of birth must be provided.',
		evaluate: (d) => !isFilled(d.patient.birthDate),
		message: 'Patient date of birth is required for age-based exemption checks.'
	},
	{
		id: 'FP92A-COMP-PATIENT-ADDRESS',
		category: 'completeness',
		priority: 'high',
		description: 'Patient postal address and postcode must be provided.',
		evaluate: (d) =>
			!isFilled(d.patient.postalAddressAsFullText) || !isFilled(d.patient.postcode),
		message: 'Patient full UK postal address and postcode are required.'
	},
	{
		id: 'FP92A-COMP-NHS-NUMBER',
		category: 'completeness',
		priority: 'high',
		description: 'Patient NHS number must be provided and 10 digits.',
		evaluate: (d) => !looksLikeNhsNumber(d.patient.unitedKingdomNhsNumber),
		message:
			'Patient NHS number is missing or not 10 digits. NHSBSA Bridge House needs the NHS number to match the patient record.'
	},
	{
		id: 'FP92A-COMP-CONDITION-SELECTED',
		category: 'completeness',
		priority: 'urgent',
		description: 'At least one qualifying condition must be selected.',
		evaluate: (d) => !anySelected(d),
		message:
			'No qualifying condition has been selected. The FP92A requires at least one of the ten NHSBSA-recognised conditions.'
	},
	{
		id: 'FP92A-COMP-SIGNATURE',
		category: 'completeness',
		priority: 'urgent',
		description: 'Practitioner signature confirmation must be present.',
		evaluate: (d) => d.declaration.practitionerSignaturePresent !== 'yes',
		message:
			'Practitioner has not confirmed the signature is present. The FP92A must be signed in ink before posting to NHSBSA.'
	},
	{
		id: 'FP92A-COMP-MEDICAL-RECORDS',
		category: 'completeness',
		priority: 'high',
		description: 'Practitioner must confirm access to the medical records.',
		evaluate: (d) => d.declaration.practitionerHasAccessToMedicalRecords !== 'yes',
		message:
			"Practitioner declaration requires confirmation of access to the patient's medical records."
	},

	// ── Eligible-condition rules (one per code) ─────────────────
	{
		id: 'FP92A-ELIG-PERMANENT-FISTULA',
		category: 'eligible-condition',
		priority: 'low',
		contributingConditionCode: 'permanent-fistula',
		description: 'Permanent fistula with appliance detail attested.',
		evaluate: (d) => {
			const c = selectedCondition(d, 'permanent-fistula');
			return !!c && c.fistulaSite !== '' && c.applianceType !== '';
		},
		message: 'Permanent fistula with continuous surgical dressing / appliance — eligible.'
	},
	{
		id: 'FP92A-ELIG-HYPOADRENALISM',
		category: 'eligible-condition',
		priority: 'low',
		contributingConditionCode: 'hypoadrenalism',
		description: 'Hypoadrenalism on substitution therapy.',
		evaluate: (d) => {
			const c = selectedCondition(d, 'hypoadrenalism');
			return !!c && c.onSubstitutionTherapy === 'yes';
		},
		message: 'Hypoadrenalism with essential substitution therapy — eligible.'
	},
	{
		id: 'FP92A-ELIG-DI-OR-HYPOPIT',
		category: 'eligible-condition',
		priority: 'low',
		contributingConditionCode: 'diabetes-insipidus-or-hypopituitarism',
		description: 'Diabetes insipidus / hypopituitarism declared.',
		evaluate: (d) => !!selectedCondition(d, 'diabetes-insipidus-or-hypopituitarism'),
		message: 'Diabetes insipidus or hypopituitarism — eligible.'
	},
	{
		id: 'FP92A-ELIG-DIABETES',
		category: 'eligible-condition',
		priority: 'low',
		contributingConditionCode: 'diabetes-mellitus-not-diet-only',
		description: 'Diabetes mellitus on insulin / oral hypoglycaemic.',
		evaluate: (d) => {
			const c = selectedCondition(d, 'diabetes-mellitus-not-diet-only');
			if (!c) return false;
			return c.diabetesTreatmentMode !== '' && c.diabetesTreatmentMode !== 'diet-only';
		},
		message: 'Diabetes mellitus treated with more than diet alone — eligible.'
	},
	{
		id: 'FP92A-ELIG-HYPOPARA',
		category: 'eligible-condition',
		priority: 'low',
		contributingConditionCode: 'hypoparathyroidism',
		description: 'Hypoparathyroidism declared.',
		evaluate: (d) => !!selectedCondition(d, 'hypoparathyroidism'),
		message: 'Hypoparathyroidism — eligible.'
	},
	{
		id: 'FP92A-ELIG-MYASTHENIA',
		category: 'eligible-condition',
		priority: 'low',
		contributingConditionCode: 'myasthenia-gravis',
		description: 'Myasthenia gravis declared.',
		evaluate: (d) => !!selectedCondition(d, 'myasthenia-gravis'),
		message: 'Myasthenia gravis — eligible.'
	},
	{
		id: 'FP92A-ELIG-MYXOEDEMA',
		category: 'eligible-condition',
		priority: 'low',
		contributingConditionCode: 'myxoedema',
		description: 'Myxoedema requiring thyroid hormone replacement.',
		evaluate: (d) => {
			const c = selectedCondition(d, 'myxoedema');
			return !!c && c.onSubstitutionTherapy === 'yes';
		},
		message: 'Myxoedema with thyroid hormone replacement — eligible.'
	},
	{
		id: 'FP92A-ELIG-EPILEPSY',
		category: 'eligible-condition',
		priority: 'low',
		contributingConditionCode: 'epilepsy-on-anticonvulsant',
		description: 'Epilepsy on continuous anticonvulsant therapy.',
		evaluate: (d) => {
			const c = selectedCondition(d, 'epilepsy-on-anticonvulsant');
			return !!c && c.continuousAnticonvulsantTherapy === 'yes';
		},
		message: 'Epilepsy on continuous anticonvulsant therapy — eligible.'
	},
	{
		id: 'FP92A-ELIG-DISABILITY',
		category: 'eligible-condition',
		priority: 'low',
		contributingConditionCode: 'continuing-physical-disability',
		description: 'Continuing physical disability — cannot leave home unaided.',
		evaluate: (d) => {
			const c = selectedCondition(d, 'continuing-physical-disability');
			return (
				!!c &&
				c.cannotLeaveHomeUnaided === 'yes' &&
				c.disabilityExpectedToBePermanent === 'yes'
			);
		},
		message:
			'Continuing physical disability with home-care attestation and permanence — eligible.'
	},
	{
		id: 'FP92A-ELIG-CANCER',
		category: 'eligible-condition',
		priority: 'low',
		contributingConditionCode: 'cancer-or-effects',
		description: 'Cancer with treatment phase and confirmed histology.',
		evaluate: (d) => {
			const c = selectedCondition(d, 'cancer-or-effects');
			return !!c && c.cancerTreatmentPhase !== '' && c.histologyConfirmed === 'yes';
		},
		message: 'Cancer / effects of cancer with histological confirmation — eligible.'
	},

	// ── Disqualifying rules ─────────────────────────────────────
	{
		id: 'FP92A-DISQ-DIET-ONLY-DIABETES',
		category: 'disqualifying',
		priority: 'high',
		contributingConditionCode: 'diabetes-mellitus-not-diet-only',
		description: 'Diabetes treated by diet alone is excluded from FP92A.',
		evaluate: (d) => {
			const c = selectedCondition(d, 'diabetes-mellitus-not-diet-only');
			return !!c && c.diabetesTreatmentMode === 'diet-only';
		},
		message:
			'Diabetes mellitus is declared as diet-only — diet-only diabetes is excluded from the FP92A eligibility list.'
	},
	{
		id: 'FP92A-DISQ-TEMP-DISABILITY',
		category: 'disqualifying',
		priority: 'high',
		contributingConditionCode: 'continuing-physical-disability',
		description: 'Temporary disability (e.g. broken leg) is excluded.',
		evaluate: (d) => {
			const c = selectedCondition(d, 'continuing-physical-disability');
			return !!c && c.disabilityExpectedToBePermanent === 'no';
		},
		message:
			'Disability declared as temporary — the FP92A excludes temporary disability such as a broken leg.'
	},
	{
		id: 'FP92A-DISQ-DISABILITY-NO-HOMEBOUND',
		category: 'disqualifying',
		priority: 'medium',
		contributingConditionCode: 'continuing-physical-disability',
		description: 'Disability without home-care attestation.',
		evaluate: (d) => {
			const c = selectedCondition(d, 'continuing-physical-disability');
			return !!c && c.cannotLeaveHomeUnaided === 'no';
		},
		message:
			'Continuing physical disability requires that the patient cannot leave home without the help of another person.'
	},

	// ── Redirect rules ──────────────────────────────────────────
	{
		id: 'FP92A-REDIRECT-PREGNANCY',
		category: 'redirect',
		priority: 'high',
		description: 'Pregnant or recently post-partum → FW8 maternity exemption.',
		evaluate: (d) =>
			d.patient.pregnancyStatus === 'pregnant' ||
			d.patient.pregnancyStatus === 'post-partum-within-12-months',
		message:
			'Patient is pregnant or within 12 months post-partum — apply for the FW8 maternity exemption instead.'
	},
	{
		id: 'FP92A-REDIRECT-AGE-60-PLUS',
		category: 'redirect',
		priority: 'medium',
		description: 'Patient is 60 or over — already exempt on age grounds.',
		evaluate: (d) => {
			const age = ageInYears(d.patient.birthDate);
			return age !== null && age >= 60;
		},
		message:
			'Patient is aged 60 or over — already entitled to free NHS prescriptions on age grounds. FP92A is not required.'
	},
	{
		id: 'FP92A-REDIRECT-AGE-UNDER-16',
		category: 'redirect',
		priority: 'medium',
		description: 'Patient is under 16 — already exempt on age grounds.',
		evaluate: (d) => {
			const age = ageInYears(d.patient.birthDate);
			return age !== null && age < 16;
		},
		message:
			'Patient is aged under 16 — already entitled to free NHS prescriptions on age grounds. FP92A is not required.'
	},
	{
		id: 'FP92A-REDIRECT-AGE-16-18-EDUCATION',
		category: 'redirect',
		priority: 'medium',
		description: 'Patient is 16-18 in full-time education — already exempt on age grounds.',
		evaluate: (d) => {
			const age = ageInYears(d.patient.birthDate);
			return (
				age !== null &&
				age >= 16 &&
				age <= 18 &&
				d.patient.fullTimeEducation === 'yes'
			);
		},
		message:
			'Patient is aged 16-18 in full-time education — already entitled to free NHS prescriptions on age grounds.'
	},

	// ── Renewal ─────────────────────────────────────────────────
	{
		id: 'FP92A-RENEWAL-ACTIVE-CERT',
		category: 'renewal',
		priority: 'medium',
		description: 'Active certificate already on file.',
		evaluate: (d) => {
			if (d.existingExemption.hasExistingCertificate !== 'yes') return false;
			if (!isFilled(d.existingExemption.previousCertificateExpiryDate)) return false;
			const expiry = new Date(d.existingExemption.previousCertificateExpiryDate);
			if (isNaN(expiry.getTime())) return false;
			return expiry.getTime() > Date.now();
		},
		message:
			'Existing certificate is still active — renewal should be timed within the NHSBSA renewal window.'
	},
	{
		id: 'FP92A-RENEWAL-KIND-MISSING',
		category: 'renewal',
		priority: 'medium',
		description: 'Renewal indicator missing when existing certificate is declared.',
		evaluate: (d) =>
			d.existingExemption.hasExistingCertificate === 'yes' &&
			d.existingExemption.applicationKind === '',
		message:
			'An existing certificate was declared but the application kind (renewal / replacement) has not been chosen.'
	}
];
