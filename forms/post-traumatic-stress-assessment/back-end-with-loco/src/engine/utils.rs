//! Helper predicates and counters used by the grader.

use super::types::SeverityCategory;

/// Display label for a severity category.
pub fn category_description(category: &str) -> String {
    match category {
        "Minimal" => "Below clinical concern.".to_string(),
        "Mild" => "Sub-threshold symptoms; monitor and offer support.".to_string(),
        "Moderate" => "Probable PTSD (>= 33 is the recommended provisional cut-off); diagnostic interview recommended.".to_string(),
        "Severe" => "Clinically significant PTSD; trauma-focused therapy indicated.".to_string(),
        _ => String::new(),
    }
}

/// PCL-5 provisional PTSD cut-off (total score threshold).
pub const CUT_OFF: i32 = 33;

/// Bucket a 0-80 PCL-5 total score into one of the four severity bands.
pub fn categorise(total: i32) -> SeverityCategory {
    if total <= 20 {
        "Minimal".to_string()
    } else if total <= 32 {
        "Mild".to_string()
    } else if total <= 37 {
        "Moderate".to_string()
    } else {
        "Severe".to_string()
    }
}
