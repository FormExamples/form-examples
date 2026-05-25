import type { AssessmentData, GradingResult } from '$lib/engine/types';

const STORAGE_KEY = 'predicting-risk-of-cardiovascular-disease-events.front-end-form-with-svelte.v1';

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
			weightKg: null,
			zipCode: ''
		},
		bloodPressure: {
			systolicBp: null,
			diastolicBp: null,
			onAntihypertensive: '',
			numberOfBpMedications: null,
			bpAtTarget: ''
		},
		cholesterolLipids: {
			totalCholesterol: null,
			hdlCholesterol: null,
			ldlCholesterol: null,
			triglycerides: null,
			nonHdlCholesterol: null,
			onStatin: '',
			statinName: ''
		},
		metabolicHealth: {
			hasDiabetes: '',
			diabetesType: '',
			hba1cValue: null,
			hba1cUnit: '',
			fastingGlucose: null,
			bmi: null,
			waistCircumferenceCm: null
		},
		renalFunction: {
			egfr: null,
			creatinine: null,
			urineAcr: null,
			ckdStage: ''
		},
		smokingHistory: {
			smokingStatus: '',
			cigarettesPerDay: null,
			yearsSmoked: null,
			yearsSinceQuit: null
		},
		medicalHistory: {
			hasKnownCvd: '',
			previousMi: '',
			previousStroke: '',
			heartFailure: '',
			atrialFibrillation: '',
			peripheralArterialDisease: '',
			familyCvdHistory: '',
			familyCvdDetails: ''
		},
		currentMedications: {
			onAntihypertensiveDetail: '',
			onStatinDetail: '',
			onAspirin: '',
			onAnticoagulant: '',
			onDiabetesMedication: '',
			otherMedications: ''
		},
		reviewCalculate: {
			modelType: '',
			clinicianName: '',
			reviewDate: '',
			clinicalNotes: ''
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
	data: AssessmentData = $state(loadFromStorage() ?? createDefaultAssessment());
	result: GradingResult | null = $state(null);
	currentStep: number = $state(1);
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
