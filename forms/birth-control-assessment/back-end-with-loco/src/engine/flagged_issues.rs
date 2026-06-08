//! Detection of additional flagged issues.

use super::types::{AdditionalFlag, AssessmentData};
use super::utils::calculate_age;

/// Detect additional flags that should be highlighted for the clinician
/// independently of MEC classification. These are safety-critical alerts.
pub fn detect_additional_flags(data: &AssessmentData) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    // ─── Previous DVT/PE (HIGH) ────────────────────────────────
    if data.thromboembolism_risk.previous_dvt == "yes" {
        let detail = if data.thromboembolism_risk.dvt_details.trim().is_empty() {
            "details not specified".to_string()
        } else {
            data.thromboembolism_risk.dvt_details.trim().to_string()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-DVT-001".to_string(),
            category: "Thromboembolism".to_string(),
            message: format!("Previous DVT: {detail} - COC CONTRAINDICATED"),
            priority: "high".to_string(),
        });
    }

    if data.thromboembolism_risk.previous_pe == "yes" {
        let detail = if data.thromboembolism_risk.pe_details.trim().is_empty() {
            "details not specified".to_string()
        } else {
            data.thromboembolism_risk.pe_details.trim().to_string()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-PE-001".to_string(),
            category: "Thromboembolism".to_string(),
            message: format!("Previous PE: {detail} - COC CONTRAINDICATED"),
            priority: "high".to_string(),
        });
    }

    // ─── Known thrombophilia (HIGH) ────────────────────────────
    if data.thromboembolism_risk.known_thrombophilia == "yes" {
        let kind = if data.thromboembolism_risk.thrombophilia_type.trim().is_empty() {
            "type not specified".to_string()
        } else {
            data.thromboembolism_risk
                .thrombophilia_type
                .trim()
                .to_string()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-THROMBO-001".to_string(),
            category: "Thromboembolism".to_string(),
            message: format!("Known thrombophilia ({kind}) - COC CONTRAINDICATED"),
            priority: "high".to_string(),
        });
    }

    // ─── Migraine with aura (HIGH) ─────────────────────────────
    if data.medical_history.migraine == "yes"
        && data.medical_history.migraine_with_aura == "yes"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-MIGRAINE-001".to_string(),
            category: "Migraine".to_string(),
            message: "Migraine with aura - COC CONTRAINDICATED (UK MEC 4)".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Ischaemic heart disease (HIGH) ────────────────────────
    if data.cardiovascular_risk.ischaemic_heart_disease == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-IHD-001".to_string(),
            category: "Cardiovascular".to_string(),
            message: "Ischaemic heart disease - COC CONTRAINDICATED".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── History of stroke (HIGH) ──────────────────────────────
    if data.cardiovascular_risk.stroke_history == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-STROKE-001".to_string(),
            category: "Cardiovascular".to_string(),
            message: "History of stroke - COC CONTRAINDICATED".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Current breast cancer (HIGH) ──────────────────────────
    if data.medical_history.breast_cancer == "current" {
        flags.push(AdditionalFlag {
            id: "FLAG-BRCA-001".to_string(),
            category: "Breast Cancer".to_string(),
            message: "Current breast cancer - ALL HORMONAL METHODS CONTRAINDICATED".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Severe hypertension (HIGH) ────────────────────────────
    let sys = data.cardiovascular_risk.systolic_bp;
    let dia = data.cardiovascular_risk.diastolic_bp;
    if sys.is_some_and(|v| v >= 160) || dia.is_some_and(|v| v >= 100) {
        let sys_s = sys.map(|v| v.to_string()).unwrap_or_else(|| "?".to_string());
        let dia_s = dia.map(|v| v.to_string()).unwrap_or_else(|| "?".to_string());
        flags.push(AdditionalFlag {
            id: "FLAG-BP-001".to_string(),
            category: "Cardiovascular".to_string(),
            message: format!(
                "Severe hypertension ({sys_s}/{dia_s} mmHg) - COC CONTRAINDICATED"
            ),
            priority: "high".to_string(),
        });
    }

    // ─── SLE with antiphospholipid (HIGH) ──────────────────────
    if data.medical_history.sle == "yes" && data.medical_history.sle_antiphospholipid == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-SLE-001".to_string(),
            category: "SLE".to_string(),
            message: "SLE with antiphospholipid antibodies - COC CONTRAINDICATED".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Age >= 35 heavy smoker (HIGH) ─────────────────────────
    let age = calculate_age(&data.demographics.date_of_birth);
    if age.is_some_and(|a| a >= 35)
        && data.lifestyle_assessment.smoking == "current"
        && data
            .lifestyle_assessment
            .cigarettes_per_day
            .is_some_and(|c| c >= 15)
    {
        flags.push(AdditionalFlag {
            id: "FLAG-SMOKE-001".to_string(),
            category: "Smoking".to_string(),
            message: format!(
                "Age {}, heavy smoker ({} cigs/day) - COC CONTRAINDICATED",
                age.unwrap(),
                data.lifestyle_assessment.cigarettes_per_day.unwrap()
            ),
            priority: "high".to_string(),
        });
    }

    // ─── Breastfeeding < 6 weeks (HIGH) ────────────────────────
    if data.contraceptive_preferences.breastfeeding == "yes"
        && data
            .contraceptive_preferences
            .postpartum_weeks
            .is_some_and(|w| w < 6)
    {
        flags.push(AdditionalFlag {
            id: "FLAG-BF-001".to_string(),
            category: "Breastfeeding".to_string(),
            message: format!(
                "Breastfeeding {} weeks postpartum - COC CONTRAINDICATED",
                data.contraceptive_preferences.postpartum_weeks.unwrap()
            ),
            priority: "high".to_string(),
        });
    }

    // ─── Enzyme-inducing drugs (MEDIUM) ────────────────────────
    if data.current_medications.enzyme_inducing_drugs == "yes" {
        let detail = if data
            .current_medications
            .enzyme_inducing_details
            .trim()
            .is_empty()
        {
            "details not specified".to_string()
        } else {
            data.current_medications
                .enzyme_inducing_details
                .trim()
                .to_string()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-ENZYME-001".to_string(),
            category: "Medications".to_string(),
            message: format!(
                "On enzyme-inducing drugs: {detail} - reduces COC/POP efficacy"
            ),
            priority: "medium".to_string(),
        });
    }

    // ─── Herbal remedies (MEDIUM) ──────────────────────────────
    if data.current_medications.herbal_remedies == "yes" {
        let detail = if data.current_medications.herbal_details.trim().is_empty() {
            "details not specified".to_string()
        } else {
            data.current_medications.herbal_details.trim().to_string()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-HERBAL-001".to_string(),
            category: "Medications".to_string(),
            message: format!("Herbal remedies: {detail} - may reduce COC efficacy"),
            priority: "medium".to_string(),
        });
    }

    // ─── Drug allergies (MEDIUM) ───────────────────────────────
    if data.current_medications.drug_allergies == "yes" {
        let detail = if data
            .current_medications
            .drug_allergy_details
            .trim()
            .is_empty()
        {
            "details not specified".to_string()
        } else {
            data.current_medications
                .drug_allergy_details
                .trim()
                .to_string()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-ALLERGY-001".to_string(),
            category: "Allergy".to_string(),
            message: format!("Drug allergies: {detail}"),
            priority: "medium".to_string(),
        });
    }

    // ─── Postcoital bleeding (MEDIUM) ──────────────────────────
    if data.menstrual_history.postcoital_bleeding == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-PCB-001".to_string(),
            category: "Menstrual".to_string(),
            message: "Postcoital bleeding reported - cervical screening and STI screen recommended"
                .to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Current STI (MEDIUM) ──────────────────────────────────
    if data.medical_history.sti == "yes" {
        let detail = if data.medical_history.sti_details.trim().is_empty() {
            "details not specified".to_string()
        } else {
            data.medical_history.sti_details.trim().to_string()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-STI-001".to_string(),
            category: "Sexual Health".to_string(),
            message: format!("Current/recent STI: {detail} - consider IUD/IUS timing"),
            priority: "medium".to_string(),
        });
    }

    // ─── BMI >= 35 (MEDIUM) ────────────────────────────────────
    if data.demographics.bmi.is_some_and(|b| b >= 35.0) {
        flags.push(AdditionalFlag {
            id: "FLAG-BMI-001".to_string(),
            category: "BMI".to_string(),
            message: format!(
                "BMI {} - COC use requires careful consideration",
                data.demographics.bmi.unwrap()
            ),
            priority: "medium".to_string(),
        });
    }

    // Sort: high > medium > low.
    flags.sort_by_key(|f| match f.priority.as_str() {
        "high" => 0,
        "medium" => 1,
        "low" => 2,
        _ => 3,
    });

    flags
}
