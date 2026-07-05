//! Shared response fixtures for the four-axis engine tests.

use neurodiversity_adjustment_response_loco_crate::engine::types::NeurodiversityAdjustmentResponse;

/// A fully-agreed, complete response fixture (no elevated legal risk).
pub fn create_fully_agreed_response() -> NeurodiversityAdjustmentResponse {
    NeurodiversityAdjustmentResponse {
        worker_name: "Sam Taylor".to_string(),
        worker_job_title: "Software Engineer".to_string(),
        worker_department: "Engineering".to_string(),
        worker_employee_reference: "EMP-4471".to_string(),
        manager_name: "Jordan Lee".to_string(),
        manager_role: "line-manager".to_string(),
        response_status: "agreed".to_string(),
        request_reference: "REQ-2001".to_string(),
        handling_method: "meeting".to_string(),
        assessed_date: "2026-06-01".to_string(),
        responded_date: "2026-06-05".to_string(),
        effective_date: "2026-06-10".to_string(),
        overall_decision: "agreed".to_string(),
        decision_rationale: "All requested adjustments are reasonable and low-cost.".to_string(),
        decline_reason_category: String::new(),
        agreed_working_environment: true,
        agreed_equipment_technology: true,
        agreed_working_arrangements: false,
        agreed_communication: false,
        agreed_support_mentoring: false,
        agreed_recruitment_process: false,
        agreed_policy_dress: false,
        agreed_other: false,
        agreed_adjustments_detail: "Noise-cancelling headphones and a quiet desk location."
            .to_string(),
        alternative_adjustments_detail: String::new(),
        trial_period: false,
        trial_period_weeks: None,
        review_scheduled: true,
        review_date: "2026-09-01".to_string(),
        occupational_health_referred: false,
        access_to_work_referred: true,
        support_resources_detail: "Equipment budget approved.".to_string(),
        responsibilities_detail: "Line manager to order equipment within two weeks.".to_string(),
        point_of_contact: "Jordan Lee".to_string(),
        escalated: false,
        escalation_detail: String::new(),
        notes: String::new(),
    }
}

/// A declined response with no rationale and no alternative — the principal
/// high-legal-risk fixture.
pub fn create_declined_no_rationale_response() -> NeurodiversityAdjustmentResponse {
    NeurodiversityAdjustmentResponse {
        response_status: "declined".to_string(),
        overall_decision: "declined".to_string(),
        decision_rationale: String::new(),
        decline_reason_category: String::new(),
        agreed_working_environment: false,
        agreed_equipment_technology: false,
        agreed_adjustments_detail: String::new(),
        alternative_adjustments_detail: String::new(),
        review_scheduled: false,
        review_date: String::new(),
        access_to_work_referred: false,
        support_resources_detail: String::new(),
        ..create_fully_agreed_response()
    }
}

/// An escalated response (dispute / grievance / appeal in progress).
pub fn create_escalated_response() -> NeurodiversityAdjustmentResponse {
    NeurodiversityAdjustmentResponse {
        escalated: true,
        escalation_detail: "Worker has raised a grievance about the outcome.".to_string(),
        ..create_fully_agreed_response()
    }
}

/// A response with adjustments agreed but no review scheduled.
pub fn create_agreed_no_review_response() -> NeurodiversityAdjustmentResponse {
    NeurodiversityAdjustmentResponse {
        review_scheduled: false,
        review_date: String::new(),
        ..create_fully_agreed_response()
    }
}
