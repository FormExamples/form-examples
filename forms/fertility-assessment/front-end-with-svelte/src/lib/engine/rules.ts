// NICE CG156 Fertility Assessment scoring rules.
//
// Each rule contributes its weight to a numeric concern score when its
// condition is met. The grader sums fired rule weights to derive a Low /
// Moderate / High concern level. Rules cover: maternal age, duration trying,
// cycle regularity, ovarian reserve (AMH, AFC, FSH), prior pregnancy
// outcomes, BMI extremes, partner semen analysis (WHO 2021), known tubal or
// uterine factors, and partner age.

import type { AssessmentData, FertilityRule } from './types';
import { calculateAge } from './utils';

export const fertilityRules: FertilityRule[] = [
	// ─── Age ───────────────────────────────────────────────────
	{
		id: 'FERT-AGE-001',
		category: 'Age',
		description: 'Female partner age >= 36 — earlier referral threshold (NICE CG156)',
		weight: 2,
		evaluate: (d) => {
			const age = calculateAge(d.demographics.patientDateOfBirth);
			return age !== null && age >= 36;
		}
	},
	{
		id: 'FERT-AGE-002',
		category: 'Age',
		description: 'Female partner age >= 40 — significant age-related decline',
		weight: 2,
		evaluate: (d) => {
			const age = calculateAge(d.demographics.patientDateOfBirth);
			return age !== null && age >= 40;
		}
	},
	{
		id: 'FERT-AGE-003',
		category: 'Age',
		description: 'Male partner age >= 45 — paternal age effects',
		weight: 1,
		evaluate: (d) => {
			const direct = d.partnerSemen.partnerAgeYears;
			const age = direct ?? calculateAge(d.demographics.partnerDateOfBirth);
			return age !== null && age >= 45;
		}
	},

	// ─── Duration trying ──────────────────────────────────────
	{
		id: 'FERT-DUR-001',
		category: 'Duration',
		description: 'Trying to conceive >= 12 months — investigation indicated',
		weight: 1,
		evaluate: (d) =>
			d.reproductiveHistory.durationTryingMonths !== null &&
			d.reproductiveHistory.durationTryingMonths >= 12
	},
	{
		id: 'FERT-DUR-002',
		category: 'Duration',
		description: 'Trying >= 6 months and female partner >= 36 — earlier investigation',
		weight: 1,
		evaluate: (d) => {
			const age = calculateAge(d.demographics.patientDateOfBirth);
			return (
				d.reproductiveHistory.durationTryingMonths !== null &&
				d.reproductiveHistory.durationTryingMonths >= 6 &&
				age !== null &&
				age >= 36
			);
		}
	},
	{
		id: 'FERT-DUR-003',
		category: 'Duration',
		description: 'Trying >= 24 months — prolonged sub-fertility',
		weight: 2,
		evaluate: (d) =>
			d.reproductiveHistory.durationTryingMonths !== null &&
			d.reproductiveHistory.durationTryingMonths >= 24
	},

	// ─── Cycle regularity ─────────────────────────────────────
	{
		id: 'FERT-CYC-001',
		category: 'Menstrual Cycle',
		description: 'Irregular menstrual cycles — possible anovulation',
		weight: 2,
		evaluate: (d) => d.menstrualCycle.cycleRegularity === 'irregular'
	},
	{
		id: 'FERT-CYC-002',
		category: 'Menstrual Cycle',
		description: 'Absent menstrual cycles (amenorrhoea) — likely anovulation',
		weight: 3,
		evaluate: (d) => d.menstrualCycle.cycleRegularity === 'absent'
	},
	{
		id: 'FERT-CYC-003',
		category: 'Menstrual Cycle',
		description: 'Cycle length outside 21-35 days — abnormal cycle length',
		weight: 1,
		evaluate: (d) =>
			d.menstrualCycle.cycleLengthDays !== null &&
			(d.menstrualCycle.cycleLengthDays < 21 || d.menstrualCycle.cycleLengthDays > 35)
	},

	// ─── Ovarian reserve ──────────────────────────────────────
	{
		id: 'FERT-OR-001',
		category: 'Ovarian Reserve',
		description: 'AMH < 5.4 pmol/L — low ovarian reserve (NICE)',
		weight: 3,
		evaluate: (d) => d.hormoneProfile.amh !== null && d.hormoneProfile.amh < 5.4
	},
	{
		id: 'FERT-OR-002',
		category: 'Ovarian Reserve',
		description: 'AMH 5.4-15.0 pmol/L — borderline ovarian reserve',
		weight: 1,
		evaluate: (d) =>
			d.hormoneProfile.amh !== null &&
			d.hormoneProfile.amh >= 5.4 &&
			d.hormoneProfile.amh < 15.0
	},
	{
		id: 'FERT-OR-003',
		category: 'Ovarian Reserve',
		description: 'Day-2/3 FSH > 8.9 IU/L — reduced ovarian reserve (NICE)',
		weight: 2,
		evaluate: (d) => d.hormoneProfile.fsh !== null && d.hormoneProfile.fsh > 8.9
	},
	{
		id: 'FERT-OR-004',
		category: 'Ovarian Reserve',
		description: 'Antral follicle count < 7 — low ovarian reserve (NICE)',
		weight: 2,
		evaluate: (d) =>
			d.investigations.antralFollicleCount !== null &&
			d.investigations.antralFollicleCount < 7
	},

	// ─── Hormonal abnormalities ───────────────────────────────
	{
		id: 'FERT-HOR-001',
		category: 'Hormonal',
		description: 'Hyperprolactinaemia (prolactin > 500 mIU/L)',
		weight: 2,
		evaluate: (d) => d.hormoneProfile.prolactin !== null && d.hormoneProfile.prolactin > 500
	},
	{
		id: 'FERT-HOR-002',
		category: 'Hormonal',
		description: 'TSH outside 0.4-2.5 mIU/L — thyroid dysfunction affecting fertility',
		weight: 1,
		evaluate: (d) =>
			d.hormoneProfile.tsh !== null &&
			(d.hormoneProfile.tsh < 0.4 || d.hormoneProfile.tsh > 2.5)
	},
	{
		id: 'FERT-HOR-003',
		category: 'Hormonal',
		description: 'Day-21 progesterone < 30 nmol/L — likely anovulatory cycle',
		weight: 2,
		evaluate: (d) =>
			d.hormoneProfile.progesteroneDay21 !== null &&
			d.hormoneProfile.progesteroneDay21 < 30
	},

	// ─── Reproductive history ─────────────────────────────────
	{
		id: 'FERT-RH-001',
		category: 'Reproductive History',
		description: 'Recurrent miscarriage (>= 3 prior miscarriages)',
		weight: 2,
		evaluate: (d) =>
			d.reproductiveHistory.priorMiscarriages !== null &&
			d.reproductiveHistory.priorMiscarriages >= 3
	},
	{
		id: 'FERT-RH-002',
		category: 'Reproductive History',
		description: 'Prior ectopic pregnancy — possible tubal damage',
		weight: 2,
		evaluate: (d) =>
			d.reproductiveHistory.priorEctopic !== null && d.reproductiveHistory.priorEctopic >= 1
	},

	// ─── BMI ──────────────────────────────────────────────────
	{
		id: 'FERT-BMI-001',
		category: 'Lifestyle',
		description: 'BMI < 19 — underweight, may impair ovulation',
		weight: 1,
		evaluate: (d) => d.lifestyleFactors.bmi !== null && d.lifestyleFactors.bmi < 19
	},
	{
		id: 'FERT-BMI-002',
		category: 'Lifestyle',
		description: 'BMI >= 30 — obesity, reduces fertility and ART success',
		weight: 2,
		evaluate: (d) => d.lifestyleFactors.bmi !== null && d.lifestyleFactors.bmi >= 30
	},
	{
		id: 'FERT-BMI-003',
		category: 'Lifestyle',
		description: 'BMI >= 35 — significant obesity, NICE recommends weight loss before ART',
		weight: 1,
		evaluate: (d) => d.lifestyleFactors.bmi !== null && d.lifestyleFactors.bmi >= 35
	},

	// ─── Pelvic / surgical history ────────────────────────────
	{
		id: 'FERT-PEL-001',
		category: 'Pelvic History',
		description: 'Pelvic inflammatory disease — risk of tubal damage',
		weight: 2,
		evaluate: (d) => d.medicalSurgicalHistory.pelvicInflammatoryDisease === 'yes'
	},
	{
		id: 'FERT-PEL-002',
		category: 'Pelvic History',
		description: 'Diagnosed endometriosis',
		weight: 2,
		evaluate: (d) => d.medicalSurgicalHistory.endometriosis === 'yes'
	},
	{
		id: 'FERT-PEL-003',
		category: 'Pelvic History',
		description: 'Polycystic ovary syndrome (PCOS)',
		weight: 1,
		evaluate: (d) => d.medicalSurgicalHistory.polycysticOvarySyndrome === 'yes'
	},
	{
		id: 'FERT-PEL-004',
		category: 'Pelvic History',
		description: 'Uterine fibroids',
		weight: 1,
		evaluate: (d) => d.medicalSurgicalHistory.fibroids === 'yes'
	},
	{
		id: 'FERT-PEL-005',
		category: 'Pelvic History',
		description: 'Prior pelvic surgery — possible adhesions',
		weight: 1,
		evaluate: (d) => d.medicalSurgicalHistory.pelvicSurgery === 'yes'
	},

	// ─── Tubal investigations ─────────────────────────────────
	{
		id: 'FERT-TUB-001',
		category: 'Tubal',
		description: 'Hysterosalpingogram showed tubal blockage / abnormality',
		weight: 3,
		evaluate: (d) =>
			d.investigations.hysterosalpingogramDone === 'yes' &&
			d.investigations.hysterosalpingogramResult === 'abnormal'
	},
	{
		id: 'FERT-TUB-002',
		category: 'Tubal',
		description: 'Laparoscopy showed pelvic abnormality',
		weight: 2,
		evaluate: (d) =>
			d.investigations.laparoscopyDone === 'yes' &&
			d.investigations.laparoscopyResult === 'abnormal'
	},
	{
		id: 'FERT-TUB-003',
		category: 'Tubal',
		description: 'Hysteroscopy showed uterine cavity abnormality',
		weight: 1,
		evaluate: (d) =>
			d.investigations.hysteroscopyDone === 'yes' &&
			d.investigations.hysteroscopyResult === 'abnormal'
	},

	// ─── Semen analysis (WHO 2021 lower reference limits) ────
	{
		id: 'FERT-SEM-001',
		category: 'Semen Analysis',
		description: 'Semen volume < 1.4 mL (below WHO 2021 lower reference limit)',
		weight: 1,
		evaluate: (d) =>
			d.partnerSemen.semenAnalysisDone === 'yes' &&
			d.partnerSemen.semenVolumeMl !== null &&
			d.partnerSemen.semenVolumeMl < 1.4
	},
	{
		id: 'FERT-SEM-002',
		category: 'Semen Analysis',
		description: 'Sperm concentration < 16 million/mL (below WHO 2021 LRL) — oligozoospermia',
		weight: 2,
		evaluate: (d) =>
			d.partnerSemen.semenAnalysisDone === 'yes' &&
			d.partnerSemen.semenConcentrationMillionPerMl !== null &&
			d.partnerSemen.semenConcentrationMillionPerMl < 16
	},
	{
		id: 'FERT-SEM-003',
		category: 'Semen Analysis',
		description: 'Total motility < 42% (below WHO 2021 LRL) — asthenozoospermia',
		weight: 2,
		evaluate: (d) =>
			d.partnerSemen.semenAnalysisDone === 'yes' &&
			d.partnerSemen.semenTotalMotilityPercent !== null &&
			d.partnerSemen.semenTotalMotilityPercent < 42
	},
	{
		id: 'FERT-SEM-004',
		category: 'Semen Analysis',
		description: 'Progressive motility < 30% (below WHO 2021 LRL)',
		weight: 1,
		evaluate: (d) =>
			d.partnerSemen.semenAnalysisDone === 'yes' &&
			d.partnerSemen.semenProgressiveMotilityPercent !== null &&
			d.partnerSemen.semenProgressiveMotilityPercent < 30
	},
	{
		id: 'FERT-SEM-005',
		category: 'Semen Analysis',
		description: 'Normal morphology < 4% (below WHO 2021 LRL) — teratozoospermia',
		weight: 2,
		evaluate: (d) =>
			d.partnerSemen.semenAnalysisDone === 'yes' &&
			d.partnerSemen.semenNormalMorphologyPercent !== null &&
			d.partnerSemen.semenNormalMorphologyPercent < 4
	},
	{
		id: 'FERT-SEM-006',
		category: 'Semen Analysis',
		description: 'Severe oligozoospermia (< 5 million/mL) — likely ICSI required',
		weight: 2,
		evaluate: (d) =>
			d.partnerSemen.semenAnalysisDone === 'yes' &&
			d.partnerSemen.semenConcentrationMillionPerMl !== null &&
			d.partnerSemen.semenConcentrationMillionPerMl < 5
	},

	// ─── Partner lifestyle ────────────────────────────────────
	{
		id: 'FERT-PT-001',
		category: 'Partner Lifestyle',
		description: 'Male partner currently smokes — impairs sperm quality',
		weight: 1,
		evaluate: (d) => d.partnerSemen.partnerSmoking === 'current'
	},

	// ─── Patient lifestyle ────────────────────────────────────
	{
		id: 'FERT-LIFE-001',
		category: 'Lifestyle',
		description: 'Patient currently smokes — reduces fertility and ART success',
		weight: 2,
		evaluate: (d) => d.lifestyleFactors.tobaccoStatus === 'current'
	},
	{
		id: 'FERT-LIFE-002',
		category: 'Lifestyle',
		description: 'Heavy alcohol intake — impairs fertility',
		weight: 1,
		evaluate: (d) => d.lifestyleFactors.alcoholLevel === 'heavy'
	},
	{
		id: 'FERT-LIFE-003',
		category: 'Lifestyle',
		description: 'Recreational drug use — impairs fertility',
		weight: 1,
		evaluate: (d: AssessmentData) => d.lifestyleFactors.recreationalDrugs === 'yes'
	}
];
