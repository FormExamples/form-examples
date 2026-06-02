use super::types::AssessmentData;
use super::utils::normalize_likert_scores;

/// A declarative satisfaction-survey rule. Each rule evaluates the survey
/// data and returns true if its condition is detected.
///
/// Severity: 1 = minor, 2 = moderate, 3 = significant, 4 = critical.
pub struct SatisfactionRule {
    pub id: &'static str,
    pub domain: &'static str,
    pub description: &'static str,
    pub severity: u32,
    pub evaluate: fn(&AssessmentData) -> bool,
}

/// All Patient Satisfaction Survey rules (port of `js/rules.js`).
pub fn all_rules() -> Vec<SatisfactionRule> {
    vec![
        // ─── ACCESS & WAITING TIMES ────────────────────────────────
        SatisfactionRule {
            id: "ACC-001",
            domain: "Access",
            description: "Difficulty booking appointment (score 1-2)",
            severity: 2,
            evaluate: |d| matches!(d.access_waiting_times.ease_of_booking, Some(v) if v <= 2),
        },
        SatisfactionRule {
            id: "ACC-002",
            domain: "Access",
            description: "Long waiting time for appointment (score 1-2)",
            severity: 2,
            evaluate: |d| matches!(d.access_waiting_times.waiting_time_for_appointment, Some(v) if v <= 2),
        },
        SatisfactionRule {
            id: "ACC-003",
            domain: "Access",
            description: "Long waiting time on the day (score 1-2)",
            severity: 2,
            evaluate: |d| matches!(d.access_waiting_times.waiting_time_on_day, Some(v) if v <= 2),
        },
        SatisfactionRule {
            id: "ACC-004",
            domain: "Access",
            description: "Excessive on-day wait (>60 minutes)",
            severity: 3,
            evaluate: |d| matches!(d.access_waiting_times.actual_wait_minutes, Some(v) if v > 60),
        },
        SatisfactionRule {
            id: "ACC-005",
            domain: "Access",
            description: "Poor reception service (score 1)",
            severity: 3,
            evaluate: |d| matches!(d.access_waiting_times.reception_service, Some(1)),
        },
        SatisfactionRule {
            id: "ACC-006",
            domain: "Access",
            description: "Access domain score below 50%",
            severity: 3,
            evaluate: |d| {
                let s = normalize_likert_scores(&[
                    d.access_waiting_times.ease_of_booking,
                    d.access_waiting_times.waiting_time_for_appointment,
                    d.access_waiting_times.waiting_time_on_day,
                    d.access_waiting_times.reception_service,
                    d.access_waiting_times.signage_wayfinding,
                    d.access_waiting_times.parking_transport,
                ]);
                matches!(s, Some(v) if v < 50.0)
            },
        },
        // ─── COMMUNICATION & INFORMATION ──────────────────────────
        SatisfactionRule {
            id: "COM-001",
            domain: "Communication",
            description: "Poor explanation of condition (score 1-2)",
            severity: 2,
            evaluate: |d| matches!(d.communication_information.explanation_of_condition, Some(v) if v <= 2),
        },
        SatisfactionRule {
            id: "COM-002",
            domain: "Communication",
            description: "Did not feel listened to (score 1-2)",
            severity: 3,
            evaluate: |d| matches!(d.communication_information.listened_to, Some(v) if v <= 2),
        },
        SatisfactionRule {
            id: "COM-003",
            domain: "Communication",
            description: "Insufficient opportunity to ask questions (score 1-2)",
            severity: 2,
            evaluate: |d| matches!(d.communication_information.opportunity_to_ask_questions, Some(v) if v <= 2),
        },
        SatisfactionRule {
            id: "COM-004",
            domain: "Communication",
            description: "Communication domain score below 50%",
            severity: 3,
            evaluate: |d| {
                let s = normalize_likert_scores(&[
                    d.communication_information.explanation_of_condition,
                    d.communication_information.explanation_of_treatment,
                    d.communication_information.opportunity_to_ask_questions,
                    d.communication_information.listened_to,
                    d.communication_information.informed_about_medication,
                    d.communication_information.written_information_quality,
                ]);
                matches!(s, Some(v) if v < 50.0)
            },
        },
        // ─── CLINICAL CARE QUALITY ────────────────────────────────
        SatisfactionRule {
            id: "CLN-001",
            domain: "Clinical Care",
            description: "Low confidence in clinician (score 1-2)",
            severity: 3,
            evaluate: |d| matches!(d.clinical_care_quality.confidence_in_clinician, Some(v) if v <= 2),
        },
        SatisfactionRule {
            id: "CLN-002",
            domain: "Clinical Care",
            description: "Poor pain management (score 1-2)",
            severity: 3,
            evaluate: |d| matches!(d.clinical_care_quality.pain_management, Some(v) if v <= 2),
        },
        SatisfactionRule {
            id: "CLN-003",
            domain: "Clinical Care",
            description: "Not involved in decisions (score 1-2)",
            severity: 2,
            evaluate: |d| matches!(d.clinical_care_quality.involvement_in_decisions, Some(v) if v <= 2),
        },
        SatisfactionRule {
            id: "CLN-004",
            domain: "Clinical Care",
            description: "Privacy concern during examination (score 1)",
            severity: 4,
            evaluate: |d| matches!(d.clinical_care_quality.privacy_during_examination, Some(1)),
        },
        SatisfactionRule {
            id: "CLN-005",
            domain: "Clinical Care",
            description: "Clinical care domain score below 50%",
            severity: 3,
            evaluate: |d| {
                let s = normalize_likert_scores(&[
                    d.clinical_care_quality.confidence_in_clinician,
                    d.clinical_care_quality.thoroughness_of_examination,
                    d.clinical_care_quality.pain_management,
                    d.clinical_care_quality.involvement_in_decisions,
                    d.clinical_care_quality.privacy_during_examination,
                    d.clinical_care_quality.coordination_of_care,
                ]);
                matches!(s, Some(v) if v < 50.0)
            },
        },
        // ─── STAFF ATTITUDE ───────────────────────────────────────
        SatisfactionRule {
            id: "STF-001",
            domain: "Staff",
            description: "Lack of respect for dignity (score 1-2)",
            severity: 3,
            evaluate: |d| matches!(d.staff_attitude.respect_for_dignity, Some(v) if v <= 2),
        },
        SatisfactionRule {
            id: "STF-002",
            domain: "Staff",
            description: "Cultural insensitivity concern (score 1-2)",
            severity: 3,
            evaluate: |d| matches!(d.staff_attitude.cultural_sensitivity, Some(v) if v <= 2),
        },
        SatisfactionRule {
            id: "STF-003",
            domain: "Staff",
            description: "Staff domain score below 50%",
            severity: 3,
            evaluate: |d| {
                let s = normalize_likert_scores(&[
                    d.staff_attitude.doctor_courtesy,
                    d.staff_attitude.nurse_courtesy,
                    d.staff_attitude.reception_courtesy,
                    d.staff_attitude.respect_for_dignity,
                    d.staff_attitude.cultural_sensitivity,
                    d.staff_attitude.emotional_support,
                ]);
                matches!(s, Some(v) if v < 50.0)
            },
        },
        // ─── ENVIRONMENT & FACILITIES ─────────────────────────────
        SatisfactionRule {
            id: "ENV-001",
            domain: "Environment",
            description: "Poor cleanliness (score 1-2)",
            severity: 3,
            evaluate: |d| matches!(d.environment_facilities.cleanliness, Some(v) if v <= 2),
        },
        SatisfactionRule {
            id: "ENV-002",
            domain: "Environment",
            description: "Environment domain score below 50%",
            severity: 2,
            evaluate: |d| {
                let s = normalize_likert_scores(&[
                    d.environment_facilities.cleanliness,
                    d.environment_facilities.comfort,
                    d.environment_facilities.noise_levels,
                    d.environment_facilities.food_quality,
                    d.environment_facilities.toilet_facilities,
                    d.environment_facilities.temperature_comfort,
                ]);
                matches!(s, Some(v) if v < 50.0)
            },
        },
        // ─── DISCHARGE & FOLLOW-UP ────────────────────────────────
        SatisfactionRule {
            id: "DIS-001",
            domain: "Discharge",
            description: "Did not know who to contact after discharge (score 1)",
            severity: 3,
            evaluate: |d| matches!(d.discharge_follow_up.knew_who_to_contact, Some(1)),
        },
        SatisfactionRule {
            id: "DIS-002",
            domain: "Discharge",
            description: "Poor discharge information (score 1-2)",
            severity: 2,
            evaluate: |d| matches!(d.discharge_follow_up.discharge_information, Some(v) if v <= 2),
        },
        SatisfactionRule {
            id: "DIS-003",
            domain: "Discharge",
            description: "Discharge domain score below 50%",
            severity: 3,
            evaluate: |d| {
                let s = normalize_likert_scores(&[
                    d.discharge_follow_up.discharge_information,
                    d.discharge_follow_up.medication_explanation,
                    d.discharge_follow_up.follow_up_arrangements,
                    d.discharge_follow_up.knew_who_to_contact,
                    d.discharge_follow_up.recovery_information,
                    d.discharge_follow_up.care_plan_clarity,
                ]);
                matches!(s, Some(v) if v < 50.0)
            },
        },
        // ─── OVERALL EXPERIENCE ───────────────────────────────────
        SatisfactionRule {
            id: "OVR-001",
            domain: "Overall",
            description: "Would not recommend service (score 1-2)",
            severity: 3,
            evaluate: |d| matches!(d.overall_experience.would_recommend, Some(v) if v <= 2),
        },
        SatisfactionRule {
            id: "OVR-002",
            domain: "Overall",
            description: "Did not feel safe (score 1-2)",
            severity: 4,
            evaluate: |d| matches!(d.overall_experience.felt_safe, Some(v) if v <= 2),
        },
        SatisfactionRule {
            id: "OVR-003",
            domain: "Overall",
            description: "Very low overall satisfaction (score 1)",
            severity: 4,
            evaluate: |d| matches!(d.overall_experience.overall_satisfaction, Some(1)),
        },
        SatisfactionRule {
            id: "OVR-004",
            domain: "Overall",
            description: "Very low NHS rating (1-3 out of 10)",
            severity: 3,
            evaluate: |d| matches!(d.overall_experience.nhs_rating, Some(v) if v <= 3),
        },
        // ─── COMMENTS ─────────────────────────────────────────────
        SatisfactionRule {
            id: "CMT-001",
            domain: "Comments",
            description: "Formal complaint raised",
            severity: 4,
            evaluate: |d| d.comments_suggestions.complaint_raised == "yes",
        },
    ]
}
