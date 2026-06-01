use super::types::AssessmentData;
use super::utils::age_in_years;

/// A declarative fertility rule. Each rule contributes its `weight` to the
/// total concern score when its evaluation function returns true.
pub struct FertilityRule {
    pub id: &'static str,
    pub category: &'static str,
    pub description: &'static str,
    pub weight: i32,
    pub evaluate: fn(&AssessmentData) -> bool,
}

/// All NICE CG156 fertility-assessment rules. Each rule fires when its
/// risk condition is met; rule IDs are stable identifiers matching the
/// front-end engine for cross-platform consistency.
pub fn all_rules() -> Vec<FertilityRule> {
    vec![
        // ─── Age ───────────────────────────────────────────────────
        FertilityRule {
            id: "FERT-AGE-001",
            category: "Age",
            description: "Female partner age >= 36 — earlier referral threshold (NICE CG156)",
            weight: 2,
            evaluate: |d| {
                age_in_years(&d.demographics.patient_date_of_birth)
                    .is_some_and(|a| a >= 36)
            },
        },
        FertilityRule {
            id: "FERT-AGE-002",
            category: "Age",
            description: "Female partner age >= 40 — significant age-related decline",
            weight: 2,
            evaluate: |d| {
                age_in_years(&d.demographics.patient_date_of_birth)
                    .is_some_and(|a| a >= 40)
            },
        },
        FertilityRule {
            id: "FERT-AGE-003",
            category: "Age",
            description: "Male partner age >= 45 — paternal age effects",
            weight: 1,
            evaluate: |d| {
                let age = d
                    .partner_semen
                    .partner_age_years
                    .or_else(|| age_in_years(&d.demographics.partner_date_of_birth));
                age.is_some_and(|a| a >= 45)
            },
        },
        // ─── Duration trying ──────────────────────────────────────
        FertilityRule {
            id: "FERT-DUR-001",
            category: "Duration",
            description: "Trying to conceive >= 12 months — investigation indicated",
            weight: 1,
            evaluate: |d| {
                d.reproductive_history
                    .duration_trying_months
                    .is_some_and(|m| m >= 12)
            },
        },
        FertilityRule {
            id: "FERT-DUR-002",
            category: "Duration",
            description: "Trying >= 6 months and female partner >= 36 — earlier investigation",
            weight: 1,
            evaluate: |d| {
                let dur_ok = d
                    .reproductive_history
                    .duration_trying_months
                    .is_some_and(|m| m >= 6);
                let age_ok = age_in_years(&d.demographics.patient_date_of_birth)
                    .is_some_and(|a| a >= 36);
                dur_ok && age_ok
            },
        },
        FertilityRule {
            id: "FERT-DUR-003",
            category: "Duration",
            description: "Trying >= 24 months — prolonged sub-fertility",
            weight: 2,
            evaluate: |d| {
                d.reproductive_history
                    .duration_trying_months
                    .is_some_and(|m| m >= 24)
            },
        },
        // ─── Cycle regularity ─────────────────────────────────────
        FertilityRule {
            id: "FERT-CYC-001",
            category: "Menstrual Cycle",
            description: "Irregular menstrual cycles — possible anovulation",
            weight: 2,
            evaluate: |d| d.menstrual_cycle.cycle_regularity == "irregular",
        },
        FertilityRule {
            id: "FERT-CYC-002",
            category: "Menstrual Cycle",
            description: "Absent menstrual cycles (amenorrhoea) — likely anovulation",
            weight: 3,
            evaluate: |d| d.menstrual_cycle.cycle_regularity == "absent",
        },
        FertilityRule {
            id: "FERT-CYC-003",
            category: "Menstrual Cycle",
            description: "Cycle length outside 21-35 days — abnormal cycle length",
            weight: 1,
            evaluate: |d| {
                d.menstrual_cycle
                    .cycle_length_days
                    .is_some_and(|c| c < 21 || c > 35)
            },
        },
        // ─── Ovarian reserve ──────────────────────────────────────
        FertilityRule {
            id: "FERT-OR-001",
            category: "Ovarian Reserve",
            description: "AMH < 5.4 pmol/L — low ovarian reserve (NICE)",
            weight: 3,
            evaluate: |d| d.hormone_profile.amh.is_some_and(|v| v < 5.4),
        },
        FertilityRule {
            id: "FERT-OR-002",
            category: "Ovarian Reserve",
            description: "AMH 5.4-15.0 pmol/L — borderline ovarian reserve",
            weight: 1,
            evaluate: |d| {
                d.hormone_profile
                    .amh
                    .is_some_and(|v| (5.4..15.0).contains(&v))
            },
        },
        FertilityRule {
            id: "FERT-OR-003",
            category: "Ovarian Reserve",
            description: "Day-2/3 FSH > 8.9 IU/L — reduced ovarian reserve (NICE)",
            weight: 2,
            evaluate: |d| d.hormone_profile.fsh.is_some_and(|v| v > 8.9),
        },
        FertilityRule {
            id: "FERT-OR-004",
            category: "Ovarian Reserve",
            description: "Antral follicle count < 7 — low ovarian reserve (NICE)",
            weight: 2,
            evaluate: |d| {
                d.investigations
                    .antral_follicle_count
                    .is_some_and(|c| c < 7)
            },
        },
        // ─── Hormonal abnormalities ───────────────────────────────
        FertilityRule {
            id: "FERT-HOR-001",
            category: "Hormonal",
            description: "Hyperprolactinaemia (prolactin > 500 mIU/L)",
            weight: 2,
            evaluate: |d| d.hormone_profile.prolactin.is_some_and(|v| v > 500.0),
        },
        FertilityRule {
            id: "FERT-HOR-002",
            category: "Hormonal",
            description: "TSH outside 0.4-2.5 mIU/L — thyroid dysfunction affecting fertility",
            weight: 1,
            evaluate: |d| {
                d.hormone_profile
                    .tsh
                    .is_some_and(|v| v < 0.4 || v > 2.5)
            },
        },
        FertilityRule {
            id: "FERT-HOR-003",
            category: "Hormonal",
            description: "Day-21 progesterone < 30 nmol/L — likely anovulatory cycle",
            weight: 2,
            evaluate: |d| {
                d.hormone_profile
                    .progesterone_day21
                    .is_some_and(|v| v < 30.0)
            },
        },
        // ─── Reproductive history ─────────────────────────────────
        FertilityRule {
            id: "FERT-RH-001",
            category: "Reproductive History",
            description: "Recurrent miscarriage (>= 3 prior miscarriages)",
            weight: 2,
            evaluate: |d| {
                d.reproductive_history
                    .prior_miscarriages
                    .is_some_and(|n| n >= 3)
            },
        },
        FertilityRule {
            id: "FERT-RH-002",
            category: "Reproductive History",
            description: "Prior ectopic pregnancy — possible tubal damage",
            weight: 2,
            evaluate: |d| {
                d.reproductive_history
                    .prior_ectopic
                    .is_some_and(|n| n >= 1)
            },
        },
        // ─── BMI ──────────────────────────────────────────────────
        FertilityRule {
            id: "FERT-BMI-001",
            category: "Lifestyle",
            description: "BMI < 19 — underweight, may impair ovulation",
            weight: 1,
            evaluate: |d| d.lifestyle_factors.bmi.is_some_and(|v| v < 19.0),
        },
        FertilityRule {
            id: "FERT-BMI-002",
            category: "Lifestyle",
            description: "BMI >= 30 — obesity, reduces fertility and ART success",
            weight: 2,
            evaluate: |d| d.lifestyle_factors.bmi.is_some_and(|v| v >= 30.0),
        },
        FertilityRule {
            id: "FERT-BMI-003",
            category: "Lifestyle",
            description:
                "BMI >= 35 — significant obesity, NICE recommends weight loss before ART",
            weight: 1,
            evaluate: |d| d.lifestyle_factors.bmi.is_some_and(|v| v >= 35.0),
        },
        // ─── Pelvic / surgical history ────────────────────────────
        FertilityRule {
            id: "FERT-PEL-001",
            category: "Pelvic History",
            description: "Pelvic inflammatory disease — risk of tubal damage",
            weight: 2,
            evaluate: |d| d.medical_surgical_history.pelvic_inflammatory_disease == "yes",
        },
        FertilityRule {
            id: "FERT-PEL-002",
            category: "Pelvic History",
            description: "Diagnosed endometriosis",
            weight: 2,
            evaluate: |d| d.medical_surgical_history.endometriosis == "yes",
        },
        FertilityRule {
            id: "FERT-PEL-003",
            category: "Pelvic History",
            description: "Polycystic ovary syndrome (PCOS)",
            weight: 1,
            evaluate: |d| d.medical_surgical_history.polycystic_ovary_syndrome == "yes",
        },
        FertilityRule {
            id: "FERT-PEL-004",
            category: "Pelvic History",
            description: "Uterine fibroids",
            weight: 1,
            evaluate: |d| d.medical_surgical_history.fibroids == "yes",
        },
        FertilityRule {
            id: "FERT-PEL-005",
            category: "Pelvic History",
            description: "Prior pelvic surgery — possible adhesions",
            weight: 1,
            evaluate: |d| d.medical_surgical_history.pelvic_surgery == "yes",
        },
        // ─── Tubal investigations ─────────────────────────────────
        FertilityRule {
            id: "FERT-TUB-001",
            category: "Tubal",
            description: "Hysterosalpingogram showed tubal blockage / abnormality",
            weight: 3,
            evaluate: |d| {
                d.investigations.hysterosalpingogram_done == "yes"
                    && d.investigations.hysterosalpingogram_result == "abnormal"
            },
        },
        FertilityRule {
            id: "FERT-TUB-002",
            category: "Tubal",
            description: "Laparoscopy showed pelvic abnormality",
            weight: 2,
            evaluate: |d| {
                d.investigations.laparoscopy_done == "yes"
                    && d.investigations.laparoscopy_result == "abnormal"
            },
        },
        FertilityRule {
            id: "FERT-TUB-003",
            category: "Tubal",
            description: "Hysteroscopy showed uterine cavity abnormality",
            weight: 1,
            evaluate: |d| {
                d.investigations.hysteroscopy_done == "yes"
                    && d.investigations.hysteroscopy_result == "abnormal"
            },
        },
        // ─── Semen analysis (WHO 2021 lower reference limits) ────
        FertilityRule {
            id: "FERT-SEM-001",
            category: "Semen Analysis",
            description: "Semen volume < 1.4 mL (below WHO 2021 lower reference limit)",
            weight: 1,
            evaluate: |d| {
                d.partner_semen.semen_analysis_done == "yes"
                    && d.partner_semen.semen_volume_ml.is_some_and(|v| v < 1.4)
            },
        },
        FertilityRule {
            id: "FERT-SEM-002",
            category: "Semen Analysis",
            description:
                "Sperm concentration < 16 million/mL (below WHO 2021 LRL) — oligozoospermia",
            weight: 2,
            evaluate: |d| {
                d.partner_semen.semen_analysis_done == "yes"
                    && d.partner_semen
                        .semen_concentration_million_per_ml
                        .is_some_and(|v| v < 16.0)
            },
        },
        FertilityRule {
            id: "FERT-SEM-003",
            category: "Semen Analysis",
            description: "Total motility < 42% (below WHO 2021 LRL) — asthenozoospermia",
            weight: 2,
            evaluate: |d| {
                d.partner_semen.semen_analysis_done == "yes"
                    && d.partner_semen
                        .semen_total_motility_percent
                        .is_some_and(|v| v < 42.0)
            },
        },
        FertilityRule {
            id: "FERT-SEM-004",
            category: "Semen Analysis",
            description: "Progressive motility < 30% (below WHO 2021 LRL)",
            weight: 1,
            evaluate: |d| {
                d.partner_semen.semen_analysis_done == "yes"
                    && d.partner_semen
                        .semen_progressive_motility_percent
                        .is_some_and(|v| v < 30.0)
            },
        },
        FertilityRule {
            id: "FERT-SEM-005",
            category: "Semen Analysis",
            description: "Normal morphology < 4% (below WHO 2021 LRL) — teratozoospermia",
            weight: 2,
            evaluate: |d| {
                d.partner_semen.semen_analysis_done == "yes"
                    && d.partner_semen
                        .semen_normal_morphology_percent
                        .is_some_and(|v| v < 4.0)
            },
        },
        FertilityRule {
            id: "FERT-SEM-006",
            category: "Semen Analysis",
            description: "Severe oligozoospermia (< 5 million/mL) — likely ICSI required",
            weight: 2,
            evaluate: |d| {
                d.partner_semen.semen_analysis_done == "yes"
                    && d.partner_semen
                        .semen_concentration_million_per_ml
                        .is_some_and(|v| v < 5.0)
            },
        },
        // ─── Partner lifestyle ────────────────────────────────────
        FertilityRule {
            id: "FERT-PT-001",
            category: "Partner Lifestyle",
            description: "Male partner currently smokes — impairs sperm quality",
            weight: 1,
            evaluate: |d| d.partner_semen.partner_smoking == "current",
        },
        // ─── Patient lifestyle ────────────────────────────────────
        FertilityRule {
            id: "FERT-LIFE-001",
            category: "Lifestyle",
            description: "Patient currently smokes — reduces fertility and ART success",
            weight: 2,
            evaluate: |d| d.lifestyle_factors.tobacco_status == "current",
        },
        FertilityRule {
            id: "FERT-LIFE-002",
            category: "Lifestyle",
            description: "Heavy alcohol intake — impairs fertility",
            weight: 1,
            evaluate: |d| d.lifestyle_factors.alcohol_level == "heavy",
        },
        FertilityRule {
            id: "FERT-LIFE-003",
            category: "Lifestyle",
            description: "Recreational drug use — impairs fertility",
            weight: 1,
            evaluate: |d| d.lifestyle_factors.recreational_drugs == "yes",
        },
    ]
}
