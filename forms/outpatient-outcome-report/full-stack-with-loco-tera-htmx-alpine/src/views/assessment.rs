use serde::{Deserialize, Serialize};
use tera::Context;
use uuid::Uuid;

/// Stub assessment record for listing.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AssessmentStub {
    pub id: String,
    pub patient_name: String,
    pub encounter_date: String,
    pub status: String,
    pub composite_grade: String,
}

/// In-memory stub data for listing.
pub fn stub_assessments() -> Vec<AssessmentStub> {
    vec![
        AssessmentStub {
            id: "00000000-0000-0000-0000-000000000001".to_string(),
            patient_name: "Alice Smith".to_string(),
            encounter_date: "2026-04-01".to_string(),
            status: "reviewed".to_string(),
            composite_grade: "B".to_string(),
        },
        AssessmentStub {
            id: "00000000-0000-0000-0000-000000000002".to_string(),
            patient_name: "Bob Jones".to_string(),
            encounter_date: "2026-04-10".to_string(),
            status: "submitted".to_string(),
            composite_grade: "C".to_string(),
        },
        AssessmentStub {
            id: "00000000-0000-0000-0000-000000000003".to_string(),
            patient_name: "Carol White".to_string(),
            encounter_date: "2026-04-20".to_string(),
            status: "draft".to_string(),
            composite_grade: "—".to_string(),
        },
    ]
}

/// Build the Tera context for the single-page assessment form.
pub fn build_assessment_context(id: Uuid) -> Context {
    let mut ctx = Context::new();
    ctx.insert("id", &id.to_string());
    ctx.insert("total_steps", &11usize);
    // Blank form data defaults
    ctx.insert("patient_name", &"");
    ctx.insert("date_of_birth", &"");
    ctx.insert("nhs_number", &"");
    ctx.insert("encounter_date", &"");
    ctx.insert("clinician_name", &"");
    ctx.insert("specialty", &"");
    ctx.insert("consultation_modality", &"");
    ctx.insert("wait_time_days", &"");
    ctx.insert("service_target_days", &"");
    ctx.insert("attendance_outcome_code", &"");
    ctx.insert("clinical_outcome", &"");
    // EQ-5D-5L defaults
    ctx.insert("eq5d_mobility_before", &"");
    ctx.insert("eq5d_self_care_before", &"");
    ctx.insert("eq5d_usual_activities_before", &"");
    ctx.insert("eq5d_pain_discomfort_before", &"");
    ctx.insert("eq5d_anxiety_depression_before", &"");
    ctx.insert("eq5d_vas_before", &"");
    ctx.insert("eq5d_mobility_after", &"");
    ctx.insert("eq5d_self_care_after", &"");
    ctx.insert("eq5d_usual_activities_after", &"");
    ctx.insert("eq5d_pain_discomfort_after", &"");
    ctx.insert("eq5d_anxiety_depression_after", &"");
    ctx.insert("eq5d_vas_after", &"");
    // GRC
    ctx.insert("grc_score", &"");
    // PROMIS
    ctx.insert("promis_gph", &"");
    ctx.insert("promis_gmh", &"");
    // FFT
    ctx.insert("fft_response", &"");
    ctx.insert("fft_comments", &"");
    // Follow-up
    ctx.insert("followup_plan", &"");
    ctx.insert("followup_date", &"");
    // Sign-off
    ctx.insert("signoff_clinician", &"");
    ctx.insert("signoff_date", &"");
    ctx
}

/// Grading result for the report.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GradingResult {
    pub composite_grade: String,
    pub clinical_grade: String,
    pub prom_grade: String,
    pub prem_grade: String,
    pub operational_grade: String,
    pub summary: String,
}

/// Build the Tera context for the outcome report (stub grading).
pub fn build_report_context(id: Uuid) -> Context {
    let mut ctx = Context::new();
    ctx.insert("id", &id.to_string());
    // Stub grading result
    let result = GradingResult {
        composite_grade: "B".to_string(),
        clinical_grade: "B".to_string(),
        prom_grade: "B".to_string(),
        prem_grade: "A".to_string(),
        operational_grade: "C".to_string(),
        summary: "Outcome improved; patient-reported measures indicate moderate improvement; \
                  operational target met within 10% tolerance."
            .to_string(),
    };
    ctx.insert("result", &result);
    ctx.insert("timestamp", &chrono::Utc::now().to_rfc3339());
    ctx
}
