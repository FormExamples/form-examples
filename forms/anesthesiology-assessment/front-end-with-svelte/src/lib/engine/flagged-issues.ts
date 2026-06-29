// Flagged-issue detection. Runs independently of the composite scoring engine
// and raises clinician-facing flags for safety-critical findings: allergies,
// MH risk, anticoagulants, difficult airway, GORD, pregnancy, uncontrolled
// hypertension, hypoxia, obesity, smoking, and so on.

import type { AssessmentData, AdditionalFlag } from './types';

export function detectAdditionalFlags(d: AssessmentData): AdditionalFlag[] {
	const flags: AdditionalFlag[] = [];

	// ─── Latex allergy ──────────────────────────────────────────
	if (d.allergies.latexAllergy === 'yes') {
		flags.push({
			id: 'FLAG-LATEX',
			category: 'Allergy',
			message: 'Latex allergy — ensure latex-free environment.',
			priority: 'high'
		});
	}

	// ─── Anaphylaxis history ────────────────────────────────────
	for (let i = 0; i < d.allergies.list.length; i++) {
		const a = d.allergies.list[i];
		if (a && a.severity === 'anaphylaxis') {
			flags.push({
				id: `FLAG-ANAPH-${i}`,
				category: 'Allergy',
				message: `Anaphylaxis history: ${a.allergen || '(allergen not specified)'} — ensure emergency drugs available.`,
				priority: 'urgent'
			});
		}
	}

	if (d.allergies.list.length >= 3) {
		flags.push({
			id: 'FLAG-MULTI-ALLERGY',
			category: 'Allergy',
			message: `Multiple allergies (${d.allergies.list.length}) — review for cross-reactivity.`,
			priority: 'medium'
		});
	}

	// ─── Malignant hyperthermia ─────────────────────────────────
	if (
		d.previousAnaesthesia.malignantHyperthermia === 'yes' ||
		d.previousAnaesthesia.familyAnaestheticComplications === 'yes'
	) {
		flags.push({
			id: 'FLAG-MH',
			category: 'Anaesthetic History',
			message: 'Malignant hyperthermia risk — MH-safe anaesthetic, dantrolene availability.',
			priority: 'high'
		});
	}

	// ─── Anticoagulants / antiplatelets / insulin / steroids / MAOIs ──
	if (d.medications.onAnticoagulants === 'yes') {
		flags.push({
			id: 'FLAG-ANTICOAG',
			category: 'Medications',
			message: 'Anticoagulant use — review bridging protocol.',
			priority: 'high'
		});
	}
	if (d.medications.onAntiplatelets === 'yes') {
		flags.push({
			id: 'FLAG-ANTIPLATE',
			category: 'Medications',
			message: 'Antiplatelet use — review perioperative management.',
			priority: 'medium'
		});
	}
	if (d.medications.onInsulin === 'yes') {
		flags.push({
			id: 'FLAG-INSULIN',
			category: 'Medications',
			message: 'Insulin-dependent — perioperative glucose management plan required.',
			priority: 'medium'
		});
	}
	if (d.medications.onSteroids === 'yes') {
		flags.push({
			id: 'FLAG-STEROIDS',
			category: 'Medications',
			message: 'Steroid use — consider perioperative steroid cover.',
			priority: 'medium'
		});
	}
	if (d.medications.onMaois === 'yes') {
		flags.push({
			id: 'FLAG-MAOI',
			category: 'Medications',
			message: 'MAOI use — significant drug-interaction risk with anaesthetic agents.',
			priority: 'high'
		});
	}

	// ─── Difficult airway history ───────────────────────────────
	if (d.previousAnaesthesia.difficultIntubation) {
		flags.push({
			id: 'FLAG-DIFF-AIRWAY',
			category: 'Airway',
			message: 'Previous difficult intubation — difficult-airway trolley, senior anaesthetist.',
			priority: 'high'
		});
	}

	// ─── GORD ────────────────────────────────────────────────────
	if (d.medicalHistory.gord === 'yes') {
		flags.push({
			id: 'FLAG-GORD',
			category: 'Medical History',
			message: 'GORD — consider rapid sequence induction.',
			priority: 'medium'
		});
	}

	// ─── Pregnancy ──────────────────────────────────────────────
	if (d.socialHistory.pregnancyStatus === 'pregnant') {
		flags.push({
			id: 'FLAG-PREGNANT',
			category: 'Social History',
			message: 'Pregnant patient — obstetric anaesthesia considerations.',
			priority: 'high'
		});
	}

	// ─── Hypertension (uncontrolled) ────────────────────────────
	const sbp = d.vitalSigns.systolicBp;
	const dbp = d.vitalSigns.diastolicBp;
	if ((sbp !== null && sbp > 180) || (dbp !== null && dbp > 110)) {
		flags.push({
			id: 'FLAG-HYPERTENSION',
			category: 'Vital Signs',
			message: `Uncontrolled hypertension (BP ${sbp ?? '?'}/${dbp ?? '?'} mmHg) — consider deferring elective surgery.`,
			priority: 'high'
		});
	}

	// ─── Hypoxia ────────────────────────────────────────────────
	if (d.vitalSigns.spo2 !== null && d.vitalSigns.spo2 < 94) {
		flags.push({
			id: 'FLAG-HYPOXIA',
			category: 'Vital Signs',
			message: `Baseline SpO2 ${d.vitalSigns.spo2}% (<94%) — respiratory optimisation needed.`,
			priority: 'high'
		});
	}

	// ─── Morbid obesity / obesity ───────────────────────────────
	const bmi = d.vitalSigns.bmi;
	if (bmi !== null && bmi > 40) {
		flags.push({
			id: 'FLAG-MORBID-OBESITY',
			category: 'Anthropometric',
			message: `Morbid obesity (BMI ${bmi}) — specialist equipment and positioning.`,
			priority: 'medium'
		});
	} else if (bmi !== null && bmi >= 35) {
		flags.push({
			id: 'FLAG-OBESITY',
			category: 'Anthropometric',
			message: `Obesity (BMI ${bmi}) — airway and respiratory considerations.`,
			priority: 'low'
		});
	}

	// ─── Smoking / alcohol / functional capacity ────────────────
	if (d.socialHistory.smoking === 'current') {
		flags.push({
			id: 'FLAG-SMOKER',
			category: 'Social History',
			message: 'Current smoker — increased respiratory complication risk.',
			priority: 'low'
		});
	}
	if (d.socialHistory.alcoholUnitsPerWeek !== null && d.socialHistory.alcoholUnitsPerWeek > 14) {
		flags.push({
			id: 'FLAG-ALCOHOL',
			category: 'Social History',
			message: `Elevated alcohol intake (${d.socialHistory.alcoholUnitsPerWeek} units/week) — hepatic and withdrawal considerations.`,
			priority: 'medium'
		});
	}
	if (d.socialHistory.canClimbTwoFlights === 'no') {
		flags.push({
			id: 'FLAG-LOW-FUNC',
			category: 'Social History',
			message: 'Limited functional capacity (cannot climb 2 flights) — increased perioperative risk.',
			priority: 'medium'
		});
	}

	// Sort: urgent > high > medium > low
	const order = { urgent: 0, high: 1, medium: 2, low: 3 };
	flags.sort((a, b) => order[a.priority] - order[b.priority]);
	return flags;
}
