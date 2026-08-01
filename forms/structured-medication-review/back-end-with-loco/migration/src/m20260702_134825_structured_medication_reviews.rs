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
            
            ("clinician_name", ColType::TextWithDefault(String::new())),
            ("clinician_role", ColType::StringWithDefault(String::new())),
            ("reviewed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::StringWithDefault(String::new())),
            ("consultation_mode", ColType::StringWithDefault(String::new())),
            ("patient_identifier", ColType::TextWithDefault(String::new())),
            ("age_band", ColType::StringWithDefault(String::new())),
            ("sex", ColType::StringWithDefault(String::new())),
            ("frailty_status", ColType::StringWithDefault(String::new())),
            ("lives_in_care_home", ColType::StringWithDefault(String::new())),
            ("long_term_conditions", ColType::TextWithDefault(String::new())),
            ("presenting_problems", ColType::TextWithDefault(String::new())),
            ("patient_reported_issues", ColType::TextWithDefault(String::new())),
            ("what_matters_to_patient", ColType::TextWithDefault(String::new())),
            ("shared_decisions", ColType::TextWithDefault(String::new())),
            ("monitoring_due", ColType::TextWithDefault(String::new())),
            ("overdue_monitoring_count", ColType::IntegerNull),
            ("follow_up_plan", ColType::TextWithDefault(String::new())),
            ("follow_up_date", ColType::DateNull),
            ("review_completed", ColType::StringWithDefault(String::new())),
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
