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
            
            ("care_setting", ColType::StringWithDefault(String::new())),
            ("sample_taker_role", ColType::StringWithDefault(String::new())),
            ("sample_taken_at", ColType::TimestampWithTimeZoneNull),
            ("patient_identifier", ColType::StringWithDefault(String::new())),
            ("age", ColType::IntegerNull),
            ("recall_interval", ColType::StringWithDefault(String::new())),
            ("screen_due_date", ColType::DateNull),
            ("last_screen_date", ColType::DateNull),
            ("overdue", ColType::StringWithDefault(String::new())),
            ("previously_ceased", ColType::StringWithDefault(String::new())),
            ("consent_given", ColType::StringWithDefault(String::new())),
            ("symptomatic", ColType::StringWithDefault(String::new())),
            ("symptom_detail", ColType::TextWithDefault(String::new())),
            ("sample_adequacy", ColType::StringWithDefault(String::new())),
            ("inadequate_reason", ColType::StringWithDefault(String::new())),
            ("hpv_result", ColType::StringWithDefault(String::new())),
            ("cytology_grade", ColType::StringWithDefault(String::new())),
            ("clinical_context", ColType::TextWithDefault(String::new())),
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
