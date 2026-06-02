use super::types::{AdditionalFlag, AssessmentData};

/// Detect plastic-surgery safety flags. Independent of ASA/wound/complexity
/// classification, this raises clinician-facing alerts for safety-critical
/// findings (emergency referral, body dysmorphia, difficult airway,
/// malignant hyperthermia, dirty wound, anaphylaxis, etc.). Flag IDs match
/// the front-end engine verbatim.
pub fn detect_additional_flags(data: &AssessmentData) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    // ─── Emergency referral (HIGH) ─────────────────────────────
    if data.reason_for_referral.urgency == "emergency" {
        flags.push(AdditionalFlag {
            id: "FLAG-EMERG-001".to_string(),
            category: "Referral".to_string(),
            message: "Emergency referral - URGENT SURGICAL EVALUATION REQUIRED".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Body dysmorphic concern (HIGH) ────────────────────────
    if data.psychological_assessment.body_dysmorphic_concern == "yes" {
        let detail = if data
            .psychological_assessment
            .body_dysmorphic_details
            .trim()
            .is_empty()
        {
            "details not specified".to_string()
        } else {
            data.psychological_assessment
                .body_dysmorphic_details
                .clone()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-BDD-001".to_string(),
            category: "Psychological".to_string(),
            message: format!(
                "Body dysmorphic concern identified: {detail} - psychological assessment recommended before proceeding"
            ),
            priority: "high".to_string(),
        });
    }

    // ─── Unrealistic expectations (HIGH) ───────────────────────
    if data.psychological_assessment.realistic_expectations == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-EXPECT-001".to_string(),
            category: "Psychological".to_string(),
            message:
                "Patient has unrealistic expectations - further counselling required before consent"
                    .to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Difficult airway (HIGH) ──────────────────────────────
    if data.anaesthetic_risk.difficult_airway == "yes" {
        let detail = if data
            .anaesthetic_risk
            .difficult_airway_details
            .trim()
            .is_empty()
        {
            "details not specified".to_string()
        } else {
            data.anaesthetic_risk.difficult_airway_details.clone()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-AIRWAY-001".to_string(),
            category: "Anaesthetic".to_string(),
            message: format!("Difficult airway: {detail} - anaesthetic team alert required"),
            priority: "high".to_string(),
        });
    }

    // ─── Malignant hyperthermia risk (HIGH) ────────────────────
    if data.anaesthetic_risk.malignant_hyperthermia_risk == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-MH-001".to_string(),
            category: "Anaesthetic".to_string(),
            message: "Malignant hyperthermia risk - trigger-free anaesthetic required".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── ASA IV-V (HIGH) ──────────────────────────────────────
    if data.anaesthetic_risk.asa_class == "4" || data.anaesthetic_risk.asa_class == "5" {
        flags.push(AdditionalFlag {
            id: "FLAG-ASA-001".to_string(),
            category: "Anaesthetic".to_string(),
            message: format!(
                "ASA Class {} - high anaesthetic risk, senior anaesthetic review required",
                data.anaesthetic_risk.asa_class
            ),
            priority: "high".to_string(),
        });
    }

    // ─── Dirty/infected wound (HIGH) ──────────────────────────
    if data.wound_tissue_assessment.wound_classification == "dirty" {
        flags.push(AdditionalFlag {
            id: "FLAG-WOUND-001".to_string(),
            category: "Wound".to_string(),
            message: "Dirty/infected wound - antibiotic therapy and wound preparation required"
                .to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Active wound infection (HIGH) ────────────────────────
    if data.wound_tissue_assessment.wound_infection_signs == "yes" {
        let detail = if data
            .wound_tissue_assessment
            .wound_infection_details
            .trim()
            .is_empty()
        {
            "details not specified".to_string()
        } else {
            data.wound_tissue_assessment
                .wound_infection_details
                .clone()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-INFECT-001".to_string(),
            category: "Wound".to_string(),
            message: format!(
                "Active wound infection: {detail} - treat infection before elective surgery"
            ),
            priority: "high".to_string(),
        });
    }

    // ─── Non-viable tissue (HIGH) ─────────────────────────────
    if data.wound_tissue_assessment.tissue_viability == "non-viable" {
        flags.push(AdditionalFlag {
            id: "FLAG-TISSUE-001".to_string(),
            category: "Wound".to_string(),
            message: "Non-viable tissue present - debridement required".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Absent vascular supply (HIGH) ────────────────────────
    if data.wound_tissue_assessment.vascular_supply == "absent" {
        flags.push(AdditionalFlag {
            id: "FLAG-VASC-001".to_string(),
            category: "Wound".to_string(),
            message: "Absent vascular supply - vascular surgery consultation required".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Bleeding disorder (HIGH) ─────────────────────────────
    if data.medical_surgical_history.bleeding_disorder == "yes" {
        let detail = if data
            .medical_surgical_history
            .bleeding_disorder_details
            .trim()
            .is_empty()
        {
            "details not specified".to_string()
        } else {
            data.medical_surgical_history
                .bleeding_disorder_details
                .clone()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-BLEED-001".to_string(),
            category: "Comorbidity".to_string(),
            message: format!("Bleeding disorder: {detail} - haematology liaison required"),
            priority: "high".to_string(),
        });
    }

    // ─── Anticoagulant use (MEDIUM) ───────────────────────────
    if data.medications_allergies.on_anticoagulants == "yes" {
        let detail = if data
            .medications_allergies
            .anticoagulant_details
            .trim()
            .is_empty()
        {
            "type not specified".to_string()
        } else {
            data.medications_allergies.anticoagulant_details.clone()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-ANTICOAG-001".to_string(),
            category: "Medications".to_string(),
            message: format!("On anticoagulants: {detail} - perioperative bridging plan required"),
            priority: "medium".to_string(),
        });
    }

    // ─── Immunosuppressed (MEDIUM) ────────────────────────────
    if data.medical_surgical_history.immunosuppressed == "yes" {
        let detail = if data
            .medical_surgical_history
            .immunosuppressed_details
            .trim()
            .is_empty()
        {
            "details not specified".to_string()
        } else {
            data.medical_surgical_history
                .immunosuppressed_details
                .clone()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-IMMUNO-001".to_string(),
            category: "Comorbidity".to_string(),
            message: format!("Immunosuppressed: {detail} - infection risk assessment"),
            priority: "medium".to_string(),
        });
    }

    // ─── Latex allergy (MEDIUM) ───────────────────────────────
    if data.medications_allergies.latex_allergy == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-LATEX-001".to_string(),
            category: "Allergy".to_string(),
            message: "Latex allergy - latex-free environment required".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Drug allergy with anaphylaxis (HIGH) ─────────────────
    for (i, allergy) in data.medications_allergies.allergies.iter().enumerate() {
        if allergy.severity == "anaphylaxis" {
            let allergen = if allergy.allergen.trim().is_empty() {
                "(allergen not specified)".to_string()
            } else {
                allergy.allergen.clone()
            };
            flags.push(AdditionalFlag {
                id: format!("FLAG-ALLERGY-ANAPH-{i}"),
                category: "Allergy".to_string(),
                message: format!("ANAPHYLAXIS history: {allergen}"),
                priority: "high".to_string(),
            });
        }
    }

    // ─── Any drug allergies documented (MEDIUM) ───────────────
    if !data.medications_allergies.allergies.is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-ALLERGY-001".to_string(),
            category: "Allergy".to_string(),
            message: format!(
                "{} drug allergy/allergies documented",
                data.medications_allergies.allergies.len()
            ),
            priority: "medium".to_string(),
        });
    }

    // ─── Current smoker (MEDIUM) ──────────────────────────────
    if data.anaesthetic_risk.smoking_status == "current" {
        flags.push(AdditionalFlag {
            id: "FLAG-SMOKE-001".to_string(),
            category: "Social".to_string(),
            message:
                "Current smoker - counsel on smoking cessation (wound healing impairment)"
                    .to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Uncontrolled diabetes (MEDIUM) ───────────────────────
    if (data.medical_surgical_history.diabetes == "type-1"
        || data.medical_surgical_history.diabetes == "type-2")
        && data.medical_surgical_history.diabetes_controlled == "no"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-DM-001".to_string(),
            category: "Comorbidity".to_string(),
            message:
                "Uncontrolled diabetes - optimise glycaemic control before elective surgery"
                    .to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Keloid/hypertrophic scarring (MEDIUM) ────────────────
    if data.medical_surgical_history.keloid_scarring == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-SCAR-001".to_string(),
            category: "Comorbidity".to_string(),
            message:
                "Keloid/hypertrophic scarring tendency - discuss with patient and plan scar management"
                    .to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Psychological referral needed (MEDIUM) ───────────────
    if data.psychological_assessment.psychological_referral_needed == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-PSYCH-001".to_string(),
            category: "Psychological".to_string(),
            message: "Psychological referral recommended before proceeding".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── High VTE risk (MEDIUM) ───────────────────────────────
    if data.procedure_planning_consent.vte_risk == "high" {
        flags.push(AdditionalFlag {
            id: "FLAG-VTE-001".to_string(),
            category: "VTE Risk".to_string(),
            message: "High VTE risk - ensure thromboprophylaxis plan in place".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Consent not yet obtained (MEDIUM) ────────────────────
    if data.procedure_planning_consent.consent_form_signed == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-CONSENT-001".to_string(),
            category: "Consent".to_string(),
            message: "Consent form not yet signed".to_string(),
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
