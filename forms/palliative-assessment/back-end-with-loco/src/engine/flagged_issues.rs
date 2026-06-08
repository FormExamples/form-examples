//! Detection of additional flagged issues.

use super::types::{AdditionalFlag, AssessmentData};
use super::utils::{esas_raw, lowest_performance_status};

/// Detect clinician-facing palliative flags. Verbatim port of
/// `front-end-form-with-html/js/flagged-issues.js`. Flag IDs are stable
/// identifiers and must not change.
///
/// HIGH priority:
///   - Uncontrolled severe pain (ESAS pain >= 7)
///   - Uncontrolled severe dyspnoea (ESAS shortness of breath >= 7)
///   - Severe psychological distress (ESAS depression or anxiety >= 7)
///   - Severe wellbeing impairment (ESAS wellbeing >= 7)
///   - No DNACPR documented for end-of-life patient (PPS/AKPS <= 30)
///   - Severe carer burnout (carer reports being overwhelmed)
///
/// MEDIUM priority:
///   - Moderate symptom intensity (any ESAS 4-6)
///   - No core ACP documents (no RESPECT / ADRT / LPA)
///   - Partial medication / symptom-control coverage
///   - Missing key MDT referral (specialist palliative care or community
///     nursing not involved when PPS/AKPS <= 50)
///   - High carer strain
///
/// LOW priority:
///   - Mild symptom (any ESAS 1-3)
///   - Spiritual support not requested when faith / belief recorded
pub fn detect_additional_flags(data: &AssessmentData) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    let label_for = super::types::label_for;

    // ─── HIGH: severe symptoms ─────────────────────────────────────────
    if let Some(pain) = esas_raw(data, "pain") {
        if pain >= 7 {
            flags.push(AdditionalFlag {
                id: "FLAG-PALL-PAIN".to_string(),
                category: "Symptom Control".to_string(),
                message: format!(
                    "Uncontrolled severe pain (ESAS-r {pain}/10) — urgent analgesic review."
                ),
                priority: "high".to_string(),
            });
        }
    }

    if let Some(sob) = esas_raw(data, "shortnessOfBreath") {
        if sob >= 7 {
            flags.push(AdditionalFlag {
                id: "FLAG-PALL-DYSPNOEA".to_string(),
                category: "Symptom Control".to_string(),
                message: format!(
                    "Uncontrolled severe shortness of breath (ESAS-r {sob}/10) — review opioids, oxygen, fan therapy."
                ),
                priority: "high".to_string(),
            });
        }
    }

    let depression = esas_raw(data, "depression");
    let anxiety = esas_raw(data, "anxiety");
    let dep_severe = matches!(depression, Some(v) if v >= 7);
    let anx_severe = matches!(anxiety, Some(v) if v >= 7);
    if dep_severe || anx_severe {
        let mut parts: Vec<String> = Vec::new();
        if let Some(v) = depression {
            if v >= 7 {
                parts.push(format!("depression {v}/10"));
            }
        }
        if let Some(v) = anxiety {
            if v >= 7 {
                parts.push(format!("anxiety {v}/10"));
            }
        }
        flags.push(AdditionalFlag {
            id: "FLAG-PALL-PSYCH".to_string(),
            category: "Psychological".to_string(),
            message: format!(
                "Severe psychological distress ({}) — psychology or psychiatry input recommended.",
                parts.join(", ")
            ),
            priority: "high".to_string(),
        });
    }

    if let Some(wellbeing) = esas_raw(data, "wellbeing") {
        if wellbeing >= 7 {
            flags.push(AdditionalFlag {
                id: "FLAG-PALL-WELLBEING".to_string(),
                category: "Wellbeing".to_string(),
                message: format!(
                    "Severe wellbeing impairment (ESAS-r {wellbeing}/10) — holistic review recommended."
                ),
                priority: "high".to_string(),
            });
        }
    }

    // ─── HIGH: no DNACPR for end-of-life patient ───────────────────────
    let lowest_ps = lowest_performance_status(data);
    if let Some(ps) = lowest_ps {
        if ps <= 30 {
            let dnacpr = &data.goals_of_care_acp.dnacpr_documented;
            if dnacpr == "no" || dnacpr == "unknown" {
                flags.push(AdditionalFlag {
                    id: "FLAG-PALL-DNACPR".to_string(),
                    category: "Advance Care Planning".to_string(),
                    message: format!(
                        "No DNACPR documented despite low performance status (PPS/AKPS {ps}) — urgent ACP discussion."
                    ),
                    priority: "high".to_string(),
                });
            }
        }
    }

    // ─── HIGH: severe carer burnout ────────────────────────────────────
    if data.carer_family_support.carer_strain_level == "overwhelmed" {
        flags.push(AdditionalFlag {
            id: "FLAG-PALL-CARER-OVERWHELM".to_string(),
            category: "Carer Support".to_string(),
            message:
                "Primary carer reports being overwhelmed — urgent respite and support assessment."
                    .to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── MEDIUM: moderate symptoms (4-6) ───────────────────────────────
    let symptom_keys = [
        "pain",
        "tiredness",
        "drowsiness",
        "nausea",
        "lackOfAppetite",
        "shortnessOfBreath",
        "depression",
        "anxiety",
        "wellbeing",
        "other",
    ];
    for key in symptom_keys {
        if let Some(v) = esas_raw(data, key) {
            if (4..=6).contains(&v) {
                flags.push(AdditionalFlag {
                    id: format!("FLAG-PALL-MOD-{key}"),
                    category: "Symptom Control".to_string(),
                    message: format!(
                        "Moderate {} (ESAS-r {v}/10) — review symptom-control plan.",
                        label_for(key).to_lowercase()
                    ),
                    priority: "medium".to_string(),
                });
            }
        }
    }

    // ─── MEDIUM: no core ACP documents ─────────────────────────────────
    let acp = &data.goals_of_care_acp;
    let any_acp_answered = !acp.respect_form_completed.is_empty()
        || !acp.adrt_completed.is_empty()
        || !acp.lpa_health_and_welfare.is_empty();
    let any_acp_yes = acp.respect_form_completed == "yes"
        || acp.adrt_completed == "yes"
        || acp.lpa_health_and_welfare == "yes";
    if any_acp_answered && !any_acp_yes {
        flags.push(AdditionalFlag {
            id: "FLAG-PALL-ACP".to_string(),
            category: "Advance Care Planning".to_string(),
            message:
                "No advance-care planning documents recorded (RESPECT, ADRT, or LPA) — initiate ACP conversation."
                    .to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── MEDIUM: partial medication / symptom-control coverage ─────────
    if data.medications_symptom_control.symptom_control_overall == "partial" {
        flags.push(AdditionalFlag {
            id: "FLAG-PALL-MEDS-PARTIAL".to_string(),
            category: "Medications".to_string(),
            message:
                "Self-rated symptom control is partial — review regular and as-needed medications."
                    .to_string(),
            priority: "medium".to_string(),
        });
    }
    if data.medications_symptom_control.anticipatory_meds_prescribed == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-PALL-ANTICIPATORY".to_string(),
            category: "Medications".to_string(),
            message:
                "Anticipatory medications not prescribed — ensure end-of-life prescribing is in place."
                    .to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── MEDIUM: missing key MDT referral ──────────────────────────────
    if let Some(ps) = lowest_ps {
        if ps <= 50 {
            let mdt = &data.multidisciplinary_plan;
            if mdt.specialist_palliative_care_involved == "no" {
                flags.push(AdditionalFlag {
                    id: "FLAG-PALL-MDT-SPC".to_string(),
                    category: "Multidisciplinary Plan".to_string(),
                    message:
                        "Specialist palliative-care team not involved despite low performance status — consider referral."
                            .to_string(),
                    priority: "medium".to_string(),
                });
            }
            if mdt.community_nursing_involved == "no" {
                flags.push(AdditionalFlag {
                    id: "FLAG-PALL-MDT-COMM-NURSING".to_string(),
                    category: "Multidisciplinary Plan".to_string(),
                    message:
                        "Community nursing not involved despite low performance status — consider district-nurse referral."
                            .to_string(),
                    priority: "medium".to_string(),
                });
            }
        }
    }

    // ─── MEDIUM: severe carer strain (high but not overwhelmed) ────────
    if data.carer_family_support.carer_strain_level == "high" {
        flags.push(AdditionalFlag {
            id: "FLAG-PALL-CARER-HIGH".to_string(),
            category: "Carer Support".to_string(),
            message:
                "Carer reports high strain — consider respite, peer support, or carer assessment."
                    .to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── LOW: mild symptoms (1-3) ──────────────────────────────────────
    for key in symptom_keys {
        if let Some(v) = esas_raw(data, key) {
            if (1..=3).contains(&v) {
                flags.push(AdditionalFlag {
                    id: format!("FLAG-PALL-MILD-{key}"),
                    category: "Symptom Control".to_string(),
                    message: format!(
                        "Mild {} (ESAS-r {v}/10) — monitor and reassess at next review.",
                        label_for(key).to_lowercase()
                    ),
                    priority: "low".to_string(),
                });
            }
        }
    }

    // ─── LOW: spiritual support not requested when faith recorded ──────
    let psy = &data.psychosocial_spiritual_concerns;
    if !psy.faith_or_belief.trim().is_empty() && psy.spiritual_support_requested == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-PALL-SPIRITUAL".to_string(),
            category: "Spiritual".to_string(),
            message:
                "Faith or belief recorded but spiritual support not currently requested — offer chaplaincy revisit at next review."
                    .to_string(),
            priority: "low".to_string(),
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
