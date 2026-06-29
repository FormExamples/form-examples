import type { AssessmentData, AdditionalFlag } from './types';

/**
 * Detect clinician-facing flags independent of the Clavien-Dindo overall grade:
 * high-risk vital signs, substantial blood loss, prolonged surgery, ASA class,
 * conversion to open, difficult airway, hypothermia, oxygen desaturation, severe
 * pain, life-threatening complications, ICU disposition, and missing critical
 * post-op instructions. Sorted urgent → high → medium → low.
 */
export function detectAdditionalFlags(data: AssessmentData): AdditionalFlag[] {
	const flags: AdditionalFlag[] = [];

	const proc = data.procedureDetails;
	const patient = data.patientDetails;
	const fluids = data.bloodLossFluidBalance;
	const status = data.immediatePostopStatus;
	const anaes = data.anaesthesiaSummary;
	const intra = data.intraoperativeFindings;
	const comps = data.complicationsAssessment;
	const plan = data.postopPlanInstructions;

	// ─── Mortality (Grade V) ─────────────────────────────────
	for (const c of comps.complications || []) {
		if (c && c.grade === 'grade-v') {
			flags.push({
				id: 'FLAG-CD-V',
				category: 'Complications',
				message:
					'Grade V complication (death) recorded — escalate to mortality review and ensure family notification, coroner referral, and clinical governance reporting.',
				priority: 'urgent'
			});
			break;
		}
	}

	// ─── Life-threatening complications (Grade IV) ───────────
	let ivCount = 0;
	for (const c of comps.complications || []) {
		if (c && (c.grade === 'grade-iva' || c.grade === 'grade-ivb')) ivCount++;
	}
	if (ivCount > 0) {
		flags.push({
			id: 'FLAG-CD-IV',
			category: 'Complications',
			message: `${ivCount} life-threatening (Grade IV) complication${ivCount > 1 ? 's' : ''} — ensure ICU/HDU level of care and continuous monitoring.`,
			priority: 'urgent'
		});
	}

	// ─── Reoperation under GA (Grade IIIb) ───────────────────
	let iiibCount = 0;
	for (const c of comps.complications || []) {
		if (c && c.grade === 'grade-iiib') iiibCount++;
	}
	if (iiibCount > 0) {
		flags.push({
			id: 'FLAG-CD-IIIB',
			category: 'Complications',
			message: `${iiibCount} complication${iiibCount > 1 ? 's' : ''} requiring intervention under general anaesthesia (Grade IIIb).`,
			priority: 'high'
		});
	}

	// ─── ASA class ───────────────────────────────────────────
	if (patient.asaGrade === 'IV' || patient.asaGrade === 'V') {
		flags.push({
			id: 'FLAG-ASA-HIGH',
			category: 'Patient Risk',
			message: `ASA class ${patient.asaGrade} — patient at high peri-operative risk; ensure HDU/ICU disposition and senior review.`,
			priority: 'high'
		});
	} else if (patient.asaGrade === 'III') {
		flags.push({
			id: 'FLAG-ASA-III',
			category: 'Patient Risk',
			message: 'ASA class III — severe systemic disease; consider enhanced post-op monitoring.',
			priority: 'medium'
		});
	}

	// ─── Emergency procedure ─────────────────────────────────
	if (proc.priority === 'emergency') {
		flags.push({
			id: 'FLAG-PROC-EMERGENCY',
			category: 'Procedure',
			message:
				'Emergency procedure — heightened risk of post-operative deterioration; ensure close observation.',
			priority: 'medium'
		});
	}

	// ─── Conversion to open ──────────────────────────────────
	if (intra.conversionToOpen === 'yes') {
		flags.push({
			id: 'FLAG-CONVERSION',
			category: 'Intra-operative',
			message: `Conversion to open procedure${intra.conversionReason ? ` — reason: ${intra.conversionReason}` : ''}.`,
			priority: 'high'
		});
	}

	// ─── Prolonged surgery ───────────────────────────────────
	if (proc.durationMinutes !== null && proc.durationMinutes >= 240) {
		flags.push({
			id: 'FLAG-DURATION-LONG',
			category: 'Procedure',
			message: `Prolonged procedure (${proc.durationMinutes} minutes) — increased risk of VTE, pressure injury, and hypothermia.`,
			priority: 'medium'
		});
	}

	// ─── Difficult airway ────────────────────────────────────
	if (anaes.difficultIntubation === 'yes') {
		flags.push({
			id: 'FLAG-AIRWAY',
			category: 'Anaesthesia',
			message:
				'Difficult airway encountered — document in patient record and alert future anaesthetists.',
			priority: 'high'
		});
	}

	// ─── Massive / significant blood loss ────────────────────
	if (fluids.estimatedBloodLossMl !== null && fluids.estimatedBloodLossMl >= 1500) {
		flags.push({
			id: 'FLAG-BLOOD-MASSIVE',
			category: 'Blood Loss',
			message: `Massive blood loss (${fluids.estimatedBloodLossMl} mL) — review haemoglobin, coagulation, and transfusion adequacy.`,
			priority: 'urgent'
		});
	} else if (fluids.estimatedBloodLossMl !== null && fluids.estimatedBloodLossMl >= 500) {
		flags.push({
			id: 'FLAG-BLOOD-SIGNIFICANT',
			category: 'Blood Loss',
			message: `Significant blood loss (${fluids.estimatedBloodLossMl} mL) — recheck haemoglobin in recovery.`,
			priority: 'medium'
		});
	}

	// ─── Hypotension ─────────────────────────────────────────
	if (status.systolicBp !== null && status.systolicBp < 90) {
		flags.push({
			id: 'FLAG-VITAL-HYPOTENSION',
			category: 'Vital Signs',
			message: `Hypotension (SBP ${status.systolicBp} mmHg) on arrival in recovery — assess volume status and bleeding.`,
			priority: 'urgent'
		});
	}

	// ─── Hypertension ────────────────────────────────────────
	if (status.systolicBp !== null && status.systolicBp >= 180) {
		flags.push({
			id: 'FLAG-VITAL-HYPERTENSION',
			category: 'Vital Signs',
			message: `Hypertension (SBP ${status.systolicBp} mmHg) — review pain control and consider antihypertensive.`,
			priority: 'medium'
		});
	}

	// ─── Tachycardia ─────────────────────────────────────────
	if (status.heartRate !== null && status.heartRate >= 120) {
		flags.push({
			id: 'FLAG-VITAL-TACHY',
			category: 'Vital Signs',
			message: `Tachycardia (HR ${status.heartRate} bpm) — assess for pain, hypovolaemia, or sepsis.`,
			priority: 'high'
		});
	}

	// ─── Bradycardia ─────────────────────────────────────────
	if (status.heartRate !== null && status.heartRate < 50) {
		flags.push({
			id: 'FLAG-VITAL-BRADY',
			category: 'Vital Signs',
			message: `Bradycardia (HR ${status.heartRate} bpm) — review medications and monitor closely.`,
			priority: 'medium'
		});
	}

	// ─── Hypoxia ─────────────────────────────────────────────
	if (status.oxygenSaturation !== null && status.oxygenSaturation < 92) {
		flags.push({
			id: 'FLAG-VITAL-HYPOXIA',
			category: 'Vital Signs',
			message: `Oxygen desaturation (SpO2 ${status.oxygenSaturation}%) — escalate, supplement oxygen and review airway.`,
			priority: 'urgent'
		});
	}

	// ─── Hypothermia ─────────────────────────────────────────
	if (status.temperature !== null && status.temperature < 36.0) {
		flags.push({
			id: 'FLAG-VITAL-HYPOTHERMIA',
			category: 'Vital Signs',
			message: `Hypothermia (${status.temperature} °C) — initiate active warming.`,
			priority: 'medium'
		});
	}

	// ─── Pyrexia ─────────────────────────────────────────────
	if (status.temperature !== null && status.temperature >= 38.5) {
		flags.push({
			id: 'FLAG-VITAL-PYREXIA',
			category: 'Vital Signs',
			message: `Pyrexia (${status.temperature} °C) — assess for infection and consider sepsis screen.`,
			priority: 'high'
		});
	}

	// ─── Tachypnoea ──────────────────────────────────────────
	if (status.respiratoryRate !== null && status.respiratoryRate >= 25) {
		flags.push({
			id: 'FLAG-VITAL-TACHYPNOEA',
			category: 'Vital Signs',
			message: `Tachypnoea (RR ${status.respiratoryRate}) — assess respiratory function and pain.`,
			priority: 'high'
		});
	}

	// ─── Severe pain ─────────────────────────────────────────
	if (status.painScore !== null && status.painScore >= 7) {
		flags.push({
			id: 'FLAG-PAIN-SEVERE',
			category: 'Pain',
			message: `Severe pain (score ${status.painScore}/10) — escalate analgesia plan.`,
			priority: 'high'
		});
	}

	// ─── Reduced consciousness ───────────────────────────────
	if (status.consciousLevel === 'unresponsive') {
		flags.push({
			id: 'FLAG-CONSC-UNRESP',
			category: 'Status',
			message: 'Patient unresponsive on arrival — urgent senior review required.',
			priority: 'urgent'
		});
	}

	// ─── ICU / HDU disposition ───────────────────────────────
	if (status.disposition === 'icu') {
		flags.push({
			id: 'FLAG-DISP-ICU',
			category: 'Disposition',
			message: 'Patient transferred to ICU — ensure handover with ICU team.',
			priority: 'high'
		});
	} else if (status.disposition === 'hdu') {
		flags.push({
			id: 'FLAG-DISP-HDU',
			category: 'Disposition',
			message: 'Patient transferred to HDU — ensure handover with HDU team.',
			priority: 'medium'
		});
	}

	// ─── Missing critical post-op instructions ───────────────
	if (!plan.thromboprophylaxis || !plan.thromboprophylaxis.trim()) {
		flags.push({
			id: 'FLAG-PLAN-VTE',
			category: 'Post-op Plan',
			message: 'Thromboprophylaxis plan not documented — VTE risk assessment required.',
			priority: 'medium'
		});
	}
	if (!plan.analgesiaPlan || !plan.analgesiaPlan.trim()) {
		flags.push({
			id: 'FLAG-PLAN-ANALGESIA',
			category: 'Post-op Plan',
			message: 'Analgesia plan not documented.',
			priority: 'medium'
		});
	}
	if (!plan.followUpPlan || !plan.followUpPlan.trim()) {
		flags.push({
			id: 'FLAG-PLAN-FOLLOWUP',
			category: 'Post-op Plan',
			message: 'Follow-up plan not documented.',
			priority: 'low'
		});
	}

	// Sort: urgent > high > medium > low
	const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 } as const;
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
