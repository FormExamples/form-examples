//! Detects clinically significant issues in a WHO acute referral submission.
//! These are independent of completeness — for example, the patient may have
//! filled every field but disclose an aspiration risk, abnormal vital signs,
//! or a highly infectious condition that requires urgent attention from the
//! receiving facility.
//!
//! Priorities (urgent → high → medium → low) drive sort order in the report.

use crate::engine::types::{AssessmentData, FlagPriority, FlaggedIssue};

/// Detect flagged issues.
pub fn detect_flagged_issues(data: &AssessmentData) -> Vec<FlaggedIssue> {
    let mut flags: Vec<FlaggedIssue> = Vec::new();
    let v = &data.assessment.vital_signs;
    let p = &data.recommendations.precautions;

    // ─── Highly infectious disease (urgent) ───────────────────
    if p.highly_infectious_disease {
        flags.push(FlaggedIssue {
            id: "FLAG-INF-001".into(),
            category: "Infection control".into(),
            message:
                "Highly infectious disease precaution flagged — receiving facility must prepare isolation and PPE."
                    .into(),
            priority: FlagPriority::Urgent,
        });
    }

    // ─── Vital signs: airway/breathing/oxygenation (urgent) ───
    if let Some(spo2) = v.oxygen_saturation {
        if spo2 < 90.0 {
            flags.push(FlaggedIssue {
                id: "FLAG-VIT-SPO2".into(),
                category: "Vital signs".into(),
                message: format!("Oxygen saturation {spo2}% is critically low (< 90%)."),
                priority: FlagPriority::Urgent,
            });
        }
    }

    if let Some(rr) = v.respiratory_rate {
        if rr < 8.0 || rr > 30.0 {
            flags.push(FlaggedIssue {
                id: "FLAG-VIT-RR".into(),
                category: "Vital signs".into(),
                message: format!("Respiratory rate {rr}/min is outside the safe range (8-30)."),
                priority: FlagPriority::Urgent,
            });
        }
    }

    if let Some(gcs) = v.glasgow_coma_scale {
        if gcs <= 8.0 {
            flags.push(FlaggedIssue {
                id: "FLAG-VIT-GCS".into(),
                category: "Vital signs".into(),
                message: format!(
                    "Glasgow Coma Scale {gcs} indicates severely depressed consciousness (<= 8)."
                ),
                priority: FlagPriority::Urgent,
            });
        }
    }

    // ─── Vital signs: circulation / perfusion (high) ──────────
    if let Some(sbp) = v.systolic_blood_pressure {
        if sbp < 90.0 {
            flags.push(FlaggedIssue {
                id: "FLAG-VIT-SBP-LOW".into(),
                category: "Vital signs".into(),
                message: format!(
                    "Systolic blood pressure {sbp} mmHg suggests hypotension/shock (< 90)."
                ),
                priority: FlagPriority::High,
            });
        } else if sbp > 180.0 {
            flags.push(FlaggedIssue {
                id: "FLAG-VIT-SBP-HIGH".into(),
                category: "Vital signs".into(),
                message: format!("Systolic blood pressure {sbp} mmHg is severely elevated (> 180)."),
                priority: FlagPriority::High,
            });
        }
    }

    if let Some(hr) = v.heart_rate {
        if hr < 50.0 || hr > 130.0 {
            flags.push(FlaggedIssue {
                id: "FLAG-VIT-HR".into(),
                category: "Vital signs".into(),
                message: format!("Heart rate {hr}/min is outside the safe range (50-130)."),
                priority: FlagPriority::High,
            });
        }
    }

    if let Some(t) = v.temperature_celsius {
        if t < 35.0 || t >= 39.0 {
            flags.push(FlaggedIssue {
                id: "FLAG-VIT-TEMP".into(),
                category: "Vital signs".into(),
                message: format!(
                    "Temperature {t}C is outside the safe range (hypothermia < 35C, hyperpyrexia >= 39C)."
                ),
                priority: FlagPriority::High,
            });
        }
    }

    // ─── Aspiration risk (high) ───────────────────────────────
    if p.aspiration_risk {
        flags.push(FlaggedIssue {
            id: "FLAG-PRC-ASP".into(),
            category: "Precaution".into(),
            message:
                "Aspiration risk flagged — keep airway protected and head-up positioning during transport."
                    .into(),
            priority: FlagPriority::High,
        });
    }

    // ─── Spinal precautions (high) ────────────────────────────
    if p.spinal_precautions {
        flags.push(FlaggedIssue {
            id: "FLAG-PRC-SPN".into(),
            category: "Precaution".into(),
            message:
                "Spinal precautions in place — maintain immobilisation throughout the transfer."
                    .into(),
            priority: FlagPriority::High,
        });
    }

    // ─── Pregnancy (high) ─────────────────────────────────────
    if data.situation.pregnant == "yes" {
        flags.push(FlaggedIssue {
            id: "FLAG-PREG".into(),
            category: "Obstetric".into(),
            message:
                "Patient is pregnant — receiving facility should involve obstetric team on arrival."
                    .into(),
            priority: FlagPriority::High,
        });
    }

    // ─── Provider documented potential worsening (high) ───────
    if !data
        .recommendations
        .potential_worsening_of_condition
        .trim()
        .is_empty()
    {
        flags.push(FlaggedIssue {
            id: "FLAG-WORSEN".into(),
            category: "Trajectory".into(),
            message:
                "Initiating provider has documented anticipated deterioration during transport - see recommendations."
                    .into(),
            priority: FlagPriority::High,
        });
    }

    // ─── Fall risk (medium) ───────────────────────────────────
    if p.fall_risk {
        flags.push(FlaggedIssue {
            id: "FLAG-PRC-FALL".into(),
            category: "Precaution".into(),
            message: "Fall risk flagged — ensure stretcher straps and bed-rails on arrival.".into(),
            priority: FlagPriority::Medium,
        });
    }

    // ─── Weight-bearing restrictions (medium) ────────────────
    if p.weight_bearing_restrictions {
        flags.push(FlaggedIssue {
            id: "FLAG-PRC-WBR".into(),
            category: "Precaution".into(),
            message:
                "Weight-bearing restrictions flagged — manual handling plan required for transfers."
                    .into(),
            priority: FlagPriority::Medium,
        });
    }

    // ─── Other documented precaution (medium) ────────────────
    if p.other && !p.other_details.trim().is_empty() {
        flags.push(FlaggedIssue {
            id: "FLAG-PRC-OTHER".into(),
            category: "Precaution".into(),
            message: format!("Other precaution flagged: {}", p.other_details.trim()),
            priority: FlagPriority::Medium,
        });
    }

    // ─── Cautions regarding prior therapies (medium) ─────────
    if !data
        .recommendations
        .cautions_regarding_prior_therapies
        .trim()
        .is_empty()
    {
        flags.push(FlaggedIssue {
            id: "FLAG-CAUTION".into(),
            category: "Therapy caution".into(),
            message:
                "Cautions regarding prior therapies or interventions documented - review before continuing care."
                    .into(),
            priority: FlagPriority::Medium,
        });
    }

    // ─── Air or sea transfer (low) ───────────────────────────
    let mode = data.facility_and_transport.mode_of_transfer.as_str();
    if mode == "air" || mode == "sea" {
        flags.push(FlaggedIssue {
            id: "FLAG-MODE".into(),
            category: "Transport".into(),
            message: format!(
                "Mode of transfer is {} - confirm equipment is rated for the environment.",
                mode.to_uppercase()
            ),
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
