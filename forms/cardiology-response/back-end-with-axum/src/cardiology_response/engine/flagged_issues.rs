//! Safety-critical flag detection, independent of the four axes.
//!
//! Flag categories mirror `sql/07_create_table_cardiology_response_grade_flag.sql`.
//! Flags are returned sorted high → medium → low priority.

use super::types::{CardiologyResponse, Flag};
use super::utils::{has_critical_finding, has_reduced_ejection_fraction};

fn priority_order(priority: &str) -> u8 {
    match priority {
        "high" => 0,
        "medium" => 1,
        _ => 2,
    }
}

/// Detect safety-critical flags for a response.
#[must_use]
#[allow(clippy::too_many_lines)] // linear clinical rule list; splitting adds indirection, not clarity
pub fn detect_flags(r: &CardiologyResponse) -> Vec<Flag> {
    let mut flags: Vec<Flag> = Vec::new();

    // ─── critical-finding (auto-raised with a critical result) ───
    if has_critical_finding(r) {
        flags.push(Flag {
            flag_id: "F-CRITICAL-FINDING-001".to_string(),
            category: "critical-finding".to_string(),
            priority: "high".to_string(),
            description:
                "A critical or unexpected significant cardiac result is present (e.g. critical arrhythmia, severe symptomatic aortic stenosis, acute coronary syndrome)."
                    .to_string(),
            suggested_action:
                "Communicate the critical result to the referrer immediately, arrange urgent review, and document the communication."
                    .to_string(),
        });

        // critical result that has not yet been communicated
        if !r.critical_result_communicated {
            flags.push(Flag {
                flag_id: "F-CRITICAL-FINDING-002".to_string(),
                category: "critical-finding".to_string(),
                priority: "high".to_string(),
                description:
                    "Critical result present but it has not been recorded as communicated to the referrer."
                        .to_string(),
                suggested_action:
                    "Contact the referrer now and record who was informed, with date and time."
                        .to_string(),
            });
        }
    }

    // ─── severe-valve-disease ───
    if r.significant_valve_disease {
        flags.push(Flag {
            flag_id: "F-SEVERE-VALVE-DISEASE-001".to_string(),
            category: "severe-valve-disease".to_string(),
            priority: "high".to_string(),
            description: "Significant (moderate–severe) valve disease requiring specialist management."
                .to_string(),
            suggested_action:
                "Refer to the valve / structural heart team and consider Heart Team discussion per ESC/EACTS guidance."
                    .to_string(),
        });
    }

    // ─── significant-arrhythmia ───
    if r.significant_arrhythmia {
        flags.push(Flag {
            flag_id: "F-SIGNIFICANT-ARRHYTHMIA-001".to_string(),
            category: "significant-arrhythmia".to_string(),
            priority: "medium".to_string(),
            description: "Significant arrhythmia present and may require management.".to_string(),
            suggested_action:
                "Arrange rhythm management, anticoagulation assessment, and arrhythmia-service follow-up as indicated."
                    .to_string(),
        });
    }

    // ─── reduced-ejection-fraction ───
    if has_reduced_ejection_fraction(r) {
        flags.push(Flag {
            flag_id: "F-REDUCED-EJECTION-FRACTION-001".to_string(),
            category: "reduced-ejection-fraction".to_string(),
            priority: "high".to_string(),
            description:
                "Reduced left-ventricular ejection fraction (heart failure with reduced ejection fraction)."
                    .to_string(),
            suggested_action:
                "Start / optimise guideline-directed heart-failure therapy and arrange heart-failure service follow-up per NICE NG106."
                    .to_string(),
        });
    }

    // ─── missing-diagnosis ───
    if r.primary_diagnosis_category.is_empty() && r.diagnosis_narrative.trim().is_empty() {
        flags.push(Flag {
            flag_id: "F-MISSING-DIAGNOSIS-001".to_string(),
            category: "missing-diagnosis".to_string(),
            priority: "medium".to_string(),
            description: "No diagnosis category or narrative has been recorded.".to_string(),
            suggested_action: "Record a diagnosis that answers the referral clinical question."
                .to_string(),
        });
    }

    // ─── incomplete-response ───
    let missing_sections = i32::from(r.clinical_summary.trim().is_empty())
        + i32::from(r.examination_findings.trim().is_empty())
        + i32::from(r.management_plan.trim().is_empty())
        + i32::from(r.recommended_follow_up.trim().is_empty());
    if missing_sections > 0 {
        flags.push(Flag {
            flag_id: "F-INCOMPLETE-RESPONSE-001".to_string(),
            category: "incomplete-response".to_string(),
            priority: if missing_sections >= 2 { "medium" } else { "low" }.to_string(),
            description: format!(
                "One or more mandatory response sections are missing ({missing_sections} of summary / examination / management / follow-up)."
            ),
            suggested_action: "Complete the missing response sections before finalising the reply."
                .to_string(),
        });
    }

    // ─── other: structured cardiac finding without a critical flag set ───
    if r.uncontrolled_hypertension && !has_critical_finding(r) {
        flags.push(Flag {
            flag_id: "F-OTHER-001".to_string(),
            category: "other".to_string(),
            priority: "low".to_string(),
            description: "Uncontrolled hypertension documented.".to_string(),
            suggested_action:
                "Optimise antihypertensive therapy and arrange blood-pressure monitoring per NICE guidance."
                    .to_string(),
        });
    }

    // Sort: high > medium > low (stable, preserves insertion order within a tier).
    flags.sort_by_key(|f| priority_order(&f.priority));

    flags
}
