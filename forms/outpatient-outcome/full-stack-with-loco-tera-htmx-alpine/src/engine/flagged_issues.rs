use super::types::{AssessmentData, DomainGrade, FlaggedIssue};
use super::utils::eq5d_summary;

/// Derive flagged issues from assessment data and domain grades.
///
/// Priority codes: critical | high | medium | low.
pub fn detect_flagged_issues(
    data: &AssessmentData,
    clinical_grade: &DomainGrade,
    prem_grade: &DomainGrade,
) -> Vec<FlaggedIssue> {
    let mut flags: Vec<FlaggedIssue> = Vec::new();

    // ─── Critical: DNA or provider-cancelled ────────────────
    let outcome = data.operational_efficiency.nhs_attendance_outcome.as_str();
    if outcome == "patient_dna" {
        flags.push(FlaggedIssue {
            id: "FLAG-OPS-001".to_string(),
            category: "Operational".to_string(),
            message: "Patient Did Not Attend (DNA) — review and follow up required".to_string(),
            priority: "critical".to_string(),
        });
    }
    if outcome == "provider_cancelled" {
        flags.push(FlaggedIssue {
            id: "FLAG-OPS-002".to_string(),
            category: "Operational".to_string(),
            message: "Appointment cancelled by provider — rebooking required".to_string(),
            priority: "critical".to_string(),
        });
    }

    // ─── High: Clinical worsened or died ────────────────────
    let cls = data.clinical_outcome.outcome_classification.as_str();
    if clinical_grade == "D" {
        flags.push(FlaggedIssue {
            id: "FLAG-CLIN-001".to_string(),
            category: "Clinical".to_string(),
            message: format!("Clinical outcome: {cls} — patient condition worsened"),
            priority: "high".to_string(),
        });
    }
    if clinical_grade == "E" {
        flags.push(FlaggedIssue {
            id: "FLAG-CLIN-002".to_string(),
            category: "Clinical".to_string(),
            message: "Clinical outcome: Died — escalation and documentation required".to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Medium: FFT Poor or Very Poor ──────────────────────
    if prem_grade == "D" {
        flags.push(FlaggedIssue {
            id: "FLAG-PREM-001".to_string(),
            category: "Experience".to_string(),
            message: "Friends & Family Test: Poor — patient experience concern".to_string(),
            priority: "medium".to_string(),
        });
    }
    if prem_grade == "E" {
        flags.push(FlaggedIssue {
            id: "FLAG-PREM-002".to_string(),
            category: "Experience".to_string(),
            message: "Friends & Family Test: Very Poor — patient experience concern".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Medium: Any PROM instrument worsened ───────────────
    let eq5d = eq5d_summary(&data.prom_eq5d5l);
    if eq5d.worsened > 0 {
        flags.push(FlaggedIssue {
            id: "FLAG-PROM-001".to_string(),
            category: "PROM".to_string(),
            message: format!(
                "EQ-5D-5L: {} dimension(s) worsened since last assessment",
                eq5d.worsened
            ),
            priority: "medium".to_string(),
        });
    }

    let grc = data.prom_grc.global_rating_of_change;
    if let Some(g) = grc {
        if g < 0 {
            flags.push(FlaggedIssue {
                id: "FLAG-PROM-002".to_string(),
                category: "PROM".to_string(),
                message: format!("Global Rating of Change: {g} (worsened)"),
                priority: "medium".to_string(),
            });
        }
    }

    // ─── Low/Medium: Wait time vs target ────────────────────
    let wait = data.operational_efficiency.wait_time_days;
    let target = data.operational_efficiency.service_target_days;
    if let (Some(w), Some(t)) = (wait, target) {
        if t > 0 {
            let ratio = w as f64 / t as f64;
            if ratio > 1.5 {
                flags.push(FlaggedIssue {
                    id: "FLAG-OPS-003".to_string(),
                    category: "Operational".to_string(),
                    message: format!(
                        "Wait time ({w}d) exceeded 1.5× service target ({t}d)"
                    ),
                    priority: "medium".to_string(),
                });
            } else if ratio > 1.0 {
                flags.push(FlaggedIssue {
                    id: "FLAG-OPS-004".to_string(),
                    category: "Operational".to_string(),
                    message: format!(
                        "Wait time ({w}d) exceeded service target ({t}d)"
                    ),
                    priority: "low".to_string(),
                });
            }
        }
    }

    // ─── Low: Missing data quality flags ────────────────────
    let all_eq5d_after_null = data.prom_eq5d5l.after_mobility.is_none()
        && data.prom_eq5d5l.after_self_care.is_none()
        && data.prom_eq5d5l.after_usual_activities.is_none()
        && data.prom_eq5d5l.after_pain_discomfort.is_none()
        && data.prom_eq5d5l.after_anxiety_depression.is_none();

    if all_eq5d_after_null {
        flags.push(FlaggedIssue {
            id: "FLAG-DQ-001".to_string(),
            category: "Data Quality".to_string(),
            message: "EQ-5D-5L after-treatment responses not recorded".to_string(),
            priority: "low".to_string(),
        });
    }

    if grc.is_none() {
        flags.push(FlaggedIssue {
            id: "FLAG-DQ-002".to_string(),
            category: "Data Quality".to_string(),
            message: "Global Rating of Change (GRC) not recorded".to_string(),
            priority: "low".to_string(),
        });
    }

    let fft = data.prem_fft.fft_response.as_str();
    if fft.is_empty() || fft == "dont_know" {
        let msg = if fft == "dont_know" {
            "FFT response: Don't Know — cannot determine PREM grade".to_string()
        } else {
            "Friends & Family Test (FFT) response not recorded".to_string()
        };
        flags.push(FlaggedIssue {
            id: "FLAG-DQ-003".to_string(),
            category: "Data Quality".to_string(),
            message: msg,
            priority: "low".to_string(),
        });
    }

    if outcome.is_empty() {
        flags.push(FlaggedIssue {
            id: "FLAG-DQ-004".to_string(),
            category: "Data Quality".to_string(),
            message: "NHS Attendance Outcome code not recorded".to_string(),
            priority: "low".to_string(),
        });
    }

    // Sort: critical > high > medium > low.
    flags.sort_by_key(|f| match f.priority.as_str() {
        "critical" => 0,
        "high" => 1,
        "medium" => 2,
        "low" => 3,
        _ => 4,
    });

    flags
}
