//! Shared review fixtures for the four-axis engine tests.

use neurodiversity_adjustment_review_loco_crate::engine::types::NeurodiversityAdjustmentReview;

/// A fully complete review where all rated adjustments are working well (no
/// elevated wellbeing risk, no flags).
pub fn create_working_well_review() -> NeurodiversityAdjustmentReview {
    NeurodiversityAdjustmentReview {
        worker_name: "Sam Taylor".to_string(),
        worker_job_title: "Software Engineer".to_string(),
        worker_department: "Engineering".to_string(),
        worker_employee_reference: "EMP-4471".to_string(),
        manager_name: "Jordan Lee".to_string(),
        manager_role: "line-manager".to_string(),
        review_status: "completed".to_string(),
        response_reference: "RESP-2001".to_string(),
        review_method: "meeting".to_string(),
        review_date: "2026-06-01".to_string(),
        next_review_date: "2026-12-01".to_string(),
        effectiveness_working_environment: "working-well".to_string(),
        effectiveness_equipment_technology: "working-well".to_string(),
        effectiveness_working_arrangements: String::new(),
        effectiveness_communication: String::new(),
        effectiveness_support_mentoring: String::new(),
        effectiveness_recruitment_process: String::new(),
        effectiveness_policy_dress: String::new(),
        effectiveness_other: String::new(),
        worker_feedback: "The adjustments are working well for me.".to_string(),
        worker_satisfied: "yes".to_string(),
        wellbeing_change: "improved".to_string(),
        barriers_detail: String::new(),
        changes_needed: false,
        changes_detail: String::new(),
        updated_adjustments_detail: String::new(),
        occupational_health_rereferral: false,
        escalated: false,
        escalation_detail: String::new(),
        notes: String::new(),
    }
}

/// A review where one adjustment is no longer working and the worker is only
/// partially satisfied.
pub fn create_not_working_review() -> NeurodiversityAdjustmentReview {
    NeurodiversityAdjustmentReview {
        effectiveness_communication: "not-working".to_string(),
        worker_satisfied: "partially".to_string(),
        wellbeing_change: "unchanged".to_string(),
        ..create_working_well_review()
    }
}

/// A review where no adjustment is working and at least one is not working.
pub fn create_ineffective_review() -> NeurodiversityAdjustmentReview {
    NeurodiversityAdjustmentReview {
        effectiveness_working_environment: "not-working".to_string(),
        effectiveness_equipment_technology: "not-working".to_string(),
        worker_satisfied: "no".to_string(),
        wellbeing_change: "worse".to_string(),
        occupational_health_rereferral: false,
        ..create_working_well_review()
    }
}

/// An escalated review (dispute / grievance in progress).
pub fn create_escalated_review() -> NeurodiversityAdjustmentReview {
    NeurodiversityAdjustmentReview {
        escalated: true,
        escalation_detail: "Worker has raised a grievance about the adjustments.".to_string(),
        ..create_working_well_review()
    }
}

/// A review with no next review date set.
pub fn create_no_next_review_review() -> NeurodiversityAdjustmentReview {
    NeurodiversityAdjustmentReview {
        next_review_date: String::new(),
        ..create_working_well_review()
    }
}
