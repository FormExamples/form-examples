import type { ValidationRule } from './types';
import { hasText, isYesNoAnswered } from './utils';

/**
 * WHO Counter-Referral Form — completeness rules.
 *
 * The counter-referral form is a structured data-collection document, not a
 * scoring instrument. Each rule below identifies a single field that must be
 * completed for the discharge back to the primary care facility to be safe and
 * actionable. Conditional follow-ups (e.g. patient/family informed → "explain"
 * text) are gated by the `applies` predicate so the validator only counts a
 * rule when the conditional branch is active.
 *
 * Rule IDs follow the pattern <SECTION>-<NN>; the prefix lets the report group
 * fired rules by section.
 */
export const counterReferralRules: ValidationRule[] = [
	// ─── Step 1 — Patient Identification ────────────────────
	{
		id: 'PID-01',
		section: 'patientIdentification',
		description: 'Patient name (LAST, First) is required.',
		applies: () => true,
		isSatisfied: (d) => hasText(d.patientIdentification.patientName)
	},
	{
		id: 'PID-02',
		section: 'patientIdentification',
		description: 'Date of birth is required.',
		applies: () => true,
		isSatisfied: (d) => hasText(d.patientIdentification.dateOfBirth)
	},
	{
		id: 'PID-03',
		section: 'patientIdentification',
		description: 'Sex (Male, Female, or Unknown) is required.',
		applies: () => true,
		isSatisfied: (d) =>
			d.patientIdentification.sex === 'male' ||
			d.patientIdentification.sex === 'female' ||
			d.patientIdentification.sex === 'unknown'
	},
	{
		id: 'PID-04',
		section: 'patientIdentification',
		description: 'Patient contact information is required.',
		applies: () => true,
		isSatisfied: (d) => hasText(d.patientIdentification.patientContact)
	},
	{
		id: 'PID-05',
		section: 'patientIdentification',
		description: 'Emergency contact person name is required.',
		applies: () => true,
		isSatisfied: (d) => hasText(d.patientIdentification.emergencyContact.name)
	},
	{
		id: 'PID-06',
		section: 'patientIdentification',
		description: 'Emergency contact information is required.',
		applies: () => true,
		isSatisfied: (d) => hasText(d.patientIdentification.emergencyContact.contactInformation)
	},

	// ─── Step 2 — Facility Details ──────────────────────────
	{
		id: 'FAC-01',
		section: 'facilityDetails',
		description: 'Initiating facility name is required.',
		applies: () => true,
		isSatisfied: (d) => hasText(d.facilityDetails.initiatingFacility.name)
	},
	{
		id: 'FAC-02',
		section: 'facilityDetails',
		description: 'Initiating facility focal point is required.',
		applies: () => true,
		isSatisfied: (d) => hasText(d.facilityDetails.initiatingFacility.focalPoint)
	},
	{
		id: 'FAC-03',
		section: 'facilityDetails',
		description: 'Initiating facility phone number is required.',
		applies: () => true,
		isSatisfied: (d) => hasText(d.facilityDetails.initiatingFacility.phoneNumber)
	},
	{
		id: 'FAC-04',
		section: 'facilityDetails',
		description: 'Date of original referral is required.',
		applies: () => true,
		isSatisfied: (d) => hasText(d.facilityDetails.referralDate)
	},
	{
		id: 'FAC-05',
		section: 'facilityDetails',
		description: 'Reason for original referral is required.',
		applies: () => true,
		isSatisfied: (d) => hasText(d.facilityDetails.referralReason)
	},
	{
		id: 'FAC-06',
		section: 'facilityDetails',
		description: 'Acuity (Acute or Non-acute) is required.',
		applies: () => true,
		isSatisfied: (d) =>
			d.facilityDetails.acuity === 'acute' || d.facilityDetails.acuity === 'non-acute'
	},
	{
		id: 'FAC-07',
		section: 'facilityDetails',
		description: 'Referral facility name is required.',
		applies: () => true,
		isSatisfied: (d) => hasText(d.facilityDetails.referralFacility.name)
	},
	{
		id: 'FAC-08',
		section: 'facilityDetails',
		description: 'Referral facility focal point is required.',
		applies: () => true,
		isSatisfied: (d) => hasText(d.facilityDetails.referralFacility.focalPoint)
	},
	{
		id: 'FAC-09',
		section: 'facilityDetails',
		description: 'Referral facility phone number is required.',
		applies: () => true,
		isSatisfied: (d) => hasText(d.facilityDetails.referralFacility.phoneNumber)
	},
	{
		id: 'FAC-10',
		section: 'facilityDetails',
		description:
			'At least one communication channel (primary care provider or initiating facility) must be ticked.',
		applies: () => true,
		isSatisfied: (d) =>
			d.facilityDetails.communication.discussedWithPrimaryCareProvider ||
			d.facilityDetails.communication.discussedWithInitiatingFacility
	},
	{
		id: 'FAC-11',
		section: 'facilityDetails',
		description: 'Time frame for primary care follow-up with patient is required.',
		applies: () => true,
		isSatisfied: (d) =>
			d.facilityDetails.followUpTimeframe === 'urgent-within-24-hours' ||
			d.facilityDetails.followUpTimeframe === '2-to-6-days' ||
			d.facilityDetails.followUpTimeframe === '1-to-2-weeks' ||
			d.facilityDetails.followUpTimeframe === 'more-than-2-weeks'
	},

	// ─── Step 3 — Situation ─────────────────────────────────
	{
		id: 'SIT-01',
		section: 'situation',
		description: 'Chief complaint is required.',
		applies: () => true,
		isSatisfied: (d) => hasText(d.situation.chiefComplaint)
	},
	{
		id: 'SIT-02',
		section: 'situation',
		description: 'Primary diagnosis is required.',
		applies: () => true,
		isSatisfied: (d) => hasText(d.situation.primaryDiagnosis)
	},
	{
		id: 'SIT-03',
		section: 'situation',
		description: 'Pregnancy status (Yes, No, or Unknown) is required.',
		applies: () => true,
		isSatisfied: (d) =>
			d.situation.pregnant === 'yes' ||
			d.situation.pregnant === 'no' ||
			d.situation.pregnant === 'unknown'
	},
	{
		id: 'SIT-04',
		section: 'situation',
		description: 'Treatments initiated description is required.',
		applies: () => true,
		isSatisfied: (d) => hasText(d.situation.treatmentsInitiated)
	},

	// ─── Step 4 — Background ────────────────────────────────
	{
		id: 'BG-01',
		section: 'background',
		description: 'Brief history of present illness is required.',
		applies: () => true,
		isSatisfied: (d) => hasText(d.background.historyOfPresentIllness)
	},
	{
		id: 'BG-02',
		section: 'background',
		description: 'Relevant past medical history is required.',
		applies: () => true,
		isSatisfied: (d) => hasText(d.background.pastMedicalHistory)
	},

	// ─── Step 5 — Assessment ────────────────────────────────
	{
		id: 'ASS-01',
		section: 'assessment',
		description: 'Final diagnoses / problem list is required.',
		applies: () => true,
		isSatisfied: (d) => hasText(d.assessment.finalDiagnoses)
	},
	{
		id: 'ASS-02',
		section: 'assessment',
		description: 'Prognosis and goals of care are required.',
		applies: () => true,
		isSatisfied: (d) => hasText(d.assessment.prognosisAndGoalsOfCare)
	},
	{
		id: 'ASS-03',
		section: 'assessment',
		description: 'Patient/family informed of diagnosis (Yes or No) is required.',
		applies: () => true,
		isSatisfied: (d) => isYesNoAnswered(d.assessment.patientFamilyInformed)
	},
	{
		id: 'ASS-04',
		section: 'assessment',
		description:
			'Explanation of how patient/family were informed is required when answered Yes.',
		applies: (d) => d.assessment.patientFamilyInformed === 'yes',
		isSatisfied: (d) => hasText(d.assessment.informedExplanation)
	},

	// ─── Step 6 — Recommendations ───────────────────────────
	{
		id: 'REC-01',
		section: 'recommendations',
		description: 'Next steps in follow-up plan are required.',
		applies: () => true,
		isSatisfied: (d) => hasText(d.recommendations.followUpPlan)
	},
	{
		id: 'REC-02',
		section: 'recommendations',
		description: 'Follow-up arrangements (when, where, with whom) are required.',
		applies: () => true,
		isSatisfied: (d) => hasText(d.recommendations.followUpArrangements)
	},
	{
		id: 'REC-03',
		section: 'recommendations',
		description: 'Instructions if patient\'s condition deteriorates are required.',
		applies: () => true,
		isSatisfied: (d) => hasText(d.recommendations.deteriorationInstructions)
	},
	{
		id: 'REC-04',
		section: 'recommendations',
		description: 'Contact name for follow-up questions is required.',
		applies: () => true,
		isSatisfied: (d) => hasText(d.recommendations.contactName)
	},
	{
		id: 'REC-05',
		section: 'recommendations',
		description: 'Contact information for follow-up questions is required.',
		applies: () => true,
		isSatisfied: (d) => hasText(d.recommendations.contactInformation)
	},

	// ─── Step 7 — Provider Sign-off ─────────────────────────
	{
		id: 'SIGN-01',
		section: 'providerSignOff',
		description: 'Referral facility provider name is required.',
		applies: () => true,
		isSatisfied: (d) => hasText(d.providerSignOff.providerName)
	},
	{
		id: 'SIGN-02',
		section: 'providerSignOff',
		description: 'Referral facility provider signature is required.',
		applies: () => true,
		isSatisfied: (d) => hasText(d.providerSignOff.signature)
	},
	{
		id: 'SIGN-03',
		section: 'providerSignOff',
		description: 'Signature date is required.',
		applies: () => true,
		isSatisfied: (d) => hasText(d.providerSignOff.signatureDate)
	}
];
