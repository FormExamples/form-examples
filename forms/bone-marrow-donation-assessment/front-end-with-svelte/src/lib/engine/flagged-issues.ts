import type { AssessmentData, AdditionalFlag } from './types';

/**
 * Detects additional flags that should be highlighted for the transplant team,
 * independent of the eligibility classification. These are safety-critical
 * alerts about donor protection and collection planning.
 */
export function detectAdditionalFlags(data: AssessmentData): AdditionalFlag[] {
	const flags: AdditionalFlag[] = [];

	// ─── Positive crossmatch (HIGH) ─────────────────────────────
	if (data.donorRegistrationHlaTyping.crossmatchResult === 'positive') {
		flags.push({
			id: 'FLAG-XM-001',
			category: 'HLA',
			message: 'Positive crossmatch — donor-specific antibodies present',
			priority: 'high'
		});
	}

	// ─── Coercion concerns (HIGH) ───────────────────────────────
	if (data.psychologicalReadiness.coercionConcerns === 'yes') {
		flags.push({
			id: 'FLAG-PS-001',
			category: 'Psychological',
			message: `Coercion concerns: ${data.psychologicalReadiness.coercionDetails || 'details not specified'}`,
			priority: 'high'
		});
	}

	// ─── Donor unwilling / undecided (HIGH) ─────────────────────
	if (data.psychologicalReadiness.willingToProceed !== 'yes') {
		flags.push({
			id: 'FLAG-PS-002',
			category: 'Psychological',
			message: `Donor willingness to proceed: ${data.psychologicalReadiness.willingToProceed || 'not recorded'}`,
			priority: 'high'
		});
	}

	// ─── Informed consent not given (HIGH) ──────────────────────
	if (data.consentEligibility.informedConsentGiven === 'no') {
		flags.push({
			id: 'FLAG-CONSENT-001',
			category: 'Consent',
			message: 'Informed consent not yet given',
			priority: 'high'
		});
	}

	// ─── Severe anaesthetic risk ASA III/IV (HIGH) ──────────────
	if (
		data.anaestheticAssessment.asaGrade === 'III' ||
		data.anaestheticAssessment.asaGrade === 'IV'
	) {
		flags.push({
			id: 'FLAG-AN-001',
			category: 'Anaesthetic',
			message: `ASA Grade ${data.anaestheticAssessment.asaGrade} — significant anaesthetic risk`,
			priority: 'high'
		});
	}

	// ─── G-CSF ineligible (MEDIUM) ──────────────────────────────
	if (data.collectionMethodAssessment.gcsfEligible === 'no') {
		flags.push({
			id: 'FLAG-CM-001',
			category: 'Collection Method',
			message: `G-CSF ineligible${data.collectionMethodAssessment.gcsfContraindications ? `: ${data.collectionMethodAssessment.gcsfContraindications}` : ''} — PBSC mobilisation may not be possible`,
			priority: 'medium'
		});
	}

	// ─── Central line required (MEDIUM) ─────────────────────────
	if (data.collectionMethodAssessment.centralLineRequired === 'yes') {
		flags.push({
			id: 'FLAG-CM-002',
			category: 'Collection Method',
			message: 'Central line required for apheresis — additional procedural risk',
			priority: 'medium'
		});
	}

	// ─── Difficult airway (MEDIUM) ──────────────────────────────
	if (
		data.anaestheticAssessment.mallampatiScore === 'III' ||
		data.anaestheticAssessment.mallampatiScore === 'IV'
	) {
		flags.push({
			id: 'FLAG-AN-002',
			category: 'Anaesthetic',
			message: `Difficult airway anticipated (Mallampati ${data.anaestheticAssessment.mallampatiScore})`,
			priority: 'medium'
		});
	}

	// ─── Posterior iliac crest unsuitable (MEDIUM) ──────────────
	if (data.physicalExamination.posteriorIliacCrestAssessment === 'unsuitable') {
		flags.push({
			id: 'FLAG-PE-001',
			category: 'Physical Examination',
			message: 'Posterior iliac crest unsuitable for marrow harvest',
			priority: 'medium'
		});
	}

	// ─── Drug allergies documented (MEDIUM) ─────────────────────
	if (data.medicalHistory.drugAllergies.trim() !== '') {
		flags.push({
			id: 'FLAG-MH-001',
			category: 'Medical History',
			message: `Drug allergies: ${data.medicalHistory.drugAllergies}`,
			priority: 'medium'
		});
	}

	// ─── Recent travel (LOW) ────────────────────────────────────
	if (data.infectiousDiseaseScreening.recentTravel === 'yes') {
		flags.push({
			id: 'FLAG-ID-001',
			category: 'Infectious Disease',
			message: `Recent travel: ${data.infectiousDiseaseScreening.travelDetails || 'details not specified'} — review deferral criteria`,
			priority: 'low'
		});
	}

	// ─── Vaccinations not up to date (LOW) ──────────────────────
	if (data.infectiousDiseaseScreening.vaccinationUpToDate === 'no') {
		flags.push({
			id: 'FLAG-ID-002',
			category: 'Infectious Disease',
			message: 'Vaccinations not up to date',
			priority: 'low'
		});
	}

	// Sort: high > medium > low.
	const priorityOrder = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
