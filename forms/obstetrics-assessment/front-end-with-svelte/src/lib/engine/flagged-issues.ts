import type { AssessmentData, AdditionalFlag } from './types';

/**
 * Flagged-issue detection. Independent of the NG201 risk stratification, this
 * raises clinician-facing flags for safeguarding, mental health, screening
 * abnormalities, fetal concerns, prophylaxis indications, and care-pathway
 * escalations.
 */
export function detectAdditionalFlags(data: AssessmentData): AdditionalFlag[] {
	const flags: AdditionalFlag[] = [];

	// ─── Urgent safeguarding / mental-health ──────────────────
	if (data.mentalHealthAssessment.selfHarmIdeation === 'yes') {
		flags.push({
			id: 'FLAG-MH-001',
			category: 'Mental Health',
			message: 'Self-harm or suicidal ideation disclosed - urgent perinatal mental health referral.',
			priority: 'urgent'
		});
	}

	if (data.lifestyleSocialFactors.domesticAbuse === 'yes') {
		flags.push({
			id: 'FLAG-SAFEGUARD-001',
			category: 'Safeguarding',
			message: 'Domestic abuse disclosed - follow local safeguarding pathway.',
			priority: 'urgent'
		});
	}

	if (data.lifestyleSocialFactors.safeguardingConcerns === 'yes') {
		flags.push({
			id: 'FLAG-SAFEGUARD-002',
			category: 'Safeguarding',
			message: 'Safeguarding concerns identified - refer to safeguarding midwife.',
			priority: 'urgent'
		});
	}

	// ─── High-priority fetal / obstetric ──────────────────────
	if (data.fetalAssessment.reducedFetalMovements === 'yes') {
		flags.push({
			id: 'FLAG-FETAL-001',
			category: 'Fetal Assessment',
			message: 'Reduced fetal movements - requires same-day assessment.',
			priority: 'urgent'
		});
	}

	if (data.fetalAssessment.growthConcern === 'yes') {
		flags.push({
			id: 'FLAG-FETAL-002',
			category: 'Fetal Assessment',
			message: `Fetal growth concern: ${data.fetalAssessment.growthConcernDetails || 'details not specified'}.`,
			priority: 'high'
		});
	}

	if (data.obstetricHistory.previousPreEclampsia === 'yes') {
		flags.push({
			id: 'FLAG-OBS-001',
			category: 'Obstetric History',
			message: 'Previous pre-eclampsia - low-dose aspirin prophylaxis from 12 weeks indicated.',
			priority: 'high'
		});
	}

	if (data.obstetricHistory.previousPretermBirth === 'yes') {
		flags.push({
			id: 'FLAG-OBS-002',
			category: 'Obstetric History',
			message: 'Previous preterm birth - consider cervical surveillance and progesterone.',
			priority: 'high'
		});
	}

	const sb = data.obstetricHistory.previousStillbirths;
	const nd = data.obstetricHistory.previousNeonatalDeaths;
	if ((sb != null && sb > 0) || (nd != null && nd > 0)) {
		flags.push({
			id: 'FLAG-OBS-003',
			category: 'Obstetric History',
			message: 'Previous stillbirth / neonatal death - bereavement support and consultant-led care.',
			priority: 'high'
		});
	}

	// ─── Medical / VTE / pre-existing ─────────────────────────
	if (data.medicalHistory.previousVte === 'yes' || data.medicalHistory.thrombophilia === 'yes') {
		flags.push({
			id: 'FLAG-VTE-001',
			category: 'Medical History',
			message: 'VTE history / thrombophilia - VTE risk assessment and LMWH prophylaxis review.',
			priority: 'high'
		});
	}

	if (data.medicalHistory.cardiacDisease === 'yes') {
		flags.push({
			id: 'FLAG-MED-001',
			category: 'Medical History',
			message: 'Cardiac disease - joint cardiology / obstetric care required.',
			priority: 'high'
		});
	}

	if (data.medicalHistory.preExistingDiabetes === 'yes') {
		flags.push({
			id: 'FLAG-MED-002',
			category: 'Medical History',
			message: 'Pre-existing diabetes - joint diabetes / obstetric clinic and high-dose folic acid.',
			priority: 'high'
		});
	}

	if (data.medicalHistory.chronicHypertension === 'yes') {
		flags.push({
			id: 'FLAG-MED-003',
			category: 'Medical History',
			message: 'Chronic hypertension - review antihypertensives, aspirin prophylaxis indicated.',
			priority: 'high'
		});
	}

	if (data.medicalHistory.renalDisease === 'yes') {
		flags.push({
			id: 'FLAG-MED-004',
			category: 'Medical History',
			message: 'Renal disease - joint nephrology / obstetric care.',
			priority: 'high'
		});
	}

	if (data.medicalHistory.hivPositive === 'yes') {
		flags.push({
			id: 'FLAG-MED-005',
			category: 'Medical History',
			message: 'HIV positive - liaison with HIV team for ART and delivery planning.',
			priority: 'high'
		});
	}

	// ─── Screening abnormalities ──────────────────────────────
	if (data.screeningResults.combinedTestResult === 'higher-chance') {
		flags.push({
			id: 'FLAG-SCREEN-001',
			category: 'Screening',
			message: 'Combined test higher chance - offer NIPT or diagnostic testing.',
			priority: 'high'
		});
	}

	if (data.screeningResults.gttResult === 'gdm-confirmed') {
		flags.push({
			id: 'FLAG-SCREEN-002',
			category: 'Screening',
			message: 'Gestational diabetes confirmed - refer to joint diabetes / antenatal clinic.',
			priority: 'high'
		});
	}

	if (data.screeningResults.anomalyScanFindings === 'abnormal') {
		flags.push({
			id: 'FLAG-SCREEN-003',
			category: 'Screening',
			message: 'Anomaly scan abnormal - fetal medicine referral.',
			priority: 'high'
		});
	}

	if (data.screeningResults.antibodyScreenPositive === 'yes') {
		flags.push({
			id: 'FLAG-SCREEN-004',
			category: 'Screening',
			message: 'Red-cell antibody screen positive - serial titres and fetal medicine input.',
			priority: 'high'
		});
	}

	if (data.screeningResults.infectionScreenAbnormal === 'yes') {
		flags.push({
			id: 'FLAG-SCREEN-005',
			category: 'Screening',
			message: `Infection screen abnormal: ${data.screeningResults.infectionScreenDetails || 'details not specified'}.`,
			priority: 'medium'
		});
	}

	// ─── Demographics / BMI / age ─────────────────────────────
	const bmi = data.maternalDemographics.bmi;
	if (bmi != null && bmi >= 35) {
		flags.push({
			id: 'FLAG-BMI-001',
			category: 'Body Mass Index',
			message: `BMI ${bmi} - obstetric anaesthetic review and VTE / GDM screening.`,
			priority: 'high'
		});
	} else if (bmi != null && bmi >= 30) {
		flags.push({
			id: 'FLAG-BMI-002',
			category: 'Body Mass Index',
			message: `BMI ${bmi} - schedule GDM screening and discuss healthy weight.`,
			priority: 'medium'
		});
	} else if (bmi != null && bmi < 18.5) {
		flags.push({
			id: 'FLAG-BMI-003',
			category: 'Body Mass Index',
			message: `BMI ${bmi} - dietitian referral and growth surveillance.`,
			priority: 'medium'
		});
	}

	const age = data.maternalDemographics.ageAtBooking;
	if (age != null && age >= 40) {
		flags.push({
			id: 'FLAG-AGE-001',
			category: 'Maternal Age',
			message: 'Maternal age >=40 - increased risk of pre-eclampsia, GDM, and stillbirth.',
			priority: 'high'
		});
	}

	if (age != null && age < 18) {
		flags.push({
			id: 'FLAG-AGE-002',
			category: 'Maternal Age',
			message: 'Teenage pregnancy - consider Family Nurse Partnership / young-parent pathway.',
			priority: 'medium'
		});
	}

	// ─── Lifestyle ────────────────────────────────────────────
	if (data.lifestyleSocialFactors.smokingStatus === 'current') {
		flags.push({
			id: 'FLAG-SMOKE-001',
			category: 'Lifestyle',
			message: 'Current smoker - refer to smoking-cessation in pregnancy service.',
			priority: 'medium'
		});
	}

	if (
		data.lifestyleSocialFactors.substanceUse === 'occasional' ||
		data.lifestyleSocialFactors.substanceUse === 'regular'
	) {
		flags.push({
			id: 'FLAG-SUBSTANCE-001',
			category: 'Lifestyle',
			message: 'Substance use in pregnancy - specialist substance-misuse midwifery referral.',
			priority: 'high'
		});
	}

	if (data.lifestyleSocialFactors.alcoholUse === 'regular') {
		flags.push({
			id: 'FLAG-ALCOHOL-001',
			category: 'Lifestyle',
			message: 'Regular alcohol use - counsel re: fetal alcohol spectrum disorder, refer if needed.',
			priority: 'high'
		});
	}

	if (data.lifestyleSocialFactors.femaleGenitalMutilation === 'yes') {
		flags.push({
			id: 'FLAG-FGM-001',
			category: 'Safeguarding',
			message: 'FGM disclosed - mandatory reporting and specialist FGM clinic referral.',
			priority: 'high'
		});
	}

	// ─── Mental health (non-urgent) ───────────────────────────
	if (data.mentalHealthAssessment.previousSevereMentalIllness === 'yes') {
		flags.push({
			id: 'FLAG-MH-002',
			category: 'Mental Health',
			message: 'Previous severe mental illness - perinatal mental health team referral.',
			priority: 'high'
		});
	}

	if (
		data.mentalHealthAssessment.whooley1 === 'yes' &&
		data.mentalHealthAssessment.whooley2 === 'yes'
	) {
		flags.push({
			id: 'FLAG-MH-003',
			category: 'Mental Health',
			message: 'Both Whooley questions positive - consider perinatal mental health assessment.',
			priority: 'medium'
		});
	}

	if (data.mentalHealthAssessment.previousPostnatalDepression === 'yes') {
		flags.push({
			id: 'FLAG-MH-004',
			category: 'Mental Health',
			message: 'Previous postnatal depression - increased recurrence risk; document care plan.',
			priority: 'medium'
		});
	}

	// ─── Pregnancy / multiples / IVF ──────────────────────────
	if (data.currentPregnancy.multiplePregnancy === 'yes') {
		flags.push({
			id: 'FLAG-PREG-001',
			category: 'Current Pregnancy',
			message: `Multiple pregnancy${data.currentPregnancy.chorionicity ? ' (' + data.currentPregnancy.chorionicity + ')' : ''} - twin clinic and serial scans.`,
			priority: 'high'
		});
	}

	if (data.currentPregnancy.ivfConception === 'yes') {
		flags.push({
			id: 'FLAG-PREG-002',
			category: 'Current Pregnancy',
			message: 'Conceived via assisted reproduction - increased obstetric surveillance.',
			priority: 'low'
		});
	}

	// ─── Obstetric history (additional context) ───────────────
	if (data.obstetricHistory.previousCaesarean === 'yes') {
		const n = data.obstetricHistory.previousCaesareanCount;
		flags.push({
			id: 'FLAG-OBS-004',
			category: 'Obstetric History',
			message: `Previous caesarean${n != null ? ' (' + n + ')' : ''} - discuss VBAC vs. ERCS at 36 weeks.`,
			priority: 'medium'
		});
	}

	if (data.obstetricHistory.previousGestationalDiabetes === 'yes') {
		flags.push({
			id: 'FLAG-OBS-005',
			category: 'Obstetric History',
			message: 'Previous GDM - early OGTT (16-18 wks) and again at 24-28 wks.',
			priority: 'medium'
		});
	}

	if (data.obstetricHistory.previousPostpartumHaemorrhage === 'yes') {
		flags.push({
			id: 'FLAG-OBS-006',
			category: 'Obstetric History',
			message: 'Previous postpartum haemorrhage - active management of 3rd stage and group-and-save.',
			priority: 'medium'
		});
	}

	// Sort: urgent > high > medium > low
	const priorityOrder: Record<AdditionalFlag['priority'], number> = {
		urgent: 0,
		high: 1,
		medium: 2,
		low: 3
	};
	flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

	return flags;
}
