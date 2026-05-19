import type { AdditionalFlag, Fp92aApplication } from './types';
import { ageInYears, isFilled, looksLikeNhsNumber, priorityOrder } from './utils';

/**
 * Advisory / educational flags raised alongside the rule-based outcome.
 *
 *   - Missing NHS number          → urgent (NHSBSA cannot match the record).
 *   - Missing practitioner signature → urgent (FP92A invalid until signed).
 *   - Diet-only diabetes declared → high (educational, applicant ineligible).
 *   - Temporary disability declared → high (educational, applicant ineligible).
 *   - Pregnancy declared          → high (redirect to FW8).
 *   - Eligible on age grounds     → medium (FP92A unnecessary).
 *   - Active certificate exists   → medium (renewal-window timing).
 *   - Cancer pending histology    → medium (clarification required).
 *
 * Pure function: no mutation, no side effects.
 */
export function detectAdditionalFlags(data: Fp92aApplication): AdditionalFlag[] {
	const flags: AdditionalFlag[] = [];

	// ── Urgent: missing NHS number ─────────────────────────────
	if (!looksLikeNhsNumber(data.patient.unitedKingdomNhsNumber)) {
		flags.push({
			id: 'FLAG-MISSING-NHS-NUMBER',
			category: 'completeness',
			message:
				'NHS number is missing or not 10 digits — NHSBSA Bridge House cannot match the application to the patient record without it.',
			priority: 'urgent'
		});
	}

	// ── Urgent: missing practitioner signature ─────────────────
	if (data.declaration.practitionerSignaturePresent !== 'yes') {
		flags.push({
			id: 'FLAG-MISSING-SIGNATURE',
			category: 'completeness',
			message:
				'Practitioner signature has not been confirmed — the FP92A must be signed in ink before posting to NHSBSA.',
			priority: 'urgent'
		});
	}

	// ── High: diet-only diabetes declared ──────────────────────
	const diab = data.qualifyingConditions.find(
		(c) => c.code === 'diabetes-mellitus-not-diet-only' && c.selected
	);
	if (diab && diab.diabetesTreatmentMode === 'diet-only') {
		flags.push({
			id: 'FLAG-DIET-ONLY-DIABETES',
			category: 'education',
			message:
				'Diet-only diabetes is excluded from FP92A eligibility. Consider lifestyle support and the low-income scheme (HC1 / HC2).',
			priority: 'high'
		});
	}

	// ── High: temporary disability declared ────────────────────
	const dis = data.qualifyingConditions.find(
		(c) => c.code === 'continuing-physical-disability' && c.selected
	);
	if (dis && dis.disabilityExpectedToBePermanent === 'no') {
		flags.push({
			id: 'FLAG-TEMPORARY-DISABILITY',
			category: 'education',
			message:
				'Disability declared as temporary — the FP92A excludes temporary disabilities such as a broken leg.',
			priority: 'high'
		});
	}

	// ── High: pregnancy → FW8 redirect ─────────────────────────
	if (
		data.patient.pregnancyStatus === 'pregnant' ||
		data.patient.pregnancyStatus === 'post-partum-within-12-months'
	) {
		flags.push({
			id: 'FLAG-PREGNANCY-FW8',
			category: 'pregnancy',
			message:
				'Patient is pregnant or within 12 months post-partum — apply for the FW8 maternity exemption instead of the FP92A.',
			priority: 'high'
		});
	}

	// ── Medium: age-based exemption ────────────────────────────
	const age = ageInYears(data.patient.birthDate);
	if (age !== null) {
		if (age >= 60) {
			flags.push({
				id: 'FLAG-AGE-EXEMPTION-60-PLUS',
				category: 'age-exemption',
				message:
					'Patient is aged 60 or over — already entitled to free NHS prescriptions on age grounds. FP92A is not required.',
				priority: 'medium'
			});
		} else if (age < 16) {
			flags.push({
				id: 'FLAG-AGE-EXEMPTION-UNDER-16',
				category: 'age-exemption',
				message:
					'Patient is aged under 16 — already entitled to free NHS prescriptions on age grounds.',
				priority: 'medium'
			});
		} else if (age <= 18 && data.patient.fullTimeEducation === 'yes') {
			flags.push({
				id: 'FLAG-AGE-EXEMPTION-16-18-EDUCATION',
				category: 'age-exemption',
				message:
					'Patient is aged 16-18 in full-time education — already entitled to free NHS prescriptions on age grounds.',
				priority: 'medium'
			});
		}
	}

	// ── Medium: active certificate already exists ──────────────
	if (
		data.existingExemption.hasExistingCertificate === 'yes' &&
		isFilled(data.existingExemption.previousCertificateExpiryDate)
	) {
		const expiry = new Date(data.existingExemption.previousCertificateExpiryDate);
		if (!isNaN(expiry.getTime()) && expiry.getTime() > Date.now()) {
			flags.push({
				id: 'FLAG-ACTIVE-CERTIFICATE-EXISTS',
				category: 'workflow',
				message:
					'A medical exemption certificate is already on file and has not yet expired. Time the renewal within the NHSBSA renewal window.',
				priority: 'medium'
			});
		}
	}

	// ── Medium: cancer pending histology ───────────────────────
	const cancer = data.qualifyingConditions.find(
		(c) => c.code === 'cancer-or-effects' && c.selected
	);
	if (cancer && cancer.histologyConfirmed === 'pending') {
		flags.push({
			id: 'FLAG-CANCER-HISTOLOGY-PENDING',
			category: 'data-quality',
			message:
				'Cancer diagnosis is selected but histological confirmation is pending — application requires clarification before posting.',
			priority: 'medium'
		});
	}

	flags.sort((a, b) => priorityOrder(a.priority) - priorityOrder(b.priority));
	return flags;
}
