import type { AssessmentData, AdditionalFlag, ESASSymptomKey } from './types';
import { ESAS_ITEMS } from './utils';

/**
 * Flagged-issue detection for the Palliative Assessment.
 *
 * Independent of the ESAS-r total (which the grader computes), this module
 * raises clinician-facing flags for severe symptoms, missing advance-care
 * planning, partial medication coverage, missing MDT referrals, and carer
 * burnout. Flags are sorted high → medium → low for display.
 */

const labelByKey: Record<string, string> = Object.create(null);
for (const item of ESAS_ITEMS) labelByKey[item.key] = item.label;

const ESAS_KEYS: ESASSymptomKey[] = [
	'pain',
	'tiredness',
	'drowsiness',
	'nausea',
	'lackOfAppetite',
	'shortnessOfBreath',
	'depression',
	'anxiety',
	'wellbeing',
	'other'
];

/** Get a numeric ESAS-r score, or null if unanswered. */
function esasScore(d: AssessmentData, key: ESASSymptomKey): number | null {
	const v = d.esasrSymptoms[key];
	if (v === null || v === undefined) return null;
	return Number(v);
}

/** Lowest non-null performance-status value (PPS / AKPS), or Infinity. */
function lowestPerformanceStatus(d: AssessmentData): number {
	const candidates = [d.performanceStatus.ppsScore, d.performanceStatus.akpsScore].filter(
		(v): v is number => v !== null && v !== undefined
	);
	if (!candidates.length) return Infinity;
	return Math.min(...candidates);
}

