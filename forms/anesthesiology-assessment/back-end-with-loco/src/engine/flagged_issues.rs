//! Detection of additional flagged issues.

// Flagged-issue detection. Runs independently of the composite scoring
// engine and raises clinician-facing flags for safety-critical findings:
// allergies, MH risk, anticoagulants, difficult airway, GORD, pregnancy,
// uncontrolled hypertension, hypoxia, obesity, polypharmacy, and so on.
//
// Mirrors the front-end JS engine flag IDs and priorities.

use super::types::{AdditionalFlag, AssessmentData};

/// Detect additional flags.
pub fn detect_additional_flags(d: &AssessmentData) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    // ─── Latex allergy ──────────────────────────────────────────
    if d.allergies.latex_allergy == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-LATEX".to_string(),
            category: "Allergy".to_string(),
            message: "Latex allergy — ensure latex-free environment.".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Anaphylaxis history ────────────────────────────────────
    for (i, a) in d.allergies.list.iter().enumerate() {
        if a.severity == "anaphylaxis" {
            let allergen = if a.allergen.is_empty() {
                "(allergen not specified)".to_string()
            } else {
                a.allergen.clone()
            };
            flags.push(AdditionalFlag {
                id: format!("FLAG-ANAPH-{i}"),
                category: "Allergy".to_string(),
                message: format!(
                    "Anaphylaxis history: {allergen} — ensure emergency drugs available."
                ),
                priority: "urgent".to_string(),
            });
        }
    }

    if d.allergies.list.len() >= 3 {
        flags.push(AdditionalFlag {
            id: "FLAG-MULTI-ALLERGY".to_string(),
            category: "Allergy".to_string(),
            message: format!(
                "Multiple allergies ({}) — review for cross-reactivity.",
                d.allergies.list.len()
            ),
            priority: "medium".to_string(),
        });
    }

    // ─── Malignant hyperthermia ─────────────────────────────────
    if d.previous_anaesthesia.malignant_hyperthermia == "yes"
        || d.previous_anaesthesia.family_anaesthetic_complications == "yes"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-MH".to_string(),
            category: "Anaesthetic History".to_string(),
            message: "Malignant hyperthermia risk — MH-safe anaesthetic, dantrolene availability.".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Drug-class flags ───────────────────────────────────────
    if d.medications.on_anticoagulants == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-ANTICOAG".to_string(),
            category: "Medications".to_string(),
            message: "Anticoagulant use — review bridging protocol.".to_string(),
            priority: "high".to_string(),
        });
    }
    if d.medications.on_antiplatelets == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-ANTIPLATE".to_string(),
            category: "Medications".to_string(),
            message: "Antiplatelet use — review perioperative management.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if d.medications.on_insulin == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-INSULIN".to_string(),
            category: "Medications".to_string(),
            message: "Insulin-dependent — perioperative glucose management plan required.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if d.medications.on_steroids == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-STEROIDS".to_string(),
            category: "Medications".to_string(),
            message: "Steroid use — consider perioperative steroid cover.".to_string(),
            priority: "medium".to_string(),
        });
    }
    if d.medications.on_maois == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-MAOI".to_string(),
            category: "Medications".to_string(),
            message: "MAOI use — significant drug-interaction risk with anaesthetic agents.".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Difficult airway history ───────────────────────────────
    if d.previous_anaesthesia.difficult_intubation {
        flags.push(AdditionalFlag {
            id: "FLAG-DIFF-AIRWAY".to_string(),
            category: "Airway".to_string(),
            message: "Previous difficult intubation — difficult-airway trolley, senior anaesthetist.".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── GORD ───────────────────────────────────────────────────
    if d.medical_history.gord == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-GORD".to_string(),
            category: "Medical History".to_string(),
            message: "GORD — consider rapid sequence induction.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Pregnancy ──────────────────────────────────────────────
    if d.social_history.pregnancy_status == "pregnant" {
        flags.push(AdditionalFlag {
            id: "FLAG-PREGNANT".to_string(),
            category: "Social History".to_string(),
            message: "Pregnant patient — obstetric anaesthesia considerations.".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Hypertension (uncontrolled) ────────────────────────────
    let sbp = d.vital_signs.systolic_bp;
    let dbp = d.vital_signs.diastolic_bp;
    if sbp.map_or(false, |v| v > 180) || dbp.map_or(false, |v| v > 110) {
        let sbp_s = sbp.map(|v| v.to_string()).unwrap_or_else(|| "?".to_string());
        let dbp_s = dbp.map(|v| v.to_string()).unwrap_or_else(|| "?".to_string());
        flags.push(AdditionalFlag {
            id: "FLAG-HYPERTENSION".to_string(),
            category: "Vital Signs".to_string(),
            message: format!(
                "Uncontrolled hypertension (BP {sbp_s}/{dbp_s} mmHg) — consider deferring elective surgery."
            ),
            priority: "high".to_string(),
        });
    }

    // ─── Hypoxia ────────────────────────────────────────────────
    if let Some(spo2) = d.vital_signs.spo2
        && spo2 < 94
    {
        flags.push(AdditionalFlag {
            id: "FLAG-HYPOXIA".to_string(),
            category: "Vital Signs".to_string(),
            message: format!(
                "Baseline SpO2 {spo2}% (<94%) — respiratory optimisation needed."
            ),
            priority: "high".to_string(),
        });
    }

    // ─── Morbid obesity / obesity ───────────────────────────────
    if let Some(bmi) = d.vital_signs.bmi {
        if bmi > 40.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-MORBID-OBESITY".to_string(),
                category: "Anthropometric".to_string(),
                message: format!(
                    "Morbid obesity (BMI {bmi}) — specialist equipment and positioning."
                ),
                priority: "medium".to_string(),
            });
        } else if bmi >= 35.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-OBESITY".to_string(),
                category: "Anthropometric".to_string(),
                message: format!(
                    "Obesity (BMI {bmi}) — airway and respiratory considerations."
                ),
                priority: "low".to_string(),
            });
        }
    }

    // ─── Smoking / alcohol / functional capacity ────────────────
    if d.social_history.smoking == "current" {
        flags.push(AdditionalFlag {
            id: "FLAG-SMOKER".to_string(),
            category: "Social History".to_string(),
            message: "Current smoker — increased respiratory complication risk.".to_string(),
            priority: "low".to_string(),
        });
    }
    if let Some(units) = d.social_history.alcohol_units_per_week
        && units > 14.0
    {
        flags.push(AdditionalFlag {
            id: "FLAG-ALCOHOL".to_string(),
            category: "Social History".to_string(),
            message: format!(
                "Elevated alcohol intake ({units} units/week) — hepatic and withdrawal considerations."
            ),
            priority: "medium".to_string(),
        });
    }
    if d.social_history.can_climb_two_flights == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-LOW-FUNC".to_string(),
            category: "Social History".to_string(),
            message: "Limited functional capacity (cannot climb 2 flights) — increased perioperative risk.".to_string(),
            priority: "medium".to_string(),
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
