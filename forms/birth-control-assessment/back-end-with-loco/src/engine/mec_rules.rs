use super::types::AssessmentData;
use super::utils::calculate_age;

/// A declarative UK MEC grading rule.
///
/// Each rule evaluates patient data and returns `true` if the condition is
/// present. The rule then contributes a UK MEC category (1-4) to the listed
/// `affected_methods`. The worst (highest) category across all fired rules
/// wins for any given method.
pub struct MECRule {
    pub id: &'static str,
    pub category: &'static str,
    pub description: &'static str,
    pub mec_category: u8,
    pub affected_methods: &'static [&'static str],
    pub evaluate: fn(&AssessmentData) -> bool,
}

/// All UK MEC rules. MEC 1 = no restriction, 2 = advantages outweigh risks,
/// 3 = risks outweigh advantages, 4 = unacceptable risk.
pub fn all_rules() -> Vec<MECRule> {
    vec![
        // ─── THROMBOEMBOLISM ──────────────────────────────────────
        MECRule {
            id: "VTE-001",
            category: "Thromboembolism",
            description: "Previous DVT or PE (UK MEC 4 for COC)",
            mec_category: 4,
            affected_methods: &["coc"],
            evaluate: |d| {
                d.thromboembolism_risk.previous_dvt == "yes"
                    || d.thromboembolism_risk.previous_pe == "yes"
            },
        },
        MECRule {
            id: "VTE-002",
            category: "Thromboembolism",
            description: "Previous DVT or PE (UK MEC 2 for POP/implant)",
            mec_category: 2,
            affected_methods: &["pop", "implant"],
            evaluate: |d| {
                d.thromboembolism_risk.previous_dvt == "yes"
                    || d.thromboembolism_risk.previous_pe == "yes"
            },
        },
        MECRule {
            id: "VTE-003",
            category: "Thromboembolism",
            description: "Known thrombophilia (UK MEC 4 for COC)",
            mec_category: 4,
            affected_methods: &["coc"],
            evaluate: |d| d.thromboembolism_risk.known_thrombophilia == "yes",
        },
        MECRule {
            id: "VTE-004",
            category: "Thromboembolism",
            description: "Known thrombophilia (UK MEC 2 for POP/implant)",
            mec_category: 2,
            affected_methods: &["pop", "implant"],
            evaluate: |d| d.thromboembolism_risk.known_thrombophilia == "yes",
        },
        MECRule {
            id: "VTE-005",
            category: "Thromboembolism",
            description: "Major surgery with prolonged immobilisation (UK MEC 4 for COC)",
            mec_category: 4,
            affected_methods: &["coc"],
            evaluate: |d| {
                d.thromboembolism_risk.recent_major_surgery == "yes"
                    && d.thromboembolism_risk.immobility_risk == "yes"
            },
        },
        MECRule {
            id: "VTE-006",
            category: "Thromboembolism",
            description: "Family history of VTE in first-degree relative (UK MEC 3 for COC)",
            mec_category: 3,
            affected_methods: &["coc"],
            evaluate: |d| d.cardiovascular_risk.family_history_vte == "yes",
        },
        // ─── CARDIOVASCULAR ───────────────────────────────────────
        MECRule {
            id: "CV-001",
            category: "Cardiovascular",
            description: "Ischaemic heart disease (UK MEC 4 for COC)",
            mec_category: 4,
            affected_methods: &["coc"],
            evaluate: |d| d.cardiovascular_risk.ischaemic_heart_disease == "yes",
        },
        MECRule {
            id: "CV-002",
            category: "Cardiovascular",
            description: "Ischaemic heart disease (UK MEC 2 for POP/implant/injection)",
            mec_category: 2,
            affected_methods: &["pop", "implant", "injection"],
            evaluate: |d| d.cardiovascular_risk.ischaemic_heart_disease == "yes",
        },
        MECRule {
            id: "CV-003",
            category: "Cardiovascular",
            description: "History of stroke (UK MEC 4 for COC)",
            mec_category: 4,
            affected_methods: &["coc"],
            evaluate: |d| d.cardiovascular_risk.stroke_history == "yes",
        },
        MECRule {
            id: "CV-004",
            category: "Cardiovascular",
            description: "History of stroke (UK MEC 2 for POP/implant/injection)",
            mec_category: 2,
            affected_methods: &["pop", "implant", "injection"],
            evaluate: |d| d.cardiovascular_risk.stroke_history == "yes",
        },
        MECRule {
            id: "CV-005",
            category: "Cardiovascular",
            description: "Hypertension systolic >= 160 or diastolic >= 100 (UK MEC 4 for COC)",
            mec_category: 4,
            affected_methods: &["coc"],
            evaluate: |d| {
                d.cardiovascular_risk.systolic_bp.is_some_and(|v| v >= 160)
                    || d.cardiovascular_risk
                        .diastolic_bp
                        .is_some_and(|v| v >= 100)
            },
        },
        MECRule {
            id: "CV-006",
            category: "Cardiovascular",
            description: "Hypertension systolic 140-159 or diastolic 90-99 (UK MEC 3 for COC)",
            mec_category: 3,
            affected_methods: &["coc"],
            evaluate: |d| {
                d.cardiovascular_risk
                    .systolic_bp
                    .is_some_and(|v| (140..160).contains(&v))
                    || d.cardiovascular_risk
                        .diastolic_bp
                        .is_some_and(|v| (90..100).contains(&v))
            },
        },
        MECRule {
            id: "CV-007",
            category: "Cardiovascular",
            description: "Hypertension (UK MEC 2 for POP/implant/injection)",
            mec_category: 2,
            affected_methods: &["pop", "implant", "injection"],
            evaluate: |d| d.cardiovascular_risk.hypertension == "yes",
        },
        MECRule {
            id: "CV-008",
            category: "Cardiovascular",
            description: "Valvular heart disease with complications (UK MEC 4 for COC)",
            mec_category: 4,
            affected_methods: &["coc"],
            evaluate: |d| {
                d.cardiovascular_risk.valvular_heart_disease == "yes"
                    && d.cardiovascular_risk.valvular_complications == "yes"
            },
        },
        // ─── MIGRAINE ─────────────────────────────────────────────
        MECRule {
            id: "MIG-001",
            category: "Migraine",
            description: "Migraine with aura at any age (UK MEC 4 for COC)",
            mec_category: 4,
            affected_methods: &["coc"],
            evaluate: |d| {
                d.medical_history.migraine == "yes"
                    && d.medical_history.migraine_with_aura == "yes"
            },
        },
        MECRule {
            id: "MIG-002",
            category: "Migraine",
            description: "Migraine with aura (UK MEC 2 for POP/implant/injection)",
            mec_category: 2,
            affected_methods: &["pop", "implant", "injection"],
            evaluate: |d| {
                d.medical_history.migraine == "yes"
                    && d.medical_history.migraine_with_aura == "yes"
            },
        },
        MECRule {
            id: "MIG-003",
            category: "Migraine",
            description: "Migraine without aura age >= 35 (UK MEC 3 for COC)",
            mec_category: 3,
            affected_methods: &["coc"],
            evaluate: |d| {
                let age = calculate_age(&d.demographics.date_of_birth);
                d.medical_history.migraine == "yes"
                    && d.medical_history.migraine_with_aura == "no"
                    && age.is_some_and(|a| a >= 35)
            },
        },
        MECRule {
            id: "MIG-004",
            category: "Migraine",
            description: "Migraine without aura age < 35 (UK MEC 2 for COC)",
            mec_category: 2,
            affected_methods: &["coc"],
            evaluate: |d| {
                let age = calculate_age(&d.demographics.date_of_birth);
                d.medical_history.migraine == "yes"
                    && d.medical_history.migraine_with_aura == "no"
                    && age.is_some_and(|a| a < 35)
            },
        },
        // ─── SMOKING & AGE ────────────────────────────────────────
        MECRule {
            id: "SM-001",
            category: "Smoking",
            description: "Age >= 35 and smokes >= 15 cigarettes/day (UK MEC 4 for COC)",
            mec_category: 4,
            affected_methods: &["coc"],
            evaluate: |d| {
                let age = calculate_age(&d.demographics.date_of_birth);
                age.is_some_and(|a| a >= 35)
                    && d.lifestyle_assessment.smoking == "current"
                    && d.lifestyle_assessment
                        .cigarettes_per_day
                        .is_some_and(|c| c >= 15)
            },
        },
        MECRule {
            id: "SM-002",
            category: "Smoking",
            description: "Age >= 35 and smokes < 15 cigarettes/day (UK MEC 3 for COC)",
            mec_category: 3,
            affected_methods: &["coc"],
            evaluate: |d| {
                let age = calculate_age(&d.demographics.date_of_birth);
                age.is_some_and(|a| a >= 35)
                    && d.lifestyle_assessment.smoking == "current"
                    && d.lifestyle_assessment
                        .cigarettes_per_day
                        .is_none_or(|c| c < 15)
            },
        },
        MECRule {
            id: "SM-003",
            category: "Smoking",
            description: "Age >= 35 and stopped smoking < 1 year ago (UK MEC 3 for COC)",
            mec_category: 3,
            affected_methods: &["coc"],
            evaluate: |d| {
                let age = calculate_age(&d.demographics.date_of_birth);
                age.is_some_and(|a| a >= 35) && d.lifestyle_assessment.smoking == "ex-smoker"
            },
        },
        MECRule {
            id: "SM-004",
            category: "Smoking",
            description: "Current smoker (UK MEC 2 for COC if age < 35)",
            mec_category: 2,
            affected_methods: &["coc"],
            evaluate: |d| {
                let age = calculate_age(&d.demographics.date_of_birth);
                age.is_some_and(|a| a < 35) && d.lifestyle_assessment.smoking == "current"
            },
        },
        // ─── BMI / OBESITY ────────────────────────────────────────
        MECRule {
            id: "BMI-001",
            category: "BMI",
            description: "BMI >= 35 (UK MEC 3 for COC)",
            mec_category: 3,
            affected_methods: &["coc"],
            evaluate: |d| d.demographics.bmi.is_some_and(|b| b >= 35.0),
        },
        MECRule {
            id: "BMI-002",
            category: "BMI",
            description: "BMI 30-34 (UK MEC 2 for COC)",
            mec_category: 2,
            affected_methods: &["coc"],
            evaluate: |d| {
                d.demographics
                    .bmi
                    .is_some_and(|b| (30.0..35.0).contains(&b))
            },
        },
        MECRule {
            id: "BMI-003",
            category: "BMI",
            description: "BMI >= 30 (UK MEC 1 for POP/implant/IUS/IUD)",
            mec_category: 1,
            affected_methods: &["pop", "implant", "ius", "iud"],
            evaluate: |d| d.demographics.bmi.is_some_and(|b| b >= 30.0),
        },
        // ─── BREAST CANCER ────────────────────────────────────────
        MECRule {
            id: "BC-001",
            category: "Breast Cancer",
            description: "Current breast cancer (UK MEC 4 for all hormonal methods)",
            mec_category: 4,
            affected_methods: &["coc", "pop", "implant", "injection", "ius"],
            evaluate: |d| d.medical_history.breast_cancer == "current",
        },
        MECRule {
            id: "BC-002",
            category: "Breast Cancer",
            description: "Breast cancer within past 5 years (UK MEC 3 for all hormonal methods)",
            mec_category: 3,
            affected_methods: &["coc", "pop", "implant", "injection", "ius"],
            evaluate: |d| d.medical_history.breast_cancer == "past-5-years",
        },
        // ─── LIVER DISEASE ────────────────────────────────────────
        MECRule {
            id: "LIV-001",
            category: "Liver",
            description: "Active viral hepatitis (UK MEC 3/4 for COC)",
            mec_category: 3,
            affected_methods: &["coc"],
            evaluate: |d| d.medical_history.liver_disease == "active-hepatitis",
        },
        MECRule {
            id: "LIV-002",
            category: "Liver",
            description: "Liver tumour (UK MEC 4 for COC)",
            mec_category: 4,
            affected_methods: &["coc"],
            evaluate: |d| d.medical_history.liver_disease == "liver-tumour",
        },
        MECRule {
            id: "LIV-003",
            category: "Liver",
            description: "Severe cirrhosis (UK MEC 3 for COC/POP/implant/injection)",
            mec_category: 3,
            affected_methods: &["coc", "pop", "implant", "injection"],
            evaluate: |d| d.medical_history.liver_disease == "cirrhosis",
        },
        // ─── SLE ──────────────────────────────────────────────────
        MECRule {
            id: "SLE-001",
            category: "SLE",
            description: "SLE with antiphospholipid antibodies (UK MEC 4 for COC)",
            mec_category: 4,
            affected_methods: &["coc"],
            evaluate: |d| {
                d.medical_history.sle == "yes"
                    && d.medical_history.sle_antiphospholipid == "yes"
            },
        },
        MECRule {
            id: "SLE-002",
            category: "SLE",
            description: "SLE without antiphospholipid antibodies (UK MEC 2 for COC)",
            mec_category: 2,
            affected_methods: &["coc"],
            evaluate: |d| {
                d.medical_history.sle == "yes"
                    && d.medical_history.sle_antiphospholipid != "yes"
            },
        },
        // ─── DIABETES ─────────────────────────────────────────────
        MECRule {
            id: "DM-001",
            category: "Diabetes",
            description: "Diabetes with vascular complications (UK MEC 3/4 for COC)",
            mec_category: 3,
            affected_methods: &["coc"],
            evaluate: |d| {
                (d.medical_history.diabetes == "type-1"
                    || d.medical_history.diabetes == "type-2")
                    && d.medical_history.diabetes_complications == "yes"
            },
        },
        MECRule {
            id: "DM-002",
            category: "Diabetes",
            description: "Diabetes without complications (UK MEC 2 for COC)",
            mec_category: 2,
            affected_methods: &["coc"],
            evaluate: |d| {
                (d.medical_history.diabetes == "type-1"
                    || d.medical_history.diabetes == "type-2")
                    && d.medical_history.diabetes_complications != "yes"
            },
        },
        // ─── MEDICATIONS ──────────────────────────────────────────
        MECRule {
            id: "MED-001",
            category: "Medications",
            description: "Enzyme-inducing drugs (UK MEC 3 for COC/POP/patch/ring)",
            mec_category: 3,
            affected_methods: &["coc", "pop"],
            evaluate: |d| d.current_medications.enzyme_inducing_drugs == "yes",
        },
        MECRule {
            id: "MED-002",
            category: "Medications",
            description: "St John Wort or herbal remedies with enzyme-inducing potential (UK MEC 3 for COC)",
            mec_category: 3,
            affected_methods: &["coc"],
            evaluate: |d| d.current_medications.herbal_remedies == "yes",
        },
        // ─── BREASTFEEDING ────────────────────────────────────────
        MECRule {
            id: "BF-001",
            category: "Breastfeeding",
            description: "Breastfeeding < 6 weeks postpartum (UK MEC 4 for COC)",
            mec_category: 4,
            affected_methods: &["coc"],
            evaluate: |d| {
                d.contraceptive_preferences.breastfeeding == "yes"
                    && d.contraceptive_preferences
                        .postpartum_weeks
                        .is_some_and(|w| w < 6)
            },
        },
        MECRule {
            id: "BF-002",
            category: "Breastfeeding",
            description: "Breastfeeding 6 weeks to 6 months postpartum (UK MEC 2 for COC)",
            mec_category: 2,
            affected_methods: &["coc"],
            evaluate: |d| {
                d.contraceptive_preferences.breastfeeding == "yes"
                    && d.contraceptive_preferences
                        .postpartum_weeks
                        .is_some_and(|w| (6..26).contains(&w))
            },
        },
        // ─── AGE ──────────────────────────────────────────────────
        MECRule {
            id: "AGE-001",
            category: "Demographics",
            description: "Age > 50 (UK MEC 2 for COC)",
            mec_category: 2,
            affected_methods: &["coc"],
            evaluate: |d| {
                let age = calculate_age(&d.demographics.date_of_birth);
                age.is_some_and(|a| a > 50)
            },
        },
    ]
}
