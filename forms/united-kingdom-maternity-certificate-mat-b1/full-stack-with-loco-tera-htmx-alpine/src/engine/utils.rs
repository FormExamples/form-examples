//! Display-side helpers for the MAT B1 assessment.

/// Friendly label for the certificate-type enum.
pub fn certificate_type_label(value: &str) -> &'static str {
    match value {
        "pre" => "Part A — Pre-confinement",
        "post" => "Part B — Post-confinement",
        _ => "Not selected",
    }
}

/// Friendly label for the issuer-type enum.
pub fn issuer_type_label(value: &str) -> &'static str {
    match value {
        "doctor" => "Doctor",
        "midwife" => "Registered midwife",
        _ => "Not selected",
    }
}

/// Display label for the overall assessment status (complete / incomplete).
pub fn complete_label(complete: bool) -> &'static str {
    if complete { "Complete" } else { "Incomplete" }
}
