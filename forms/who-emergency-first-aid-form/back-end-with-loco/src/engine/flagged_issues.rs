//! Detect clinically significant flags for the WHO Emergency First Aid form.
//!
//! These are independent of pure completeness — for example, the patient may
//! have a major bleeding finding without an intervention, or a tourniquet may
//! have been applied without recording the time. Flags are sorted urgent →
//! high → medium → low for display in the report.

use crate::engine::cfar_rules::{
    breathing_assessment_answered, has_any_airway_intervention,
    has_any_major_bleeding_intervention, has_non_tourniquet_bleeding_intervention, has_text,
};
use crate::engine::types::{AssessmentData, FlagPriority, FlaggedIssue};

/// Detect flagged issues.
pub fn detect_flagged_issues(data: &AssessmentData) -> Vec<FlaggedIssue> {
    let mut flags: Vec<FlaggedIssue> = Vec::new();

    // ─── Major bleeding without any intervention (urgent) ─────
    if !data.major_bleeding.assessment_normal
        && has_text(&data.major_bleeding.assessment_findings)
        && !has_any_major_bleeding_intervention(&data.major_bleeding)
    {
        flags.push(FlaggedIssue {
            id: "FLAG-MB-001".into(),
            category: "Major Bleeding".into(),
            message:
                "Major bleeding findings recorded with no intervention applied — escalate immediately."
                    .into(),
            priority: FlagPriority::Urgent,
        });
    }

    // ─── Tourniquet applied without time (urgent) ─────────────
    if data.major_bleeding.interventions.tourniquet
        && !has_text(&data.major_bleeding.interventions.tourniquet_application_time)
    {
        flags.push(FlaggedIssue {
            id: "FLAG-MB-002".into(),
            category: "Major Bleeding".into(),
            message:
                "Tourniquet applied but time of application not recorded — required for safe handover."
                    .into(),
            priority: FlagPriority::Urgent,
        });
    }

    // ─── Tourniquet applied without other bleeding control (high)
    if data.major_bleeding.interventions.tourniquet
        && !has_non_tourniquet_bleeding_intervention(&data.major_bleeding)
    {
        flags.push(FlaggedIssue {
            id: "FLAG-MB-003".into(),
            category: "Major Bleeding".into(),
            message:
                "Tourniquet applied without prior direct pressure or wound packing documented — confirm clinical justification."
                    .into(),
            priority: FlagPriority::High,
        });
    }

    // ─── Airway abnormal but no airway intervention (urgent) ──
    if !data.airway.assessment_normal
        && has_text(&data.airway.assessment_findings)
        && !has_any_airway_intervention(&data.airway)
    {
        flags.push(FlaggedIssue {
            id: "FLAG-AW-001".into(),
            category: "Airway".into(),
            message:
                "Abnormal airway findings recorded with no intervention applied — escalate immediately."
                    .into(),
            priority: FlagPriority::Urgent,
        });
    }

    // ─── Airway intervention without confirmation (high) ──────
    if (data.airway.interventions.head_tilt_chin_lift
        || data.airway.interventions.jaw_thrust
        || data.airway.interventions.choking_care)
        && data.airway.assessment_normal
        && !has_text(&data.airway.assessment_findings)
    {
        flags.push(FlaggedIssue {
            id: "FLAG-AW-002".into(),
            category: "Airway".into(),
            message:
                "Airway intervention recorded but assessment marked Normal with no findings — confirm clinical reasoning."
                    .into(),
            priority: FlagPriority::High,
        });
    }

    // ─── Pregnancy declared (high) ────────────────────────────
    if data.situation.pregnant == "yes" {
        flags.push(FlaggedIssue {
            id: "FLAG-PR-001".into(),
            category: "Pregnancy".into(),
            message: "Patient is pregnant — alert receiving facility and prioritise transport."
                .into(),
            priority: FlagPriority::High,
        });
    }

    // ─── Highly infectious disease precaution (high) ──────────
    if data.recommendations.precautions.highly_infectious_disease {
        flags.push(FlaggedIssue {
            id: "FLAG-PC-001".into(),
            category: "Precautions".into(),
            message:
                "Highly infectious disease precaution flagged — apply isolation procedures and warn receiving team."
                    .into(),
            priority: FlagPriority::High,
        });
    }

    // ─── Spinal immobilization precaution (high) ──────────────
    if data.recommendations.precautions.spinal_immobilization {
        flags.push(FlaggedIssue {
            id: "FLAG-PC-002".into(),
            category: "Precautions".into(),
            message: "Spinal immobilization required — maintain alignment throughout transport."
                .into(),
            priority: FlagPriority::High,
        });
    }

    // ─── Possible fracture precaution (medium) ────────────────
    if data.recommendations.precautions.possible_fracture {
        flags.push(FlaggedIssue {
            id: "FLAG-PC-003".into(),
            category: "Precautions".into(),
            message: "Possible fracture flagged — splint and minimise movement.".into(),
            priority: FlagPriority::Medium,
        });
    }

    // ─── Altered mental status precaution (high) ──────────────
    if data.recommendations.precautions.altered_mental_status {
        flags.push(FlaggedIssue {
            id: "FLAG-PC-004".into(),
            category: "Precautions".into(),
            message:
                "Altered mental status flagged — monitor airway and neurological status closely."
                    .into(),
            priority: FlagPriority::High,
        });
    }

    // ─── Fall risk precaution (medium) ────────────────────────
    if data.recommendations.precautions.fall_risk {
        flags.push(FlaggedIssue {
            id: "FLAG-PC-005".into(),
            category: "Precautions".into(),
            message: "Fall risk flagged — ensure assisted transfers.".into(),
            priority: FlagPriority::Medium,
        });
    }

    // ─── Breathing abnormal documented (medium) ───────────────
    if !data.breathing.assessment_normal
        && has_text(&data.breathing.assessment_findings)
        && breathing_assessment_answered(&data.breathing)
    {
        flags.push(FlaggedIssue {
            id: "FLAG-BR-001".into(),
            category: "Breathing".into(),
            message: "Abnormal breathing findings recorded — clinician review on handover.".into(),
            priority: FlagPriority::Medium,
        });
    }

    // ─── Disability abnormal documented (medium) ──────────────
    if !data.disability.assessment_normal && has_text(&data.disability.assessment_findings) {
        flags.push(FlaggedIssue {
            id: "FLAG-DS-001".into(),
            category: "Disability".into(),
            message: "Abnormal neurological findings recorded — clinician review on handover."
                .into(),
            priority: FlagPriority::Medium,
        });
    }

    // ─── Glucose given (low) ──────────────────────────────────
    if data.disability.interventions.glucose_given {
        flags.push(FlaggedIssue {
            id: "FLAG-DS-002".into(),
            category: "Disability".into(),
            message: "Glucose administered — record blood glucose and monitor for response.".into(),
            priority: FlagPriority::Low,
        });
    }

    // ─── Drowning care (medium) ───────────────────────────────
    if data.exposure.interventions.drowning_care {
        flags.push(FlaggedIssue {
            id: "FLAG-EX-001".into(),
            category: "Exposure".into(),
            message:
                "Drowning care administered — risk of secondary drowning, monitor for respiratory deterioration."
                    .into(),
            priority: FlagPriority::Medium,
        });
    }

    // ─── Snakebite care (medium) ──────────────────────────────
    if data.exposure.interventions.snakebite_care {
        flags.push(FlaggedIssue {
            id: "FLAG-EX-002".into(),
            category: "Exposure".into(),
            message: "Snakebite care administered — antivenom may be required at facility.".into(),
            priority: FlagPriority::Medium,
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
