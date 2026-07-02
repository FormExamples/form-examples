import type {
	AirwayTechnique,
	AnaestheticTechnique,
	AsaStatus,
	CompletenessStatus,
	DoseUnit,
	DrugCategory,
	EventType,
	Priority,
	RecoveryDestination,
	RegionalTechnique,
	Route,
	Sex,
	Urgency
} from './types';

/** Completeness-status label for display. */
export function statusLabel(status: CompletenessStatus): string {
	switch (status) {
		case 'complete':
			return 'Complete';
		case 'partial':
			return 'Partial';
		case 'incomplete':
			return 'Incomplete';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the completeness-status badge/banner.
 * Complete → success; Partial → warning; Incomplete → error.
 */
export function statusColor(status: CompletenessStatus): string {
	switch (status) {
		case 'complete':
			return 'bg-success text-success-content border-success';
		case 'partial':
			return 'bg-warning text-warning-content border-warning';
		case 'incomplete':
			return 'bg-error text-error-content border-error';
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

/** Urgency label. */
export function urgencyLabel(u: Urgency): string {
	switch (u) {
		case 'elective':
			return 'Elective';
		case 'urgent':
			return 'Urgent';
		case 'emergency':
			return 'Emergency';
		case 'immediate':
			return 'Immediate';
		default:
			return '';
	}
}

/** Patient-sex label. */
export function sexLabel(sex: Sex): string {
	switch (sex) {
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

/** ASA physical-status label. */
export function asaLabel(asa: AsaStatus): string {
	return asa ? `ASA ${asa}` : '';
}

/** Anaesthetic-technique label. */
export function anaestheticTechniqueLabel(t: AnaestheticTechnique): string {
	switch (t) {
		case 'general':
			return 'General';
		case 'regional':
			return 'Regional';
		case 'sedation':
			return 'Sedation';
		case 'mac':
			return 'Monitored anaesthesia care';
		case 'combined':
			return 'Combined';
		default:
			return '';
	}
}

/** Airway-technique label. */
export function airwayTechniqueLabel(t: AirwayTechnique): string {
	switch (t) {
		case 'facemask':
			return 'Facemask';
		case 'supraglottic':
			return 'Supraglottic airway';
		case 'tracheal-tube':
			return 'Tracheal tube';
		case 'tracheostomy':
			return 'Tracheostomy';
		case 'awake-foi':
			return 'Awake fibreoptic intubation';
		default:
			return '';
	}
}

/** Regional-technique label. */
export function regionalTechniqueLabel(t: RegionalTechnique): string {
	switch (t) {
		case 'none':
			return 'None';
		case 'spinal':
			return 'Spinal';
		case 'epidural':
			return 'Epidural';
		case 'cse':
			return 'Combined spinal-epidural';
		case 'peripheral-block':
			return 'Peripheral nerve block';
		default:
			return '';
	}
}

/** Recovery-destination label. */
export function recoveryDestinationLabel(d: RecoveryDestination): string {
	switch (d) {
		case 'recovery':
			return 'Recovery / PACU';
		case 'hdu':
			return 'HDU';
		case 'icu':
			return 'ICU';
		case 'ward':
			return 'Ward';
		default:
			return '';
	}
}

/** Dose-unit label. */
export function doseUnitLabel(u: DoseUnit): string {
	switch (u) {
		case 'mg':
			return 'mg';
		case 'mcg':
			return 'mcg';
		case 'g':
			return 'g';
		case 'ml':
			return 'mL';
		case 'units':
			return 'units';
		case 'mmol':
			return 'mmol';
		case 'puff':
			return 'puff';
		case 'other':
			return 'other';
		default:
			return '';
	}
}

/** Route-of-administration label. */
export function routeLabel(r: Route): string {
	switch (r) {
		case 'iv':
			return 'IV';
		case 'im':
			return 'IM';
		case 'subcutaneous':
			return 'Subcutaneous';
		case 'inhalational':
			return 'Inhalational';
		case 'oral':
			return 'Oral';
		case 'topical':
			return 'Topical';
		case 'neuraxial':
			return 'Neuraxial';
		case 'infusion':
			return 'Infusion';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Drug-category label. */
export function drugCategoryLabel(c: DrugCategory): string {
	switch (c) {
		case 'induction':
			return 'Induction';
		case 'neuromuscular-blocker':
			return 'Neuromuscular blocker';
		case 'maintenance':
			return 'Maintenance';
		case 'reversal':
			return 'Reversal';
		case 'analgesia':
			return 'Analgesia';
		case 'antiemetic':
			return 'Antiemetic';
		case 'antibiotic':
			return 'Antibiotic';
		case 'vasoactive':
			return 'Vasoactive';
		case 'local-anaesthetic':
			return 'Local anaesthetic';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Intra-operative event-type label. */
export function eventTypeLabel(e: EventType): string {
	switch (e) {
		case 'desaturation':
			return 'Desaturation';
		case 'hypotension':
			return 'Hypotension';
		case 'arrhythmia':
			return 'Arrhythmia';
		case 'laryngospasm':
			return 'Laryngospasm';
		case 'bronchospasm':
			return 'Bronchospasm';
		case 'anaphylaxis':
			return 'Anaphylaxis';
		case 'difficult-airway':
			return 'Difficult airway';
		case 'awareness':
			return 'Awareness';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Monitoring-modality label. */
export function monitoringModalityLabel(m: string): string {
	switch (m) {
		case 'ecg':
			return 'ECG';
		case 'nibp':
			return 'NIBP';
		case 'arterial-line':
			return 'Arterial line';
		case 'spo2':
			return 'SpO2';
		case 'capnography':
			return 'Capnography';
		case 'temperature':
			return 'Temperature';
		case 'neuromuscular':
			return 'Neuromuscular';
		case 'depth-of-anaesthesia':
			return 'Depth of anaesthesia';
		case 'cvp':
			return 'CVP';
		case 'urine-output':
			return 'Urine output';
		default:
			return '';
	}
}
