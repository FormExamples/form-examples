//! Detection of additional flagged issues.

use std::collections::BTreeMap;

use chrono::{NaiveDate, Utc};

use super::types::{AdditionalFlag, AssessmentData, FiredRule};

/// Build the list of flagged issues for the examiner report.
///
/// Mirrors `flagged-issues.js` exactly (high > medium > low). All IDs are
/// preserved verbatim.
pub fn detect_additional_flags(
    data: &AssessmentData,
    critical_failures: &[FiredRule],
    deficiencies: &[FiredRule],
) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    // ─── High: per critical-skill failure (specific reason) ───
    for rule in critical_failures {
        flags.push(AdditionalFlag {
            id: format!("FLAG-CRIT-{}", rule.id),
            category: format!("Critical skill — {}", rule.category),
            message: format!("Critical-skill failure: {}", rule.description),
            priority: "high".to_string(),
        });
    }

    // ─── High: prior certification expired ───
    let expiry = &data.trainee_details.prior_certification_expiry;
    if !expiry.is_empty() {
        if let Ok(expiry_date) = NaiveDate::parse_from_str(expiry, "%Y-%m-%d") {
            let today = Utc::now().date_naive();
            if expiry_date < today {
                flags.push(AdditionalFlag {
                    id: "FLAG-CERT-EXPIRED".to_string(),
                    category: "Trainee Details".to_string(),
                    message: format!(
                        "Prior certification expired on {expiry} — recertification required."
                    ),
                    priority: "high".to_string(),
                });
            }
        }
    }

    // ─── High/Medium: multiple non-critical deficiencies overall ───
    if deficiencies.len() >= 2 {
        let priority = if deficiencies.len() > 2 { "high" } else { "medium" };
        flags.push(AdditionalFlag {
            id: "FLAG-MULTI-DEF".to_string(),
            category: "Performance".to_string(),
            message: format!(
                "{} non-critical deficiencies recorded — additional coaching recommended.",
                deficiencies.len()
            ),
            priority: priority.to_string(),
        });
    }

    // ─── High: same domain has multiple deficiencies ───
    let mut by_category: BTreeMap<String, Vec<&FiredRule>> = BTreeMap::new();
    for rule in deficiencies {
        by_category
            .entry(rule.category.clone())
            .or_default()
            .push(rule);
    }
    for (category, rules) in &by_category {
        if rules.len() >= 2 {
            let id_slug = category
                .split_whitespace()
                .collect::<Vec<_>>()
                .join("-")
                .to_uppercase();
            flags.push(AdditionalFlag {
                id: format!("FLAG-DOMAIN-{id_slug}"),
                category: format!("Domain weakness — {category}"),
                message: format!(
                    "{} deficiencies clustered in {category}; targeted remediation suggested.",
                    rules.len()
                ),
                priority: "high".to_string(),
            });
        }
    }

    // ─── Medium: hesitation in CPR compressions or ventilations ───
    if data.cpr_aed.effective_compressions == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-CPR-COMPRESSIONS".to_string(),
            category: "CPR & AED".to_string(),
            message: "Ineffective chest compressions — coach to push hard (5-6 cm) and fast (100-120/min).".to_string(),
            priority: "medium".to_string(),
        });
    }
    if data.cpr_aed.effective_ventilations == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-CPR-VENTILATIONS".to_string(),
            category: "CPR & AED".to_string(),
            message: "Ineffective ventilations — coach airway opening and mask seal for visible chest rise.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Medium: slow response / missed AVPU primary check ───
    if data.primary_survey_drabc.response_check == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-PS-RESPONSE".to_string(),
            category: "Primary Survey".to_string(),
            message: "Slow or missed response check — practice AVPU and shake-and-shout every scenario.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Medium: no haemostatic/dressing skill in major bleed ───
    if data.bleeding_wound_care.applied_dressing_correctly == "no"
        || data.bleeding_wound_care.haemostatic_dressing_applied == "no"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-BLEED-DRESSING".to_string(),
            category: "Bleeding".to_string(),
            message: "Hesitation with dressing/haemostatic application — drill wound packing and bandaging.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Medium: anaphylaxis recognised but EpiPen technique poor ───
    if data.medical_emergencies.recognised_anaphylaxis == "yes"
        && data.medical_emergencies.administered_epi_pen_safely == "no"
    {
        flags.push(AdditionalFlag {
            id: "FLAG-MED-EPIPEN".to_string(),
            category: "Medical Emergencies".to_string(),
            message: "Anaphylaxis recognised but EpiPen technique unsafe — practice outer-thigh injection drill.".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Low: improvement area (single non-critical deficiency) ───
    if deficiencies.len() == 1 {
        let d = &deficiencies[0];
        flags.push(AdditionalFlag {
            id: format!("FLAG-IMPROVE-{}", d.id),
            category: format!("Improvement area — {}", d.category),
            message: format!("Room for improvement: {}", d.description),
            priority: "low".to_string(),
        });
    }

    // ─── Low: debrief / examiner / trainee notes captured ───
    let handover = &data.recording_reporting_handover;
    if !handover.examiner_notes.trim().is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-DEBRIEF-EXAMINER".to_string(),
            category: "Debrief".to_string(),
            message: "Examiner notes recorded — review with trainee during debrief.".to_string(),
            priority: "low".to_string(),
        });
    }
    if !handover.trainee_feedback.trim().is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-DEBRIEF-TRAINEE".to_string(),
            category: "Debrief".to_string(),
            message: "Trainee self-feedback captured — incorporate into improvement plan.".to_string(),
            priority: "low".to_string(),
        });
    }
    if !handover.debrief_notes.trim().is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-DEBRIEF-NOTES".to_string(),
            category: "Debrief".to_string(),
            message: "Structured debrief notes recorded for the training file.".to_string(),
            priority: "low".to_string(),
        });
    }

    // Sort: high > medium > low (stable on insertion order).
    flags.sort_by_key(|f| match f.priority.as_str() {
        "high" => 0,
        "medium" => 1,
        "low" => 2,
        _ => 3,
    });

    flags
}
