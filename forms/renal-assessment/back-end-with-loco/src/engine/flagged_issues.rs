//! Detection of additional flagged issues.

use super::types::{AdditionalFlag, AssessmentData};
use super::utils::{resolve_albuminuria_category, resolve_egfr};

/// Detect renal-assessment safety flags. Flags are computed independently of
/// KDIGO classification — they alert the clinician to severe biochemical
/// derangements, advanced CKD requiring nephrology referral, anemia of CKD,
/// mineral-bone disorder, AKI on CKD, hypertension out of target,
/// nephrotoxic drug exposure, and major CKD risk factors.
///
/// All flag IDs (`FLAG-K-001` … `FLAG-IMG-001`) are preserved verbatim from
/// the JavaScript reference.
///
/// Priority: urgent > high > medium > low.
pub fn detect_additional_flags(data: &AssessmentData) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    let egfr = resolve_egfr(data);
    let albuminuria_category = resolve_albuminuria_category(data);
    let k = data.blood_tests.potassium;
    let bicarb = data.blood_tests.bicarbonate;
    let hb = data.blood_tests.hemoglobin;
    let phosphate = data.blood_tests.phosphate;
    let calcium = data.blood_tests.calcium;
    let sbp = data.physical_examination.systolic_bp;
    let dbp = data.physical_examination.diastolic_bp;

    // ─── Severe hyperkalemia (urgent) ─────────────────────────
    if let Some(v) = k {
        if v >= 6.5 {
            flags.push(AdditionalFlag {
                id: "FLAG-K-001".to_string(),
                category: "Electrolytes".to_string(),
                message: format!(
                    "SEVERE hyperkalemia (K+ {v} mmol/L) - urgent ECG and emergency management indicated."
                ),
                priority: "urgent".to_string(),
            });
        } else if v >= 6.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-K-002".to_string(),
                category: "Electrolytes".to_string(),
                message: format!(
                    "Hyperkalemia (K+ {v} mmol/L) - review ACEi/ARB, K-sparing diuretics, dietary K."
                ),
                priority: "high".to_string(),
            });
        } else if v >= 5.5 {
            flags.push(AdditionalFlag {
                id: "FLAG-K-003".to_string(),
                category: "Electrolytes".to_string(),
                message: format!(
                    "Mild hyperkalemia (K+ {v} mmol/L) - monitor and review medications."
                ),
                priority: "medium".to_string(),
            });
        }
    }

    // ─── Metabolic acidosis ───────────────────────────────────
    if let Some(v) = bicarb {
        if v < 18.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-ACID-001".to_string(),
                category: "Acid-Base".to_string(),
                message: format!(
                    "Severe metabolic acidosis (HCO3 {v} mmol/L) - consider oral bicarbonate replacement."
                ),
                priority: "high".to_string(),
            });
        } else if v < 22.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-ACID-002".to_string(),
                category: "Acid-Base".to_string(),
                message: format!(
                    "Metabolic acidosis (HCO3 {v} mmol/L) - monitor and consider correction."
                ),
                priority: "medium".to_string(),
            });
        }
    }

    // ─── Advanced CKD / kidney failure ────────────────────────
    if let Some(v) = egfr {
        if v < 15.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-EGFR-001".to_string(),
                category: "CKD Stage".to_string(),
                message: format!(
                    "eGFR {v} mL/min/1.73 m^2 (G5) - kidney failure; urgent nephrology referral and renal replacement therapy planning."
                ),
                priority: "urgent".to_string(),
            });
        } else if v < 30.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-EGFR-002".to_string(),
                category: "CKD Stage".to_string(),
                message: format!(
                    "eGFR {v} mL/min/1.73 m^2 (G4) - severely decreased kidney function; nephrology referral required."
                ),
                priority: "high".to_string(),
            });
        } else if v < 45.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-EGFR-003".to_string(),
                category: "CKD Stage".to_string(),
                message: format!(
                    "eGFR {v} mL/min/1.73 m^2 (G3b) - moderately to severely decreased; consider nephrology input."
                ),
                priority: "medium".to_string(),
            });
        }
    }

    // ─── Severe albuminuria ───────────────────────────────────
    if albuminuria_category == "A3" {
        flags.push(AdditionalFlag {
            id: "FLAG-ACR-001".to_string(),
            category: "Albuminuria".to_string(),
            message: "Severely increased albuminuria (A3) - high risk; ACEi/ARB and SGLT2 inhibitor indicated unless contraindicated.".to_string(),
            priority: "high".to_string(),
        });
    } else if albuminuria_category == "A2" {
        flags.push(AdditionalFlag {
            id: "FLAG-ACR-002".to_string(),
            category: "Albuminuria".to_string(),
            message: "Moderately increased albuminuria (A2) - consider RAAS blockade and risk-factor modification.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Anemia of CKD ────────────────────────────────────────
    if let Some(v) = hb {
        if v < 100.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-HB-001".to_string(),
                category: "Anemia".to_string(),
                message: format!(
                    "Severe anemia (Hb {v} g/L) - investigate cause; consider ESA / iron therapy per CKD anemia guidelines."
                ),
                priority: "high".to_string(),
            });
        } else if v < 110.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-HB-002".to_string(),
                category: "Anemia".to_string(),
                message: format!(
                    "Anemia (Hb {v} g/L) - workup including iron studies."
                ),
                priority: "medium".to_string(),
            });
        }
    }

    // ─── Mineral-bone disorder ────────────────────────────────
    if let Some(v) = phosphate {
        if v > 1.78 {
            flags.push(AdditionalFlag {
                id: "FLAG-MBD-001".to_string(),
                category: "Mineral-Bone Disorder".to_string(),
                message: format!(
                    "Hyperphosphatemia (PO4 {v} mmol/L) - dietary advice and phosphate binders."
                ),
                priority: "medium".to_string(),
            });
        }
    }
    if let Some(v) = calcium {
        if v < 2.10 {
            flags.push(AdditionalFlag {
                id: "FLAG-MBD-002".to_string(),
                category: "Mineral-Bone Disorder".to_string(),
                message: format!(
                    "Hypocalcemia (Ca {v} mmol/L) - investigate vitamin D and PTH."
                ),
                priority: "medium".to_string(),
            });
        }
    }

    // ─── AKI on CKD ───────────────────────────────────────────
    if data.clinical_impression.aksuperimposed_on_ckd == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-AKI-001".to_string(),
            category: "Acute Kidney Injury".to_string(),
            message: "Acute kidney injury superimposed on CKD - identify and reverse precipitants; hold nephrotoxins.".to_string(),
            priority: "urgent".to_string(),
        });
    }

    if data.presenting_symptoms.reduced_urine_output == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-AKI-002".to_string(),
            category: "Acute Kidney Injury".to_string(),
            message: "Reduced urine output - assess for AKI, urinary obstruction, volume status.".to_string(),
            priority: "high".to_string(),
        });
    }

    if data.presenting_symptoms.confusion == "yes"
        && egfr.map(|v| v < 30.0).unwrap_or(false)
    {
        flags.push(AdditionalFlag {
            id: "FLAG-UREMIA-001".to_string(),
            category: "Uremia".to_string(),
            message: "Confusion with advanced CKD - assess for uremic encephalopathy.".to_string(),
            priority: "urgent".to_string(),
        });
    }

    // ─── Hypertension control ─────────────────────────────────
    if let Some(s) = sbp {
        if s >= 180 {
            flags.push(AdditionalFlag {
                id: "FLAG-BP-001".to_string(),
                category: "Blood Pressure".to_string(),
                message: format!(
                    "Severe hypertension (SBP {s} mmHg) - urgent BP review."
                ),
                priority: "urgent".to_string(),
            });
        } else if s >= 140 {
            let dbp_str = match dbp {
                Some(d) => format!("/{d}"),
                None => String::new(),
            };
            flags.push(AdditionalFlag {
                id: "FLAG-BP-002".to_string(),
                category: "Blood Pressure".to_string(),
                message: format!(
                    "Hypertension above target (SBP {s}{dbp_str} mmHg) - intensify therapy; aim <130/80 in CKD."
                ),
                priority: "medium".to_string(),
            });
        }
    }

    // ─── Nephrotoxin exposure ─────────────────────────────────
    if data.ckd_risk_factors.nephrotoxic_drugs == "yes" {
        let detail = if data.ckd_risk_factors.nephrotoxic_drug_details.is_empty() {
            "details not specified".to_string()
        } else {
            data.ckd_risk_factors.nephrotoxic_drug_details.clone()
        };
        flags.push(AdditionalFlag {
            id: "FLAG-NEPH-001".to_string(),
            category: "Medications".to_string(),
            message: format!("Nephrotoxic drug exposure: {detail}."),
            priority: "high".to_string(),
        });
    }
    if data.ckd_risk_factors.nsaid_use == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-NEPH-002".to_string(),
            category: "Medications".to_string(),
            message: "Regular NSAID use - avoid NSAIDs in CKD; review analgesia plan.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if data.medication_review.contrast_imaging_planned == "yes"
        && egfr.map(|v| v < 30.0).unwrap_or(false)
    {
        flags.push(AdditionalFlag {
            id: "FLAG-NEPH-003".to_string(),
            category: "Medications".to_string(),
            message: "Contrast-enhanced imaging planned in advanced CKD - weigh benefit/risk; hydrate; consider alternatives.".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── RAAS / SGLT2 prescribing gaps ────────────────────────
    if (albuminuria_category == "A2" || albuminuria_category == "A3")
        && data.medication_review.acei_arb == "no"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-RX-001".to_string(),
            category: "Medications".to_string(),
            message: "Albuminuria present but no ACEi/ARB - consider RAAS blockade unless contraindicated.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if data.ckd_risk_factors.diabetes == "yes"
        && egfr.map(|v| v >= 20.0).unwrap_or(false)
        && data.medication_review.sglt2_inhibitor == "no"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-RX-002".to_string(),
            category: "Medications".to_string(),
            message: "Diabetic CKD without SGLT2 inhibitor - consider SGLT2i for cardiorenal protection.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Major risk factors ───────────────────────────────────
    if data.ckd_risk_factors.diabetes == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-RISK-001".to_string(),
            category: "Risk Factors".to_string(),
            message: "Diabetes mellitus - leading cause of CKD; optimise glycaemic control and screen annually.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if data.ckd_risk_factors.hypertension == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-RISK-002".to_string(),
            category: "Risk Factors".to_string(),
            message: "Hypertension - second-leading cause of CKD; target <130/80 mmHg.".to_string(),
            priority: "low".to_string(),
        });
    }
    if data.ckd_risk_factors.family_history_polycystic_kidney == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-RISK-003".to_string(),
            category: "Risk Factors".to_string(),
            message: "Family history of polycystic kidney disease - consider genetic counselling and renal imaging.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if data.ckd_risk_factors.smoking == "current" {
        flags.push(AdditionalFlag {
            id: "FLAG-RISK-004".to_string(),
            category: "Social History".to_string(),
            message: "Active smoker - smoking accelerates CKD progression; offer cessation support.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if data.ckd_risk_factors.prior_aki == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-RISK-005".to_string(),
            category: "Risk Factors".to_string(),
            message: "Prior AKI - increased risk of CKD progression; monitor renal function regularly.".to_string(),
            priority: "low".to_string(),
        });
    }

    // ─── Hematuria ─────────────────────────────────────────────
    if data.presenting_symptoms.hematuria == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-URINE-001".to_string(),
            category: "Urinalysis".to_string(),
            message: "Hematuria reported - exclude urological malignancy and glomerulonephritis.".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Imaging findings ─────────────────────────────────────
    if data.imaging_biopsy.hydronephrosis == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-IMG-001".to_string(),
            category: "Imaging".to_string(),
            message: "Hydronephrosis on imaging - exclude urinary tract obstruction.".to_string(),
            priority: "high".to_string(),
        });
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
