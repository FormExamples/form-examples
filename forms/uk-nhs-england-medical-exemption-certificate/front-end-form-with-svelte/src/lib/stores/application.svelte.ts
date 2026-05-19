import type {
	EligibleConditionCode,
	EligibilityResult,
	Fp92aApplication,
	QualifyingConditionDetail
} from '$lib/engine/types';

const ALL_CODES: EligibleConditionCode[] = [
	'permanent-fistula',
	'hypoadrenalism',
	'diabetes-insipidus-or-hypopituitarism',
	'diabetes-mellitus-not-diet-only',
	'hypoparathyroidism',
	'myasthenia-gravis',
	'myxoedema',
	'epilepsy-on-anticonvulsant',
	'continuing-physical-disability',
	'cancer-or-effects'
];

function defaultCondition(code: EligibleConditionCode): QualifyingConditionDetail {
	return {
		code,
		selected: false,
		diagnosisDate: '',
		snomedCtCode: '',
		icd10Code: '',
		treatmentDetail: '',
		fistulaSite: '',
		applianceType: '',
		substitutionTherapy: '',
		onSubstitutionTherapy: '',
		diabetesTreatmentMode: '',
		anticonvulsant: '',
		continuousAnticonvulsantTherapy: '',
		cannotLeaveHomeUnaided: '',
		disabilityCarerDetail: '',
		disabilityExpectedToBePermanent: '',
		cancerSite: '',
		cancerTreatmentPhase: '',
		histologyConfirmed: '',
		practitionerAttestationNotes: ''
	};
}

function createDefaultApplication(): Fp92aApplication {
	return {
		practitioner: {
			name: '',
			role: '',
			registrationBody: '',
			registrationNumber: '',
			practiceName: '',
			practiceCode: '',
			practitionerCode: '',
			postalAddressAsFullText: '',
			postcode: '',
			countryAsIso31661Alpha2: '',
			phone: '',
			email: '',
			completionDate: ''
		},
		patient: {
			title: '',
			surname: '',
			forenames: '',
			name: '',
			birthDate: '',
			sex: '',
			postalAddressAsFullText: '',
			postcode: '',
			countryAsIso31661Alpha2: '',
			unitedKingdomNhsNumber: '',
			phone: '',
			email: '',
			fullTimeEducation: '',
			pregnancyStatus: ''
		},
		existingExemption: {
			hasExistingCertificate: '',
			applicationKind: '',
			previousCertificateNumber: '',
			previousCertificateExpiryDate: ''
		},
		ageCheck: { practitionerAcknowledgedAgeAdvice: '' },
		pregnancyCheck: { practitionerAcknowledgedFw8Redirect: '' },
		qualifyingConditions: ALL_CODES.map(defaultCondition),
		declaration: {
			practitionerSignaturePresent: '',
			practitionerHasAccessToMedicalRecords: '',
			practitionerDeclarationText: '',
			signatureDate: ''
		}
	};
}

class ApplicationStore {
	data = $state<Fp92aApplication>(createDefaultApplication());
	result = $state<EligibilityResult | null>(null);
	currentStep = $state(1);

	reset() {
		this.data = createDefaultApplication();
		this.result = null;
		this.currentStep = 1;
	}
}

export const application = new ApplicationStore();
