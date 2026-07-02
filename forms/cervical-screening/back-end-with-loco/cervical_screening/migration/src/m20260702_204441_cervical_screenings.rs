use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "cervical_screenings",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("care_setting", ColType::String),
            ("sample_taker_role", ColType::String),
            ("sample_taken_at", ColType::TimestampWithTimeZoneNull),
            ("patient_identifier", ColType::String),
            ("age", ColType::IntegerNull),
            ("recall_interval", ColType::String),
            ("screen_due_date", ColType::DateNull),
            ("last_screen_date", ColType::DateNull),
            ("overdue", ColType::String),
            ("previously_ceased", ColType::String),
            ("consent_given", ColType::String),
            ("symptomatic", ColType::String),
            ("symptom_detail", ColType::Text),
            ("sample_adequacy", ColType::String),
            ("inadequate_reason", ColType::String),
            ("hpv_result", ColType::String),
            ("cytology_grade", ColType::String),
            ("clinical_context", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "cervical_screenings").await
    }
}
