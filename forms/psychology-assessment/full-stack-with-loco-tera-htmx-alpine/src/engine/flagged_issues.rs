use super::types::{AdditionalFlag, AssessmentData, SubscaleScore};

/// Detect psychology-assessment safety / clinical flags. These are computed
/// independently of DASS-21 severity (which is decided by the grader) and
/// raise clinician-facing flags for:
///
///   - risk-screen positives (suicidal ideation, harm to others, etc.)
///   - severe / extremely-severe DASS-21 subscale scores
///   - severe functional impairment across domains
///   - support / treatment / substance-use concerns
///
/// Priority ladder: urgent > high > medium > low.
///
/// Flag catalogue:
///   - FLAG-RISK-001  — Risk screen: suicidal ideation = yes (urgent)
///   - FLAG-RISK-002  — Risk screen: harm to others = yes (urgent)
///   - FLAG-RISK-003  — Risk screen: self-harm = yes (high)
///   - FLAG-RISK-004  — Risk screen: psychiatric emergency history = yes (high)
///   - FLAG-RISK-005  — Risk screen: no current safety plan (medium)
///   - FLAG-DASS-D-001 — Depression extremely severe (high)
///   - FLAG-DASS-D-002 — Depression severe (medium)
///   - FLAG-DASS-A-001 — Anxiety extremely severe (high)
///   - FLAG-DASS-A-002 — Anxiety severe (medium)
///   - FLAG-DASS-S-001 — Stress extremely severe (high)
///   - FLAG-DASS-S-002 — Stress severe (medium)
///   - FLAG-FUNC-001  — Severe functional impairment in 2+ domains (high)
///   - FLAG-FUNC-002  — Severe functional impairment in 1 domain (medium)
///   - FLAG-SUPP-001  — Social isolation reported (medium)
///   - FLAG-SUPP-002  — Substance-use concern reported (medium)
///   - FLAG-SUPP-003  — Family mental-health history + severe+ current symptoms (low)
pub fn detect_additional_flags(
    data: &AssessmentData,
    depression: &SubscaleScore,
    anxiety: &SubscaleScore,
    stress: &SubscaleScore,
) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    // ─── Risk-screen escalations ──────────────────────────────────

    if data.risk_screen.suicidal_ideation == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-RISK-001".to_string(),
            category: "Risk Screen".to_string(),
            message:
                "Suicidal ideation reported - urgent clinician review required before next session."
                    .to_string(),
            priority: "urgent".to_string(),
        });
    }

    if data.risk_screen.harm_to_others == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-RISK-002".to_string(),
            category: "Risk Screen".to_string(),
            message:
                "Thoughts of harming others reported - urgent clinician review and risk assessment."
                    .to_string(),
            priority: "urgent".to_string(),
        });
    }

    if data.risk_screen.self_harm == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-RISK-003".to_string(),
            category: "Risk Screen".to_string(),
            message: "Self-harm reported - safety planning recommended.".to_string(),
            priority: "high".to_string(),
        });
    }

    if data.risk_screen.psychiatric_emergency_history == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-RISK-004".to_string(),
            category: "Risk Screen".to_string(),
            message: "Previous psychiatric emergency - review prior crisis plans and supports."
                .to_string(),
            priority: "high".to_string(),
        });
    }

    if data.risk_screen.has_safety_plan == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-RISK-005".to_string(),
            category: "Risk Screen".to_string(),
            message: "No current safety plan in place - consider collaborative safety planning."
                .to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Subscale severity escalations ────────────────────────────

    if depression.severity == "extremely-severe" {
        flags.push(AdditionalFlag {
            id: "FLAG-DASS-D-001".to_string(),
            category: "Depression".to_string(),
            message: format!(
                "Depression DASS-21 score {} - extremely severe range.",
                depression.scaled
            ),
            priority: "high".to_string(),
        });
    } else if depression.severity == "severe" {
        flags.push(AdditionalFlag {
            id: "FLAG-DASS-D-002".to_string(),
            category: "Depression".to_string(),
            message: format!(
                "Depression DASS-21 score {} - severe range.",
                depression.scaled
            ),
            priority: "medium".to_string(),
        });
    }

    if anxiety.severity == "extremely-severe" {
        flags.push(AdditionalFlag {
            id: "FLAG-DASS-A-001".to_string(),
            category: "Anxiety".to_string(),
            message: format!(
                "Anxiety DASS-21 score {} - extremely severe range.",
                anxiety.scaled
            ),
            priority: "high".to_string(),
        });
    } else if anxiety.severity == "severe" {
        flags.push(AdditionalFlag {
            id: "FLAG-DASS-A-002".to_string(),
            category: "Anxiety".to_string(),
            message: format!("Anxiety DASS-21 score {} - severe range.", anxiety.scaled),
            priority: "medium".to_string(),
        });
    }

    if stress.severity == "extremely-severe" {
        flags.push(AdditionalFlag {
            id: "FLAG-DASS-S-001".to_string(),
            category: "Stress".to_string(),
            message: format!(
                "Stress DASS-21 score {} - extremely severe range.",
                stress.scaled
            ),
            priority: "high".to_string(),
        });
    } else if stress.severity == "severe" {
        flags.push(AdditionalFlag {
            id: "FLAG-DASS-S-002".to_string(),
            category: "Stress".to_string(),
            message: format!("Stress DASS-21 score {} - severe range.", stress.scaled),
            priority: "medium".to_string(),
        });
    }

    // ─── Functional impact ────────────────────────────────────────

    let fi = &data.functional_impact;
    let severe_impacts = [
        &fi.work_impact,
        &fi.relationship_impact,
        &fi.daily_activities_impact,
        &fi.sleep_impact,
    ]
    .iter()
    .filter(|x| x.as_str() == "severe")
    .count();

    if severe_impacts >= 2 {
        flags.push(AdditionalFlag {
            id: "FLAG-FUNC-001".to_string(),
            category: "Functional Impact".to_string(),
            message: format!(
                "Severe functional impairment in {severe_impacts} domains - prioritise intervention planning."
            ),
            priority: "high".to_string(),
        });
    } else if severe_impacts == 1 {
        flags.push(AdditionalFlag {
            id: "FLAG-FUNC-002".to_string(),
            category: "Functional Impact".to_string(),
            message: "Severe functional impairment in 1 domain - clarify support needs."
                .to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── Support, treatment, substance use ────────────────────────

    if data.support_and_history.social_support == "isolated" {
        flags.push(AdditionalFlag {
            id: "FLAG-SUPP-001".to_string(),
            category: "Support and History".to_string(),
            message:
                "Patient reports social isolation - consider connection-focused interventions."
                    .to_string(),
            priority: "medium".to_string(),
        });
    }

    if data.support_and_history.substance_use_concern == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-SUPP-002".to_string(),
            category: "Support and History".to_string(),
            message:
                "Substance-use concern reported - consider co-occurring disorders screening."
                    .to_string(),
            priority: "medium".to_string(),
        });
    }

    if data.support_and_history.family_mental_health_history == "yes"
        && (depression.severity == "severe"
            || depression.severity == "extremely-severe"
            || anxiety.severity == "severe"
            || anxiety.severity == "extremely-severe")
    {
        flags.push(AdditionalFlag {
            id: "FLAG-SUPP-003".to_string(),
            category: "Support and History".to_string(),
            message:
                "Family mental-health history with elevated current symptoms - consider psychiatric referral."
                    .to_string(),
            priority: "low".to_string(),
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
