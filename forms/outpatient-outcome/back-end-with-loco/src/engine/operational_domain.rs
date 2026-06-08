//! Operational domain module.

use super::types::{AssessmentData, DomainGrade, FiredRule};

/// Operational result.
pub struct OperationalResult {
    /// Grade.
    pub grade: DomainGrade,
    /// Rules.
    pub rules: Vec<FiredRule>,
}

/// Grade the Operational domain from NHS Attendance Outcome + wait-time vs target.
pub fn grade_operational(data: &AssessmentData) -> OperationalResult {
    let outcome = data.operational_efficiency.nhs_attendance_outcome.as_str();
    let wait = data.operational_efficiency.wait_time_days;
    let target = data.operational_efficiency.service_target_days;
    let mut rules: Vec<FiredRule> = Vec::new();

    if outcome.is_empty() {
        return OperationalResult { grade: String::new(), rules };
    }

    let dna_or_provider = outcome == "patient_dna" || outcome == "provider_cancelled";
    let patient_cancelled = outcome == "patient_cancelled";
    let attended = matches!(
        outcome,
        "attended_discharged" | "attended_follow_up" | "attended_pifu" | "attended_onward_referral"
    );

    if dna_or_provider {
        let desc = if outcome == "patient_dna" {
            "Appointment outcome: Did Not Attend".to_string()
        } else {
            "Appointment outcome: Provider Cancelled".to_string()
        };
        rules.push(FiredRule {
            id: "OPS-004".to_string(),
            domain: "Operational".to_string(),
            description: desc,
            grade: "E".to_string(),
        });
        return OperationalResult { grade: "E".to_string(), rules };
    }

    if patient_cancelled {
        rules.push(FiredRule {
            id: "OPS-003".to_string(),
            domain: "Operational".to_string(),
            description: "Appointment cancelled or rebooked by patient".to_string(),
            grade: "D".to_string(),
        });
        return OperationalResult { grade: "D".to_string(), rules };
    }

    if attended {
        if let (Some(w), Some(t)) = (wait, target) {
            if t > 0 {
                let ratio = w as f64 / t as f64;
                if ratio <= 1.0 {
                    rules.push(FiredRule {
                        id: "OPS-001".to_string(),
                        domain: "Operational".to_string(),
                        description: format!(
                            "Attended within target ({w}d ≤ {t}d target)"
                        ),
                        grade: "A".to_string(),
                    });
                    return OperationalResult { grade: "A".to_string(), rules };
                } else if ratio <= 1.5 {
                    rules.push(FiredRule {
                        id: "OPS-002A".to_string(),
                        domain: "Operational".to_string(),
                        description: format!(
                            "Attended within 1.5× target ({w}d vs {t}d target)"
                        ),
                        grade: "B".to_string(),
                    });
                    return OperationalResult { grade: "B".to_string(), rules };
                } else {
                    rules.push(FiredRule {
                        id: "OPS-002B".to_string(),
                        domain: "Operational".to_string(),
                        description: format!(
                            "Attended but wait exceeded 1.5× target ({w}d vs {t}d target)"
                        ),
                        grade: "C".to_string(),
                    });
                    return OperationalResult { grade: "C".to_string(), rules };
                }
            }
        }
        // Attended but no wait data: default to B with a data-quality note.
        rules.push(FiredRule {
            id: "OPS-001B".to_string(),
            domain: "Operational".to_string(),
            description: "Attended; wait-time or target not recorded (assumed within range)"
                .to_string(),
            grade: "B".to_string(),
        });
        return OperationalResult { grade: "B".to_string(), rules };
    }

    OperationalResult { grade: String::new(), rules }
}
