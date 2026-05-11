use crate::scoring::types::{
    AdditionalFlag, FailureCondition, FlagCategory, FlagPriority, IssueTrackerAssessment,
};

pub fn compute(data: &IssueTrackerAssessment) -> Vec<AdditionalFlag> {
    let s = &data.scores;
    let r = &data.reporter;
    let mut out = Vec::<AdditionalFlag>::new();

    if s.score_by_harm_grade == Some(4) {
        out.push(AdditionalFlag {
            flag_id: "F-HARM-FATAL-001".into(),
            category: FlagCategory::HarmFatal,
            priority: FlagPriority::High,
            description: "NHS LFPSE harm grade 4 (fatal).".into(),
            suggested_action: "Escalate to LFPSE; notify the trust patient-safety lead immediately."
                .into(),
        });
    }

    if s.score_by_failure_condition == FailureCondition::A {
        out.push(AdditionalFlag {
            flag_id: "F-FAILURE-A-001".into(),
            category: FlagCategory::FailureCatastrophic,
            priority: FlagPriority::High,
            description: "FAA / EASA failure condition Level A (catastrophic).".into(),
            suggested_action:
                "Trigger incident bridge; notify safety officer; consider system shutdown.".into(),
        });
    }

    if s.score_by_severity_of_impact == Some(5) {
        out.push(AdditionalFlag {
            flag_id: "F-SEVERITY-5-001".into(),
            category: FlagCategory::SeverityCatastrophic,
            priority: FlagPriority::High,
            description: "Severity of impact 5 (catastrophic).".into(),
            suggested_action: "Escalate to executive on-call; prepare customer communication."
                .into(),
        });
    }

    if s.score_by_magnitude_of_damage == Some(10) {
        out.push(AdditionalFlag {
            flag_id: "F-MAGNITUDE-10-001".into(),
            category: FlagCategory::MagnitudeTotalDestruction,
            priority: FlagPriority::High,
            description: "Magnitude of damage 10 (total destruction).".into(),
            suggested_action: "Initiate disaster-recovery plan; preserve evidence for forensics."
                .into(),
        });
    }

    if let Some(f) = s.score_by_frequency_percent {
        if f >= 95.0 {
            out.push(AdditionalFlag {
                flag_id: "F-FREQUENCY-95-001".into(),
                category: FlagCategory::FrequencyUniversal,
                priority: FlagPriority::High,
                description: format!("Frequency {f}% — effectively universal impact."),
                suggested_action: "Treat as full outage; activate status page and on-call rotation."
                    .into(),
            });
        }
    }

    if s.score_by_moscow_requirement == Some(1) {
        out.push(AdditionalFlag {
            flag_id: "F-MOSCOW-MUST-001".into(),
            category: FlagCategory::RequirementMandatory,
            priority: FlagPriority::Medium,
            description: "MoSCoW classification \"must have\".".into(),
            suggested_action: "Hold release until resolved; do not defer.".into(),
        });
    }

    let regulatory = matches!(
        r.issue_category.as_str(),
        "clinical-safety" | "data-protection" | "workplace-safety" | "medical-device" | "regulatory"
    );
    if regulatory && matches!(s.score_by_harm_grade, Some(h) if h >= 2) {
        out.push(AdditionalFlag {
            flag_id: "F-REGULATORY-001".into(),
            category: FlagCategory::Regulatory,
            priority: FlagPriority::High,
            description: format!(
                "Issue category \"{}\" with harm ≥ 2 — regulatory reporting may apply.",
                r.issue_category
            ),
            suggested_action:
                "Notify compliance / legal; prepare LFPSE / ICO / RIDDOR / MHRA report as appropriate."
                    .into(),
        });
    }

    out
}
