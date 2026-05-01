//! Detects flags that should be highlighted for the clinician, independent of
//! subscale severity. Suicidal ideation always escalates to URGENT regardless
//! of DASS-21 totals.

use crate::engine::types::{
    AdditionalFlag, AssessmentData, DassSeverity, FlagPriority, SubscaleScore,
};

pub fn detect_additional_flags(
    data: &AssessmentData,
    depression: &SubscaleScore,
    anxiety: &SubscaleScore,
    stress: &SubscaleScore,
) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    // ─── Risk-screen escalations ─────────────────────────────
    if data.risk_screen.suicidal_ideation == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-RISK-001".into(),
            category: "Risk Screen".into(),
            message: "Suicidal ideation reported - urgent clinician review required before next session.".into(),
            priority: FlagPriority::Urgent,
        });
    }
    if data.risk_screen.harm_to_others == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-RISK-002".into(),
            category: "Risk Screen".into(),
            message: "Thoughts of harming others reported - urgent clinician review and risk assessment.".into(),
            priority: FlagPriority::Urgent,
        });
    }
    if data.risk_screen.self_harm == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-RISK-003".into(),
            category: "Risk Screen".into(),
            message: "Self-harm reported - safety planning recommended.".into(),
            priority: FlagPriority::High,
        });
    }
    if data.risk_screen.psychiatric_emergency_history == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-RISK-004".into(),
            category: "Risk Screen".into(),
            message: "Previous psychiatric emergency - review prior crisis plans and supports.".into(),
            priority: FlagPriority::High,
        });
    }
    if data.risk_screen.has_safety_plan == "no" {
        flags.push(AdditionalFlag {
            id: "FLAG-RISK-005".into(),
            category: "Risk Screen".into(),
            message: "No current safety plan in place - consider collaborative safety planning.".into(),
            priority: FlagPriority::Medium,
        });
    }

    // ─── Subscale severity escalations ───────────────────────
    match depression.severity {
        DassSeverity::ExtremelySevere => flags.push(AdditionalFlag {
            id: "FLAG-DASS-D-001".into(),
            category: "Depression".into(),
            message: format!("Depression DASS-21 score {} - extremely severe range.", depression.scaled),
            priority: FlagPriority::High,
        }),
        DassSeverity::Severe => flags.push(AdditionalFlag {
            id: "FLAG-DASS-D-002".into(),
            category: "Depression".into(),
            message: format!("Depression DASS-21 score {} - severe range.", depression.scaled),
            priority: FlagPriority::Medium,
        }),
        _ => {}
    }
    match anxiety.severity {
        DassSeverity::ExtremelySevere => flags.push(AdditionalFlag {
            id: "FLAG-DASS-A-001".into(),
            category: "Anxiety".into(),
            message: format!("Anxiety DASS-21 score {} - extremely severe range.", anxiety.scaled),
            priority: FlagPriority::High,
        }),
        DassSeverity::Severe => flags.push(AdditionalFlag {
            id: "FLAG-DASS-A-002".into(),
            category: "Anxiety".into(),
            message: format!("Anxiety DASS-21 score {} - severe range.", anxiety.scaled),
            priority: FlagPriority::Medium,
        }),
        _ => {}
    }
    match stress.severity {
        DassSeverity::ExtremelySevere => flags.push(AdditionalFlag {
            id: "FLAG-DASS-S-001".into(),
            category: "Stress".into(),
            message: format!("Stress DASS-21 score {} - extremely severe range.", stress.scaled),
            priority: FlagPriority::High,
        }),
        DassSeverity::Severe => flags.push(AdditionalFlag {
            id: "FLAG-DASS-S-002".into(),
            category: "Stress".into(),
            message: format!("Stress DASS-21 score {} - severe range.", stress.scaled),
            priority: FlagPriority::Medium,
        }),
        _ => {}
    }

    // ─── Functional impact ───────────────────────────────────
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
            id: "FLAG-FUNC-001".into(),
            category: "Functional Impact".into(),
            message: format!(
                "Severe functional impairment in {} domains - prioritise intervention planning.",
                severe_impacts
            ),
            priority: FlagPriority::High,
        });
    } else if severe_impacts == 1 {
        flags.push(AdditionalFlag {
            id: "FLAG-FUNC-002".into(),
            category: "Functional Impact".into(),
            message: "Severe functional impairment in 1 domain - clarify support needs.".into(),
            priority: FlagPriority::Medium,
        });
    }

    // ─── Support, treatment, substance use ───────────────────
    if data.support_and_history.social_support == "isolated" {
        flags.push(AdditionalFlag {
            id: "FLAG-SUPP-001".into(),
            category: "Support and History".into(),
            message: "Patient reports social isolation - consider connection-focused interventions.".into(),
            priority: FlagPriority::Medium,
        });
    }
    if data.support_and_history.substance_use_concern == "yes" {
        flags.push(AdditionalFlag {
            id: "FLAG-SUPP-002".into(),
            category: "Support and History".into(),
            message: "Substance-use concern reported - consider co-occurring disorders screening.".into(),
            priority: FlagPriority::Medium,
        });
    }
    let dep_elevated = matches!(
        depression.severity,
        DassSeverity::Severe | DassSeverity::ExtremelySevere
    );
    let anx_elevated = matches!(
        anxiety.severity,
        DassSeverity::Severe | DassSeverity::ExtremelySevere
    );
    if data.support_and_history.family_mental_health_history == "yes"
        && (dep_elevated || anx_elevated)
    {
        flags.push(AdditionalFlag {
            id: "FLAG-SUPP-003".into(),
            category: "Support and History".into(),
            message: "Family mental-health history with elevated current symptoms - consider psychiatric referral.".into(),
            priority: FlagPriority::Low,
        });
    }

    fn order(p: FlagPriority) -> u8 {
        match p {
            FlagPriority::Urgent => 0,
            FlagPriority::High => 1,
            FlagPriority::Medium => 2,
            FlagPriority::Low => 3,
        }
    }
    flags.sort_by_key(|f| order(f.priority));
    flags
}
