//! Detection of additional flagged issues.

use super::types::{AdditionalFlag, AssessmentData};

/// Issue categories that, when combined with harm grade >= 2, trigger the
/// regulatory-escalation flag. Matches `REGULATORY_CATEGORIES` in
/// `front-end-form-with-html/js/scoring.js`.
fn is_regulatory_category(c: &str) -> bool {
    matches!(
        c,
        "clinical-safety"
            | "data-protection"
            | "workplace-safety"
            | "medical-device"
            | "regulatory"
    )
}

/// Compute the additional safety flags. The flag IDs and categories are
/// preserved verbatim from the TypeScript engine.
pub fn compute_flags(data: &AssessmentData) -> Vec<AdditionalFlag> {
    let mut out: Vec<AdditionalFlag> = Vec::new();
    let s = &data.scores;

    if s.score_by_harm_grade == Some(4) {
        out.push(AdditionalFlag {
            flag_id: "F-HARM-FATAL-001".to_string(),
            category: "harm-fatal".to_string(),
            priority: "high".to_string(),
            description: "NHS LFPSE harm grade 4 (fatal).".to_string(),
            suggested_action:
                "Escalate to LFPSE; notify the trust patient-safety lead immediately."
                    .to_string(),
        });
    }
    if s.score_by_failure_condition == "A" {
        out.push(AdditionalFlag {
            flag_id: "F-FAILURE-A-001".to_string(),
            category: "failure-catastrophic".to_string(),
            priority: "high".to_string(),
            description: "FAA / EASA failure condition Level A (catastrophic).".to_string(),
            suggested_action:
                "Trigger incident bridge; notify safety officer; consider system shutdown."
                    .to_string(),
        });
    }
    if s.score_by_severity_of_impact == Some(5) {
        out.push(AdditionalFlag {
            flag_id: "F-SEVERITY-5-001".to_string(),
            category: "severity-catastrophic".to_string(),
            priority: "high".to_string(),
            description: "Severity of impact 5 (catastrophic).".to_string(),
            suggested_action:
                "Escalate to executive on-call; prepare customer communication.".to_string(),
        });
    }
    if s.score_by_magnitude_of_damage == Some(10) {
        out.push(AdditionalFlag {
            flag_id: "F-MAGNITUDE-10-001".to_string(),
            category: "magnitude-total-destruction".to_string(),
            priority: "high".to_string(),
            description: "Magnitude of damage 10 (total destruction).".to_string(),
            suggested_action:
                "Initiate disaster-recovery plan; preserve evidence for forensics."
                    .to_string(),
        });
    }
    if let Some(f) = s.score_by_frequency_percent {
        if f >= 95.0 {
            let pct = if f.fract().abs() < f64::EPSILON {
                format!("{}", f as i64)
            } else {
                format!("{:.2}", f)
            };
            out.push(AdditionalFlag {
                flag_id: "F-FREQUENCY-95-001".to_string(),
                category: "frequency-universal".to_string(),
                priority: "high".to_string(),
                description: format!(
                    "Frequency {pct}% \u{2014} effectively universal impact."
                ),
                suggested_action:
                    "Treat as full outage; activate status page and on-call rotation."
                        .to_string(),
            });
        }
    }
    if s.score_by_moscow_requirement == Some(1) {
        out.push(AdditionalFlag {
            flag_id: "F-MOSCOW-MUST-001".to_string(),
            category: "requirement-mandatory".to_string(),
            priority: "medium".to_string(),
            description: "MoSCoW classification \"must have\".".to_string(),
            suggested_action: "Hold release until resolved; do not defer.".to_string(),
        });
    }
    if is_regulatory_category(&data.reporter.issue_category)
        && s.score_by_harm_grade.map(|h| h >= 2).unwrap_or(false)
    {
        out.push(AdditionalFlag {
            flag_id: "F-REGULATORY-001".to_string(),
            category: "regulatory".to_string(),
            priority: "high".to_string(),
            description: format!(
                "Issue category \"{cat}\" with harm \u{2265} 2 \u{2014} regulatory reporting may apply.",
                cat = data.reporter.issue_category
            ),
            suggested_action:
                "Notify compliance / legal; prepare LFPSE / ICO / RIDDOR / MHRA report as appropriate."
                    .to_string(),
        });
    }

    out
}
