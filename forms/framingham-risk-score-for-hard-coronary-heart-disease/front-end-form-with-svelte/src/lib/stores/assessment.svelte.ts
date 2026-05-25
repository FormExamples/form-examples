import type { AssessmentData, GradingResult } from '$lib/engine/types';

const STORAGE_KEY = 'framingham-risk-score-for-hard-coronary-heart-disease.front-end-form-with-svelte.v1';

function createDefaultAssessment(): AssessmentData {
	return {
		patientInformation: {
			fullName: '',
			dateOfBirth: '',
			nhsNumber: '',
			address: '',
			telephone: '',
			email: '',
			gpName: '',
			gpPractice: ''
		},
		demographics: {
			age: null,
			sex: '',
			ethnicity: '',
			heightCm: null,
			weightKg: null
		},
		smokingHistory: {
			smokingStatus: '',
			cigarettesPerDay: null,
			yearsSmoked: null,
			yearsSinceQuit: null
		},
		bloodPressure: {
			systolicBp: null,
			diastolicBp: null,
			onBpTreatment: '',
			bpMedicationName: '',
			bpMeasurementMethod: ''
		},
		cholesterol: {
			totalCholesterol: null,
			hdlCholesterol: null,
			ldlCholesterol: null,
			triglycerides: null,
			cholesterolUnit: 'mgDl',
			fastingSample: ''
		},
		medicalHistory: {
			hasDiabetes: '',
			hasPriorChd: '',
			hasPeripheralVascularDisease: '',
			hasCerebrovascularDisease: '',
			hasHeartFailure: '',
			hasAtrialFibrillation: '',
			otherConditions: ''
		},
		familyHistory: {
			familyChdHistory: '',
			familyChdAgeOnset: '',
			familyChdRelationship: '',
			familyStrokeHistory: '',
			familyDiabetesHistory: ''
		},
		lifestyleFactors: {
			physicalActivity: '',
			alcoholConsumption: '',
			dietQuality: '',
			bmi: null,
			waistCircumferenceCm: null,
			stressLevel: ''
		},
		currentMedications: {
			onStatin: '',
			statinName: '',
			onAspirin: '',
			onAntihypertensive: '',
			antihypertensiveName: '',
			otherMedications: ''
		},
		reviewCalculate: {
			clinicianName: '',
			reviewDate: '',
			clinicalNotes: '',
			patientConsent: ''
		}
	};
}

function loadFromStorage(): AssessmentData | null {
	if (typeof window === 'undefined') return null;
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		return JSON.parse(raw) as AssessmentData;
	} catch {
		return null;
	}
}

class AssessmentStore {
	data = $state<AssessmentData>(loadFromStorage() ?? createDefaultAssessment());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);
	errors = $state<Record<string, string>>({});
	errorSummaryHidden = $state(true);
	submitted = $state(false);

	reset() {
		this.data = createDefaultAssessment();
		this.result = null;
		this.currentStep = 1;
		this.errors = {};
		this.errorSummaryHidden = true;
		this.submitted = false;
		if (typeof window !== 'undefined') {
			try {
				window.localStorage.removeItem(STORAGE_KEY);
			} catch {
				/* ignore */
			}
		}
	}

	goto(n: number) {
		if (n >= 1 && n <= 10) this.currentStep = n;
	}

	persist() {
		if (typeof window === 'undefined') return;
		try {
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
		} catch {
			/* ignore */
		}
	}
}

export const assessment = new AssessmentStore();
