import type {
	Adherence,
	AgeBand,
	Allergy,
	AllergyStatus,
	CareSetting,
	ClinicianRole,
	Discrepancy,
	DiscrepancyType,
	HighRiskClass,
	InformationSource,
	IntendedAction,
	ItemStatus,
	LineItem,
	ListSource,
	Priority,
	ReactionType,
	ReconciliationStatus,
	ReconciliationType,
	Route,
	Severity,
	Sex,
	SourceType
} from './types';

// ──────────────────────────────────────────────
// Empty-row factories for the four repeating child lists
// ──────────────────────────────────────────────

/** A fresh, fully-blank information source. */
export function emptySource(): InformationSource {
	return { sourceType: '', verified: '' };
}

/** A fresh, fully-blank allergy. */
export function emptyAllergy(): Allergy {
	return { substance: '', reactionType: '', severity: '' };
}

/** A fresh, fully-blank medication line item. */
export function emptyLineItem(): LineItem {
	return {
		listSource: '',
		drugName: '',
		form: '',
		dose: '',
		route: '',
		frequency: '',
		indication: '',
		highRiskClass: '',
		adherence: '',
		sourceType: '',
		status: ''
	};
}

/** A fresh, fully-blank discrepancy. */
export function emptyDiscrepancy(): Discrepancy {
	return {
		discrepancyType: '',
		bpmhItemRef: '',
		inpatientItemRef: '',
		intendedAction: '',
		rationale: '',
		intentional: ''
	};
}

// ──────────────────────────────────────────────
// Status label + colour
// ──────────────────────────────────────────────

/** Reconciliation-status label for display. */
export function statusLabel(status: ReconciliationStatus): string {
	switch (status) {
		case 'complete':
			return 'Complete';
		case 'discrepancies-outstanding':
			return 'Discrepancies outstanding';
		case 'incomplete':
			return 'Incomplete';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the status badge/banner.
 * complete → success; discrepancies-outstanding → error; incomplete → warning.
 */
export function statusColor(status: ReconciliationStatus): string {
	switch (status) {
		case 'complete':
			return 'bg-success text-success-content border-success';
		case 'discrepancies-outstanding':
			return 'bg-error text-error-content border-error';
		case 'incomplete':
			return 'bg-warning text-warning-content border-warning';
		default:
			return 'bg-base-300 text-base-content border-base-300';
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

export function reconciliationTypeLabel(t: ReconciliationType): string {
	switch (t) {
		case 'admission':
			return 'Admission';
		case 'transfer':
			return 'Transfer';
		case 'discharge':
			return 'Discharge';
		default:
			return '';
	}
}

export function careSettingLabel(s: CareSetting): string {
	switch (s) {
		case 'emergency-department':
			return 'Emergency department';
		case 'acute-medical-unit':
			return 'Acute medical unit';
		case 'surgical-admissions':
			return 'Surgical admissions';
		case 'ward':
			return 'Ward';
		case 'critical-care':
			return 'Critical care';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

export function clinicianRoleLabel(r: ClinicianRole): string {
	switch (r) {
		case 'pharmacist':
			return 'Pharmacist';
		case 'pharmacy-technician':
			return 'Pharmacy technician';
		case 'prescriber':
			return 'Prescriber';
		case 'nurse':
			return 'Nurse';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

export function ageBandLabel(b: AgeBand): string {
	switch (b) {
		case 'adult':
			return 'Adult';
		case 'paediatric':
			return 'Paediatric';
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

export function allergyStatusLabel(a: AllergyStatus): string {
	switch (a) {
		case 'documented':
			return 'Allergies documented';
		case 'no-known-drug-allergies':
			return 'No known drug allergies';
		case 'not-documented':
			return 'Not documented';
		default:
			return '';
	}
}

export function sourceTypeLabel(s: SourceType): string {
	switch (s) {
		case 'patient-interview':
			return 'Patient interview';
		case 'carer-interview':
			return 'Carer interview';
		case 'gp-record':
			return 'GP record';
		case 'repeat-prescription':
			return 'Repeat-prescription list';
		case 'community-pharmacy':
			return 'Community-pharmacy record';
		case 'dispensing-history':
			return 'Dispensing history';
		case 'previous-discharge-summary':
			return 'Previous discharge summary';
		case 'own-drugs-bag':
			return "Patient's own-drugs bag";
		case 'care-home-mar':
			return 'Care-home MAR chart';
		default:
			return '';
	}
}

export function reactionTypeLabel(r: ReactionType): string {
	switch (r) {
		case 'allergy':
			return 'Allergy';
		case 'intolerance':
			return 'Intolerance';
		case 'adverse-effect':
			return 'Adverse effect';
		case 'unknown':
			return 'Unknown';
		default:
			return '';
	}
}

export function severityLabel(s: Severity): string {
	switch (s) {
		case 'mild':
			return 'Mild';
		case 'moderate':
			return 'Moderate';
		case 'severe':
			return 'Severe';
		case 'anaphylaxis':
			return 'Anaphylaxis';
		default:
			return '';
	}
}

export function listSourceLabel(l: ListSource): string {
	switch (l) {
		case 'bpmh':
			return 'BPMH (home medicine)';
		case 'inpatient':
			return 'Inpatient / proposed';
		default:
			return '';
	}
}

export function routeLabel(r: Route): string {
	switch (r) {
		case 'oral':
			return 'Oral';
		case 'iv':
			return 'Intravenous';
		case 'im':
			return 'Intramuscular';
		case 'subcutaneous':
			return 'Subcutaneous';
		case 'topical':
			return 'Topical';
		case 'inhaled':
			return 'Inhaled';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

export function highRiskClassLabel(c: HighRiskClass): string {
	switch (c) {
		case 'none':
			return 'None';
		case 'anticoagulant':
			return 'Anticoagulant';
		case 'insulin':
			return 'Insulin';
		case 'opioid':
			return 'Opioid';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

export function adherenceLabel(a: Adherence): string {
	switch (a) {
		case 'taking':
			return 'Taking';
		case 'not-taking':
			return 'Not taking';
		case 'intermittent':
			return 'Intermittent';
		case 'unknown':
			return 'Unknown';
		default:
			return '';
	}
}

export function itemStatusLabel(s: ItemStatus): string {
	switch (s) {
		case 'active':
			return 'Active';
		case 'held':
			return 'Held';
		case 'stopped':
			return 'Stopped';
		case 'suspended':
			return 'Suspended';
		default:
			return '';
	}
}

export function discrepancyTypeLabel(t: DiscrepancyType): string {
	switch (t) {
		case 'omission':
			return 'Omission';
		case 'commission':
			return 'Commission';
		case 'duplication':
			return 'Duplication';
		case 'dose':
			return 'Dose';
		case 'frequency':
			return 'Frequency';
		case 'route':
			return 'Route';
		case 'formulation':
			return 'Formulation';
		default:
			return '';
	}
}

export function intendedActionLabel(a: IntendedAction): string {
	switch (a) {
		case 'continue':
			return 'Continue';
		case 'hold':
			return 'Hold';
		case 'stop':
			return 'Stop';
		case 'change':
			return 'Change';
		case 'start':
			return 'Start';
		default:
			return '';
	}
}
