use super::types::{AdditionalFlag, AssessmentData};

/// Detect safety-critical clinical flags raised independently of cluster rules.
///
/// Flag catalogue (verbatim from the front-end PCL-5 reference engine):
///
/// - `FLAG-SELFHARM-001` — Item 16 rated >= 3 (self-harm / suicidality risk) — urgent
/// - `FLAG-DISSOCIATION-001` — Items 3 and 8 both rated >= 3 — high
/// - `FLAG-STRUCTURED-INTERVIEW-001` — DSM-5 pattern met — medium
/// - `FLAG-SEVERE-001` — Total score >= 38 (severe symptom burden) — high
/// - `FLAG-NOT-ASSESSED-001` — Zero items answered — medium
/// - `FLAG-NOT-ASSESSED-002` — Fewer than 20 items answered — medium
/// - `FLAG-TRAUMA-UNSPECIFIED-001` — Trauma event description missing — medium
/// - `FLAG-TRAUMA-ONGOING-001` — Patient indicates ongoing trauma exposure — high
pub fn detect_additional_flags(
    data: &AssessmentData,
    total: i32,
    probable_dsm5: bool,
    answered_count: i32,
) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    // ─── Suicidal ideation / self-destructive behaviour ────────
    let item16 = data
        .cluster_e_arousal_reactivity
        .item16_reckless_or_self_destructive
        .unwrap_or(0);
    if item16 >= 3 {
        flags.push(AdditionalFlag {
            id: "FLAG-SELFHARM-001".to_string(),
            category: "Self-harm / suicidality risk".to_string(),
            message:
                "Item 16 (taking too many risks or doing things that could cause harm) rated Quite a bit or Extremely - screen for suicidal ideation and complete a safety plan before the patient leaves the consultation."
                    .to_string(),
            priority: "urgent".to_string(),
        });
    }

    // ─── Possible dissociative features ────────────────────────
    let item3 = data.cluster_b_intrusion.item3_feeling_reliving.unwrap_or(0);
    let item8 = data
        .cluster_d_negative_alterations
        .item8_trouble_remembering_important_parts
        .unwrap_or(0);
    if item3 >= 3 && item8 >= 3 {
        flags.push(AdditionalFlag {
            id: "FLAG-DISSOCIATION-001".to_string(),
            category: "Possible dissociative features".to_string(),
            message:
                "Items 3 (reliving) and 8 (memory gaps) both rated >= 3 - consider the dissociative subtype and add the PCL-5 dissociative items if not already used."
                    .to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── DSM-5 pattern met → structured interview recommended ──
    if probable_dsm5 {
        flags.push(AdditionalFlag {
            id: "FLAG-STRUCTURED-INTERVIEW-001".to_string(),
            category: "Structured clinical interview recommended".to_string(),
            message:
                "Provisional diagnosis met - arrange a CAPS-5 or equivalent structured interview to confirm the diagnosis and inform treatment planning."
                    .to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Severe symptom burden alert ──────────────────────────
    if total >= 38 {
        flags.push(AdditionalFlag {
            id: "FLAG-SEVERE-001".to_string(),
            category: "Severe symptom burden".to_string(),
            message:
                "Total score >= 38 - trauma-focused psychotherapy (e.g. CPT, PE, EMDR) is indicated; consider pharmacotherapy review."
                    .to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── Assessment incomplete ────────────────────────────────
    if answered_count == 0 {
        flags.push(AdditionalFlag {
            id: "FLAG-NOT-ASSESSED-001".to_string(),
            category: "Assessment incomplete".to_string(),
            message:
                "No PCL-5 items were answered - confirm the patient completed the questionnaire before interpreting the score."
                    .to_string(),
            priority: "medium".to_string(),
        });
    } else if answered_count < 20 {
        flags.push(AdditionalFlag {
            id: "FLAG-NOT-ASSESSED-002".to_string(),
            category: "Assessment incomplete".to_string(),
            message: format!(
                "Only {answered_count} of 20 PCL-5 items answered - total score may under-estimate symptom burden."
            ),
            priority: "medium".to_string(),
        });
    }

    // ─── Trauma event description missing ─────────────────────
    if data.trauma_event.event_description.trim().is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-TRAUMA-UNSPECIFIED-001".to_string(),
            category: "Trauma event not specified".to_string(),
            message:
                "No trauma event description recorded - the PCL-5 score must be interpreted in the context of a specified DSM-5 Criterion A event."
                    .to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Ongoing trauma exposure ──────────────────────────────
    if data.trauma_event.is_ongoing {
        flags.push(AdditionalFlag {
            id: "FLAG-TRAUMA-ONGOING-001".to_string(),
            category: "Ongoing trauma exposure".to_string(),
            message:
                "Patient indicates the traumatic event or situation is still happening - assess immediate safety and consider whether trauma-focused therapy is appropriate at this time."
                    .to_string(),
            priority: "high".to_string(),
        });
    }

    // Sort: urgent > high > medium > low.
    flags.sort_by_key(|f| match f.priority.as_str() {
        "urgent" => 0,
        "high" => 1,
        "medium" => 2,
        "low" => 3,
        _ => 4,
    });

    flags
}
