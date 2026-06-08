//! Detection of additional flagged issues.

// Flagged-issue detection for the Seasonal Affective Disorder Assessment.
// Independent of the numeric grading (which `grade` does), this module
// raises clinician-facing flags prioritised as high / medium / low.
//
//  HIGH    — risk and severe-symptom alerts:
//              - active suicidal ideation, intent, plan, previous attempt
//              - self-harm Yes
//              - PHQ-9 item 9 >= 1 (any thoughts of self-harm)
//              - PHQ-9 total >= 20 (severe depression)
//              - SPAQ 'sad-likely' with severe occupational/social impact
//  MEDIUM  — gaps in care:
//              - no current treatment when severity is moderate or worse
//              - no light-therapy access
//              - work/relationships impaired
//              - hypersomnia / morning fatigue
//              - safety plan missing while risk indicators present
//  LOW     — lifestyle factors that may worsen seasonal mood:
//              - low daily outdoor light exposure
//              - works indoors, curtains closed daytime
//              - high carbohydrate craving
//              - high-latitude residence

use super::types::{AdditionalFlag, AssessmentData};

/// Detect prioritised flagged issues for a given assessment + grading.
pub fn detect_additional_flags(
    data: &AssessmentData,
    spaq_band: &str,
    phq9_score: i32,
    combined_severity: &str,
) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();
    let risk = &data.risk_assessment;
    let phq9 = &data.current_mood.phq9;
    let lx = &data.light_exposure;
    let prev = &data.previous_treatments;
    let social = &data.social_occupational;
    let sleep = &data.sleep_energy;
    let appetite = &data.appetite_weight;

    // ─── HIGH priority — risk & severe symptoms ──────────────
    if risk.suicidal_ideation == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-RISK-001".to_string(),
            category: "Risk Assessment".to_string(),
            message:
                "Active suicidal ideation reported — immediate clinical review and safety planning required."
                    .to_string(),
            priority: "high".to_string(),
        });
    }
    if risk.suicidal_intent == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-RISK-002".to_string(),
            category: "Risk Assessment".to_string(),
            message: "Suicidal intent disclosed — urgent crisis assessment indicated.".to_string(),
            priority: "high".to_string(),
        });
    }
    if !risk.suicidal_plan.trim().is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-RISK-003".to_string(),
            category: "Risk Assessment".to_string(),
            message: "Suicidal plan described — urgent crisis assessment indicated.".to_string(),
            priority: "high".to_string(),
        });
    }
    if risk.self_harm == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-RISK-004".to_string(),
            category: "Risk Assessment".to_string(),
            message: "Self-harm reported — urgent safety assessment required.".to_string(),
            priority: "high".to_string(),
        });
    }
    if risk.previous_attempt == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-RISK-005".to_string(),
            category: "Risk Assessment".to_string(),
            message:
                "Previous suicide attempt — heightened risk; consider specialist mental-health referral."
                    .to_string(),
            priority: "high".to_string(),
        });
    }

    if let Some(q9) = phq9.q9 {
        if q9 >= 1 {
            flags.push(AdditionalFlag {
                id: "FLAG-PHQ9-Q9".to_string(),
                category: "PHQ-9 Item 9".to_string(),
                message: format!(
                    "PHQ-9 item 9 (self-harm thoughts) scored {q9}/3 — requires direct clinician follow-up."
                ),
                priority: "high".to_string(),
            });
        }
    }

    if phq9_score >= 20 {
        flags.push(AdditionalFlag {
            id: "FLAG-PHQ9-SEVERE".to_string(),
            category: "PHQ-9 Severity".to_string(),
            message: format!(
                "PHQ-9 total {phq9_score}/27 — severe depression; consider urgent treatment intensification."
            ),
            priority: "high".to_string(),
        });
    }

    // Severe seasonal occupational / relational impact when SAD likely.
    if spaq_band == "sad-likely"
        && (social.work_impaired == "yes" || social.relationships_impaired == "yes")
    {
        flags.push(AdditionalFlag {
            id: "FLAG-SEASONAL-IMPACT".to_string(),
            category: "Seasonal Impact".to_string(),
            message:
                "SAD likely with significant impairment of work and/or relationships — prioritise active treatment."
                    .to_string(),
            priority: "high".to_string(),
        });
    }

    // ─── MEDIUM priority — gaps in care ──────────────────────
    let moderate_plus = matches!(combined_severity, "moderate" | "severe" | "critical");
    if moderate_plus && prev.current_treatment != "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-CARE-001".to_string(),
            category: "Treatment".to_string(),
            message:
                "No current treatment despite moderate-or-greater severity — consider initiating evidence-based therapy."
                    .to_string(),
            priority: "medium".to_string(),
        });
    }

    if lx.light_therapy_access == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-CARE-002".to_string(),
            category: "Light Therapy".to_string(),
            message:
                "Patient reports no access to light therapy — consider provision of a 10,000 lux light box."
                    .to_string(),
            priority: "medium".to_string(),
        });
    }

    if social.work_impaired == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-CARE-003".to_string(),
            category: "Occupational".to_string(),
            message:
                "Work performance impaired — discuss workplace adjustments and occupational health referral."
                    .to_string(),
            priority: "medium".to_string(),
        });
    }

    if social.relationships_impaired == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-CARE-004".to_string(),
            category: "Social".to_string(),
            message: "Relationships impaired by symptoms — consider couples or family support."
                .to_string(),
            priority: "medium".to_string(),
        });
    }

    if sleep.hypersomnia == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-SLEEP-001".to_string(),
            category: "Sleep".to_string(),
            message:
                "Hypersomnia reported — typical SAD feature; review sleep hygiene and morning light exposure."
                    .to_string(),
            priority: "medium".to_string(),
        });
    }

    if sleep.morning_fatigue == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-SLEEP-002".to_string(),
            category: "Sleep".to_string(),
            message:
                "Morning fatigue / difficulty waking — consider scheduled morning bright-light therapy."
                    .to_string(),
            priority: "medium".to_string(),
        });
    }

    let q9_positive = phq9.q9.is_some_and(|v| v >= 1);
    if risk.safety_plan_in_place == "no" && (risk.suicidal_ideation == "yes" || q9_positive) {
        flags.push(AdditionalFlag {
            id: "FLAG-CARE-005".to_string(),
            category: "Safety Planning".to_string(),
            message:
                "Risk indicators present but no safety plan in place — develop and document a safety plan now."
                    .to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── LOW priority — lifestyle / contextual ───────────────
    if let Some(min) = lx.daily_outdoor_minutes {
        if min < 30 {
            flags.push(AdditionalFlag {
                id: "FLAG-LIFE-001".to_string(),
                category: "Light Exposure".to_string(),
                message: format!(
                    "Only {min} min/day outdoors — encourage daily outdoor daylight, especially mornings."
                ),
                priority: "low".to_string(),
            });
        }
    }

    if lx.work_indoors == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-LIFE-002".to_string(),
            category: "Light Exposure".to_string(),
            message:
                "Works predominantly indoors — discuss daylight breaks and seating near windows."
                    .to_string(),
            priority: "low".to_string(),
        });
    }

    if lx.curtains_closed_daytime == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-LIFE-003".to_string(),
            category: "Light Exposure".to_string(),
            message: "Daytime curtains kept closed — encourage opening blinds during daylight hours."
                .to_string(),
            priority: "low".to_string(),
        });
    }

    if appetite.carbohydrate_craving == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-LIFE-004".to_string(),
            category: "Lifestyle".to_string(),
            message:
                "Marked carbohydrate craving — characteristic SAD feature; discuss balanced nutrition."
                    .to_string(),
            priority: "low".to_string(),
        });
    }

    if let Some(lat) = extract_latitude(&data.demographics.latitude) {
        if lat >= 50 {
            flags.push(AdditionalFlag {
                id: "FLAG-LIFE-005".to_string(),
                category: "Geographic".to_string(),
                message:
                    "Resides at high latitude (≥50°) — short winter daylight is a known SAD risk factor."
                        .to_string(),
                priority: "low".to_string(),
            });
        }
    }

    // Sort: high > medium > low.
    flags.sort_by_key(|f| match f.priority.as_str() {
        "high" => 0,
        "medium" => 1,
        "low" => 2,
        _ => 3,
    });

    flags
}

/// Extract a numeric latitude from a string like "54.5N", "54N", "60 S".
/// Returns None if no leading 2-3 digit run followed by N or S is found.
fn extract_latitude(latitude: &str) -> Option<i32> {
    if latitude.is_empty() {
        return None;
    }
    // Find run of 2-3 digits.
    let bytes = latitude.as_bytes();
    let mut start = None;
    let mut end = 0usize;
    for (i, &b) in bytes.iter().enumerate() {
        if b.is_ascii_digit() {
            if start.is_none() {
                start = Some(i);
            }
            end = i + 1;
        } else if start.is_some() {
            break;
        }
    }
    let s = start?;
    let digits = &latitude[s..end];
    if digits.is_empty() || digits.len() > 3 {
        return None;
    }
    // Look ahead for an N or S (any-case), possibly after non-digit chars.
    let rest = &latitude[end..];
    let has_ns = rest
        .chars()
        .any(|c| c == 'N' || c == 'n' || c == 'S' || c == 's');
    if !has_ns {
        return None;
    }
    digits.parse::<i32>().ok()
}
