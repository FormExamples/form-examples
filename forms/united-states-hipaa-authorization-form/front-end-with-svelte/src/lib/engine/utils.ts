import type {
	ValidityStatus,
	CompletenessStatus,
	Priority,
	PrimaryPurpose,
	SignerRelationship
} from './types';

/** Human-readable label for a primary disclosure purpose. */
export function primaryPurposeLabel(purpose: PrimaryPurpose): string {
	switch (purpose) {
		case 'eligibility-determination':
			return 'Eligibility determination';
		case 'continuing-treatment':
			return 'Continuing treatment';
		case 'insurance-claim':
			return 'Insurance claim';
		case 'legal-proceeding':
			return 'Legal proceeding';
		case 'personal-use':
			return 'Personal use';
		case 'research':
			return 'Research';
		case 'at-the-request-of-the-individual':
			return 'At the request of the individual';
		case 'other':
			return 'Other';
		default:
			return 'Not stated';
	}
}

/** Human-readable label for the signer's relationship to the patient. */
export function signerRelationshipLabel(relationship: SignerRelationship): string {
	switch (relationship) {
		case 'self':
			return 'Self';
		case 'parent-of-minor':
			return 'Parent of a minor';
		case 'guardian':
			return 'Guardian';
		case 'power-of-attorney':
			return 'Power of attorney';
		case 'other-authorized-representative':
			return 'Other authorized representative';
		default:
			return 'Not stated';
	}
}

/** Human-readable label for the overall validity status. */
export function validityStatusLabel(status: ValidityStatus): string {
	switch (status) {
		case 'valid':
			return 'Valid';
		case 'invalid':
			return 'Invalid';
		default:
			return 'Not validated';
	}
}

/** Lily token colour triple for a validity-status badge. */
export function validityStatusColor(status: ValidityStatus): string {
	switch (status) {
		case 'valid':
			return 'bg-success text-success-content border-success';
		case 'invalid':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Human-readable label for a completeness band. */
export function completenessStatusLabel(status: CompletenessStatus): string {
	switch (status) {
		case 'empty':
			return 'Empty';
		case 'partial':
			return 'Partial';
		case 'complete':
			return 'Complete';
		default:
			return '';
	}
}

/** Lily token colour triple for a priority badge (high → error, medium → warning, low → base). */
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

/** Calculate age in whole years from a date-of-birth string. */
export function calculateAge(dob: string | null): number | null {
	if (!dob) return null;
	const birth = new Date(dob);
	if (isNaN(birth.getTime())) return null;
	const today = new Date();
	let age = today.getFullYear() - birth.getFullYear();
	const m = today.getMonth() - birth.getMonth();
	if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
		age--;
	}
	return age;
}

/** Summarise the sensitive PHI categories included in an authorization. */
export function recordCategoryLabels(records: {
	includeMedicalHealth: string;
	includeMentalHealth: string;
	includeSubstanceUse: string;
	includeHivAids: string;
	includePsychotherapyNotes: string;
	includeGeneticInformation: string;
}): string[] {
	const labels: string[] = [];
	if (records.includeMedicalHealth === 'yes') labels.push('Medical / health');
	if (records.includeMentalHealth === 'yes') labels.push('Mental health');
	if (records.includeSubstanceUse === 'yes') labels.push('Substance use');
	if (records.includeHivAids === 'yes') labels.push('HIV / AIDS');
	if (records.includePsychotherapyNotes === 'yes') labels.push('Psychotherapy notes');
	if (records.includeGeneticInformation === 'yes') labels.push('Genetic');
	return labels;
}
