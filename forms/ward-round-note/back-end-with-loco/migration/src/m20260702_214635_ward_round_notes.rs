use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "ward_round_notes",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("clinician_name", ColType::Text),
            ("clinician_grade", ColType::String),
            ("reviewed_at", ColType::TimestampWithTimeZoneNull),
            ("ward", ColType::Text),
            ("patient_identifier", ColType::String),
            ("admission_date", ColType::DateNull),
            ("primary_diagnosis", ColType::Text),
            ("overnight_events", ColType::Text),
            ("no_overnight_events", ColType::String),
            ("problem_list", ColType::Text),
            ("examination_summary", ColType::Text),
            ("news2_total", ColType::IntegerNull),
            ("news2_single_param_three", ColType::String),
            ("observation_trend", ColType::String),
            ("investigations_reviewed", ColType::Text),
            ("no_investigations_outstanding", ColType::String),
            ("abnormal_result_flagged", ColType::String),
            ("abnormal_result_actioned", ColType::String),
            ("vte_status", ColType::String),
            ("vte_prophylaxis_in_place", ColType::String),
            ("medication_changes", ColType::Text),
            ("no_medication_changes", ColType::String),
            ("plan_and_jobs", ColType::Text),
            ("escalation_status", ColType::String),
            ("senior_review_present", ColType::String),
            ("estimated_discharge_date", ColType::DateNull),
            ("discharge_not_estimable", ColType::String),
            ("clinical_note", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "ward_round_notes").await
    }
}
