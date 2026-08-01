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
            ("clinician_name", ColType::TextWithDefault(String::new())),
            ("clinician_grade", ColType::StringWithDefault(String::new())),
            ("reviewed_at", ColType::TimestampWithTimeZoneNull),
            ("ward", ColType::TextWithDefault(String::new())),
            ("patient_identifier", ColType::StringWithDefault(String::new())),
            ("admission_date", ColType::DateNull),
            ("primary_diagnosis", ColType::TextWithDefault(String::new())),
            ("overnight_events", ColType::TextWithDefault(String::new())),
            ("no_overnight_events", ColType::StringWithDefault(String::new())),
            ("problem_list", ColType::TextWithDefault(String::new())),
            ("examination_summary", ColType::TextWithDefault(String::new())),
            ("news2_total", ColType::IntegerNull),
            ("news2_single_param_three", ColType::StringWithDefault(String::new())),
            ("observation_trend", ColType::StringWithDefault(String::new())),
            ("investigations_reviewed", ColType::TextWithDefault(String::new())),
            ("no_investigations_outstanding", ColType::StringWithDefault(String::new())),
            ("abnormal_result_flagged", ColType::StringWithDefault(String::new())),
            ("abnormal_result_actioned", ColType::StringWithDefault(String::new())),
            ("vte_status", ColType::StringWithDefault(String::new())),
            ("vte_prophylaxis_in_place", ColType::StringWithDefault(String::new())),
            ("medication_changes", ColType::TextWithDefault(String::new())),
            ("no_medication_changes", ColType::StringWithDefault(String::new())),
            ("plan_and_jobs", ColType::TextWithDefault(String::new())),
            ("escalation_status", ColType::StringWithDefault(String::new())),
            ("senior_review_present", ColType::StringWithDefault(String::new())),
            ("estimated_discharge_date", ColType::DateNull),
            ("discharge_not_estimable", ColType::StringWithDefault(String::new())),
            ("clinical_note", ColType::TextWithDefault(String::new())),
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
