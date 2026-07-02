import type {
	Adherence,
	AgeBand,
	AnticholinergicBand,
	BurdenBand,
	CareSetting,
	ClinicianRole,
	ConsultationMode,
	FrailtyStatus,
	HighRiskClass,
	Medicine,
	PolypharmacyBand,
	Priority,
	ReviewStatus,
	Sex
} from './types';

// ──────────────────────────────────────────────
// Empty-row factory for the repeating medicine list
// ──────────────────────────────────────────────

/** A fresh, fully-blank medicine row. */
export function emptyMedicine(): Medicine {
	return {
		drugName: '',
		formStrength: '',
		doseRegimen: '',
		indication: '',
		indicationRecorded: '',
		isRegular: '',
		isHighRisk: '',
		highRiskClass: '',
		adherence: '',
		anticholinergicBurdenPoints: null,
		monitoringRequired: '',
		monitoringUpToDate: '',
		deprescribingCandidate: '',
		stoppCriterion: '',
		startCriterion: ''
	};
}

// ──────────────────────────────────────────────
// Review status + burden band labels and colours
// ──────────────────────────────────────────────

/** Review-status label for display. */
export function reviewStatusLabel(status: ReviewStatus): string {
	switch (status) {
		case 'complete':
			return 'Complete';
		case 'incomplete':
			return 'Incomplete';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the status badge/banner.
 * complete → success; incomplete → warning.
 */
export function reviewStatusColor(status: ReviewStatus): string {
	switch (status) {
		case 'complete':
			return 'bg-success text-success-content border-success';
		case 'incomplete':
			return 'bg-warning text-warning-content border-warning';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Composite burden-band label. */
export function burdenBandLabel(band: BurdenBand): string {
	switch (band) {
		case 'low':
			return 'Low burden';
		case 'moderate':
			return 'Moderate burden';
		case 'high':
			return 'High burden';
		default:
			return '';
	}
}

/** Lily-token colour utility classes for the burden-band badge/banner. */
export function burdenBandColor(band: BurdenBand): string {
	switch (band) {
		case 'low':
			return 'bg-success text-success-content border-success';
		case 'moderate':
			return 'bg-warning text-warning-content border-warning';
		case 'high':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Polypharmacy-band label. */
export function polypharmacyBandLabel(band: PolypharmacyBand): string {
	switch (band) {
		case 'none':
			return 'No polypharmacy (under 5 regular)';
		case 'polypharmacy':
			return 'Polypharmacy (5-9 regular)';
		case 'hyperpolypharmacy':
			return 'Hyperpolypharmacy (10 or more regular)';
		default:
			return '';
	}
}

/** Anticholinergic-burden band label. */
export function anticholinergicBandLabel(band: AnticholinergicBand): string {
	switch (band) {
		case 'low':
			return 'Low (ACB 0-2)';
		case 'significant':
			return 'Significant (ACB 3 or more)';
		default:
			return '';
	}
}

/** Lily-token colour utility classes for a flag priority. */
export function priorityColor(priority: Priority): string {
	switch (priority) {
		case 'high':
			return 'bg-error text-error-content border-error';
		case 'medium':
			return 'bg-warning text-warning-content border-warning';
		case 'low':
			return 'bg-base-300 text-base-content border-base-300';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Flag-priority label. */
export function priorityLabel(priority: Priority): string {
	switch (priority) {
		case 'high':
			return 'HIGH';
		case 'medium':
			return 'MEDIUM';
		case 'low':
			return 'LOW';
		default:
			return '';
	}
}

// ──────────────────────────────────────────────
// Enum → display-label helpers
// ──────────────────────────────────────────────

export function clinicianRoleLabel(r: ClinicianRole): string {
	switch (r) {
		case 'clinical-pharmacist':
			return 'Clinical pharmacist';
		case 'gp':
			return 'GP';
		case 'pharmacy-technician':
			return 'Pharmacy technician';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

export function careSettingLabel(s: CareSetting): string {
	switch (s) {
		case 'gp-practice':
			return 'GP practice';
		case 'pcn':
			return 'Primary Care Network';
		case 'care-home':
			return 'Care home';
		case 'community-pharmacy':
			return 'Community pharmacy';
		case 'patient-home':
			return "Patient's home";
		default:
			return '';
	}
}

export function consultationModeLabel(m: ConsultationMode): string {
	switch (m) {
		case 'face-to-face':
			return 'Face to face';
		case 'telephone':
			return 'Telephone';
		case 'video':
			return 'Video';
		case 'home-visit':
			return 'Home visit';
		default:
			return '';
	}
}

export function ageBandLabel(b: AgeBand): string {
	switch (b) {
		case '18-39':
			return '18-39';
		case '40-64':
			return '40-64';
		case '65-74':
			return '65-74';
		case '75-84':
			return '75-84';
		case '85-plus':
			return '85 and over';
		default:
			return '';
	}
}

export function sexLabel(s: Sex): string {
	switch (s) {
		case 'female':
			return 'Female';
		case 'male':
			return 'Male';
		case 'intersex':
			return 'Intersex';
		case 'unknown':
			return 'Unknown';
		default:
			return '';
	}
}

export function frailtyLabel(f: FrailtyStatus): string {
	switch (f) {
		case 'fit':
			return 'Fit';
		case 'mild':
			return 'Mild frailty';
		case 'moderate':
			return 'Moderate frailty';
		case 'severe':
			return 'Severe frailty';
		default:
			return '';
	}
}

export function adherenceLabel(a: Adherence): string {
	switch (a) {
		case 'good':
			return 'Good';
		case 'partial':
			return 'Partial';
		case 'poor':
			return 'Poor';
		case 'unknown':
			return 'Unknown';
		default:
			return '';
	}
}

export function highRiskClassLabel(c: HighRiskClass): string {
	switch (c) {
		case 'anticoagulant':
			return 'Anticoagulant';
		case 'insulin':
			return 'Insulin';
		case 'opioid':
			return 'Opioid';
		case 'dmard':
			return 'DMARD';
		case 'lithium':
			return 'Lithium';
		case 'methotrexate':
			return 'Methotrexate';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}
