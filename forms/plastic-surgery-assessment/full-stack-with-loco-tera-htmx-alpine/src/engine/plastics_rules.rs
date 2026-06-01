use super::types::AssessmentData;
use super::utils::calculate_age;

/// A declarative plastic-surgery grading rule.
/// Grade 1 = mild, 2 = moderate, 3 = significant, 4 = severe/critical.
pub struct PlasticsRule {
    pub id: &'static str,
    pub category: &'static str,
    pub description: &'static str,
    pub grade: i32,
    pub evaluate: fn(&AssessmentData) -> bool,
}

/// All plastic-surgery grading rules. Rule IDs match the front-end engine
/// verbatim (ASA-001 … VTE-001).
pub fn all_rules() -> Vec<PlasticsRule> {
    vec![
        // ─── ASA CLASSIFICATION ────────────────────────────────────
        PlasticsRule {
            id: "ASA-001",
            category: "Anaesthetic Risk",
            description: "ASA Class I - normal healthy patient",
            grade: 1,
            evaluate: |d| d.anaesthetic_risk.asa_class == "1",
        },
        PlasticsRule {
            id: "ASA-002",
            category: "Anaesthetic Risk",
            description: "ASA Class II - mild systemic disease",
            grade: 2,
            evaluate: |d| d.anaesthetic_risk.asa_class == "2",
        },
        PlasticsRule {
            id: "ASA-003",
            category: "Anaesthetic Risk",
            description: "ASA Class III - severe systemic disease",
            grade: 3,
            evaluate: |d| d.anaesthetic_risk.asa_class == "3",
        },
        PlasticsRule {
            id: "ASA-004",
            category: "Anaesthetic Risk",
            description: "ASA Class IV - severe systemic disease, constant threat to life",
            grade: 4,
            evaluate: |d| d.anaesthetic_risk.asa_class == "4",
        },
        PlasticsRule {
            id: "ASA-005",
            category: "Anaesthetic Risk",
            description: "ASA Class V - moribund patient",
            grade: 4,
            evaluate: |d| d.anaesthetic_risk.asa_class == "5",
        },
        // ─── WOUND CLASSIFICATION ──────────────────────────────────
        PlasticsRule {
            id: "WND-001",
            category: "Wound",
            description: "Clean wound (Class I)",
            grade: 1,
            evaluate: |d| d.wound_tissue_assessment.wound_classification == "clean",
        },
        PlasticsRule {
            id: "WND-002",
            category: "Wound",
            description: "Clean-contaminated wound (Class II)",
            grade: 2,
            evaluate: |d| d.wound_tissue_assessment.wound_classification == "clean-contaminated",
        },
        PlasticsRule {
            id: "WND-003",
            category: "Wound",
            description: "Contaminated wound (Class III)",
            grade: 3,
            evaluate: |d| d.wound_tissue_assessment.wound_classification == "contaminated",
        },
        PlasticsRule {
            id: "WND-004",
            category: "Wound",
            description: "Dirty/infected wound (Class IV)",
            grade: 4,
            evaluate: |d| d.wound_tissue_assessment.wound_classification == "dirty",
        },
        PlasticsRule {
            id: "WND-005",
            category: "Wound",
            description: "Active wound infection signs",
            grade: 3,
            evaluate: |d| d.wound_tissue_assessment.wound_infection_signs == "yes",
        },
        PlasticsRule {
            id: "WND-006",
            category: "Wound",
            description: "Necrotic wound bed tissue",
            grade: 3,
            evaluate: |d| d.wound_tissue_assessment.wound_bed_tissue == "necrotic",
        },
        PlasticsRule {
            id: "WND-007",
            category: "Wound",
            description: "Non-viable tissue",
            grade: 4,
            evaluate: |d| d.wound_tissue_assessment.tissue_viability == "non-viable",
        },
        PlasticsRule {
            id: "WND-008",
            category: "Wound",
            description: "Compromised vascular supply",
            grade: 3,
            evaluate: |d| d.wound_tissue_assessment.vascular_supply == "compromised",
        },
        PlasticsRule {
            id: "WND-009",
            category: "Wound",
            description: "Absent vascular supply",
            grade: 4,
            evaluate: |d| d.wound_tissue_assessment.vascular_supply == "absent",
        },
        PlasticsRule {
            id: "WND-010",
            category: "Wound",
            description: "Purulent wound exudate",
            grade: 3,
            evaluate: |d| d.wound_tissue_assessment.wound_exudate == "purulent",
        },
        // ─── SURGICAL COMPLEXITY ───────────────────────────────────
        PlasticsRule {
            id: "CX-001",
            category: "Surgical Complexity",
            description: "Minor procedure (Complexity 1)",
            grade: 1,
            evaluate: |d| d.procedure_planning_consent.procedure_complexity == "1",
        },
        PlasticsRule {
            id: "CX-002",
            category: "Surgical Complexity",
            description: "Intermediate procedure (Complexity 2)",
            grade: 2,
            evaluate: |d| d.procedure_planning_consent.procedure_complexity == "2",
        },
        PlasticsRule {
            id: "CX-003",
            category: "Surgical Complexity",
            description: "Major procedure (Complexity 3)",
            grade: 3,
            evaluate: |d| d.procedure_planning_consent.procedure_complexity == "3",
        },
        PlasticsRule {
            id: "CX-004",
            category: "Surgical Complexity",
            description: "Major plus / emergency reconstruction (Complexity 4)",
            grade: 4,
            evaluate: |d| d.procedure_planning_consent.procedure_complexity == "4",
        },
        PlasticsRule {
            id: "CX-005",
            category: "Surgical Complexity",
            description: "Free flap reconstruction required",
            grade: 3,
            evaluate: |d| d.procedure_planning_consent.flap_type == "free",
        },
        PlasticsRule {
            id: "CX-006",
            category: "Surgical Complexity",
            description: "Microsurgical approach required",
            grade: 3,
            evaluate: |d| d.procedure_planning_consent.surgical_approach == "microsurgical",
        },
        // ─── COMORBIDITY ───────────────────────────────────────────
        PlasticsRule {
            id: "CM-001",
            category: "Comorbidity",
            description: "Diabetes mellitus",
            grade: 2,
            evaluate: |d| {
                d.medical_surgical_history.diabetes == "type-1"
                    || d.medical_surgical_history.diabetes == "type-2"
            },
        },
        PlasticsRule {
            id: "CM-002",
            category: "Comorbidity",
            description: "Uncontrolled diabetes",
            grade: 3,
            evaluate: |d| {
                (d.medical_surgical_history.diabetes == "type-1"
                    || d.medical_surgical_history.diabetes == "type-2")
                    && d.medical_surgical_history.diabetes_controlled == "no"
            },
        },
        PlasticsRule {
            id: "CM-003",
            category: "Comorbidity",
            description: "Wound healing problems history",
            grade: 2,
            evaluate: |d| d.medical_surgical_history.wound_healing_problems == "yes",
        },
        PlasticsRule {
            id: "CM-004",
            category: "Comorbidity",
            description: "Keloid / hypertrophic scarring tendency",
            grade: 2,
            evaluate: |d| d.medical_surgical_history.keloid_scarring == "yes",
        },
        PlasticsRule {
            id: "CM-005",
            category: "Comorbidity",
            description: "Bleeding disorder",
            grade: 3,
            evaluate: |d| d.medical_surgical_history.bleeding_disorder == "yes",
        },
        PlasticsRule {
            id: "CM-006",
            category: "Comorbidity",
            description: "Immunosuppressed",
            grade: 3,
            evaluate: |d| d.medical_surgical_history.immunosuppressed == "yes",
        },
        PlasticsRule {
            id: "CM-007",
            category: "Comorbidity",
            description: "Active cancer history",
            grade: 3,
            evaluate: |d| d.medical_surgical_history.cancer_history == "yes",
        },
        PlasticsRule {
            id: "CM-008",
            category: "Comorbidity",
            description: "Cardiac disease",
            grade: 2,
            evaluate: |d| d.medical_surgical_history.cardiac_disease == "yes",
        },
        PlasticsRule {
            id: "CM-009",
            category: "Comorbidity",
            description: "Autoimmune disease",
            grade: 2,
            evaluate: |d| d.medical_surgical_history.autoimmune_disease == "yes",
        },
        // ─── CONDITION ─────────────────────────────────────────────
        PlasticsRule {
            id: "CD-001",
            category: "Condition",
            description: "Severe functional impairment",
            grade: 3,
            evaluate: |d| d.current_condition.functional_impairment == "severe",
        },
        PlasticsRule {
            id: "CD-002",
            category: "Condition",
            description: "Significant tissue loss",
            grade: 3,
            evaluate: |d| {
                d.current_condition.tissue_loss == "yes"
                    && d.current_condition
                        .tissue_loss_percentage
                        .map(|p| p > 20.0)
                        .unwrap_or(false)
            },
        },
        PlasticsRule {
            id: "CD-003",
            category: "Condition",
            description: "Severe pain (NRS >= 7)",
            grade: 2,
            evaluate: |d| {
                d.current_condition
                    .pain_level
                    .map(|p| p >= 7)
                    .unwrap_or(false)
            },
        },
        // ─── REFERRAL ──────────────────────────────────────────────
        PlasticsRule {
            id: "RF-001",
            category: "Referral",
            description: "Emergency referral",
            grade: 4,
            evaluate: |d| d.reason_for_referral.urgency == "emergency",
        },
        PlasticsRule {
            id: "RF-002",
            category: "Referral",
            description: "Urgent referral",
            grade: 3,
            evaluate: |d| d.reason_for_referral.urgency == "urgent",
        },
        PlasticsRule {
            id: "RF-003",
            category: "Referral",
            description: "Trauma referral",
            grade: 3,
            evaluate: |d| d.reason_for_referral.referral_type == "trauma",
        },
        PlasticsRule {
            id: "RF-004",
            category: "Referral",
            description: "Burn injury referral",
            grade: 3,
            evaluate: |d| d.reason_for_referral.referral_type == "burn",
        },
        PlasticsRule {
            id: "RF-005",
            category: "Referral",
            description: "Cancer-related referral",
            grade: 3,
            evaluate: |d| d.reason_for_referral.referral_type == "cancer",
        },
        // ─── ANAESTHETIC ───────────────────────────────────────────
        PlasticsRule {
            id: "AN-001",
            category: "Anaesthetic",
            description: "Difficult airway",
            grade: 3,
            evaluate: |d| d.anaesthetic_risk.difficult_airway == "yes",
        },
        PlasticsRule {
            id: "AN-002",
            category: "Anaesthetic",
            description: "Previous anaesthetic complications",
            grade: 2,
            evaluate: |d| d.anaesthetic_risk.anaesthetic_complications == "yes",
        },
        PlasticsRule {
            id: "AN-003",
            category: "Anaesthetic",
            description: "Malignant hyperthermia risk",
            grade: 4,
            evaluate: |d| d.anaesthetic_risk.malignant_hyperthermia_risk == "yes",
        },
        PlasticsRule {
            id: "AN-004",
            category: "Anaesthetic",
            description: "Obstructive sleep apnoea",
            grade: 2,
            evaluate: |d| d.anaesthetic_risk.obstructive_sleep_apnoea == "yes",
        },
        // ─── SOCIAL ────────────────────────────────────────────────
        PlasticsRule {
            id: "SH-001",
            category: "Social",
            description: "Current smoker",
            grade: 2,
            evaluate: |d| d.anaesthetic_risk.smoking_status == "current",
        },
        PlasticsRule {
            id: "SH-002",
            category: "Social",
            description: "Above-guidelines alcohol consumption",
            grade: 2,
            evaluate: |d| d.anaesthetic_risk.alcohol_consumption == "above-guidelines",
        },
        // ─── DEMOGRAPHICS ──────────────────────────────────────────
        PlasticsRule {
            id: "AG-001",
            category: "Demographics",
            description: "Age > 75 years",
            grade: 2,
            evaluate: |d| {
                calculate_age(&d.demographics.date_of_birth)
                    .map(|a| a > 75)
                    .unwrap_or(false)
            },
        },
        PlasticsRule {
            id: "AG-002",
            category: "Demographics",
            description: "BMI >= 35 (Obese Class II+)",
            grade: 2,
            evaluate: |d| d.demographics.bmi.map(|b| b >= 35.0).unwrap_or(false),
        },
        // ─── PSYCHOLOGICAL ─────────────────────────────────────────
        PlasticsRule {
            id: "PS-001",
            category: "Psychological",
            description: "Body dysmorphic concern identified",
            grade: 3,
            evaluate: |d| d.psychological_assessment.body_dysmorphic_concern == "yes",
        },
        PlasticsRule {
            id: "PS-002",
            category: "Psychological",
            description: "Unrealistic expectations",
            grade: 3,
            evaluate: |d| d.psychological_assessment.realistic_expectations == "no",
        },
        PlasticsRule {
            id: "PS-003",
            category: "Psychological",
            description: "Severe anxiety",
            grade: 2,
            evaluate: |d| d.psychological_assessment.anxiety_level == "severe",
        },
        // ─── VTE RISK ──────────────────────────────────────────────
        PlasticsRule {
            id: "VTE-001",
            category: "VTE Risk",
            description: "High VTE risk",
            grade: 3,
            evaluate: |d| d.procedure_planning_consent.vte_risk == "high",
        },
    ]
}
