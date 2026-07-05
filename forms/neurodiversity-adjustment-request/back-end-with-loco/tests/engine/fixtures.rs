//! Shared request fixtures for the four-axis grading-engine tests.

use neurodiversity_adjustment_request_loco_crate::engine::types::NeurodiversityAdjustmentRequest;

/// A complete request for a worker who is likely covered by the Equality Act
/// 2010: a substantial and long-term adverse effect, every mandatory section
/// filled, low current impact, routine urgency. Grades to
/// eligibility `likely-covered`, impact `ok`, completeness `100`, priority
/// `routine`, recommendation `progress-to-meeting`, and raises only the
/// `disability-duty-engaged` flag.
pub fn create_covered_request() -> NeurodiversityAdjustmentRequest {
    NeurodiversityAdjustmentRequest {
        worker_name: "Alex Ng".to_string(),
        worker_job_title: "Software Developer".to_string(),
        manager_name: "Jordan Blake".to_string(),
        request_date: "2026-07-01".to_string(),
        condition_autism: true,
        diagnosis_status: "diagnosed".to_string(),
        considers_disability: "yes".to_string(),
        substantial_long_term_impact: true,
        disclosure_consent: true,
        difficulty_sensory_overload: true,
        tasks_situations_affected: "Open-plan office noise disrupts focus during deep work.".to_string(),
        worker_strengths: "Strong pattern recognition and deep focus in quiet conditions.".to_string(),
        adjustment_working_environment: true,
        adjustments_requested_detail:
            "A quiet desk away from walkways; noise-cancelling headphones.".to_string(),
        current_impact: "low".to_string(),
        urgency: "routine".to_string(),
        ..Default::default()
    }
}

/// A worker at risk of sickness absence / burnout with severe current impact and
/// no occupational-health involvement. Grades to impact `high-risk`, priority
/// `urgent`, recommendation `seek-occupational-health`, and adds the
/// `burnout-risk` and `occupational-health-recommended` flags on top of the
/// `disability-duty-engaged` flag.
pub fn create_absence_risk_request() -> NeurodiversityAdjustmentRequest {
    NeurodiversityAdjustmentRequest {
        at_risk_of_absence: true,
        current_impact: "severe".to_string(),
        difficulty_burnout_wellbeing: true,
        ..create_covered_request()
    }
}

/// An all-but-empty request: no conditions, no difficulties, no adjustments, no
/// consent. Grades to eligibility `unclear`, completeness `0`, recommendation
/// `request-more-detail`, and raises the no-consent / missing-adjustments /
/// missing-difficulties flags.
pub fn create_minimal_request() -> NeurodiversityAdjustmentRequest {
    NeurodiversityAdjustmentRequest::default()
}
