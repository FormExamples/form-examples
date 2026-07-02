use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "structured_medication_reviews",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("clinician_name", ColType::Text),
            ("clinician_role", ColType::String),
            ("reviewed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::String),
            ("consultation_mode", ColType::String),
            ("patient_identifier", ColType::Text),
            ("age_band", ColType::String),
            ("sex", ColType::String),
            ("frailty_status", ColType::String),
            ("lives_in_care_home", ColType::String),
            ("long_term_conditions", ColType::Text),
            ("presenting_problems", ColType::Text),
            ("patient_reported_issues", ColType::Text),
            ("what_matters_to_patient", ColType::Text),
            ("shared_decisions", ColType::Text),
            ("monitoring_due", ColType::Text),
            ("overdue_monitoring_count", ColType::IntegerNull),
            ("follow_up_plan", ColType::Text),
            ("follow_up_date", ColType::DateNull),
            ("review_completed", ColType::String),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "structured_medication_reviews").await
    }
}
