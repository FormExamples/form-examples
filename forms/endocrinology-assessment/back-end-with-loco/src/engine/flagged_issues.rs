use super::types::{AdditionalFlag, AssessmentData};

/// Detect clinician-facing alert flags for the endocrinology assessment.
/// Ported verbatim from `front-end-form-with-html/js/flagged-issues.js`.
/// Priority order: urgent > high > medium > low.
pub fn detect_additional_flags(data: &AssessmentData) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    // ─── Thyroid alerts ──────────────────────────────
    let t = &data.thyroid_axis;
    if let (Some(tsh), Some(ft4)) = (t.tsh, t.ft4) {
        if tsh < 0.1 && ft4 > 25.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-THY-001".to_string(),
                category: "Thyroid".to_string(),
                message:
                    "Suppressed TSH with elevated FT4 — overt thyrotoxicosis; assess for thyroid storm."
                        .to_string(),
                priority: "urgent".to_string(),
            });
        }
    }
    if let Some(tsh) = t.tsh {
        if tsh > 10.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-THY-002".to_string(),
                category: "Thyroid".to_string(),
                message: format!(
                    "TSH {tsh} mIU/L — overt hypothyroidism; commence levothyroxine titration."
                ),
                priority: "high".to_string(),
            });
        }
    }
    if t.antibodies_positive == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-THY-003".to_string(),
            category: "Thyroid".to_string(),
            message: "Positive thyroid autoantibodies — autoimmune thyroid disease likely."
                .to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Adrenal alerts ──────────────────────────────
    let a = &data.adrenal_axis;
    if let Some(c) = a.morning_cortisol {
        if c < 100.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-ADR-001".to_string(),
                category: "Adrenal".to_string(),
                message: format!(
                    "Morning cortisol {c} nmol/L — adrenal insufficiency suspected; arrange short Synacthen test."
                ),
                priority: "urgent".to_string(),
            });
        }
    }
    if a.hyperpigmentation == "yes" && a.postural_hypotension == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-ADR-002".to_string(),
            category: "Adrenal".to_string(),
            message:
                "Hyperpigmentation with postural hypotension — Addison\u{2019}s disease screen recommended."
                    .to_string(),
            priority: "high".to_string(),
        });
    }
    if a.cushingoid_features == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-ADR-003".to_string(),
            category: "Adrenal".to_string(),
            message:
                "Cushingoid features — overnight dexamethasone suppression or 24-hour urinary cortisol indicated."
                    .to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Glucose alerts ──────────────────────────────
    let g = &data.glucose_metabolism;
    if let Some(v) = g.hba1c {
        if v >= 75.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-GLU-001".to_string(),
                category: "Glucose".to_string(),
                message: format!(
                    "HbA1c {v} mmol/mol — markedly poor glycaemic control; urgent step-up required."
                ),
                priority: "high".to_string(),
            });
        }
    }
    if let Some(v) = g.random_glucose {
        if v >= 20.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-GLU-002".to_string(),
                category: "Glucose".to_string(),
                message: format!(
                    "Random glucose {v} mmol/L — assess for hyperosmolar / DKA."
                ),
                priority: "urgent".to_string(),
            });
        }
    }
    if g.hypoglycaemia_episodes == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-GLU-003".to_string(),
            category: "Glucose".to_string(),
            message:
                "Hypoglycaemic episodes reported — review insulin/sulfonylurea regimen and education."
                    .to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Pituitary alerts ────────────────────────────
    let p = &data.pituitary_function;
    if p.visual_disturbance == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-PIT-001".to_string(),
            category: "Pituitary".to_string(),
            message:
                "Visual disturbance — urgent pituitary MRI and formal visual fields indicated."
                    .to_string(),
            priority: "urgent".to_string(),
        });
    }
    if let Some(v) = p.prolactin {
        if v > 5000.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-PIT-002".to_string(),
                category: "Pituitary".to_string(),
                message: format!(
                    "Prolactin {v} mU/L — macroprolactinoma range; pituitary MRI required."
                ),
                priority: "urgent".to_string(),
            });
        }
    }
    if p.acromegalic_features == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-PIT-003".to_string(),
            category: "Pituitary".to_string(),
            message: "Acromegalic features — IGF-1 and OGTT suppression test indicated."
                .to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Bone & calcium alerts ───────────────────────
    let b = &data.bone_calcium;
    if let Some(v) = b.calcium_corrected {
        if v > 3.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-BON-001".to_string(),
                category: "Bone & Calcium".to_string(),
                message: format!(
                    "Corrected calcium {v} mmol/L — severe hypercalcaemia; admit for IV fluids."
                ),
                priority: "urgent".to_string(),
            });
        } else if v > 2.6 {
            flags.push(AdditionalFlag {
                id: "FLAG-BON-002".to_string(),
                category: "Bone & Calcium".to_string(),
                message: format!(
                    "Corrected calcium {v} mmol/L — hypercalcaemia; investigate primary hyperparathyroidism."
                ),
                priority: "high".to_string(),
            });
        }
        if v < 1.9 {
            flags.push(AdditionalFlag {
                id: "FLAG-BON-003".to_string(),
                category: "Bone & Calcium".to_string(),
                message: format!(
                    "Corrected calcium {v} mmol/L — severe hypocalcaemia; urgent IV calcium."
                ),
                priority: "urgent".to_string(),
            });
        }
    }
    if b.fragility_fracture == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-BON-004".to_string(),
            category: "Bone & Calcium".to_string(),
            message:
                "Fragility fracture history — DEXA and fracture-risk assessment required."
                    .to_string(),
            priority: "high".to_string(),
        });
    }
    if let Some(v) = b.vitamin_d {
        if v < 25.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-BON-005".to_string(),
                category: "Bone & Calcium".to_string(),
                message: format!(
                    "Vitamin D {v} nmol/L — deficient; loading dose then maintenance."
                ),
                priority: "medium".to_string(),
            });
        }
    }

    // ─── Reproductive alerts ─────────────────────────
    let r = &data.reproductive_axis;
    if r.galactorrhoea == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-REP-001".to_string(),
            category: "Reproductive".to_string(),
            message:
                "Galactorrhoea reported — measure prolactin, exclude pregnancy and medication causes."
                    .to_string(),
            priority: "high".to_string(),
        });
    }
    if r.infertility == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-REP-002".to_string(),
            category: "Reproductive".to_string(),
            message: "Infertility concern — full reproductive endocrine work-up recommended."
                .to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Medications & lifestyle ─────────────────────
    let m = &data.medications_lifestyle;
    if m.steroid_use == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-MED-001".to_string(),
            category: "Medications".to_string(),
            message:
                "Current systemic steroid use — consider HPA-axis suppression and bone protection."
                    .to_string(),
            priority: "high".to_string(),
        });
    }
    if m.smoking == "current" {
        flags.push(AdditionalFlag {
            id: "FLAG-LIF-001".to_string(),
            category: "Lifestyle".to_string(),
            message:
                "Active smoker — increases risk for thyroid eye disease, osteoporosis, and cardiovascular disease."
                    .to_string(),
            priority: "medium".to_string(),
        });
    }
    if !m.family_history_endocrine.trim().is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-FAM-001".to_string(),
            category: "Family History".to_string(),
            message: format!(
                "Family history of endocrine disease: {}.",
                m.family_history_endocrine.trim()
            ),
            priority: "low".to_string(),
        });
    }

    // ─── Demographics / BMI ──────────────────────────
    if let Some(bmi) = data.demographics.bmi {
        if bmi >= 35.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-DEM-001".to_string(),
                category: "Demographics".to_string(),
                message: format!("BMI {bmi} — severe obesity; metabolic risk amplified."),
                priority: "medium".to_string(),
            });
        }
    }

    // Sort: urgent > high > medium > low.
    flags.sort_by_key(|f| match f.priority.as_str() {
        "urgent" => 0,
        "high" => 1,
        "medium" => 2,
        "low" => 3,
        _ => 4,
    });

    flags
}
