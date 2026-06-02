use super::types::{AssessmentData, FiredRule, SeverityCategory};

/// Detect PCL-5 clinical-summary fired rules:
///
/// - `PCL-001` — Provisional PTSD cut-off (total score >= 33)
/// - `PCL-002` — DSM-5 symptom pattern (B>=1, C>=1, D>=2, E>=2 items rated >=2)
/// - `PCL-003` — Severe symptom burden (category == "Severe")
pub fn detect_fired_rules(
    _data: &AssessmentData,
    total: i32,
    category: &SeverityCategory,
    probable_dsm5: bool,
) -> Vec<FiredRule> {
    let mut fired: Vec<FiredRule> = Vec::new();

    if total >= 33 {
        fired.push(FiredRule {
            id: "PCL-001".to_string(),
            category: "Provisional PTSD cut-off".to_string(),
            description: format!(
                "Total score {total} meets or exceeds the provisional PTSD cut-off of 33."
            ),
            severity: if total >= 38 {
                "high".to_string()
            } else {
                "medium".to_string()
            },
        });
    }

    if probable_dsm5 {
        fired.push(FiredRule {
            id: "PCL-002".to_string(),
            category: "DSM-5 symptom pattern".to_string(),
            description:
                "Symptom pattern meets DSM-5 criteria for probable PTSD (B >= 1, C >= 1, D >= 2, E >= 2 items rated >= 2)."
                    .to_string(),
            severity: "high".to_string(),
        });
    }

    if category == "Severe" {
        fired.push(FiredRule {
            id: "PCL-003".to_string(),
            category: "Severe symptom burden".to_string(),
            description: "Total score >= 38 indicates clinically significant PTSD.".to_string(),
            severity: "critical".to_string(),
        });
    }

    fired
}
