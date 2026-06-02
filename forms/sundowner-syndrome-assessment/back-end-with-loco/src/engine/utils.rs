use super::types::Severity;

/// CMAI severity thresholds (from the AGENTS.md spec):
///   29-45   -> mild       (occasional restlessness, redirectable)
///   46-75   -> moderate   (daily episodes, requires intervention)
///   76-120  -> severe     (aggressive behaviour, safety risk)
///   >120    -> critical   (self-harm risk, requires constant supervision)
pub fn severity_from_cmai(cmai: i32) -> Severity {
    if cmai > 120 {
        "critical".to_string()
    } else if cmai >= 76 {
        "severe".to_string()
    } else if cmai >= 46 {
        "moderate".to_string()
    } else {
        "mild".to_string()
    }
}

/// Display label for a severity band.
pub fn severity_label(s: &str) -> String {
    match s {
        "mild" => "Mild".to_string(),
        "moderate" => "Moderate".to_string(),
        "severe" => "Severe".to_string(),
        "critical" => "Critical".to_string(),
        _ => "".to_string(),
    }
}
