import type { AssessmentData, AdditionalFlag } from './types';

// Flagged-issue detection for the endocrinology assessment.
//
// Independent of axis grading, this module raises clinician-facing flags for
// urgent / high-priority conditions: severe biochemical abnormalities,
// hyperprolactinaemia with visual disturbance, adrenal insufficiency,
// thyroid storm features, severe hypercalcaemia, fragility-fracture history,
// current steroid use, and lifestyle / family-history items.

export function detectAdditionalFlags(data: AssessmentData): AdditionalFlag[] {
	const flags: AdditionalFlag[] = [];

	// ─── Thyroid alerts ───────────────────────────────────────
	const t = data.thyroidAxis;
	if (t.tsh !== null && t.tsh < 0.1 && t.ft4 !== null && t.ft4 > 25) {
		flags.push({
			id: 'FLAG-THY-001',
			category: 'Thyroid',
			message: 'Suppressed TSH with elevated FT4 — overt thyrotoxicosis; assess for thyroid storm.',
			priority: 'urgent'
		});
	}
	if (t.tsh !== null && t.tsh > 10) {
		flags.push({
			id: 'FLAG-THY-002',
			category: 'Thyroid',
			message: `TSH ${t.tsh} mIU/L — overt hypothyroidism; commence levothyroxine titration.`,
			priority: 'high'
		});
	}
	if (t.antibodiesPositive === 'yes') {
		flags.push({
			id: 'FLAG-THY-003',
			category: 'Thyroid',
			message: 'Positive thyroid autoantibodies — autoimmune thyroid disease likely.',
			priority: 'medium'
		});
	}

	// ─── Adrenal alerts ───────────────────────────────────────
	const a = data.adrenalAxis;
	if (a.morningCortisol !== null && a.morningCortisol < 100) {
		flags.push({
			id: 'FLAG-ADR-001',
			category: 'Adrenal',
			message: `Morning cortisol ${a.morningCortisol} nmol/L — adrenal insufficiency suspected; arrange short Synacthen test.`,
			priority: 'urgent'
		});
	}
	if (a.hyperpigmentation === 'yes' && a.posturalHypotension === 'yes') {
		flags.push({
			id: 'FLAG-ADR-002',
			category: 'Adrenal',
			message: 'Hyperpigmentation with postural hypotension — Addison’s disease screen recommended.',
			priority: 'high'
		});
	}
	if (a.cushingoidFeatures === 'yes') {
		flags.push({
			id: 'FLAG-ADR-003',
			category: 'Adrenal',
			message: 'Cushingoid features — overnight dexamethasone suppression or 24-hour urinary cortisol indicated.',
			priority: 'high'
		});
	}

	// ─── Glucose alerts ───────────────────────────────────────
	const g = data.glucoseMetabolism;
	if (g.hba1c !== null && g.hba1c >= 75) {
		flags.push({
			id: 'FLAG-GLU-001',
			category: 'Glucose',
			message: `HbA1c ${g.hba1c} mmol/mol — markedly poor glycaemic control; urgent step-up required.`,
			priority: 'high'
		});
	}
	if (g.randomGlucose !== null && g.randomGlucose >= 20) {
		flags.push({
			id: 'FLAG-GLU-002',
			category: 'Glucose',
			message: `Random glucose ${g.randomGlucose} mmol/L — assess for hyperosmolar / DKA.`,
			priority: 'urgent'
		});
	}
	if (g.hypoglycaemiaEpisodes === 'yes') {
		flags.push({
			id: 'FLAG-GLU-003',
			category: 'Glucose',
			message: 'Hypoglycaemic episodes reported — review insulin/sulfonylurea regimen and education.',
			priority: 'high'
		});
	}

	// ─── Pituitary alerts ─────────────────────────────────────
	const p = data.pituitaryFunction;
	if (p.visualDisturbance === 'yes') {
		flags.push({
			id: 'FLAG-PIT-001',
			category: 'Pituitary',
			message: 'Visual disturbance — urgent pituitary MRI and formal visual fields indicated.',
			priority: 'urgent'
		});
	}
	if (p.prolactin !== null && p.prolactin > 5000) {
		flags.push({
			id: 'FLAG-PIT-002',
			category: 'Pituitary',
			message: `Prolactin ${p.prolactin} mU/L — macroprolactinoma range; pituitary MRI required.`,
			priority: 'urgent'
		});
	}
	if (p.acromegalicFeatures === 'yes') {
		flags.push({
			id: 'FLAG-PIT-003',
			category: 'Pituitary',
			message: 'Acromegalic features — IGF-1 and OGTT suppression test indicated.',
			priority: 'high'
		});
	}

	// ─── Bone & calcium alerts ────────────────────────────────
	const b = data.boneCalcium;
	if (b.calciumCorrected !== null && b.calciumCorrected > 3.0) {
		flags.push({
			id: 'FLAG-BON-001',
			category: 'Bone & Calcium',
			message: `Corrected calcium ${b.calciumCorrected} mmol/L — severe hypercalcaemia; admit for IV fluids.`,
			priority: 'urgent'
		});
	} else if (b.calciumCorrected !== null && b.calciumCorrected > 2.6) {
		flags.push({
			id: 'FLAG-BON-002',
			category: 'Bone & Calcium',
			message: `Corrected calcium ${b.calciumCorrected} mmol/L — hypercalcaemia; investigate primary hyperparathyroidism.`,
			priority: 'high'
		});
	}
	if (b.calciumCorrected !== null && b.calciumCorrected < 1.9) {
		flags.push({
			id: 'FLAG-BON-003',
			category: 'Bone & Calcium',
			message: `Corrected calcium ${b.calciumCorrected} mmol/L — severe hypocalcaemia; urgent IV calcium.`,
			priority: 'urgent'
		});
	}
	if (b.fragilityFracture === 'yes') {
		flags.push({
			id: 'FLAG-BON-004',
			category: 'Bone & Calcium',
			message: 'Fragility fracture history — DEXA and fracture-risk assessment required.',
			priority: 'high'
		});
	}
	if (b.vitaminD !== null && b.vitaminD < 25) {
		flags.push({
			id: 'FLAG-BON-005',
			category: 'Bone & Calcium',
			message: `Vitamin D ${b.vitaminD} nmol/L — deficient; loading dose then maintenance.`,
			priority: 'medium'
		});
	}

	// ─── Reproductive alerts ──────────────────────────────────
	const r = data.reproductiveAxis;
	if (r.galactorrhoea === 'yes') {
		flags.push({
			id: 'FLAG-REP-001',
			category: 'Reproductive',
			message: 'Galactorrhoea reported — measure prolactin, exclude pregnancy and medication causes.',
			priority: 'high'
		});
	}
	if (r.infertility === 'yes') {
		flags.push({
			id: 'FLAG-REP-002',
			category: 'Reproductive',
			message: 'Infertility concern — full reproductive endocrine work-up recommended.',
			priority: 'medium'
		});
	}

	// ─── Medications & lifestyle ──────────────────────────────
	const m = data.medicationsLifestyle;
	if (m.steroidUse === 'yes') {
		flags.push({
			id: 'FLAG-MED-001',
			category: 'Medications',
			message: 'Current systemic steroid use — consider HPA-axis suppression and bone protection.',
			priority: 'high'
		});
	}
	if (m.smoking === 'current') {
		flags.push({
			id: 'FLAG-LIF-001',
			category: 'Lifestyle',
			message: 'Active smoker — increases risk for thyroid eye disease, osteoporosis, and cardiovascular disease.',
			priority: 'medium'
		});
	}
	if (m.familyHistoryEndocrine && m.familyHistoryEndocrine.trim().length > 0) {
		flags.push({
			id: 'FLAG-FAM-001',
			category: 'Family History',
			message: `Family history of endocrine disease: ${m.familyHistoryEndocrine}.`,
			priority: 'low'
		});
	}

	// ─── Demographics / BMI ───────────────────────────────────
	if (data.demographics.bmi !== null && data.demographics.bmi >= 35) {
		flags.push({
			id: 'FLAG-DEM-001',
			category: 'Demographics',
			message: `BMI ${data.demographics.bmi} — severe obesity; metabolic risk amplified.`,
			priority: 'medium'
		});
	}

	// Sort: urgent > high > medium > low.
	const priorityOrder: Record<AdditionalFlag['priority'], number> = {
		urgent: 0,
		high: 1,
		medium: 2,
		low: 3
	};
	flags.sort((x, y) => priorityOrder[x.priority] - priorityOrder[y.priority]);

	return flags;
}
