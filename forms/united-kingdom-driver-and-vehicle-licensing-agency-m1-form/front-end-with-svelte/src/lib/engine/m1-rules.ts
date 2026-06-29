import type { ValidationRule } from './types';
import { isFilled } from './utils';

/**
 * DVLA M1 form — validation rules.
 *
 * Each rule's `evaluate(data)` returns true when the rule *fires* (i.e. a
 * problem is detected). Rules cover three concerns:
 *
 *   1. **Completeness** — required fields must be answered for the active
 *      branch. If Q1 = No, the form stops, so downstream rules are skipped.
 *   2. **Consistency** — Q2 conditions must include `otherDetails` text when
 *      `other = yes`; Q3 dates must be supplied when `hadRecentContact = yes`.
 *   3. **Safety** — selecting the "anxiety/depression with suicidal thoughts"
 *      variant elevates the report to urgent professional review.
 *
 * The rules are pure: no side effects, no network calls.
 */
export const m1Rules: ValidationRule[] = [
	// ─── Part A — Personal details ────────────────────────────
	{
		id: 'M1-PD-001',
		category: 'completeness',
		priority: 'medium',
		description: 'Personal full name must be provided.',
		evaluate: (d) => !isFilled(d.personalDetails.fullName),
		message: 'Full name is missing in Part A (Personal Details).'
	},
	{
		id: 'M1-PD-002',
		category: 'completeness',
		priority: 'medium',
		description: 'Personal date of birth must be provided.',
		evaluate: (d) => !isFilled(d.personalDetails.dateOfBirth),
		message: 'Date of birth is missing in Part A (Personal Details).'
	},
	{
		id: 'M1-PD-003',
		category: 'completeness',
		priority: 'medium',
		description: 'Personal address must be provided.',
		evaluate: (d) => !isFilled(d.personalDetails.address),
		message: 'Address is missing in Part A (Personal Details).'
	},
	{
		id: 'M1-PD-004',
		category: 'completeness',
		priority: 'medium',
		description: 'Personal postcode must be provided.',
		evaluate: (d) => !isFilled(d.personalDetails.postcode),
		message: 'Postcode is missing in Part A (Personal Details).'
	},
	{
		id: 'M1-PD-005',
		category: 'completeness',
		priority: 'low',
		description: 'A contact number is recommended.',
		evaluate: (d) => !isFilled(d.personalDetails.contactNumber),
		message: 'Contact number is missing in Part A.'
	},

	// ─── Part B — Healthcare professionals ────────────────────
	{
		id: 'M1-HCP-001',
		category: 'completeness',
		priority: 'medium',
		description: 'GP name should be provided when a diagnosis is reported.',
		evaluate: (d) =>
			d.diagnosisConfirmation.hasMentalHealthDiagnosis === 'yes' &&
			!isFilled(d.healthcareProfessionals.gp.gpName),
		message: 'GP name is missing in Part B (GP Details).'
	},
	{
		id: 'M1-HCP-002',
		category: 'completeness',
		priority: 'low',
		description: 'GP surgery name should be provided when a diagnosis is reported.',
		evaluate: (d) =>
			d.diagnosisConfirmation.hasMentalHealthDiagnosis === 'yes' &&
			!isFilled(d.healthcareProfessionals.gp.surgeryName),
		message: 'GP surgery name is missing in Part B.'
	},
	{
		id: 'M1-HCP-003',
		category: 'completeness',
		priority: 'low',
		description: 'GP date last seen should be provided when a diagnosis is reported.',
		evaluate: (d) =>
			d.diagnosisConfirmation.hasMentalHealthDiagnosis === 'yes' &&
			!isFilled(d.healthcareProfessionals.gp.dateLastSeen),
		message: 'GP date last seen for this condition is missing in Part B.'
	},

	// ─── Q1 — Diagnosis confirmation ─────────────────────────
	{
		id: 'M1-Q1-001',
		category: 'completeness',
		priority: 'high',
		description: 'Q1 (diagnosis confirmation) must be answered.',
		evaluate: (d) => d.diagnosisConfirmation.hasMentalHealthDiagnosis === '',
		message: 'Question 1 (have you been diagnosed with a mental health condition) is unanswered.'
	},

	// ─── Q2 — Mental health conditions ────────────────────────
	{
		id: 'M1-Q2-001',
		category: 'completeness',
		priority: 'high',
		description: 'Q2 must list at least one condition when Q1 = Yes.',
		evaluate: (d) => {
			if (d.diagnosisConfirmation.hasMentalHealthDiagnosis !== 'yes') return false;
			const c = d.mentalHealthConditions;
			const anySelected =
				c.anxietyDepressionWithoutImpairment === 'yes' ||
				c.anxietyDepressionWithImpairment === 'yes' ||
				c.bipolarAffectiveDisorder === 'yes' ||
				c.eatingDisorder === 'yes' ||
				c.ocdOrPtsd === 'yes' ||
				c.personalityDisorder === 'yes' ||
				c.schizophreniaOrPsychosis === 'yes' ||
				c.other === 'yes';
			return !anySelected;
		},
		message:
			'Question 2 has no condition marked Yes. At least one condition is required when Q1 = Yes.'
	},
	{
		id: 'M1-Q2-002',
		category: 'consistency',
		priority: 'medium',
		description: 'Q2 "Other" requires free-text details.',
		evaluate: (d) =>
			d.mentalHealthConditions.other === 'yes' &&
			!isFilled(d.mentalHealthConditions.otherDetails),
		message:
			'Question 2 marked "Other" as Yes but no details were supplied. Please describe the other condition.'
	},

	// ─── Q3 — Recent contact ──────────────────────────────────
	{
		id: 'M1-Q3-001',
		category: 'completeness',
		priority: 'high',
		description: 'Q3 (recent contact) must be answered when Q1 = Yes.',
		evaluate: (d) =>
			d.diagnosisConfirmation.hasMentalHealthDiagnosis === 'yes' &&
			d.recentContact.hadRecentContact === '',
		message:
			'Question 3 (recent healthcare professional contact) is unanswered.'
	},
	{
		id: 'M1-Q3-002',
		category: 'consistency',
		priority: 'medium',
		description: 'Q3 = Yes requires at least one date of contact.',
		evaluate: (d) => {
			if (d.recentContact.hadRecentContact !== 'yes') return false;
			const r = d.recentContact;
			return (
				!isFilled(r.doctorLastDate) &&
				!isFilled(r.consultantLastDate) &&
				!isFilled(r.communityPsychiatricNurseLastDate)
			);
		},
		message:
			'Question 3 marked Yes but no last-contact date was provided for Doctor, Consultant, or Community psychiatric nurse.'
	},

	// ─── Authorisation ────────────────────────────────────────
	{
		id: 'M1-AUTH-001',
		category: 'declaration',
		priority: 'high',
		description: 'Declaration must be confirmed.',
		evaluate: (d) => d.authorisation.declarationConfirmed !== 'yes',
		message:
			"Applicant's declaration was not confirmed. The form cannot be submitted without authorising medical disclosure."
	},
	{
		id: 'M1-AUTH-002',
		category: 'completeness',
		priority: 'medium',
		description: 'Signatory name must be provided.',
		evaluate: (d) => !isFilled(d.authorisation.signatoryName),
		message: 'Signatory name is missing on the authorisation page.'
	},
	{
		id: 'M1-AUTH-003',
		category: 'completeness',
		priority: 'medium',
		description: 'Signature date must be provided.',
		evaluate: (d) => !isFilled(d.authorisation.signatureDate),
		message: 'Signature date is missing on the authorisation page.'
	}
];
