//! Red-flag predicates and the service/reason matching map.
//!
//! Ported from `front-end-with-svelte/src/lib/engine/utils.ts`.

use super::types::CardiologyRequest;

/// Any acute red flag (suspected acute coronary syndrome, exertional syncope,
/// or new-onset heart failure) drives the safety axis and auto-escalates the
/// triage tier.
#[must_use]
pub fn has_red_flag(r: &CardiologyRequest) -> bool {
    r.suspected_acs || r.exertional_syncope || r.new_onset_heart_failure
}

/// Whether the referral describes typical-angina chest pain (a near-red-flag).
#[must_use]
pub fn has_typical_angina(r: &CardiologyRequest) -> bool {
    r.symptom_chest_pain && r.chest_pain_character == "typical-angina"
}

/// The typical requested services for each referral reason.
fn allowed_services(reason: &str) -> Option<&'static [&'static str]> {
    match reason {
        "chest-pain" => Some(&["rapid-access-chest-pain", "general-cardiology"]),
        "breathlessness" | "heart-failure-symptoms" => {
            Some(&["heart-failure", "general-cardiology"])
        }
        "palpitations" | "arrhythmia" | "syncope" => {
            Some(&["arrhythmia-ep", "general-cardiology"])
        }
        "murmur-or-valve" => Some(&["valve-clinic", "general-cardiology"]),
        "abnormal-ecg" => Some(&["general-cardiology", "arrhythmia-ep"]),
        "hypertension" => Some(&["general-cardiology"]),
        "pre-operative-assessment" => Some(&["pre-operative-cardiac", "general-cardiology"]),
        _ => None,
    }
}

/// Whether the requested service matches the typical service for the reason.
#[must_use]
pub fn service_matches_reason(r: &CardiologyRequest) -> bool {
    match allowed_services(&r.referral_reason) {
        Some(allowed) => allowed.contains(&r.requested_service.as_str()),
        None => false,
    }
}