export function detectAdditionalFlags(data: AssessmentData): AdditionalFlag[] {
	const flags: AdditionalFlag[] = [];

	// ─── HIGH: severe symptoms ─────────────────────────────────────────
	const pain = esasScore(data, 'pain');
	if (pain !== null && pain >= 7) {
		flags.push({
			id: 'FLAG-PALL-PAIN',
			category: 'Symptom Control',
			message: `Uncontrolled severe pain (ESAS-r ${pain}/10) — urgent analgesic review.`,
			priority: 'high'
		});
	}

	const sob = esasScore(data, 'shortnessOfBreath');
	if (sob !== null && sob >= 7) {
		flags.push({
			id: 'FLAG-PALL-DYSPNOEA',
			category: 'Symptom Control',
			message: `Uncontrolled severe shortness of breath (ESAS-r ${sob}/10) — review opioids, oxygen, fan therapy.`,
			priority: 'high'
		});
	}

	const depression = esasScore(data, 'depression');
	const anxiety = esasScore(data, 'anxiety');
	if ((depression !== null && depression >= 7) || (anxiety !== null && anxiety >= 7)) {
		const parts: string[] = [];
		if (depression !== null && depression >= 7) parts.push(`depression ${depression}/10`);
		if (anxiety !== null && anxiety >= 7) parts.push(`anxiety ${anxiety}/10`);
		flags.push({
			id: 'FLAG-PALL-PSYCH',
			category: 'Psychological',
			message: `Severe psychological distress (${parts.join(', ')}) — psychology or psychiatry input recommended.`,
			priority: 'high'
		});
	}

	const wellbeing = esasScore(data, 'wellbeing');
	if (wellbeing !== null && wellbeing >= 7) {
		flags.push({
			id: 'FLAG-PALL-WELLBEING',
			category: 'Wellbeing',
			message: `Severe wellbeing impairment (ESAS-r ${wellbeing}/10) — holistic review recommended.`,
			priority: 'high'
		});
	}

	// ─── HIGH: no DNACPR for end-of-life patient ───────────────────────
	const lowestPs = lowestPerformanceStatus(data);
	if (lowestPs <= 30) {
		const dnacpr = data.goalsOfCareACP.dnacprDocumented;
		if (dnacpr === 'no' || dnacpr === 'unknown') {
			flags.push({
				id: 'FLAG-PALL-DNACPR',
				category: 'Advance Care Planning',
				message: `No DNACPR documented despite low performance status (PPS/AKPS ${lowestPs}) — urgent ACP discussion.`,
				priority: 'high'
			});
		}
	}

	// ─── HIGH: severe carer burnout ────────────────────────────────────
	if (data.carerFamilySupport.carerStrainLevel === 'overwhelmed') {
		flags.push({
			id: 'FLAG-PALL-CARER-OVERWHELM',
			category: 'Carer Support',
			message: 'Primary carer reports being overwhelmed — urgent respite and support assessment.',
			priority: 'high'
		});
	}

	// ─── MEDIUM: moderate symptoms (4-6) ───────────────────────────────
	for (const key of ESAS_KEYS) {
		const v = esasScore(data, key);
		if (v !== null && v >= 4 && v <= 6) {
			flags.push({
				id: `FLAG-PALL-MOD-${key}`,
				category: 'Symptom Control',
				message: `Moderate ${labelByKey[key].toLowerCase()} (ESAS-r ${v}/10) — review symptom-control plan.`,
				priority: 'medium'
			});
		}
	}

	// ─── MEDIUM: no core ACP documents ─────────────────────────────────
	const acp = data.goalsOfCareACP;
	const anyAcpAnswered =
		acp.respectFormCompleted !== '' || acp.adrtCompleted !== '' || acp.lpaHealthAndWelfare !== '';
	const anyAcpYes =
		acp.respectFormCompleted === 'yes' ||
		acp.adrtCompleted === 'yes' ||
		acp.lpaHealthAndWelfare === 'yes';
	if (anyAcpAnswered && !anyAcpYes) {
		flags.push({
			id: 'FLAG-PALL-ACP',
			category: 'Advance Care Planning',
			message: 'No advance-care planning documents recorded (RESPECT, ADRT, or LPA) — initiate ACP conversation.',
			priority: 'medium'
		});
	}

	// ─── MEDIUM: partial medication / symptom-control coverage ─────────
	if (data.medicationsSymptomControl.symptomControlOverall === 'partial') {
		flags.push({
			id: 'FLAG-PALL-MEDS-PARTIAL',
			category: 'Medications',
			message: 'Self-rated symptom control is partial — review regular and as-needed medications.',
			priority: 'medium'
		});
	}
	if (data.medicationsSymptomControl.anticipatoryMedsPrescribed === 'no') {
		flags.push({
			id: 'FLAG-PALL-ANTICIPATORY',
			category: 'Medications',
			message: 'Anticipatory medications not prescribed — ensure end-of-life prescribing is in place.',
			priority: 'medium'
		});
	}

	// ─── MEDIUM: missing key MDT referral ──────────────────────────────
	if (lowestPs <= 50) {
		const mdt = data.multidisciplinaryPlan;
		if (mdt.specialistPalliativeCareInvolved === 'no') {
			flags.push({
				id: 'FLAG-PALL-MDT-SPC',
				category: 'Multidisciplinary Plan',
				message: 'Specialist palliative-care team not involved despite low performance status — consider referral.',
				priority: 'medium'
			});
		}
		if (mdt.communityNursingInvolved === 'no') {
			flags.push({
				id: 'FLAG-PALL-MDT-COMM-NURSING',
				category: 'Multidisciplinary Plan',
				message: 'Community nursing not involved despite low performance status — consider district-nurse referral.',
				priority: 'medium'
			});
		}
	}

	// ─── MEDIUM: severe carer strain (high but not overwhelmed) ────────
	if (data.carerFamilySupport.carerStrainLevel === 'high') {
		flags.push({
			id: 'FLAG-PALL-CARER-HIGH',
			category: 'Carer Support',
			message: 'Carer reports high strain — consider respite, peer support, or carer assessment.',
			priority: 'medium'
		});
	}

	// ─── LOW: mild symptoms (1-3) ──────────────────────────────────────
	for (const key of ESAS_KEYS) {
		const v = esasScore(data, key);
		if (v !== null && v >= 1 && v <= 3) {
			flags.push({
				id: `FLAG-PALL-MILD-${key}`,
				category: 'Symptom Control',
				message: `Mild ${labelByKey[key].toLowerCase()} (ESAS-r ${v}/10) — monitor and reassess at next review.`,
				priority: 'low'
			});
		}
	}

	// ─── LOW: spiritual support not requested when faith recorded ──────
	const psy = data.psychosocialSpiritualConcerns;
	if (psy.faithOrBelief.trim() !== '' && psy.spiritualSupportRequested === 'no') {
		flags.push({
			id: 'FLAG-PALL-SPIRITUAL',
			category: 'Spiritual',
			message: 'Faith or belief recorded but spiritual support not currently requested — offer chaplaincy revisit at next review.',
			priority: 'low'
		});
	}

	// Sort high > medium > low.
	const priorityOrder = { high: 0, medium: 1, low: 2 };
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
