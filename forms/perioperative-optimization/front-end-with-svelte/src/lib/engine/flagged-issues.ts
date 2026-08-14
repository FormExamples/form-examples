// Safety-flag detection.
//
// Flags fire independently of the surgical readiness band and are never
// suppressed by a clinician override — see doc/safety-case-notes.md hazard
// H-07. Flag IDs are stable across every front-end and the back-end.

import type {
	AdditionalFlag,
	DomainResult,
	FlagCategory,
	FlagPriority,
	PerioperativeOptimization
} from './types';
import { ageInYears, num } from './utils';
import { computeFriedPhenotypeScore } from './domain-rules';

/** Context the flag rules need beyond the raw assessment. */
export interface FlagContext {
	domains: DomainResult[];
	mustScore: number | null;
	auditCScore: number | null;
	weeksToSurgery: number | null;
}

/**
 * Detect safety flags, most severe first.
 *
 * @param {object} data - the assessment data model
 * @param {object} context - { domains, mustScore, auditCScore, weeksToSurgery }
 * @returns {object[]}
 */
export function detectFlags(
	data: PerioperativeOptimization,
	context: FlagContext
): AdditionalFlag[] {
	const flags: AdditionalFlag[] = [];
	const push = (
		flagId: string,
		category: FlagCategory,
		priority: FlagPriority,
		domain: string,
		description: string,
		suggestedAction: string
	) =>
		flags.push({ flagId, category, priority, domain, description, suggestedAction });

	const { domains, mustScore, auditCScore } = context;
	const age = ageInYears(data.patient.birthDate, data.assessment.assessmentDate);

	// --- The gating flag: the whole point of the form ----------------------
	const short = domains.filter((d) => d.status === 'insufficient-time');
	if (short.length > 0) {
		const worst = Math.max(...short.map((d) => d.weeksShortfall ?? 0));
		push('F-INSUFFICIENT-TIME-TO-OPTIMIZE-001', 'insufficient-time-to-optimize', 'high', '',
			`${short.length} domain${short.length === 1 ? '' : 's'} cannot be optimized before the listed date: ${short.map((d) => d.domain).join(', ')}. The largest shortfall is ${worst} week${worst === 1 ? '' : 's'}.`,
			'Either move the surgery date to create the window, or record an explicit accept-unoptimized-risk decision at sign-off. Do not proceed believing the patient is optimized.');
	}

	// --- Anaemia ------------------------------------------------------------
	const hb = num(data.anaemia.haemoglobinGPerL);
	if (hb !== null && hb < 80) {
		push('F-SEVERE-ANAEMIA-001', 'severe-anaemia', 'high', 'anaemia',
			`Haemoglobin ${hb} g/L is below 80.`,
			'Urgent haematology review; consider transfusion. Elective surgery is normally deferred.');
	}
	const ferritin = num(data.anaemia.ferritinUgPerL);
	if (ferritin !== null && ferritin < 30 && data.anaemia.anaemiaTreatmentStarted !== 'yes') {
		push('F-IRON-DEFICIENCY-UNTREATED-001', 'iron-deficiency-untreated', 'medium', 'anaemia',
			`Ferritin ${ferritin} µg/L indicates iron deficiency, and no treatment has been started.`,
			'Start iron replacement and investigate the cause; iron deficiency in an adult may indicate gastrointestinal blood loss.');
	}

	// --- Glycaemic control ---------------------------------------------------
	const hba1c = num(data.glycaemic.hba1cMmolPerMol);
	if (hba1c !== null && hba1c >= 69) {
		push('F-HBA1C-ABOVE-THRESHOLD-001', 'hba1c-above-threshold', 'high', 'glycaemic-control',
			`HbA1c ${hba1c} mmol/mol is at or above the CPOC deferral threshold of 69 mmol/mol (8.5%).`,
			'Diabetes-team review. Defer elective surgery unless the delay would itself cause harm.');
	}
	if (hba1c !== null && hba1c >= 48 &&
			(data.glycaemic.diabetesType === '' || data.glycaemic.diabetesType === 'none')) {
		push('F-UNDIAGNOSED-DIABETES-001', 'undiagnosed-diabetes', 'medium', 'glycaemic-control',
			`HbA1c ${hba1c} mmol/mol is diagnostic of diabetes, but no diabetes diagnosis is recorded.`,
			'Refer for diagnosis and management; inform the general practitioner.');
	}

	// --- Medication: the three high-consequence classes -----------------------
	if (data.medication.takesSglt2Inhibitor === 'yes' &&
			data.medication.medicationHoldPlanAgreed !== 'yes') {
		push('F-SGLT2-INHIBITOR-NOT-HELD-001', 'sglt2-inhibitor-not-held', 'high', 'medication',
			'An SGLT2 inhibitor is in use with no agreed hold plan.',
			'Agree a hold plan with the prescriber. These drugs can precipitate ketoacidosis with a normal blood glucose, so check ketones rather than glucose if the patient is unwell.');
	}
	const onGlp1 = data.medication.takesGlp1Agonist === 'yes';
	const glp1NotHeldOrConfirmed =
		data.medication.glp1HeldPerGuideline !== 'yes' &&
		data.medication.glp1ExtendedClearFluidsConfirmed !== 'yes';
	if (onGlp1 && (data.medication.glp1GiSymptoms === 'yes' || glp1NotHeldOrConfirmed)) {
		push('F-GLP1-AGONIST-ASPIRATION-RISK-001', 'glp1-agonist-aspiration-risk', 'high', 'medication',
			data.medication.glp1GiSymptoms === 'yes'
				? 'A GLP-1 receptor agonist is in use with active gastrointestinal symptoms — delayed gastric emptying raises aspiration risk.'
				: 'A GLP-1 receptor agonist is in use and was neither held per guideline nor an extended clear-fluid fast confirmed.',
			'Apply full-stomach precautions: consider withholding the dose per guideline (daily formulations on the day of surgery, weekly formulations one week prior), consider point-of-care gastric ultrasound, and prefer regional anaesthesia where appropriate.');
	}
	if ((data.medication.takesAnticoagulant === 'yes' || data.medication.takesAntiplatelet === 'yes') &&
			data.medication.medicationHoldPlanAgreed !== 'yes') {
		const which = data.medication.takesAnticoagulant === 'yes' ? 'An anticoagulant' : 'An antiplatelet';
		push('F-ANTICOAGULATION-PLAN-MISSING-001', 'anticoagulation-plan-missing', 'high', 'medication',
			`${which} is in use with no agreed hold-and-restart plan.`,
			'Agree the plan with the prescriber, balancing bleeding risk against thrombotic risk. Bridging is not routine and is itself a source of harm.');
	}

	// --- Smoking ---------------------------------------------------------------
	if (data.smoking.smokingStatus === 'current' &&
			['major', 'major-plus'].includes(data.procedure.surgicalSeverity)) {
		push('F-ACTIVE-SMOKER-MAJOR-SURGERY-001', 'active-smoker-major-surgery', 'high', 'smoking',
			'The patient currently smokes and is listed for major surgery.',
			'Offer cessation support and nicotine replacement now. Four weeks of abstinence measurably reduces respiratory and wound complications.');
	}

	// --- Alcohol ----------------------------------------------------------------
	if ((auditCScore !== null && auditCScore >= 8) ||
			data.alcohol.alcoholDependenceFeatures === 'yes') {
		push('F-ALCOHOL-DEPENDENCE-RISK-001', 'alcohol-dependence-risk', 'high', 'alcohol',
			auditCScore !== null && auditCScore >= 8
				? `AUDIT-C score ${auditCScore} indicates a high level of drinking.`
				: 'Features of alcohol dependence are recorded.',
			'Refer to alcohol services and put a withdrawal-prevention plan in place for the admission.');
	}

	// --- Nutrition ---------------------------------------------------------------
	if (mustScore !== null && mustScore >= 2) {
		push('F-HIGH-MALNUTRITION-RISK-001', 'high-malnutrition-risk', 'high', 'nutrition',
			`MUST score ${mustScore} indicates high malnutrition risk.`,
			'Dietitian referral, food fortification, and oral nutritional supplements; consider immunonutrition before major gastrointestinal surgery.');
	}

	// --- Fitness ------------------------------------------------------------------
	const mets = num(data.fitness.metabolicEquivalents);
	const dasi = num(data.fitness.dukeActivityStatusIndex);
	const walk = num(data.fitness.sixMinuteWalkMetres);
	const at = num(data.fitness.cpetAnaerobicThreshold);
	if ((mets !== null && mets < 4) || (dasi !== null && dasi < 34) ||
			(walk !== null && walk < 400) || (at !== null && at < 11)) {
		push('F-POOR-FUNCTIONAL-CAPACITY-001', 'poor-functional-capacity', 'medium', 'physical-fitness',
			'Functional capacity is below the perioperative threshold on at least one measure.',
			'Offer prehabilitation; consider cardiopulmonary exercise testing and enhanced perioperative care planning.');
	}

	// --- Frailty --------------------------------------------------------------------
	const cfs = num(data.frailty.clinicalFrailtyScale);
	if (cfs !== null && cfs >= 7) {
		push('F-SEVERE-FRAILTY-001', 'severe-frailty', 'high', '',
			`Clinical Frailty Scale ${cfs} indicates severe frailty.`,
			'Involve a perioperative medicine for older people service; revisit shared decision-making, including the option of not operating.');
	}
	if (cfs !== null && cfs >= 5 && data.frailty.miniCogPerformed !== 'yes') {
		push('F-COGNITIVE-ASSESSMENT-INDICATED-001', 'cognitive-assessment-indicated', 'medium', 'physical-fitness',
			`Clinical Frailty Scale ${cfs} — Mini-Cog not yet performed.`,
			'Perform a Mini-Cog and consider a Comprehensive Geriatric Assessment before surgery.');
	}

	// --- Frailty x GLP-1 receptor agonist intersecting risks --------------------------
	const { category: friedCategory } = computeFriedPhenotypeScore(data);
	const isFrail = friedCategory === 'frail' || (cfs !== null && cfs >= 5);
	if (onGlp1 && isFrail) {
		push('F-SARCOPENIA-RISK-001', 'sarcopenia-risk', 'medium', 'physical-fitness',
			'Frail patient on a GLP-1 receptor agonist — risk of accelerated sarcopenia from combined muscle and fat loss.',
			'Refer for protein supplementation and resistance-exercise prehabilitation before surgery.');
	}
	if (onGlp1 && data.medication.glp1GiSymptoms === 'yes' && isFrail) {
		push('F-DEHYDRATION-AKI-RISK-001', 'dehydration-aki-risk', 'high', 'medication',
			'Frail patient with GLP-1-related gastrointestinal symptoms plus fasting — elevated risk of dehydration, acute kidney injury, and delirium.',
			'Consider pre-admission intravenous fluids, minimise fasting duration, and monitor renal function and cognition closely.');
	}
	if (onGlp1 &&
			(data.medication.glp1HeldPerGuideline === 'yes' || data.medication.glp1ExtendedClearFluidsConfirmed === 'yes') &&
			data.glycaemic.insulinRegimen !== '') {
		push('F-REBOUND-GLYCAEMIC-RISK-001', 'rebound-glycaemic-risk', 'medium', 'glycaemic-control',
			'A GLP-1 receptor agonist was held or fasting extended in a patient on insulin — risk of rebound hyperglycaemia or hypoglycaemia.',
			'Agree a perioperative glycaemic monitoring and insulin-adjustment plan with the diabetes team.');
	}

	// --- Cardiorespiratory -------------------------------------------------------------
	const sbp = num(data.cardioresp.systolicBp);
	const dbp = num(data.cardioresp.diastolicBp);
	if ((sbp !== null && sbp >= 180) || (dbp !== null && dbp >= 110)) {
		push('F-UNCONTROLLED-HYPERTENSION-001', 'uncontrolled-hypertension', 'high', 'cardiorespiratory',
			`Blood pressure ${sbp ?? '—'}/${dbp ?? '—'} mmHg meets the deferral threshold of 180/110.`,
			'Repeat the measurement, review antihypertensive therapy, and defer elective surgery if it remains above threshold.');
	}
	const ef = num(data.cardioresp.ejectionFractionPercent);
	if (ef !== null && ef < 40) {
		push('F-CARDIAC-OPTIMIZATION-REQUIRED-001', 'cardiac-optimization-required', 'high', 'cardiorespiratory',
			`Ejection fraction ${ef}% is below 40%.`,
			'Cardiology review before surgery; consider enhanced perioperative care and postoperative critical care.');
	}
	const spo2 = num(data.cardioresp.oxygenSaturationPercent);
	if (data.cardioresp.asthmaControl === 'uncontrolled' ||
			data.cardioresp.copdControl === 'uncontrolled' ||
			(spo2 !== null && spo2 < 92)) {
		push('F-RESPIRATORY-OPTIMIZATION-REQUIRED-001', 'respiratory-optimization-required', 'high', 'cardiorespiratory',
			spo2 !== null && spo2 < 92
				? `Oxygen saturation ${spo2}% on room air is below 92%.`
				: 'Airways disease is uncontrolled.',
			'Respiratory review, inhaler technique and adherence check, and a rescue plan before surgery.');
	}
	const stopBang = num(data.cardioresp.stopBangScore);
	if (stopBang !== null && stopBang >= 5 && data.cardioresp.sleepApnoeaDiagnosis !== 'yes') {
		push('F-OSA-UNASSESSED-001', 'osa-unassessed', 'medium', 'cardiorespiratory',
			`STOP-BANG score ${stopBang} indicates a high probability of obstructive sleep apnoea, which has not been assessed.`,
			'Refer for a sleep study; plan postoperative monitoring and use opioids with caution.');
	}

	// --- Renal -----------------------------------------------------------------------
	const egfr = num(data.anaemia.egfrMlPerMin);
	if (egfr !== null && egfr < 30) {
		push('F-RENAL-OPTIMIZATION-REQUIRED-001', 'renal-optimization-required', 'high', '',
			`eGFR ${egfr} ml/min indicates severe renal impairment.`,
			'Renal review; check nephrotoxic medicines, contrast exposure, and fluid plan before surgery.');
	}

	// --- Anaesthetic history ------------------------------------------------------------
	if (data.history.previousAnaestheticComplication === 'yes' ||
			data.history.malignantHyperthermiaHistory === 'yes') {
		push('F-PRIOR-ANAESTHETIC-COMPLICATION-001', 'prior-anaesthetic-complication', 'high', '',
			data.history.malignantHyperthermiaHistory === 'yes'
				? 'A malignant hyperthermia history is recorded.'
				: `A previous anaesthetic complication is recorded${data.history.previousAnaestheticComplicationDetail ? `: ${data.history.previousAnaestheticComplicationDetail}` : ''}.`,
			'Retrieve the previous anaesthetic record and involve a consultant anaesthetist in planning well before the date.');
	}

	// --- Psychological and social ---------------------------------------------------------
	if (['moderate', 'severe'].includes(data.social.anxietyLevel) ||
			data.social.depressionScreen === 'positive') {
		push('F-PSYCHOLOGICAL-SUPPORT-REQUIRED-001', 'psychological-support-required', 'medium', '',
			data.social.depressionScreen === 'positive'
				? 'The depression screen is positive.'
				: `Anxiety about the procedure is ${data.social.anxietyLevel}.`,
			'Offer psychological support as part of multimodal prehabilitation; revisit the shared decision-making conversation.');
	}
	if (data.social.transportHomeArranged === 'no' || data.social.supportAfterDischarge === 'none') {
		push('F-SOCIAL-SUPPORT-GAP-001', 'social-support-gap', 'medium', '',
			data.social.transportHomeArranged === 'no'
				? 'No transport home has been arranged.'
				: 'No support is available after discharge.',
			'Resolve before the date; day-case surgery normally requires both transport and a responsible adult at home.');
	}

	// --- Capacity, life stage, safeguarding ------------------------------------------------
	if (data.frailty.capacityConcern === 'yes' ||
			['moderate', 'severe'].includes(data.frailty.cognitiveImpairment)) {
		push('F-CAPACITY-CONCERN-001', 'capacity-concern', 'medium', '',
			data.frailty.capacityConcern === 'yes'
				? 'A concern about capacity to consent is recorded.'
				: `${data.frailty.cognitiveImpairment === 'severe' ? 'Severe' : 'Moderate'} cognitive impairment is recorded.`,
			'Assess capacity for the specific decision, involve a carer or advocate, and plan for postoperative delirium risk.');
	}
	if (data.history.pregnancyStatus === 'pregnant') {
		push('F-PREGNANCY-001', 'pregnancy', 'high', '',
			'The patient is pregnant.',
			'Elective surgery is normally deferred. Involve obstetrics if the procedure cannot wait.');
	}
	if (age !== null && age < 16) {
		push('F-PAEDIATRIC-001', 'paediatric', 'high', '',
			`The patient is ${age} years old.`,
			'MUST and the Clinical Frailty Scale are not validated below 16 years. Use a paediatric perioperative pathway; treat the scores on this report as invalid.');
	}

	const priorityOrder: Record<FlagPriority, number> = { high: 0, medium: 1, low: 2 };
	return flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

