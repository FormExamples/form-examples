import type { AssessmentData, GradingResult } from '$lib/engine/types';
import { createDefaultAssessmentData } from '$lib/engine/utils';

const STORAGE_KEY = 'heart-health-check.front-end-form-with-svelte.v1';

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
	data = $state<AssessmentData>(loadFromStorage() ?? createDefaultAssessmentData());
	result = $state<GradingResult | null>(null);
	currentStep = $state(1);
	errors = $state<Record<string, string>>({});
	errorSummaryHidden = $state(true);
	submitted = $state(false);

	reset() {
		this.data = createDefaultAssessmentData();
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
